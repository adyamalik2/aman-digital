import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Handshake,
  MessagesSquare,
  Key,
  UserRound,
  MessageCircle,
  Camera,
  MapPin,
  type LucideIcon,
} from "lucide-react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

const KONSULTASI_WA = wa("Halo AMAN Digital, saya ingin konsultasi gratis.");

export const metadata: Metadata = {
  title: "Tentang AMAN Digital — Adya Malik",
  description:
    "AMAN Digital dibangun oleh Adya Malik, praktisi IT dan data dari Aceh. Membantu UMKM, toko, dan kantor kecil punya sistem kerja yang lebih rapi — mulai dari konsultasi gratis.",
};

/* ---------------- Data ---------------- */

const certs = [
  "IT Risk Management",
  "Google Data Analytics",
  "AppSheet Developer",
  "Looker Studio Expert",
];

const founderParagraphs = [
  "Adya Malik membangun AMAN Digital setelah melihat langsung bagaimana banyak usaha kecil di Aceh masih bergantung pada catatan manual, spreadsheet berantakan, dan proses yang tidak perlu rumit.",
  "Dengan latar belakang IT support, analisis data, dan pengembangan sistem no-code, Adya fokus menciptakan alat kerja yang praktis dan bisa langsung dipakai — bukan sekadar keren di presentasi.",
  "AMAN Digital adalah ekosistem layanan yang tumbuh dari kebutuhan nyata: kasir offline, keuangan keluarga, invoice digital, cetak promosi, dan IT support harian — semuanya dalam satu ekosistem yang terjangkau.",
];

const nilai: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Zap,
    title: "Praktis Dulu",
    desc: "Solusi yang kami buat harus bisa langsung dipakai — bukan demo yang terlihat bagus tapi sulit diadopsi tim kecil. Kalau bisa disederhanakan, kami sederhanakan.",
  },
  {
    icon: Handshake,
    title: "Jujur",
    desc: "Kami tidak menjanjikan fitur yang belum ada atau harga yang berubah mendadak. Kalau ada keterbatasan, kami sampaikan sejak awal agar Anda bisa membuat keputusan yang tepat.",
  },
  {
    icon: MessagesSquare,
    title: "Konsultasi Dulu",
    desc: "Sebelum mengerjakan apa pun, kami ajak diskusi dulu untuk memahami masalah sebenarnya. Banyak kasus yang solusinya ternyata lebih sederhana dari yang dibayangkan.",
  },
  {
    icon: Key,
    title: "Sistem Milik Anda",
    desc: "Setiap sistem yang kami buat menjadi milik klien sepenuhnya. Bukan sistem yang terus bergantung pada kami — Anda harus bisa mengelola dan memahaminya sendiri.",
  },
];

const amanPrinciples = [
  {
    initial: "A",
    word: "Andal",
    desc: "Sistem dan layanan yang bisa diandalkan — stabil, tidak putus di tengah jalan saat dibutuhkan.",
  },
  {
    initial: "M",
    word: "Mudah",
    desc: "Dirancang untuk dipakai oleh siapa saja, bukan hanya yang paham teknologi.",
  },
  {
    initial: "A",
    word: "Aman",
    desc: "Data dan proses bisnis Anda terlindungi — tidak ada celah yang dibiarkan terbuka.",
  },
  {
    initial: "N",
    word: "Nyata",
    desc: "Bukan sekadar janji — hasilnya bisa dirasakan langsung dalam pekerjaan harian Anda.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "Ide pertama lahir",
    desc: "Melihat pemilik toko percetakan masih mencatat transaksi manual di buku, mulai merancang solusi kasir sederhana berbasis web.",
  },
  {
    year: "2023",
    title: "AMAN Kasir diluncurkan",
    desc: "Aplikasi kasir pertama mulai digunakan beberapa toko kecil di sekitar Blangpidie. Feedback pertama mengalir dan langsung diperbaiki.",
  },
  {
    year: "2024",
    title: "AMAN Budget & Invoice hadir",
    desc: "Berdasarkan permintaan pengguna, dikembangkan AMAN Budget untuk keuangan keluarga dan AMAN Invoice untuk pengelolaan tagihan profesional.",
  },
  {
    year: "2025",
    title: "Ekosistem layanan lengkap",
    desc: "AMAN Digital berkembang dengan Print Center, IT Advisor, Creative Studio, dan Digital Store — satu ekosistem untuk kebutuhan operasional UMKM.",
  },
  {
    year: "2026",
    title: "Terus bertumbuh bersama UMKM",
    desc: "Menambah fitur, memperbaiki pengalaman, dan mendampingi makin banyak usaha kecil — mulai dari Aceh, untuk Indonesia.",
  },
];

const contacts: { icon: LucideIcon; label: string }[] = [
  { icon: MessageCircle, label: "0822-1076-8038" },
  { icon: Camera, label: "@aman.digital.id" },
  { icon: MapPin, label: "Blangpidie, Aceh Barat Daya" },
];

/* ---------------- Page ---------------- */

export default function TentangPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-20 pt-28 text-center sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-emerald px-4 py-1 text-sm font-semibold uppercase tracking-wide text-emerald">
            Tentang Kami
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            Adya Malik & <span className="text-emerald-light">AMAN Digital</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Praktisi IT dan data dari Aceh yang membantu UMKM, toko, dan kantor
            kecil memiliki sistem kerja yang lebih rapi — tanpa proses yang
            dibuat rumit.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={KONSULTASI_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-dark"
            >
              Mulai Konsultasi Gratis
            </a>
            <Link
              href="/#layanan"
              className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:border-emerald hover:text-emerald-light"
            >
              Lihat Layanan Kami →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER PROFILE ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-2">
          <div className="flex flex-col items-center rounded-3xl border border-emerald/15 bg-emerald/5 p-10 text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-dark text-white shadow-lg">
              <UserRound size={44} />
            </div>
            <p className="mt-4 text-xl font-bold text-navy">Adya Malik</p>
            <p className="mt-1 text-sm text-slate-600">
              Founder & Pengembang, AMAN Digital
            </p>
            <p className="text-sm text-slate-500">
              Blangpidie, Aceh Barat Daya
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {certs.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald">
              Pendiri
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy">
              Dari masalah nyata, ke solusi yang dipakai sehari-hari
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
              {founderParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NILAI ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald">
              Nilai yang Kami Pegang
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
              Cara kami bekerja dengan setiap klien
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {nilai.map((n) => {
              const Icon = n.icon;
              return (
              <div
                key={n.title}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-emerald">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-navy">{n.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{n.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== KENAPA NAMA AMAN? ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-dark via-emerald to-emerald-light p-8 sm:p-12">
            <div className="relative z-10">
              <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                Kenapa Nama AMAN?
              </p>
              <p className="mt-2 max-w-lg text-sm text-white/70">
                Di balik nama itu ada empat prinsip yang jadi fondasi semua yang
                kami bangun.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {amanPrinciples.map((p, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 shrink-0 text-center text-4xl font-black leading-tight text-white/25">
                      {p.initial}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {p.word}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-white/75">
                        {p.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PERJALANAN ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald">
              Perjalanan
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
              Dari ide kecil ke ekosistem nyata
            </h2>
          </div>
          <ol className="relative ml-3 border-l-2 border-emerald/20">
            {timeline.map((t) => (
              <li key={t.year} className="relative pb-10 pl-8 last:pb-0">
                <span className="absolute -left-[0.55rem] top-1 h-4 w-4 rounded-full bg-emerald ring-4 ring-emerald/15" />
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald">
                  {t.year}
                </div>
                <div className="mt-1 text-base font-bold text-navy">
                  {t.title}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {t.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== KONTAK & CTA ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Ada yang ingin Anda tanyakan?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Konsultasi awal via WhatsApp gratis — ceritakan kebutuhan Anda dan
            kami bantu arahkan solusi yang tepat.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-5">
            {contacts.map((c) => {
              const Icon = c.icon;
              return (
              <div
                key={c.label}
                className="flex items-center gap-2 text-slate-600"
              >
                <Icon size={18} className="text-emerald" />
                <span>{c.label}</span>
              </div>
              );
            })}
          </div>
          <a
            href={KONSULTASI_WA}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-emerald px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-dark"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
