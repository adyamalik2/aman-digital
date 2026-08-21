/**
 * POST /produk-digital/login — validasi kode akses AMAN Product Digital.
 *
 * Menerima form biasa (bukan fetch/JSON) supaya berfungsi tanpa JavaScript
 * di browser pengunjung — sama seperti gerbang PHP lama.
 */
import { checkDevice, getCookie, setDeviceCookieHeader } from "../_lib/ledger";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const DEV_COOKIE = "amanprod_dev";
const PATH = "/produk-digital/";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const form = await context.request.formData();
  const code = String(form.get("code") || "").trim().toUpperCase();

  const redirectSalah = new Response(null, {
    status: 303,
    headers: { Location: "/produk-digital?salah=1" },
  });

  if (!code) return redirectSalah;

  const cookieToken = getCookie(context.request, DEV_COOKIE);
  const result = await checkDevice(context.env.AMAN_LEDGER, code, cookieToken);

  if (result.status === "invalid" || result.status === "locked") {
    return redirectSalah;
  }

  const headers = new Headers({ Location: "/produk-digital/katalog" });
  if (result.status === "ok-new" && result.token) {
    headers.append("Set-Cookie", setDeviceCookieHeader(DEV_COOKIE, result.token, PATH));
  }
  return new Response(null, { status: 303, headers });
};
