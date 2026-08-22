/**
 * ratelimit.ts — kunci sementara percobaan login gagal, per IP.
 *
 * Mengikuti angka yang sama dengan aman-admin/codelib.php di situs PHP lama:
 * 8 percobaan gagal dalam jendela 15 menit -> IP dikunci 10 menit. usleep saja
 * tidak cukup menahan brute-force paralel (banyak request bersamaan), jadi
 * kuncian tersimpan di KV supaya berlaku lintas-request.
 *
 * Key KV: "rl:{scope}:{ip}" -- scope dipisah per produk (mis. "engine",
 * "product") supaya kuncian di satu gerbang tidak menutup gerbang lain.
 */

const MAX_FAILS = 8;
const WINDOW_SECS = 900; // 15 menit
const LOCK_SECS = 600; // 10 menit

type RateEntry = { fails: number; first: number; lockedUntil?: number };

const rlKey = (scope: string, ip: string) => `rl:${scope}:${ip}`;

export function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

/** Detik sisa terkunci. 0 = boleh coba. */
export async function ratelimitWait(kv: KVNamespace, scope: string, ip: string): Promise<number> {
  const raw = await kv.get(rlKey(scope, ip));
  if (!raw) return 0;
  const e = JSON.parse(raw) as RateEntry;
  const now = Math.floor(Date.now() / 1000);
  if (e.lockedUntil && e.lockedUntil > now) return e.lockedUntil - now;
  return 0;
}

/** Catat 1 percobaan gagal; mengunci IP kalau sudah melewati batas dalam jendela waktu. */
export async function ratelimitFail(kv: KVNamespace, scope: string, ip: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const raw = await kv.get(rlKey(scope, ip));
  let e: RateEntry = raw ? JSON.parse(raw) : { fails: 0, first: now };
  if (now - e.first > WINDOW_SECS) e = { fails: 0, first: now };
  e.fails++;
  if (e.fails >= MAX_FAILS) {
    e.lockedUntil = now + LOCK_SECS;
    e.fails = 0;
  }
  await kv.put(rlKey(scope, ip), JSON.stringify(e), { expirationTtl: WINDOW_SECS + LOCK_SECS });
}

/** Hapus catatan gagal untuk IP ini (dipanggil setelah login sukses). */
export async function ratelimitReset(kv: KVNamespace, scope: string, ip: string): Promise<void> {
  await kv.delete(rlKey(scope, ip));
}

/**
 * Batas PEMAKAIAN (bukan percobaan gagal) — mis. berapa kali sebuah endpoint
 * AI boleh dipanggil per IP dalam jendela waktu tertentu. Port dari
 * ampos_rate_limit() di aman-poster/proxy.php (dulu per-sesi+IP berbasis
 * file; di sini per-IP lewat KV supaya berlaku lintas-request/edge).
 * Return null = boleh lanjut. Return angka = detik sisa sebelum boleh coba lagi.
 */
export async function checkUsageLimit(
  kv: KVNamespace,
  scope: string,
  ip: string,
  limit: number,
  windowSeconds: number
): Promise<number | null> {
  const key = `use:${scope}:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const raw = await kv.get(key);
  let e: { count: number; resetAt: number } = raw ? JSON.parse(raw) : { count: 0, resetAt: now + windowSeconds };
  if (e.resetAt <= now) e = { count: 0, resetAt: now + windowSeconds };
  if (e.count >= limit) return e.resetAt - now;
  e.count++;
  await kv.put(key, JSON.stringify(e), { expirationTtl: windowSeconds + 5 });
  return null;
}
