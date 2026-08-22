import { marked } from "marked";
import { getBreaking, getCategories } from "../../_lib/news";
import { renderShell } from "../../_lib/newsRender";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const slug = String(context.params.slug || "");

  const [page, categories, breaking] = await Promise.all([
    db.prepare("SELECT * FROM pages WHERE slug = ?").bind(slug).first<{ title: string; content: string; meta_description: string }>(),
    getCategories(db),
    getBreaking(db, 8),
  ]);

  if (!page) {
    return new Response("Halaman tidak ditemukan.", { status: 404 });
  }

  const contentHtml = await marked.parse(page.content || "");
  const body = `<section class="sect wrap" style="max-width:760px">
    <h1 style="font-size:1.8rem;font-weight:900;margin:0 0 20px">${page.title}</h1>
    <div class="article-content">${contentHtml}</div>
  </section>
  <style>
    .article-content { font-size: 1rem; line-height: 1.8; color: #1e293b; }
    .article-content h1, .article-content h2 { font-weight: 800; margin: 1.4em 0 .5em; }
    .article-content p { margin: 0 0 1.1em; }
  </style>`;

  const html = renderShell({
    title: `${page.title} — AMAN News`,
    description: page.meta_description || page.title,
    body,
    categories,
    breaking,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
