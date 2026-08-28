/**
 * POST /api/duitku-callback — notifikasi pembayaran dari Duitku.
 *
 * Ini endpoint PALING SENSITIF di situs: yang memutuskan apakah sebuah
 * pesanan dianggap lunas dan kode akses diterbitkan. Tiga hal wajib dijaga:
 *
 *   1. Signature diverifikasi lebih dulu. Tanpa itu, siapa pun bisa mengirim
 *      POST "sudah bayar" dan mendapat kode akses gratis.
 *   2. Jumlah yang dibayar dicocokkan dengan harga pesanan. Signature yang sah
 *      untuk nominal Rp1.000 tidak boleh membuka produk Rp39.000.
 *   3. Idempoten. Duitku dapat mengirim callback yang sama lebih dari sekali;
 *      kode akses hanya boleh terbit satu kali per pesanan.
 *
 * Duitku mengirim form-encoded, bukan JSON.
 */

import { verifyCallback, type DuitkuEnv } from "../_lib/duitku";
import { issueAccessCode, loadOrder, saveOrder } from "../_lib/orders";

interface Env extends DuitkuEnv {
  AMAN_LEDGER: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;

  let form: FormData;
  try {
    form = await context.request.formData();
  } catch {
    return new Response("bad request", { status: 400 });
  }
  const get = (k: string) => String(form.get(k) ?? "");

  const fields = {
    merchantCode: get("merchantCode"),
    amount: get("amount"),
    merchantOrderId: get("merchantOrderId"),
    resultCode: get("resultCode"),
    reference: get("reference"),
    signature: get("signature"),
  };

  if (!verifyCallback(env, fields)) {
    // Jangan menjelaskan bagian mana yang salah.
    return new Response("invalid signature", { status: 403 });
  }

  const order = await loadOrder(env.AMAN_LEDGER, fields.merchantOrderId);
  if (!order) return new Response("order not found", { status: 404 });

  // Sudah pernah diproses -- balas OK supaya Duitku berhenti mengulang.
  if (order.status === "paid") return new Response("OK", { status: 200 });

  if (fields.resultCode !== "00") {
    order.status = "failed";
    await saveOrder(env.AMAN_LEDGER, order);
    return new Response("OK", { status: 200 });
  }

  // Nominal harus persis sama dengan harga pesanan.
  if (Math.round(Number(fields.amount)) !== Math.round(order.amount)) {
    order.status = "failed";
    await saveOrder(env.AMAN_LEDGER, order);
    return new Response("amount mismatch", { status: 400 });
  }

  const code = await issueAccessCode(env.AMAN_LEDGER, order);
  order.status = "paid";
  order.paidAt = new Date().toISOString();
  order.reference = fields.reference || order.reference;
  order.code = code;
  await saveOrder(env.AMAN_LEDGER, order);

  return new Response("OK", { status: 200 });
};
