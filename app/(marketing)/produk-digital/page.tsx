"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// "use client" + Suspense wajib di sini: situs ini output:'export' (statis
// penuh), jadi tidak ada server yang membaca query string per-permintaan.
// Pesan "kode salah" harus dibaca dari URL di BROWSER setelah redirect dari
// Pages Function /produk-digital/login, bukan lewat searchParams di server.

function FormLogin() {
  const params = useSearchParams();
  const salah = params.get("salah") === "1";

  return (
    <div className="w-full max-w-sm text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-header.webp" alt="" width={52} height={52} className="mx-auto h-13 w-auto" />
      <h1 className="mt-4 text-2xl font-black">AMAN Product Digital</h1>
      <p className="mt-2 text-sm text-slate-400">
        Masukkan kode akses yang Anda terima setelah membeli untuk membuka katalog.
      </p>

      {salah && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          Kode akses salah atau sudah tidak berlaku. Coba lagi, atau hubungi kami via WhatsApp.
        </p>
      )}

      <form method="POST" action="/produk-digital/login" className="mt-6 flex flex-col gap-3">
        <label htmlFor="code" className="sr-only">Kode akses</label>
        <input
          type="text"
          id="code"
          name="code"
          placeholder="PROD-XXXXXXXX"
          required
          autoFocus
          maxLength={40}
          autoComplete="off"
          autoCapitalize="characters"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center font-mono text-lg tracking-wider text-white placeholder:text-slate-500 focus:border-emerald focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-emerald-cta px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-cta-hover"
        >
          Buka Katalog
        </button>
      </form>

      <p className="mt-6 text-xs text-slate-500">
        Belum punya kode akses?{" "}
        <a
          href="https://lynk.id/adya.malik"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-light hover:underline"
        >
          Beli di Lynk.id
        </a>
        {" "}atau{" "}
        <a
          href={`https://wa.me/6282210768038?text=${encodeURIComponent("Halo AMAN Digital, saya ingin tanya soal AMAN Product Digital.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-light hover:underline"
        >
          tanya via WhatsApp
        </a>
        .
      </p>
    </div>
  );
}

export default function ProdukDigitalLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-navy px-4 py-20 text-white">
      <Suspense fallback={<div className="text-slate-500 text-sm">Memuat…</div>}>
        <FormLogin />
      </Suspense>
    </section>
  );
}
