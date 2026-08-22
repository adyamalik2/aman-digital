/**
 * newsRender.ts — bungkus HTML & komponen kartu untuk portal berita.
 * Dirender per-permintaan oleh Pages Function (bukan Next.js), sama seperti
 * pola functions/berita.ts sebelumnya -- CSS ditulis inline & mandiri.
 */
import { escapeHtml, formatDateID, youtubeId, type Article, type Category } from "./news";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Inter', system-ui, -apple-system, Segoe UI, sans-serif; background: #F8FAFC; color: #0f172a; }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 16px; }
  .sect { padding: 40px 0; }
  .sect-title { display: flex; align-items: center; gap: 8px; font-size: 1.05rem; font-weight: 800; text-transform: uppercase; letter-spacing: .03em; margin: 0 0 20px; padding-bottom: 10px; border-bottom: 3px solid #059669; }
  .sect-title .bar { width: 5px; height: 20px; background: #059669; border-radius: 3px; }

  header.site { background: #070B14; position: sticky; top: 0; z-index: 40; }
  .ticker { background: #dc2626; color: #fff; overflow: hidden; white-space: nowrap; }
  .ticker-inner { display: inline-flex; align-items: center; padding: 8px 0; animation: tick 28s linear infinite; }
  .ticker-label { background: #991b1b; padding: 4px 12px; border-radius: 4px; font-size: .72rem; font-weight: 800; text-transform: uppercase; margin-right: 14px; flex-shrink: 0; }
  .ticker-item { margin-right: 40px; font-size: .85rem; font-weight: 600; }
  @keyframes tick { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .topbar { display: flex; align-items: center; justify-content: space-between; height: 68px; }
  .brand { display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 900; font-size: 1.1rem; }
  .brand img { height: 32px; width: auto; border-radius: 7px; }
  .navcats { display: flex; gap: 4px; overflow-x: auto; padding: 0 0 12px; scrollbar-width: none; }
  .navcats::-webkit-scrollbar { display: none; }
  .navcats a { color: #cbd5e1; font-size: .84rem; font-weight: 700; padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
  .navcats a:hover, .navcats a.active { background: rgba(16,185,129,.18); color: #6ee7b7; }
  .search-box { display: flex; align-items: center; gap: 8px; }
  .search-box input { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); border-radius: 999px; padding: 8px 14px; color: #fff; font-size: .84rem; width: 200px; }
  .search-box input::placeholder { color: #64748b; }
  .search-box button { background: #059669; border: 0; color: #fff; border-radius: 999px; padding: 8px 14px; font-size: .8rem; font-weight: 700; cursor: pointer; }

  .cat-badge { display: inline-block; font-size: .68rem; font-weight: 800; padding: 4px 11px; border-radius: 999px; text-transform: uppercase; letter-spacing: .02em; }

  .hero { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
  @media (max-width: 860px) { .hero { grid-template-columns: 1fr; } }
  .hero-slide { position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 16/10; background: #0f172a; }
  .hero-slide img { width: 100%; height: 100%; object-fit: cover; }
  .hero-slide .ov { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,.82), rgba(0,0,0,.05) 55%); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; }
  .hero-slide h2 { color: #fff; font-size: 1.4rem; font-weight: 800; line-height: 1.3; margin: 10px 0 6px; }
  .hero-slide .meta { color: #cbd5e1; font-size: .78rem; }
  .hero-side { display: flex; flex-direction: column; gap: 14px; }
  .hero-mini { display: flex; gap: 12px; background: #fff; border-radius: 12px; padding: 10px; border: 1px solid #e2e8f0; }
  .hero-mini img { width: 88px; height: 66px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  .hero-mini h3 { font-size: .88rem; font-weight: 700; line-height: 1.35; margin: 0 0 4px; }
  .hero-mini .meta { color: #94a3b8; font-size: .72rem; }

  .headline { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center; background: #fff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; }
  @media (max-width: 760px) { .headline { grid-template-columns: 1fr; } }
  .headline img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: 4/3; }
  .headline-body { padding: 24px 28px 24px 0; }
  @media (max-width: 760px) { .headline-body { padding: 0 20px 24px; } }
  .headline-body h2 { font-size: 1.5rem; font-weight: 800; line-height: 1.3; margin: 10px 0; }
  .headline-body p { color: #64748b; line-height: 1.7; margin: 0 0 12px; }
  .headline-body .meta { color: #94a3b8; font-size: .8rem; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 22px; }
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: box-shadow .2s, transform .2s; }
  .card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.08); transform: translateY(-2px); }
  .card .thumb { position: relative; aspect-ratio: 16/10; background: #ecfdf5; }
  .card .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .card .thumb .cat-badge { position: absolute; top: 10px; left: 10px; background: rgba(15,23,42,.75); color: #fff; }
  .card .body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
  .card h3 { font-size: 1rem; font-weight: 700; line-height: 1.4; margin: 0 0 8px; }
  .card .meta { color: #94a3b8; font-size: .75rem; margin-bottom: 8px; }
  .card p { color: #64748b; font-size: .85rem; line-height: 1.6; margin: 0; flex: 1; }

  .list-row { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
  .list-row:last-child { border-bottom: 0; }
  .list-row .num { font-size: 1.6rem; font-weight: 900; color: #cbd5e1; width: 34px; flex-shrink: 0; }
  .list-row img { width: 76px; height: 58px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  .list-row h4 { font-size: .88rem; font-weight: 700; line-height: 1.4; margin: 0 0 4px; }
  .list-row .meta { color: #94a3b8; font-size: .72rem; }

  .layout2 { display: grid; grid-template-columns: 2.1fr 1fr; gap: 30px; align-items: start; }
  @media (max-width: 900px) { .layout2 { grid-template-columns: 1fr; } }
  .side-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 22px; }
  .side-card h3 { font-size: .82rem; font-weight: 800; text-transform: uppercase; letter-spacing: .03em; margin: 0 0 14px; color: #059669; }

  .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 30px; }
  .pagination a, .pagination span { padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: .85rem; font-weight: 600; background: #fff; }
  .pagination .active { background: #059669; color: #fff; border-color: #059669; }

  footer.site { background: #070B14; color: #94a3b8; padding: 40px 16px 26px; margin-top: 60px; }
  footer.site .cols { display: flex; flex-wrap: wrap; gap: 30px; justify-content: space-between; margin-bottom: 24px; }
  footer.site a { color: #94a3b8; text-decoration: none; font-size: .85rem; }
  footer.site a:hover { color: #34d399; }
  footer.site .bottom { border-top: 1px solid rgba(255,255,255,.08); padding-top: 18px; font-size: .8rem; text-align: center; }
`;

export function renderShell(opts: {
  title: string;
  description: string;
  body: string;
  categories: Category[];
  activeCategory?: string;
  breaking?: Article[];
  noindex?: boolean;
}): string {
  const navLinks = opts.categories
    .map((c) => `<a href="/berita/kategori/${c.slug}" class="${opts.activeCategory === c.slug ? "active" : ""}">${escapeHtml(c.name)}</a>`)
    .join("");

  const tickerItems = (opts.breaking || []).map((b) => `<span class="ticker-item"><a href="/berita/${b.slug}">${escapeHtml(b.title)}</a></span>`).join("");
  const ticker =
    opts.breaking && opts.breaking.length
      ? `<div class="ticker"><div class="ticker-inner"><span class="ticker-label">🔴 Breaking</span>${tickerItems}${tickerItems}</div></div>`
      : "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(opts.title)}</title>
<meta name="description" content="${escapeHtml(opts.description)}">
${opts.noindex ? '<meta name="robots" content="noindex, follow">' : ""}
<link rel="icon" type="image/png" href="/images/logo-tab.png">
<link rel="alternate" type="application/rss+xml" title="RSS" href="/berita/feed">
<style>${STYLE}</style>
</head>
<body>
${ticker}
<header class="site">
  <div class="wrap topbar">
    <a class="brand" href="/berita"><img src="/images/logo-header.webp" alt="">AMAN NEWS</a>
    <form class="search-box" action="/berita/cari" method="get">
      <input type="text" name="q" placeholder="Cari berita…">
      <button type="submit">🔍</button>
    </form>
  </div>
  <div class="wrap navcats">
    <a href="/berita" class="${!opts.activeCategory ? "active" : ""}">Beranda</a>
    ${navLinks}
  </div>
</header>
${opts.body}
<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div><a href="/">← Kembali ke Situs Utama AMAN Digital</a></div>
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        <a href="/berita/halaman/privacy">Kebijakan Privasi</a>
        <a href="/berita/halaman/disclaimer">Disclaimer</a>
        <a href="/berita/halaman/pedoman-media-siber">Pedoman Media Siber</a>
        <a href="/berita/feed">RSS</a>
      </div>
    </div>
    <div class="bottom">&copy; 2026 AMAN Digital &middot; <a href="https://wa.me/6282210768038" target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
  </div>
</footer>
</body>
</html>`;
}

export function sectionTitle(label: string): string {
  return `<h2 class="sect-title"><span class="bar"></span>${escapeHtml(label)}</h2>`;
}

function thumbOr(article: Article, fallback = "📰"): string {
  return article.thumbnail
    ? `<img src="${escapeHtml(article.thumbnail)}" alt="${escapeHtml(article.thumbnail_alt || article.title)}" loading="lazy">`
    : `<div style="width:100%;height:100%;display:grid;place-items:center;font-size:2rem;background:#ecfdf5">${fallback}</div>`;
}

function catStyle(color: string): string {
  return `background:${color || "#059669"}22;color:${color || "#059669"}`;
}

export function renderCard(a: Article): string {
  return `<a class="card" href="/berita/${encodeURIComponent(a.slug)}">
    <div class="thumb">${thumbOr(a)}
      ${a.category_name ? `<span class="cat-badge" style="${catStyle(a.category_color || "")}">${escapeHtml(a.category_name)}</span>` : ""}
    </div>
    <div class="body">
      <div class="meta">📅 ${formatDateID(a.published_at)} &middot; ${a.reading_minutes} menit baca</div>
      <h3>${escapeHtml(a.title)}</h3>
      ${a.excerpt ? `<p>${escapeHtml(a.excerpt)}</p>` : ""}
    </div>
  </a>`;
}

export function renderListRow(a: Article, num?: number): string {
  return `<a class="list-row" href="/berita/${encodeURIComponent(a.slug)}">
    ${num ? `<div class="num">${num}</div>` : ""}
    ${thumbOr(a) === "" ? "" : `<img src="${a.thumbnail ? escapeHtml(a.thumbnail) : "/images/logo-tab.png"}" alt="">`}
    <div>
      <h4>${escapeHtml(a.title)}</h4>
      <div class="meta">📅 ${formatDateID(a.published_at)}</div>
    </div>
  </a>`;
}

export function renderHeroSlide(a: Article, active: boolean): string {
  return `<div class="hero-slide" ${active ? "" : 'style="display:none"'} data-slide>
    ${thumbOr(a)}
    <div class="ov">
      ${a.category_name ? `<span class="cat-badge" style="background:${a.category_color || "#059669"};color:#fff">${escapeHtml(a.category_name)}</span>` : ""}
      <a href="/berita/${encodeURIComponent(a.slug)}"><h2>${escapeHtml(a.title)}</h2></a>
      <div class="meta">📅 ${formatDateID(a.published_at)} &middot; ${a.reading_minutes} menit baca</div>
    </div>
  </div>`;
}

export function renderHeroMini(a: Article): string {
  return `<a class="hero-mini" href="/berita/${encodeURIComponent(a.slug)}">
    <img src="${a.thumbnail ? escapeHtml(a.thumbnail) : "/images/logo-tab.png"}" alt="">
    <div>
      <h3>${escapeHtml(a.title)}</h3>
      <div class="meta">📅 ${formatDateID(a.published_at)}</div>
    </div>
  </a>`;
}

export function renderArchiveBody(opts: {
  heading: string;
  subheading?: string;
  items: Article[];
  page: number;
  totalPages: number;
  baseUrl: string;
  emptyMessage?: string;
}): string {
  const pagination =
    opts.totalPages > 1
      ? `<div class="pagination">
        ${opts.page > 1 ? `<a href="${opts.baseUrl}?hal=${opts.page - 1}">← Sebelumnya</a>` : ""}
        <span class="active">${opts.page} / ${opts.totalPages}</span>
        ${opts.page < opts.totalPages ? `<a href="${opts.baseUrl}?hal=${opts.page + 1}">Berikutnya →</a>` : ""}
      </div>`
      : "";

  return `<section class="sect">
    <div class="wrap">
      <div style="margin-bottom:24px">
        <h1 style="font-size:1.7rem;font-weight:900;margin:0 0 6px">${escapeHtml(opts.heading)}</h1>
        ${opts.subheading ? `<p style="color:#64748b;margin:0">${escapeHtml(opts.subheading)}</p>` : ""}
      </div>
      ${opts.items.length ? `<div class="grid">${opts.items.map(renderCard).join("")}</div>` : `<p style="color:#94a3b8">${escapeHtml(opts.emptyMessage || "Belum ada artikel.")}</p>`}
      ${pagination}
    </div>
  </section>`;
}

export function renderVideoCard(a: Article): string {
  const id = youtubeId(a.video_url);
  const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : a.thumbnail;
  return `<a class="card" href="/berita/${encodeURIComponent(a.slug)}">
    <div class="thumb" style="background:#0f172a">
      ${thumb ? `<img src="${escapeHtml(thumb)}" alt="${escapeHtml(a.title)}" loading="lazy">` : ""}
      <span style="position:absolute;inset:0;display:grid;place-items:center;font-size:2.4rem;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.5)">▶️</span>
    </div>
    <div class="body">
      <div class="meta">📅 ${formatDateID(a.published_at)}</div>
      <h3>${escapeHtml(a.title)}</h3>
    </div>
  </a>`;
}
