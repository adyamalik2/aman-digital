"use client";

import { useState, useEffect } from "react";
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
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<DropdownKey | null>(null);
  const [mobileSection, setMobileSection] = useState<DropdownKey | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (items: NavItem[]) =>
    items.some((item) => pathname === item.href);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "border-emerald/15 bg-[#070B14]/95 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          : "border-white/5 bg-[#070B14]/80"
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobile}
          className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-all hover:-translate-y-0.5 hover:border-emerald/30"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-header.webp"
            alt="Logo AMAN Digital"
            width={160}
            height={160}
            className="h-9 w-auto md:h-10"
            style={{ filter: "drop-shadow(0 0 14px rgba(5,150,105,0.35))" }}
          />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-black tracking-wide text-white">
              AMAN DIGITAL
            </span>
            <span className="block text-[0.62rem] tracking-[0.12em] text-slate-400">
              TECH · PRINT · SYSTEM
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
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
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/5 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {dd.label}
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                    <div className="dd-anim min-w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0b101e]/95 py-2 shadow-2xl backdrop-blur-md">
                      {dd.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-emerald-light ${
                            isActive(item.href)
                              ? "font-semibold text-emerald-light"
                              : "text-slate-300"
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
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-white/5 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/kontak"
            className="ml-2 rounded-full bg-emerald px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark"
          >
            Kontak
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={mobileOpen}
          className="text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="menu-anim border-t border-white/10 bg-[#070B14] md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {dropdowns.map((dd) => {
              const open = mobileSection === dd.key;
              const active = isGroupActive(dd.items);
              return (
                <div key={dd.key}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setMobileSection(open ? null : dd.key)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 ${
                      active || open ? "text-emerald-light" : "text-slate-200"
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
                    <div className="ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                      {dd.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-emerald-light ${
                            isActive(item.href)
                              ? "font-semibold text-emerald-light"
                              : "text-slate-400"
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
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 ${
                  isActive(link.href) ? "text-emerald-light" : "text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/kontak"
              onClick={closeMobile}
              className="mt-2 rounded-full bg-emerald px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-dark"
            >
              Kontak
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
