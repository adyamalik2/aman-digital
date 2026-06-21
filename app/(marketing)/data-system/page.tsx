import type { Metadata } from "next";
import Link from "next/link";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

export const metadata: Metadata = {
  title: "Data & System Integration | AMAN Digital",
  description:
    "Layanan Data & System Integration AMAN Digital untuk dashboard Looker Studio, AppSheet no-code app, dan sistem operasional berbasis data.",
};

/* ---------------- Data ---------------- */

const cocok = [
  "Pemilik toko yang masih catat penjualan di buku atau Excel manual",
  "Kantor kecil yang belum punya sistem pencatatan terpadu",
  "UMKM yang ingin laporan keuangan tanpa bongkar spreadsheet satu per satu",
  "Tim operasional yang kesulitan koordinasi stok, order, atau absensi",
  "Siapapun yang ingin data bisnis lebih rapi dan mudah dibaca langsung",
];

const services = [
  {
    icon: "📊",
    title: "Dashboard Bisnis (Looker Studio)",
    desc: "Visualisasi data penjualan, stok, keuangan, dan metrik penting dalam satu dashboard Google Looker Studio yang otomatis update setiap kali data berubah — tanpa perlu buka spreadsheet satu per satu.",
    href: undefined as string | undefined,
  },
  {
    icon: "📱",
    title: "Aplikasi No-Code (AppSheet)",
    desc: "Aplikasi web atau mobile sederhana tanpa coding rumit. Cocok untuk absensi tim, catatan alat, stok barang, atau alur order yang masih dicatat manual di buku atau grup chat.",
    href: undefined,
  },
  {
    icon: "🧾",
    title: "Sistem POS Web & SOP Operasional",
    desc: "Rancangan sistem kasir berbasis web dan flowchart alur kerja agar transaksi harian, stok, dan laporan bisa dikelola tim kecil tanpa kebingungan.",
    href: "/kasir",
  },
  {
    icon: "🔗",
    title: "Integrasi Google Workspace",
    desc: "Koneksikan Google Sheets, Forms, Drive, dan Looker Studio agar semua data bisnis tersentralisasi. Tidak perlu salin-tempel antar file — data mengalir otomatis ke tempat yang tepat.",
    href: undefined,
  },
];

const steps = [
  {
    num: "01",
    title: "Konsultasi Gratis",
    desc: "Ceritakan kondisi data bisnis Anda sekarang. Kami pelajari dulu sebelum usulkan solusi yang tepat.",
  },
  {
    num: "02",
    title: "Mapping Kebutuhan",
    desc: "Kami petakan sumber data, alur kerja, dan output yang Anda butuhkan agar solusi tepat sasaran.",
  },
  {
    num: "03",
    title: "Build & Test",
    desc: "Dashboard atau aplikasi dibangun dan diuji bersama Anda sebelum diserahkan ke tim operasional.",
  },
  {
    num: "04",
    title: "Serah Terima & Training",
    desc: "Anda terima sistem siap pakai beserta panduan penggunaan dan sesi training singkat bersama tim.",
  },
];

/* ---------------- Page ---------------- */

export default function DataSystemPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-16 pt-28 text-center sm:pt-36"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-light text-3xl shadow-lg">
            📈
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Rapikan Data Bisnis dalam Satu Dashboard
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-300">
            Dari spreadsheet berantakan hingga dashboard yang bisa dibaca dalam
            30 detik — tanpa perlu jago coding.
          </p>
        </div>
      </section>

      {/* ===== COCOK UNTUK SIAPA ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold text-navy">
            Cocok untuk Siapa?
          </h2>
          <p className="mt-2 text-center text-slate-600">
            Jika salah satu dari ini terasa familiar, berarti solusi kami
            relevan untuk Anda.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            {cocok.map((c) => (
              <div
                key={c}
                className="flex items-start gap-3.5 border-b border-slate-100 py-3.5 last:border-none"
              >
                <span className="mt-0.5 shrink-0 text-emerald">✓</span>
                <span className="text-slate-700">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4 LAYANAN ===== */}
      <section className="py-16" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => {
              const inner = (
                <>
                  <div className="text-4xl">{s.icon}</div>
                  <h2 className="mt-4 text-xl font-bold text-navy">{s.title}</h2>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {s.desc}
                  </p>
                </>
              );
              return s.href ? (
                <Link
                  key={s.title}
                  href={s.href}
                  className="block rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald hover:shadow-md"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={s.title}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PROSES PENGERJAAN ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold text-navy">
            Proses Pengerjaan
          </h2>
          <p className="mt-2 text-center text-slate-600">
            Langkah terstruktur dari konsultasi hingga sistem siap pakai.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.num}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-4xl font-black text-emerald">{s.num}</div>
                <div className="mt-2 font-bold text-navy">{s.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-white pb-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 px-4 sm:flex-row">
          <a
            href={wa(
              "Halo AMAN Digital, saya ingin berkonsultasi terkait layanan Data dan System."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-emerald px-8 py-3 text-center font-bold text-white transition-colors hover:bg-emerald-dark sm:w-auto"
          >
            Diskusikan Proyek Data & System
          </a>
          <a
            href="https://www.freelancer.com/u/adyamalik2"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-slate-300 px-8 py-3 text-center font-semibold text-slate-700 transition-colors hover:border-emerald hover:text-emerald sm:w-auto"
          >
            Profil Freelancer.com
          </a>
        </div>
      </section>
    </>
  );
}
