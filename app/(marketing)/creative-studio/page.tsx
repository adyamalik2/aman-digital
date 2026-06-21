import { Clapperboard, Video, Bot, Pencil, type LucideIcon } from "lucide-react";
import ServiceHero from "@/components/layout/ServiceHero";
import { TiktokIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import { pageMeta } from "@/lib/seo";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

export const metadata = pageMeta({
  title: "Creative Studio | AMAN Digital",
  description:
    "Creative Studio AMAN Digital menghadirkan produksi konten video, AI prompt engineering, dan voice-over profesional untuk kebutuhan branding digital.",
  path: "/creative-studio",
});

/* ---------------- Data ---------------- */

const services: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Video,
    title: "Faceless Video Content",
    desc: "Pembuatan video TikTok dan Reels tanpa wajah yang edukatif (sains, fakta unik, dakwah) dengan metrik pemasaran Problem-Function-Solution yang terbukti efektif.",
  },
  {
    icon: Bot,
    title: "AI Prompt Engineering",
    desc: "Penyusunan prompt presisi tinggi untuk Leonardo.AI dan Midjourney guna menghasilkan aset visual unik untuk cover dan ilustrasi materi promosi berkualitas tinggi.",
  },
  {
    icon: Pencil,
    title: "Narasi & Copywriting Video",
    desc: "Penulisan naskah, narasi, dan teks promosi untuk TikTok, YouTube Shorts, Reels, dan iklan digital. Pesan yang tepat, gaya yang sesuai audiens, dan struktur yang bikin orang nonton sampai selesai.",
  },
];

const platforms = [
  {
    Icon: TiktokIcon,
    name: "TikTok",
    handle: "@adya.vision",
    desc: "Konten faceless video, fakta bisnis, dan edukasi UMKM",
    href: "https://tiktok.com/@adya.vision",
    iconBg: "bg-gradient-to-br from-slate-900 to-cyan-500",
  },
  {
    Icon: InstagramIcon,
    name: "Instagram",
    handle: "@aman.digital01",
    desc: "Visual promosi, template bisnis, dan update produk digital",
    href: "https://instagram.com/aman.digital01",
    iconBg: "bg-gradient-to-br from-pink-500 to-purple-600",
  },
];

/* ---------------- Page ---------------- */

export default function CreativeStudioPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <ServiceHero
        icon={<Clapperboard size={32} />}
        title="Creative Studio"
        subtitle="Kesulitan membuat konten visual yang menarik perhatian audiens di media sosial? Kami memproduksi konten video edukatif, rekayasa visual AI, dan voice-over profesional untuk membantu brand Anda tampil lebih meyakinkan dan berpotensi meningkatkan konversi."
      />

      {/* ===== LAYANAN ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
              <div
                key={s.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-emerald hover:shadow-md"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                  <Icon size={28} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-navy">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CONTOH KONTEN ===== */}
      <section className="py-16" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold text-navy">
            Lihat Contoh Konten Kami
          </h2>
          <p className="mt-2 text-center text-slate-600">
            Cek langsung hasil kerja kami di platform berikut.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {platforms.map((p) => {
              const Icon = p.Icon;
              return (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald hover:shadow-md"
              >
                <div
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white ${p.iconBg}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-base font-bold text-navy">{p.name}</div>
                  <div className="text-sm font-medium text-emerald">
                    {p.handle}
                  </div>
                  <div className="mt-0.5 text-sm leading-relaxed text-slate-600">
                    {p.desc}
                  </div>
                </div>
              </a>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <a
              href={wa(
                "Halo AMAN Digital, saya ingin berkonsultasi terkait layanan Creative Studio."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-emerald px-8 py-3.5 font-bold text-white transition-colors hover:bg-emerald-dark"
            >
              Konsultasi Creative Studio
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
