import { getAffiliateItems, getBreaking, getCategories, getSettings, searchArticles, searchArticlesCount } from "../_lib/news";
import { renderAffiliateWidget, renderArchiveBody, renderShell } from "../_lib/newsRender";

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

  const [settings, affItems] = q ? await Promise.all([getSettings(db), getAffiliateItems(db, 4)]) : [{} as Record<string, string>, []];
  const affHtml = affItems.length
    ? `<section class="sect" style="padding-top:0"><div class="wrap">${renderAffiliateWidget(affItems, settings.affiliate_title || "Belanja Pilihan", settings.affiliate_disclosure || "")}</div></section>`
    : "";

  const body = q
    ? renderArchiveBody({
        heading: `🔍 Hasil pencarian: "${q}"`,
        subheading: `${total} artikel ditemukan`,
        items,
        page,
        totalPages,
        baseUrl: `/berita/cari?q=${encodeURIComponent(q)}`,
        emptyMessage: "Tidak ada artikel yang cocok. Coba kata kunci lain.",
      }) + affHtml
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

// Next.js prefetch link pakai HEAD -- tanpa handler ini rute balas 404 walau GET normal.
export const onRequestHead: PagesFunction<Env> = async (context) => {
  const res = await onRequestGet(context);
  return new Response(null, { status: res.status, statusText: res.statusText, headers: res.headers });
};
