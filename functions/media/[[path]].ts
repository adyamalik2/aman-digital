/**
 * GET /media/* — sajikan file dari R2 (galeri media portal berita).
 * Publik (tanpa gerbang admin) -- gambar memang ditujukan tampil di halaman
 * publik /berita/*.
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
  // Bukan immutable/1-tahun dengan sengaja: token wrangler yang dipakai
  // tidak punya izin "purge cache" di Cloudflare (cuma zone:read), jadi
  // caches.default.delete() di admin/api/media.ts tidak benar-benar
  // membuang salinan di CDN edge saat gambar dihapus (ketahuan lewat
  // cf-cache-status: HIT setelah delete). 1 jam = jendela basi yang wajar
  // tanpa perlu API token baru dengan izin purge.
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("ETag", obj.httpEtag);

  return new Response(obj.body, { headers });
};
