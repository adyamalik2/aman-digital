import { getCookie } from "../_lib/ledger";
import { ADMIN_COOKIE, adminClearCookieHeader, destroyAdminSession } from "../_lib/adminsess";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = getCookie(context.request, ADMIN_COOKIE);
  if (token) await destroyAdminSession(context.env.AMAN_LEDGER, token);

  const headers = new Headers({ Location: "/admin?logout=1" });
  headers.append("Set-Cookie", adminClearCookieHeader());
  return new Response(null, { status: 303, headers });
};
