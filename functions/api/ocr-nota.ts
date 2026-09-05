/**
 * POST /api/ocr-nota — baca foto struk jadi draf transaksi (untuk AMAN-in).
 *
 * Dipakai aplikasi AMAN-in yang berjalan di subdomain berbeda
 * (amanin.amandigital.my.id), jadi endpoint ini lintas-origin.
 *
 * KENAPA DI SINI, BUKAN DI APLIKASINYA
 * AMAN-in murni berjalan di peramban dan tidak punya server sendiri.
 * Memanggil Gemini langsung dari sana berarti menaruh GEMINI_API_KEY di dalam
 * bundel yang bisa dibaca siapa saja. Endpoint ini yang memegang kuncinya.
 *
 * SIAPA YANG BOLEH MEMAKAI
 * Hanya pengguna AMAN-in yang sudah masuk. Permintaan wajib membawa Firebase
 * ID token, yang diverifikasi ke Firebase (bukan sekadar dipercaya). Tanpa
 * ini, kunci Gemini bisa dipakai siapa pun yang menemukan alamat endpoint.
 */

import { checkUsageLimit, peekUsageCount } from "../_lib/ratelimit";
import { statusPro } from "../_lib/amanin";

interface Env {
  AMAN_LEDGER: KVNamespace;
  GEMINI_API_KEY: string;
}

const MODEL = "gemini-2.5-flash";

// API key web Firebase memang publik (tertanam di bundel aplikasi), jadi aman
// ditulis di sini. Fungsinya cuma untuk MEMVERIFIKASI token, bukan memberi
// akses apa pun.
const AMANIN_FIREBASE_KEY = "AIzaSyBuA7CX1k88qGEouQx1tCY9Gq0H41H9PaY";

/**
 * `https://localhost` adalah origin WebView di dalam APK Capacitor
 * (capacitor.config.json memakai androidScheme "https"). Tanpa ini, Scan Nota
 * jalan di web tapi gagal di aplikasi Android -- dan gagalnya tidak jelas
 * sebabnya karena peramban memblokirnya sebelum permintaan sampai ke sini.
 *
 * Perlu dicatat: CORS di sini lapis kedua, bukan pengaman utama. Yang
 * benar-benar menjaga endpoint ini adalah verifikasi Firebase ID token --
 * origin gampang dipalsukan dari luar peramban, token tidak.
 */
const ALLOWED_ORIGINS = [
  "https://amanin.amandigital.my.id",
  "https://localhost",      // APK Android (Capacitor)
  "capacitor://localhost",  // kalau androidScheme diubah ke skema capacitor
  "http://localhost:5173",  // vite dev
  "http://localhost:4173",  // vite preview
];

// Foto sudah dikecilkan di sisi aplikasi (maks ~200KB). Batas ini jaring
// pengaman kalau ada yang mengirim langsung ke endpoint.
const MAX_IMAGE_BYTES = 1_500_000;

/** Batas pemakaian per pengguna -- melindungi kuota Gemini dari penyalahgunaan. */
const LIMIT_PER_USER = 30;
const WINDOW_SECS = 60 * 60 * 24; // sehari

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
});

const json = (status: number, data: unknown, origin: string) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
    },
  });

export const onRequestOptions: PagesFunction<Env> = async (context) =>
  new Response(null, { status: 204, headers: corsHeaders(context.request.headers.get("Origin") || "") });

/** Verifikasi Firebase ID token ke Firebase, dan kembalikan uid-nya. */
async function verifyIdToken(idToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${AMANIN_FIREBASE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { users?: { localId?: string }[] };
    return data.users?.[0]?.localId || null;
  } catch {
    return null;
  }
}

const KATEGORI_MASUK = ["Penjualan", "Gaji", "Modal", "Pemasukan Lain"];
const KATEGORI_KELUAR = [
  "Belanja Barang/Jasa", "Tagihan", "Sosial", "Gaji Karyawan",
  "Transport", "Makan & Minum", "Operasional", "Lainnya",
];

const PROMPT = `Kamu membaca foto struk/nota belanja Indonesia dan mengubahnya jadi satu catatan transaksi.

Balas HANYA dengan JSON, tanpa penjelasan, tanpa blok kode:
{"type":"out","amount":50000,"category":"Makan & Minum","description":"Nasi goreng 2 porsi","date":"2026-08-30","confidence":"tinggi"}

Aturan:
- "amount" = TOTAL AKHIR yang dibayar, bilangan bulat rupiah tanpa titik/koma.
  Kalau ada beberapa angka, ambil yang bertanda TOTAL/JUMLAH/GRAND TOTAL.
  Abaikan kembalian, tunai yang diserahkan, dan subtotal sebelum diskon.
- "type" = "out" untuk struk belanja/pembelian (paling umum),
  "in" hanya kalau jelas bukti penerimaan uang.
- "category" untuk pengeluaran, pilih SATU dari: ${KATEGORI_KELUAR.join(", ")}
- "category" untuk pemasukan, pilih SATU dari: ${KATEGORI_MASUK.join(", ")}
- "description" = ringkasan singkat isi belanja, maksimal 60 karakter.
  Sebut nama toko kalau terbaca.
- "date" = tanggal pada struk, format YYYY-MM-DD. Kosongkan ("") kalau tidak terbaca.
- "confidence" = "tinggi" kalau total terbaca jelas, "rendah" kalau menebak.

Kalau gambar sama sekali bukan struk atau tidak terbaca, balas:
{"error":"bukan_struk"}`;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get("Origin") || "";
  const env = context.env;

  if (!env.GEMINI_API_KEY) {
    return json(200, { ok: false, message: "Fitur scan nota belum aktif." }, origin);
  }

  let body: { idToken?: string; image?: string };
  try {
    body = await context.request.json();
  } catch {
    return json(400, { ok: false, message: "Permintaan tidak valid." }, origin);
  }

  const idToken = String(body.idToken || "");
  if (!idToken) {
    return json(401, { ok: false, message: "Silakan masuk dulu untuk memakai scan nota." }, origin);
  }

  const uid = await verifyIdToken(idToken);
  if (!uid) {
    return json(401, { ok: false, message: "Sesi Anda sudah berakhir. Masuk ulang lalu coba lagi." }, origin);
  }

  /**
   * Scan Nota hanya untuk AMAN-in Pro (K-15).
   *
   * Diperiksa DI SINI, bukan di aplikasi. Ini satu-satunya fitur yang biayanya
   * nyata -- tiap panggilan memakai kuota Gemini milik Malik. Pemeriksaan di
   * sisi aplikasi bisa dilewati siapa pun yang membaca bundelnya, dan yang
   * menanggung tagihannya bukan dia.
   *
   * Kode 402 (Payment Required) dipakai supaya aplikasi bisa membedakan
   * "belum berlangganan" dari galat biasa, lalu membuka layar paket.
   */
  const status = await statusPro(env.AMAN_LEDGER, uid);
  if (!status.pro) {
    return json(402, {
      ok: false,
      perluPro: true,
      message: status.alasan === "kedaluwarsa"
        ? "Masa langganan Anda sudah habis. Perpanjang untuk memakai Scan Nota."
        : "Scan Nota tersedia untuk AMAN-in Pro.",
    }, origin);
  }

  // checkUsageLimit membalas null kalau boleh, atau sisa detik sampai reset.
  const tunggu = await checkUsageLimit(env.AMAN_LEDGER, "ocr", uid, LIMIT_PER_USER, WINDOW_SECS);
  if (tunggu !== null) {
    const jam = Math.ceil(tunggu / 3600);
    return json(429, {
      ok: false,
      sisaScan: 0,
      limitScan: LIMIT_PER_USER,
      message: `Batas scan nota tercapai (${LIMIT_PER_USER} per hari). Coba lagi dalam ${jam} jam.`,
    }, origin);
  }

  // Dipakai murni untuk ditampilkan ("sisa X hari ini") -- checkUsageLimit di
  // atas sudah menaikkan hitungannya, ini cuma membacanya kembali.
  const sisaScan = Math.max(0, LIMIT_PER_USER - (await peekUsageCount(env.AMAN_LEDGER, "ocr", uid)));

  // Terima data URL ("data:image/jpeg;base64,....") maupun base64 polos.
  const raw = String(body.image || "");
  const cocok = raw.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
  const mimeType = cocok ? cocok[1] : "image/jpeg";
  const base64 = cocok ? cocok[2] : raw;
  if (!base64) return json(400, { ok: false, message: "Foto tidak terkirim." }, origin);
  if (base64.length > MAX_IMAGE_BYTES) {
    return json(413, { ok: false, message: "Foto terlalu besar." }, origin);
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: mimeType, data: base64 } }] }],
          generationConfig: { temperature: 0, responseMimeType: "application/json" },
        }),
      }
    );
  } catch {
    return json(200, { ok: false, sisaScan, limitScan: LIMIT_PER_USER, message: "Tidak bisa menghubungi layanan AI. Coba lagi." }, origin);
  }

  if (!upstream.ok) {
    return json(200, { ok: false, sisaScan, limitScan: LIMIT_PER_USER, message: "Layanan AI sedang sibuk. Coba lagi sebentar." }, origin);
  }

  const hasil = (await upstream.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const teks = hasil.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let data: Record<string, unknown>;
  try {
    // Jaga-jaga kalau model tetap membungkusnya dengan blok kode.
    data = JSON.parse(teks.replace(/^```(?:json)?\s*|\s*```$/g, "").trim());
  } catch {
    return json(200, { ok: false, sisaScan, limitScan: LIMIT_PER_USER, message: "Struk tidak terbaca. Coba foto ulang lebih terang." }, origin);
  }

  if (data.error === "bukan_struk") {
    return json(200, { ok: false, sisaScan, limitScan: LIMIT_PER_USER, message: "Gambar ini sepertinya bukan struk. Coba foto struk belanja." }, origin);
  }

  const type = data.type === "in" ? "in" : "out";
  const daftar = type === "in" ? KATEGORI_MASUK : KATEGORI_KELUAR;
  const category = daftar.includes(String(data.category)) ? String(data.category) : daftar[daftar.length - 1];
  const amount = Math.max(0, Math.round(Number(data.amount) || 0));

  if (!amount) {
    return json(200, { ok: false, sisaScan, limitScan: LIMIT_PER_USER, message: "Nominal tidak terbaca di struk. Isi manual saja." }, origin);
  }

  return json(200, {
    ok: true,
    sisaScan,
    limitScan: LIMIT_PER_USER,
    data: {
      type,
      amount,
      category,
      description: String(data.description || "").slice(0, 60),
      date: /^\d{4}-\d{2}-\d{2}$/.test(String(data.date)) ? String(data.date) : "",
      confidence: data.confidence === "rendah" ? "rendah" : "tinggi",
    },
  }, origin);
};
