/**
 * GET /produk-digital/logout — lepas ikatan perangkat & hapus cookie.
 *
 * WAJIB melepas token dari ledger, bukan cuma menghapus cookie di browser —
 * kalau tidak, kuota perangkat yang sudah dipakai tidak pernah kembali, dan
 * kalau pengunjung memasukkan kode yang sama lagi nanti, statusnya rancu.
 */
import { getCookie, removeDeviceByToken, clearCookieHeader } from "../_lib/ledger";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const DEV_COOKIE = "amanprod_dev";
const PATH = "/produk-digital/";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = getCookie(context.request, DEV_COOKIE);
  if (token) {
    await removeDeviceByToken(context.env.AMAN_LEDGER, token);
  }

  const headers = new Headers({ Location: "/produk-digital" });
  headers.append("Set-Cookie", clearCookieHeader(DEV_COOKIE, PATH));
  return new Response(null, { status: 303, headers });
};
