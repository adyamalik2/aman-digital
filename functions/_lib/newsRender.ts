/**
 * newsRender.ts — bungkus HTML & komponen kartu untuk portal berita.
 * Dirender per-permintaan oleh Pages Function (bukan Next.js), sama seperti
 * pola functions/berita.ts sebelumnya -- CSS ditulis inline & mandiri.
 */
import { escapeHtml, formatDateID, youtubeId, type AffiliateItem, type Article, type Category } from "./news";

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
  .topbar { display: flex; align-items: center; justify-content: space-between; height: 68px; gap: 10px; }
  .brand { display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 900; font-size: 1.1rem; flex-shrink: 0; white-space: nowrap; }
  .brand img { height: 32px; width: auto; border-radius: 7px; flex-shrink: 0; }
  .navcats-wrap { position: relative; }
  .navcats { display: flex; gap: 4px; overflow-x: auto; padding: 0 24px 12px 0; scrollbar-width: none; }
  .navcats::-webkit-scrollbar { display: none; }
  .navcats a { color: #cbd5e1; font-size: .84rem; font-weight: 700; padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
  .navcats a:hover, .navcats a.active { background: rgba(16,185,129,.18); color: #6ee7b7; }
  /* Versi pertama memakai stop warna PEKAT di 65% (#070B14 solid), jadi ~10px
     terakhir bukan memudar tapi padam total -- kategori di ujung hilang sama
     sekali dan justru lebih tidak informatif daripada terpotong tengah kata.
     Sekarang alfanya tidak pernah mencapai 1 di area yang masih ada teksnya,
     jadi kategori berikutnya tetap terbaca samar. Sisi kanannya sengaja 2px
     lewat tepi konten untuk menutup seam 1px di batasnya. */
  .navcats-fade { position: absolute; top: 0; right: 14px; bottom: 12px; width: 36px; background: linear-gradient(to right, rgba(7,11,20,0), rgba(7,11,20,.85)); pointer-events: none; transition: opacity .18s ease; }
  .navcats-wrap.at-end .navcats-fade { opacity: 0; }
  .search-box { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
  .search-box input { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); border-radius: 999px; padding: 8px 14px; color: #fff; font-size: .84rem; width: 200px; min-width: 0; flex: 1; }
  .search-box input::placeholder { color: #64748b; }
  .search-box button { background: #059669; border: 0; color: #fff; border-radius: 999px; padding: 8px 14px; font-size: .8rem; font-weight: 700; cursor: pointer; flex-shrink: 0; }
  @media (max-width: 480px) { .brand .brand-text { display: none; } }

  .cat-badge { display: inline-block; font-size: .68rem; font-weight: 800; padding: 4px 11px; border-radius: 999px; text-transform: uppercase; letter-spacing: .02em; }

  .hero { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
  @media (max-width: 860px) { .hero { grid-template-columns: 1fr; } }
  .hero-slide { position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 16/10; background: #0f172a; }
  .hero-slide img { width: 100%; height: 100%; object-fit: cover; }
  .hero-slide .ov { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,.88), rgba(0,0,0,.18) 85%), linear-gradient(rgba(0,0,0,.22), rgba(0,0,0,.22)); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; }
  /* .ov adalah flex column: tanpa ini badge ikut di-stretch selebar slide
     (295px dari 375px) -- baru kelihatan mencolok sejak latarnya jadi pekat. */
  .hero-slide .ov .cat-badge { align-self: flex-start; }
  .hero-slide h2 { color: #fff; font-size: 1.4rem; font-weight: 800; line-height: 1.3; margin: 10px 0 6px; text-shadow: 0 1px 3px rgba(0,0,0,.6); }
  .hero-slide .meta { color: #e2e8f0; font-size: .78rem; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
  .hero-side { display: flex; flex-direction: column; gap: 14px; }
  .hero-mini { display: flex; gap: 12px; background: #fff; border-radius: 12px; padding: 10px; border: 1px solid #e2e8f0; }
  .hero-mini img { width: 88px; height: 66px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  .hero-mini h3 { font-size: .88rem; font-weight: 700; line-height: 1.35; margin: 0 0 4px; }
  .hero-mini .meta { color: #475569; font-size: .72rem; }

  .headline { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center; background: #fff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; }
  @media (max-width: 760px) { .headline { grid-template-columns: 1fr; } }
  .headline img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: 4/3; }
  .headline-body { padding: 24px 28px 24px 0; }
  @media (max-width: 760px) { .headline-body { padding: 0 20px 24px; } }
  .headline-body h2 { font-size: 1.5rem; font-weight: 800; line-height: 1.3; margin: 10px 0; }
  .headline-body p { color: #64748b; line-height: 1.7; margin: 0 0 12px; }
  .headline-body .meta { color: #475569; font-size: .8rem; }

  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; }
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: box-shadow .2s, transform .2s; }
  .card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.08); transform: translateY(-2px); }
  .card .thumb { position: relative; aspect-ratio: 16/10; background: #ecfdf5; }
  .card .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .card .thumb .cat-badge { position: absolute; top: 10px; left: 10px; background: rgba(15,23,42,.75); color: #fff; }
  .card .body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
  .card h3 { font-size: 1rem; font-weight: 700; line-height: 1.4; margin: 0 0 8px; }
  .card .meta { color: #475569; font-size: .75rem; margin-bottom: 8px; }
  .card p { color: #64748b; font-size: .85rem; line-height: 1.6; margin: 0; flex: 1; }

  .list-row { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
  .list-row:last-child { border-bottom: 0; }
  .list-row .num { font-size: 1.6rem; font-weight: 900; color: #64748b; width: 34px; flex-shrink: 0; }
  .list-row img { width: 76px; height: 58px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  .list-row h4 { font-size: .88rem; font-weight: 700; line-height: 1.4; margin: 0 0 4px; }
  .list-row .meta { color: #475569; font-size: .72rem; }

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

  .aff-sect { background: #fffbeb; border: 1px solid #fde68a; border-radius: 16px; padding: 20px; }
  .aff-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
  .aff-head h2 { margin: 0; font-size: .95rem; font-weight: 800; color: #92400e; }
  .aff-badge { font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .03em; background: #b45309; color: #fff; padding: 3px 10px; border-radius: 999px; }
  .aff-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; }
  .aff-item { background: #fff; border: 1px solid #fde68a; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
  .aff-item .thumb { aspect-ratio: 1/1; background: #fef3c7; display: grid; place-items: center; }
  .aff-item .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .aff-item .body { padding: 10px; }
  .aff-item .merchant { display: block; font-size: .68rem; color: #b45309; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
  .aff-item .aff-title { display: block; font-size: .82rem; font-weight: 600; color: #1e293b; line-height: 1.3; margin-bottom: 4px; }
  .aff-item .price { display: block; font-size: .85rem; font-weight: 800; color: #b45309; }
  .aff-item .note { display: block; font-size: .7rem; color: #94a3b8; margin-top: 2px; }
  .aff-disc { margin: 14px 0 0; font-size: .72rem; color: #92400e; opacity: .8; }
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
    <a class="brand" href="/berita"><img src="/images/logo-header.webp" alt=""><span class="brand-text">AMAN NEWS</span></a>
    <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;justify-content:flex-end">
      <form class="search-box" action="/berita/cari" method="get">
        <input type="text" name="q" placeholder="Cari berita…">
        <button type="submit">🔍</button>
      </form>
      <a href="/admin/berita" title="Masuk Newsroom (redaksi)" style="display:grid;place-items:center;width:38px;height:38px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#cbd5e1;flex-shrink:0" aria-label="Masuk Newsroom">📰</a>
    </div>
  </div>
  <div class="wrap navcats-wrap">
    <div class="navcats">
      <a href="/berita" class="${!opts.activeCategory ? "active" : ""}">Beranda</a>
      ${navLinks}
    </div>
    <div class="navcats-fade" aria-hidden="true"></div>
  </div>
  <script>
    (function(){
      var wrap = document.querySelector('.navcats-wrap');
      var bar = wrap && wrap.querySelector('.navcats');
      if (!wrap || !bar) return;
      // Sembunyikan gradien saat sudah mentok kanan ATAU saat semua kategori
      // memang muat (desktop) -- isyarat "masih ada lagi" harus jujur.
      function sync(){
        var atEnd = bar.scrollLeft + bar.clientWidth >= bar.scrollWidth - 2;
        wrap.classList.toggle('at-end', atEnd);
      }
      sync();
      bar.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
    })();
  </script>
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

/**
 * Badge kategori dulu memakai warna kategori sebagai teks di atas latar warna
 * yang sama pada 13% opasitas (`${color}22`). Kombinasi itu tidak pernah lolos
 * WCAG AA untuk teks kecil: rasionya jatuh di 2,58-4,67 (terburuk OLAHRAGA
 * #ca8a04 = 2,58) padahal teks 10,9px butuh 4,5.
 *
 * Sekarang latarnya memakai warna kategori itu sendiri -- digelapkan bertahap
 * hanya bila perlu -- dengan teks putih. Hue kategori tetap terjaga sehingga
 * badge masih mudah dibedakan, tapi semua kategori sekarang >= 4,6:1.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) h = "059669";
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function relLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Rasio kontras warna ini terhadap teks putih. */
function contrastWithWhite(c: { r: number; g: number; b: number }): number {
  return 1.05 / (relLuminance(c) + 0.05);
}

/** Gelapkan warna bertahap sampai teks putih di atasnya lolos ambang AA. */
function darkenUntilAA(hex: string, target = 4.6): string {
  let c = hexToRgb(hex);
  let guard = 0;
  while (contrastWithWhite(c) < target && guard++ < 40) {
    c = { r: c.r * 0.93, g: c.g * 0.93, b: c.b * 0.93 };
  }
  return rgbToHex(c);
}

export function catStyle(color: string): string {
  const base = color && color.trim() ? color : "#059669";
  return `background:${darkenUntilAA(base)};color:#fff`;
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
      ${a.category_name ? `<span class="cat-badge" style="${catStyle(a.category_color || "")}">${escapeHtml(a.category_name)}</span>` : ""}
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

/**
 * Widget "Belanja Pilihan" -- produk afiliasi. Port dari news_affiliate_widget()
 * (berita/inc/layout.php): badge "Bersponsor" wajib tampil, tautan lewat
 * /berita/go (penghitung klik) dengan rel="nofollow sponsored", label
 * pengungkapan opsional dari pengaturan. Kosong = tidak dirender sama sekali
 * (dipanggil hanya kalau items.length > 0 -- lihat pemanggil).
 */
export function renderAffiliateWidget(items: AffiliateItem[], title: string, disclosure: string): string {
  if (!items.length) return "";
  const cards = items
    .map((it) => {
      const merchant = /^(rp\s*)?[\d][\d.,]*\s*(rb|jt|k)?$/i.test(it.merchant.trim()) ? "" : it.merchant;
      return `<a class="aff-item" href="/berita/go?id=${it.id}" target="_blank" rel="nofollow sponsored noopener">
        <div class="thumb">${it.image ? `<img src="${escapeHtml(it.image)}" alt="" loading="lazy">` : `<span style="font-size:1.6rem">🏷️</span>`}</div>
        <div class="body">
          ${merchant ? `<span class="merchant">${escapeHtml(merchant)}</span>` : ""}
          <span class="aff-title">${escapeHtml(it.title)}</span>
          ${it.price_text ? `<span class="price">${escapeHtml(it.price_text)}</span>` : ""}
          ${it.note ? `<span class="note">${escapeHtml(it.note)}</span>` : ""}
        </div>
      </a>`;
    })
    .join("");

  return `<section class="aff-sect">
    <div class="aff-head"><h2>🏷️ ${escapeHtml(title)}</h2><span class="aff-badge">Bersponsor</span></div>
    <div class="aff-list">${cards}</div>
    ${disclosure ? `<p class="aff-disc">${escapeHtml(disclosure)}</p>` : ""}
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
