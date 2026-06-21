import {
  Store,
  LayoutDashboard,
  Smartphone,
  Bot,
  Headset,
  type LucideIcon,
} from "lucide-react";
import ServiceHero from "@/components/layout/ServiceHero";
import { pageMeta } from "@/lib/seo";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

export const metadata = pageMeta({
  title: "Digital Store | AMAN Digital",
  description:
    "Digital Store AMAN Digital menyediakan produk digital, template, e-book, lisensi software, serta aksesori IT untuk produktivitas bisnis modern.",
  path: "/digital-store",
});

/* ---------------- Data ---------------- */

type Product = {
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: { label: string; href: string; type: "shopee" | "wa" };
};

const products: Product[] = [
  {
    icon: LayoutDashboard,
    title: "Template Bisnis",
    desc: "Template siap pakai untuk proposal, laporan keuangan, SOP, dan presentasi bisnis. Tinggal isi data Anda, tampilan sudah rapi dan profesional.",
    cta: {
      label: "Lihat di Shopee",
      href: "https://lynk.id/adya.malik",
      type: "shopee",
    },
  },
  {
    icon: Smartphone,
    title: "Template AppSheet Premium",
    desc: "Template aplikasi AppSheet siap deploy untuk kasir, stok, absensi, dan catatan operasional harian. Beli sekali, langsung pakai tanpa coding.",
    cta: {
      label: "Tanya via WhatsApp",
      href: wa(
        "Halo AMAN Digital, saya tertarik Template AppSheet Premium. Tolong info lebih lanjut."
      ),
      type: "wa",
    },
  },
  {
    icon: Bot,
    title: "Prompt AI untuk Bisnis",
    desc: "Kumpulan prompt AI yang telah diuji untuk membuat konten, menyusun SOP, analisis data, dan ide promosi — langsung pakai tanpa harus eksperimen sendiri.",
    cta: {
      label: "Lihat di Shopee",
      href: "https://lynk.id/adya.malik",
      type: "shopee",
    },
  },
  {
    icon: Headset,
    title: "Konsultasi Perangkat Kantor",
    desc: "Tidak yakin mau beli laptop, printer, atau router yang mana? Kami bantu pilihkan sesuai kebutuhan dan anggaran kantor Anda — tanpa beli perangkat yang salah.",
    cta: {
      label: "Konsultasi via WhatsApp",
      href: wa(
        "Halo AMAN Digital, saya butuh konsultasi perangkat untuk kantor."
      ),
      type: "wa",
    },
  },
];

/* ---------------- Page ---------------- */

export default function DigitalStorePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <ServiceHero
        icon={<Store size={32} />}
        title="Produk Digital Siap Pakai untuk Bisnis"
        subtitle="Template, aset digital, dan tools yang membantu bisnis Anda tidak perlu mulai dari nol."
      />

      {/* ===== PRODUK ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p) => {
              const Icon = p.icon;
              return (
              <div
                key={p.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald hover:shadow-md"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                  <Icon size={28} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-navy">{p.title}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                  {p.desc}
                </p>
                <a
                  href={p.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors ${
                    p.cta.type === "shopee"
                      ? "bg-[#EE4D2D] hover:bg-[#C73D22]"
                      : "bg-wa hover:opacity-90"
                  }`}
                >
                  {p.cta.type === "shopee" ? "🛍️" : "💬"} {p.cta.label}
                </a>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
