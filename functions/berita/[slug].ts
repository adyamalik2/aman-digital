import { marked } from "marked";
import {
  escapeHtml,
  getAffiliateItems,
  getApprovedComments,
  getArticleBySlug,
  getBreaking,
  getCategories,
  getRelated,
  getSettings,
  getTagsForArticle,
  hashVisitor,
  recordView,
  youtubeId,
  type Comment,
} from "../_lib/news";
import { renderAffiliateWidget, renderCard, renderShell } from "../_lib/newsRender";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const slug = String(context.params.slug || "");
  const [article, categories, breaking] = await Promise.all([getArticleBySlug(db, slug), getCategories(db), getBreaking(db, 8)]);

  if (!article) {
    const html = renderShell({
      title: "Artikel Tidak Ditemukan — AMAN News",
      description: "Artikel yang Anda cari tidak ditemukan.",
      body: `<section class="sect wrap" style="text-align:center;padding:100px 16px">
        <div style="font-size:2.5rem;margin-bottom:12px">🔍</div>
        <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 10px">Artikel tidak ditemukan</h1>
        <p style="color:#64748b;margin:0 0 24px">Mungkin sudah dihapus atau tautannya salah.</p>
        <a href="/berita" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:999px;font-weight:700">← Kembali ke Beranda</a>
      </section>`,
      categories,
      noindex: true,
    });
    return new Response(html, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  context.waitUntil((async () => {
    const hash = await hashVisitor(context.request);
    await recordView(db, article.id, hash);
  })());

  const [tags, related, comments, settings, affItems] = await Promise.all([
    getTagsForArticle(db, article.id),
    getRelated(db, article, 4, []),
    getApprovedComments(db, article.id),
    getSettings(db),
    getAffiliateItems(db, 4, article.category_id || undefined),
  ]);
  const contentHtml = await marked.parse(article.content || "");
  const ytId = youtubeId(article.video_url);

  const videoEmbed = ytId
    ? `<div style="position:relative;padding-bottom:56.25%;height:0;border-radius:14px;overflow:hidden;margin:24px 0"><iframe src="https://www.youtube-nocookie.com/embed/${ytId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe></div>`
    : "";

  const cover = !ytId && article.thumbnail
    ? `<img src="${article.thumbnail}" alt="${article.thumbnail_alt || article.title}" style="width:100%;max-height:460px;object-fit:cover;border-radius:16px;margin:20px 0">`
    : "";

  const tagsHtml = tags.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:28px">${tags.map((t) => `<a href="/berita/tag/${t.slug}" class="cat-badge" style="background:#f1f5f9;color:#475569">#${t.name}</a>`).join("")}</div>`
    : "";

  const url = new URL(context.request.url);
  const komentarStatus = url.searchParams.get("komentar");
  const komentarMsg =
    komentarStatus === "terkirim"
      ? `<div style="background:#ecfdf5;border:1px solid #6ee7b7;color:#047857;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:.88rem">✅ Komentar terkirim! Akan tampil setelah disetujui redaksi.</div>`
      : komentarStatus === "terlalu-sering"
      ? `<div style="background:#fef2f2;border:1px solid #fca5a5;color:#b91c1c;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:.88rem">⚠️ Terlalu banyak percobaan. Coba lagi beberapa menit lagi.</div>`
      : komentarStatus === "gagal"
      ? `<div style="background:#fef2f2;border:1px solid #fca5a5;color:#b91c1c;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:.88rem">⚠️ Nama dan isi komentar wajib diisi.</div>`
      : "";

  const renderComment = (c: Comment, replies: Comment[]): string => `
    <div style="padding:16px 0;border-bottom:1px solid #e2e8f0">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="width:32px;height:32px;border-radius:50%;background:#059669;color:#fff;display:grid;place-items:center;font-weight:700;font-size:.85rem">${escapeHtml(c.name.slice(0, 1).toUpperCase())}</span>
        <div>
          <div style="font-weight:700;font-size:.88rem;color:#0f172a">${escapeHtml(c.name)}</div>
          <div style="font-size:.72rem;color:#94a3b8">${c.created_at.slice(0, 10)}</div>
        </div>
      </div>
      <p style="margin:0 0 0 40px;color:#334155;font-size:.92rem;line-height:1.6;white-space:pre-wrap">${escapeHtml(c.content)}</p>
      ${replies.filter((r) => r.parent_id === c.id).map((r) => `<div style="margin-left:40px;margin-top:12px;padding-top:12px;border-top:1px dashed #e2e8f0">${renderComment(r, [])}</div>`).join("")}
    </div>`;

  const topLevel = comments.filter((c) => !c.parent_id);
  const commentsHtml = topLevel.length ? topLevel.map((c) => renderComment(c, comments)).join("") : `<p style="color:#94a3b8;font-size:.9rem">Belum ada komentar. Jadilah yang pertama!</p>`;

  const commentSection = `
  <section class="sect" style="padding-top:0">
    <div class="wrap" style="max-width:800px">
      ${`<h2 class="sect-title"><span class="bar"></span>Komentar (${comments.length})</h2>`}
      ${komentarMsg}
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:24px">
        <form method="POST" action="/berita/komentar">
          <input type="hidden" name="article_id" value="${article.id}">
          <input type="hidden" name="slug" value="${escapeHtml(article.slug)}">
          <div style="position:absolute;left:-9999px" aria-hidden="true">
            <label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
          </div>
          <div style="display:grid;gap:10px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
            <input type="text" name="name" placeholder="Nama Anda" required maxlength="80" style="min-width:0;padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;font:inherit">
            <input type="email" name="email" placeholder="Email (opsional, tidak ditampilkan)" maxlength="191" style="min-width:0;padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;font:inherit">
          </div>
          <textarea name="content" placeholder="Tulis komentar…" required maxlength="2000" rows="3" style="width:100%;margin-top:10px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;font:inherit;resize:vertical"></textarea>
          <button type="submit" style="margin-top:10px;background:#059669;color:#fff;border:0;padding:10px 22px;border-radius:999px;font-weight:700;font-size:.88rem;cursor:pointer">Kirim Komentar</button>
        </form>
      </div>
      ${commentsHtml}
    </div>
  </section>`;

  const body = `
  <article class="sect wrap" style="max-width:800px">
    <a href="/berita" style="color:#94a3b8;font-size:.85rem;font-weight:600">← Kembali ke Blog</a>
    ${article.category_name ? `<div style="margin-top:16px"><a href="/berita/kategori/${article.category_slug}" class="cat-badge" style="background:${article.category_color}22;color:${article.category_color}">${article.category_name}</a></div>` : ""}
    <h1 style="font-size:2rem;font-weight:900;line-height:1.3;margin:14px 0 12px">${article.title}</h1>
    <div style="color:#94a3b8;font-size:.85rem;display:flex;gap:14px;flex-wrap:wrap">
      ${article.author_name ? `<span>✍️ <a href="/berita/penulis/${article.author_slug}" style="color:#475569;font-weight:600">${article.author_name}</a></span>` : ""}
      <span>📅 ${article.published_at ? article.published_at.slice(0, 10) : ""}</span>
      <span>⏱️ ${article.reading_minutes} menit baca</span>
      <span>👁️ ${article.view_count} views</span>
    </div>
    ${videoEmbed}
    ${cover}
    <div class="article-content">${contentHtml}</div>
    ${tagsHtml}
  </article>
  ${affItems.length ? `<section class="sect" style="padding-top:0"><div class="wrap" style="max-width:800px">${renderAffiliateWidget(affItems, settings.affiliate_title || "Belanja Pilihan", settings.affiliate_disclosure || "")}</div></section>` : ""}
  ${commentSection}
  ${related.length ? `<section class="sect"><div class="wrap" style="max-width:800px">${`<h2 class="sect-title"><span class="bar"></span>Berita Terkait</h2>`}<div class="grid">${related.map(renderCard).join("")}</div></div></section>` : ""}
  <style>
    .article-content { font-size: 1.05rem; line-height: 1.8; color: #1e293b; }
    .article-content h1, .article-content h2, .article-content h3 { font-weight: 800; color: #0f172a; margin: 1.6em 0 .6em; }
    .article-content p { margin: 0 0 1.2em; }
    .article-content a { color: #059669; text-decoration: underline; }
    .article-content img { max-width: 100%; border-radius: 12px; margin: 1.2em 0; }
    .article-content ul, .article-content ol { margin: 0 0 1.2em; padding-left: 1.4em; }
    .article-content blockquote { border-left: 4px solid #10b981; margin: 1.4em 0; padding: .4em 1.2em; color: #475569; background: #f0fdf4; border-radius: 0 10px 10px 0; }
    .article-content code { background: #f1f5f9; padding: .15em .4em; border-radius: 5px; font-size: .9em; }
    .article-content pre { background: #0f172a; color: #e2e8f0; padding: 1.1em; border-radius: 12px; overflow-x: auto; }
  </style>`;

  const html = renderShell({
    title: `${article.meta_title || article.title} — AMAN News`,
    description: article.meta_description || article.excerpt || article.title,
    body,
    categories,
    activeCategory: article.category_slug,
    breaking,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
