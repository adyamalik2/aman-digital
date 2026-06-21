"use client";

import { useState } from "react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

/* ---------------- Data ---------------- */

const services = [
  {
    icon: "💻",
    title: "Hardware & Komputer",
    desc: "Perbaikan laptop dan PC, upgrade RAM/SSD, bersih debu, instalasi ulang OS, dan diagnosis kerusakan komponen. Ditangani langsung, bukan dikira-kira.",
    wide: false,
  },
  {
    icon: "📶",
    title: "Jaringan & WiFi Kantor",
    desc: "Setup router, konfigurasi jaringan LAN/WiFi, manajemen bandwidth per ruangan, dan stabilisasi koneksi agar kerja tim tidak terganggu sinyal buruk.",
    wide: false,
  },
  {
    icon: "🛡️",
    title: "Keamanan & Backup Data",
    desc: "Instalasi antivirus, enkripsi folder penting, dan sistem backup data reguler. Melindungi file operasional bisnis dari kehilangan maupun ancaman siber.",
    wide: false,
  },
  {
    icon: "🖨️",
    title: "Setup Peripheral",
    desc: "Instalasi dan konfigurasi printer, scanner, mesin kasir, kamera CCTV, dan perangkat tambahan kantor agar semua tersambung dan berfungsi dengan benar.",
    wide: false,
  },
  {
    icon: "🎧",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-16 pt-28 text-center sm:pt-36"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-light text-3xl shadow-lg">
            🖥️
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            IT Support & Advisor untuk Kantor Kecil
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-300">
            Perangkat, jaringan, dan sistem kerja kantor kecil Anda ditangani
            oleh teknisi berpengalaman — tanpa biaya vendor besar.
          </p>
        </div>
      </section>

      {/* ===== LAYANAN ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className={`rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald hover:shadow-md ${
                  s.wide ? "md:col-span-2" : ""
                }`}
              >
                <div className="text-4xl">{s.icon}</div>
                <h2 className="mt-3 text-2xl font-bold text-navy">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
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
                    aria-expanded={open}
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
                  {open && (
                    <p className="px-6 pb-5 leading-relaxed text-slate-600">
                      {item.a}
                    </p>
                  )}
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
