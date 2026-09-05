import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Syarat & Ketentuan — AMAN Digital",
  description:
    "Ketentuan pembelian produk digital, lisensi pemakaian, arti akses selamanya, alur jasa, dan penyelesaian perselisihan.",
  path: "/syarat-ketentuan",
});

/**
 * Isinya DIBACA dari `docs/legal/syarat-ketentuan.md` saat build, bukan
 * disalin ke sini.
 *
 * Disengaja: dokumen hukum yang punya dua salinan pasti menyimpang cepat atau
 * lambat, dan yang menyimpang di halaman publik adalah yang dibaca orang.
 * Dengan cara ini berkas Markdown itu satu-satunya sumber kebenaran — ubah di
 * sana, halaman ini ikut.
 *
 * `output: 'export'` membuat komponen server ini jalan saat build, jadi
 * membaca berkas di sini aman dan tidak menyentuh runtime.
 */
function bacaKetentuan(): string {
  const berkas = path.join(process.cwd(), "docs", "legal", "syarat-ketentuan.md");
  return fs.readFileSync(berkas, "utf8");
}

export default function SyaratKetentuanPage() {
  const isi = bacaKetentuan();

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <article
          className="
            prose-legal
            [&_h1]:mb-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-navy md:[&_h1]:text-4xl
            [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-navy
            [&_p]:my-4 [&_p]:leading-relaxed [&_p]:text-slate-600
            [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-slate-600
            [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:text-slate-600
            [&_li]:leading-relaxed
            [&_strong]:font-semibold [&_strong]:text-navy
            [&_a]:font-semibold [&_a]:text-emerald-cta-hover [&_a]:underline
            [&_hr]:my-10 [&_hr]:border-slate-200
            [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:text-navy
          "
        >
          {/* Tabel dibungkus agar bisa digulir sendiri di layar sempit --
              tanpa ini seluruh halaman ikut bergeser ke samping di HP. */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full border-collapse text-left text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
              th: ({ children }) => (
                <th className="border-b border-slate-200 px-4 py-3 font-semibold text-navy">{children}</th>
              ),
              td: ({ children }) => (
                <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-600">{children}</td>
              ),
            }}
          >
            {isi}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
