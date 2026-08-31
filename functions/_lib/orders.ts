/**
 * orders.ts — katalog produk & siklus pesanan untuk checkout di situs sendiri.
 *
 * Katalog ada DI SERVER dengan sengaja. Harga tidak boleh datang dari browser:
 * kalau harga dikirim dari sisi klien, pembeli bisa mengubahnya jadi Rp1.000
 * lewat devtools sebelum tagihan dibuat.
 *
 * Pesanan disimpan di KV AMAN_LEDGER dengan awalan "order:" supaya tidak
 * bentrok dengan key kode akses (yang memakai kodenya sendiri sebagai key).
 */

import { saveEntry, type LedgerEntry } from "./ledger";

/** Produk yang bisa dibeli. `id` dipakai di URL checkout. */
export type ProductId =
  | "aman-engine"
  | "aman-content-engine"
  | "aman-poster"
  | "produk-digital"
  | "amanin-bulanan"
  | "amanin-tahunan"
  | "amanin-selamanya";

export type Product = {
  id: ProductId;
  name: string;
  /** Rupiah, bilangan bulat. Harus sama dengan yang tertulis di halaman produk. */
  price: number;
  /** Awalan kode akses yang diterbitkan untuk produk ini. */
  codePrefix: string;
  /** Ke mana pembeli diarahkan untuk memakai produknya. */
  masukPath: string;
  /**
   * Masa berlaku dalam hari, untuk produk berlangganan. Kosong = selamanya.
   * Dipakai issueAccessCode untuk mengisi `expiresAt` pada kodenya.
   */
  durasiHari?: number;
};

export const PRODUCTS: Record<ProductId, Product> = {
  "aman-engine": {
    id: "aman-engine",
    name: "AMAN Engine",
    price: 39000,
    codePrefix: "ENG",
    masukPath: "/aman-engine/masuk",
  },
  "aman-content-engine": {
    id: "aman-content-engine",
    name: "AMAN Content Engine",
    price: 39000,
    codePrefix: "CEN",
    masukPath: "/aman-content-engine/masuk",
  },
  "aman-poster": {
    id: "aman-poster",
    name: "AMAN Poster Generator",
    price: 39000,
    codePrefix: "PST",
    masukPath: "/aman-poster/masuk",
  },
  "produk-digital": {
    id: "produk-digital",
    name: "Produk Digital (700+)",
    price: 49000,
    codePrefix: "PROD",
    masukPath: "/produk-digital",
  },

  // --- AMAN-in. Tiga cara bayar untuk aplikasi yang sama. ---
  // Harganya ditetapkan Malik 01-09-2026; lihat KEPUTUSAN.md K-15.
  // Kode aktivasinya diikat ke akun Firebase, bukan cookie perangkat --
  // lihat bindAccount() di ledger.ts.
  "amanin-bulanan": {
    id: "amanin-bulanan",
    name: "AMAN-in Pro — Bulanan",
    price: 25000,
    codePrefix: "AIB",
    masukPath: "/amanin",
    durasiHari: 30,
  },
  "amanin-tahunan": {
    id: "amanin-tahunan",
    name: "AMAN-in Pro — Tahunan",
    price: 144000,
    codePrefix: "AIT",
    masukPath: "/amanin",
    durasiHari: 365,
  },
  "amanin-selamanya": {
    id: "amanin-selamanya",
    name: "AMAN-in Pro — Bayar Sekali",
    price: 199000,
    codePrefix: "AIS",
    masukPath: "/amanin",
    // Tanpa durasiHari: berlaku selamanya.
  },
};

/** Ketiga produk yang membuka AMAN-in Pro. */
export const PRODUK_AMANIN: ProductId[] = ["amanin-bulanan", "amanin-tahunan", "amanin-selamanya"];

export function getProduct(id: string): Product | null {
  return (PRODUCTS as Record<string, Product>)[id] ?? null;
}

export type OrderStatus = "pending" | "paid" | "failed";

export type Order = {
  orderId: string;
  productId: ProductId;
  amount: number;
  email: string;
  phone: string;
  name: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  reference?: string;
  /** Kode akses yang diterbitkan setelah lunas. */
  code?: string;
};

const orderKey = (orderId: string) => `order:${orderId}`;

export async function loadOrder(kv: KVNamespace, orderId: string): Promise<Order | null> {
  const raw = await kv.get(orderKey(orderId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

export async function saveOrder(kv: KVNamespace, order: Order): Promise<void> {
  await kv.put(orderKey(order.orderId), JSON.stringify(order));
}

/**
 * ID pesanan: dipakai sebagai merchantOrderId ke Duitku, jadi harus unik dan
 * cukup pendek. Waktu + acak sudah memadai untuk volume situs ini.
 */
export function newOrderId(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `AD${t}${r}`;
}

/** Kode akses baru, dengan awalan produk supaya jelas untuk apa. */
function newAccessCode(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  // Tanpa huruf/angka yang mudah tertukar saat dibaca manual (0/O, 1/I).
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (const b of bytes) body += alphabet[b % alphabet.length];
  return `${prefix}-${body.slice(0, 4)}-${body.slice(4, 8)}`;
}

/**
 * Terbitkan kode akses untuk sebuah pesanan yang sudah lunas.
 *
 * `product` disimpan di entri ledger supaya kode ini HANYA membuka produk yang
 * dibeli. Kode lama yang tidak punya field itu tetap berlaku seperti semula
 * (lihat catatan di ledger.ts) agar pembeli lama tidak kehilangan akses.
 */
export async function issueAccessCode(
  kv: KVNamespace,
  order: Order
): Promise<string> {
  const product = PRODUCTS[order.productId];
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newAccessCode(product.codePrefix);
    // Jangan menimpa kode yang sudah ada milik pembeli lain.
    const existing = await kv.get(code);
    if (existing) continue;

    const entry: LedgerEntry = {
      devices: [],
      via: "duitku",
      date: new Date().toISOString(),
      buyer: order.name,
      phone: order.phone,
      email: order.email,
      product: order.productId,
      orderId: order.orderId,
    };
    // Produk berlangganan diberi masa berlaku; produk bayar-sekali tidak,
    // supaya perilakunya sama persis dengan kode yang sudah terbit selama ini.
    if (product.durasiHari) {
      entry.expiresAt = new Date(Date.now() + product.durasiHari * 86400_000).toISOString();
    }
    await saveEntry(kv, code, entry);
    return code;
  }
  throw new Error("Gagal membuat kode akses unik");
}
