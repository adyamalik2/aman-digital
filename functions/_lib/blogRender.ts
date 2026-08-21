/**
 * blogRender.ts — bungkus HTML untuk halaman blog yang dirender Pages
 * Function (bukan Next.js). CSS ditulis inline & mandiri (bukan Tailwind
 * hasil build Next) supaya tidak tergantung nama file CSS ber-hash yang
 * berubah tiap deploy -- pola yang sama seperti public/aman-engine-app/.
 */
import { escapeHtml } from "./blog";

const BASE_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Inter', system-ui, -apple-system, Segoe UI, sans-serif; background: #F8FAFC; color: #0f172a; }
  a { color: inherit; }
  .wrap { max-width: 1120px; margin: 0 auto; padding: 0 16px; }
  header.site { background: #070B14; border-bottom: 1px solid rgba(255,255,255,.08); }
  header.site .bar { display: flex; align-items: center; justify-content: space-between; height: 72px; }
  header.site .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; font-weight: 900; }
  header.site .brand img { height: 34px; width: auto; border-radius: 8px; }
  header.site nav a { color: #cbd5e1; text-decoration: none; font-size: .9rem; font-weight: 600; margin-left: 22px; }
  header.site nav a:hover { color: #34d399; }
  footer.site { background: #070B14; color: #94a3b8; text-align: center; padding: 28px 16px; font-size: .85rem; margin-top: 60px; }
  footer.site a { color: #34d399; text-decoration: none; }
`;

export function renderPage(opts: { title: string; description: string; body: string; noindex?: boolean }): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(opts.title)}</title>
<meta name="description" content="${escapeHtml(opts.description)}">
${opts.noindex ? '<meta name="robots" content="noindex, follow">' : ""}
<link rel="icon" type="image/png" href="/images/logo-tab.png">
<style>${BASE_STYLE}</style>
</head>
<body>
<header class="site">
  <div class="wrap bar">
    <a class="brand" href="/">
      <img src="/images/logo-header.webp" alt="AMAN Digital">
      AMAN DIGITAL
    </a>
    <nav>
      <a href="/">Beranda</a>
      <a href="/blog">Blog</a>
    </nav>
  </div>
</header>
${opts.body}
<footer class="site">
  &copy; 2026 AMAN Digital &middot; <a href="https://wa.me/6282210768038" target="_blank" rel="noopener noreferrer">WhatsApp</a>
</footer>
</body>
</html>`;
}
