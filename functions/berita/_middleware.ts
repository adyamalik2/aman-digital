/**
 * Middleware /berita/* — naikkan artikel terjadwal yang waktunya sudah
 * lewat sebelum melayani permintaan apa pun di bawah /berita/. Dibatasi
 * sekali per menit lewat KV (lihat promoteScheduledArticles), jadi aman
 * dipanggil di tiap request. Kegagalan di sini tidak boleh mematikan
 * halaman publik -- ini tugas pemeliharaan latar belakang, bukan jalur
 * kritis.
 */
import { promoteScheduledArticles } from "../_lib/news";

interface Env {
  DB: D1Database;
  AMAN_LEDGER: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    await promoteScheduledArticles(context.env.DB, context.env.AMAN_LEDGER);
  } catch {
    // best-effort, jangan sampai halaman publik ikut gagal
  }

  // Rute-rute /berita/* cuma mengekspor onRequestGet, jadi HEAD (dipakai
  // Next.js untuk prefetch link, plus crawler/uptime monitor) balas 404.
  // Jalankan sebagai GET lalu buang body-nya.
  if (context.request.method === "HEAD") {
    const res = await context.next(context.request.url, { method: "GET" });
    return new Response(null, { status: res.status, statusText: res.statusText, headers: res.headers });
  }

  return context.next();
};
