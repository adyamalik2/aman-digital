"use client";

import { useState } from "react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

const APP_URL = "https://amandigital.web.id/aman-budget/";
const TANYA_WA = wa("Halo AMAN Digital, saya ingin tanya tentang AMAN Budget.");

/* ---------------- Data ---------------- */

const masalah = [
  {
    icon: "👨‍👩‍👧",
    title: "Tak Tahu Siapa Habis Berapa",
    desc: "Pengeluaran Ayah, Bunda, dan kebutuhan anak campur jadi satu — sulit tahu ke mana uang keluarga mengalir.",
  },
  {
    icon: "🐷",
    title: "Susah Konsisten Menabung",
    desc: "Niat menabung untuk umrah, sekolah, atau dana darurat sering terpakai karena tak ada target yang jelas.",
  },
  {
    icon: "🔔",
    title: "Lupa Tagihan & Zakat",
    desc: "Tagihan telat, zakat lupa dihitung, dan di akhir bulan bingung kenapa saldo cepat menipis.",
  },
];

const fitur = [
  {
    icon: "👥",
    title: "Catat per Grup Keluarga",
    desc: "Setiap transaksi dicatat per anggota — Ayah, Bunda, anak. Lihat jelas siapa pemasukan dan siapa pengeluaran terbesar.",
  },
  {
    icon: "🎯",
    title: "Goals Tabungan Keluarga",
    desc: "Buat target — umrah, sekolah, dana darurat — lalu hubungkan transaksi ke goal agar progres menabung terlihat nyata.",
  },
  {
    icon: "🧮",
    title: "Kalkulator Zakat",
    desc: "Hitung zakat penghasilan 2,5% otomatis. Tunaikan kewajiban tanpa repot menghitung manual.",
  },
  {
    icon: "🔄",
    title: "Transfer Planner",
    desc: "Alokasikan dan bagi anggaran bulanan per anggota keluarga supaya pengeluaran tetap terkendali.",
  },
  {
    icon: "🔔",
    title: "Reminder Tagihan",
    desc: "Pengingat jatuh tempo otomatis untuk listrik, cicilan, dan langganan — tidak ada lagi telat bayar.",
  },
  {
    icon: "📊",
    title: "Laporan & Arus Kas",
    desc: "Distribusi pengeluaran per grup dan arus kas mingguan dalam grafik yang mudah dibaca.",
  },
];

const demos = [
  {
    title: "Tambah transaksi per grup",
    desc: "Pilih tipe, grup keluarga, kategori, status, dan hubungkan ke goal tabungan.",
  },
  {
    title: "Laporan keluarga yang jelas",
    desc: "Distribusi pengeluaran per grup dan arus kas mingguan dalam grafik mudah dibaca.",
  },
  {
    title: "Fitur lengkap untuk keluarga",
    desc: "Transfer Planner, Zakat, Family Sync, Reminder Tagihan, OCR Struk, dan Export laporan.",
  },
];

const steps = [
  {
    num: "1",
    title: "Buka aplikasi & login",
    desc: "Buka AMAN Budget dari browser HP Anda. Login dengan akun Google atau email — tanpa daftar panjang.",
  },
  {
    num: "2",
    title: "Atur grup & catat transaksi",
    desc: "Tambahkan anggota keluarga (Ayah, Bunda), lalu catat transaksi: pilih grup, kategori, nominal, dan status. Simpan.",
  },
  {
    num: "3",
    title: "Pantau & capai target keluarga",
    desc: "Lihat saldo, rekap per grup, progres goals tabungan, dan laporan bulanan keluarga Anda dalam satu layar.",
  },
];

type CheckItem = { label: string; included: boolean; badge?: string };

type Plan = {
  name: string;
  price: string;
  period: string;
  cta: { label: string; href: string };
  featured?: boolean;
  items: CheckItem[];
};

const plans: Plan[] = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    cta: { label: "Mulai Gratis", href: APP_URL },
    items: [
      { label: "100 transaksi/bulan", included: true },
      { label: "Hingga 3 goals tabungan", included: true },
      { label: "Kalkulator Zakat & Transfer Planner", included: true },
      { label: "Laporan arus kas & rekap per grup", included: true },
      { label: "Backup lokal & cloud", included: true },
      {
        label: "Family Sync, Reminder, OCR, AI Insight, Export",
        included: false,
      },
    ],
  },
  {
    name: "Dasar",
    price: "Rp 49rb",
    period: "per bulan",
    cta: {
      label: "Pilih Paket Dasar",
      href: wa(
        "Halo AMAN Digital, saya ingin tanya paket Dasar AMAN Budget."
      ),
    },
    items: [
      { label: "500 transaksi/bulan", included: true },
      { label: "10 goals tabungan", included: true },
      { label: "Kalkulator Zakat & Transfer Planner", included: true },
      { label: "Laporan lengkap", included: true },
      { label: "Support WA 24 jam", included: true },
      { label: "Family Sync, OCR Struk, AI Insight", included: false },
    ],
  },
  {
    name: "Pro",
    price: "Rp 99rb",
    period: "per bulan",
    featured: true,
    cta: {
      label: "Upgrade ke Pro",
      href: wa("Halo AMAN Digital, saya ingin upgrade AMAN Budget Pro."),
    },
    items: [
      { label: "Transaksi & goals unlimited", included: true },
      {
        label: "Family Sync — sync dengan pasangan",
        included: true,
        badge: "Segera Hadir",
      },
      { label: "Reminder Tagihan otomatis", included: true },
      {
        label: "OCR Struk & Export PDF/Excel",
        included: true,
        badge: "Segera Hadir",
      },
      { label: "AI Insight keuangan", included: true, badge: "Segera Hadir" },
      { label: "Prioritas support 2 jam", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Apakah AMAN Budget benar-benar gratis?",
    a: "Ya, paket Gratis bisa dipakai tanpa batas waktu — catat transaksi, grup keluarga, kalkulator zakat, dan hingga 3 goals tabungan. Tersedia paket Dasar Rp 49rb/bulan dan Pro Rp 99rb/bulan untuk fitur lebih lengkap seperti Family Sync, Reminder Tagihan, dan OCR Struk.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Data tersimpan di perangkat dan bisa di-backup ke cloud (login Google). Hanya Anda — dan pasangan jika mengaktifkan Family Sync — yang dapat mengakses catatan keuangan keluarga.",
  },
  {
    q: "Apakah bisa dipakai di HP yang tidak canggih?",
    a: "Bisa. AMAN Budget berbasis web dan cukup diakses dari browser HP Anda — Chrome, Firefox, atau browser bawaan Android/iOS sudah cukup.",
  },
  {
    q: "Bagaimana cara upgrade ke paket berbayar?",
    a: "Hubungi kami via WhatsApp dan tim kami akan membantu proses upgrade. Pembayaran bisa via transfer bank.",
  },
];

/* ---------------- Page ---------------- */

export default function BudgetPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-20 pt-28 sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-emerald-light">
              <span className="h-2 w-2 rounded-full bg-emerald" />
              AMAN Budget
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Atur keuangan keluarga,
              <br />
              <span className="text-emerald-light">
                tenang sampai akhir bulan.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 lg:mx-0 md:text-xl">
              Catat pemasukan & pengeluaran per anggota keluarga, atur target
              tabungan, hitung zakat, dan jangan sampai lewat tagihan — semua
              dari HP.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald px-8 py-3.5 text-center font-semibold text-white transition-colors hover:bg-emerald-dark"
              >
                Coba AMAN Budget Gratis
              </a>
              <a
                href={TANYA_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 px-8 py-3.5 text-center font-semibold text-white transition-colors hover:border-emerald hover:text-emerald-light"
              >
                Tanya Dulu via WhatsApp
              </a>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-[280px] max-w-[88vw] rounded-[2.4rem] bg-navy p-2 shadow-2xl">
              <div className="overflow-hidden rounded-[2rem] bg-slate-100">
                <div className="bg-gradient-to-b from-emerald-light via-emerald to-emerald-dark p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="leading-tight">
                      <p className="text-[9px] opacity-85">Assalamu&apos;alaikum,</p>
                      <p className="text-[13px] font-extrabold">
                        Budi Santoso 👋
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[8px] font-extrabold text-amber-900">
                      Pro
                    </span>
                  </div>
                  <p className="mt-3 text-[8px] tracking-wider opacity-85">
                    SALDO AKTUAL · JUNI 2026
                  </p>
                  <p className="font-mono text-2xl font-extrabold">
                    Rp 3.450.000
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white/20 px-2 py-1.5">
                      <p className="text-[7px] opacity-90">↗ PEMASUKAN</p>
                      <p className="text-xs font-bold">Rp 18jt</p>
                    </div>
                    <div className="rounded-lg bg-white/20 px-2 py-1.5">
                      <p className="text-[7px] opacity-90">↘ PENGELUARAN</p>
                      <p className="text-xs font-bold">Rp 18jt</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { e: "🔄", l: "Transfer" },
                      { e: "🧮", l: "Zakat" },
                      { e: "🎯", l: "Goals" },
                      { e: "📤", l: "Export" },
                    ].map((q) => (
                      <div
                        key={q.l}
                        className="rounded-lg border border-slate-200 bg-white px-1 py-1.5 text-center"
                      >
                        <div className="text-sm">{q.e}</div>
                        <p className="text-[6.5px] font-semibold text-slate-600">
                          {q.l}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[6.5px] tracking-wide text-slate-500">
                          PROGRESS BULAN INI
                        </p>
                        <p className="text-base font-extrabold leading-none text-emerald">
                          100%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[6.5px] text-slate-500">SISA AMAN</p>
                        <p className="text-[11px] font-extrabold text-emerald">
                          Rp 96rb
                        </p>
                      </div>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-emerald/15">
                      <div className="h-full w-full bg-emerald" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                    <p className="mb-1.5 text-[9px] font-bold text-navy">
                      Rekap per Grup
                    </p>
                    {[
                      { c: "bg-pink-500", l: "Bunda", v: "Rp 12jt" },
                      { c: "bg-blue-500", l: "Ayah", v: "Rp 6,0jt" },
                      { c: "bg-emerald", l: "Zakat/Sedekah", v: "Rp 458rb" },
                    ].map((r) => (
                      <div
                        key={r.l}
                        className="mb-1 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5 text-[9px] text-slate-600">
                          <span className={`h-1.5 w-1.5 rounded-full ${r.c}`} />
                          {r.l}
                        </span>
                        <span className="text-[9px] font-bold text-navy">
                          {r.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MASALAH ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
            Kenapa Ini Penting?
          </span>
          <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
            Gaji masuk, lalu hilang entah ke mana sebelum akhir bulan
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            Pengeluaran kecil yang tak tercatat, uang antar anggota keluarga
            yang campur, dan target tabungan yang tak pernah tercapai — masalah
            keuangan rumah tangga yang sangat umum.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {masalah.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-left"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-2xl">
                  {m.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">
                  {m.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FITUR UTAMA ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
              Fitur Utama
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Semua yang dibutuhkan untuk kelola keuangan keluarga
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fitur.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEMO VISUAL ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
              Tampilan Aplikasi
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Lihat tampilan nyata AMAN Budget
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Dari tambah transaksi per grup, laporan keluarga, hingga fitur
              lengkap — semua dirancang sederhana.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {demos.map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-5xl">
                  📱
                </div>
                <h3 className="text-base font-bold text-navy">{d.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CARA PAKAI ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
              Cara Pakai
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Mulai dalam 3 langkah mudah
            </h2>
          </div>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald text-lg font-black text-white">
                  {s.num}
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-emerald px-8 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-dark"
            >
              Mulai Gratis Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* ===== HARGA ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
              Paket Harga
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Mulai gratis, upgrade saat butuh
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Mulai gratis tanpa kartu kredit. Upgrade ke Pro kapan saja saat
              keluarga butuh fitur lebih.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border-2 bg-white p-7 ${
                  plan.featured
                    ? "border-emerald shadow-[0_20px_50px_rgba(5,150,105,0.15)]"
                    : "border-slate-200"
                }`}
              >
                {plan.featured && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl bg-emerald px-4 py-1 text-xs font-extrabold text-white">
                    Paling Populer
                  </div>
                )}
                <div
                  className={`text-sm font-bold ${
                    plan.name === "Gratis" ? "text-slate-500" : "text-emerald"
                  }`}
                >
                  {plan.name.toUpperCase()}
                </div>
                <div className="mt-2 text-4xl font-extrabold text-navy">
                  {plan.price}
                </div>
                <div className="mb-6 text-sm text-slate-500">{plan.period}</div>
                <a
                  href={plan.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mb-6 block rounded-full py-2.5 text-center text-sm font-bold transition-colors ${
                    plan.featured
                      ? "bg-emerald text-white hover:bg-emerald-dark"
                      : "border-[1.5px] border-emerald text-emerald hover:bg-emerald/5"
                  }`}
                >
                  {plan.cta.label}
                </a>
                <div className="space-y-1.5">
                  {plan.items.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-start gap-2 py-1 text-sm ${
                        item.included ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 ${
                          item.included ? "text-emerald" : "text-slate-300"
                        }`}
                      >
                        {item.included ? "✓" : "✕"}
                      </span>
                      <span>
                        {item.label}
                        {item.badge && (
                          <span className="ml-1.5 whitespace-nowrap rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-slate-500">
            * Harga adalah contoh awal dan dapat berubah. Konfirmasi harga
            terkini via WhatsApp.
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
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
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
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
                  {open && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA AKHIR ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-dark to-emerald p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Siap atur keuangan keluarga lebih tenang?
              </h2>
              <p className="mt-4 text-lg text-emerald-50">
                Mulai gratis sekarang. Tanpa kartu kredit, tanpa instal aplikasi
                — cukup dari HP.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-8 py-3.5 font-bold text-emerald transition-colors hover:bg-slate-100"
                >
                  Coba AMAN Budget Gratis
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
