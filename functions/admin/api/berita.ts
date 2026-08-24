/**
 * /admin/api/berita — CRUD portal berita (artikel, kategori, penulis, tag,
 * pengaturan). Digerbangi oleh functions/admin/api/_middleware.ts.
 */
import { ensureUniqueSlug, readingMinutes, slugify } from "../../_lib/news";
import { parseAffiliateBulk } from "../../_lib/affiliateImport";
import { fetchRemoteImage } from "../../_lib/mediaFetch";

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
}

const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const jsonOk = (data: unknown) =>
  new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });

async function upsertTags(db: D1Database, articleId: number, tagNames: string[]): Promise<void> {
  await db.prepare("DELETE FROM article_tag WHERE article_id = ?").bind(articleId).run();
  for (const raw of tagNames) {
    const name = raw.trim();
    if (!name) continue;
    const slug = slugify(name);
    if (!slug) continue;
    let tag = await db.prepare("SELECT id FROM tags WHERE slug = ?").bind(slug).first<{ id: number }>();
    if (!tag) {
      const res = await db.prepare("INSERT INTO tags (slug, name, created_at) VALUES (?,?,?)").bind(slug, name, new Date().toISOString()).run();
      tag = { id: Number(res.meta.last_row_id) };
    }
    await db.prepare("INSERT OR IGNORE INTO article_tag (article_id, tag_id) VALUES (?,?)").bind(articleId, tag.id).run();
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const resource = url.searchParams.get("resource") || "articles";
  const db = context.env.DB;

  if (resource === "categories") {
    const { results } = await db.prepare("SELECT * FROM categories ORDER BY sort_order").all();
    return jsonOk({ categories: results });
  }

  if (resource === "authors") {
    const { results } = await db.prepare("SELECT * FROM authors ORDER BY name").all();
    return jsonOk({ authors: results });
  }

  if (resource === "settings") {
    const { results } = await db.prepare("SELECT skey, svalue FROM settings").all<{ skey: string; svalue: string }>();
    const settings: Record<string, string> = {};
    for (const r of results || []) settings[r.skey] = r.svalue ?? "";
    return jsonOk({ settings });
  }

  if (resource === "comments") {
    const status = url.searchParams.get("status") || "pending";
    const { results } = await db
      .prepare(
        `SELECT c.*, a.title AS article_title, a.slug AS article_slug FROM comments c
         JOIN articles a ON a.id = c.article_id WHERE c.status = ? ORDER BY c.created_at DESC LIMIT 100`
      )
      .bind(status)
      .all();
    return jsonOk({ comments: results });
  }

  if (resource === "affiliate") {
    const { results } = await db
      .prepare(
        `SELECT ai.*, c.name AS category_name FROM affiliate_items ai
         LEFT JOIN categories c ON c.id = ai.category_id ORDER BY ai.sort_order ASC, ai.id DESC`
      )
      .all();
    return jsonOk({ items: results });
  }

  // resource === "articles"
  const id = url.searchParams.get("id");
  if (id) {
    const article = await db.prepare("SELECT * FROM articles WHERE id = ?").bind(id).first();
    if (!article) return jsonError(404, "Artikel tidak ditemukan.");
    const { results: tags } = await db
      .prepare("SELECT t.name FROM tags t JOIN article_tag at ON at.tag_id = t.id WHERE at.article_id = ?")
      .bind(id)
      .all<{ name: string }>();
    return jsonOk({ article: { ...article, tags: (tags || []).map((t) => t.name) } });
  }

  const { results } = await db
    .prepare(
      `SELECT a.id, a.slug, a.title, a.status, a.published_at, a.updated_at, a.is_breaking, a.is_headline, a.is_slider, a.pinned_order,
              c.name AS category_name, au.name AS author_name
       FROM articles a LEFT JOIN categories c ON c.id=a.category_id LEFT JOIN authors au ON au.id=a.author_id
       ORDER BY a.updated_at DESC`
    )
    .all();
  return jsonOk({ articles: results });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: Record<string, unknown>;
  try {
    body = await context.request.json();
  } catch {
    return jsonError(400, "Format permintaan tidak valid.");
  }

  const db = context.env.DB;
  const resource = String(body.resource || "articles");
  const action = String(body.action || "");
  const now = new Date().toISOString();

  // ── Kategori ──
  if (resource === "categories") {
    if (action === "delete") {
      await db.prepare("DELETE FROM categories WHERE id = ?").bind(Number(body.id)).run();
      return jsonOk({ ok: true });
    }
    if (action === "save") {
      const name = String(body.name || "").trim();
      if (!name) return jsonError(400, "Nama kategori wajib diisi.");
      const id = body.id ? Number(body.id) : null;
      const slug = await ensureUniqueSlug(db, "categories", slugify(String(body.slug || name)), id || undefined);
      const description = String(body.description || "");
      const color = String(body.color || "#059669");
      const sortOrder = Number(body.sort_order || 0);
      if (id) {
        await db.prepare("UPDATE categories SET slug=?, name=?, description=?, color=?, sort_order=? WHERE id=?").bind(slug, name, description, color, sortOrder, id).run();
        return jsonOk({ ok: true, id });
      }
      const res = await db.prepare("INSERT INTO categories (slug, name, description, color, sort_order, created_at) VALUES (?,?,?,?,?,?)").bind(slug, name, description, color, sortOrder, now).run();
      return jsonOk({ ok: true, id: res.meta.last_row_id });
    }
    return jsonError(400, "Aksi tidak dikenal.");
  }

  // ── Penulis ──
  if (resource === "authors") {
    if (action === "delete") {
      await db.prepare("DELETE FROM authors WHERE id = ?").bind(Number(body.id)).run();
      return jsonOk({ ok: true });
    }
    if (action === "save") {
      const name = String(body.name || "").trim();
      if (!name) return jsonError(400, "Nama penulis wajib diisi.");
      const id = body.id ? Number(body.id) : null;
      const realSlug = await (async () => {
        let base = slugify(String(body.slug || name)) || "penulis";
        let n = 1;
        for (;;) {
          const row = id
            ? await db.prepare("SELECT id FROM authors WHERE slug = ? AND id != ?").bind(base, id).first()
            : await db.prepare("SELECT id FROM authors WHERE slug = ?").bind(base).first();
          if (!row) return base;
          n++;
          base = `${slugify(String(body.slug || name))}-${n}`;
        }
      })();
      const email = String(body.email || "");
      const role = String(body.role || "author");
      const bio = String(body.bio || "");
      if (id) {
        await db.prepare("UPDATE authors SET slug=?, name=?, email=?, role=?, bio=?, updated_at=? WHERE id=?").bind(realSlug, name, email, role, bio, now, id).run();
        return jsonOk({ ok: true, id });
      }
      const res = await db.prepare("INSERT INTO authors (slug, name, email, role, bio, is_active, created_at, updated_at) VALUES (?,?,?,?,?,1,?,?)").bind(realSlug, name, email, role, bio, now, now).run();
      return jsonOk({ ok: true, id: res.meta.last_row_id });
    }
    return jsonError(400, "Aksi tidak dikenal.");
  }

  // ── Komentar ──
  if (resource === "comments") {
    if (action === "bulk") {
      const ids = (Array.isArray(body.ids) ? body.ids : []).map(Number).filter((n) => n > 0).slice(0, 500);
      const verb = String(body.verb || "");
      if (!ids.length) return jsonError(400, "Tidak ada komentar yang dipilih.");
      const ph = ids.map(() => "?").join(",");
      if (verb === "delete") {
        await db.prepare(`DELETE FROM comments WHERE id IN (${ph})`).bind(...ids).run();
        return jsonOk({ ok: true, count: ids.length });
      }
      if (verb === "approve" || verb === "spam" || verb === "pending") {
        const status = verb === "approve" ? "approved" : verb;
        await db.prepare(`UPDATE comments SET status = ? WHERE id IN (${ph})`).bind(status, ...ids).run();
        return jsonOk({ ok: true, count: ids.length });
      }
      return jsonError(400, "Aksi massal tidak dikenal.");
    }
    const id = Number(body.id);
    if (!id) return jsonError(400, "ID tidak valid.");
    if (action === "delete") {
      await db.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
      return jsonOk({ ok: true });
    }
    if (action === "approve" || action === "spam" || action === "pending") {
      const status = action === "approve" ? "approved" : action;
      await db.prepare("UPDATE comments SET status = ? WHERE id = ?").bind(status, id).run();
      return jsonOk({ ok: true });
    }
    return jsonError(400, "Aksi tidak dikenal.");
  }

  // ── Produk afiliasi ──
  if (resource === "affiliate") {
    if (action === "delete") {
      await db.prepare("DELETE FROM affiliate_items WHERE id = ?").bind(Number(body.id)).run();
      return jsonOk({ ok: true });
    }

    // Aksi massal atas produk yang dicentang di tabel.
    if (action === "bulk") {
      const ids = (Array.isArray(body.ids) ? body.ids : []).map(Number).filter((n) => n > 0).slice(0, 500);
      const verb = String(body.verb || "");
      if (!ids.length) return jsonError(400, "Tidak ada produk yang dipilih.");
      const ph = ids.map(() => "?").join(",");
      if (verb === "delete") {
        await db.prepare(`DELETE FROM affiliate_items WHERE id IN (${ph})`).bind(...ids).run();
        return jsonOk({ ok: true, count: ids.length });
      }
      if (verb === "activate" || verb === "deactivate") {
        await db.prepare(`UPDATE affiliate_items SET is_active = ?, updated_at = ? WHERE id IN (${ph})`).bind(verb === "activate" ? 1 : 0, now, ...ids).run();
        return jsonOk({ ok: true, count: ids.length });
      }
      return jsonError(400, "Aksi massal tidak dikenal.");
    }

    // Impor massal, dua langkah: pratinjau dulu (tidak menulis DB), baru simpan.
    if (action === "import-preview" || action === "import-save") {
      const raw = String(body.bulk || "");
      const rows = parseAffiliateBulk(raw);
      if (!rows.length) return jsonError(400, "Tidak ada baris produk yang bisa dibaca. Periksa lagi tempelannya.");

      if (action === "import-preview") {
        return jsonOk({ rows });
      }

      const withPrice = !!body.with_price;
      let ok = 0;
      let gagal = 0;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (r.error) { gagal++; continue; }
        const res = await db
          .prepare(
            "INSERT INTO affiliate_items (title, url, image, price_text, merchant, note, category_id, sort_order, is_active, click_count, created_at, updated_at) VALUES (?,?,?,?,?,'',NULL,?,1,0,?,?)"
          )
          .bind(r.title, r.url, r.image ? r.image.slice(0, 250) : "", withPrice && r.price ? r.price.slice(0, 55) : "", r.merchant || "Shopee", i, now, now)
          .run();
        if (res.success) ok++; else gagal++;
      }
      return jsonOk({ ok: true, imported: ok, skipped: gagal });
    }

    // Tarik gambar produk yang masih menumpang di CDN toko luar ke Media Library sendiri.
    if (action === "pull-remote-images") {
      const { results } = await db
        .prepare("SELECT id, title, image FROM affiliate_items WHERE image LIKE 'http%' ORDER BY id ASC LIMIT 50")
        .all<{ id: number; title: string; image: string }>();
      const rows = results || [];
      let moved = 0;
      const failed: string[] = [];
      for (const r of rows) {
        const res = await fetchRemoteImage(context.env.MEDIA, r.image);
        if (res.ok) {
          await db.prepare("UPDATE affiliate_items SET image=?, updated_at=? WHERE id=?").bind(res.url, now, r.id).run();
          moved++;
        } else {
          failed.push(`${r.title.slice(0, 28)}: ${res.error}`);
        }
      }
      return jsonOk({ ok: true, moved, total: rows.length, failed });
    }

    // Hapus SEMUA produk afiliasi -- butuh ketik ulang teks konfirmasi, bukan cuma window.confirm.
    if (action === "delete-all") {
      if (String(body.confirm || "") !== "HAPUS SEMUA") {
        return jsonError(400, "Teks konfirmasi tidak cocok. Ketik persis HAPUS SEMUA.");
      }
      const countRow = await db.prepare("SELECT COUNT(*) AS n FROM affiliate_items").first<{ n: number }>();
      await db.prepare("DELETE FROM affiliate_items").run();
      return jsonOk({ ok: true, count: countRow?.n || 0 });
    }

    if (action === "save") {
      const title = String(body.title || "").trim();
      const itemUrl = String(body.url || "").trim();
      if (!title) return jsonError(400, "Nama produk wajib diisi.");
      if (!/^https?:\/\//i.test(itemUrl)) return jsonError(400, "Tautan produk harus diawali http:// atau https://.");
      const id = body.id ? Number(body.id) : null;
      const image = String(body.image || "");
      const priceText = String(body.price_text || "");
      const merchant = String(body.merchant || "");
      const note = String(body.note || "");
      const categoryId = body.category_id ? Number(body.category_id) : null;
      const sortOrder = Number(body.sort_order || 0);
      const isActive = body.is_active === false ? 0 : 1;
      if (id) {
        await db
          .prepare(
            "UPDATE affiliate_items SET title=?, url=?, image=?, price_text=?, merchant=?, note=?, category_id=?, sort_order=?, is_active=?, updated_at=? WHERE id=?"
          )
          .bind(title, itemUrl, image, priceText, merchant, note, categoryId, sortOrder, isActive, now, id)
          .run();
        return jsonOk({ ok: true, id });
      }
      const res = await db
        .prepare(
          "INSERT INTO affiliate_items (title, url, image, price_text, merchant, note, category_id, sort_order, is_active, click_count, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,0,?,?)"
        )
        .bind(title, itemUrl, image, priceText, merchant, note, categoryId, sortOrder, isActive, now, now)
        .run();
      return jsonOk({ ok: true, id: res.meta.last_row_id });
    }
    return jsonError(400, "Aksi tidak dikenal.");
  }

  // ── Pengaturan ──
  if (resource === "settings") {
    const values = (body.values || {}) as Record<string, string>;
    for (const [k, v] of Object.entries(values)) {
      await db.prepare("INSERT INTO settings (skey, svalue) VALUES (?,?) ON CONFLICT(skey) DO UPDATE SET svalue=excluded.svalue").bind(k, String(v)).run();
    }
    return jsonOk({ ok: true });
  }

  // ── Artikel ──
  if (action === "bulk") {
    const ids = (Array.isArray(body.ids) ? body.ids : []).map(Number).filter((n) => n > 0).slice(0, 500);
    const verb = String(body.verb || "");
    if (!ids.length) return jsonError(400, "Tidak ada artikel yang dipilih.");
    const ph = ids.map(() => "?").join(",");
    if (verb === "delete") {
      await db.prepare(`DELETE FROM articles WHERE id IN (${ph})`).bind(...ids).run();
      return jsonOk({ ok: true, count: ids.length });
    }
    if (verb === "draft" || verb === "archived") {
      await db.prepare(`UPDATE articles SET status = ?, updated_at = ? WHERE id IN (${ph})`).bind(verb, now, ...ids).run();
      return jsonOk({ ok: true, count: ids.length });
    }
    if (verb === "published") {
      // "Terbitkan sekarang" berarti live MULAI SEKARANG: timpa published_at
      // kalau kosong atau masih di masa depan (artikel yang tadinya
      // 'scheduled'). Tanggal lama yang sudah lewat TETAP dipertahankan
      // (mis. artikel arsip yang diterbitkan ulang).
      await db
        .prepare(
          `UPDATE articles SET status = 'published',
           published_at = CASE WHEN published_at IS NULL OR published_at > ? THEN ? ELSE published_at END,
           updated_at = ? WHERE id IN (${ph})`
        )
        .bind(now, now, now, ...ids)
        .run();
      return jsonOk({ ok: true, count: ids.length });
    }
    return jsonError(400, "Aksi massal tidak dikenal.");
  }

  // ── Sematkan ke beranda (kurasi manual, lepas dari tanggal terbit) ──
  if (action === "pin") {
    const id = Number(body.id);
    if (!id) return jsonError(400, "ID artikel tidak valid.");
    const row = await db
      .prepare("SELECT COALESCE(MAX(pinned_order), 0) AS maxOrder FROM articles WHERE pinned_order IS NOT NULL")
      .first<{ maxOrder: number }>();
    const next = (row?.maxOrder || 0) + 1;
    await db.prepare("UPDATE articles SET pinned_order = ? WHERE id = ?").bind(next, id).run();
    return jsonOk({ ok: true, pinned_order: next });
  }

  if (action === "unpin") {
    const id = Number(body.id);
    if (!id) return jsonError(400, "ID artikel tidak valid.");
    await db.prepare("UPDATE articles SET pinned_order = NULL WHERE id = ?").bind(id).run();
    // Rapikan celah nomor urut supaya sisanya tetap 1..N berurutan.
    const { results } = await db
      .prepare("SELECT id FROM articles WHERE pinned_order IS NOT NULL ORDER BY pinned_order ASC")
      .all<{ id: number }>();
    const stmts = (results || []).map((r, i) => db.prepare("UPDATE articles SET pinned_order = ? WHERE id = ?").bind(i + 1, r.id));
    if (stmts.length) await db.batch(stmts);
    return jsonOk({ ok: true });
  }

  if (action === "reorder_pins") {
    const ids = (Array.isArray(body.ids) ? body.ids : []).map(Number).filter((n) => n > 0);
    if (!ids.length) return jsonError(400, "Tidak ada urutan yang dikirim.");
    const stmts = ids.map((id, i) => db.prepare("UPDATE articles SET pinned_order = ? WHERE id = ?").bind(i + 1, id));
    await db.batch(stmts);
    return jsonOk({ ok: true });
  }

  if (action === "delete") {
    await db.prepare("DELETE FROM articles WHERE id = ?").bind(Number(body.id)).run();
    return jsonOk({ ok: true });
  }

  if (action === "save") {
    const title = String(body.title || "").trim();
    if (!title) return jsonError(400, "Judul wajib diisi.");
    const content = String(body.content || "");
    const excerpt = String(body.excerpt || "");
    const thumbnail = String(body.thumbnail || "");
    const thumbnailAlt = String(body.thumbnail_alt || "");
    const categoryId = body.category_id ? Number(body.category_id) : null;
    const authorId = body.author_id ? Number(body.author_id) : null;
    const status = ["draft", "scheduled", "published", "archived"].includes(String(body.status)) ? String(body.status) : "draft";
    const isBreaking = body.is_breaking ? 1 : 0;
    const isHeadline = body.is_headline ? 1 : 0;
    const isSlider = body.is_slider ? 1 : 0;
    const videoUrl = String(body.video_url || "");
    const metaTitle = String(body.meta_title || "");
    const metaDescription = String(body.meta_description || "");
    const minutes = readingMinutes(content);
    const id = body.id ? Number(body.id) : null;

    let scheduledIso: string | null = null;
    if (status === "scheduled") {
      const raw = String(body.scheduled_at || "").trim();
      if (!raw) return jsonError(400, "Tanggal & jam jadwal terbit wajib diisi.");
      const d = new Date(raw);
      if (isNaN(d.getTime())) return jsonError(400, "Tanggal & jam jadwal terbit tidak valid.");
      scheduledIso = d.toISOString();
    }

    let slugInput = String(body.slug || "").trim();
    slugInput = slugify(slugInput || title);
    const slug = await ensureUniqueSlug(db, "articles", slugInput || "artikel", id || undefined);

    let articleId: number;
    if (id) {
      const existing = await db.prepare("SELECT published_at FROM articles WHERE id = ?").bind(id).first<{ published_at: string | null }>();
      if (!existing) return jsonError(404, "Artikel tidak ditemukan.");
      // "Terbitkan sekarang" menimpa published_at kalau kosong atau masih di
      // masa depan (artikel yang tadinya 'scheduled'); tanggal lama yang
      // sudah lewat tetap dipertahankan (artikel arsip yang diterbitkan ulang).
      const publishedAt =
        status === "published" ? (!existing.published_at || existing.published_at > now ? now : existing.published_at)
        : status === "scheduled" ? scheduledIso
        : existing.published_at;
      await db
        .prepare(
          `UPDATE articles SET slug=?, title=?, excerpt=?, content=?, thumbnail=?, thumbnail_alt=?, category_id=?, author_id=?, status=?, published_at=?,
           is_breaking=?, is_headline=?, is_slider=?, video_url=?, meta_title=?, meta_description=?, reading_minutes=?, updated_at=? WHERE id=?`
        )
        .bind(slug, title, excerpt, content, thumbnail, thumbnailAlt, categoryId, authorId, status, publishedAt, isBreaking, isHeadline, isSlider, videoUrl, metaTitle, metaDescription, minutes, now, id)
        .run();
      articleId = id;
    } else {
      const publishedAt = status === "published" ? now : status === "scheduled" ? scheduledIso : null;
      const res = await db
        .prepare(
          `INSERT INTO articles (slug, title, excerpt, content, thumbnail, thumbnail_alt, category_id, author_id, status, published_at,
           is_breaking, is_headline, is_slider, video_url, meta_title, meta_description, reading_minutes, view_count, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,?)`
        )
        .bind(slug, title, excerpt, content, thumbnail, thumbnailAlt, categoryId, authorId, status, publishedAt, isBreaking, isHeadline, isSlider, videoUrl, metaTitle, metaDescription, minutes, now, now)
        .run();
      articleId = Number(res.meta.last_row_id);
    }

    const tagNames = Array.isArray(body.tags) ? (body.tags as string[]) : String(body.tags || "").split(",");
    await upsertTags(db, articleId, tagNames);

    return jsonOk({ ok: true, id: articleId, slug });
  }

  return jsonError(400, "Aksi tidak dikenal.");
};
