"use client";

import { useState } from "react";
import {
  TIER_ORDER,
  TIER_META,
  tierCardFeatures,
  comparisonRowsForGroups,
  type TierKey,
  type CellValue,
  type FeatureGroup,
} from "@/lib/pricing";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

// KASIR_APP_URL sengaja TIDAK dipakai lagi untuk tombol "Mulai Gratis" /
// "Coba Gratis Sekarang" — lihat catatan di dekat pemakaiannya di bawah.

/* ---------------- Data ---------------- */

// Hanya Gratis yang punya jalur aktivasi otomatis. Dasar & Pro belum bisa
// dibeli langsung, jadi labelnya "Daftar Minat" (bukan "Pilih Paket") dan
// hanya mengantar ke WhatsApp untuk didaftarkan — tidak menjanjikan
// aktivasi instan yang sebenarnya belum ada.
const ctaByTier: Record<
  TierKey,
  { label: string; href: string; variant: "primary" | "ghost" }
> = {
  gratis: {
    label: "Mulai Gratis",
    href: wa("Halo AMAN Digital, saya ingin coba AMAN Kasir/Budget/Invoice gratis."),
    variant: "primary",
  },
  dasar: {
    label: "Daftar Minat",
    href: wa("Halo AMAN Digital, saya ingin didaftarkan minat untuk paket Dasar."),
    variant: "ghost",
  },
  pro: {
    label: "Daftar Minat",
    href: wa("Halo AMAN Digital, saya ingin didaftarkan minat untuk paket Pro."),
    variant: "ghost",
  },
};

const appTabs: {
  key: string;
  label: string;
  icon: string;
  groups: FeatureGroup[];
}[] = [
  { key: "semua", label: "Semua Aplikasi", icon: "🗂️", groups: ["Kasir", "Budget", "Invoice", "Umum"] },
  { key: "kasir", label: "AMAN Kasir", icon: "🧾", groups: ["Kasir"] },
  { key: "budget", label: "AMAN Budget", icon: "👛", groups: ["Budget"] },
  { key: "invoice", label: "AMAN Invoice", icon: "📄", groups: ["Invoice"] },
];

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
    q: "Berapa lama waktu respons support?",
    a: "Selama Early Access semua pengguna dijawab sama cepatnya — biasanya dalam 1–2 jam di jam kerja, tanpa dibedakan berdasarkan paket.",
  },
  // TODO(pemilik): paragraf metode pembayaran sebelumnya menyebut transfer
  // bank (BCA/Mandiri/BRI/BNI) dengan aktivasi 1x24 jam — belum terverifikasi
  // ini benar-benar jalur yang berjalan. Isi ulang setelah dikonfirmasi;
  // jangan publikasikan janji pembayaran yang belum tentu berlaku.
  {
    q: "Apakah data saya aman jika saya downgrade atau berhenti berlangganan?",
    a: "Data Anda tetap tersimpan. Jika downgrade ke Gratis, data lama tetap ada — hanya fitur berbayar yang tidak bisa digunakan lagi. Kami tidak menghapus data tanpa persetujuan Anda.",
  },
];

/* ---------------- Helpers ---------------- */

/**
 * Dipakai di DUA latar sekaligus: tabel perbandingan (latar putih) dan kartu
 * paket (latar navy gelap). Satu pasang warna tidak pernah bisa lolos di
 * keduanya -- menggelapkan untuk tabel justru mematahkan yang di kartu gelap.
 * Karena itu warnanya dipilih per-latar lewat `onDark`.
 */
function Mark({
  included,
  onDark = false,
}: {
  included: boolean;
  onDark?: boolean;
}) {
  return included ? (
    <span
      className={`font-bold ${onDark ? "text-emerald" : "text-emerald-dark"}`}
      aria-label="Termasuk"
    >
      ✓
    </span>
  ) : (
    <span
      className={onDark ? "text-slate-300" : "text-slate-500"}
      aria-label="Tidak termasuk"
    >
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
  const [activeApp, setActiveApp] = useState<string>("semua");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeTab = appTabs.find((t) => t.key === activeApp) ?? appTabs[0];
  const rows = comparisonRowsForGroups(activeTab.groups);

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
                  !annual ? "bg-emerald-cta text-white" : "text-slate-300"
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  annual ? "bg-emerald-cta text-white" : "text-slate-300"
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
          {TIER_ORDER.map((key) => {
            const meta = TIER_META[key];
            const cta = ctaByTier[key];
            const features = tierCardFeatures(key);
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-3xl border p-8 text-left transition-transform hover:-translate-y-1 ${
                  meta.featured
                    ? "border-emerald/40 bg-emerald/[0.06] shadow-[0_0_40px_rgba(5,150,105,0.15)]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                {meta.badge && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl bg-emerald-cta px-4 py-1 text-xs font-extrabold text-white">
                    {meta.badge}
                  </span>
                )}
                <div
                  className={`text-xs font-extrabold uppercase tracking-widest ${
                    meta.featured ? "text-emerald-light" : "text-slate-400"
                  }`}
                >
                  {meta.name}
                </div>
                <div className="mt-2 flex items-start gap-1">
                  {key !== "gratis" && (
                    <span className="mt-1 text-lg font-semibold text-slate-400">
                      Rp
                    </span>
                  )}
                  <span className="text-5xl font-black leading-none tracking-tight text-white">
                    {annual ? meta.annual : meta.monthly}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {annual ? meta.annualPeriod : meta.monthlyPeriod}
                </div>

                <hr className="my-6 border-white/10" />

                <ul className="space-y-3">
                  {features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-start gap-3 text-sm ${
                        f.dim ? "text-slate-500" : "text-slate-200"
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        <Mark included={f.included} onDark />
                      </span>
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>

                <hr className="my-6 border-white/10" />

                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto rounded-full px-6 py-3 text-center text-sm font-bold transition-colors ${
                    cta.variant === "primary"
                      ? "bg-emerald-cta text-white hover:bg-emerald-cta-hover"
                      : "border border-white/20 text-slate-200 hover:border-emerald hover:text-emerald-light"
                  }`}
                >
                  {cta.label}
                </a>
              </div>
            );
          })}
        </div>

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
                      ? "bg-emerald-cta text-white"
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
          <div className="relative mt-10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  {/* Di HP kolom ini melebar sampai 288px dari 343px yang tersedia,
                      sehingga kolom harga justru tertutup olehnya saat digeser.
                      Lebar tetap yang jauh lebih sempit menyisakan ~190px untuk
                      kolom nilai -- cukup menampilkan satu paket penuh sekaligus. */}
                  <th className="sticky left-0 z-10 w-[132px] bg-white px-3 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 sm:w-[45%] sm:px-4">
                    Fitur
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Gratis
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-emerald-dark">
                    Dasar
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) =>
                  row.type === "group" ? (
                    <tr key={`g-${row.group}-${i}`}>
                      <td
                        colSpan={4}
                        className="bg-emerald/5 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-emerald-dark"
                      >
                        {row.group}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={`${row.label}-${i}`}
                      className="border-b border-slate-100"
                    >
                      <td className="sticky left-0 z-10 bg-white px-3 py-3 text-sm text-slate-700 sm:px-4">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <CompareCell value={row.values.gratis} />
                      </td>
                      <td className="bg-emerald/5 px-4 py-3 text-center text-sm">
                        <CompareCell value={row.values.dasar} highlight />
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <CompareCell value={row.values.pro} />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
              </table>
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:hidden"
              style={{ background: "linear-gradient(to left, rgba(255,255,255,.95), rgba(255,255,255,0))" }}
              aria-hidden="true"
            />
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
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy"
                  >
                    {item.q}
                    <span
                      className={`text-emerald-dark transition-transform ${
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
                className="rounded-full bg-emerald-cta px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-cta-hover"
              >
                Konsultasi via WhatsApp
              </a>
              <a
                href={wa("Halo AMAN Digital, saya ingin coba AMAN Kasir/Budget/Invoice gratis.")}
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
