"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const CHECKOUT = "https://lynk.id/adya.malik/1m6zmzlzek3d/checkout";
const WA = `https://wa.me/6282210768038?text=${encodeURIComponent("Halo AMAN Digital, saya mau tanya tentang akses AMAN Poster Generator.")}`;

function FormLogin() {
  const params = useSearchParams();
  const errorCode = params.get("e");
  const loggedOut = params.get("logout") === "1";

  let error = "";
  if (errorCode === "ratelimited") {
    error = "Terlalu banyak percobaan kode salah dari perangkat/koneksimu. Coba lagi beberapa menit lagi, atau hubungi kami via WhatsApp di bawah.";
  } else if (errorCode === "locked") {
    error = "Kode ini sudah dipakai di jumlah perangkat maksimum (5). Mau pakai di perangkat lain? Hubungi kami via WhatsApp di bawah untuk reset.";
  } else if (errorCode === "invalid") {
    error = "Kode akses salah atau sudah tidak berlaku.";
  }

  return (
    <div className="w-full max-w-sm text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-header.webp" alt="" width={52} height={52} className="mx-auto h-13 w-auto" />
      <h1 className="mt-4 text-2xl font-black">AMAN Poster Generator</h1>
      <p className="mt-2 text-sm text-slate-400">Masukkan kode akses untuk masuk ke tool.</p>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}
      {loggedOut && !error && (
        <p className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300">
          Kamu sudah keluar. Masukkan kode akses untuk masuk lagi.
        </p>
      )}

      <form method="POST" action="/aman-poster/login" className="mt-6 flex flex-col gap-3">
        <label htmlFor="code" className="sr-only">Kode akses</label>
        <input
          type="text"
          id="code"
          name="code"
          placeholder="AMPG-XXXXXXXX"
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
          Masuk
        </button>
      </form>

      <p className="mt-6 text-xs text-slate-500">
        Belum punya kode akses?{" "}
        <a href={CHECKOUT} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-light hover:underline">
          🛒 Beli Kode Akses
        </a>
        {" "}atau{" "}
        <a href={WA} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-light hover:underline">
          tanya via WhatsApp
        </a>
        .
      </p>
    </div>
  );
}

export default function AmanPosterLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-navy px-4 py-20 text-white">
      <Suspense fallback={<div className="text-slate-500 text-sm">Memuat…</div>}>
        <FormLogin />
      </Suspense>
    </section>
  );
}
