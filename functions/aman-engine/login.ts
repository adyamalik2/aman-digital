import { checkDevice, getCookie, setDeviceCookieHeader } from "../_lib/ledger";
import { clientIp, ratelimitFail, ratelimitReset, ratelimitWait } from "../_lib/ratelimit";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const DEV_COOKIE = "amaneng_dev";
const PATH = "/aman-engine/";
const RATE_SCOPE = "engine";

const redirect = (reason: string) =>
  new Response(null, { status: 303, headers: { Location: `/aman-engine/masuk?e=${reason}` } });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const ip = clientIp(context.request);
  const waitSecs = await ratelimitWait(context.env.AMAN_LEDGER, RATE_SCOPE, ip);
  if (waitSecs > 0) return redirect("ratelimited");

  const form = await context.request.formData();
  const code = String(form.get("code") || "").trim().toUpperCase();
  if (!code) return redirect("invalid");

  const cookieToken = getCookie(context.request, DEV_COOKIE);
  const result = await checkDevice(context.env.AMAN_LEDGER, code, cookieToken);

  if (result.status === "invalid") {
    await ratelimitFail(context.env.AMAN_LEDGER, RATE_SCOPE, ip);
    return redirect("invalid");
  }
  if (result.status === "locked") return redirect("locked");

  await ratelimitReset(context.env.AMAN_LEDGER, RATE_SCOPE, ip);

  const headers = new Headers({ Location: "/aman-engine/app/" });
  if (result.status === "ok-new" && result.token) {
    headers.append("Set-Cookie", setDeviceCookieHeader(DEV_COOKIE, result.token, PATH));
  }
  return new Response(null, { status: 303, headers });
};
