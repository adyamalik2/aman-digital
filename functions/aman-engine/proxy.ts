/**
 * POST /aman-engine/proxy — proxy server-side untuk AMAN Engine.
 *
 * Port dari aman-engine/proxy.php di situs PHP lama: front-end mengirim
 * { contents: [...] } (dirakit di app.js persis seperti sebelumnya), proxy
 * ini menempelkan API key Gemini (tersimpan sebagai secret Worker, TIDAK
 * pernah dikirim ke browser) lalu meneruskan ke Google. Key tidak pernah
 * terlihat dari "View Source" karena permintaan ke Google terjadi di sini,
 * bukan di browser pembeli.
 */
import { getCookie, findCodeByToken } from "../_lib/ledger";

interface Env {
  AMAN_LEDGER: KVNamespace;
  GEMINI_API_KEY: string;
}

const DEV_COOKIE = "amaneng_dev";
const MODEL = "gemini-2.5-flash";
const ALLOWED_HOSTS = ["amandigital.my.id", "www.amandigital.my.id", "localhost", "127.0.0.1"];
const MAX_BODY_BYTES = 8 * 1024 * 1024; // 8 MB, sama seperti versi PHP (muat beberapa gambar base64)

const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const hostOf = (url: string): string => {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return "";
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Gerbang akses: hanya perangkat dengan kode akses sah yang boleh generate.
  const token = getCookie(request, DEV_COOKIE);
  const code = token ? await findCodeByToken(env.AMAN_LEDGER, token) : null;
  if (!code) {
    return jsonError(401, "Sesi habis atau belum login. Silakan masuk lagi dengan kode akses.");
  }

  // Batasi ke same-origin (kurangi penyalahgunaan proxy oleh situs lain).
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  const srcHost = origin ? hostOf(origin) : referer ? hostOf(referer) : "";
  if (srcHost !== "" && !ALLOWED_HOSTS.includes(srcHost)) {
    return jsonError(403, "Origin tidak diizinkan.");
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError(413, "Permintaan terlalu besar.");
  }

  const raw = await request.text();
  if (raw.length === 0) return jsonError(400, "Body kosong.");
  if (raw.length > MAX_BODY_BYTES) return jsonError(413, "Permintaan terlalu besar.");

  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return jsonError(400, "Format permintaan tidak valid.");
  }
  if (typeof decoded !== "object" || decoded === null || !("contents" in decoded)) {
    return jsonError(400, "Format permintaan tidak valid.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    });
  } catch (err) {
    return jsonError(502, "Gagal menghubungi layanan AI: " + (err instanceof Error ? err.message : String(err)));
  }

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
