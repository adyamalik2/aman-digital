import Link from "next/link";
import {
  InstagramIcon,
  TiktokIcon,
  ShopeeIcon,
} from "@/components/icons/BrandIcons";

const WA = "https://wa.me/6282210768038";

const produk = [
  { label: "AMAN Kasir", href: "/kasir" },
  { label: "AMAN Budget", href: "/budget" },
  { label: "AMAN Invoice", href: "/invoice" },
  { label: "AMAN-in", href: "/amanin" },
  { label: "AMAN Engine", href: "/aman-engine" },
  { label: "AMAN Content Engine", href: "/aman-content-engine" },
  { label: "AMAN Poster Generator", href: "/aman-poster" },
  { label: "Produk Digital (700+)", href: "/digital-store" },
  { label: "Paket Harga", href: "/harga" },
];

const layanan = [
  { label: "Data & System", href: "/data-system" },
  { label: "IT Advisor", href: "/it-advisor" },
  { label: "Print Center", href: "/print-center" },
  // Dipindah ke daftar produk saja — lihat catatan di Navbar.tsx.
  { label: "Creative Studio", href: "/creative-studio" },
];

const tentang = [
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Portofolio", href: "/#portofolio" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/kontak" },
];

const socials = [
  {
    label: "Instagram",
    Icon: InstagramIcon,
    href: "https://instagram.com/aman.digital01",
  },
  {
    label: "TikTok",
    Icon: TiktokIcon,
    href: "https://tiktok.com/@adya.vision",
  },
  {
    label: "Shopee",
    Icon: ShopeeIcon,
    href: "https://shopee.co.id/aman.digital",
  },
];

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">
        {title}
      </h3>
      {/* Tautan dibuat inline-block + padding vertikal supaya area sentuhnya
          naik dari ~17px (setinggi teks saja) ke ~33px. Belum 44px penuh
          karena tiap kolom punya sampai 8 tautan — memaksakan 44px akan
          membuat footer di HP hampir dua kali lebih panjang. space-y
          dikecilkan agar jarak antar barisnya tetap seperti semula. */}
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block py-2 text-sm text-white/70 transition-colors hover:text-emerald"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* pb ekstra hanya di HP: tombol mengambang (WhatsApp bottom-6 tinggi 56px,
          "Kembali ke atas" bottom-24 tinggi 48px -> tepi atasnya 144px dari dasar
          layar) mendarat tepat di atas dua baris teks penutup saat digulir mentok.
          Di desktop tombolnya jatuh di luar kontainer max-w-6xl, jadi tidak perlu. */}
      <div className="mx-auto max-w-6xl px-4 py-14 pb-40 md:pb-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-header.webp"
                alt="Logo AMAN Digital"
                width={160}
                height={160}
                className="h-12 w-auto"
              />
              <span className="text-lg font-bold text-emerald">
                AMAN Digital
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Partner digital praktis untuk UMKM, toko, dan kantor kecil.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => {
                const Icon = s.Icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    // h-11/w-11 = 44px, ukuran sentuh minimum yang dianjurkan
                    // (sebelumnya 40px — ikonnya sendiri tetap h-5).
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald-light"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Produk */}
          <FooterCol title="Produk" links={produk} />

          {/* Layanan */}
          <FooterCol title="Layanan" links={layanan} />

          {/* Hubungi Kami */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">
              Hubungi Kami
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                📱{" "}
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-emerald"
                >
                  +62 822-1076-8038
                </a>
              </li>
              <li>
                {/* Sementara diarahkan ke WhatsApp — email admin@amandigital.web.id
                    ikut mati bersama hosting lama (nameserver domain masih milik
                    Rumahweb; hosting sudah di-terminate 21 Agu 2026). Kembalikan
                    setelah domain dipasang di hosting baru & email aktif lagi. */}
                💬{" "}
                <a
                  href={`${WA}?text=${encodeURIComponent("Halo AMAN Digital, saya ingin bertanya.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-emerald"
                >
                  Chat via WhatsApp
                </a>
              </li>
              <li>⏰ Senin–Jumat, 09.00–21.00 WIB</li>
              <li>📍 Blangpidie, Aceh Barat Daya</li>
            </ul>
            <div className="mt-5 border-t border-white/10 pt-4">
              <FooterCol title="Tentang" links={tentang} />
            </div>
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-white/70 md:flex-row md:text-left">
          <p>© 2026 AMAN Digital — Partner Digital UMKM Indonesia.</p>
          <p>Sistem oleh Adya Malik · Blangpidie, Aceh</p>
        </div>
      </div>
    </footer>
  );
}
