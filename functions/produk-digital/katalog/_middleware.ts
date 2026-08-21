/**
 * Middleware — melindungi /produk-digital/katalog.
 *
 * Berjalan SEBELUM berkas statis katalog dikirim. Kalau cookie perangkat
 * tidak ada atau tidak dikenali di KV, pengunjung dialihkan ke halaman
 * login tanpa pernah melihat isi katalog — gerbangnya ada di server,
 * bukan disembunyikan lewat JavaScript di browser (yang bisa dilewati).
 */
import { getCookie, findCodeByToken } from "../../_lib/ledger";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const DEV_COOKIE = "amanprod_dev";

export const onRequest: PagesFunction<Env> = async (context) => {
  const token = getCookie(context.request, DEV_COOKIE);

  if (token) {
    const code = await findCodeByToken(context.env.AMAN_LEDGER, token);
    if (code) {
      // Token dikenal → lanjutkan ke berkas katalog statis seperti biasa.
      return context.next();
    }
  }

  return Response.redirect(new URL("/produk-digital", context.request.url).toString(), 303);
};
