/**
 * adminsess.ts — sesi login panel admin (satu password bersama).
 * Token sesi disimpan di KV (bukan JWT/signed cookie) supaya bisa dicabut
 * kapan saja lewat logout tanpa perlu rotasi rahasia.
 */

const SESS_PREFIX = "admsess:";
const SESS_TTL_SECS = 60 * 60 * 24 * 30; // 30 hari, sama seperti panel PHP lama
export const ADMIN_COOKIE = "amanadmin_sess";

export async function createAdminSession(kv: KVNamespace): Promise<string> {
  const token = crypto.randomUUID().replace(/-/g, "");
  await kv.put(SESS_PREFIX + token, JSON.stringify({ createdAt: new Date().toISOString() }), {
    expirationTtl: SESS_TTL_SECS,
  });
  return token;
}

export async function isValidAdminSession(kv: KVNamespace, token: string | null): Promise<boolean> {
  if (!token) return false;
  const raw = await kv.get(SESS_PREFIX + token);
  return raw !== null;
}

export async function destroyAdminSession(kv: KVNamespace, token: string): Promise<void> {
  await kv.delete(SESS_PREFIX + token);
}

export function adminCookieHeader(token: string): string {
  return `${ADMIN_COOKIE}=${token}; Path=/admin; Max-Age=${SESS_TTL_SECS}; Secure; HttpOnly; SameSite=Lax`;
}

export function adminClearCookieHeader(): string {
  return `${ADMIN_COOKIE}=; Path=/admin; Max-Age=0; Secure; HttpOnly; SameSite=Lax`;
}

/** Bandingkan dua string dalam waktu konstan (hindari timing attack pada password). */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
