"use client";

import { useState, type ReactNode } from "react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

/* ---------------- Data ---------------- */

const categories = [
  { key: "semua", label: "Semua" },
  { key: "umum", label: "Umum" },
  { key: "kasir", label: "AMAN Kasir" },
  { key: "budget", label: "AMAN Budget" },
  { key: "invoice", label: "AMAN Invoice" },
  { key: "layanan", label: "Layanan" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

const badgeStyles: Record<
  Exclude<CategoryKey, "semua">,
  { label: string; className: string }
> = {
  umum: { label: "Umum", className: "bg-indigo-100 text-indigo-700" },
  kasir: { label: "Kasir", className: "bg-emerald/10 text-emerald" },
  budget: { label: "Budget", className: "bg-amber-100 text-amber-700" },
  invoice: { label: "Invoice", className: "bg-blue-100 text-blue-700" },
  layanan: { label: "Layanan", className: "bg-pink-100 text-pink-700" },
};

const b = (text: string) => (
  <strong className="font-semibold text-navy">{text}</strong>
);

type Faq = { category: Exclude<CategoryKey, "semua">; q: string; a: ReactNode };

const faqs: Faq[] = [
  {
    category: "umum",
    q: "Apa itu AMAN Digital?",
    a: "AMAN Digital adalah platform digital untuk UMKM Indonesia yang menyediakan tiga aplikasi bisnis (AMAN Kasir, AMAN Budget, AMAN Invoice) dan lima layanan profesional (Data & System, IT Advisor, Print Center, Creative Studio, Digital Store). Kami berbasis di Blangpidie, Aceh, dan melayani seluruh Indonesia secara online.",
  },
  {
    category: "umum",
    q: "Apakah konsultasi awal berbayar?",
    a: "Tidak. Konsultasi awal sepenuhnya gratis tanpa syarat. Hubungi kami via WhatsApp dan kami siap berdiskusi kapan pun.",
  },
  {
    category: "umum",
    q: "Bagaimana cara memulai menggunakan layanan AMAN Digital?",
    a: "Pilih layanan atau aplikasi yang Anda butuhkan, lalu hubungi kami via WhatsApp di +62 822-1076-8038. Tim kami akan memandu proses dari awal hingga selesai.",
  },
  {
    category: "umum",
    q: "Apa saja metode pembayaran yang diterima?",
    a: "Kami menerima transfer bank (BCA, BRI, BNI, Mandiri) dan dompet digital (GoPay, OVO, Dana). Detail rekening diberikan saat proses pemesanan.",
  },
  {
    category: "umum",
    q: "Apakah AMAN Digital melayani pelanggan di luar Aceh?",
    a: "Ya. Semua layanan dapat dilakukan secara remote untuk seluruh Indonesia. Untuk Print Center, file dikirim via WhatsApp/email dan hasil cetak dikirimkan ke alamat Anda.",
  },
  {
    category: "kasir",
    q: "Apa itu AMAN Kasir dan siapa yang cocok menggunakannya?",
    a: "AMAN Kasir adalah aplikasi kasir berbasis web untuk UMKM — warung, toko, kafe, dan usaha kecil lainnya. Cocok untuk yang ingin mencatat transaksi, mengelola stok, dan melihat laporan penjualan tanpa perlu install aplikasi khusus.",
  },
  {
    category: "kasir",
    q: "Berapa harga AMAN Kasir?",
    a: (
      <>
        Ada 3 paket: {b("Gratis")} (Rp0, 100 transaksi/bulan), {b("Dasar")} (Rp49.000/bulan, 500 transaksi, 2 pengguna), {b("Pro")} (Rp99.000/bulan, transaksi unlimited, 5 pengguna, support WA prioritas). Saat ini semua pengguna awal mendapat akses Early Access gratis penuh.
      </>
    ),
  },
  {
    category: "kasir",
    q: "Apakah AMAN Kasir bisa digunakan offline?",
    a: "Bisa. AMAN Kasir adalah aplikasi web (PWA) yang offline-capable — transaksi tetap berjalan walau sinyal putus, lalu tersinkron otomatis saat online kembali. Cukup dibuka dari browser HP dan bisa ditambahkan ke layar utama seperti aplikasi biasa.",
  },
  {
    category: "kasir",
    q: "Apakah bisa mencetak struk?",
    a: "Bisa. AMAN Kasir mendukung printer thermal bluetooth dan juga fitur share struk digital langsung via WhatsApp ke pelanggan.",
  },
  {
    category: "kasir",
    q: "Apakah data penjualan saya aman?",
    a: "Data tersimpan di server terenkripsi dengan backup otomatis harian. Kami tidak pernah membagikan data Anda ke pihak ketiga.",
  },
  {
    category: "budget",
    q: "Apa bedanya AMAN Budget dengan aplikasi keuangan lain?",
    a: "AMAN Budget dirancang khusus untuk UMKM Indonesia — fitur unggulan adalah pemisahan uang bisnis & pribadi, Budget Goals untuk target tabungan, dan antarmuka penuh Bahasa Indonesia yang mudah dipahami siapa saja.",
  },
  {
    category: "budget",
    q: "Berapa harga AMAN Budget?",
    a: (
      <>
        {b("Gratis")} (Rp0, 100 transaksi/bulan, 3 Goals), {b("Dasar")} (Rp49.000/bulan, 500 transaksi, 10 Goals, 2 pengguna), {b("Pro")} (Rp99.000/bulan, unlimited, Goals unlimited, 5 pengguna).
      </>
    ),
  },
  {
    category: "budget",
    q: "Apa itu fitur Budget Goals?",
    a: 'Budget Goals membantu Anda menetapkan target keuangan spesifik, misalnya "Tabungan beli mesin Rp5 juta" atau "Batas belanja operasional bulan ini Rp2 juta." Progresnya terpantau secara visual.',
  },
  {
    category: "budget",
    q: "Bisakah digunakan bersama istri/suami atau tim?",
    a: "Paket Pro mendukung hingga 5 pengguna dalam satu akun — sangat cocok untuk usaha keluarga atau usaha dengan beberapa admin.",
  },
  {
    category: "budget",
    q: "Kapan AMAN Budget tersedia secara penuh?",
    a: "Saat ini masih dalam Early Access. Daftar sekarang dan nikmati akses gratis penuh selama periode Early Access berlangsung.",
  },
  {
    category: "invoice",
    q: "Apa keunggulan AMAN Invoice dibanding buat invoice manual di Word/Excel?",
    a: "Dengan AMAN Invoice, Anda buat invoice profesional dalam hitungan menit, kirim langsung ke klien via WhatsApp atau email, dan bisa memantau status pembayaran — semua dari satu tempat tanpa harus mendesain ulang setiap kali.",
  },
  {
    category: "invoice",
    q: "Berapa harga AMAN Invoice?",
    a: (
      <>
        {b("Gratis")} (Rp0, 10 invoice/bulan), {b("Dasar")} (Rp49.000/bulan, 100 invoice, 2 pengguna), {b("Pro")} (Rp99.000/bulan, invoice unlimited, 5 pengguna, support WA prioritas).
      </>
    ),
  },
  {
    category: "invoice",
    q: "Apakah klien perlu install aplikasi untuk melihat invoice?",
    a: "Tidak. Klien hanya perlu klik link yang Anda kirim via WhatsApp/email, lalu invoice langsung terbuka di browser mereka.",
  },
  {
    category: "invoice",
    q: "Bisakah saya menambahkan logo bisnis?",
    a: "Ya. Upload logo bisnis Anda dan sesuaikan warna invoice dengan identitas brand usaha Anda.",
  },
  {
    category: "invoice",
    q: "Format apa yang tersedia untuk invoice?",
    a: "Invoice dapat diunduh sebagai PDF atau dibagikan sebagai link online yang bisa dicetak oleh klien.",
  },
  {
    category: "layanan",
    q: "Apa saja layanan utama AMAN Digital?",
    a: (
      <>
        Lima layanan: (1) {b("Data & System")} — dashboard dan sistem digital untuk bisnis; (2) {b("IT Advisor")} — konsultasi teknologi dan solusi digital; (3) {b("Print Center")} — cetak banner, brosur, undangan, dan lainnya; (4) {b("Digital Store")} — produk digital siap pakai (template, prompt AI); (5) {b("Creative Studio")} — konten kreatif TikTok, Instagram, dan copywriting.
      </>
    ),
  },
  {
    category: "layanan",
    q: "Berapa lama pengerjaan proyek Data & System?",
    a: "Dashboard bisnis sederhana biasanya 3–7 hari kerja. Sistem yang lebih kompleks 2–4 minggu. Estimasi waktu selalu diberikan sebelum pengerjaan dimulai.",
  },
  {
    category: "layanan",
    q: "Apakah Print Center bisa menerima pesanan dari luar kota?",
    a: "Ya. Kirim file desain via WhatsApp atau email, kami cetak dan kirimkan ke alamat Anda. Biaya pengiriman ditanggung pelanggan sesuai tarif ekspedisi pilihan.",
  },
  {
    category: "layanan",
    q: "Apa yang bisa dikerjakan Creative Studio untuk bisnis saya?",
    a: "Kami membantu dari konsep hingga produksi: foto produk, video pendek TikTok/Reels, narasi & copywriting, serta strategi konten. Hubungi kami untuk paket yang sesuai budget Anda.",
  },
  {
    category: "layanan",
    q: "Bagaimana cara mendaftar program reseller?",
    a: 'Program reseller sedang dalam persiapan. Daftarkan minat Anda via WhatsApp dengan pesan "Saya ingin jadi Reseller AMAN Digital" — kami akan menghubungi saat program resmi diluncurkan.',
  },
];

/* ---------------- Page ---------------- */

export default function FaqPage() {
  const [tab, setTab] = useState<CategoryKey>("semua");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const visible = faqs.filter((f) => tab === "semua" || f.category === tab);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-14 pt-28 text-center sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-3xl">
          <a
            href={wa("Halo AMAN Digital")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-semibold text-emerald-light transition-colors hover:bg-emerald/20"
          >
            💬 Tanya via WhatsApp →
          </a>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Pertanyaan yang Sering Ditanya
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300 md:text-xl">
            Temukan jawaban cepat di sini, atau hubungi kami langsung.
          </p>
        </div>
      </section>

      {/* ===== TABS + ACCORDION ===== */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Tab filter */}
          <div
            className="mb-10 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Filter FAQ"
          >
            {categories.map((c) => {
              const active = c.key === tab;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setTab(c.key);
                    setOpenFaq(0);
                  }}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-emerald-cta text-white"
                      : "border border-slate-300 text-slate-600 hover:border-emerald hover:text-emerald"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Accordion */}
          {visible.length > 0 ? (
            <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
              {visible.map((f, i) => {
                const key = `${f.category}-${f.q}`;
                const open = openFaq === i;
                const badge = badgeStyles[f.category];
                return (
                  <div key={key}>
                    <button
                      type="button"
                      id={`faq-trigger-${i}`}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                      className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold transition-colors ${
                        open
                          ? "bg-emerald/5 text-emerald"
                          : "text-navy hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex flex-1 items-center gap-2">
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {f.q}
                      </span>
                      <span
                        className={`shrink-0 text-emerald transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      >
                        ⌄
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      hidden={!open}
                      className="border-t border-emerald/20 px-6 pb-5 pt-3.5 text-[0.9375rem] leading-relaxed text-slate-600"
                    >
                      {f.a}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p>Tidak ada FAQ untuk kategori ini saat ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-white px-4 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-gradient-to-br from-emerald to-emerald-dark p-10 text-center sm:p-14">
            <h2 className="text-3xl font-bold text-white">
              Belum Menemukan Jawaban?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/80">
              Tim kami siap menjawab pertanyaan spesifik Anda. Respon dalam 1–2
              jam di jam kerja.
            </p>
            <a
              href={wa("Halo AMAN Digital, saya punya pertanyaan")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-bold text-emerald transition-colors hover:bg-slate-100"
            >
              Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
