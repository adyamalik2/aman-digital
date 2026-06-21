"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

type NavItem = { label: string; href: string };
type DropdownKey = "layanan" | "produk";

const dropdowns: { key: DropdownKey; label: string; items: NavItem[] }[] = [
  {
    key: "layanan",
    label: "Layanan",
    items: [
      { label: "Data & System", href: "/data-system" },
      { label: "IT Advisor", href: "/it-advisor" },
      { label: "Print Center", href: "/print-center" },
      { label: "Creative Studio", href: "/creative-studio" },
      { label: "Digital Store", href: "/digital-store" },
    ],
  },
  {
    key: "produk",
    label: "Produk",
    items: [
      { label: "AMAN Kasir", href: "/kasir" },
      { label: "AMAN Budget", href: "/budget" },
      { label: "AMAN Invoice", href: "/invoice" },
    ],
  },
];

const simpleLinks: NavItem[] = [
  { label: "Harga", href: "/harga" },
  { label: "Tentang", href: "/tentang" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<DropdownKey | null>(null);
  const [mobileSection, setMobileSection] = useState<DropdownKey | null>(null);

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (items: NavItem[]) =>
    items.some((item) => pathname === item.href);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={closeMobile}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-header.webp"
            alt="Logo AMAN Digital"
            width={160}
            height={160}
            className="h-9 w-auto"
          />
          <span className="text-xl font-bold text-emerald">AMAN Digital</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {dropdowns.map((dd) => {
            const open = desktopOpen === dd.key;
            const active = open || isGroupActive(dd.items);
            return (
              <div
                key={dd.key}
                className="relative"
                onMouseEnter={() => setDesktopOpen(dd.key)}
                onMouseLeave={() => setDesktopOpen(null)}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    active ? "text-emerald" : "text-navy hover:text-emerald"
                  }`}
                >
                  {dd.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                    <div className="min-w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-lg">
                      {dd.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 text-sm transition-colors hover:bg-emerald/5 hover:text-emerald ${
                            isActive(item.href)
                              ? "font-semibold text-emerald"
                              : "text-navy"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {simpleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-emerald ${
                isActive(link.href) ? "text-emerald" : "text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/kontak"
            className={`rounded px-4 py-1.5 text-sm font-medium text-white transition-colors ${
              isActive("/kontak")
                ? "bg-emerald-dark"
                : "bg-emerald hover:bg-emerald-dark"
            }`}
          >
            Kontak
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={mobileOpen}
          className="text-navy md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {dropdowns.map((dd) => {
              const open = mobileSection === dd.key;
              const active = isGroupActive(dd.items);
              return (
                <div key={dd.key}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() =>
                      setMobileSection(open ? null : dd.key)
                    }
                    className={`flex w-full items-center justify-between rounded px-2 py-2 text-sm font-medium transition-colors hover:bg-slate-50 ${
                      active || open ? "text-emerald" : "text-navy"
                    }`}
                  >
                    {dd.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="ml-3 flex flex-col gap-0.5 border-l border-slate-100 pl-3">
                      {dd.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className={`rounded px-2 py-2 text-sm transition-colors hover:bg-slate-50 hover:text-emerald ${
                            isActive(item.href)
                              ? "font-semibold text-emerald"
                              : "text-navy"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {simpleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`rounded px-2 py-2 text-sm font-medium transition-colors hover:bg-slate-50 hover:text-emerald ${
                  isActive(link.href) ? "text-emerald" : "text-navy"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/kontak"
              onClick={closeMobile}
              className="mt-1 rounded bg-emerald px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-dark"
            >
              Kontak
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
