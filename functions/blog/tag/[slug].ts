import { getArticlesCount, getBreaking, getCategories, getLatest, getTagBySlug } from "../../_lib/news";
import { renderArchiveBody, renderShell } from "../../_lib/newsRender";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const slug = String(context.params.slug || "");
  const url = new URL(context.request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("hal") || "1", 10) || 1);
  const perPage = 12;

  const [tag, categories, breaking] = await Promise.all([getTagBySlug(db, slug), getCategories(db), getBreaking(db, 8)]);

  if (!tag) {
    return new Response("Topik tidak ditemukan.", { status: 404 });
  }

  const total = await getArticlesCount(db, undefined, undefined, tag.id);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const curPage = Math.min(page, totalPages);
  const items = await getLatest(db, perPage, (curPage - 1) * perPage, undefined, undefined, tag.id);

  const body = renderArchiveBody({
    heading: `#${tag.name}`,
    items,
    page: curPage,
    totalPages,
    baseUrl: `/blog/tag/${tag.slug}`,
    emptyMessage: "Belum ada artikel dengan topik ini.",
  });

  const html = renderShell({
    title: `#${tag.name} — AMAN News`,
    description: `Artikel dengan topik ${tag.name}`,
    body,
    categories,
    breaking,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
