/**
 * GET /media/* — sajikan file dari R2 (galeri media portal berita).
 * Publik (tanpa gerbang admin) -- gambar memang ditujukan tampil di halaman
 * publik /blog/*.
 */
interface Env {
  MEDIA: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const key = Array.isArray(context.params.path) ? context.params.path.join("/") : String(context.params.path || "");
  if (!key) return new Response("Not found", { status: 404 });

  const obj = await context.env.MEDIA.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", obj.httpEtag);

  return new Response(obj.body, { headers });
};
