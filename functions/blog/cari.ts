import { getBreaking, getCategories, searchArticles, searchArticlesCount } from "../_lib/news";
import { renderArchiveBody, renderShell } from "../_lib/newsRender";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const page = Math.max(1, parseInt(url.searchParams.get("hal") || "1", 10) || 1);
  const perPage = 12;

  const [categories, breaking] = await Promise.all([getCategories(db), getBreaking(db, 8)]);

  let items: Awaited<ReturnType<typeof searchArticles>> = [];
  let total = 0;
  if (q) {
    total = await searchArticlesCount(db, q);
    items = await searchArticles(db, q, perPage, (page - 1) * perPage);
  }
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const body = q
    ? renderArchiveBody({
        heading: `🔍 Hasil pencarian: "${q}"`,
        subheading: `${total} artikel ditemukan`,
        items,
        page,
        totalPages,
        baseUrl: `/blog/cari?q=${encodeURIComponent(q)}`,
        emptyMessage: "Tidak ada artikel yang cocok. Coba kata kunci lain.",
      })
    : `<section class="sect"><div class="wrap"><p style="color:#94a3b8">Ketik kata kunci di kotak pencarian untuk mulai.</p></div></section>`;

  const html = renderShell({
    title: q ? `Cari: ${q} — AMAN News` : "Cari — AMAN News",
    description: "Pencarian artikel AMAN News.",
    body,
    categories,
    breaking,
    noindex: true,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
