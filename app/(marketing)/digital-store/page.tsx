"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  MousePointerClick,
  HardDriveDownload,
  Infinity as InfinityIcon,
  Smartphone,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

const CHECKOUT = "https://lynk.id/adya.malik/v3xngqxp56vj/checkout";
const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;
const TANYA_WA = wa(
  "Halo AMAN Digital, saya ingin tanya tentang 700+ Produk Digital 2026."
);

/* ---------------- Data ----------------
   Semua angka & contoh di bawah diambil dari isi katalog yang sebenarnya
   (app/(marketing)/produk-digital/katalog/page.tsx) — 44 produk terkurasi
   dalam 4 kategori. Jangan ubah angkanya tanpa mengecek katalog dulu. */

const kategori: {
  ikon: string;
  label: string;
  jumlah: number;
  contoh: string[];
}[] = [
  {
    ikon: "☪️",
    label: "Produk Islami",
    jumlah: 15,
    contoh: [
      "Tadarus Qur'an",
      "Waktu Sholat",
      "Arah Kiblat",
      "Dzikir Pagi Petang",
      "Ceklis Ibadah",
    ],
  },
  {
    ikon: "🧒",
    label: "Produk Anak-Anak",
    jumlah: 12,
    contoh: [
      "39.000 Printable Anak",
      "Video Edukasi",
      "Worksheet",
      "Flash Card",
      "Quiz Anak SD",
    ],
  },
  {
    ikon: "🎮",
    label: "Game Ringan",
    jumlah: 10,
    contoh: [
      "Bounce Nokia",
      "Tetris Mobile",
      "Puzzle Hewan",
      "Balap Mobil",
      "Tangkap Hewan",
    ],
  },
  {
    ikon: "🎁",
    label: "Produk Bonus",
    jumlah: 7,
    contoh: [
      "10.000 Template Canva",
      "Pembuat Soal Ujian",
      "Pembuat Materi Ajar",
      "Bank Konten",
      "Perpustakaan",
    ],
  },
];

const nilai: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: MousePointerClick,
    title: "Tinggal Klik, Langsung Terbuka",
    desc: "Semua produk dibuka lewat browser. Tidak perlu unduh satu per satu, tidak perlu pasang aplikasi tambahan.",
  },
  {
    icon: KeyRound,
    title: "Satu Kode untuk Semuanya",
    desc: "Sekali beli, dapat satu kode akses. Masukkan sekali, seluruh katalog terbuka — tidak ada pembelian menyusul.",
  },
  {
    icon: HardDriveDownload,
    title: "Plus Folder Drive 700+ Berkas",
    desc: "Selain 44 produk terkurasi, Anda juga mendapat akses folder Google Drive berisi lebih dari 700 berkas lengkap.",
  },
  {
    icon: Smartphone,
    title: "Bisa dari HP",
    desc: "Dibuka dari HP, tablet, atau laptop. Cocok dipakai langsung saat mendampingi anak atau menyiapkan bahan ajar.",
  },
  {
    icon: InfinityIcon,
    title: "Akses Selamanya",
    desc: "Bayar sekali, bukan langganan bulanan. Kode akses Anda tetap berlaku untuk membuka katalog kapan saja.",
  },
  {
    icon: Boxes,
    title: "Terkurasi, Bukan Asal Banyak",
    desc: "44 pilihan disusun per kategori supaya Anda cepat menemukan yang dicari, bukan tumpukan berkas tanpa penataan.",
  },
];

const untukSiapa: { emoji: string; title: string; desc: string }[] = [
  {
    emoji: "👨‍👩‍👧",
    title: "Orang Tua",
    desc: "Bahan belajar dan hiburan anak yang siap pakai tanpa harus mencari-cari di internet.",
  },
  {
    emoji: "👩‍🏫",
    title: "Guru & Pengajar",
    desc: "Worksheet, pembuat soal ujian, dan materi ajar untuk memangkas waktu persiapan mengajar.",
  },
  {
    emoji: "🕌",
    title: "Keluarga Muslim",
    desc: "Pendamping ibadah harian — tadarus, waktu sholat, dzikir, dan ceklis ibadah dalam satu tempat.",
  },
  {
    emoji: "💼",
    title: "Pegiat Konten",
    desc: "10.000 template Canva dan bank konten sebagai modal awal membuat materi promosi.",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Setelah membayar, bagaimana cara mengaksesnya?",
    a: "Anda akan menerima kode akses. Buka halaman katalog di situs ini, masukkan kode tersebut satu kali, dan seluruh isi katalog langsung terbuka. Kode itu diingat di perangkat Anda, jadi kunjungan berikutnya tidak perlu mengetik ulang.",
  },
  {
    q: "Apakah ini langganan bulanan?",
    a: "Bukan. Sekali bayar, kode akses Anda tetap berlaku. Tidak ada tagihan berulang.",
  },
  {
    q: "Perlu mengunduh berkasnya satu per satu?",
    a: "Tidak. Semua produk dibuka langsung lewat browser dengan sekali klik. Untuk folder Google Drive, Anda tetap bisa mengunduh berkas tertentu bila memang diperlukan.",
  },
  {
    q: "Bisa dipakai di HP?",
    a: "Bisa. Katalog dan sebagian besar produknya dirancang agar tetap nyaman dibuka dari layar HP, jadi tidak harus menyalakan laptop.",
  },
  {
    q: "Kode aksesnya bisa dipakai di berapa perangkat?",
    a: "Satu kode bisa dipakai di beberapa perangkat milik Anda sendiri, misalnya HP dan laptop. Kalau perangkat Anda berganti, hubungi kami lewat WhatsApp untuk direset.",
  },
];

/* ---------------- Page ---------------- */

export default function DigitalStorePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-20 pt-28 text-center sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-emerald-light">
            <span className="ping-dot h-2 w-2 rounded-full bg-emerald" />
            Produk Digital 2026
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            44 Produk Digital Terkurasi
            <br />
            <span className="text-emerald-light">+ 700 Berkas Bonus</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Bahan ibadah, edukasi anak, game ringan, sampai template konten —
            semuanya terbuka dengan satu kode akses. Tinggal klik, tanpa
            mengunduh satu per satu.
          </p>

          {/* Harga */}
          <div className="mt-10 inline-flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.04] px-10 py-7">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">Rp 49.000</span>
              <span className="text-xl text-slate-500 line-through">
                Rp 200.000
              </span>
            </div>
            <span className="mt-3 rounded-full bg-emerald/15 px-4 py-1 text-xs font-bold text-emerald-light">
              Bayar sekali · Akses selamanya
            </span>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={CHECKOUT}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-cta px-8 py-3.5 text-center font-semibold text-white transition-colors hover:bg-emerald-cta-hover"
            >
              🛒 Beli Sekarang
            </a>
            <Link
              href="/produk-digital/katalog"
              className="rounded-full border border-white/30 px-8 py-3.5 text-center font-semibold text-white transition-colors hover:border-emerald hover:text-emerald-light"
            >
              Sudah punya kode? Masuk →
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span>✓ Tanpa langganan</span>
            <span>✓ Buka langsung di browser</span>
            <span>✓ Bisa dari HP</span>
          </div>
        </div>
      </section>

      {/* ===== ISI KATALOG ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-dark">
              Isi Katalog
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Apa saja yang Anda dapatkan
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              44 produk terkurasi, dikelompokkan jadi empat kategori supaya
              mudah dicari.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {kategori.map((k) => (
              <div
                key={k.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{k.ikon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{k.label}</h3>
                    <span className="text-sm font-semibold text-emerald-dark">
                      {k.jumlah} produk
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {k.contoh.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                  <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-dark">
                    +{k.jumlah - k.contoh.length} lainnya
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-emerald/25 bg-emerald/5 p-6 text-center">
            <p className="text-base font-bold text-navy">
              🎁 Bonus: folder Google Drive berisi 700+ berkas
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Di luar 44 produk di atas, Anda juga mendapat akses ke folder
              berisi lebih dari 700 berkas tambahan yang bisa dibuka maupun
              diunduh sesuai kebutuhan.
            </p>
          </div>
        </div>
      </section>

      {/* ===== KENAPA ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-dark">
              Kenapa Ini Praktis
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Dibuat supaya langsung bisa dipakai
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nilai.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-emerald">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {n.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== UNTUK SIAPA ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-dark">
              Cocok Untuk
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Paling terasa manfaatnya untuk
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {untukSiapa.map((u) => (
              <div
                key={u.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <div className="text-4xl">{u.emoji}</div>
                <h3 className="mt-3 text-base font-bold text-navy">
                  {u.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CARA PAKAI ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-dark">
              Cara Pakai
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Dari bayar sampai terbuka, 3 langkah
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                num: 1,
                title: "Beli lewat Lynk.id",
                desc: "Pembayaran diproses lewat Lynk.id. Setelah lunas, kode akses Anda dikirimkan.",
              },
              {
                num: 2,
                title: "Masukkan Kode Sekali",
                desc: "Buka halaman katalog di situs ini, masukkan kode akses. Perangkat Anda langsung diingat.",
              },
              {
                num: 3,
                title: "Klik & Pakai",
                desc: "Seluruh katalog terbuka. Pilih kategorinya, klik produknya, langsung jalan di browser.",
              },
            ].map((s) => (
              <div key={s.num} className="flex items-start gap-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-cta text-lg font-black text-white">
                  {s.num}
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-navy">
              Pertanyaan yang Sering Ditanyakan
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
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-navy"
                  >
                    {item.q}
                    <span
                      className={`text-emerald transition-transform ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <p
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    hidden={!open}
                    className="px-5 pb-5 text-sm leading-relaxed text-slate-600"
                  >
                    {item.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA AKHIR ===== */}
      <section className="bg-white pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-dark to-emerald p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Satu kali beli, kepakai terus
              </h2>
              <p className="mt-4 text-lg text-emerald-50">
                Rp 49.000 untuk 44 produk terkurasi plus 700+ berkas bonus —
                tanpa langganan, tanpa biaya lanjutan.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={CHECKOUT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-8 py-3.5 font-bold text-emerald transition-colors hover:bg-slate-100"
                >
                  🛒 Beli Sekarang
                </a>
                <a
                  href={TANYA_WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-white/60 px-8 py-3.5 font-bold text-white transition-colors hover:bg-white/10"
                >
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
