import {
  InstagramIcon,
  TiktokIcon,
  ShopeeIcon,
} from "@/components/icons/BrandIcons";
import { pageMeta } from "@/lib/seo";

const WA = "https://wa.me/6282210768038";
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

export const metadata = pageMeta({
  title: "Kontak | AMAN Digital",
  description:
    "Hubungi tim AMAN Digital via WhatsApp, email, atau media sosial. Konsultasi awal gratis untuk kebutuhan digital bisnis Anda.",
  path: "/kontak",
});

/* ---------------- Data ---------------- */

const sosmed = [
  {
    Icon: InstagramIcon,
    label: "Instagram",
    handle: "@aman.digital01",
    href: "https://instagram.com/aman.digital01",
  },
  {
    Icon: TiktokIcon,
    label: "TikTok",
    handle: "@adya.vision",
    href: "https://tiktok.com/@adya.vision",
  },
  {
    Icon: ShopeeIcon,
    label: "Shopee",
    handle: "aman.digital",
    href: "https://shopee.co.id/aman.digital",
  },
];

const topics = [
  { icon: "📱", label: "AMAN Kasir", text: "Halo AMAN Digital, saya ingin tanya tentang AMAN Kasir" },
  { icon: "💰", label: "AMAN Budget", text: "Halo AMAN Digital, saya ingin tanya tentang AMAN Budget" },
  { icon: "🧾", label: "AMAN Invoice", text: "Halo AMAN Digital, saya ingin tanya tentang AMAN Invoice" },
  { icon: "🖥️", label: "Jasa IT & Data", text: "Halo AMAN Digital, saya ingin tanya tentang jasa IT dan Data System" },
  { icon: "🖨️", label: "Print & Cetak", text: "Halo AMAN Digital, saya ingin tanya tentang layanan Print Center" },
  { icon: "🤝", label: "Program Reseller", text: "Halo AMAN Digital, saya ingin tanya tentang program Reseller AMAN Digital" },
];

/* ---------------- Page ---------------- */

export default function KontakPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="px-6 pb-20 pt-32 text-center"
        style={{
          background: "linear-gradient(135deg, #070B14 0%, #065F46 100%)",
        }}
      >
        <div className="mx-auto max-w-xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Ada yang Bisa Kami Bantu?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/80 md:text-xl">
            Tim AMAN Digital siap membantu pertanyaan, konsultasi, atau kerja
            sama bisnis Anda. Respon cepat, konsultasi awal gratis.
          </p>
          <a
            href={wa("Halo AMAN Digital, saya ingin bertanya")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-emerald px-8 py-3.5 font-bold text-white transition-colors hover:bg-emerald-dark"
          >
            💬 Chat WhatsApp Sekarang
          </a>
        </div>
      </section>

      {/* ===== KARTU KONTAK ===== */}
      <section className="bg-navy px-6 py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {/* WhatsApp */}
          <div className="flex flex-col rounded-2xl border-t-4 border-emerald bg-white p-8">
            <div className="text-3xl">💬</div>
            <h3 className="mt-4 text-xl font-bold text-navy">WhatsApp</h3>
            <p className="mt-2 font-semibold text-slate-700">
              +62 822-1076-8038
            </p>
            <p className="mt-1 flex-1 text-sm italic text-slate-500">
              Respon dalam 1–2 jam di jam kerja
            </p>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block rounded-full bg-emerald px-4 py-2.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Chat Sekarang
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col rounded-2xl border-t-4 border-sky-500 bg-white p-8">
            <div className="text-3xl">✉️</div>
            <h3 className="mt-4 text-xl font-bold text-navy">Email</h3>
            <p className="mt-2 font-semibold text-slate-700">
              admin@amandigital.web.id
            </p>
            <p className="mt-1 flex-1 text-sm italic text-slate-500">
              Respon dalam 1x24 jam
            </p>
            <a
              href="mailto:admin@amandigital.web.id"
              className="mt-6 block rounded-full bg-sky-500 px-4 py-2.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Kirim Email
            </a>
          </div>

          {/* Media Sosial */}
          <div className="flex flex-col rounded-2xl border-t-4 border-violet-500 bg-white p-8">
            <div className="text-3xl">🌐</div>
            <h3 className="mt-4 text-xl font-bold text-navy">Media Sosial</h3>
            <p className="mb-4 mt-2 text-sm italic text-slate-500">
              Temukan kami di platform berikut:
            </p>
            <div className="flex flex-col gap-2.5">
              {sosmed.map((s) => {
                const Icon = s.Icon;
                return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <Icon className="h-4 w-4 shrink-0 text-emerald" />
                  <span>
                    {s.label}{" "}
                    <span className="font-normal text-slate-500">
                      {s.handle}
                    </span>
                  </span>
                </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== JAM & LOKASI ===== */}
      <section className="px-6 py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Jam Layanan */}
          <div className="rounded-lg border-l-4 border-emerald bg-white p-7 shadow-sm">
            <h3 className="text-lg font-bold text-navy">⏰ Jam Layanan</h3>
            <table className="mt-5 w-full">
              <tbody>
                <tr>
                  <td className="whitespace-nowrap py-1.5 pr-6 align-top text-sm font-semibold text-slate-700">
                    Senin – Jumat
                  </td>
                  <td className="py-1.5 align-top text-sm text-slate-600">
                    09.00 – 21.00 WIB
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-1.5 pr-6 align-top text-sm font-semibold text-slate-700">
                    Sabtu – Minggu
                  </td>
                  <td className="py-1.5 align-top text-sm text-slate-600">
                    Konsultasi WA tetap aktif
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-xs italic leading-relaxed text-slate-500">
              Di luar jam kerja? Tetap kirim pesan WA — kami balas sesegera
              mungkin.
            </p>
          </div>

          {/* Lokasi */}
          <div className="rounded-lg border-l-4 border-emerald bg-white p-7 shadow-sm">
            <h3 className="text-lg font-bold text-navy">📍 Lokasi Kami</h3>
            <p className="mt-4 text-sm leading-loose text-slate-700">
              Jl. Persada Lorong Mesjid No 1
              <br />
              Blangpidie, Aceh Barat Daya
              <br />
              Aceh, Indonesia
            </p>
            <a
              href="https://maps.google.com/?q=Blangpidie+Aceh+Barat+Daya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-emerald hover:underline"
            >
              Buka di Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* ===== TOPIK WA ===== */}
      <section className="bg-white px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-navy">Ingin Diskusi Soal Apa?</h2>
          <p className="mt-2 text-base text-slate-500">
            Pilih topik — kami siapkan percakapan yang tepat:
          </p>
        </div>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
          {topics.map((t) => (
            <a
              key={t.label}
              href={wa(t.text)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald px-5 py-2.5 text-sm font-semibold text-emerald transition-colors hover:bg-emerald hover:text-white"
            >
              <span>{t.icon}</span>
              {t.label}
            </a>
          ))}
        </div>
      </section>

      {/* ===== CTA PENUTUP ===== */}
      <section className="bg-emerald px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-white">
            Jangan Ragu Menghubungi Kami
          </h2>
          <p className="mt-3 text-lg text-white/90">
            Konsultasi awal gratis. Tidak ada kewajiban. Kami bantu temukan
            solusi terbaik.
          </p>
          <a
            href={wa("Halo AMAN Digital")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-bold text-emerald transition-opacity hover:opacity-90"
          >
            Mulai Chat WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
