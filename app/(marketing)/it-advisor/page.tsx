"use client";

import { useState } from "react";
import {
  Cpu,
  Laptop,
  Wifi,
  ShieldCheck,
  Printer,
  Headset,
  type LucideIcon,
} from "lucide-react";
import ServiceHero from "@/components/layout/ServiceHero";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

/* ---------------- Data ---------------- */

const services: { icon: LucideIcon; title: string; desc: string; wide: boolean }[] = [
  {
    icon: Laptop,
    title: "Hardware & Komputer",
    desc: "Perbaikan laptop dan PC, upgrade RAM/SSD, bersih debu, instalasi ulang OS, dan diagnosis kerusakan komponen. Ditangani langsung, bukan dikira-kira.",
    wide: false,
  },
  {
    icon: Wifi,
    title: "Jaringan & WiFi Kantor",
    desc: "Setup router, konfigurasi jaringan LAN/WiFi, manajemen bandwidth per ruangan, dan stabilisasi koneksi agar kerja tim tidak terganggu sinyal buruk.",
    wide: false,
  },
  {
    icon: ShieldCheck,
    title: "Keamanan & Backup Data",
    desc: "Instalasi antivirus, enkripsi folder penting, dan sistem backup data reguler. Melindungi file operasional bisnis dari kehilangan maupun ancaman siber.",
    wide: false,
  },
  {
    icon: Printer,
    title: "Setup Peripheral",
    desc: "Instalasi dan konfigurasi printer, scanner, mesin kasir, kamera CCTV, dan perangkat tambahan kantor agar semua tersambung dan berfungsi dengan benar.",
    wide: false,
  },
  {
    icon: Headset,
    title: "Konsultasi & Rekomendasi Perangkat",
    desc: "Tidak perlu riset sendiri sebelum beli laptop, printer, atau router. Kami bantu petakan kebutuhan kantor, rekomendasikan pilihan yang tepat sesuai anggaran, dan bantu proses setup awal setelah pembelian.",
    wide: true,
  },
];

const faqs = [
  {
    q: "Apakah layanan bisa dilakukan secara remote?",
    a: "Untuk masalah software, konfigurasi jaringan, dan konsultasi perangkat — bisa remote via WhatsApp atau screen sharing. Untuk perbaikan hardware fisik, kunjungan langsung ke lokasi di area Aceh Barat Daya dan sekitarnya.",
  },
  {
    q: "Berapa biaya kunjungan IT?",
    a: "Biaya kunjungan dan perbaikan menyesuaikan jenis pekerjaan dan jarak. Konsultasi awal via WhatsApp gratis — kami bantu petakan masalah dulu sebelum tentukan estimasi biaya.",
  },
  {
    q: "Apakah ada garansi untuk perangkat yang diperbaiki?",
    a: "Perbaikan disertai garansi kerja sesuai jenis masalah (biasanya 7–14 hari). Jika masalah yang sama berulang setelah perbaikan, kami bantu tinjau ulang tanpa biaya tambahan.",
  },
  {
    q: "Perangkat apa saja yang bisa ditangani?",
    a: "Laptop, PC desktop, router, switch jaringan, printer, scanner, mesin kasir, dan kamera IP/CCTV. Untuk perangkat brand atau model tertentu yang butuh suku cadang khusus, kami infokan lebih awal sebelum pengerjaan.",
  },
];

/* ---------------- Page ---------------- */

export default function ItAdvisorPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ===== HERO ===== */}
      <ServiceHero
        icon={<Cpu size={32} />}
        title="IT Support & Advisor untuk Kantor Kecil"
        subtitle="Perangkat, jaringan, dan sistem kerja kantor kecil Anda ditangani oleh teknisi berpengalaman — tanpa biaya vendor besar."
      />

      {/* ===== LAYANAN ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className={`rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald hover:shadow-md ${
                    s.wide ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                    <Icon size={28} />
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-navy">
                    {s.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-navy">
            Pertanyaan yang Sering Ditanyakan
          </h2>
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
                    id={`faq-trigger-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-navy"
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
                  <p
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    hidden={!open}
                    className="px-6 pb-5 leading-relaxed text-slate-600"
                  >
                    {item.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-white py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="mb-6 text-lg text-slate-600">
            Punya masalah IT di kantor? Ceritakan dulu — konsultasi awal gratis.
          </p>
          <a
            href={wa(
              "Halo AMAN Digital, saya ingin konsultasi layanan IT Advisor untuk kantor saya."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-emerald px-8 py-3.5 font-bold text-white transition-colors hover:bg-emerald-dark"
          >
            Konsultasi IT Advisor Gratis
          </a>
        </div>
      </section>
    </>
  );
}
