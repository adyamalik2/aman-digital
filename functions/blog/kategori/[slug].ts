import { getArticlesCount, getBreaking, getCategories, getCategoryBySlug, getLatest } from "../../_lib/news";
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

  const [category, categories, breaking] = await Promise.all([getCategoryBySlug(db, slug), getCategories(db), getBreaking(db, 8)]);

  if (!category) {
    return new Response("Kategori tidak ditemukan.", { status: 404 });
  }

  const total = await getArticlesCount(db, category.id);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const curPage = Math.min(page, totalPages);
  const items = await getLatest(db, perPage, (curPage - 1) * perPage, category.id);

  const body = renderArchiveBody({
    heading: `📂 ${category.name}`,
    subheading: category.description,
    items,
    page: curPage,
    totalPages,
    baseUrl: `/blog/kategori/${category.slug}`,
    emptyMessage: "Belum ada artikel di kategori ini.",
  });

  const html = renderShell({
    title: `${category.name} — AMAN News`,
    description: category.description || `Berita kategori ${category.name}`,
    body,
    categories,
    activeCategory: category.slug,
    breaking,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
