"use client";

import { useEffect, useState, useCallback } from "react";
import { marked } from "marked";

type ArticleListItem = {
  id: number;
  slug: string;
  title: string;
  status: "draft" | "scheduled" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
  is_breaking: number;
  is_headline: number;
  is_slider: number;
  category_name: string | null;
  author_name: string | null;
};

type ArticleFull = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  thumbnail_alt: string;
  category_id: number | null;
  author_id: number | null;
  status: string;
  is_breaking: number;
  is_headline: number;
  is_slider: number;
  video_url: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
};

type Category = { id: number; slug: string; name: string; description: string; color: string; sort_order: number };
type AuthorRow = { id: number; slug: string; name: string; email: string; role: string; bio: string };

const emptyDraft = {
  id: undefined as number | undefined,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  thumbnail_alt: "",
  category_id: "" as string | number,
  author_id: "" as string | number,
  status: "draft" as string,
  is_breaking: false,
  is_headline: false,
  is_slider: false,
  video_url: "",
  meta_title: "",
  meta_description: "",
  tags: "",
};

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald focus:outline-none";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400";

export default function AdminBlogPage() {
  const [tab, setTab] = useState<"articles" | "categories" | "authors" | "comments" | "media" | "settings">("articles");
  const [error, setError] = useState("");

  return (
    <section className="min-h-screen bg-navy px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/admin/dashboard" className="text-slate-400 hover:text-white">←</a>
            <h1 className="text-xl font-black">📰 Kelola Portal Berita</h1>
          </div>
          <a href="/admin/logout" className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white">
            Keluar
          </a>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto">
          {[
            { key: "articles", label: "📝 Artikel" },
            { key: "categories", label: "📂 Kategori" },
            { key: "authors", label: "✍️ Penulis" },
            { key: "comments", label: "💬 Komentar" },
            { key: "media", label: "🖼️ Media" },
            { key: "settings", label: "⚙️ Pengaturan" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key as typeof tab); setError(""); }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key ? "bg-emerald-cta text-white" : "border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
        )}

        {tab === "articles" && <ArticlesTab setError={setError} />}
        {tab === "categories" && <CategoriesTab setError={setError} />}
        {tab === "authors" && <AuthorsTab setError={setError} />}
        {tab === "comments" && <CommentsTab setError={setError} />}
        {tab === "media" && <MediaTab setError={setError} />}
        {tab === "settings" && <SettingsTab setError={setError} />}
      </div>
    </section>
  );
}

/* ============================== ARTIKEL ============================== */

function ArticlesTab({ setError }: { setError: (e: string) => void }) {
  const [view, setView] = useState<"list" | "editor">("list");
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [preview, setPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const uploadThumbnail = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/admin/api/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal upload.");
      setDraft((d) => ({ ...d, thumbnail: data.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal upload.");
    } finally {
      setUploadingThumb(false);
    }
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, cRes, auRes] = await Promise.all([
        fetch("/admin/api/berita?resource=articles"),
        fetch("/admin/api/berita?resource=categories"),
        fetch("/admin/api/berita?resource=authors"),
      ]);
      if (aRes.status === 401) { window.location.href = "/admin"; return; }
      const a = await aRes.json();
      const c = await cRes.json();
      const au = await auRes.json();
      setArticles(a.articles || []);
      setCategories(c.categories || []);
      setAuthors(au.authors || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [setError]);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (!preview) return;
    (async () => setPreviewHtml(await marked.parse(draft.content || "")))();
  }, [preview, draft.content]);

  const openNew = () => { setDraft(emptyDraft); setView("editor"); setPreview(false); };

  const openEdit = async (id: number) => {
    setError("");
    try {
      const res = await fetch(`/admin/api/berita?resource=articles&id=${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal memuat artikel.");
      const a: ArticleFull = data.article;
      setDraft({
        id: a.id, title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content,
        thumbnail: a.thumbnail, thumbnail_alt: a.thumbnail_alt,
        category_id: a.category_id ?? "", author_id: a.author_id ?? "", status: a.status,
        is_breaking: !!a.is_breaking, is_headline: !!a.is_headline, is_slider: !!a.is_slider,
        video_url: a.video_url, meta_title: a.meta_title, meta_description: a.meta_description,
        tags: (a.tags || []).join(", "),
      });
      setView("editor");
      setPreview(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat artikel.");
    }
  };

  const save = async (status: string) => {
    if (!draft.title.trim()) { setError("Judul wajib diisi."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/admin/api/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "articles", action: "save", ...draft, status, tags: draft.tags.split(",") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal menyimpan.");
      await loadAll();
      setView("list");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number, title: string) => {
    if (!window.confirm(`Hapus artikel "${title}" permanen?`)) return;
    try {
      const res = await fetch("/admin/api/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "articles", action: "delete", id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal menghapus.");
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    }
  };

  const statusLabel: Record<string, string> = { draft: "Draf", scheduled: "Terjadwal", published: "Terbit", archived: "Arsip" };
  const statusStyle: Record<string, string> = {
    draft: "bg-slate-500/20 text-slate-300",
    scheduled: "bg-amber-500/20 text-amber-300",
    published: "bg-emerald/20 text-emerald-light",
    archived: "bg-red-500/20 text-red-300",
  };

  if (view === "list") {
    return (
      <>
        <div className="mt-6">
          <button onClick={openNew} className="rounded-full bg-emerald-cta px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-cta-hover">
            ✏️ Tulis Artikel Baru
          </button>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flag</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Memuat…</td></tr>}
              {!loading && articles.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Belum ada artikel.</td></tr>}
              {!loading && articles.map((a) => (
                <tr key={a.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-semibold">{a.title}</td>
                  <td className="px-4 py-3 text-slate-400">{a.category_name || "—"}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs ${statusStyle[a.status]}`}>{statusLabel[a.status]}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {a.is_slider ? "🎞️" : ""}{a.is_headline ? "⭐" : ""}{a.is_breaking ? "🔴" : ""}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      {a.status === "published" && (
                        <a href={`/berita/${a.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">Lihat</a>
                      )}
                      <button onClick={() => openEdit(a.id)} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">Edit</button>
                      <button onClick={() => remove(a.id, a.title)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <div className="mt-6">
      <button onClick={() => setView("list")} className="text-sm text-slate-400 hover:text-white">← Kembali ke daftar</button>
      <div className="mt-4 grid gap-4">
        <div>
          <label className={labelCls}>Judul</label>
          <input type="text" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Judul artikel" className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Slug (kosongkan = otomatis)</label>
            <input type="text" value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kategori</label>
            <select value={draft.category_id} onChange={(e) => setDraft((d) => ({ ...d, category_id: e.target.value }))} className={inputCls}>
              <option value="">— Pilih kategori —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Penulis</label>
            <select value={draft.author_id} onChange={(e) => setDraft((d) => ({ ...d, author_id: e.target.value }))} className={inputCls}>
              <option value="">— Pilih penulis —</option>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Topik / Tag (pisahkan koma)</label>
            <input type="text" value={draft.tags} onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))} placeholder="umkm, tips, cloudflare" className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Ringkasan</label>
          <textarea value={draft.excerpt} onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))} rows={2} className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>URL Gambar Sampul</label>
            <div className="flex gap-2">
              <input type="text" value={draft.thumbnail} onChange={(e) => setDraft((d) => ({ ...d, thumbnail: e.target.value }))} placeholder="https://… atau unggah" className={inputCls} />
              <label className="flex shrink-0 cursor-pointer items-center rounded-lg border border-white/15 px-3 text-xs font-semibold text-slate-300 hover:bg-white/10">
                {uploadingThumb ? "…" : "📤 Unggah"}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploadingThumb} onChange={(e) => uploadThumbnail(e.target.files)} />
              </label>
            </div>
            {draft.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.thumbnail} alt="" className="mt-2 h-24 w-40 rounded-lg border border-white/10 object-cover" />
            )}
          </div>
          <div>
            <label className={labelCls}>URL Video YouTube (opsional)</label>
            <input type="text" value={draft.video_url} onChange={(e) => setDraft((d) => ({ ...d, video_url: e.target.value }))} placeholder="https://youtube.com/watch?v=…" className={inputCls} />
          </div>
        </div>

        <div className="flex flex-wrap gap-5 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_slider} onChange={(e) => setDraft((d) => ({ ...d, is_slider: e.target.checked }))} /> 🎞️ Tampilkan di Slider
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_headline} onChange={(e) => setDraft((d) => ({ ...d, is_headline: e.target.checked }))} /> ⭐ Jadikan Headline
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_breaking} onChange={(e) => setDraft((d) => ({ ...d, is_breaking: e.target.checked }))} /> 🔴 Breaking News
          </label>
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
            <textarea value={draft.content} onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))} rows={18} placeholder="Tulis dengan Markdown…" className={inputCls + " font-mono leading-relaxed"} />
          ) : (
            <div className="min-h-[420px] rounded-lg border border-white/15 bg-white p-6 text-slate-800 prose-preview" dangerouslySetInnerHTML={{ __html: previewHtml || "<p style='color:#94a3b8'>Belum ada isi.</p>" }} />
          )}
        </div>

        <details>
          <summary className="cursor-pointer text-sm font-semibold text-slate-300">SEO lanjutan (opsional)</summary>
          <div className="mt-3 grid gap-4">
            <div>
              <label className={labelCls}>Meta Title</label>
              <input type="text" value={draft.meta_title} onChange={(e) => setDraft((d) => ({ ...d, meta_title: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={draft.meta_description} onChange={(e) => setDraft((d) => ({ ...d, meta_description: e.target.value }))} rows={2} className={inputCls} />
            </div>
          </div>
        </details>

        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={() => save("draft")} disabled={saving} className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50">
            {saving ? "Menyimpan…" : "💾 Simpan sebagai Draf"}
          </button>
          <button onClick={() => save("published")} disabled={saving} className="rounded-full bg-emerald-cta px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-cta-hover disabled:opacity-50">
            {saving ? "Menerbitkan…" : "🚀 Terbitkan"}
          </button>
          {draft.status === "published" && draft.slug && (
            <a href={`/berita/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10">
              Lihat halaman live ↗
            </a>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .prose-preview h1, .prose-preview h2, .prose-preview h3 { font-weight: 800; margin: 1em 0 .5em; }
        .prose-preview p { margin: 0 0 1em; line-height: 1.7; }
        .prose-preview a { color: #059669; text-decoration: underline; }
        .prose-preview img { max-width: 100%; border-radius: 10px; }
      ` }} />
    </div>
  );
}

/* ============================== KATEGORI ============================== */

function CategoriesTab({ setError }: { setError: (e: string) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: undefined as number | undefined, name: "", slug: "", description: "", color: "#059669", sort_order: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin/api/berita?resource=categories");
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name.trim()) { setError("Nama kategori wajib diisi."); return; }
    try {
      const res = await fetch("/admin/api/berita", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "categories", action: "save", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      setForm({ id: undefined, name: "", slug: "", description: "", color: "#059669", sort_order: 0 });
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal menyimpan."); }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Hapus kategori ini? Artikel di dalamnya tidak ikut terhapus.")) return;
    await fetch("/admin/api/berita", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "categories", action: "delete", id }) });
    await load();
  };

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-3 text-sm font-bold">{form.id ? "Edit Kategori" : "Tambah Kategori"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="text" placeholder="Nama" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
          <input type="text" placeholder="Slug (opsional)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputCls} />
          <input type="text" placeholder="Deskripsi" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputCls + " sm:col-span-2"} />
          <div className="flex items-center gap-2">
            <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="h-9 w-14 rounded border border-white/15 bg-white/5" />
            <span className="text-xs text-slate-400">Warna badge</span>
          </div>
          <input type="number" placeholder="Urutan" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} className={inputCls} />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={save} className="rounded-full bg-emerald-cta px-5 py-2 text-sm font-bold text-white">{form.id ? "Simpan Perubahan" : "➕ Tambah"}</button>
          {form.id && <button onClick={() => setForm({ id: undefined, name: "", slug: "", description: "", color: "#059669", sort_order: 0 })} className="rounded-full border border-white/15 px-5 py-2 text-sm">Batal</button>}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10 text-left text-xs uppercase text-slate-400"><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3"></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-500">Memuat…</td></tr>}
            {!loading && categories.map((c) => (
              <tr key={c.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3"><span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: c.color + "33", color: c.color }}>{c.name}</span></td>
                <td className="px-4 py-3 text-slate-400">{c.slug}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button onClick={() => setForm({ id: c.id, name: c.name, slug: c.slug, description: c.description || "", color: c.color || "#059669", sort_order: c.sort_order })} className="rounded-full border border-white/15 px-3 py-1 text-xs">Edit</button>
                    <button onClick={() => remove(c.id)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== PENULIS ============================== */

function AuthorsTab({ setError }: { setError: (e: string) => void }) {
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: undefined as number | undefined, name: "", slug: "", email: "", role: "author", bio: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin/api/berita?resource=authors");
    const data = await res.json();
    setAuthors(data.authors || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name.trim()) { setError("Nama penulis wajib diisi."); return; }
    try {
      const res = await fetch("/admin/api/berita", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "authors", action: "save", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      setForm({ id: undefined, name: "", slug: "", email: "", role: "author", bio: "" });
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal menyimpan."); }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Hapus penulis ini?")) return;
    await fetch("/admin/api/berita", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "authors", action: "delete", id }) });
    await load();
  };

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-3 text-sm font-bold">{form.id ? "Edit Penulis" : "Tambah Penulis"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="text" placeholder="Nama" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
          <input type="text" placeholder="Slug (opsional)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputCls} />
          <input type="email" placeholder="Email (opsional)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className={inputCls}>
            <option value="author">Penulis</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <textarea placeholder="Bio singkat" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={2} className={inputCls + " sm:col-span-2"} />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={save} className="rounded-full bg-emerald-cta px-5 py-2 text-sm font-bold text-white">{form.id ? "Simpan Perubahan" : "➕ Tambah"}</button>
          {form.id && <button onClick={() => setForm({ id: undefined, name: "", slug: "", email: "", role: "author", bio: "" })} className="rounded-full border border-white/15 px-5 py-2 text-sm">Batal</button>}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10 text-left text-xs uppercase text-slate-400"><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Peran</th><th className="px-4 py-3"></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-500">Memuat…</td></tr>}
            {!loading && authors.map((a) => (
              <tr key={a.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 font-semibold">{a.name}</td>
                <td className="px-4 py-3 text-slate-400">{a.role}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button onClick={() => setForm({ id: a.id, name: a.name, slug: a.slug, email: a.email || "", role: a.role, bio: a.bio || "" })} className="rounded-full border border-white/15 px-3 py-1 text-xs">Edit</button>
                    <button onClick={() => remove(a.id)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== KOMENTAR ============================== */

type CommentRow = {
  id: number;
  name: string;
  email: string | null;
  content: string;
  created_at: string;
  article_title: string;
  article_slug: string;
};

function CommentsTab({ setError }: { setError: (e: string) => void }) {
  const [status, setStatus] = useState<"pending" | "approved" | "spam">("pending");
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async (s: typeof status) => {
    setLoading(true);
    const res = await fetch(`/admin/api/berita?resource=comments&status=${s}`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(status); }, [status, load]);

  const act = async (id: number, action: "approve" | "spam" | "delete") => {
    setBusyId(id);
    try {
      const res = await fetch("/admin/api/berita", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "comments", action, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      await load(status);
    } catch (e) { setError(e instanceof Error ? e.message : "Aksi gagal."); }
    finally { setBusyId(null); }
  };

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        {(["pending", "approved", "spam"] as const).map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${status === s ? "bg-emerald-cta text-white" : "border border-white/10 text-slate-300"}`}>
            {s === "pending" ? "⏳ Menunggu" : s === "approved" ? "✅ Disetujui" : "🚫 Spam"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {loading && <p className="text-slate-500">Memuat…</p>}
        {!loading && comments.length === 0 && <p className="text-slate-500">Tidak ada komentar di status ini.</p>}
        {!loading && comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-bold">{c.name}</span>
                {c.email && <span className="ml-2 text-xs text-slate-500">{c.email}</span>}
                <span className="ml-2 text-xs text-slate-500">{c.created_at.slice(0, 16)}</span>
              </div>
              <a href={`/berita/${c.article_slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-light hover:underline">
                {c.article_title} ↗
              </a>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{c.content}</p>
            <div className="mt-3 flex gap-2">
              {status !== "approved" && (
                <button disabled={busyId === c.id} onClick={() => act(c.id, "approve")} className="rounded-full bg-emerald-cta px-3 py-1 text-xs font-bold text-white disabled:opacity-50">✅ Setujui</button>
              )}
              {status !== "spam" && (
                <button disabled={busyId === c.id} onClick={() => act(c.id, "spam")} className="rounded-full border border-amber-500/40 px-3 py-1 text-xs text-amber-300 disabled:opacity-50">🚫 Spam</button>
              )}
              <button disabled={busyId === c.id} onClick={() => act(c.id, "delete")} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300 disabled:opacity-50">🗑 Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== MEDIA ============================== */

type MediaItem = { key: string; size: number; uploaded: string; url: string };

function formatBytes(n: number): string {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + " KB";
  return (n / (1024 * 1024)).toFixed(1) + " MB";
}

function MediaTab({ setError }: { setError: (e: string) => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin/api/media");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/admin/api/media", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || `Gagal upload ${file.name}.`);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal upload.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (key: string) => {
    if (!window.confirm("Hapus gambar ini permanen?")) return;
    await fetch("/admin/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", key }) });
    await load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mt-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center hover:border-emerald/50">
        <span className="text-2xl">🖼️</span>
        <span className="text-sm font-semibold">{uploading ? "Mengunggah…" : "Klik untuk pilih gambar (JPG/PNG/WebP/GIF, maks 8MB)"}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" disabled={uploading} onChange={(e) => upload(e.target.files)} />
      </label>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {loading && <p className="col-span-full text-center text-slate-500">Memuat…</p>}
        {!loading && items.length === 0 && <p className="col-span-full text-center text-slate-500">Belum ada gambar.</p>}
        {!loading && items.map((it) => (
          <div key={it.key} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
            <div className="p-2">
              <div className="text-[10px] text-slate-500">{formatBytes(it.size)}</div>
              <div className="mt-1 flex gap-1">
                <button onClick={() => copyUrl(it.url)} className="flex-1 rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold hover:bg-white/10">
                  {copied === it.url ? "✓ Tersalin" : "Salin URL"}
                </button>
                <button onClick={() => remove(it.key)} className="rounded-full border border-red-500/30 px-2 py-1 text-[10px] text-red-300 hover:bg-red-500/10">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== PENGATURAN ============================== */

function SettingsTab({ setError }: { setError: (e: string) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/admin/api/berita?resource=settings");
      const data = await res.json();
      setValues(data.settings || {});
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/admin/api/berita", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "settings", action: "save", values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      setSaved(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal menyimpan."); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="mt-6 text-slate-500">Memuat…</p>;

  const fields: { key: string; label: string; type?: string }[] = [
    { key: "site_name", label: "Nama Portal" },
    { key: "site_tagline", label: "Tagline" },
    { key: "site_description", label: "Deskripsi (untuk SEO)" },
    { key: "per_page", label: "Artikel per halaman" },
    { key: "trending_limit", label: "Jumlah artikel trending" },
  ];

  return (
    <div className="mt-6 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <input type="text" value={values[f.key] || ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} className={inputCls} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="rounded-full bg-emerald-cta px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "Menyimpan…" : "💾 Simpan Pengaturan"}
        </button>
        {saved && <span className="text-xs text-emerald-light">✓ Tersimpan</span>}
      </div>
    </div>
  );
}
