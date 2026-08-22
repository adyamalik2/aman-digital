/**
 * /admin/api/codes — kelola kode akses (lihat, buat, reset perangkat, cabut).
 * Dipakai oleh dashboard admin (fetch dari browser, sesudah lolos gerbang
 * _middleware.ts). Satu endpoint untuk semua produk yang memakai AMAN_LEDGER
 * KV bersama, dibedakan lewat awalan kode.
 */
import { loadEntry, saveEntry, unindexToken, type LedgerEntry } from "../../_lib/ledger";

interface Env {
  AMAN_LEDGER: KVNamespace;
}

const PRODUCTS: Record<string, { prefix: string; label: string }> = {
  "produk-digital": { prefix: "PROD-", label: "AMAN Product Digital" },
  "aman-engine": { prefix: "AMAN-", label: "AMAN Engine" },
  "aman-content-engine": { prefix: "AMCE-", label: "AMAN Content Engine" },
  "aman-poster": { prefix: "AMPG-", label: "AMAN Poster Generator" },
};

const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const jsonOk = (data: unknown) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

async function generateUniqueCode(kv: KVNamespace, prefix: string): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 10; attempt++) {
    let suffix = "";
    for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    const code = prefix + suffix;
    if ((await kv.get(code)) === null) return code;
  }
  throw new Error("Gagal membuat kode unik setelah beberapa percobaan.");
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const productKey = url.searchParams.get("product") || "";
  const product = PRODUCTS[productKey];
  if (!product) return jsonError(400, "Produk tidak dikenal.");

  const list = await context.env.AMAN_LEDGER.list({ prefix: product.prefix });
  const entries = await Promise.all(
    list.keys.map(async (k) => {
      const entry = await loadEntry(context.env.AMAN_LEDGER, k.name);
      return { code: k.name, ...entry };
    })
  );
  entries.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return jsonOk({ product: productKey, label: product.label, codes: entries });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: Record<string, unknown>;
  try {
    body = await context.request.json();
  } catch {
    return jsonError(400, "Format permintaan tidak valid.");
  }

  const productKey = String(body.product || "");
  const product = PRODUCTS[productKey];
  if (!product) return jsonError(400, "Produk tidak dikenal.");
  const kv = context.env.AMAN_LEDGER;
  const action = String(body.action || "");

  if (action === "generate") {
    const code = await generateUniqueCode(kv, product.prefix);
    const entry: LedgerEntry = {
      devices: [],
      via: "admin",
      date: new Date().toISOString(),
      buyer: typeof body.buyer === "string" && body.buyer.trim() ? body.buyer.trim() : undefined,
      phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : undefined,
    };
    await saveEntry(kv, code, entry);
    return jsonOk({ ok: true, code });
  }

  const code = String(body.code || "");
  if (!code || !code.startsWith(product.prefix)) return jsonError(400, "Kode tidak valid.");

  if (action === "resetdev") {
    const entry = await loadEntry(kv, code);
    if (!entry) return jsonError(404, "Kode tidak ditemukan.");
    for (const token of entry.devices) await unindexToken(kv, token);
    entry.devices = [];
    await saveEntry(kv, code, entry);
    return jsonOk({ ok: true });
  }

  if (action === "revoke") {
    const entry = await loadEntry(kv, code);
    if (entry) for (const token of entry.devices) await unindexToken(kv, token);
    await kv.delete(code);
    return jsonOk({ ok: true });
  }

  return jsonError(400, "Aksi tidak dikenal.");
};
