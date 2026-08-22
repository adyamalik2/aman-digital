import { getCookie, removeDeviceByToken, clearCookieHeader } from "../_lib/ledger";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const DEV_COOKIE = "amanposter_dev";
const PATH = "/aman-poster/";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = getCookie(context.request, DEV_COOKIE);
  if (token) {
    await removeDeviceByToken(context.env.AMAN_LEDGER, token);
  }

  const headers = new Headers({ Location: "/aman-poster/masuk?logout=1" });
  headers.append("Set-Cookie", clearCookieHeader(DEV_COOKIE, PATH));
  return new Response(null, { status: 303, headers });
};
