"use client";

import { useState } from "react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

const KASIR_APP_URL = "https://amandigital.web.id/aman-kasir/";

/* ---------------- Data ---------------- */

type Feature = { label: string; included: boolean; dim?: boolean };

type Plan = {
  tier: string;
  featured?: boolean;
  badge?: string;
  monthly: string;
  annual: string;
  monthlyPeriod: string;
  annualPeriod: string;
  features: Feature[];
  cta: { label: string; href: string; variant: "primary" | "ghost" };
};

const plans: Plan[] = [
  {
    tier: "Gratis",
    monthly: "Rp 0",
    annual: "Rp 0",
    monthlyPeriod: "selamanya",
    annualPeriod: "selamanya",
    features: [
      { label: "Kasir: 100 transaksi/bln", included: true },
      { label: "Budget: 100 transaksi/bln", included: true },
      { label: "Invoice: 10 invoice/bln", included: true },
      { label: "Laporan & export PDF", included: false, dim: true },
      { label: "Manajemen stok", included: false, dim: true },
      { label: "Multi pengguna", included: false, dim: true },
    ],
    cta: { label: "Mulai Gratis", href: KASIR_APP_URL, variant: "ghost" },
  },
  {
    tier: "Dasar",
    featured: true,
    badge: "Paling Populer",
    monthly: "49rb",
    annual: "392rb",
    monthlyPeriod: "per bulan",
    annualPeriod: "per tahun (hemat Rp 196rb)",
    features: [
      { label: "Kasir: 500 transaksi/bln", included: true },
      { label: "Budget: 500 transaksi/bln", included: true },
      { label: "Invoice: 100 invoice/bln", included: true },
      { label: "Laporan & export PDF", included: true },
      { label: "Manajemen stok", included: true },
      { label: "Multi pengguna", included: false, dim: true },
    ],
    cta: {
      label: "Pilih Paket Dasar",
      href: wa(
        "Halo AMAN Digital, saya ingin berlangganan paket Dasar."
      ),
      variant: "primary",
    },
  },
  {
    tier: "Pro",
    monthly: "99rb",
    annual: "792rb",
    monthlyPeriod: "per bulan",
    annualPeriod: "per tahun (hemat Rp 396rb)",
    features: [
      { label: "Semua fitur Dasar", included: true },
      { label: "Transaksi & invoice tak terbatas", included: true },
      { label: "Export PDF & Excel", included: true },
      { label: "Multi pengguna (3 akun)", included: true },
      { label: "Backup otomatis harian", included: true },
      { label: "Prioritas support WhatsApp", included: true },
    ],
    cta: {
      label: "Pilih Paket Pro",
      href: wa("Halo AMAN Digital, saya ingin berlangganan paket Pro."),
      variant: "ghost",
    },
  },
];

type CellValue = boolean | string;
type CompareRow =
  | { group: string }
  | { label: string; free: CellValue; basic: CellValue; pro: CellValue };

const compareRows = {
  kasir: [
    { group: "AMAN Kasir" },
    { label: "Transaksi per bulan", free: "100", basic: "500", pro: "Unlimited" },
    { label: "Stok barang", free: true, basic: true, pro: true },
    { label: "Laporan dasar", free: true, basic: true, pro: true },
    { label: "Export PDF", free: true, basic: true, pro: true },
    { label: "Backup lokal", free: true, basic: true, pro: true },
    { label: "Cloud backup harian", free: false, basic: false, pro: true },
    { label: "Export Excel", free: false, basic: false, pro: true },
  ] as CompareRow[],
  budget: [
    { group: "AMAN Budget" },
    { label: "Transaksi per bulan", free: "100", basic: "500", pro: "Unlimited" },
    { label: "Goals tabungan", free: "3", basic: "10", pro: "Unlimited" },
    { label: "Kalkulator Zakat", free: true, basic: true, pro: true },
    { label: "Laporan arus kas", free: true, basic: true, pro: true },
    { label: "Family Sync", free: false, basic: false, pro: true },
    { label: "Reminder tagihan", free: false, basic: false, pro: true },
    { label: "OCR Struk", free: false, basic: false, pro: true },
  ] as CompareRow[],
  invoice: [
    { group: "AMAN Invoice" },
    { label: "Invoice per bulan", free: "10", basic: "100", pro: "Unlimited" },
    { label: "Kirim via WhatsApp", free: true, basic: true, pro: true },
    { label: "Download PDF", free: true, basic: true, pro: true },
    { label: "Logo usaha di invoice", free: false, basic: true, pro: true },
    { label: "Database pelanggan", free: true, basic: true, pro: true },
    { label: "Laporan piutang", free: false, basic: false, pro: true },
    { label: "Pengingat jatuh tempo", free: false, basic: false, pro: true },
  ] as CompareRow[],
};

const allRows: CompareRow[] = [
  ...compareRows.kasir,
  ...compareRows.budget,
  ...compareRows.invoice,
  { group: "Umum" },
  { label: "Support WhatsApp", free: "3 hari", basic: "24 jam", pro: "Prioritas 2 jam" },
  { label: "Multi pengguna", free: false, basic: "2 user", pro: "5 user" },
];

const appTabs = [
  { key: "semua", label: "Semua Aplikasi", icon: "🗂️" },
  { key: "kasir", label: "AMAN Kasir", icon: "🧾" },
  { key: "budget", label: "AMAN Budget", icon: "👛" },
  { key: "invoice", label: "AMAN Invoice", icon: "📄" },
] as const;

type AppKey = (typeof appTabs)[number]["key"];

const rowsByApp: Record<AppKey, CompareRow[]> = {
  semua: allRows,
  kasir: compareRows.kasir,
  budget: compareRows.budget,
  invoice: compareRows.invoice,
};

const faqs = [
  {
    q: "Apakah paket Gratis benar-benar gratis selamanya?",
    a: "Ya. Paket Gratis tidak ada batas waktu dan tidak memerlukan kartu kredit. Anda bisa memakai AMAN Kasir, Budget, dan Invoice dengan kuota gratis selama yang Anda mau.",
  },
  {
    q: "Bisa upgrade atau downgrade kapan saja?",
    a: "Bisa. Hubungi kami via WhatsApp dan tim kami akan memproses perubahan paket Anda. Tidak ada pinalti untuk downgrade atau upgrade di tengah periode berlangganan.",
  },
  {
    q: "Apakah satu paket mencakup semua aplikasi (Kasir, Budget, Invoice)?",
    a: "Ya. Satu paket berlaku untuk ketiga aplikasi AMAN — Kasir, Budget, dan Invoice. Anda tidak perlu berlangganan terpisah untuk setiap aplikasi.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Saat ini pembayaran dilakukan via transfer bank (BCA, Mandiri, BRI, BNI). Konfirmasi via WhatsApp setelah transfer dan akun Anda akan diaktifkan dalam 1×24 jam.",
  },
  {
    q: "Apakah data saya aman jika saya downgrade atau berhenti berlangganan?",
    a: "Data Anda tetap tersimpan. Jika downgrade ke Gratis, data lama tetap ada — hanya fitur berbayar yang tidak bisa digunakan lagi. Kami tidak menghapus data tanpa persetujuan Anda.",
  },
];

/* ---------------- Helpers ---------------- */

function Mark({ included }: { included: boolean }) {
  return included ? (
    <span className="font-bold text-emerald" aria-label="Termasuk">
      ✓
    </span>
  ) : (
    <span className="text-slate-300" aria-label="Tidak termasuk">
      —
    </span>
  );
}

function CompareCell({
  value,
  highlight = false,
}: {
  value: CellValue;
  highlight?: boolean;
}) {
  if (typeof value === "boolean") return <Mark included={value} />;
  return (
    <span
      className={`font-semibold ${highlight ? "text-emerald" : "text-navy"}`}
    >
      {value}
    </span>
  );
}

/* ---------------- Page ---------------- */

export default function HargaPage() {
  const [annual, setAnnual] = useState(false);
  const [activeApp, setActiveApp] = useState<AppKey>("semua");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const rows = rowsByApp[activeApp];

  return (
    <>
      {/* ===== HERO + PRICING ===== */}
      <section
        className="px-4 pb-20 pt-28 text-center sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-emerald px-4 py-1 text-sm font-semibold uppercase tracking-wide text-emerald">
            Harga & Paket
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            Mulai <span className="text-emerald-light">gratis</span>, bayar saat
            bisnis berkembang
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            Tidak ada kartu kredit, tidak ada kontrak jangka panjang. Upgrade
            atau downgrade kapan saja sesuai kebutuhan usaha Anda.
          </p>

          {/* Billing toggle */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="inline-flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  !annual ? "bg-emerald text-white" : "text-slate-300"
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  annual ? "bg-emerald text-white" : "text-slate-300"
                }`}
              >
                Tahunan
              </button>
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-light">
              Hemat 2 bln
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative flex flex-col rounded-3xl border p-8 text-left transition-transform hover:-translate-y-1 ${
                plan.featured
                  ? "border-emerald/40 bg-emerald/[0.06] shadow-[0_0_40px_rgba(5,150,105,0.15)]"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {plan.badge && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl bg-emerald px-4 py-1 text-xs font-extrabold text-white">
                  {plan.badge}
                </span>
              )}
              <div
                className={`text-xs font-extrabold uppercase tracking-widest ${
                  plan.featured ? "text-emerald-light" : "text-slate-400"
                }`}
              >
                {plan.tier}
              </div>
              <div className="mt-2 flex items-start gap-1">
                {plan.tier !== "Gratis" && (
                  <span className="mt-1 text-lg font-semibold text-slate-400">
                    Rp
                  </span>
                )}
                <span className="text-5xl font-black leading-none tracking-tight text-white">
                  {annual ? plan.annual : plan.monthly}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                {annual ? plan.annualPeriod : plan.monthlyPeriod}
              </div>

              <hr className="my-6 border-white/10" />

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-start gap-3 text-sm ${
                      f.dim ? "text-slate-500" : "text-slate-200"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      <Mark included={f.included} />
                    </span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>

              <hr className="my-6 border-white/10" />

              <a
                href={plan.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto rounded-full px-6 py-3 text-center text-sm font-bold transition-colors ${
                  plan.cta.variant === "primary"
                    ? "bg-emerald text-white hover:bg-emerald-dark"
                    : "border border-white/20 text-slate-200 hover:border-emerald hover:text-emerald-light"
                }`}
              >
                {plan.cta.label}
              </a>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-xs text-slate-500">
          * Harga adalah contoh awal dan dapat berubah sewaktu-waktu. Konfirmasi
          harga terkini via WhatsApp.
        </p>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">
              Bandingkan fitur secara lengkap
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Pilih berdasarkan kebutuhan usaha Anda saat ini.
            </p>
          </div>

          {/* App selector tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {appTabs.map((tab) => {
              const active = tab.key === activeApp;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveApp(tab.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald text-white"
                      : "border border-slate-300 text-slate-600 hover:border-emerald hover:text-emerald"
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[45%] px-4 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Fitur
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Gratis
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-emerald">
                    Dasar
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) =>
                  "group" in row ? (
                    <tr key={`g-${row.group}-${i}`}>
                      <td
                        colSpan={4}
                        className="bg-emerald/5 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-emerald"
                      >
                        {row.group}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={`${row.label}-${i}`}
                      className="border-b border-slate-100"
                    >
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <CompareCell value={row.free} />
                      </td>
                      <td className="bg-emerald/5 px-4 py-3 text-center text-sm">
                        <CompareCell value={row.basic} highlight />
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <CompareCell value={row.pro} />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">
              Pertanyaan yang Sering Ditanyakan
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy"
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

      {/* ===== CTA FINAL ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-3xl border border-emerald/20 bg-emerald/5 p-10 text-center md:p-14">
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">
              Masih ragu? Konsultasi dulu gratis.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Tim kami siap bantu Anda memilih paket yang paling sesuai — tanpa
              tekanan, tanpa paksaan.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={wa(
                  "Halo AMAN Digital, saya ingin konsultasi paket harga."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-dark"
              >
                Konsultasi via WhatsApp
              </a>
              <a
                href={KASIR_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition-colors hover:border-emerald hover:text-emerald"
              >
                Coba Gratis Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
