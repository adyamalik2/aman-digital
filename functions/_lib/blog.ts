/**
 * blog.ts — util bersama untuk artikel blog (disimpan di D1, tabel `articles`).
 * Menggantikan lib/notion.ts: dibaca & ditulis langsung lewat D1 binding di
 * Pages Functions, bukan di-fetch saat build. Artinya terbit tanpa rebuild.
 */

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function ensureUniqueSlug(db: D1Database, base: string, excludeId?: number): Promise<string> {
  let slug = base || "artikel";
  let n = 1;
  for (;;) {
    const row = excludeId
      ? await db.prepare("SELECT id FROM articles WHERE slug = ? AND id != ?").bind(slug, excludeId).first()
      : await db.prepare("SELECT id FROM articles WHERE slug = ?").bind(slug).first();
    if (!row) return slug;
    n++;
    slug = `${base}-${n}`;
  }
}

export function formatDateID(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
