"use client";

import { useState } from "react";
import {
  Printer,
  FileText,
  Image as ImageIcon,
  Coffee,
  Tag,
  Layers,
  MapPin,
  Clock,
  Upload,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import ServiceHero from "@/components/layout/ServiceHero";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

/* ---------------- Data ---------------- */

const services: { icon: LucideIcon; title: string; desc: string; wide: boolean }[] = [
  {
    icon: FileText,
    title: "Cetak Dokumen",
    desc: "Cetak laporan bisnis, makalah, skripsi, proposal, dan dokumen kerja harian. Tersedia pilihan kertas HVS, art paper, dan jasa penjilidan spiral maupun softcover.",
    wide: false,
  },
  {
    icon: ImageIcon,
    title: "Banner & Spanduk",
    desc: "Cetak banner ukuran besar untuk promosi toko, acara, dan kebutuhan outdoor. Tersedia spanduk, x-banner, roll-up banner, dan backdrop dengan material tahan cuaca.",
    wide: false,
  },
  {
    icon: Coffee,
    title: "Merchandise Promosi",
    desc: "Cetak logo dan desain bisnis Anda pada mug, kaos, topi, dan pin. Cocok untuk souvenir, hadiah pelanggan, atau kelengkapan seragam tim usaha.",
    wide: false,
  },
  {
    icon: Tag,
    title: "Stiker & Label",
    desc: "Cetak stiker produk, label kemasan, stiker promosi, dan QR code. Tersedia pilihan bahan vinyl, kertas, dan laminasi glossy maupun matte sesuai kebutuhan.",
    wide: false,
  },
  {
    icon: Layers,
    title: "Brosur & Pamflet",
    desc: "Cetak brosur lipat (bifold/trifold), pamflet A4/A5, dan flyer promosi untuk bisnis lokal. Tersedia jasa desain jika Anda belum punya file siap cetak — hubungi kami via WhatsApp untuk konsultasi.",
    wide: true,
  },
];

const infoItems: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: MapPin, label: "Lokasi", value: "Blangpidie, Aceh Barat Daya" },
  {
    icon: Clock,
    label: "Estimasi Pengerjaan",
    value: "1–3 hari kerja (setelah file disetujui)",
  },
  { icon: Upload, label: "Format File Diterima", value: "PDF, PNG, JPG, CDR, AI" },
  {
    icon: MessageCircle,
    label: "Cara Pesan",
    value: "Chat via WhatsApp, kirim file + keterangan ukuran",
  },
];

const faqs = [
  {
    q: "Format file apa yang diterima untuk cetak?",
    a: "Kami menerima PDF, PNG, JPG resolusi tinggi, CDR (CorelDRAW), dan AI (Adobe Illustrator). Untuk hasil terbaik, gunakan resolusi minimal 150 dpi untuk banner dan 300 dpi untuk dokumen. Jika file Anda belum siap cetak, kami bisa bantu penyesuaian file.",
  },
  {
    q: "Apakah bisa minta bantuan desain?",
    a: "Bisa. Kami menyediakan jasa desain untuk banner, brosur, dan stiker dengan biaya terpisah. Hubungi kami via WhatsApp dengan info kebutuhan (jenis, ukuran, teks yang ingin ditampilkan), dan kami akan berikan estimasi waktu serta biaya desain.",
  },
  {
    q: "Berapa lama proses pengerjaan?",
    a: "Estimasi 1–3 hari kerja setelah file cetak disetujui. Untuk kebutuhan mendesak, hubungi kami lebih awal — kami akan informasikan apakah slot ekspres tersedia. Waktu pengerjaan bisa lebih panjang untuk order dalam jumlah banyak atau ukuran besar.",
  },
  {
    q: "Apakah ada layanan pengiriman?",
    a: "Untuk area Blangpidie dan sekitarnya, pengiriman bisa diatur langsung. Untuk luar kota, produk bisa dikirim via jasa ekspedisi dengan biaya ongkir ditanggung pemesan. Hubungi kami untuk konfirmasi wilayah pengiriman.",
  },
];

/* ---------------- Page ---------------- */

export default function PrintCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ===== HERO ===== */}
      <ServiceHero
        icon={<Printer size={32} />}
        title="Print Center — Cetak Cepat, Hasil Rapi"
        subtitle="Dari dokumen harian hingga banner promosi — dikerjakan cepat dengan warna akurat dan bahan sesuai kebutuhan bisnis Anda."
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

      {/* ===== INFO PRAKTIS ===== */}
      <section className="py-16" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-navy">Info Praktis</h2>
          <p className="mt-2 text-slate-600">
            Yang perlu Anda ketahui sebelum memesan.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {infoItems.map((info) => {
              const Icon = info.icon;
              return (
              <div
                key={info.label}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <Icon size={22} className="mt-0.5 shrink-0 text-emerald" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {info.label}
                  </div>
                  <div className="mt-0.5 font-semibold text-navy">
                    {info.value}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-white py-16">
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
      <section className="py-16 text-center" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-2xl px-4">
          <p className="mb-6 text-lg text-slate-600">
            Butuh cetak segera? Hubungi kami sekarang.
          </p>
          <a
            href={wa(
              "Halo AMAN Digital, saya ingin memesan layanan Print Center. Tolong info harga dan waktu pengerjaan."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-emerald px-8 py-3.5 font-bold text-white transition-colors hover:bg-emerald-dark"
          >
            Pesan Cetak via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
