import Link from "next/link";

const pageLinks = [
  { label: "Beranda", href: "/" },
  { label: "Harga", href: "/harga" },
  { label: "Tentang", href: "/tentang" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/kontak" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-emerald">
              AMAN Digital
            </Link>
            <p className="mt-3 text-sm text-white/60">
              Platform digital untuk UMKM Indonesia
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Halaman
            </h3>
            <ul className="space-y-2">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-emerald"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Kontak
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                📱{" "}
                <a
                  href="https://wa.me/6282210768038"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-emerald"
                >
                  +62 822-1076-8038
                </a>
              </li>
              <li>
                ✉️{" "}
                <a
                  href="mailto:admin@amandigital.web.id"
                  className="transition-colors hover:text-emerald"
                >
                  admin@amandigital.web.id
                </a>
              </li>
              <li>📸 @aman.digital01</li>
              <li>🎵 @adya.vision</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <p className="text-center text-sm text-white/50">
          © 2026 AMAN Digital. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
