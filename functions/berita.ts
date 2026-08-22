import {
  getAffiliateItems,
  getArticlesCount,
  getBreaking,
  getCategories,
  getHeadline,
  getLatest,
  getPopularWeek,
  getRelated,
  getSettings,
  getSlider,
  getTrending,
  getVideos,
  promoteScheduledArticles,
} from "./_lib/news";
import { renderAffiliateWidget, renderCard, renderHeroMini, renderHeroSlide, renderListRow, renderShell, renderVideoCard, sectionTitle } from "./_lib/newsRender";

interface Env {
  DB: D1Database;
  AMAN_LEDGER: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  try {
    await promoteScheduledArticles(db, context.env.AMAN_LEDGER);
  } catch {
    // best-effort
  }
  const url = new URL(context.request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("hal") || "1", 10) || 1);
  const perPage = 10;

  const [settings, categories, breaking] = await Promise.all([getSettings(db), getCategories(db), getBreaking(db, 8)]);

  const slider = await getSlider(db, 5);
  const sliderIds = slider.map((s) => s.id);
  const headline = await getHeadline(db, sliderIds);
  const related = headline ? await getRelated(db, headline, 4, sliderIds) : [];

  const totalLatest = await getArticlesCount(db);
  const totalPages = Math.max(1, Math.ceil(totalLatest / perPage));
  const curPage = Math.min(page, totalPages);
  const latest = await getLatest(db, perPage, (curPage - 1) * perPage);

  const trending = await getTrending(db, 6);
  const popular = await getPopularWeek(db, 6);
  const videos = await getVideos(db, 3);
  const affItems = await getAffiliateItems(db, 4);

  let heroHtml = "";
  if (slider.length) {
    const slides = slider.map((s, i) => renderHeroSlide(s, i === 0)).join("");
    const sideItems = slider.slice(1, 5).map(renderHeroMini).join("");
    heroHtml = `<section class="sect">
      <div class="wrap hero">
        <div style="position:relative">${slides}
          ${slider.length > 1 ? `<div style="display:flex;gap:6px;justify-content:center;margin-top:10px" data-dots>${slider.map((_, i) => `<button data-dot="${i}" style="width:${i === 0 ? "22px" : "8px"};height:8px;border-radius:4px;border:0;background:${i === 0 ? "#059669" : "#cbd5e1"};cursor:pointer"></button>`).join("")}</div>` : ""}
        </div>
        <div class="hero-side">${sideItems}</div>
      </div>
    </section>
    <script>
      (function(){
        var slides = document.querySelectorAll('[data-slide]');
        var dots = document.querySelectorAll('[data-dot]');
        if (slides.length < 2) return;
        var i = 0;
        function show(n){ slides.forEach(function(s,idx){ s.style.display = idx===n ? '' : 'none'; }); dots.forEach(function(d,idx){ d.style.width = idx===n?'22px':'8px'; d.style.background = idx===n?'#059669':'#cbd5e1'; }); i = n; }
        dots.forEach(function(d,idx){ d.addEventListener('click', function(){ show(idx); }); });
        setInterval(function(){ show((i+1) % slides.length); }, 6000);
      })();
    </script>`;
  }

  let headlineHtml = "";
  if (headline) {
    headlineHtml = `<section class="sect">
      <div class="wrap">
        ${sectionTitle("Headline")}
        <article class="headline">
          <a href="/berita/${headline.slug}">${headline.thumbnail ? `<img src="${headline.thumbnail}" alt="${headline.title}">` : ""}</a>
          <div class="headline-body">
            ${headline.category_name ? `<span class="cat-badge" style="background:${headline.category_color || "#059669"}22;color:${headline.category_color || "#059669"}">${headline.category_name}</span>` : ""}
            <h2><a href="/berita/${headline.slug}">${headline.title}</a></h2>
            ${headline.excerpt ? `<p>${headline.excerpt}</p>` : ""}
            <div class="meta">📅 ${headline.published_at ? headline.published_at.slice(0, 10) : ""} &middot; ${headline.reading_minutes} menit baca</div>
          </div>
        </article>
        ${related.length ? `<div class="grid" style="margin-top:20px">${related.map(renderCard).join("")}</div>` : ""}
      </div>
    </section>`;
  }

  const paginationHtml =
    totalPages > 1
      ? `<div class="pagination">
        ${curPage > 1 ? `<a href="/berita?hal=${curPage - 1}">← Sebelumnya</a>` : ""}
        <span class="active">${curPage} / ${totalPages}</span>
        ${curPage < totalPages ? `<a href="/berita?hal=${curPage + 1}">Berikutnya →</a>` : ""}
      </div>`
      : "";

  const latestSection = `<div class="layout2">
    <div>
      ${sectionTitle("Berita Terbaru")}
      ${latest.length ? `<div class="grid">${latest.map(renderCard).join("")}</div>` : `<p style="color:#94a3b8">Belum ada artikel.</p>`}
      ${paginationHtml}
    </div>
    <div>
      ${trending.length ? `<div class="side-card"><h3>🔥 Trending Hari Ini</h3>${trending.map((a, i) => renderListRow(a, i + 1)).join("")}</div>` : ""}
      ${popular.length ? `<div class="side-card"><h3>⭐ Populer Minggu Ini</h3>${popular.map((a, i) => renderListRow(a, i + 1)).join("")}</div>` : ""}
      ${categories.length ? `<div class="side-card"><h3>📂 Kategori</h3><div style="display:flex;flex-wrap:wrap;gap:8px">${categories.map((c) => `<a href="/berita/kategori/${c.slug}" class="cat-badge" style="background:${c.color}22;color:${c.color}">${c.name}</a>`).join("")}</div></div>` : ""}
    </div>
  </div>`;

  const videoSection = videos.length
    ? `<section class="sect">
      <div class="wrap">
        ${sectionTitle("Video")}
        <div class="grid">${videos.map(renderVideoCard).join("")}</div>
      </div>
    </section>`
    : "";

  const affHtml = affItems.length
    ? `<section class="sect" style="padding-top:0"><div class="wrap">${renderAffiliateWidget(affItems, settings.affiliate_title || "Belanja Pilihan", settings.affiliate_disclosure || "")}</div></section>`
    : "";

  const body = `
  ${heroHtml}
  ${headlineHtml}
  <section class="sect"><div class="wrap">${latestSection}</div></section>
  ${affHtml}
  ${videoSection}`;

  const html = renderShell({
    title: curPage > 1 ? `${settings.site_name || "AMAN News"} — Halaman ${curPage}` : `${settings.site_name || "AMAN News"} — ${settings.site_tagline || "Berita & Informasi Terkini"}`,
    description: settings.site_description || "",
    body,
    categories,
    breaking,
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
