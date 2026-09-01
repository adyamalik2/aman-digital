/**
 * amanin.ts — hak akses AMAN-in Pro, dipakai bersama oleh beberapa endpoint.
 *
 * Ada di berkas sendiri supaya `/api/amanin-aktivasi` dan `/api/ocr-nota`
 * memakai definisi "Pro" yang sama persis. Kalau masing-masing punya
 * salinannya sendiri, suatu saat yang satu diperbaiki dan yang lain tidak,
 * lalu fitur berbayar bocor lewat endpoint yang terlupakan.
 */

import { loadEntry, sudahKedaluwarsa } from "./ledger";
import { PRODUCTS } from "./orders";

/** Indeks uid Firebase → kode akses yang diikat ke akun itu. */
export const kunciAkun = (uid: string) => `amanin:akun:${uid}`;

export type StatusPro =
  | { pro: false; alasan?: "kedaluwarsa" }
  | { pro: true; kode: string; produk: string; namaPaket: string; sampai: string | null };

/**
 * Apakah akun ini punya AMAN-in Pro yang masih berlaku?
 *
 * Sengaja TIDAK menghapus ikatan saat kedaluwarsa: kalau nanti diperpanjang
 * dengan kode yang sama, slotnya masih miliknya dan tidak menghabiskan kuota
 * akun baru.
 */
export async function statusPro(kv: KVNamespace, uid: string): Promise<StatusPro> {
  const kode = await kv.get(kunciAkun(uid));
  if (!kode) return { pro: false };

  const entry = await loadEntry(kv, kode);
  if (!entry || !entry.devices.includes(uid)) {
    // Ikatannya sudah tidak sah lagi (kode dihapus admin, atau slotnya dicabut).
    await kv.delete(kunciAkun(uid));
    return { pro: false };
  }
  if (sudahKedaluwarsa(entry)) return { pro: false, alasan: "kedaluwarsa" };

  const produk = entry.product ? PRODUCTS[entry.product as keyof typeof PRODUCTS] : null;
  return {
    pro: true,
    kode,
    produk: entry.product || "",
    namaPaket: produk?.name || "AMAN-in Pro",
    sampai: entry.expiresAt || null, // null = selamanya
  };
}
