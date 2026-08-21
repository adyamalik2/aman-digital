import { clientIp, ratelimitFail, ratelimitReset, ratelimitWait } from "../_lib/ratelimit";
import { adminCookieHeader, createAdminSession, timingSafeEqual } from "../_lib/adminsess";

interface Env {
  AMAN_LEDGER: KVNamespace;
  ADMIN_PASSWORD: string;
}

const RATE_SCOPE = "admin";

const redirect = (reason: string) =>
  new Response(null, { status: 303, headers: { Location: `/admin?e=${reason}` } });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const ip = clientIp(context.request);
  if ((await ratelimitWait(context.env.AMAN_LEDGER, RATE_SCOPE, ip)) > 0) {
    return redirect("ratelimited");
  }

  const form = await context.request.formData();
  const password = String(form.get("password") || "");

  if (!password || !timingSafeEqual(password, context.env.ADMIN_PASSWORD)) {
    await ratelimitFail(context.env.AMAN_LEDGER, RATE_SCOPE, ip);
    return redirect("invalid");
  }

  await ratelimitReset(context.env.AMAN_LEDGER, RATE_SCOPE, ip);
  const token = await createAdminSession(context.env.AMAN_LEDGER);

  const headers = new Headers({ Location: "/admin/dashboard" });
  headers.append("Set-Cookie", adminCookieHeader(token));
  return new Response(null, { status: 303, headers });
};
