/**
 * POST /aman-poster/proxy — proxy server-side untuk AMAN Poster Generator.
 *
 * Port dari aman-poster/proxy.php. Tool ini SEKARANG hanya meracik prompt
 * (JSON + teks visual) 100% di browser -- tidak ada panggilan AI untuk itu.
 * Proxy ini cuma melayani 2 aksi:
 *   - 'status' -> cek kesiapan server (badge di UI), tanpa panggil Gemini.
 *   - 'text'   -> bantuan AI (perbaiki headline/USP/dst.), app.js mengirim
 *                 { prompt } yang SUDAH jadi (tersusun di app.js), bukan
 *                 topic+mode seperti Content Engine -- jadi proxy ini tidak
 *                 perlu "otak" prompt sendiri, cukup teruskan apa adanya.
 * Bentuk respons SENGAJA {ok,...} (bukan passthrough mentah Gemini seperti
 * AMAN Engine) supaya cocok dengan app.js yang sudah ada tanpa perlu
 * mengubah app.js lebih jauh dari sekadar ganti apiUrl.
 */
import { getCookie, findCodeByToken } from "../_lib/ledger";
import { checkUsageLimit, clientIp } from "../_lib/ratelimit";

interface Env {
  AMAN_LEDGER: KVNamespace;
  GEMINI_API_KEY: string;
}

const DEV_COOKIE = "amanposter_dev";
const TEXT_MODEL = "gemini-2.5-flash";
const ALLOWED_HOSTS = ["amandigital.my.id", "www.amandigital.my.id", "localhost", "127.0.0.1"];
const MAX_BODY_BYTES = 64 * 1024;
const MAX_PROMPT_CHARS = 12000;
const TEXT_LIMIT = 40;
const TEXT_WINDOW_SECS = 600;

const respond = (payload: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const hostOf = (url: string): string => {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return "";
  }
};

/** Pesan error dari respons Gemini -- ramah untuk pembeli, tanpa membocorkan detail teknis. */
function friendlyError(raw: string, status: number): string {
  const lower = raw.toLowerCase();
  if (status === 429 || lower.includes("quota") || lower.includes("billing") || lower.includes("resource_exhausted")) {
    return "Layanan AI sedang penuh atau kuota harian tercapai. Coba lagi beberapa saat lagi. Jika terus berlanjut, hubungi admin via WhatsApp.";
  }
  if (status === 401 || status === 403 || lower.includes("api key") || lower.includes("permission")) {
    return "Layanan AI sedang bermasalah di sisi server. Silakan hubungi admin.";
  }
  return `Layanan AI gagal merespons (${status}). ${raw.slice(0, 200)}`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const token = getCookie(request, DEV_COOKIE);
  const code = token ? await findCodeByToken(env.AMAN_LEDGER, token) : null;
  if (!code) {
    return respond({ ok: false, message: "Sesi habis atau belum login. Silakan masuk lagi dengan kode akses." }, 401);
  }

  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  const srcHost = origin ? hostOf(origin) : referer ? hostOf(referer) : "";
  if (srcHost !== "" && !ALLOWED_HOSTS.includes(srcHost)) {
    return respond({ ok: false, message: "Origin tidak diizinkan." }, 403);
  }

  const raw = await request.text();
  if (raw.length === 0) return respond({ ok: false, message: "Payload kosong." }, 400);
  if (raw.length > MAX_BODY_BYTES) return respond({ ok: false, message: "Permintaan terlalu besar." }, 413);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
  } catch {
    return respond({ ok: false, message: "Payload JSON tidak valid." }, 400);
  }

  const action = String(data.action || "");

  if (action === "status") {
    return respond({
      ok: true,
      configured: env.GEMINI_API_KEY !== "" && !env.GEMINI_API_KEY.includes("PASTE_API_KEY"),
      transport: "fetch",
      php: null,
    });
  }

  if (!env.GEMINI_API_KEY) {
    return respond({ ok: false, message: "API key belum diisi. Hubungi admin." }, 503);
  }

  if (action === "text") {
    const ip = clientIp(request);
    const wait = await checkUsageLimit(env.AMAN_LEDGER, "poster-text", ip, TEXT_LIMIT, TEXT_WINDOW_SECS);
    if (wait !== null) {
      return respond({ ok: false, message: `Batas penggunaan sementara tercapai. Coba lagi dalam ${wait} detik.` }, 429);
    }

    const prompt = String(data.prompt || "").trim();
    if (!prompt) return respond({ ok: false, message: "Prompt tidak boleh kosong." }, 422);
    if (prompt.length > MAX_PROMPT_CHARS) return respond({ ok: false, message: "Prompt terlalu panjang." }, 422);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
    let upstream: Response;
    try {
      upstream = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1200, thinkingConfig: { thinkingBudget: 0 } },
        }),
      });
    } catch (err) {
      return respond({ ok: false, message: "Gagal menghubungi layanan AI: " + (err instanceof Error ? err.message : String(err)) }, 502);
    }

    const decoded = (await upstream.json().catch(() => null)) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      error?: { message?: string };
    } | null;

    if (!upstream.ok) {
      const msg = decoded?.error?.message || "";
      return respond({ ok: false, message: friendlyError(msg, upstream.status) }, upstream.status || 502);
    }

    const parts = decoded?.candidates?.[0]?.content?.parts || [];
    const text = parts.map((p) => p.text || "").filter(Boolean).join("\n").trim();
    if (!text) return respond({ ok: false, message: "AI tidak mengembalikan teks." }, 502);

    return respond({ ok: true, text, model: TEXT_MODEL });
  }

  return respond({ ok: false, message: "Aksi tidak dikenali." }, 400);
};
