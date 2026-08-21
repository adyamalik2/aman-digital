import { marked } from "marked";
import { escapeHtml, formatDateID, type Article } from "../_lib/blog";
import { renderPage } from "../_lib/blogRender";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const slug = String(context.params.slug || "");
  const article = await context.env.DB.prepare(
    "SELECT * FROM articles WHERE slug = ? AND status = 'published'"
  )
    .bind(slug)
    .first<Article>();

  if (!article) {
    const html = renderPage({
      title: "Artikel Tidak Ditemukan — AMAN Digital",
      description: "Artikel yang Anda cari tidak ditemukan.",
      noindex: true,
      body: `<section class="wrap" style="padding:100px 16px;text-align:center">
        <div style="font-size:2.5rem;margin-bottom:12px">🔍</div>
        <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 10px">Artikel tidak ditemukan</h1>
        <p style="color:#64748b;margin:0 0 24px">Mungkin sudah dihapus atau tautannya salah.</p>
        <a href="/blog" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700">← Kembali ke Blog</a>
      </section>`,
    });
    return new Response(html, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  const contentHtml = await marked.parse(article.content || "");

  const cover = article.cover_image
    ? `<img src="${escapeHtml(article.cover_image)}" alt="${escapeHtml(article.title)}" style="width:100%;max-height:420px;object-fit:cover;border-radius:16px;margin-bottom:32px">`
    : "";

  const body = `
  <section style="background:#070B14;color:#fff;padding:60px 16px 44px">
    <div class="wrap" style="max-width:760px">
      <a href="/blog" style="color:#94a3b8;text-decoration:none;font-size:.85rem;font-weight:600">← Kembali ke Blog</a>
      <span style="display:inline-block;margin-top:18px;background:rgba(16,185,129,.15);color:#6ee7b7;padding:5px 14px;border-radius:999px;font-size:.78rem;font-weight:700">${escapeHtml(article.category)}</span>
      <h1 style="margin:16px 0 12px;font-size:2.1rem;font-weight:900;line-height:1.3">${escapeHtml(article.title)}</h1>
      <div style="color:#94a3b8;font-size:.88rem">📅 ${formatDateID(article.published_at)}</div>
    </div>
  </section>
  <article class="wrap" style="max-width:760px;padding:40px 16px 80px">
    ${cover}
    <div class="article-content">${contentHtml}</div>
  </article>
  <style>
    .article-content { font-size: 1.05rem; line-height: 1.8; color: #1e293b; }
    .article-content h1, .article-content h2, .article-content h3 { font-weight: 800; color: #0f172a; margin: 1.6em 0 .6em; }
    .article-content h1 { font-size: 1.6rem; } .article-content h2 { font-size: 1.4rem; } .article-content h3 { font-size: 1.2rem; }
    .article-content p { margin: 0 0 1.2em; }
    .article-content a { color: #059669; text-decoration: underline; }
    .article-content img { max-width: 100%; border-radius: 12px; margin: 1.2em 0; }
    .article-content ul, .article-content ol { margin: 0 0 1.2em; padding-left: 1.4em; }
    .article-content li { margin-bottom: .4em; }
    .article-content blockquote { border-left: 4px solid #10b981; margin: 1.4em 0; padding: .4em 1.2em; color: #475569; background: #f0fdf4; border-radius: 0 10px 10px 0; }
    .article-content code { background: #f1f5f9; padding: .15em .4em; border-radius: 5px; font-size: .9em; }
    .article-content pre { background: #0f172a; color: #e2e8f0; padding: 1.1em; border-radius: 12px; overflow-x: auto; }
    .article-content pre code { background: none; padding: 0; }
  </style>`;

  const html = renderPage({
    title: `${article.title} — AMAN Digital`,
    description: article.excerpt || article.title,
    body,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
