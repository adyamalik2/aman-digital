"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Metode = { kode: string; nama: string; gambar: string; biaya: number };

/**
 * Halaman checkout di situs sendiri.
 *
 * Harga di sini HANYA untuk ditampilkan. Yang dipakai membuat tagihan adalah
 * harga dari katalog server (functions/_lib/orders.ts) -- kalau keduanya
 * berbeda, yang berlaku tetap yang di server. Ubah keduanya bersamaan.
 */
const PRODUK = {
  "aman-engine": { nama: "AMAN Engine", harga: 39000, ket: "Storyboard generator AI untuk konten TikTok & Instagram." },
  "aman-content-engine": { nama: "AMAN Content Engine", harga: 39000, ket: "Satu topik jadi satu paket konten siap pakai." },
  "aman-poster": { nama: "AMAN Poster Generator", harga: 39000, ket: "Prompt poster promosi siap pakai untuk AI gambar." },
  "produk-digital": { nama: "Produk Digital (700+)", harga: 49000, ket: "44 produk terkurasi berisi 700+ berkas siap pakai." },
} as const;

type ProdukId = keyof typeof PRODUK;

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

function CheckoutForm() {
  const params = useSearchParams();
  const idParam = params.get("produk") || "";
  const produkId = (Object.keys(PRODUK) as ProdukId[]).includes(idParam as ProdukId)
    ? (idParam as ProdukId)
    : null;

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");
  const [metode, setMetode] = useState<Metode[]>([]);
  const [metodePilihan, setMetodePilihan] = useState("");
  const [memuatMetode, setMemuatMetode] = useState(true);

  // Metode pembayaran diambil dari Duitku, bukan di-hardcode: daftarnya
  // berbeda per merchant dan per nominal.
  useEffect(() => {
    if (!produkId) return;
    let batal = false;
    (async () => {
      try {
        const res = await fetch(`/api/payment-methods?produk=${encodeURIComponent(produkId)}`);
        const data = await res.json();
        if (batal) return;
        if (data.ok) setMetode(data.methods);
        else setGalat(data.message || "Metode pembayaran belum tersedia.");
      } catch {
        if (!batal) setGalat("Tidak bisa memuat metode pembayaran.");
      } finally {
        if (!batal) setMemuatMetode(false);
      }
    })();
    return () => { batal = true; };
  }, [produkId]);

  if (!produkId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-navy">Produk belum dipilih</h1>
        <p className="mt-3 text-slate-600">
          Silakan pilih produk lebih dulu dari halaman produk.
        </p>
        <Link
          href="/#produk"
          className="mt-6 inline-block rounded-full bg-emerald-cta px-6 py-3 font-semibold text-white hover:bg-emerald-cta-hover"
        >
          Lihat Produk
        </Link>
      </div>
    );
  }

  const produk = PRODUK[produkId];

  const kirim = async (e: React.FormEvent) => {
    e.preventDefault();
    setGalat("");
    setProses(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: produkId,
          name: nama,
          email,
          phone: telepon,
          paymentMethod: metodePilihan,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setGalat(data.message || "Gagal membuat pesanan. Coba lagi.");
        setProses(false);
        return;
      }
      // Diarahkan ke halaman pembayaran Duitku.
      window.location.href = data.paymentUrl;
    } catch {
      setGalat("Tidak bisa menghubungi server. Periksa koneksi Anda.");
      setProses(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      {/* Ringkasan pesanan */}
      <div className="md:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-emerald-dark">
            Ringkasan Pesanan
          </h2>
          <p className="mt-4 text-lg font-bold text-navy">{produk.nama}</p>
          <p className="mt-1 text-sm text-slate-600">{produk.ket}</p>
          <div className="mt-6 flex items-baseline justify-between border-t border-slate-200 pt-4">
            <span className="text-sm text-slate-600">Total</span>
            <span className="text-2xl font-black text-navy">{rupiah(produk.harga)}</span>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Produk digital — tidak dapat dikembalikan setelah kode akses diterima.
          </p>
        </div>
      </div>

      {/* Data pembeli */}
      <div className="md:col-span-3">
        <form onSubmit={kirim} className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-emerald-dark">
            Data Pembeli
          </h2>

          <div className="mt-5">
            <label htmlFor="co-nama" className="mb-1 block text-sm font-medium text-navy">
              Nama <span className="text-rose-600">*</span>
            </label>
            <input
              id="co-nama"
              type="text"
              required
              maxLength={80}
              autoComplete="name"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-navy outline-none focus:border-emerald"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="co-email" className="mb-1 block text-sm font-medium text-navy">
              Email <span className="text-rose-600">*</span>
            </label>
            <input
              id="co-email"
              type="email"
              required
              maxLength={191}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-navy outline-none focus:border-emerald"
            />
            <p className="mt-1 text-xs text-slate-500">
              Kode akses ditampilkan setelah pembayaran dan dikirim ke email ini.
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="co-telepon" className="mb-1 block text-sm font-medium text-navy">
              Nomor WhatsApp <span className="text-slate-400">(opsional)</span>
            </label>
            <input
              id="co-telepon"
              type="tel"
              maxLength={30}
              autoComplete="tel"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-navy outline-none focus:border-emerald"
            />
          </div>

          {/* Metode pembayaran */}
          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-medium text-navy">
              Metode Pembayaran <span className="text-rose-600">*</span>
            </legend>

            {memuatMetode ? (
              <p className="text-sm text-slate-500">Memuat metode pembayaran…</p>
            ) : metode.length === 0 ? (
              <p className="text-sm text-slate-500">
                Metode pembayaran belum tersedia. Hubungi kami lewat WhatsApp.
              </p>
            ) : (
              <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2">
                {metode.map((m) => (
                  <label
                    key={m.kode}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                      metodePilihan === m.kode
                        ? "border-emerald bg-emerald/5 font-semibold text-navy"
                        : "border-slate-200 text-slate-700 hover:border-emerald/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metode"
                      value={m.kode}
                      checked={metodePilihan === m.kode}
                      onChange={() => setMetodePilihan(m.kode)}
                      className="accent-emerald"
                    />
                    <span className="min-w-0 flex-1 truncate">{m.nama}</span>
                    {m.biaya > 0 && (
                      <span className="shrink-0 text-xs text-slate-500">
                        +{rupiah(m.biaya)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          {galat && (
            <p className="mt-4 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
              {galat}
            </p>
          )}

          <button
            type="submit"
            disabled={proses || !metodePilihan}
            className="mt-6 w-full rounded-full bg-emerald-cta px-6 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-cta-hover disabled:opacity-60"
          >
            {proses ? "Menyiapkan pembayaran…" : `Bayar ${rupiah(produk.harga)}`}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Pembayaran diproses oleh Duitku. Kami tidak menyimpan data kartu
            atau rekening Anda.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-black text-navy">Checkout</h1>
        <Suspense
          fallback={<p className="text-center text-slate-500">Memuat…</p>}
        >
          <CheckoutForm />
        </Suspense>
      </div>
    </section>
  );
}
