/**
 * GET /berita/go?id=N — pengalih klik produk afiliasi + pencatat statistik.
 * Port dari berita/go.php. Semua tautan afiliasi di portal mengarah ke sini
 * (bukan langsung ke toko) supaya klik bisa dihitung dan link bisa diganti
 * dari admin tanpa menyentuh artikel yang sudah tayang.
 */
import { recordAffiliateClick } from "../_lib/news";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = Number(url.searchParams.get("id") || 0);
  const dest = id > 0 ? await recordAffiliateClick(context.env.DB, id) : null;

  const ok = dest !== null && /^https?:\/\//i.test(dest);
  const location = ok && dest ? dest : "/berita";

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer-when-downgrade",
    },
  });
};
