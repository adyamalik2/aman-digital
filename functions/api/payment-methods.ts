/**
 * GET /api/payment-methods?produk=aman-poster
 *
 * Daftar metode pembayaran yang tersedia untuk harga produk tersebut.
 * Nominal diambil dari katalog server, bukan dari permintaan -- daftar metode
 * bergantung pada nominal (sebagian metode punya batas minimum), jadi kalau
 * nominal bisa dikirim dari browser, daftarnya bisa dimanipulasi.
 */

import { getPaymentMethods, type DuitkuEnv } from "../_lib/duitku";
import { getProduct } from "../_lib/orders";

interface Env extends DuitkuEnv {
  AMAN_LEDGER: KVNamespace;
}

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const produk = new URL(context.request.url).searchParams.get("produk") || "";
  const product = getProduct(produk);
  if (!product) return json(400, { ok: false, message: "Produk tidak dikenal." });

  const hasil = await getPaymentMethods(context.env, product.price);
  if (!hasil.ok) {
    // 200 dengan ok:false, bukan 5xx -- Cloudflare mengganti balasan 5xx dari
    // Function dengan halaman galatnya sendiri, sehingga pesan aslinya hilang
    // dan pengguna hanya melihat "error code: 502".
    return json(200, { ok: false, message: hasil.message });
  }

  return json(200, {
    ok: true,
    amount: product.price,
    methods: hasil.methods.map((m) => ({
      kode: m.paymentMethod,
      nama: m.paymentName,
      gambar: m.paymentImage,
      biaya: Number(m.totalFee || 0),
    })),
  });
};
