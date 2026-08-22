import { getCookie, findCodeByToken } from "../../_lib/ledger";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const DEV_COOKIE = "amanposter_dev";

export const onRequest: PagesFunction<Env> = async (context) => {
  const token = getCookie(context.request, DEV_COOKIE);
  if (token) {
    const code = await findCodeByToken(context.env.AMAN_LEDGER, token);
    if (code) return context.next();
  }
  return Response.redirect(new URL("/aman-poster/masuk", context.request.url).toString(), 303);
};
