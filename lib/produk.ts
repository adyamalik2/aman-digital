/**
 * produk.ts — daftar produk yang BISA DIBELI SEKARANG, untuk ditampilkan.
 *
 * ⚠ INI BUKAN SUMBER KEBENARAN HARGA.
 *
 * Yang menagih pembeli adalah katalog di server: `functions/_lib/orders.ts`.
 * Berkas ini hanya untuk ditampilkan di halaman `/harga`. Kalau keduanya
 * berbeda, pengunjung melihat satu harga lalu ditagih harga lain.
 *
 * Karena itu ada penjaga otomatis: `scripts/cek-harga.mjs` membandingkan
 * berkas ini dengan katalog server dan gagal kalau ada yang tidak cocok.
 * Jalankan `npm run cek:harga` setelah mengubah harga di mana pun.
 *
 * Harga ditetapkan Malik — lihat KEPUTUSAN.md K-15 untuk AMAN-in.
 */

export type ProdukSekaliBeli = {
  /** Sama persis dengan `id` di katalog server. */
  id: string;
  nama: string;
  harga: number;
  satuan: string;
  ringkas: string;
  /** Halaman produknya di situs ini. */
  halaman: string;
  /** Ditandai sebagai pilihan yang disarankan pada kelompoknya. */
  disarankan?: boolean;
};

/** Alat berbasis kode akses — bayar sekali, langsung jalan di peramban. */
export const ALAT_BAYAR_SEKALI: ProdukSekaliBeli[] = [
  {
    id: "aman-engine",
    nama: "AMAN Engine",
    harga: 39000,
    satuan: "bayar sekali",
    ringkas: "Storyboard AI untuk konten TikTok & Instagram",
    halaman: "/aman-engine",
  },
  {
    id: "aman-content-engine",
    nama: "AMAN Content Engine",
    harga: 39000,
    satuan: "bayar sekali",
    ringkas: "Naskah dan ide konten siap pakai",
    halaman: "/aman-content-engine",
  },
  {
    id: "aman-poster",
    nama: "AMAN Poster Generator",
    harga: 39000,
    satuan: "bayar sekali",
    ringkas: "Poster promosi jadi dalam hitungan menit",
    halaman: "/aman-poster",
  },
  {
    id: "produk-digital",
    nama: "Produk Digital (700+)",
    harga: 49000,
    satuan: "bayar sekali",
    ringkas: "700+ berkas digital siap pakai — boleh dijual ulang",
    halaman: "/digital-store",
  },
];

/** AMAN-in Pro — satu aplikasi, tiga cara bayar. */
export const PAKET_AMANIN: ProdukSekaliBeli[] = [
  {
    id: "amanin-bulanan",
    nama: "Bulanan",
    harga: 25000,
    satuan: "per bulan",
    ringkas: "Berhenti kapan saja",
    halaman: "/amanin",
  },
  {
    id: "amanin-tahunan",
    nama: "Tahunan",
    harga: 144000,
    satuan: "per tahun",
    ringkas: "Setara Rp12.000/bulan — hemat 52%",
    halaman: "/amanin",
    disarankan: true,
  },
  {
    id: "amanin-selamanya",
    nama: "Bayar Sekali",
    harga: 199000,
    satuan: "sekali bayar",
    ringkas: "Tanpa perpanjangan",
    halaman: "/amanin",
  },
];

export const checkoutUrl = (id: string) => `/checkout?produk=${encodeURIComponent(id)}`;

export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");
