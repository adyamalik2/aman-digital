import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk Digital | AMAN Digital",
  robots: { index: false, follow: false },
};

type Produk = { nama: string; href: string; ikon: string };
type Kategori = { key: string; label: string; ikon: string; produk: Produk[] };

// Isi asli dipindahkan langsung dari aman-product/app.html (situs lama) —
// bukan disusun ulang. 44 produk, 4 kategori, sama persis dengan yang
// pembeli dapatkan sebelumnya.
const KATEGORI: Kategori[] = [
  {
    key: "islami", label: "Produk Islami", ikon: "☪️",
    produk: [
      { nama: "Tadarus Qur'an", href: "https://equran.id/", ikon: "📖" },
      { nama: "Tasbih Digital", href: "https://sites.google.com/view/tasbih-mizyan/home", ikon: "📿" },
      { nama: "Waktu Sholat", href: "https://equran.id/shalat", ikon: "🕌" },
      { nama: "Arah Qiblat", href: "https://qiblafinder.withgoogle.com/intl/ms/desktop", ikon: "🧭" },
      { nama: "Dzikir Pagi Petang", href: "https://sites.google.com/view/produkdigitaltemaislami/kumpulan-dzikir-pagi-dan-petang", ikon: "🌅" },
      { nama: "Ceklis Ibadah", href: "https://digital-produk-termurah-no-1.my.canva.site/ibadah-harian", ikon: "✅" },
      { nama: "Adab dalam Islam", href: "https://sites.google.com/view/produkdigitaltemaislami/adab-dalam-islam", ikon: "🤝" },
      { nama: "Amalan Pembuka Rezeki", href: "https://sites.google.com/view/produkdigitaltemaislami/amalan-pembuka-rezeki", ikon: "💰" },
      { nama: "Doa Harian", href: "https://equran.id/doa", ikon: "🤲" },
      { nama: "Kisah Nabi & Rasul", href: "https://sites.google.com/view/generasi554/e-book/nabi-nabi", ikon: "📜" },
      { nama: "Latihan Tulis Qur'an", href: "https://sites.google.com/view/mizyan-murojaah/home", ikon: "✍️" },
      { nama: "Ebook Tajwid", href: "https://drive.google.com/file/d/1EFXRmfKhrGReJ4uj9HtQxIu1mX2pxMHl/view", ikon: "📗" },
      { nama: "Hafalan Qur'an", href: "https://sites.google.com/view/mizyan-hafalan-surah/home", ikon: "🧠" },
      { nama: "Tebak Ayat Juz 30", href: "https://sites.google.com/view/mizyan-tebak-ayat/home", ikon: "❓" },
      { nama: "Planner Murojaah", href: "https://sites.google.com/view/hafizplanner/home", ikon: "🗓️" },
    ],
  },
  {
    key: "anak", label: "Produk Anak-Anak", ikon: "🧒",
    produk: [
      { nama: "Video Edukasi Anak", href: "https://drive.google.com/drive/folders/1Rf2aXQuhSy20wbutc08tjyiRgfzJPpzL", ikon: "🎬" },
      { nama: "Worksheet Anak", href: "https://www.digitalprodukno1seindonesia.my.id/worksheet", ikon: "📝" },
      { nama: "Flash Card", href: "https://www.digitalprodukno1seindonesia.my.id/flash-card", ikon: "🃏" },
      { nama: "Quiz Anak SD", href: "https://www.digitalprodukno1seindonesia.my.id/quiz", ikon: "🧮" },
      { nama: "Ebook Cerita Hewan", href: "https://sites.google.com/view/generasi554/e-book/cerita-hewan", ikon: "🦁" },
      { nama: "39.000 Printable Anak", href: "https://drive.google.com/drive/folders/1xsQ7LMcDhzeIsjdnAJ3XbKW8IO72G8ue", ikon: "🖨️" },
      { nama: "Asah Otak", href: "https://www.digitalprodukno1seindonesia.my.id/game-edukasi", ikon: "💡" },
      { nama: "Quiz Islami", href: "https://sites.google.com/view/game-islami-cilik/home", ikon: "🌙" },
      { nama: "Quiz MTK", href: "https://sites.google.com/view/game-edukasi-islami-mizyan/home", ikon: "➗" },
      { nama: "Cerdas Cermat", href: "https://sites.google.com/view/game-cerdas-cermat/home", ikon: "🏆" },
      { nama: "Quiz PAI", href: "https://sites.google.com/view/game-sains/home", ikon: "📚" },
      { nama: "Ular Tangga", href: "https://sites.google.com/view/game-ular-tanggaa/home", ikon: "🎲" },
    ],
  },
  {
    key: "game", label: "Game Ringan", ikon: "🎮",
    produk: [
      { nama: "Bounce Nokia", href: "https://sites.google.com/view/gamebounce/home", ikon: "🔵" },
      { nama: "Petualangan", href: "https://sites.google.com/view/petualangantekateki/home", ikon: "🗺️" },
      { nama: "Tangkap Hewan", href: "https://sites.google.com/view/tankap-hewan/home", ikon: "🐾" },
      { nama: "Puzzle Hewan", href: "https://sites.google.com/view/puzzle-mizyan/home", ikon: "🧩" },
      { nama: "Tetris Mobile", href: "https://sites.google.com/view/tetris-3d/home", ikon: "🟦" },
      { nama: "Balap Mobil", href: "https://sites.google.com/view/game-race/home", ikon: "🏎️" },
      { nama: "Super Mario Bross", href: "https://sites.google.com/view/mario-bros-remake/home", ikon: "🍄" },
      { nama: "Snake Nokia", href: "https://sites.google.com/view/snake-3d/home", ikon: "🐍" },
      { nama: "Math Galaxy", href: "https://sites.google.com/view/math-galaxy/home", ikon: "🌌" },
      { nama: "Kapal Tempur", href: "https://sites.google.com/view/naval-battle/home", ikon: "🚢" },
    ],
  },
  {
    key: "bonus", label: "Produk Bonus", ikon: "🎁",
    produk: [
      { nama: "10.000 Template Canva", href: "https://drive.google.com/file/d/1bWkauricYEg2QvuwCkyf15Sa53zXygrN/view", ikon: "🎨" },
      { nama: "Skrip & VO", href: "https://gemini.google.com/share/71487a50d705", ikon: "🎙️" },
      { nama: "Perpustakaan", href: "https://sites.google.com/view/paket-700-e-book-islami", ikon: "🏛️" },
      { nama: "Pembuat Soal Ujian", href: "https://gemini.google.com/share/867599217d97", ikon: "📋" },
      { nama: "Pembuat Materi Ajar", href: "https://gemini.google.com/share/c8de7e4afbb8", ikon: "👨‍🏫" },
      { nama: "Bank Konten", href: "https://docs.google.com/spreadsheets/d/12lHxAjbdNQWyw6888AyGFYXUlQbzii_dK6FSMrhBfVI/edit", ikon: "🗂️" },
      { nama: "Kalkulator Diet", href: "https://sites.google.com/view/mizyan-kalkulator-diet/home", ikon: "🥗" },
    ],
  },
];

const TOTAL = KATEGORI.reduce((n, k) => n + k.produk.length, 0);

export default function KatalogPage() {
  return (
    <section className="bg-navy px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-block rounded-full border border-emerald px-4 py-1 text-sm font-semibold uppercase tracking-wide text-emerald-light">
            🛍️ Katalog Produk Digital
          </span>
          <h1 className="mx-auto mt-6 text-3xl font-black sm:text-4xl">
            AMAN <span className="text-emerald-light">Product Digital</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Kumpulan produk digital pilihan — Islami, edukasi anak, game ringan, dan bonus. Semua dalam satu halaman, tinggal klik.
          </p>
          <div className="mt-6 flex justify-center gap-8 text-sm text-slate-400">
            <div><b className="block text-2xl font-black text-white">{TOTAL}</b>Koleksi Pilihan</div>
            <div><b className="block text-2xl font-black text-white">{KATEGORI.length}</b>Kategori</div>
            <div><b className="block text-2xl font-black text-white">1</b>Akses Semua</div>
          </div>
          <a href="/produk-digital/logout" className="mt-6 inline-block text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline">
            Keluar dari perangkat ini
          </a>
        </div>

        <div className="mt-14 space-y-12">
          {KATEGORI.map((kat) => (
            <div key={kat.key}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-bold text-emerald-light">
                  {kat.ikon} {kat.label}
                </span>
                <span className="text-xs text-slate-400">{kat.produk.length} produk</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {kat.produk.map((p) => (
                  <a
                    key={p.nama}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-emerald/40 hover:bg-white/10"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald/20 bg-emerald/10 text-lg">
                      {p.ikon}
                    </span>
                    <span className="text-sm font-semibold leading-snug">{p.nama}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Folder lengkap — sama seperti versi lama */}
        <div className="mt-14 rounded-3xl border border-emerald/25 bg-emerald/10 p-8 text-center">
          <div className="text-3xl">📦</div>
          <h2 className="mt-2 text-xl font-black">Akses Semua Produk</h2>
          <p className="mt-2 text-sm text-slate-300">
            Folder Google Drive berisi 700+ berkas. Dibuka di browser, tanpa unduh satu per satu.
          </p>
          <a
            href="https://drive.google.com/drive/folders/1Q4W-gR73g_6Sp0S-ys7IS4PFKNthZ6bC"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-emerald-cta px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-cta-hover"
          >
            📁 Buka Folder 700+ Berkas ↗
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="https://chat.whatsapp.com/BDAkiRIXNb3BWjIV8n6Pk4?s=cl&p=a&ilr=0&amv=1" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-emerald/30">
            💬 Grup WhatsApp Komunitas
          </a>
        </div>
      </div>
    </section>
  );
}
