"use client";

import { useEffect, useState, useCallback } from "react";

type CodeEntry = {
  code: string;
  devices: string[];
  via: string;
  date: string;
  buyer?: string;
  phone?: string;
  email?: string;
};

type Product = "produk-digital" | "aman-engine" | "aman-content-engine" | "aman-poster";

const PRODUCTS: { key: Product; label: string }[] = [
  { key: "produk-digital", label: "AMAN Product Digital" },
  { key: "aman-engine", label: "AMAN Engine" },
  { key: "aman-content-engine", label: "AMAN Content Engine" },
  { key: "aman-poster", label: "AMAN Poster Generator" },
];

const MAX_DEVICES = 5;

function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "0") return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  if (digits[0] === "8") return "62" + digits;
  return digits;
}

export default function AdminDashboardPage() {
  const [product, setProduct] = useState<Product>("produk-digital");
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [buyer, setBuyer] = useState("");
  const [phone, setPhone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [justGenerated, setJustGenerated] = useState<string | null>(null);
  const [busyCode, setBusyCode] = useState<string | null>(null);

  const load = useCallback(async (p: Product) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/codes?product=${p}`);
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal memuat data.");
      setCodes(data.codes || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(product);
    setJustGenerated(null);
  }, [product, load]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/admin/api/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", product, buyer, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal membuat kode.");
      setJustGenerated(data.code);
      setBuyer("");
      setPhone("");
      await load(product);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat kode.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAction = async (action: "resetdev" | "revoke", code: string) => {
    const confirmMsg =
      action === "revoke"
        ? `Cabut kode ${code} permanen? Akses pembeli langsung hilang.`
        : `Reset ikatan perangkat kode ${code}? Pembeli bisa aktifkan lagi di perangkat baru.`;
    if (!window.confirm(confirmMsg)) return;
    setBusyCode(code);
    setError("");
    try {
      const res = await fetch("/admin/api/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, product, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Aksi gagal.");
      await load(product);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aksi gagal.");
    } finally {
      setBusyCode(null);
    }
  };

  const filtered = codes.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      (c.buyer || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  });

  const activeCount = codes.filter((c) => c.devices.length > 0).length;

  return (
    <section className="min-h-screen bg-navy px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-black">🗂️ Admin Stok Kode Akses</h1>
          <div className="flex items-center gap-3">
            <a href="/admin/berita" className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white">
              📰 Kelola Berita
            </a>
            <a href="/admin/logout" className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white">
              Keluar
            </a>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {PRODUCTS.map((p) => (
            <button
              key={p.key}
              onClick={() => setProduct(p.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                product === p.key ? "bg-emerald-cta text-white" : "border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex gap-8">
            <div>
              <b className="block text-2xl font-black">{codes.length}</b>
              <span className="text-xs text-slate-400">Kode terbit</span>
            </div>
            <div>
              <b className="block text-2xl font-black text-amber-400">{activeCount}</b>
              <span className="text-xs text-slate-400">Aktif di perangkat</span>
            </div>
          </div>

          {justGenerated && (
            <div className="mt-5 rounded-xl border border-emerald/30 bg-emerald/10 p-4">
              <p className="text-xs text-slate-400">✅ Kode baru dibuat:</p>
              <p className="mt-1 font-mono text-xl font-bold tracking-wider">{justGenerated}</p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(justGenerated)}
                className="mt-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/10"
              >
                Salin Kode
              </button>
            </div>
          )}

          <form onSubmit={handleGenerate} className="mt-5 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">
                Nama pembeli (opsional)
              </label>
              <input
                type="text"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                placeholder="mis. Budi"
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">
                No. WhatsApp (opsional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={generating}
              className="rounded-lg bg-emerald-cta px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-cta-hover disabled:opacity-50"
            >
              {generating ? "Membuat…" : "➕ Buat Kode Baru"}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode / pembeli…"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald focus:outline-none"
          />
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Pembeli</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Via</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">Memuat…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">Belum ada kode.</td></tr>
              )}
              {!loading && filtered.map((c) => {
                const ndev = c.devices.length;
                const active = ndev > 0;
                const full = ndev >= MAX_DEVICES;
                const wa = waNumber(c.phone || "");
                return (
                  <tr key={c.code} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                    <td className="px-4 py-3">
                      {!active ? (
                        <span className="rounded-full bg-slate-500/20 px-2.5 py-1 text-xs text-slate-300">Belum aktif</span>
                      ) : (
                        <span className={`rounded-full px-2.5 py-1 text-xs ${full ? "bg-amber-500/20 text-amber-300" : "bg-emerald/20 text-emerald-light"}`}>
                          {ndev}/{MAX_DEVICES} perangkat
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.buyer || <span className="text-slate-500">—</span>}
                      {c.phone && <span className="ml-1 text-slate-400">· {c.phone}</span>}
                      {c.email && <div className="text-xs text-slate-500">{c.email}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400">{(c.date || "").slice(0, 10)}</td>
                    <td className="px-4 py-3 text-slate-400">{c.via}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        {wa && (
                          <a
                            href={`https://wa.me/${wa}?text=${encodeURIComponent(`Kode akses kamu: ${c.code}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-emerald-cta px-3 py-1 text-xs font-semibold text-white"
                          >
                            WA
                          </a>
                        )}
                        {active && (
                          <button
                            type="button"
                            disabled={busyCode === c.code}
                            onClick={() => handleAction("resetdev", c.code)}
                            className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-50"
                          >
                            ↺ Reset
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyCode === c.code}
                          onClick={() => handleAction("revoke", c.code)}
                          className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
