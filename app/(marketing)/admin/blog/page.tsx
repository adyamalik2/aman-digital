"use client";

import { useEffect, useState, useCallback } from "react";
import { marked } from "marked";

type ArticleListItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  category: string;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

type ArticleFull = ArticleListItem & { content: string };

const CATEGORIES = ["Tips UMKM", "Tutorial", "Update Produk", "Berita", "Umum"];

const emptyDraft = {
  id: undefined as number | undefined,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "Umum",
  status: "draft" as "draft" | "published",
};

export default function AdminBlogPage() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [preview, setPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const loadList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/admin/api/blog");
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal memuat artikel.");
      setArticles(data.articles || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat artikel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (!preview) return;
    (async () => setPreviewHtml(await marked.parse(draft.content || "")))();
  }, [preview, draft.content]);

  const openNew = () => {
    setDraft(emptyDraft);
    setView("editor");
    setPreview(false);
  };

  const openEdit = async (id: number) => {
    setError("");
    try {
      const res = await fetch(`/admin/api/blog?id=${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal memuat artikel.");
      const a: ArticleFull = data.article;
      setDraft({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        cover_image: a.cover_image,
        category: a.category,
        status: a.status,
      });
      setView("editor");
      setPreview(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat artikel.");
    }
  };

  const save = async (status: "draft" | "published") => {
    if (!draft.title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/admin/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", ...draft, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal menyimpan.");
      setDraft((d) => ({ ...d, id: data.id, slug: data.slug, status }));
      await loadList();
      setView("list");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number, title: string) => {
    if (!window.confirm(`Hapus artikel "${title}" permanen?`)) return;
    setError("");
    try {
      const res = await fetch("/admin/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal menghapus.");
      await loadList();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald focus:outline-none";
  const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400";

  return (
    <section className="min-h-screen bg-navy px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/admin/dashboard" className="text-slate-400 hover:text-white">←</a>
            <h1 className="text-xl font-black">📝 Kelola Blog</h1>
          </div>
          <a href="/admin/logout" className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white">
            Keluar
          </a>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
        )}

        {view === "list" && (
          <>
            <div className="mt-6">
              <button
                onClick={openNew}
                className="rounded-full bg-emerald-cta px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-cta-hover"
              >
                ✏️ Tulis Artikel Baru
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Terakhir Diubah</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Memuat…</td></tr>}
                  {!loading && articles.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Belum ada artikel.</td></tr>
                  )}
                  {!loading && articles.map((a) => (
                    <tr key={a.id} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3 font-semibold">{a.title}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs ${a.status === "published" ? "bg-emerald/20 text-emerald-light" : "bg-slate-500/20 text-slate-300"}`}>
                          {a.status === "published" ? "Terbit" : "Draf"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{(a.updated_at || "").slice(0, 10)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          {a.status === "published" && (
                            <a href={`/blog/${a.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">
                              Lihat
                            </a>
                          )}
                          <button onClick={() => openEdit(a.id)} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">
                            Edit
                          </button>
                          <button onClick={() => remove(a.id, a.title)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === "editor" && (
          <div className="mt-6">
            <button onClick={() => setView("list")} className="text-sm text-slate-400 hover:text-white">← Kembali ke daftar</button>

            <div className="mt-4 grid gap-4">
              <div>
                <label className={labelCls}>Judul</label>
                <input type="text" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Judul artikel" className={inputCls} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Slug (kosongkan = otomatis dari judul)</label>
                  <input type="text" value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} placeholder="judul-artikel" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Kategori</label>
                  <select value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Ringkasan (tampil di kartu daftar blog)</label>
                <textarea value={draft.excerpt} onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))} rows={2} placeholder="Ringkasan singkat…" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>URL Gambar Sampul (opsional)</label>
                <input type="text" value={draft.cover_image} onChange={(e) => setDraft((d) => ({ ...d, cover_image: e.target.value }))} placeholder="https://…" className={inputCls} />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className={labelCls + " mb-0"}>Isi Artikel (Markdown)</label>
                  <div className="flex gap-1 rounded-full border border-white/10 p-0.5 text-xs">
                    <button type="button" onClick={() => setPreview(false)} className={`rounded-full px-3 py-1 ${!preview ? "bg-white/10 text-white" : "text-slate-400"}`}>Tulis</button>
                    <button type="button" onClick={() => setPreview(true)} className={`rounded-full px-3 py-1 ${preview ? "bg-white/10 text-white" : "text-slate-400"}`}>Pratinjau</button>
                  </div>
                </div>
                {!preview ? (
                  <textarea
                    value={draft.content}
                    onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    rows={18}
                    placeholder="Tulis dengan Markdown: **tebal**, *miring*, ## Judul, - daftar, [tautan](url), ![gambar](url)…"
                    className={inputCls + " font-mono leading-relaxed"}
                  />
                ) : (
                  <div
                    className="min-h-[420px] rounded-lg border border-white/15 bg-white p-6 text-slate-800 prose-preview"
                    dangerouslySetInnerHTML={{ __html: previewHtml || "<p style='color:#94a3b8'>Belum ada isi.</p>" }}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={() => save("draft")} disabled={saving} className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50">
                  {saving ? "Menyimpan…" : "💾 Simpan sebagai Draf"}
                </button>
                <button onClick={() => save("published")} disabled={saving} className="rounded-full bg-emerald-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-cta-hover disabled:opacity-50">
                  {saving ? "Menerbitkan…" : "🚀 Terbitkan"}
                </button>
                {draft.status === "published" && draft.slug && (
                  <a href={`/blog/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10">
                    Lihat halaman live ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .prose-preview h1, .prose-preview h2, .prose-preview h3 { font-weight: 800; margin: 1em 0 .5em; }
        .prose-preview p { margin: 0 0 1em; line-height: 1.7; }
        .prose-preview a { color: #059669; text-decoration: underline; }
        .prose-preview img { max-width: 100%; border-radius: 10px; }
        .prose-preview ul, .prose-preview ol { padding-left: 1.4em; margin: 0 0 1em; }
        .prose-preview blockquote { border-left: 4px solid #10b981; padding-left: 1em; color: #475569; margin: 1em 0; }
        .prose-preview code { background: #f1f5f9; padding: .15em .4em; border-radius: 4px; }
        .prose-preview pre { background: #0f172a; color: #e2e8f0; padding: 1em; border-radius: 10px; overflow-x: auto; }
      ` }} />
    </section>
  );
}
