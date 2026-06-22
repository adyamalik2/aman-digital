"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  PackageOpen,
  BarChart3,
  Palette,
  Link2,
  TrendingUp,
  LayoutDashboard,
  MonitorCog,
  Printer,
  Store,
  BadgeCheck,
  MessageCircle,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

const HERO_WA = wa(
  "Halo AMAN Digital, saya ingin konsultasi kebutuhan bisnis untuk UMKM/toko/kantor kecil."
);

/* ---------------- Data ---------------- */

const problems: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: AlertTriangle,
    title: "Catatan transaksi tercecer",
    desc: "Transaksi dari toko, WhatsApp, dan catatan manual dirapikan agar lebih mudah dicari ulang.",
  },
  {
    icon: PackageOpen,
    title: "Stok tidak terpantau",
    desc: "Stok masuk, stok keluar, dan barang menipis dibuat lebih jelas untuk keputusan belanja.",
  },
  {
    icon: BarChart3,
    title: "Laporan bisnis masih manual",
    desc: "Rekap penjualan, omzet, dan kebutuhan laporan harian dibuat lebih ringkas.",
  },
  {
    icon: Palette,
    title: "Desain promosi tidak konsisten",
    desc: "Materi promosi digital dan cetak dijaga agar terlihat satu identitas.",
  },
  {
    icon: Link2,
    title: "Cetak dan digital berjalan terpisah",
    desc: "Kebutuhan banner, brosur, konten, dan template dibuat dalam alur yang lebih praktis.",
  },
  {
    icon: TrendingUp,
    title: "Data harian sulit dibaca",
    desc: "Pemilik bisnis dibantu melihat angka penting tanpa harus membuka banyak file.",
  },
];

const services: { icon: LucideIcon; title: string; desc: string; href: string }[] = [
  {
    icon: LayoutDashboard,
    title: "Data & System",
    desc: "Membantu bisnis mencatat transaksi, stok, dan laporan tanpa spreadsheet yang berantakan. Cocok untuk dashboard, sistem stok, dan aplikasi no-code.",
    href: "/data-system",
  },
  {
    icon: MonitorCog,
    title: "IT Advisor",
    desc: "Membantu memilih, merapikan, dan memperbaiki kebutuhan IT kantor kecil: perangkat, jaringan, software kerja, dan alur operasional digital.",
    href: "/it-advisor",
  },
  {
    icon: Printer,
    title: "Print Center",
    desc: "Membantu kebutuhan cetak promosi, dokumen, banner, dan merchandise agar hasilnya rapi, cepat dipakai, dan sesuai identitas bisnis.",
    href: "/print-center",
  },
  {
    icon: Store,
    title: "Digital Store",
    desc: "Menyediakan template, aset digital, dan kebutuhan pendukung kerja agar bisnis tidak perlu mulai dari nol untuk sistem dan promosi sederhana.",
    href: "/digital-store",
  },
  {
    icon: Palette,
    title: "Creative Studio",
    desc: "Membantu desain promosi, konten pendek, visual katalog, dan materi brand agar tampilan bisnis lebih konsisten di kanal digital maupun cetak.",
    href: "/creative-studio",
  },
];

const apps = [
  {
    badge: "AMAN Kasir",
    title: "Aplikasi Kasir & Stok",
    desc: "Catat transaksi, pantau stok masuk/keluar, dan lihat omzet harian langsung dari HP. Cocok untuk warung dan toko kecil.",
    features: [
      "Catat transaksi cepat",
      "Pantau stok barang",
      "Laporan omzet harian",
      "Bisa pakai offline",
    ],
    appUrl: "https://amandigital.web.id/aman-kasir/",
    detail: "/kasir",
  },
  {
    badge: "AMAN Budget",
    title: "Keuangan Keluarga",
    desc: "Atur uang keluarga per anggota (Ayah/Bunda), catat pemasukan & pengeluaran, target tabungan, sampai zakat — semua dari HP.",
    features: [
      "Catat per grup keluarga",
      "Target tabungan & goals",
      "Kalkulator zakat",
      "Gratis untuk mulai",
    ],
    appUrl: "https://amandigital.web.id/aman-budget/",
    detail: "/budget",
  },
  {
    badge: "AMAN Invoice",
    title: "Invoice & Penawaran",
    desc: "Buat invoice, nota, dan surat penawaran profesional dalam menit. Kirim ke pelanggan via WhatsApp atau cetak PDF.",
    features: [
      "Template invoice profesional",
      "Export & cetak PDF",
      "Kelola data pelanggan",
      "Kirim via WhatsApp",
    ],
    appUrl: "https://amandigital.web.id/aman-invoice1/",
    detail: "/invoice",
  },
];

const entryPoints = [
  {
    label: "Konsultasi Sistem Toko",
    href: wa("Halo AMAN Digital, saya ingin konsultasi sistem toko."),
  },
  {
    label: "Buat Dashboard Bisnis",
    href: wa("Halo AMAN Digital, saya ingin membuat dashboard bisnis."),
  },
  {
    label: "Pesan Desain dan Cetak",
    href: wa("Halo AMAN Digital, saya ingin pesan desain dan cetak."),
  },
  {
    label: "Audit Data Bisnis Saya",
    href: wa("Halo AMAN Digital, saya ingin audit data bisnis."),
  },
];

const portfolioCategories = [
  "Semua",
  "Data & System",
  "Print Center",
  "Creative Studio",
  "IT Advisor",
  "Digital Store",
];

const portfolio = [
  {
    category: "Data & System",
    emoji: "📊",
    image: "/images/portfolio-equipment-health-card.webp",
    judul: "Dashboard Equipment Health Monitoring",
    masalah: "Status inspeksi dan kesehatan unit sulit dibaca cepat.",
    solusi: "Dashboard Looker Studio dengan ringkasan status dan rating.",
    manfaat: "Memudahkan pemantauan data harian.",
    desc: "Visualisasi data inspeksi unit dalam satu tampilan ringkas.",
    tags: ["Looker Studio", "Google Sheets", "Apps Script"],
    link: "https://lookerstudio.google.com/reporting/d8f0b97a-61e7-45d5-aa83-5dd9e932bc64",
  },
  {
    category: "Data & System",
    emoji: "📱",
    image: "/images/aman-pos-kasir-card.webp",
    judul: "Aplikasi Tracking Order & Stok (AppSheet)",
    masalah: "Order dan stok mudah tercecer saat dicatat manual.",
    solusi: "Aplikasi no-code untuk alur order, stok, dan rekap.",
    manfaat: "Proses pencatatan lebih rapi.",
    desc: "Alur order dan stok dalam satu aplikasi yang mudah dipakai.",
    tags: ["AppSheet", "Google Sheets"],
    link: "/kasir",
  },
  {
    category: "Print Center",
    emoji: "🖨️",
    image: "/images/percetakan-card.webp",
    judul: "Cetak Banner & Spanduk Promosi",
    masalah: "Materi promosi perlu cepat dicetak dengan visual rapi.",
    solusi: "Persiapan desain dan cetak banner sesuai kebutuhan.",
    manfaat: "Promosi terlihat lebih siap dan profesional.",
    desc: "Desain dan cetak banner untuk kebutuhan promosi bisnis lokal.",
    tags: ["Digital Print", "Desain Custom"],
    link: "/print-center",
  },
  {
    category: "Creative Studio",
    emoji: "🎬",
    image: "/images/pekerja-digital-futuristik-card.webp",
    judul: "Konten Video Promosi Faceless",
    masalah: "Konten promosi sulit konsisten karena waktu terbatas.",
    solusi: "Video pendek untuk kebutuhan edukasi dan promosi.",
    manfaat: "Menyederhanakan proses kerja kreatif.",
    desc: "Produksi video pendek untuk kanal digital secara konsisten.",
    tags: ["Leonardo.ai", "TikTok", "Canva"],
    link: "https://tiktok.com/@adya.vision",
  },
  {
    category: "IT Advisor",
    emoji: "🌐",
    image: "/images/jaringan-wifi-digital-card.webp",
    judul: "Setup Jaringan & Manajemen WiFi Kantor",
    masalah: "Koneksi kerja tidak stabil dan bandwidth belum teratur.",
    solusi: "Pengaturan jaringan, router, dan manajemen akses WiFi.",
    manfaat: "Operasional kantor kecil lebih tertata.",
    desc: "Penataan jaringan kantor agar koneksi kerja lebih stabil.",
    tags: ["Networking", "Router Config"],
    link: "/it-advisor",
  },
  {
    category: "Digital Store",
    emoji: "🛒",
    image: "/images/dashboard-card.webp",
    judul: "Template Sistem Manajemen & Dashboard",
    masalah: "Banyak bisnis butuh format kerja siap pakai.",
    solusi: "Template sistem dan dashboard yang dapat disesuaikan.",
    manfaat: "Menyederhanakan proses kerja manual.",
    desc: "Template siap pakai untuk sistem kerja dan pelaporan.",
    tags: ["Google Sheets", "Looker Studio", "Shopee"],
    link: "https://shopee.co.id/aman.digital",
  },
];

const stats = [
  { value: "Early Access", label: "Mengajak UMKM pertama bergabung" },
  { value: "5", label: "Layanan dalam Satu Ekosistem" },
  { value: "3", label: "Aplikasi Gratis untuk Mulai" },
  { value: "100%", label: "Konsultasi Gratis via WhatsApp" },
];

const packages = [
  {
    title: "Paket Konsultasi IT",
    desc: "Audit ringan perangkat, jaringan, software kerja, dan rekomendasi perbaikan bertahap.",
    note: "Harga menyesuaikan ruang lingkup.",
    href: wa("Halo AMAN Digital, saya ingin tanya Paket Konsultasi IT."),
  },
  {
    title: "Paket Dashboard Bisnis",
    desc: "Dashboard penjualan, stok, laporan harian, atau monitoring operasional dari data yang sudah ada.",
    note: "Harga menyesuaikan ruang lingkup.",
    href: wa("Halo AMAN Digital, saya ingin tanya Paket Dashboard Bisnis."),
  },
  {
    title: "Paket Desain dan Cetak",
    desc: "Desain promosi, banner, dokumen, konten visual, dan kebutuhan cetak yang rapi untuk bisnis lokal.",
    note: "Harga menyesuaikan bahan dan jumlah.",
    href: wa("Halo AMAN Digital, saya ingin tanya Paket Desain dan Cetak."),
  },
  {
    title: "Paket Sistem Operasional UMKM",
    desc: "Sistem sederhana untuk order, stok, laporan, SOP digital, dan alur kerja yang mudah dipakai tim kecil.",
    note: "Mulai dari konsultasi kebutuhan.",
    href: wa(
      "Halo AMAN Digital, saya ingin tanya Paket Sistem Operasional UMKM."
    ),
  },
];

const reasons: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: BadgeCheck,
    title: "Praktis untuk UMKM",
    desc: "Solusi disusun sesuai kondisi toko kecil, bukan sistem yang terlalu berat.",
  },
  {
    icon: MessageCircle,
    title: "Konsultasi via WhatsApp",
    desc: "Bisa mulai dari cerita masalah bisnis, lalu kami bantu arahkan solusinya.",
  },
  {
    icon: Link2,
    title: "Cetak dan digital menyatu",
    desc: "Kebutuhan banner, konten, data, dan sistem bisa ditangani dalam satu alur.",
  },
  {
    icon: Settings,
    title: "Disesuaikan dengan alur bisnis",
    desc: "Sistem dibuat mengikuti cara kerja yang sudah ada agar mudah diadopsi.",
  },
  {
    icon: Target,
    title: "Fokus pada sistem yang mudah dipakai",
    desc: "Targetnya bukan sekadar terlihat canggih, tetapi benar-benar membantu pekerjaan harian.",
  },
];

const faqs = [
  {
    q: "Apakah AMAN Digital melayani di luar Aceh?",
    a: "Ya. Semua layanan dapat dilakukan secara remote untuk seluruh Indonesia. Untuk Print Center, file dikirim via WhatsApp atau email, hasil cetak dikirimkan ke alamat Anda.",
  },
  {
    q: "Berapa lama proses pengerjaan dashboard bisnis?",
    a: "Tergantung kompleksitas data dan kebutuhan. Dashboard sederhana biasanya selesai dalam 3–7 hari kerja. Proyek lebih kompleks bisa 2–4 minggu. Estimasi diberikan setelah konsultasi awal.",
  },
  {
    q: "Saya belum punya data yang rapi, bisa dibantu?",
    a: "Bisa. Kami bantu mulai dari merapikan data yang ada, menentukan format pencatatan, hingga membangun sistem yang sesuai kondisi bisnis Anda saat ini.",
  },
  {
    q: "Apakah harus paham teknologi untuk pakai layanan AMAN Digital?",
    a: "Tidak perlu. Kami dirancang untuk membantu pemilik bisnis yang tidak berlatar belakang teknis. Penjelasan dan pelatihan singkat diberikan agar Anda bisa pakai sendiri setelah selesai.",
  },
  {
    q: "Bisa lihat contoh hasil kerja sebelum order?",
    a: "Bisa. Silakan lihat bagian Portofolio di halaman ini, atau hubungi kami via WhatsApp untuk diskusi lebih lanjut.",
  },
  {
    q: "Apakah ada biaya konsultasi awal?",
    a: "Tidak ada. Konsultasi awal sepenuhnya gratis. Kami hanya menagih setelah ada kesepakatan pekerjaan dan proposal yang disetujui.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Kami menggunakan sistem DP (uang muka) di awal dan pelunasan setelah pekerjaan selesai. Detail akan dijelaskan dalam proposal yang dikirimkan.",
  },
];

/* ---------------- Helpers ---------------- */

const isExternal = (href: string) => href.startsWith("http");

function SectionHeading({
  label,
  title,
  subtitle,
  light = false,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {label && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald">
          {label}
        </p>
      )}
      <h2
        className={`text-3xl font-bold sm:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base ${
            light ? "text-white/80" : "text-slate-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredPortfolio =
    activeCategory === "Semua"
      ? portfolio
      : portfolio.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ===== SECTION 1 — HERO ===== */}
      <section
        className="flex min-h-screen items-center"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-24">
          <span className="inline-block rounded-full border border-emerald px-4 py-1 text-sm font-medium text-emerald">
            Partner Digital UMKM
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            Bantu UMKM, toko, dan kantor kecil punya sistem kerja yang lebih
            rapi
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            AMAN Digital membantu pembuatan dashboard, sistem stok, aplikasi
            no-code, kebutuhan cetak, dan konten promosi dalam satu layanan
            praktis.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={HERO_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-dark"
            >
              Konsultasi Kebutuhan Bisnis
            </a>
            <a
              href="#portofolio"
              className="rounded-lg border border-white px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-navy"
            >
              Lihat Portofolio
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: BarChart3, label: "Data" },
              { icon: Printer, label: "Cetak" },
              { icon: MessageCircle, label: "WA" },
            ].map((b) => {
              const Icon = b.icon;
              return (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm text-slate-300"
              >
                <Icon size={16} className="text-emerald-light" />
                {b.label}
              </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 2 — MASALAH ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="Masalah yang Kami Bantu Selesaikan"
            subtitle="Operasional kecil sering bocor di hal yang terlihat sederhana"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
              <div
                key={p.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-emerald">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-bold text-navy">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3 — LAYANAN ===== */}
      <section id="layanan" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            label="Layanan Praktis"
            title="5 Layanan untuk Merapikan Bisnis"
            subtitle="Bukan sekadar daftar jasa. Setiap layanan diarahkan untuk menyelesaikan masalah operasional UMKM, toko, dan kantor kecil."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((s) => {
              const Icon = s.icon;
              return (
              <div
                key={s.title}
                className="rounded-xl border border-l-4 border-slate-200 border-l-emerald bg-white p-6 shadow-sm"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-emerald">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-4 inline-block text-sm font-semibold text-emerald hover:text-emerald-dark"
                >
                  Lihat detail →
                </Link>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4 — PRODUK/APLIKASI ===== */}
      <section id="produk" className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            label="Aplikasi AMAN Digital"
            title="3 Aplikasi untuk Bisnis yang Lebih Rapi"
            subtitle="Dari kasir harian, pencatatan keuangan, hingga pembuatan invoice profesional — semuanya dalam satu ekosistem AMAN Digital."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {apps.map((app) => (
              <div
                key={app.badge}
                className="flex flex-col rounded-xl border border-t-4 border-slate-200 border-t-emerald bg-white p-6 shadow-sm"
              >
                <span className="self-start rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
                  {app.badge}
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy">{app.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{app.desc}</p>
                <ul className="mt-4 space-y-2">
                  {app.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="font-bold text-emerald">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={app.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg bg-emerald px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-dark"
                  >
                    Buka Aplikasi
                  </a>
                  <Link
                    href={app.detail}
                    className="flex-1 rounded-lg border border-emerald px-4 py-2 text-center text-sm font-semibold text-emerald transition-colors hover:bg-emerald hover:text-white"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/harga"
              className="text-sm font-semibold text-emerald hover:text-emerald-dark"
            >
              Lihat Paket Harga Semua Produk →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5 — CTA ENTRY POINTS ===== */}
      <section className="bg-emerald py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Pilih pintu masuk yang paling dekat dengan masalah Anda
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {entryPoints.map((e) => (
              <a
                key={e.label}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-emerald"
              >
                {e.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6 — PORTOFOLIO ===== */}
      <section id="portofolio" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            label="Portofolio"
            title="Case Study Singkat"
            subtitle="Contoh pekerjaan yang menunjukkan bagaimana AMAN Digital membantu merapikan pencatatan, promosi, sistem, dan kebutuhan operasional."
          />

          {/* Filter tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {portfolioCategories.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald text-white"
                      : "border border-slate-300 text-slate-600 hover:border-emerald hover:text-emerald"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPortfolio.map((item) => (
              <div
                key={item.judul}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.judul}
                    width={720}
                    height={405}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="self-start rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
                    {item.category}
                  </span>
                  <h3 className="mt-3 font-bold text-navy">{item.judul}</h3>
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p>
                      <span className="font-semibold text-navy">Masalah:</span>{" "}
                      {item.masalah}
                    </p>
                    <p>
                      <span className="font-semibold text-navy">Solusi:</span>{" "}
                      {item.solusi}
                    </p>
                    <p>
                      <span className="font-semibold text-navy">Manfaat:</span>{" "}
                      {item.manfaat}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-2">
                    {isExternal(item.link) ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-emerald hover:text-emerald-dark"
                      >
                        Lihat →
                      </a>
                    ) : (
                      <Link
                        href={item.link}
                        className="text-sm font-semibold text-emerald hover:text-emerald-dark"
                      >
                        Lihat →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 7 — STATS ===== */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold text-white sm:text-5xl">
                  {s.value}
                </div>
                <p className="mt-2 text-sm text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 8 — EARLY ACCESS (testimoni nyata menyusul) ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <SectionHeading
            label="Early Access"
            title="Kami sedang membangun bersama UMKM pertama"
            subtitle="AMAN Digital masih di tahap awal. Daripada memajang testimoni yang belum ada, kami mengajak Anda jadi salah satu pengguna pertama dan ikut membentuk produknya."
          />
          {/* TODO: isi testimoni nyata saat sudah ada pelanggan */}
          <a
            href={wa(
              "Halo AMAN Digital, saya ingin jadi pengguna awal AMAN Digital."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-emerald px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-dark"
          >
            Jadi Pengguna Awal
          </a>
        </div>
      </section>

      {/* ===== SECTION 9 — PAKET LAYANAN ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            label="Paket Layanan"
            title="Mulai dari konsultasi kebutuhan"
            subtitle="Harga menyesuaikan ruang lingkup pekerjaan. Kami bantu petakan dulu kebutuhan, prioritas, dan output yang paling berguna untuk bisnis Anda."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {packages.map((p) => (
              <div
                key={p.title}
                className="flex flex-col rounded-xl border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-navy">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{p.desc}</p>
                <p className="mt-3 text-xs italic text-slate-500">{p.note}</p>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 self-start rounded-lg border border-emerald px-5 py-2 text-sm font-semibold text-emerald transition-colors hover:bg-emerald hover:text-white"
                >
                  Tanya paket
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 10 — KENAPA AMAN DIGITAL ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            label="Kenapa memilih AMAN Digital?"
            title="Partner digital praktis yang mudah diajak diskusi"
            subtitle="Kami fokus membantu UMKM, toko, dan kantor kecil punya sistem kerja yang lebih rapi tanpa proses yang dibuat rumit."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
              <div
                key={r.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-emerald">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-bold text-navy">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{r.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 11 — FAQ ===== */}
      <section id="faq" className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading
            label="FAQ"
            title="Pertanyaan yang Sering Ditanyakan"
          />
          <div className="mt-10 space-y-3">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  <button
                    type="button"
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy"
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
                    className="px-5 pb-5 text-sm text-slate-600"
                  >
                    {item.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA PENUTUP ===== */}
      <section className="bg-gradient-to-r from-emerald to-emerald-dark py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Siap Merapikan Sistem Bisnis Anda?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Mulai dengan konsultasi gratis. Ceritakan masalah bisnis Anda, kami
            bantu temukan solusi yang paling sesuai.
          </p>
          <a
            href={wa("Halo AMAN Digital, saya ingin konsultasi gratis")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-emerald transition-colors hover:bg-slate-100"
          >
            Mulai Konsultasi Gratis
          </a>
        </div>
      </section>
    </>
  );
}
