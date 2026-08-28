"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Hasil = {
  status: "pending" | "paid" | "failed";
  productName: string;
  masukPath: string;
  code?: string;
};

const WA = "https://wa.me/6282210768038";

function HasilPembayaran() {
  const orderId = useSearchParams().get("order") || "";
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [galat, setGalat] = useState("");
  const [disalin, setDisalin] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setGalat("Nomor pesanan tidak ada di alamat halaman.");
      return;
    }
    let batal = false;
    let percobaan = 0;

    // Pembeli biasanya kembali ke sini sebelum callback Duitku sampai, jadi
    // status "pending" wajar di detik-detik awal. Dicek berkala beberapa kali
    // sebelum menyerah, daripada langsung menampilkan "belum lunas".
    const cek = async () => {
      try {
        const res = await fetch(`/api/order-status?order=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (batal) return;
        if (!res.ok || !data.ok) {
          setGalat(data.message || "Pesanan tidak ditemukan.");
          return;
        }
        setHasil(data);
        if (data.status === "pending" && percobaan < 10) {
          percobaan++;
          setTimeout(cek, 3000);
        }
      } catch {
        if (!batal) setGalat("Tidak bisa memeriksa status pesanan.");
      }
    };
    cek();
    return () => { batal = true; };
  }, [orderId]);

  if (galat) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-bold text-navy">{galat}</p>
        <p className="mt-3 text-sm text-slate-600">
          Kalau Anda sudah membayar, hubungi kami dan sebutkan nomor pesanan Anda.
        </p>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-emerald-cta px-6 py-3 font-semibold text-white hover:bg-emerald-cta-hover"
        >
          Hubungi via WhatsApp
        </a>
      </div>
    );
  }

  if (!hasil) {
    return <p className="text-center text-slate-500">Memeriksa status pembayaran…</p>;
  }

  if (hasil.status === "paid" && hasil.code) {
    return (
      <div className="rounded-2xl border border-emerald/30 bg-white p-8 text-center">
        <div className="text-4xl">✅</div>
        <h2 className="mt-4 text-2xl font-black text-navy">Pembayaran berhasil</h2>
        <p className="mt-2 text-slate-600">{hasil.productName}</p>

        <p className="mt-8 text-sm font-bold uppercase tracking-wide text-emerald-dark">
          Kode Akses Anda
        </p>
        <div className="mt-2 rounded-xl border-2 border-dashed border-emerald/40 bg-emerald/5 px-6 py-5">
          <code className="select-all text-2xl font-black tracking-widest text-navy">
            {hasil.code}
          </code>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(hasil.code || "").then(
              () => { setDisalin(true); setTimeout(() => setDisalin(false), 2000); },
              () => { /* peramban menolak akses papan klip -- kode tetap bisa disalin manual */ }
            );
          }}
          className="mt-3 text-sm font-semibold text-emerald-dark hover:underline"
        >
          {disalin ? "✓ Tersalin" : "Salin kode"}
        </button>

        <p className="mt-6 text-sm text-slate-600">
          Simpan kode ini. Catat juga nomor pesanan{" "}
          <span className="font-mono font-semibold">{orderId}</span> untuk berjaga-jaga.
        </p>

        <Link
          href={hasil.masukPath}
          className="mt-6 inline-block rounded-full bg-emerald-cta px-8 py-3.5 font-semibold text-white hover:bg-emerald-cta-hover"
        >
          Masuk & Mulai Pakai →
        </Link>
      </div>
    );
  }

  if (hasil.status === "failed") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center">
        <div className="text-4xl">⚠️</div>
        <h2 className="mt-4 text-xl font-bold text-navy">Pembayaran belum berhasil</h2>
        <p className="mt-3 text-slate-600">
          Pesanan <span className="font-mono">{orderId}</span> tidak selesai dibayar
          atau kedaluwarsa. Anda tidak dikenakan biaya.
        </p>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full border border-emerald px-6 py-3 font-semibold text-emerald-dark hover:bg-emerald-cta hover:text-white"
        >
          Butuh bantuan?
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <div className="text-4xl">⏳</div>
      <h2 className="mt-4 text-xl font-bold text-navy">Menunggu konfirmasi pembayaran</h2>
      <p className="mt-3 text-slate-600">
        Kalau Anda baru saja membayar, konfirmasinya bisa memakan waktu beberapa
        menit. Halaman ini memperbarui sendiri.
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Nomor pesanan: <span className="font-mono font-semibold">{orderId}</span>
      </p>
    </div>
  );
}

export default function SelesaiPage() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <Suspense fallback={<p className="text-center text-slate-500">Memuat…</p>}>
          <HasilPembayaran />
        </Suspense>
      </div>
    </section>
  );
}
