import type { Metadata } from "next";
import Link from "next/link";
import {
  Wand2,
  UserCog,
  ImagePlus,
  Code2,
  Film,
  Save,
  Lightbulb,
  Copy,
  Hourglass,
  type LucideIcon,
} from "lucide-react";
import { pageMeta } from "@/lib/seo";

const CHECKOUT = "https://lynk.id/adya.malik/6y6m9djlkywg/checkout";

export const metadata: Metadata = pageMeta({
  title: "AMAN Engine — Storyboard Generator AI | AMAN Digital",
  description:
    "AMAN Engine merangkai ide cerita, karakter, dan prompt visual jadi satu storyboard rapi untuk konten TikTok & Instagram yang konsisten tiap hari.",
  path: "/aman-engine",
});

const problems: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Lightbulb,
    title: "Kehabisan ide",
    desc: "Bingung mau bikin cerita apa lagi. AMAN Engine kasih ide topik per-genre dalam sekali klik.",
  },
  {
    icon: Copy,
    title: "Gaya tidak konsisten",
    desc: "Karakter dan visual berubah-ubah tiap video. Character Bible menjaga tokoh & gaya tetap sama.",
  },
  {
    icon: Hourglass,
    title: "Makan waktu",
    desc: "Nyusun script + prompt satu per satu itu lama. Di sini semuanya jadi dalam hitungan detik.",
  },
];

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Wand2,
    title: "Magic Story Generator",
    desc: "Ketik topik (atau minta AI carikan), pilih genre, tentukan jumlah scene — cerita utuh langsung tersusun.",
  },
  {
    icon: UserCog,
    title: "Character Bible",
    desc: "Kunci nama, wajah, dan kostum tokoh sekali — supaya karakter tampil konsisten di semua scene & video.",
  },
  {
    icon: ImagePlus,
    title: "Analisa Gambar Referensi",
    desc: "Unggah gambar, AI baca gayanya dan usulkan topik cerita yang cocok untuk kontenmu.",
  },
  {
    icon: Code2,
    title: "Prompt JSON Siap Pakai",
    desc: "Hasilnya berupa prompt terstruktur untuk AI gambar/video — tinggal salin ke tool generator favoritmu.",
  },
  {
    icon: Film,
    title: "Video Prompt",
    desc: "Selain gambar per-scene, ada prompt gerak/animasi supaya storyboard siap dijadikan video pendek.",
  },
  {
    icon: Save,
    title: "Draft Otomatis",
    desc: "Progres tersimpan otomatis di browser. Tutup tab, buka lagi, lanjut dari tempat terakhir.",
  },
];

const styles = [
  "Knitted Wool",
  "Claymation",
  "Paper Craft",
  "3D Mini Toy",
  "Watercolor",
  "Custom Style",
];

const steps = [
  {
    num: "01",
    title: "Pilih gaya & genre",
    desc: "Tentukan gaya visual dan genre cerita yang sesuai brand kontenmu.",
  },
  {
    num: "02",
    title: "Isi topik atau minta AI",
    desc: "Ketik ide sendiri, atau biarkan AI mengusulkan topik yang menarik.",
  },
  {
    num: "03",
    title: "Generate storyboard",
    desc: "AMAN Engine menyusun scene, karakter, dan prompt gambar/video secara otomatis.",
  },
  {
    num: "04",
    title: "Salin & produksi",
    desc: "Salin prompt JSON ke tool AI gambar/video favoritmu, rakit jadi video, upload.",
  },
];

function PriceTag() {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-3xl font-black text-white">Rp 39.000</span>
      <span className="text-lg text-slate-500 line-through">Rp 79.000</span>
      <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald-light">
        Hemat 51%
      </span>
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
      {/* Mengarah ke /app/, BUKAN /masuk: middleware di functions/aman-engine/
          app/_middleware.ts sudah melempar ke /masuk kalau sesi perangkat belum
          ada. Jadi yang sudah pernah masuk langsung terbuka aplikasinya tanpa
          diminta kode lagi, sementara yang belum tetap diminta kode. */}
      <Link
        href="/aman-engine/app/"
        className="rounded-full border border-white/30 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:border-emerald hover:text-emerald-light"
      >
        Sudah punya kode? Masuk →
      </Link>
    </div>
  );
}

export default function AmanEnginePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="px-4 pb-14 pt-28 text-center" style={{ backgroundColor: "#070B14" }}>
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald-light">
            ✨ Bertenaga AI
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
            Bikin Konten TikTok &amp; Instagram{" "}
            <span className="text-emerald-light">Konsisten Tiap Hari</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            AMAN Engine merangkai ide cerita, karakter, dan prompt visual jadi satu storyboard rapi — supaya kamu tidak lagi kehabisan ide atau bingung menjaga gaya konten tetap sama.
          </p>
          <div className="mt-7">
            <PriceTag />
          </div>
          <div className="mt-7">
            <CtaButtons />
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Akses khusus pemegang kode · Langsung jalan di browser · Tanpa install
          </p>
        </div>
      </section>

      {/* ===== MASALAH ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            Kenapa Konten Sering Mandek
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Bukan malas — cuma capek mikir dari nol tiap hari
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
            Yang Bisa Dilakukan
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Satu alat, dari ide sampai prompt siap render
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

      {/* ===== GAYA VISUAL ===== */}
      <section className="bg-white py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            6 Gaya Visual Siap Pilih
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Satu identitas visual untuk semua kontenmu
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

      {/* ===== CARA PAKAI ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Cara Pakai
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Empat langkah, konten siap tayang
            </h2>
          </div>
          <div className="mt-12 space-y-5">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="font-mono text-3xl font-light text-emerald">{s.num}</span>
                <div>
                  <h3 className="text-lg font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA PENUTUP ===== */}
      <section className="px-4 py-20 text-center" style={{ backgroundColor: "#070B14" }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
            Siap bikin konten lebih cepat &amp; konsisten?
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
