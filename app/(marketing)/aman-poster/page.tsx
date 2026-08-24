import type { Metadata } from "next";
import Link from "next/link";
import {
  Palette,
  Wallet,
  Clock,
  Wand2,
  Code2,
  SwatchBook,
  Crop,
  Copy,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { pageMeta } from "@/lib/seo";

const CHECKOUT = "https://lynk.id/adya.malik/1m6zmzlzek3d/checkout";

export const metadata: Metadata = pageMeta({
  title: "AMAN Poster Generator — Prompt Poster Siap Pakai | AMAN Digital",
  description:
    "AMAN Poster Generator meracik headline, keunggulan produk, penawaran, CTA, sampai prompt visual lengkap (JSON + teks) untuk Canva, ChatGPT, Gemini & AI gambar lainnya.",
  path: "/aman-poster",
});

const problems: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Palette,
    title: "Bingung mulai desain",
    desc: "Punya produk, tapi bingung menyusun headline, layout, dan warna yang menarik jadi satu poster.",
  },
  {
    icon: Wallet,
    title: "Sewa desainer itu mahal",
    desc: "Tiap ganti promo harus bayar jasa desain lagi. Berat kalau kontennya harus sering-sering.",
  },
  {
    icon: Clock,
    title: "Belajar Canva makan waktu",
    desc: "Mau desain sendiri tapi belum terbiasa. Habis waktu utak-atik, hasilnya belum tentu rapi.",
  },
];

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Wand2,
    title: "Copywriting Otomatis",
    desc: "Headline, keunggulan (USP), ide promo, dan CTA diracik AI — tinggal klik tombolnya.",
  },
  {
    icon: Code2,
    title: "Prompt JSON Siap Pakai",
    desc: "Semua data dirakit jadi prompt terstruktur (JSON + teks) yang tinggal ditempel ke Canva, ChatGPT, atau Gemini untuk bikin gambarnya.",
  },
  {
    icon: SwatchBook,
    title: "10+ Gaya Visual",
    desc: "Kartun 3D, foto realistik, vektor flat, anime, cyberpunk, minimalis, luxury, watercolor, dan lainnya.",
  },
  {
    icon: Crop,
    title: "4 Rasio Siap Pakai",
    desc: "1:1 feed, 9:16 story/reels, 4:5 portrait, 16:9 banner — atau ketik rasio custom sendiri.",
  },
  {
    icon: Copy,
    title: "Sekali Klik Salin",
    desc: "Salin prompt dalam format JSON atau teks visual saja — langsung tempel ke tool desain AI favoritmu.",
  },
  {
    icon: Lightbulb,
    title: "Tips Jualan + Copy ke Canva",
    desc: "Dapat tips cara memasarkan produk, dan prompt visual siap disalin ke Canva Magic Media.",
  },
];

const styles = ["Edukasi", "Kuliner", "Fashion", "Jasa", "Properti", "Percetakan", "Event", "Produk Umum"];

function PriceTag() {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-3xl font-black text-white">Rp 39.000</span>
      <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald-light">Bayar sekali, aktif selamanya</span>
    </div>
  );
}

function CtaButtons() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
        href={CHECKOUT}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-emerald-cta px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-emerald-cta-hover"
      >
        🛒 Beli Kode Akses
      </a>
      <Link
        // Ke /app/, bukan /masuk — lihat catatan di aman-engine/page.tsx.
        href="/aman-poster/app/"
        className="rounded-full border border-white/30 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:border-emerald hover:text-emerald-light"
      >
        Sudah punya kode? Masuk →
      </Link>
    </div>
  );
}

export default function AmanPosterPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="px-4 pb-14 pt-28 text-center" style={{ backgroundColor: "#070B14" }}>
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald-light">
            ✨ Bertenaga AI
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
            Racik Prompt Poster Promosi{" "}
            <span className="text-emerald-light">Siap Pakai untuk AI Gambar</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            AMAN Poster Generator meracik headline, keunggulan produk, penawaran, CTA, sampai prompt visual lengkap (format JSON + teks). Tinggal isi info bisnis, klik Buat Prompt, lalu salin ke Canva Magic Media, ChatGPT, atau Gemini untuk membuat gambarnya.
          </p>
          <div className="mt-7">
            <PriceTag />
          </div>
          <div className="mt-7">
            <CtaButtons />
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Akses khusus pemegang kode · Jalan di browser · Tanpa install
          </p>
        </div>
      </section>

      {/* ===== MASALAH ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            Kenapa Bikin Poster Terasa Ribet
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Bukan kurang produk — cuma repot bikin materinya
          </h2>
          <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-navy">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FITUR ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            Yang Kamu Dapat
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Dari info bisnis ke prompt siap pakai
          </h2>
          <div className="mt-12 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== GAYA & FORMAT ===== */}
      <section className="bg-white py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            Gaya &amp; Format
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Cocok untuk semua jenis usaha
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {styles.map((s) => (
              <span
                key={s}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-navy"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA PENUTUP ===== */}
      <section className="px-4 py-20 text-center" style={{ backgroundColor: "#070B14" }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
            Siap bikin poster tanpa bayar desainer?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Akses khusus pemegang kode. Belum punya? Beli kode akses — langsung dapat &amp; bisa dipakai saat itu juga.
          </p>
          <div className="mt-8">
            <PriceTag />
          </div>
          <div className="mt-7">
            <CtaButtons />
          </div>
        </div>
      </section>
    </>
  );
}
