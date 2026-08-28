/**
 * POST /api/checkout — buat pesanan lalu minta tagihan ke Duitku.
 *
 * Body JSON: { productId, name, email, phone }
 * Balasan   : { ok: true, orderId, paymentUrl } atau { ok: false, message }
 *
 * Harga TIDAK diambil dari permintaan. Selalu dari katalog server
 * (functions/_lib/orders.ts) -- kalau harga dikirim dari browser, pembeli bisa
 * mengubahnya sebelum tagihan dibuat.
 */

import { createInvoice, duitkuConfigured, type DuitkuEnv } from "../_lib/duitku";
import { getProduct, newOrderId, saveOrder, type Order } from "../_lib/orders";
import { clientIp, ratelimitFail, ratelimitWait } from "../_lib/ratelimit";

interface Env extends DuitkuEnv {
  AMAN_LEDGER: KVNamespace;
}

const RATE_SCOPE = "checkout";

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

// Sengaja longgar: tujuannya menangkap salah ketik yang jelas, bukan menolak
// alamat sah yang bentuknya tidak biasa.
const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;

  if (!duitkuConfigured(env)) {
    return json(503, { ok: false, message: "Pembayaran belum aktif. Hubungi kami lewat WhatsApp." });
  }

  const ip = clientIp(context.request);
  if ((await ratelimitWait(env.AMAN_LEDGER, RATE_SCOPE, ip)) > 0) {
    return json(429, { ok: false, message: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." });
  }

  let body: Record<string, unknown>;
  try {
    body = await context.request.json();
  } catch {
    return json(400, { ok: false, message: "Permintaan tidak valid." });
  }

  const product = getProduct(String(body.productId || ""));
  if (!product) {
    await ratelimitFail(env.AMAN_LEDGER, RATE_SCOPE, ip);
    return json(400, { ok: false, message: "Produk tidak dikenal." });
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().slice(0, 191);
  const phone = String(body.phone || "").trim().slice(0, 30);
  const paymentMethod = String(body.paymentMethod || "").trim().slice(0, 8);

  if (!name) return json(400, { ok: false, message: "Nama wajib diisi." });
  if (!looksLikeEmail(email)) {
    return json(400, { ok: false, message: "Email tidak valid. Kode akses dikirim ke sini." });
  }
  if (!paymentMethod) {
    return json(400, { ok: false, message: "Pilih metode pembayaran dulu." });
  }

  const orderId = newOrderId();
  const order: Order = {
    orderId,
    productId: product.id,
    amount: product.price,
    email,
    phone,
    name,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await saveOrder(env.AMAN_LEDGER, order);

  const origin = new URL(context.request.url).origin;
  const invoice = await createInvoice(env, {
    merchantOrderId: orderId,
    paymentAmount: product.price,
    paymentMethod,
    productDetails: product.name,
    email,
    phoneNumber: phone,
    customerVaName: name,
    callbackUrl: `${origin}/api/duitku-callback`,
    returnUrl: `${origin}/checkout/selesai?order=${encodeURIComponent(orderId)}`,
    expiryPeriod: 60,
  });

  if (!invoice.ok) {
    order.status = "failed";
    await saveOrder(env.AMAN_LEDGER, order);
    // 200 dengan ok:false, bukan 5xx: Cloudflare mengganti balasan 5xx dari
    // Function dengan halaman galatnya sendiri, sehingga pesan asli dari
    // Duitku hilang dan pembeli hanya melihat "error code: 502".
    return json(200, { ok: false, message: invoice.message });
  }

  order.reference = invoice.reference;
  await saveOrder(env.AMAN_LEDGER, order);

  return json(200, { ok: true, orderId, paymentUrl: invoice.paymentUrl });
};
