"use client";

import { useState } from "react";
import {
  Mic,
  PenLine,
  Clock,
  Wallet,
  ChartPie,
  Lock,
  CloudUpload,
  Bell,
  Store,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

// Aplikasinya live sebagai PWA di subdomain sendiri — lihat catatan di
// kasir/page.tsx.
const APP_URL = "https://amanin.amandigital.my.id";
const TANYA_WA = wa("Halo AMAN Digital, saya ingin tanya tentang AMAN-in.");

/* ---------------- Data ---------------- */

// Contoh kalimat yang memang ditangani parser suara di aplikasi
// (src/utils/parseVoice.js): slang, angka terbilang, dan tebakan kategori.
const contohUcapan: { ucap: string; jadi: string; kategori: string }[] = [
  {
    ucap: "“jual nasi goreng lima puluh ribu”",
    jadi: "Masuk · Rp 50.000",
    kategori: "Penjualan",
  },
  {
    ucap: "“bayar listrik dua ratus rb”",
    jadi: "Keluar · Rp 200.000",
    kategori: "Tagihan",
  },
  {
    ucap: "“isi bensin 50 ribu pakai e-wallet”",
    jadi: "Keluar · Rp 50.000",
    kategori: "Transport",
  },
];

const masalah: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: PenLine,
    title: "Malas Catat Manual",
    desc: "Mengetik satu per satu di tengah kesibukan itu merepotkan, akhirnya banyak transaksi tidak tercatat sama sekali.",
  },
  {
    icon: Clock,
    title: "Lupa Nominalnya",
    desc: "Ditunda dulu, niatnya dicatat nanti malam — begitu duduk, sudah lupa tadi keluar uang untuk apa saja.",
  },
  {
    icon: Wallet,
    title: "Uang Tercampur",
    desc: "Kas, rekening bank, dan e-wallet bercampur jadi satu sehingga sulit tahu sisa uang yang sebenarnya.",
  },
];

const fitur: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Mic,
    title: "Cukup Diucapkan",
    desc: "Sebut nominal dan keperluannya dalam bahasa sehari-hari. Slang seperti “gak”, “duit”, “rb”, dan “jt” tetap dimengerti.",
  },
  {
    icon: Wallet,
    title: "Pisahkan Kas, Bank, E-Wallet",
    desc: "Tiap dompet punya saldo sendiri, jadi Anda tahu persis uang tunai berapa dan saldo digital berapa.",
  },
  {
    icon: ChartPie,
    title: "Laporan & Analisis Otomatis",
    desc: "Pemasukan, pengeluaran, dan rinciannya langsung terangkum jadi grafik tanpa perlu menghitung sendiri.",
  },
  {
    icon: Store,
    title: "Bisa Lebih dari Satu Usaha",
    desc: "Punya beberapa usaha, atau ingin memisahkan catatan usaha dan pribadi? Keduanya bisa dipisah di satu aplikasi.",
  },
  {
    icon: Lock,
    title: "Dikunci PIN",
    desc: "Catatan keuangan terkunci saat aplikasi ditinggal, sehingga tetap aman meski HP dipegang orang lain.",
  },
  {
    icon: CloudUpload,
    title: "Cadangkan Datanya",
    desc: "Data bisa dicadangkan supaya catatan tidak hilang saat ganti HP atau aplikasi dipasang ulang.",
  },
];

const steps: { num: number; title: string; desc: string }[] = [
  {
    num: 1,
    title: "Buka & Masuk",
    desc: "Masuk pakai akun Google atau email. Tidak perlu memasang apa pun — langsung jalan dari browser HP.",
  },
  {
    num: 2,
    title: "Tekan Tombol Mikrofon",
    desc: "Ucapkan transaksinya seperti bicara biasa. Nominal, jenis, dan kategorinya diisikan otomatis ke formulir.",
  },
  {
    num: 3,
    title: "Periksa & Simpan",
    desc: "Lihat sekilas hasilnya, betulkan kalau ada yang meleset, lalu simpan. Butuh manual? Tinggal ketik seperti biasa.",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Input suaranya bisa dipakai lewat browser, atau harus pasang aplikasi?",
    a: "Keduanya bisa. Di browser HP maupun laptop, fitur suara berjalan selama memakai Chrome atau Edge. Firefox belum mendukung teknologi pengenalan suara ini, jadi di sana tombol suaranya tidak aktif — pencatatan manual tetap bisa dipakai seperti biasa.",
  },
  {
    q: "Apakah harus selalu online?",
    a: "Tidak. Aplikasinya tetap terbuka dan bisa dipakai walau sinyal hilang. Khusus fitur suara memang butuh koneksi, karena pengenalan suaranya diproses lewat layanan browser.",
  },
  {
    q: "Ini untuk usaha atau untuk keuangan pribadi?",
    a: "Dua-duanya. Kategori bawaannya sudah mencakup kebutuhan usaha (Penjualan, Modal, Belanja Barang/Jasa) sekaligus kebutuhan harian (Tagihan, Transport). Anda juga bisa memisahkan catatan usaha dan pribadi.",
  },
  {
    q: "Kalau suaranya salah dengar bagaimana?",
    a: "Hasilnya selalu masuk ke formulir dulu, tidak langsung tersimpan. Jadi Anda sempat memeriksa dan membetulkannya sebelum menekan simpan.",
  },
  {
    q: "Perlu bayar?",
    a: "Sekarang gratis dipakai. Ke depan akan ada paket berbayar untuk pemakaian besar, tapi pencatatan sehari-hari tetap bisa dimulai tanpa biaya dan tanpa kartu kredit.",
  },
];

/* ---------------- Page ---------------- */

export default function AmaninPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-4 pb-20 pt-28 text-center sm:pt-32"
        style={{ backgroundColor: "#070B14" }}
      >
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-emerald-light">
            <span className="ping-dot h-2 w-2 rounded-full bg-emerald" />
            AMAN-in
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Catat Uang Masuk &amp; Keluar
            <br />
            <span className="text-emerald-light">Cukup Diucapkan</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Tidak perlu mengetik. Sebut saja transaksinya dalam bahasa
            sehari-hari, nominal dan kategorinya terisi sendiri — untuk usaha
            maupun keuangan pribadi.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-cta px-8 py-3.5 text-center font-semibold text-white transition-colors hover:bg-emerald-cta-hover"
            >
              Coba Gratis Sekarang →
            </a>
            <a
              href={TANYA_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-8 py-3.5 text-center font-semibold text-white transition-colors hover:border-emerald hover:text-emerald-light"
            >
              Tanya Dulu via WhatsApp
            </a>
          </div>

          {/* Contoh ucapan -> hasil */}
          <div className="mx-auto mt-14 max-w-md space-y-3 text-left">
            {contohUcapan.map((c) => (
              <div
                key={c.ucap}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mic size={15} className="shrink-0 text-emerald-light" />
                  <span>{c.ucap}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-sm font-bold text-white">{c.jadi}</span>
                  <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald-light">
                    {c.kategori}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-slate-500">
            Hasilnya masuk ke formulir dulu, jadi masih bisa Anda periksa
            sebelum disimpan.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <WifiOff size={15} className="text-emerald" /> Tetap jalan tanpa
              internet
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock size={15} className="text-emerald" /> Bisa dikunci PIN
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bell size={15} className="text-emerald" /> Ada pengingat
            </span>
          </div>
        </div>
      </section>

      {/* ===== MASALAH ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-cta-hover">
            Kenapa Ini Penting?
          </span>
          <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
            Bukan tidak mau mencatat — mencatatnya yang merepotkan
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            Kebanyakan catatan keuangan berhenti di tengah jalan bukan karena
            malas, tapi karena setiap transaksi menuntut berhenti sejenak dan
            mengetik. Kalau mencatat semudah berbicara, kebiasaannya jauh lebih
            mungkin bertahan.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {masalah.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-left"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-emerald">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FITUR UTAMA ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-cta-hover">
              Fitur Utama
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Sederhana dipakai, lengkap saat dibutuhkan
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fitur.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 text-emerald">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CARA PAKAI ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-cta-hover">
              Cara Pakai
            </span>
            <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
              Tercatat dalam 3 langkah
            </h2>
          </div>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-cta text-lg font-black text-white">
                  {s.num}
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-emerald-cta px-8 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-cta-hover"
            >
              Mulai Catat Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* ===== HARGA ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-block rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald-cta-hover">
            Biaya
          </span>
          <h2 className="mt-5 text-3xl font-bold text-navy md:text-4xl">
            Gratis dipakai sekarang
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600">
            Semua fitur di halaman ini bisa Anda pakai tanpa biaya — termasuk
            input suara, laporan, dan multi-dompet. Ke depan akan ada paket
            berbayar untuk pemakaian dalam jumlah besar, dan itu akan
            diumumkan lebih dulu sebelum diberlakukan.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-cta px-8 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-cta-hover"
            >
              Coba Gratis — Tanpa Kartu Kredit
            </a>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-navy">
              Pertanyaan yang Sering Ditanyakan
            </h2>
          </div>
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
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-navy"
                  >
                    {item.q}
                    <span
                      className={`text-emerald-dark transition-transform ${
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
                    className="px-5 pb-5 text-sm leading-relaxed text-slate-600"
                  >
                    {item.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA AKHIR ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-dark to-emerald p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Mulai dari transaksi hari ini
              </h2>
              <p className="mt-4 text-lg text-emerald-50">
                Buka dari browser HP, ucapkan satu transaksi, dan lihat sendiri
                bedanya. Tidak perlu instal, tidak perlu kartu kredit.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-8 py-3.5 font-bold text-emerald-dark transition-colors hover:bg-slate-100"
                >
                  Coba Gratis Sekarang
                </a>
                <a
                  href={TANYA_WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-white/60 px-8 py-3.5 font-bold text-white transition-colors hover:bg-white/10"
                >
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
