/**
 * cek-harga.mjs — pastikan harga yang DITAMPILKAN sama dengan yang MENAGIH.
 *
 * Harga hidup di dua tempat yang sengaja terpisah:
 *
 *   functions/_lib/orders.ts   katalog server — ini yang menagih pembeli
 *   lib/produk.ts              daftar tampilan — ini yang dilihat pengunjung
 *
 * Keduanya tidak bisa saling impor: yang satu berjalan di Cloudflare Workers
 * dengan tipe KVNamespace, yang satu ikut ter-bundle ke peramban. Jadi
 * kecocokannya dijaga di sini, bukan diandaikan.
 *
 * Kalau berbeda, pengunjung melihat satu harga lalu ditagih harga lain.
 *
 * Jalankan: npm run cek:harga
 */
import { readFileSync } from "node:fs";

const baca = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

/** Ambil pasangan id -> price dari sebuah berkas TypeScript, apa adanya. */
function ambilHarga(sumber, { idKey, hargaKey }) {
  const hasil = new Map();
  // Cari blok yang memuat id lalu harga terdekat sesudahnya.
  const pola = new RegExp(
    `${idKey}\\s*:\\s*["']([a-z0-9-]+)["'][\\s\\S]{0,400}?${hargaKey}\\s*:\\s*(\\d+)`,
    "g"
  );
  let cocok;
  while ((cocok = pola.exec(sumber)) !== null) {
    // Jangan menimpa: kemunculan pertama yang dipakai.
    if (!hasil.has(cocok[1])) hasil.set(cocok[1], Number(cocok[2]));
  }
  return hasil;
}

const server = ambilHarga(baca("functions/_lib/orders.ts"), { idKey: "id", hargaKey: "price" });
const tampilan = ambilHarga(baca("lib/produk.ts"), { idKey: "id", hargaKey: "harga" });

if (server.size === 0 || tampilan.size === 0) {
  console.error("GAGAL: tidak ada harga yang terbaca. Pola pencariannya mungkin perlu disesuaikan.");
  process.exit(2);
}

const masalah = [];

for (const [id, harga] of tampilan) {
  if (!server.has(id)) {
    masalah.push(`  ${id}: ada di lib/produk.ts tapi TIDAK ADA di katalog server`);
    continue;
  }
  if (server.get(id) !== harga) {
    masalah.push(
      `  ${id}: tampilan Rp${harga.toLocaleString("id-ID")} vs server Rp${server
        .get(id)
        .toLocaleString("id-ID")}`
    );
  }
}

// Produk yang bisa dibeli tapi tidak pernah ditampilkan juga patut diketahui.
for (const id of server.keys()) {
  if (!tampilan.has(id)) {
    masalah.push(`  ${id}: bisa dibeli di server tapi tidak ditampilkan di /harga`);
  }
}

if (masalah.length) {
  console.error("Harga tampilan TIDAK cocok dengan katalog server:\n");
  console.error(masalah.join("\n"));
  console.error("\nPerbaiki lib/produk.ts atau functions/_lib/orders.ts sampai keduanya sama.");
  process.exit(1);
}

console.log(`Harga cocok untuk ${tampilan.size} produk:`);
for (const [id, harga] of tampilan) {
  console.log(`  ${id.padEnd(22)} Rp${harga.toLocaleString("id-ID")}`);
}
