/**
 * POST /aman-content-engine/proxy — proxy server-side untuk AMAN Content Engine.
 *
 * Port dari aman-content-engine/proxy.php: front-end HANYA mengirim
 * { topic, mode, audience?, funnel? } atau { action:'ideas', niche }. Proxy
 * ini yang merakit systemInstruction (contentEnginePrompt.ts, "otak" server-
 * side) + pesan pengguna per-mode, lalu meneruskan ke Gemini dengan API key
 * tersimpan sebagai secret Worker. Key & system prompt TIDAK pernah dikirim
 * ke browser.
 */
import { getCookie, findCodeByToken } from "../_lib/ledger";
import { composeUser, generationConfig, ideasConfig, ideasUser, isValidMode, systemPrompt } from "../_lib/contentEnginePrompt";

interface Env {
  AMAN_LEDGER: KVNamespace;
  GEMINI_API_KEY: string;
}

const DEV_COOKIE = "amceng_dev";
const MODEL = "gemini-2.5-flash";
const ALLOWED_HOSTS = ["amandigital.my.id", "www.amandigital.my.id", "localhost", "127.0.0.1"];
const MAX_BODY_BYTES = 64 * 1024; // front-end cuma kirim topik+mode, cukup kecil
const MAX_TOPIC_LEN = 600;

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

  const token = getCookie(request, DEV_COOKIE);
  const code = token ? await findCodeByToken(env.AMAN_LEDGER, token) : null;
  if (!code) {
    return jsonError(401, "Sesi habis atau belum login. Silakan masuk lagi dengan kode akses.");
  }

  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  const srcHost = origin ? hostOf(origin) : referer ? hostOf(referer) : "";
  if (srcHost !== "" && !ALLOWED_HOSTS.includes(srcHost)) {
    return jsonError(403, "Origin tidak diizinkan.");
  }

  const raw = await request.text();
  if (raw.length === 0) return jsonError(400, "Body kosong.");
  if (raw.length > MAX_BODY_BYTES) return jsonError(413, "Permintaan terlalu besar.");

  let input: Record<string, unknown>;
  try {
    input = JSON.parse(raw);
  } catch {
    return jsonError(400, "Format permintaan tidak valid.");
  }

  const action = String(input.action || "content");
  let userMsg: string;
  let genCfg: ReturnType<typeof generationConfig>;

  if (action === "ideas") {
    let niche = String(input.niche || "").trim();
    if (niche.length > MAX_TOPIC_LEN) niche = niche.slice(0, MAX_TOPIC_LEN);
    userMsg = ideasUser(niche);
    genCfg = ideasConfig();
  } else {
    let topic = String(input.topic || "").trim();
    if (!topic) return jsonError(400, "Topik belum diisi.");
    if (topic.length > MAX_TOPIC_LEN) topic = topic.slice(0, MAX_TOPIC_LEN);
    const mode = isValidMode(String(input.mode || "")) ? String(input.mode) : "cepat";
    const audience = String(input.audience || "").trim();
    const funnel = String(input.funnel || "").trim();
    userMsg = composeUser(topic, mode, audience, funnel);
    genCfg = generationConfig(mode);
  }

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt() }] },
    contents: [{ role: "user", parts: [{ text: userMsg }] }],
    generationConfig: genCfg,
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
