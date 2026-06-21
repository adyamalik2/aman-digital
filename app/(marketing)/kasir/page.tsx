"use client";

import { useState } from "react";
import {
  Zap,
  MessagesSquare,
  PackageOpen,
  Cloud,
  BarChart3,
  WifiOff,
  ScanLine,
  type LucideIcon,
} from "lucide-react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

const APP_URL = "https://amandigital.web.id/aman-kasir/";
const DEMO_WA = wa(
  "Halo, saya ingin minta demo AMAN Kasir untuk warung/toko saya."
);
const BETA_WA = wa(
  "Halo, saya tertarik jadi beta tester AMAN Kasir. Saya punya toko [jenis usaha] di [kota]."
);

/* ---------------- Data ---------------- */

const marqueeItems = [
  "Warung Sembako",
  "Toko Fotocopy",
  "Toko ATK",
  "Coffee Shop",
  "Bengkel Kecil",
  "Toko Komputer",
  "Apotek Mini",
  "Toko Pakaian",
];

const heroTrust = [
  "Tanpa Kartu Kredit",
  "Buka Langsung di Browser",
  "Buatan Indonesia",
];

const problems = [
  {
    num: "01",
    title: "Sinyal hilang, transaksi berhenti",
    desc: "Pelanggan menunggu, kasir bingung, antrian makin panjang. Aplikasi yang butuh internet jadi tidak berguna saat dibutuhkan.",
  },
  {
    num: "02",
    title: "Stok tidak akurat, modal terkunci",
    desc: "Catatan manual sering salah. Stok di buku berbeda dengan barang asli. Modal habis untuk barang yang ternyata masih ada.",
  },
  {
    num: "03",
    title: "Laba tidak jelas, asal jualan ramai",
    desc: "Toko ramai tapi tidak tahu laba sebenarnya. Kasih diskon asal-asalan, ternyata rugi tanpa sadar.",
  },
  {
    num: "04",
    title: "Data hilang saat HP rusak",
    desc: "Catatan bertahun-tahun lenyap dalam sekejap. Tidak ada backup, tidak ada referensi untuk pajak atau evaluasi.",
  },
];

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Zap,
    title: "Transaksi <15 Detik",
    desc: "Search produk → pilih → bayar → struk. Tanpa loading panjang, tanpa antrian frustrasi.",
  },
  {
    icon: MessagesSquare,
    title: "Support Bahasa Indonesia",
    desc: "Dukungan dan dokumentasi 100% Bahasa Indonesia. Tanya via WhatsApp, dijawab cepat.",
  },
  {
    icon: PackageOpen,
    title: "Master Data Produk",
    desc: "Produk lengkap dengan SKU, barcode, kategori, dan multi-satuan. Stok berkurang otomatis tiap transaksi, plus koreksi, histori, dan impor/ekspor CSV.",
  },
  {
    icon: Cloud,
    title: "Backup Lokal & Cloud",
    desc: "Export semua data ke JSON kapan saja. Atau aktifkan backup otomatis ke Google. Data milikmu, di tanganmu.",
  },
  {
    icon: BarChart3,
    title: "Laporan & Export",
    desc: "Ringkasan penjualan, produk terlaris, laba dan margin, piutang pelanggan, sampai stok menipis. Export PDF, CSV, atau JPG untuk WhatsApp.",
  },
];

const demos = [
  {
    title: "Transaksi kilat + scan barcode",
    desc: "Cari atau scan barcode, hitung kembalian otomatis, simpan & cetak struk dari satu layar.",
  },
  {
    title: "Master data produk lengkap",
    desc: "SKU, barcode, kategori, harga modal/jual, stok multi-satuan, plus impor/ekspor CSV.",
  },
  {
    title: "Laporan penjualan & laba",
    desc: "Ringkasan grafik, produk terlaris, laba & margin, piutang, stok menipis, sampai histori stok.",
  },
];

const steps = [
  {
    num: "01",
    title: "Buka Aman Kasir dari browser HP",
    desc: "Buka amandigital.web.id/aman-kasir/ dari Chrome atau browser modern di HP.",
  },
  {
    num: "02",
    title: "Tambahkan ke layar utama",
    desc: 'Gunakan menu browser lalu pilih "Tambahkan ke layar utama" agar Aman Kasir terasa seperti aplikasi biasa.',
  },
  {
    num: "03",
    title: "Mulai catat transaksi dan stok",
    desc: "Tambahkan produk, catat transaksi, lalu stok dan laporan harian ikut diperbarui secara otomatis.",
  },
];

const cocok = [
  {
    title: "Bisa dipakai saat internet tidak stabil",
    desc: "Transaksi tetap tersimpan di perangkat saat koneksi tidak tersedia.",
  },
  {
    title: "Ringan untuk HP sederhana",
    desc: "Didesain untuk dipakai dari browser HP tanpa instalasi berat.",
  },
  {
    title: "Stok otomatis berkurang",
    desc: "Setiap transaksi membantu memperbarui stok agar rekap lebih rapi.",
  },
  {
    title: "Laporan harian mudah dibaca",
    desc: "Omzet, laba, transaksi, dan produk laris dibuat lebih mudah dipantau.",
  },
  {
    title: "Backup lokal dan cloud",
    desc: "Data bisa diamankan lewat backup lokal dan sinkronisasi cloud saat tersedia.",
  },
  {
    title: "Export PDF, CSV, atau JPG",
    desc: "Laporan bisa dibagikan ke pemilik, admin, atau pelanggan sesuai kebutuhan.",
  },
];

type Plan = {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  note: string;
  cta: { label: string; href: string };
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Gratis",
    tagline: "Untuk warung mikro",
    price: "Rp 0",
    period: "/selamanya",
    features: [
      "100 transaksi per bulan",
      "Stok barang & laporan dasar",
      "Export PDF & backup lokal",
      "Offline penuh",
    ],
    note: "Batasan: cocok untuk toko mikro dengan transaksi bulanan terbatas.",
    cta: { label: "Coba Gratis Sekarang", href: APP_URL },
  },
  {
    name: "Dasar",
    tagline: "Toko kecil aktif",
    price: "Rp 49rb",
    period: "/bulan",
    features: [
      "500 transaksi per bulan",
      "Stok, laporan dasar, export PDF",
      "Backup lokal",
      "Support WhatsApp 24 jam",
    ],
    note: "Batasan: belum termasuk cloud backup dan export Excel.",
    cta: {
      label: "Hubungi via WhatsApp",
      href: wa(
        "Halo AMAN Digital, saya ingin tanya paket Dasar AMAN Kasir."
      ),
    },
  },
  {
    name: "Pro",
    tagline: "Toko berkembang",
    price: "Rp 99rb",
    period: "/bulan",
    featured: true,
    features: [
      "Transaksi unlimited",
      "Cloud backup harian & export Excel",
      "Multi pengguna (5 user)",
      "Prioritas support 2 jam",
    ],
    note: "Paket Lifetime tersedia, hubungi kami via WhatsApp.",
    cta: {
      label: "Hubungi via WhatsApp",
      href: wa("Halo AMAN Digital, saya ingin tanya paket Pro AMAN Kasir."),
    },
  },
];

const faqs = [
  {
    q: "Apakah bisa dipakai tanpa internet?",
    a: "Bisa. Transaksi dan perubahan stok disimpan di perangkat saat koneksi tidak tersedia. Saat internet aktif, data dapat disinkronkan kembali sesuai pengaturan backup yang digunakan.",
  },
  {
    q: "Apakah ada versi gratis?",
    a: "Ya. Paket Gratis tidak punya batas waktu. Cukup untuk warung mikro dengan transaksi sampai 100/bulan dan maksimal 50 produk. Tidak ada iklan, tidak ada paksaan upgrade.",
  },
  {
    q: "Apakah bisa dipakai di HP biasa?",
    a: "AMAN Kasir didesain untuk HP Android entry-level (Xiaomi Redmi 9A, Samsung A03, dll). RAM 2GB sudah cukup. Tidak butuh chip kencang karena semua proses ringan dan disimpan di perangkat.",
  },
  {
    q: "Data saya aman? Kalau HP hilang gimana?",
    a: "Data utama tersimpan di perangkat. Jika backup cloud diaktifkan, data mengikuti mekanisme akun dan layanan cloud yang digunakan. Backup lokal bisa di-export berkala agar data tetap bisa dipulihkan saat HP rusak atau hilang.",
  },
  {
    q: "Bisa cetak struk via printer thermal?",
    a: "Fitur printer Bluetooth sedang dikembangkan untuk versi berikutnya. Saat ini struk bisa di-export sebagai JPG dan dikirim ke pelanggan via WhatsApp — solusi banyak warung modern di Indonesia.",
  },
  {
    q: "Beda AMAN Kasir dengan Moka atau Pawoon?",
    a: "Fokus AMAN Kasir ada pada pemakaian ringan dari browser HP, pencatatan yang tetap berjalan saat internet tidak stabil, dan alur yang sederhana untuk warung atau toko kecil. Paket Gratis tersedia untuk kebutuhan dasar, lalu bisa upgrade jika butuh fitur lebih.",
  },
  {
    q: "Bagaimana cara mulai pakai?",
    a: 'Klik "Coba Gratis Sekarang", buka dari browser HP, tambahkan ke layar utama, lalu mulai isi produk dan catat transaksi. Jika ingin dipandu, gunakan tombol "Minta Demo via WhatsApp".',
  },
  {
    q: "Bagaimana cara dapat support?",
    a: "Chat WhatsApp langsung ke tim AMAN Digital. Bahasa Indonesia, jam kerja 09.00–21.00 WIB. Untuk paket Pro, response time prioritas 2 jam. Untuk paket Dasar, dijawab dalam 24 jam. Untuk paket Gratis, dijawab dalam 3 hari kerja.",
  },
];

/* ---------------- Demo mockups ---------------- */

const stockBadge = (text: string, tone: "ok" | "out") =>
  tone === "ok"
    ? "bg-emerald/10 text-emerald"
    : "bg-red-100 text-red-600";

function KasirMock() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-3">
      <div className="flex items-center gap-1.5">
        <div className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[9px] text-slate-400">
          Cari produk atau scan…
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[9px] font-semibold text-navy">
          <ScanLine size={9} /> Scan
        </div>
      </div>
      {[
        { n: "Buku Tulis", q: "2 × Rp5.000", t: "Rp10.000" },
        { n: "Spidol", q: "1 × Rp12.000", t: "Rp12.000" },
      ].map((r) => (
        <div
          key={r.n}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-1.5"
        >
          <div>
            <p className="text-[9px] font-bold leading-none text-navy">{r.n}</p>
            <p className="text-[8px] text-slate-500">{r.q}</p>
          </div>
          <p className="font-mono text-[9px] font-bold text-navy">{r.t}</p>
        </div>
      ))}
      <div className="mt-auto flex items-center justify-between rounded-lg bg-gradient-to-br from-emerald to-emerald-dark p-2 text-white">
        <div>
          <p className="text-[7px] uppercase tracking-wider text-white/70">
            Total
          </p>
          <p className="font-mono text-[11px] font-bold leading-none">
            Rp22.000
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-[9px] font-bold text-emerald-dark">
          Bayar
        </span>
      </div>
    </div>
  );
}

function ProdukMock() {
  const rows = [
    { n: "Buku Tulis", m: "PRD-CHA0Z0XG · Alat Tulis", p: "Rp5.000", s: "18 pcs", tone: "ok" as const },
    { n: "Spidol", m: "PRD-00005 · Alat Tulis", p: "Rp12.000", s: "Habis", tone: "out" as const },
    { n: "Print Warna", m: "PRD-00003 · Fotokopi", p: "Rp2.000", s: "9999 lbr", tone: "ok" as const },
  ];
  return (
    <div className="flex h-full flex-col gap-1.5 p-3">
      <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[8px] text-slate-400">
        Cari nama, SKU, atau barcode…
      </div>
      <div className="flex gap-1">
        <span className="rounded-full bg-emerald px-1.5 py-0.5 text-[7px] text-white">
          Semua
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[7px] text-slate-500">
          Alat Tulis
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[7px] text-slate-500">
          Fotokopi
        </span>
      </div>
      {rows.map((r) => (
        <div
          key={r.n}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-1.5"
        >
          <div>
            <p className="text-[9px] font-bold leading-none text-navy">{r.n}</p>
            <p className="text-[7px] text-slate-500">{r.m}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] font-bold text-emerald">{r.p}</p>
            <span
              className={`rounded px-1 text-[7px] ${stockBadge(r.s, r.tone)}`}
            >
              {r.s}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LaporanMock() {
  const bars = [40, 70, 52, 88, 64, 78, 100];
  return (
    <div className="flex h-full flex-col gap-1.5 p-3">
      <div className="rounded-lg border border-slate-200 bg-white p-2">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[8px] font-bold text-navy">Omzet 7 Hari</p>
          <p className="font-mono text-[8px] font-bold text-emerald">Rp4,2jt</p>
        </div>
        <div className="flex h-9 items-end gap-1">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t bg-emerald"
              style={{ height: `${h}%`, opacity: 0.4 + (h / 100) * 0.6 }}
            />
          ))}
        </div>
      </div>
      {[
        { l: "Produk Terlaris", c: "bg-emerald" },
        { l: "Laba & Margin", c: "bg-emerald-light" },
        { l: "Piutang", c: "bg-amber-500" },
      ].map((r) => (
        <div
          key={r.l}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5"
        >
          <span className={`h-3 w-3 rounded-md ${r.c}`} />
          <p className="text-[8px] font-semibold text-navy">{r.l}</p>
        </div>
      ))}
    </div>
  );
}

const demoMocks = [KasirMock, ProdukMock, LaporanMock];

/* ---------------- Page ---------------- */

export default function KasirPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="relative overflow-hidden px-4 pb-16 pt-28 sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12">
          <div className="stagger lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald-light">
              <span className="ping-dot h-1.5 w-1.5 rounded-full bg-emerald" />
              Versi Awal — Gratis untuk Early Adopter
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Kasir yang{" "}
              <em className="font-light italic text-emerald-light">
                jalan terus,
              </em>{" "}
              walau sinyal pergi.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              AMAN Kasir membantu warung, toko kecil, dan UMKM mencatat
              transaksi, stok, omzet, dan laba meski internet tidak stabil.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-emerald-dark"
              >
                Coba Gratis Sekarang →
              </a>
              <a
                href={DEMO_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:border-emerald hover:text-emerald-light"
              >
                Minta Demo via WhatsApp
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-slate-400">
              {heroTrust.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-emerald">✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="w-[260px] rounded-[2.2rem] bg-navy p-2 shadow-2xl">
              <div className="overflow-hidden rounded-[1.8rem] bg-slate-100">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pb-3 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald text-white">
                      🛒
                    </span>
                    <div className="leading-tight">
                      <p className="text-xs font-bold text-navy">
                        AMAN DIGITAL
                      </p>
                      <p className="text-[9px] text-slate-500">16 Juni 2026</p>
                    </div>
                  </div>
                  <span className="h-6 w-6 rounded-full border border-slate-200 bg-slate-100" />
                </div>
                <div className="space-y-3 px-3.5 py-3">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark p-3.5 text-white">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/75">
                      ↗ Omzet Hari Ini
                    </p>
                    <p className="mt-1 font-mono text-xl font-bold">
                      Rp 4.247.000
                    </p>
                    <p className="mt-1 text-[9px] text-white/75">
                      47 transaksi · AMAN DIGITAL
                    </p>
                    <div className="mt-2.5 rounded-lg bg-white py-1.5 text-center text-[10px] font-bold text-emerald-dark">
                      Mulai Transaksi
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                      <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                        Transaksi
                      </p>
                      <p className="mt-0.5 font-mono text-base font-bold text-navy">
                        47
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                      <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                        Laba
                      </p>
                      <p className="mt-0.5 font-mono text-base font-bold text-emerald">
                        Rp 1,2jt
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-2.5 py-2">
                    <span className="text-sm">⚠️</span>
                    <div className="leading-tight">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-red-600">
                        Stok Habis
                      </p>
                      <p className="text-[9px] text-slate-700">
                        1 produk kehabisan stok
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2">
                    <span className="text-sm">🔔</span>
                    <div className="leading-tight">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-amber-600">
                        Peringatan Stok
                      </p>
                      <p className="text-[9px] text-slate-700">
                        1 produk stok menipis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <section className="overflow-hidden bg-navy py-7">
        <div className="animate-marquee">
          {/* Two identical copies so the -50% loop is seamless */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-6 px-3 text-lg font-light italic text-white sm:text-xl"
            >
              {marqueeItems.map((m) => (
                <span key={m} className="flex items-center gap-6 whitespace-nowrap">
                  {m}
                  <span className="text-emerald-light">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Tantangan Nyata
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Pernah kehilangan catatan transaksi karena sinyal mati?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Kebanyakan aplikasi kasir butuh internet untuk transaksi. Padahal
              di Indonesia, sinyal sering tidak stabil — terutama di Aceh, NTT,
              Maluku, dan daerah lain. AMAN Kasir didesain dari nol untuk
              masalah ini.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            {problems.map((p) => (
              <div key={p.num} className="bg-white p-8 lg:p-10">
                <span className="font-mono text-5xl font-light text-emerald">
                  {p.num}
                </span>
                <h3 className="mt-4 text-xl font-bold text-navy">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="fitur" className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Apa yang Berbeda
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Dirancang untuk realita toko di Indonesia.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            {/* Offline-first big card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-7 lg:p-12">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-white">
                  <WifiOff size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald">
                  Offline-First Sejati
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-bold leading-tight text-navy lg:text-3xl">
                100% berfungsi tanpa internet.
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Bukan &quot;online dengan fallback&quot;. Setiap transaksi,
                perubahan stok, dan laporan tersimpan langsung di HP. Internet
                hanya untuk backup cloud — opsional, bukan wajib.
              </p>
              <div className="mt-5 inline-block rounded-md bg-emerald/5 px-3 py-1.5 font-mono text-sm text-emerald-dark">
                ✓ Transaksi tetap tersimpan di HP walau internet putus
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Dirancang agar setiap transaksi tersimpan langsung di perangkat
                saat koneksi tidak tersedia, lalu bisa disinkronkan kembali
                ketika internet aktif.
              </p>
            </div>

            {/* Two stacked cards */}
            <div className="grid gap-6 lg:col-span-5">
              {features.slice(0, 2).map((f) => {
                const Icon = f.icon;
                return (
                <div
                  key={f.title}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {f.desc}
                  </p>
                </div>
                );
              })}
            </div>

            {/* Three bottom cards */}
            {features.slice(2).map((f) => {
              const Icon = f.icon;
              return (
              <div
                key={f.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-4"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== DEMO VISUAL ===== */}
      <section id="demo" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Demo Visual
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Gambaran tampilan yang dipakai kasir setiap hari.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Tampilan nyata AMAN Kasir — dari transaksi & scan barcode, master
              data produk, sampai laporan lengkap.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {demos.map((d, i) => {
              const Mock = demoMocks[i];
              return (
              <div
                key={d.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <Mock />
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {d.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="cara-kerja" className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Cara Kerja
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Cara pakai Aman Kasir dari browser HP.
            </h2>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num}>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-6xl font-light text-emerald">
                    {s.num}
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COCOK UNTUK TOKO KECIL ===== */}
      <section id="cocok" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Cocok untuk Toko Kecil
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Kenapa Aman Kasir cocok untuk warung dan toko kecil?
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cocok.map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <h3 className="text-lg font-bold text-navy">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section
        id="harga"
        className="relative overflow-hidden py-20 text-white"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-light">
              Harga
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Mulai dari{" "}
              <em className="font-light italic text-emerald-light">gratis</em> —
              selamanya.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Paket Gratis benar-benar gratis tanpa batas waktu. Upgrade ke
              Dasar atau Pro kapan saja jika butuh fitur lebih.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-7 ${
                  plan.featured
                    ? "bg-white text-navy"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Paling Populer
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p
                  className={`mt-1 text-xs uppercase tracking-wider ${
                    plan.featured ? "text-slate-500" : "text-white/60"
                  }`}
                >
                  {plan.tagline}
                </p>
                <div className="mt-5">
                  <span className="text-4xl font-bold sm:text-5xl">
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.featured ? "text-slate-500" : "text-white/60"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-emerald">✓</span>
                      <span
                        className={plan.featured ? "text-slate-700" : "text-white/90"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  className={`mt-5 rounded-2xl border p-3 text-xs ${
                    plan.featured
                      ? "border-navy/10 text-slate-600"
                      : "border-white/10 text-white/65"
                  }`}
                >
                  {plan.note}
                </div>
                <a
                  href={plan.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 block rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                    plan.featured
                      ? "bg-emerald text-white hover:bg-emerald-dark"
                      : "border border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta.label}
                </a>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-white/60">
            Saat ini AMAN Kasir di tahap{" "}
            <strong className="text-white">Early Access</strong> — semua fitur
            Pro tersedia gratis untuk early adopter. Harga di atas berlaku
            setelah rilis resmi.
          </p>
        </div>
      </section>

      {/* ===== WAITING LIST ===== */}
      <section id="waiting-list" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            Program Beta
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Jadi <em className="font-light italic text-emerald">early adopter</em>{" "}
            AMAN Kasir.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            20 toko pertama yang gabung akan dapat{" "}
            <strong>akses Pro gratis 1 tahun</strong>, sesi onboarding pribadi,
            dan masukan langsung dipertimbangkan untuk fitur berikutnya.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={BETA_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-emerald-dark"
            >
              Daftar Beta via WhatsApp
            </a>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy px-8 py-4 text-center font-semibold text-navy transition-colors hover:bg-slate-50"
            >
              Coba Dulu Sebelum Daftar
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Tidak butuh kartu kredit. Tidak ada syarat. Cukup punya HP Android
            dan satu toko.
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Pertanyaan Umum
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Yang sering ditanya.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-bold text-navy"
                  >
                    {item.q}
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald/10 text-emerald transition-transform ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {open && (
                    <p className="px-6 pb-6 leading-relaxed text-slate-600">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-gradient-to-br from-white to-slate-100 py-24">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">
            Mulai catat transaksi hari ini.
            <br />
            <em className="font-light italic text-emerald">Bisa coba gratis.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Tidak perlu instal Play Store. Tidak butuh kartu kredit. Buka dari
            browser HP dan mulai rapikan transaksi, stok, omzet, dan laba.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald px-10 py-5 text-lg font-semibold text-white transition-colors hover:bg-emerald-dark"
            >
              Saya Mau Coba Aman Kasir →
            </a>
            <a
              href={DEMO_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy px-10 py-5 text-lg font-semibold text-navy transition-colors hover:bg-slate-50"
            >
              Minta Demo via WhatsApp
            </a>
          </div>
          <p className="mt-6 font-mono text-xs text-slate-500">
            amandigital.web.id/aman-kasir/
          </p>
        </div>
      </section>
    </>
  );
}
