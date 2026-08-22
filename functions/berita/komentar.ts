/**
 * POST /berita/komentar — kirim komentar pembaca. Masuk status 'pending',
 * baru tampil publik setelah disetujui admin di /admin/berita (tab Komentar).
 */
import { hashIp } from "../_lib/news";
import { clientIp, ratelimitFail, ratelimitWait } from "../_lib/ratelimit";

interface Env {
  DB: D1Database;
  AMAN_LEDGER: KVNamespace;
}

const RATE_SCOPE = "comment";
const MAX_LEN = 2000;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const form = await context.request.formData();
  const articleId = Number(form.get("article_id") || 0);
  const slug = String(form.get("slug") || "");
  const redirectBack = (query: string) => Response.redirect(new URL(`/berita/${slug}${query}`, context.request.url).toString(), 303);

  if (!articleId || !slug) return new Response("Permintaan tidak valid.", { status: 400 });

  // Honeypot: field tersembunyi lewat CSS, hanya bot yang biasanya mengisinya.
  if (String(form.get("website") || "").trim() !== "") {
    return redirectBack("?komentar=terkirim");
  }

  const ip = clientIp(context.request);
  if ((await ratelimitWait(context.env.AMAN_LEDGER, RATE_SCOPE, ip)) > 0) {
    return redirectBack("?komentar=terlalu-sering");
  }

  const name = String(form.get("name") || "").trim().slice(0, 80);
  const email = String(form.get("email") || "").trim().slice(0, 191);
  const content = String(form.get("content") || "").trim().slice(0, MAX_LEN);
  const parentId = form.get("parent_id") ? Number(form.get("parent_id")) : null;

  if (!name || !content) {
    await ratelimitFail(context.env.AMAN_LEDGER, RATE_SCOPE, ip);
    return redirectBack("?komentar=gagal");
  }

  const ipHash = await hashIp(context.request);
  const userAgent = (context.request.headers.get("User-Agent") || "").slice(0, 200);

  await context.env.DB.prepare(
    "INSERT INTO comments (article_id, parent_id, name, email, content, status, ip_hash, user_agent, created_at) VALUES (?,?,?,?,?,?,?,?,?)"
  )
    .bind(articleId, parentId, name, email || null, content, "pending", ipHash, userAgent, new Date().toISOString())
    .run();

  return redirectBack("?komentar=terkirim");
};
