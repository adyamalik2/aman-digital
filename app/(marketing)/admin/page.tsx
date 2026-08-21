"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FormLogin() {
  const params = useSearchParams();
  const errorCode = params.get("e");
  const loggedOut = params.get("logout") === "1";

  let error = "";
  if (errorCode === "ratelimited") {
    error = "Terlalu banyak percobaan password salah. Coba lagi beberapa menit lagi.";
  } else if (errorCode === "invalid") {
    error = "Password salah.";
  }

  return (
    <div className="w-full max-w-sm text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-header.webp" alt="" width={52} height={52} className="mx-auto h-13 w-auto" />
      <h1 className="mt-4 text-2xl font-black">Admin Stok Kode</h1>
      <p className="mt-2 text-sm text-slate-400">Khusus pengelola. Masukkan password admin.</p>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}
      {loggedOut && !error && (
        <p className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300">
          Kamu sudah keluar.
        </p>
      )}

      <form method="POST" action="/admin/login" className="mt-6 flex flex-col gap-3">
        <label htmlFor="password" className="sr-only">Password admin</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoFocus
          autoComplete="off"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-lg tracking-wider text-white placeholder:text-slate-500 focus:border-emerald focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-emerald-cta px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-cta-hover"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-navy px-4 py-20 text-white">
      <Suspense fallback={<div className="text-slate-500 text-sm">Memuat…</div>}>
        <FormLogin />
      </Suspense>
    </section>
  );
}
