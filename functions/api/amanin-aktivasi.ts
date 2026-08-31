/**
 * POST /api/amanin-aktivasi — aktifkan AMAN-in Pro dengan kode akses.
 *
 * KENAPA TIDAK MEMAKAI JALUR LOGIN TOOL WEB
 *
 * Tool web (Engine, Content Engine, Poster) mengikat kode ke cookie perangkat
 * lewat middleware. AMAN-in tidak bisa begitu: ia berjalan sebagai APK
 * Capacitor maupun sebagai web, dan penggunanya berpindah HP sambil membawa
 * akunnya. Jadi kode diikat ke uid Firebase — lihat bindAccount() di ledger.ts.
 *
 * KENAPA HARUS LEWAT SERVER
 *
 * Kalau aplikasi memeriksa kodenya sendiri, siapa pun bisa membaca bundelnya
 * dan menemukan cara melewati pemeriksaan. Hanya server yang memegang KV
 * berisi daftar kode yang sah.
 *
 * PEMERIKSAAN JADWAL ULANG
 *
 * Endpoint ini juga dipanggil berkala tanpa kode (hanya idToken) untuk
 * memeriksa apakah langganan masih berlaku. Tanpa itu, langganan bulanan yang
 * sudah habis akan tetap aktif selamanya di perangkat yang sudah terlanjur
 * mengaktifkannya.
 */

import {
  loadEntry,
  bindAccount,
  sudahKedaluwarsa,
  type LedgerEntry,
} from "../_lib/ledger";
import { PRODUCTS, PRODUK_AMANIN } from "../_lib/orders";
import { checkUsageLimit } from "../_lib/ratelimit";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

/** Kunci web Firebase AMAN-in. Publik dari sananya (tertanam di bundel app);
 *  di sini cuma dipakai untuk MEMVERIFIKASI token, bukan memberi akses. */
const AMANIN_FIREBASE_KEY = "AIzaSyBuA7CX1k88qGEouQx1tCY9Gq0H41H9PaY";

const ALLOWED_ORIGINS = [
  "https://amanin.amandigital.my.id",
  "https://localhost",      // APK Android (Capacitor)
  "capacitor://localhost",
  "http://localhost:5173",
  "http://localhost:4173",
];

/** Berapa kali satu akun boleh mencoba kode dalam sehari. Menahan tebak-tebakan. */
const BATAS_COBA = 20;
const JENDELA = 60 * 60 * 24;

/** Indeks uid → kode, supaya pemeriksaan berkala tidak perlu kodenya lagi. */
const kunciAkun = (uid: string) => `amanin:akun:${uid}`;

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

/** Bentuk jawaban yang dipahami aplikasi. */
function entitlement(entry: LedgerEntry, code: string) {
  const produk = entry.product ? PRODUCTS[entry.product as keyof typeof PRODUCTS] : null;
  return {
    pro: true,
    kode: code,
    produk: entry.product || "",
    namaPaket: produk?.name || "AMAN-in Pro",
    // null berarti selamanya.
    sampai: entry.expiresAt || null,
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get("Origin") || "";
  const kv = context.env.AMAN_LEDGER;

  let body: { idToken?: string; code?: string };
  try {
    body = await context.request.json();
  } catch {
    return json(400, { ok: false, message: "Permintaan tidak valid." }, origin);
  }

  const idToken = String(body.idToken || "");
  if (!idToken) {
    return json(401, { ok: false, message: "Silakan masuk dulu." }, origin);
  }

  const uid = await verifyIdToken(idToken);
  if (!uid) {
    return json(401, { ok: false, message: "Sesi Anda sudah berakhir. Masuk ulang lalu coba lagi." }, origin);
  }

  const kode = String(body.code || "").trim().toUpperCase();

  // ---- Tanpa kode: pemeriksaan berkala apakah langganan masih berlaku ----
  if (!kode) {
    const tersimpan = await kv.get(kunciAkun(uid));
    if (!tersimpan) return json(200, { ok: true, pro: false }, origin);

    const entry = await loadEntry(kv, tersimpan);
    if (!entry || !entry.devices.includes(uid)) {
      await kv.delete(kunciAkun(uid));
      return json(200, { ok: true, pro: false }, origin);
    }
    if (sudahKedaluwarsa(entry)) {
      // Ikatannya sengaja TIDAK dihapus: kalau nanti diperpanjang dengan kode
      // yang sama, slotnya masih miliknya dan tidak menghabiskan kuota baru.
      return json(200, { ok: true, pro: false, alasan: "kedaluwarsa" }, origin);
    }
    return json(200, { ok: true, ...entitlement(entry, tersimpan) }, origin);
  }

  // ---- Dengan kode: aktivasi ----
  const tunggu = await checkUsageLimit(kv, "amanin-aktivasi", uid, BATAS_COBA, JENDELA);
  if (tunggu !== null) {
    return json(429, {
      ok: false,
      message: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(tunggu / 3600)} jam.`,
    }, origin);
  }

  const hasil = await bindAccount(kv, kode, uid, PRODUK_AMANIN);

  if (hasil.status === "invalid") {
    return json(200, { ok: false, message: "Kode tidak dikenali. Periksa lagi penulisannya." }, origin);
  }
  if (hasil.status === "kedaluwarsa") {
    return json(200, { ok: false, message: "Masa berlaku kode ini sudah habis. Perpanjang untuk melanjutkan." }, origin);
  }
  if (hasil.status === "penuh") {
    return json(200, { ok: false, message: "Kode ini sudah dipakai di terlalu banyak akun." }, origin);
  }

  // Simpan indeks uid → kode supaya pemeriksaan berkala tidak butuh kodenya.
  await kv.put(kunciAkun(uid), kode);
  return json(200, { ok: true, ...entitlement(hasil.entry!, kode) }, origin);
};
