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
  return context.next();
};
