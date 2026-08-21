import { escapeHtml, formatDateID, type Article } from "./_lib/blog";
import { renderPage } from "./_lib/blogRender";

interface Env {
  DB: D1Database;
}

const CATEGORY_STYLE: Record<string, string> = {
  "Tips UMKM": "background:#d1fae5;color:#047857",
  Tutorial: "background:#dbeafe;color:#1d4ed8",
  "Update Produk": "background:#ede9fe;color:#6d28d9",
  Berita: "background:#ffedd5;color:#c2410c",
  Umum: "background:#f1f5f9;color:#475569",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare(
    "SELECT id, slug, title, excerpt, cover_image, category, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC"
  ).all<Article>();
  const posts = results || [];

  const cards = posts
    .map((p) => {
      const catStyle = CATEGORY_STYLE[p.category] || CATEGORY_STYLE.Umum;
      const cover = p.cover_image
        ? `<img src="${escapeHtml(p.cover_image)}" alt="${escapeHtml(p.title)}" style="width:100%;height:100%;object-fit:cover">`
        : `<div style="width:100%;height:100%;display:grid;place-items:center;color:#a7f3d0;font-size:2.5rem">📰</div>`;
      return `
      <a href="/blog/${encodeURIComponent(p.slug)}" style="display:flex;flex-direction:column;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;text-decoration:none;color:inherit;transition:box-shadow .2s,transform .2s" onmouseover="this.style.boxShadow='0 12px 30px rgba(0,0,0,.08)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
        <div style="position:relative;height:180px;background:#ecfdf5">
          ${cover}
          <span style="position:absolute;top:12px;left:12px;font-size:.7rem;font-weight:700;padding:4px 10px;border-radius:999px;${catStyle}">${escapeHtml(p.category)}</span>
        </div>
        <div style="padding:20px;display:flex;flex-direction:column;flex:1">
          <div style="color:#94a3b8;font-size:.78rem;margin-bottom:10px">📅 ${formatDateID(p.published_at)}</div>
          <h2 style="margin:0 0 8px;font-size:1.15rem;font-weight:800;line-height:1.35;color:#0f172a">${escapeHtml(p.title)}</h2>
          ${p.excerpt ? `<p style="margin:0;color:#64748b;font-size:.9rem;line-height:1.6;flex:1">${escapeHtml(p.excerpt)}</p>` : ""}
          <div style="margin-top:14px;color:#059669;font-size:.88rem;font-weight:700">Baca selengkapnya →</div>
        </div>
      </a>`;
    })
    .join("");

  const empty = `<div style="text-align:center;padding:80px 16px;color:#94a3b8"><div style="font-size:2.5rem;margin-bottom:12px">📖</div><p style="font-size:1.1rem">Belum ada artikel. Nantikan konten terbaru!</p></div>`;

  const body = `
  <section style="background:#070B14;color:#fff;padding:80px 16px 60px;text-align:center">
    <div class="wrap">
      <span style="display:inline-flex;align-items:center;gap:8px;background:rgba(16,185,129,.15);color:#6ee7b7;padding:7px 16px;border-radius:999px;font-size:.85rem;font-weight:600">📖 Blog AMAN Digital</span>
      <h1 style="margin:22px 0 14px;font-size:2.4rem;font-weight:900;line-height:1.2">Tips &amp; Inspirasi untuk <span style="color:#34d399">UMKM Indonesia</span></h1>
      <p style="margin:0 auto;max-width:640px;color:#cbd5e1;font-size:1.05rem">Tutorial produk, tips bisnis, dan update terbaru untuk membantu usaha Anda tumbuh.</p>
    </div>
  </section>
  <section class="wrap" style="padding:56px 16px">
    ${posts.length === 0 ? empty : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:26px">${cards}</div>`}
  </section>`;

  const html = renderPage({
    title: "Blog — AMAN Digital",
    description: "Tips bisnis UMKM, tutorial produk, dan berita terbaru dari AMAN Digital.",
    body,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
