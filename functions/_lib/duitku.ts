/**
 * duitku.ts — integrasi payment gateway Duitku.
 *
 * Spesifikasi diambil dari SDK RESMI Duitku (github.com/duitkupg/duitku-php),
 * bukan dari ingatan -- rumus signature yang salah membuat pembayaran gagal
 * diam-diam, atau lebih buruk: callback palsu bisa lolos.
 *
 *   Buat transaksi : POST {base}/webapi/api/merchant/v2/inquiry
 *   Signature buat : md5(merchantCode + merchantOrderId + paymentAmount + apiKey)
 *   Signature callback: md5(merchantCode + amount + merchantOrderId + apiKey)
 *   resultCode     : "00" berhasil, "01" gagal
 *
 * Kredensial TIDAK PERNAH ditulis di berkas ini. Diambil dari environment
 * Cloudflare Pages (Settings -> Environment variables, tandai Encrypted):
 *   DUITKU_MERCHANT_CODE
 *   DUITKU_API_KEY
 *   DUITKU_SANDBOX  -> "1" untuk sandbox, selain itu produksi
 */

const SANDBOX_BASE = "https://sandbox.duitku.com";
const PRODUCTION_BASE = "https://passport.duitku.com";

export interface DuitkuEnv {
  DUITKU_MERCHANT_CODE?: string;
  DUITKU_API_KEY?: string;
  DUITKU_SANDBOX?: string;
}

export function duitkuConfigured(env: DuitkuEnv): boolean {
  return Boolean(env.DUITKU_MERCHANT_CODE && env.DUITKU_API_KEY);
}

function baseUrl(env: DuitkuEnv): string {
  return env.DUITKU_SANDBOX === "1" ? SANDBOX_BASE : PRODUCTION_BASE;
}

/** MD5 hex. Workers tidak menyediakan MD5 di WebCrypto, jadi diimplementasikan di sini. */
export function md5(input: string): string {
  const bytes = new TextEncoder().encode(input);

  // Panjang pesan dalam bit, dipadding ke kelipatan 512 bit (64 byte).
  const bitLen = bytes.length * 8;
  const withPad = new Uint8Array(((bytes.length + 8) >> 6 << 6) + 64);
  withPad.set(bytes);
  withPad[bytes.length] = 0x80;
  const view = new DataView(withPad.buffer);
  view.setUint32(withPad.length - 8, bitLen >>> 0, true);
  view.setUint32(withPad.length - 4, Math.floor(bitLen / 0x100000000), true);

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const rotl = (x: number, c: number) => (x << c) | (x >>> (32 - c));

  for (let off = 0; off < withPad.length; off += 64) {
    const M = new Uint32Array(16);
    for (let i = 0; i < 16; i++) M[i] = view.getUint32(off + i * 4, true);

    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + rotl(F, S[i])) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }

  const hex = (n: number) =>
    [0, 8, 16, 24].map((s) => ((n >>> s) & 0xff).toString(16).padStart(2, "0")).join("");
  return hex(a0) + hex(b0) + hex(c0) + hex(d0);
}

/** Bandingkan dua string dalam waktu konstan (hindari timing attack pada signature). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** SHA-256 hex — dipakai untuk endpoint daftar metode pembayaran. */
export async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Waktu lokal format "YYYY-MM-DD HH:mm:ss" seperti yang diminta Duitku. */
function duitkuDatetime(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export type PaymentMethod = {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
};

/**
 * Ambil metode pembayaran yang tersedia untuk suatu nominal.
 *
 * Daftar ini TIDAK di-hardcode karena berbeda per merchant dan per nominal --
 * mis. sebagian metode punya batas minimum. Signature memakai SHA-256, beda
 * dari endpoint lain yang memakai MD5.
 */
export async function getPaymentMethods(
  env: DuitkuEnv,
  amount: number
): Promise<{ ok: true; methods: PaymentMethod[] } | { ok: false; message: string }> {
  const merchantCode = env.DUITKU_MERCHANT_CODE || "";
  const apiKey = env.DUITKU_API_KEY || "";
  if (!merchantCode || !apiKey) return { ok: false, message: "Duitku belum dikonfigurasi." };

  const amt = Math.round(amount);
  const datetime = duitkuDatetime();
  const signature = await sha256(merchantCode + amt + datetime + apiKey);

  try {
    const res = await fetch(`${baseUrl(env)}/webapi/api/merchant/paymentmethod/getpaymentmethod`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantcode: merchantCode, amount: String(amt), datetime, signature }),
    });
    const data = (await res.json()) as { responseCode?: string; responseMessage?: string; paymentFee?: PaymentMethod[] };
    if (data.responseCode !== "00") {
      return { ok: false, message: data.responseMessage || "Gagal mengambil metode pembayaran." };
    }
    return { ok: true, methods: data.paymentFee || [] };
  } catch {
    return { ok: false, message: "Tidak bisa menghubungi Duitku." };
  }
}

export type CreateInvoiceInput = {
  merchantOrderId: string;
  paymentAmount: number;
  /** Kode metode dari getPaymentMethods, mis. "BC" (BCA VA). WAJIB diisi. */
  paymentMethod: string;
  productDetails: string;
  email: string;
  phoneNumber?: string;
  customerVaName: string;
  callbackUrl: string;
  returnUrl: string;
  /** Menit sampai tagihan kedaluwarsa. */
  expiryPeriod?: number;
};

export type CreateInvoiceResult =
  | { ok: true; paymentUrl: string; reference: string }
  | { ok: false; message: string };

export async function createInvoice(
  env: DuitkuEnv,
  input: CreateInvoiceInput
): Promise<CreateInvoiceResult> {
  const merchantCode = env.DUITKU_MERCHANT_CODE || "";
  const apiKey = env.DUITKU_API_KEY || "";
  if (!merchantCode || !apiKey) return { ok: false, message: "Duitku belum dikonfigurasi." };

  // Jumlah HARUS bilangan bulat rupiah; desimal membuat signature tidak cocok.
  const amount = Math.round(input.paymentAmount);
  const signature = md5(merchantCode + input.merchantOrderId + String(amount) + apiKey);

  const body = {
    merchantCode,
    paymentAmount: amount,
    // Wajib -- tanpa ini Duitku membalas 400 "paymentMethod is mandatory".
    paymentMethod: input.paymentMethod,
    merchantOrderId: input.merchantOrderId,
    productDetails: input.productDetails,
    email: input.email,
    phoneNumber: input.phoneNumber || "",
    customerVaName: input.customerVaName,
    callbackUrl: input.callbackUrl,
    returnUrl: input.returnUrl,
    signature,
    expiryPeriod: input.expiryPeriod ?? 60,
  };

  let res: Response;
  try {
    res = await fetch(`${baseUrl(env)}/webapi/api/merchant/v2/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, message: "Tidak bisa menghubungi Duitku." };
  }

  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, message: `Balasan Duitku tidak dapat dibaca (HTTP ${res.status}).` };
  }

  // Duitku memakai statusCode "00" untuk berhasil.
  const statusCode = String(data.statusCode ?? "");
  const paymentUrl = String(data.paymentUrl ?? "");
  if (statusCode !== "00" || !paymentUrl) {
    return { ok: false, message: String(data.statusMessage || "Duitku menolak permintaan.") };
  }

  return { ok: true, paymentUrl, reference: String(data.reference ?? "") };
}

export type CallbackFields = {
  merchantCode: string;
  amount: string;
  merchantOrderId: string;
  resultCode: string;
  reference: string;
  signature: string;
};

/**
 * Verifikasi callback Duitku. WAJIB dipanggil sebelum menganggap pembayaran
 * berhasil -- tanpa ini siapa pun bisa mengirim POST palsu "sudah bayar" dan
 * mendapat kode akses gratis.
 */
export function verifyCallback(env: DuitkuEnv, f: CallbackFields): boolean {
  const apiKey = env.DUITKU_API_KEY || "";
  if (!apiKey) return false;
  if (f.merchantCode !== (env.DUITKU_MERCHANT_CODE || "")) return false;
  const expected = md5(f.merchantCode + f.amount + f.merchantOrderId + apiKey);
  return safeEqual(expected, String(f.signature || "").toLowerCase());
}
