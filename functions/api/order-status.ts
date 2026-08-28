/**
 * GET /api/order-status?order=XXX — dipakai halaman /checkout/selesai untuk
 * menampilkan hasil pembayaran dan kode akses.
 *
 * Sengaja hanya membalas data seperlunya. Nama, telepon, dan nominal tidak
 * dikembalikan supaya orang yang menebak-nebak ID pesanan tidak memperoleh
 * data pribadi pembeli. Kode akses hanya keluar bila pesanan memang lunas.
 */

import { getProduct, loadOrder } from "../_lib/orders";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const orderId = new URL(context.request.url).searchParams.get("order") || "";
  if (!orderId) return json(400, { ok: false, message: "Nomor pesanan tidak ada." });

  const order = await loadOrder(context.env.AMAN_LEDGER, orderId);
  if (!order) return json(404, { ok: false, message: "Pesanan tidak ditemukan." });

  const product = getProduct(order.productId);
  return json(200, {
    ok: true,
    status: order.status,
    productName: product?.name ?? order.productId,
    masukPath: product?.masukPath ?? "/",
    code: order.status === "paid" ? order.code : undefined,
  });
};
