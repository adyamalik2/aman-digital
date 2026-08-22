import { getCookie } from "../../_lib/ledger";
import { ADMIN_COOKIE, isValidAdminSession } from "../../_lib/adminsess";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const token = getCookie(context.request, ADMIN_COOKIE);
  if (await isValidAdminSession(context.env.AMAN_LEDGER, token)) {
    return context.next();
  }
  return Response.redirect(new URL("/admin", context.request.url).toString(), 303);
};
