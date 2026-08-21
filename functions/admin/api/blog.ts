/**
 * /admin/api/blog — CRUD artikel blog (disimpan di D1). Digerbangi oleh
 * functions/admin/api/_middleware.ts (sesi admin wajib).
 */
import { ensureUniqueSlug, slugify, type Article } from "../../_lib/blog";

interface Env {
  DB: D1Database;
}

const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const jsonOk = (data: unknown) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const article = await context.env.DB.prepare("SELECT * FROM articles WHERE id = ?").bind(id).first<Article>();
    if (!article) return jsonError(404, "Artikel tidak ditemukan.");
    return jsonOk({ article });
  }

  const { results } = await context.env.DB.prepare(
    "SELECT id, slug, title, excerpt, cover_image, category, status, published_at, created_at, updated_at FROM articles ORDER BY updated_at DESC"
  ).all<Article>();
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
  const action = String(body.action || "");

  if (action === "delete") {
    const id = Number(body.id);
    if (!id) return jsonError(400, "ID tidak valid.");
    await db.prepare("DELETE FROM articles WHERE id = ?").bind(id).run();
    return jsonOk({ ok: true });
  }

  if (action === "save") {
    const title = String(body.title || "").trim();
    if (!title) return jsonError(400, "Judul wajib diisi.");
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "");
    const coverImage = String(body.cover_image || "").trim();
    const category = String(body.category || "Umum").trim() || "Umum";
    const status = body.status === "published" ? "published" : "draft";
    const now = new Date().toISOString();
    const id = body.id ? Number(body.id) : null;

    let slugInput = String(body.slug || "").trim();
    if (!slugInput) slugInput = slugify(title);
    else slugInput = slugify(slugInput);
    const slug = await ensureUniqueSlug(db, slugInput || "artikel", id || undefined);

    if (id) {
      const existing = await db.prepare("SELECT published_at, status FROM articles WHERE id = ?").bind(id).first<{ published_at: string | null; status: string }>();
      if (!existing) return jsonError(404, "Artikel tidak ditemukan.");
      const publishedAt = status === "published" ? (existing.published_at || now) : existing.published_at;
      await db
        .prepare(
          "UPDATE articles SET slug=?, title=?, excerpt=?, content=?, cover_image=?, category=?, status=?, published_at=?, updated_at=? WHERE id=?"
        )
        .bind(slug, title, excerpt, content, coverImage, category, status, publishedAt, now, id)
        .run();
      return jsonOk({ ok: true, id, slug });
    } else {
      const publishedAt = status === "published" ? now : null;
      const res = await db
        .prepare(
          "INSERT INTO articles (slug, title, excerpt, content, cover_image, category, status, published_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
        )
        .bind(slug, title, excerpt, content, coverImage, category, status, publishedAt, now, now)
        .run();
      return jsonOk({ ok: true, id: res.meta.last_row_id, slug });
    }
  }

  return jsonError(400, "Aksi tidak dikenal.");
};
