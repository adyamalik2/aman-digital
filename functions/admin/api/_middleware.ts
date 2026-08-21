import { getCookie } from "../../_lib/ledger";
import { ADMIN_COOKIE, isValidAdminSession } from "../../_lib/adminsess";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

export const onRequest: PagesFunction<Env> = async (context) => {
  const token = getCookie(context.request, ADMIN_COOKIE);
  if (await isValidAdminSession(context.env.AMAN_LEDGER, token)) {
    return context.next();
  }
  return jsonError(401, "Sesi admin habis atau belum login.");
};
