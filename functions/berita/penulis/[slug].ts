import { getAffiliateItems, getArticlesCount, getAuthorBySlug, getBreaking, getCategories, getLatest, getSettings } from "../../_lib/news";
import { renderAffiliateWidget, renderArchiveBody, renderShell } from "../../_lib/newsRender";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const slug = String(context.params.slug || "");
  const url = new URL(context.request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("hal") || "1", 10) || 1);
  const perPage = 12;

  const [author, categories, breaking] = await Promise.all([getAuthorBySlug(db, slug), getCategories(db), getBreaking(db, 8)]);

  if (!author) {
    return new Response("Penulis tidak ditemukan.", { status: 404 });
  }

  const total = await getArticlesCount(db, undefined, author.id);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const curPage = Math.min(page, totalPages);
  const items = await getLatest(db, perPage, (curPage - 1) * perPage, undefined, author.id);

  const bioHtml = author.bio
    ? `<div class="wrap" style="padding-top:32px"><div class="side-card" style="max-width:600px"><p style="margin:0;color:#475569;line-height:1.7">${author.bio}</p></div></div>`
    : "";

  const [settings, affItems] = await Promise.all([getSettings(db), getAffiliateItems(db, 4)]);
  const affHtml = affItems.length
    ? `<section class="sect" style="padding-top:0"><div class="wrap">${renderAffiliateWidget(affItems, settings.affiliate_title || "Belanja Pilihan", settings.affiliate_disclosure || "")}</div></section>`
    : "";

  const body = `${bioHtml}${renderArchiveBody({
    heading: `✍️ ${author.name}`,
    subheading: `${total} artikel diterbitkan`,
    items,
    page: curPage,
    totalPages,
    baseUrl: `/berita/penulis/${author.slug}`,
    emptyMessage: "Penulis ini belum menerbitkan artikel.",
  })}${affHtml}`;

  const html = renderShell({
    title: `${author.name} — AMAN News`,
    description: author.bio || `Artikel oleh ${author.name}`,
    body,
    categories,
    breaking,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
