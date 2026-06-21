"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/#layanan" },
  { label: "Produk", href: "/#produk" },
  { label: "Harga", href: "/harga" },
  { label: "Tentang", href: "/tentang" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-emerald"
          onClick={() => setOpen(false)}
        >
          AMAN Digital
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy transition-colors hover:text-emerald"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/kontak"
            className="rounded bg-emerald px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-dark"
          >
            Kontak
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={open}
          className="text-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-2 py-2 text-sm font-medium text-navy transition-colors hover:bg-gray-50 hover:text-emerald"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontak"
              className="mt-1 rounded bg-emerald px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-dark"
              onClick={() => setOpen(false)}
            >
              Kontak
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
