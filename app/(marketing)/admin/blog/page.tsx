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
  const [tab, setTab] = useState<"articles" | "categories" | "authors" | "settings">("articles");
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

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, cRes, auRes] = await Promise.all([
        fetch("/admin/api/blog?resource=articles"),
        fetch("/admin/api/blog?resource=categories"),
        fetch("/admin/api/blog?resource=authors"),
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
      const res = await fetch(`/admin/api/blog?resource=articles&id=${id}`);
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
      const res = await fetch("/admin/api/blog", {
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
      const res = await fetch("/admin/api/blog", {
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
                        <a href={`/blog/${a.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">Lihat</a>
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
            <input type="text" value={draft.thumbnail} onChange={(e) => setDraft((d) => ({ ...d, thumbnail: e.target.value }))} placeholder="https://…" className={inputCls} />
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
            <a href={`/blog/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10">
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
    const res = await fetch("/admin/api/blog?resource=categories");
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name.trim()) { setError("Nama kategori wajib diisi."); return; }
    try {
      const res = await fetch("/admin/api/blog", {
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
    await fetch("/admin/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "categories", action: "delete", id }) });
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
    const res = await fetch("/admin/api/blog?resource=authors");
    const data = await res.json();
    setAuthors(data.authors || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name.trim()) { setError("Nama penulis wajib diisi."); return; }
    try {
      const res = await fetch("/admin/api/blog", {
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
    await fetch("/admin/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "authors", action: "delete", id }) });
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

/* ============================== PENGATURAN ============================== */

function SettingsTab({ setError }: { setError: (e: string) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/admin/api/blog?resource=settings");
      const data = await res.json();
      setValues(data.settings || {});
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/admin/api/blog", {
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
