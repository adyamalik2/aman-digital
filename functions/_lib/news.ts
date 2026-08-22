/**
 * news.ts — lapisan data portal berita (D1). Nama fungsi sengaja mengikuti
 * berita/inc/repo.php di situs PHP lama supaya mudah dibandingkan kalau
 * suatu saat perlu portasi balik/cek parity.
 */

export type Category = { id: number; slug: string; name: string; description: string; color: string; sort_order: number };
export type Author = { id: number; slug: string; name: string; email: string; role: string; bio: string; avatar: string };
export type Tag = { id: number; slug: string; name: string };

export type Comment = {
  id: number;
  article_id: number;
  parent_id: number | null;
  name: string;
  email: string | null;
  content: string;
  status: "pending" | "approved" | "spam";
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  thumbnail_alt: string;
  category_id: number | null;
  author_id: number | null;
  status: "draft" | "scheduled" | "published" | "archived";
  published_at: string | null;
  is_breaking: number;
  is_headline: number;
  is_slider: number;
  video_url: string;
  meta_title: string;
  meta_description: string;
  reading_minutes: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  // kolom hasil JOIN (opsional, tergantung query)
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  author_name?: string;
  author_slug?: string;
};

const ARTICLE_COLS = `a.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color, au.name AS author_name, au.slug AS author_slug`;
const ARTICLE_FROM = `FROM articles a LEFT JOIN categories c ON c.id = a.category_id LEFT JOIN authors au ON au.id = a.author_id`;

export async function getSettings(db: D1Database): Promise<Record<string, string>> {
  const { results } = await db.prepare("SELECT skey, svalue FROM settings").all<{ skey: string; svalue: string }>();
  const out: Record<string, string> = {};
  for (const r of results || []) out[r.skey] = r.svalue ?? "";
  return out;
}

export async function getCategories(db: D1Database): Promise<Category[]> {
  const { results } = await db.prepare("SELECT * FROM categories ORDER BY sort_order ASC").all<Category>();
  return results || [];
}

export async function getCategoryBySlug(db: D1Database, slug: string): Promise<Category | null> {
  return (await db.prepare("SELECT * FROM categories WHERE slug = ?").bind(slug).first<Category>()) || null;
}

export async function getTagBySlug(db: D1Database, slug: string): Promise<Tag | null> {
  return (await db.prepare("SELECT * FROM tags WHERE slug = ?").bind(slug).first<Tag>()) || null;
}

export async function getAuthorBySlug(db: D1Database, slug: string): Promise<Author | null> {
  return (await db.prepare("SELECT * FROM authors WHERE slug = ?").bind(slug).first<Author>()) || null;
}

export async function getSlider(db: D1Database, limit = 5): Promise<Article[]> {
  const { results } = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.status='published' AND a.is_slider=1 ORDER BY a.published_at DESC LIMIT ?`)
    .bind(limit)
    .all<Article>();
  return results || [];
}

export async function getHeadline(db: D1Database, excludeIds: number[]): Promise<Article | null> {
  const ex = excludeIds.length ? `AND a.id NOT IN (${excludeIds.map(() => "?").join(",")})` : "";
  const row = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.status='published' AND a.is_headline=1 ${ex} ORDER BY a.published_at DESC LIMIT 1`)
    .bind(...excludeIds)
    .first<Article>();
  if (row) return row;
  // fallback: artikel terbaru yang belum dipakai
  const fallback = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.status='published' ${ex} ORDER BY a.published_at DESC LIMIT 1`)
    .bind(...excludeIds)
    .first<Article>();
  return fallback || null;
}

export async function getRelated(db: D1Database, article: Article, limit: number, excludeIds: number[]): Promise<Article[]> {
  const allEx = [...excludeIds, article.id];
  const ex = `AND a.id NOT IN (${allEx.map(() => "?").join(",")})`;
  const { results } = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.status='published' AND a.category_id ${article.category_id ? "= ?" : "IS NULL"} ${ex} ORDER BY a.published_at DESC LIMIT ?`)
    .bind(...(article.category_id ? [article.category_id] : []), ...allEx, limit)
    .all<Article>();
  return results || [];
}

export async function getLatest(db: D1Database, limit: number, offset: number, categoryId?: number, authorId?: number, tagId?: number): Promise<Article[]> {
  let where = "a.status='published'";
  const binds: (string | number)[] = [];
  if (categoryId) { where += " AND a.category_id = ?"; binds.push(categoryId); }
  if (authorId) { where += " AND a.author_id = ?"; binds.push(authorId); }
  let join = "";
  if (tagId) { join = "JOIN article_tag at2 ON at2.article_id = a.id"; where += " AND at2.tag_id = ?"; binds.push(tagId); }
  binds.push(limit, offset);
  const { results } = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} ${join} WHERE ${where} ORDER BY a.published_at DESC LIMIT ? OFFSET ?`)
    .bind(...binds)
    .all<Article>();
  return results || [];
}

export async function getArticlesCount(db: D1Database, categoryId?: number, authorId?: number, tagId?: number): Promise<number> {
  let where = "a.status='published'";
  const binds: (string | number)[] = [];
  if (categoryId) { where += " AND a.category_id = ?"; binds.push(categoryId); }
  if (authorId) { where += " AND a.author_id = ?"; binds.push(authorId); }
  let join = "";
  if (tagId) { join = "JOIN article_tag at2 ON at2.article_id = a.id"; where += " AND at2.tag_id = ?"; binds.push(tagId); }
  const row = await db.prepare(`SELECT COUNT(*) AS n FROM articles a ${join} WHERE ${where}`).bind(...binds).first<{ n: number }>();
  return row?.n || 0;
}

export async function getTrending(db: D1Database, limit: number): Promise<Article[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { results } = await db
    .prepare(
      `SELECT ${ARTICLE_COLS}, COUNT(v.id) AS today_views ${ARTICLE_FROM} JOIN views v ON v.article_id = a.id
       WHERE a.status='published' AND v.viewed_date = ? GROUP BY a.id ORDER BY today_views DESC LIMIT ?`
    )
    .bind(today, limit)
    .all<Article>();
  return results || [];
}

export async function getPopularWeek(db: D1Database, limit: number): Promise<Article[]> {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const { results } = await db
    .prepare(
      `SELECT ${ARTICLE_COLS}, COUNT(v.id) AS week_views ${ARTICLE_FROM} JOIN views v ON v.article_id = a.id
       WHERE a.status='published' AND v.viewed_date >= ? GROUP BY a.id ORDER BY week_views DESC LIMIT ?`
    )
    .bind(weekAgo, limit)
    .all<Article>();
  return results || [];
}

export async function getVideos(db: D1Database, limit: number): Promise<Article[]> {
  const { results } = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.status='published' AND a.video_url != '' ORDER BY a.published_at DESC LIMIT ?`)
    .bind(limit)
    .all<Article>();
  return results || [];
}

export async function getBreaking(db: D1Database, limit: number): Promise<Article[]> {
  const { results } = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.status='published' AND a.is_breaking=1 ORDER BY a.published_at DESC LIMIT ?`)
    .bind(limit)
    .all<Article>();
  return results || [];
}

export async function getArticleBySlug(db: D1Database, slug: string): Promise<Article | null> {
  return (
    (await db.prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.slug = ? AND a.status='published'`).bind(slug).first<Article>()) || null
  );
}

export async function getTagsForArticle(db: D1Database, articleId: number): Promise<Tag[]> {
  const { results } = await db
    .prepare("SELECT t.* FROM tags t JOIN article_tag at ON at.tag_id = t.id WHERE at.article_id = ? ORDER BY t.name")
    .bind(articleId)
    .all<Tag>();
  return results || [];
}

export async function searchArticles(db: D1Database, q: string, limit: number, offset: number): Promise<Article[]> {
  const like = `%${q}%`;
  const { results } = await db
    .prepare(`SELECT ${ARTICLE_COLS} ${ARTICLE_FROM} WHERE a.status='published' AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?) ORDER BY a.published_at DESC LIMIT ? OFFSET ?`)
    .bind(like, like, like, limit, offset)
    .all<Article>();
  return results || [];
}

export async function searchArticlesCount(db: D1Database, q: string): Promise<number> {
  const like = `%${q}%`;
  const row = await db
    .prepare("SELECT COUNT(*) AS n FROM articles WHERE status='published' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)")
    .bind(like, like, like)
    .first<{ n: number }>();
  return row?.n || 0;
}

/** Catat 1 tampilan (dedup per pengunjung per hari lewat UNIQUE constraint). */
export async function recordView(db: D1Database, articleId: number, visitorHash: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  try {
    await db
      .prepare("INSERT INTO views (article_id, viewed_date, viewed_at, visitor_hash) VALUES (?,?,?,?)")
      .bind(articleId, today, now, visitorHash)
      .run();
    await db.prepare("UPDATE articles SET view_count = view_count + 1 WHERE id = ?").bind(articleId).run();
  } catch {
    // UNIQUE constraint gagal = pengunjung ini sudah dihitung hari ini, abaikan.
  }
}

/**
 * promoteScheduledArticles — naikkan artikel 'scheduled' yang jadwalnya
 * sudah lewat jadi 'published'. Port dari news_promote_scheduled() di
 * berita/inc/repo.php: di PHP dipanggil dari bootstrap.php di SETIAP
 * request publik (dibatasi sekali per menit lewat file penanda). Di sini
 * dipanggil dari functions/berita/_middleware.ts + functions/berita.ts,
 * dibatasi sekali per menit lewat KV supaya tidak query D1 di tiap request.
 */
export async function promoteScheduledArticles(db: D1Database, kv: KVNamespace): Promise<number> {
  const THROTTLE_KEY = "sched:last-promote";
  const last = await kv.get(THROTTLE_KEY);
  const nowMs = Date.now();
  if (last && nowMs - Number(last) < 60_000) return 0;
  await kv.put(THROTTLE_KEY, String(nowMs), { expirationTtl: 120 });

  const nowIso = new Date().toISOString();
  const res = await db
    .prepare("UPDATE articles SET status='published', updated_at=? WHERE status='scheduled' AND published_at IS NOT NULL AND published_at <= ?")
    .bind(nowIso, nowIso)
    .run();
  return res.meta.changes || 0;
}

export async function hashVisitor(request: Request): Promise<string> {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ua = request.headers.get("User-Agent") || "";
  const data = new TextEncoder().encode(ip + "|" + ua);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function readingMinutes(content: string): number {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDateID(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString.replace(" ", "T")).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

export function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function ensureUniqueSlug(db: D1Database, table: "articles" | "categories" | "tags", base: string, excludeId?: number): Promise<string> {
  let slug = base || "item";
  let n = 1;
  for (;;) {
    const row = excludeId
      ? await db.prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`).bind(slug, excludeId).first()
      : await db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).bind(slug).first();
    if (!row) return slug;
    n++;
    slug = `${base}-${n}`;
  }
}

export type AffiliateItem = {
  id: number;
  title: string;
  url: string;
  image: string;
  price_text: string;
  merchant: string;
  note: string;
  category_id: number | null;
  sort_order: number;
  is_active: number;
  click_count: number;
};

/** Produk kategori yang cocok diutamakan, sisanya (umum) mengisi slot yang tersisa. */
export async function getAffiliateItems(db: D1Database, limit: number, categoryId?: number): Promise<AffiliateItem[]> {
  const settings = await getSettings(db);
  if (settings.affiliate_enabled === "0") return [];

  if (categoryId) {
    const { results: matched } = await db
      .prepare("SELECT * FROM affiliate_items WHERE is_active = 1 AND category_id = ? ORDER BY sort_order ASC LIMIT ?")
      .bind(categoryId, limit)
      .all<AffiliateItem>();
    const items = matched || [];
    if (items.length >= limit) return items;
    const usedIds = items.map((i) => i.id);
    const ex = usedIds.length ? `AND id NOT IN (${usedIds.map(() => "?").join(",")})` : "";
    const { results: rest } = await db
      .prepare(`SELECT * FROM affiliate_items WHERE is_active = 1 ${ex} ORDER BY sort_order ASC LIMIT ?`)
      .bind(...usedIds, limit - items.length)
      .all<AffiliateItem>();
    return [...items, ...(rest || [])];
  }

  const { results } = await db
    .prepare("SELECT * FROM affiliate_items WHERE is_active = 1 ORDER BY sort_order ASC LIMIT ?")
    .bind(limit)
    .all<AffiliateItem>();
  return results || [];
}

/** Catat 1 klik & kembalikan URL tujuan (null = tidak ditemukan/nonaktif). */
export async function recordAffiliateClick(db: D1Database, id: number): Promise<string | null> {
  const item = await db.prepare("SELECT url FROM affiliate_items WHERE id = ? AND is_active = 1").bind(id).first<{ url: string }>();
  if (!item) return null;
  await db.prepare("UPDATE affiliate_items SET click_count = click_count + 1 WHERE id = ?").bind(id).run();
  return item.url;
}

export async function getApprovedComments(db: D1Database, articleId: number): Promise<Comment[]> {
  const { results } = await db
    .prepare("SELECT * FROM comments WHERE article_id = ? AND status = 'approved' ORDER BY created_at ASC")
    .bind(articleId)
    .all<Comment>();
  return results || [];
}

export async function countApprovedComments(db: D1Database, articleId: number): Promise<number> {
  const row = await db.prepare("SELECT COUNT(*) AS n FROM comments WHERE article_id = ? AND status = 'approved'").bind(articleId).first<{ n: number }>();
  return row?.n || 0;
}

export function hashIp(request: Request): Promise<string> {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  return crypto.subtle.digest("SHA-1", new TextEncoder().encode(ip)).then((d) =>
    Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("")
  );
}

/** Parse ID video YouTube dari URL biasa (watch?v=, youtu.be/, embed/). */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
