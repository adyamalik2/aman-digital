"use client";

import { useState } from "react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

const APP_URL = "https://amandigital.web.id/aman-invoice1/";
const TANYA_WA = wa("Halo AMAN Digital, saya ingin tanya tentang AMAN Invoice.");

/* ---------------- Data ---------------- */

const invoiceItems = [
  { desc: "Desain Spanduk (2 pcs)", amount: "Rp 300.000" },
  { desc: "Print Brosur A5 (500 lbr)", amount: "Rp 450.000" },
  { desc: "Laminasi", amount: "Rp 75.000" },
];

const masalah = [
  {
    icon: "🧾",
    title: "Nota Tidak Profesional",
    desc: "Faktur tulisan tangan atau format seadanya membuat pelanggan meragukan kredibilitas usaha Anda.",
  },
  {
    icon: "⏳",
    title: "Lupa Follow-Up Pembayaran",
    desc: "Tidak ada pengingat, tidak tahu mana yang sudah lunas dan mana yang masih menunggak.",
  },
  {
    icon: "🔍",
    title: "Rekap Manual & Sulit",
    desc: "Harus cek satu per satu untuk tahu total piutang yang masih beredar di luar sana.",
  },
];

const fitur = [
  {
    icon: "📄",
    title: "Buat Invoice Instan",
    desc: "Isi nama pelanggan, daftar barang/jasa, nominal, dan invoice profesional langsung siap dalam hitungan menit.",
  },
  {
    icon: "💬",
    title: "Kirim via WhatsApp & PDF",
    desc: "Bagikan link tagihan langsung ke WhatsApp pelanggan atau download sebagai PDF untuk dikirim via email.",
  },
  {
    icon: "✅",
    title: "Pantau Status Pembayaran",
    desc: "Tandai invoice lunas, menunggu, atau jatuh tempo — lihat ringkasan piutang dari dashboard Anda.",
  },
  {
    icon: "📇",
    title: "Database Pelanggan",
    desc: "Simpan data pelanggan, tidak perlu ketik ulang setiap buat invoice baru untuk pelanggan yang sama.",
  },
  {
    icon: "🗂️",
    title: "Riwayat & Arsip Invoice",
    desc: "Semua invoice tersimpan dan bisa dicari kapan saja — tidak ada yang hilang atau tercecer.",
  },
  {
    icon: "📱",
    title: "Cukup dari HP",
    desc: "Buka dari browser HP kapan saja. Tidak perlu laptop, tidak perlu instal aplikasi tambahan.",
  },
];

const steps = [
  {
    num: "1",
    title: "Isi data invoice",
    desc: "Masukkan nama pelanggan, daftar barang atau jasa yang dipesan, harga satuan, dan jumlah. Bisa tambah diskon dan pajak jika perlu.",
  },
  {
    num: "2",
    title: "Kirim ke pelanggan",
    desc: "Bagikan link invoice via WhatsApp langsung dari aplikasi, atau download PDF untuk dikirim via email atau dicetak.",
  },
  {
    num: "3",
    title: "Tandai lunas, pantau piutang",
    desc: "Setelah pelanggan bayar, tandai invoice sebagai lunas. Pantau total piutang yang masih beredar dari dashboard ringkasan.",
  },
];

type CheckItem = { label: string; included: boolean };

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
      { label: "Hingga 10 invoice/bulan", included: true },
      { label: "Kirim via WhatsApp", included: true },
      { label: "Status pembayaran", included: true },
      { label: "Download PDF", included: false },
      { label: "Database pelanggan", included: false },
      { label: "Logo usaha di invoice", included: false },
    ],
  },
  {
    name: "Dasar",
    price: "Rp 49rb",
    period: "per bulan",
    featured: true,
    cta: {
      label: "Pilih Paket Dasar",
      href: wa(
        "Halo AMAN Digital, saya ingin upgrade AMAN Invoice Dasar."
      ),
    },
    items: [
      { label: "100 invoice/bulan", included: true },
      { label: "Kirim via WhatsApp", included: true },
      { label: "Status pembayaran", included: true },
      { label: "Download PDF", included: true },
      { label: "Database pelanggan", included: true },
      { label: "Logo usaha di invoice", included: false },
    ],
  },
  {
    name: "Pro",
    price: "Rp 99rb",
    period: "per bulan",
    cta: {
      label: "Pilih Paket Pro",
      href: wa("Halo AMAN Digital, saya ingin upgrade AMAN Invoice Pro."),
    },
    items: [
      { label: "Invoice tak terbatas", included: true },
      { label: "Semua fitur Dasar", included: true },
      { label: "Logo usaha di invoice", included: true },
      { label: "Laporan piutang bulanan", included: true },
      { label: "Pengingat jatuh tempo", included: true },
      { label: "Prioritas support WA", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Apakah pelanggan saya bisa melihat invoice tanpa mendaftar?",
    a: "Ya. Anda cukup bagikan link invoice ke pelanggan via WhatsApp — pelanggan bisa langsung melihat detail tagihan tanpa perlu mendaftar atau login.",
  },
  {
    q: "Bisakah saya menambahkan logo dan nama usaha saya?",
    a: "Bisa, untuk paket Pro. Logo usaha akan muncul di bagian atas invoice sehingga terlihat lebih profesional dan beridentitas.",
  },
  {
    q: "Apakah AMAN Invoice mendukung diskon dan pajak?",
    a: "Ya, Anda bisa menambahkan diskon per item atau total, dan mengaktifkan PPN sesuai kebutuhan invoice Anda.",
  },
  {
    q: "Bagaimana cara mengetahui invoice mana yang belum dibayar?",
    a: "Dashboard AMAN Invoice menampilkan ringkasan status semua invoice — menunggu, jatuh tempo, dan sudah lunas — sehingga Anda bisa langsung tahu mana yang perlu difollow-up.",
  },
];

/* ---------------- Page ---------------- */

export default function InvoicePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-20 pt-28 text-center sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-emerald-light">
            <span className="h-2 w-2 rounded-full bg-emerald" />
            AMAN Invoice
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
            Faktur Profesional
            <br />
            <span className="text-emerald-light">
              Siap Kirim dalam 1 Menit
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Buat tagihan rapi, kirim ke pelanggan via WhatsApp atau PDF, dan
            pantau siapa sudah bayar — semua dari HP Anda tanpa ribet.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald px-8 py-3.5 text-center font-semibold text-white transition-colors hover:bg-emerald-dark"
            >
              Buat Invoice Gratis Sekarang
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

          {/* Invoice preview mock */}
          <div className="mx-auto mt-14 max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl">
            <div className="bg-gradient-to-br from-emerald to-emerald-dark p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 text-xs font-bold tracking-widest opacity-80">
                    INVOICE
                  </div>
                  <div className="text-2xl font-bold">#INV-2026-042</div>
                </div>
                <div className="text-right text-xs opacity-80">
                  <div>Tanggal: 12 Jun 2026</div>
                  <div>Jatuh tempo: 26 Jun 2026</div>
                </div>
              </div>
              <div className="mt-4 text-sm opacity-90">
                <div className="font-bold">Toko Maju Jaya</div>
                <div className="opacity-75">Jl. Sudirman No. 15, Jakarta</div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-slate-100 py-2 text-xs font-semibold text-slate-500">
                <span>DESKRIPSI</span>
                <span>JUMLAH</span>
              </div>
              {invoiceItems.map((row) => (
                <div
                  key={row.desc}
                  className="flex items-center justify-between border-b border-slate-100 py-2.5 text-sm text-navy"
                >
                  <span>{row.desc}</span>
                  <span>{row.amount}</span>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald/10 px-4 py-3">
                <span className="text-sm font-bold text-emerald">Total</span>
                <span className="text-lg font-bold text-emerald">
                  Rp 825.000
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Menunggu Pembayaran
                </span>
                <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
                  💬 Kirim WA
                </span>
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
            Tagihan asal-asalan bikin pelanggan ragu membayar
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            Nota tulisan tangan, pesan tagihan via WhatsApp tanpa detail, dan
            lupa follow-up adalah penyebab umum piutang macet di usaha kecil.
            Tampil profesional bukan hak eksklusif perusahaan besar.
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
              Semua yang dibutuhkan untuk kelola tagihan bisnis
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

      {/* ===== CARA PAKAI ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">
              Cara Pakai
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Faktur siap kirim dalam 3 langkah
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
              Buat Invoice Pertama Saya
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
              Mulai gratis, upgrade sesuai kebutuhan
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Tidak perlu kartu kredit untuk mulai. Upgrade kapan saja saat
              bisnis Anda berkembang.
            </p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
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
                    plan.featured ? "text-emerald" : "text-slate-500"
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
                      <span>{item.label}</span>
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
                Siap tampil profesional dengan invoice yang rapi?
              </h2>
              <p className="mt-4 text-lg text-emerald-50">
                Mulai gratis sekarang. Tidak perlu kartu kredit, tidak perlu
                instal aplikasi.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-8 py-3.5 font-bold text-emerald transition-colors hover:bg-slate-100"
                >
                  Buat Invoice Gratis
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
