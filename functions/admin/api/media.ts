/**
 * /admin/api/media — galeri media (R2). Digerbangi oleh
 * functions/admin/api/_middleware.ts.
 * Objek disajikan publik lewat functions/media/[[path]].ts.
 */
interface Env {
  MEDIA: R2Bucket;
}

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const jsonOk = (data: unknown) =>
  new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const list = await context.env.MEDIA.list({ limit: 200 });
  const items = list.objects
    .sort((a, b) => (b.uploaded?.getTime() || 0) - (a.uploaded?.getTime() || 0))
    .map((o) => ({ key: o.key, size: o.size, uploaded: o.uploaded?.toISOString(), url: `/media/${o.key}` }));
  return jsonOk({ items });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const contentType = context.request.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    const body = (await context.request.json()) as { action?: string; key?: string };
    if (body.action === "delete" && body.key) {
      await context.env.MEDIA.delete(body.key);
      return jsonOk({ ok: true });
    }
    return jsonError(400, "Aksi tidak dikenal.");
  }

  const form = await context.request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError(400, "Tidak ada file.");
  if (file.size > MAX_BYTES) return jsonError(413, "File terlalu besar (maks 8 MB).");
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return jsonError(400, "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.");

  const rand = crypto.randomUUID().slice(0, 8);
  const date = new Date().toISOString().slice(0, 10);
  const key = `${date}/${rand}.${ext}`;

  const buf = await file.arrayBuffer();
  await context.env.MEDIA.put(key, buf, { httpMetadata: { contentType: file.type } });

  return jsonOk({ ok: true, key, url: `/media/${key}` });
};
