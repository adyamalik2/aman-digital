/**
 * Cloudflare Worker — pengganti GitHub Actions "Rebuild blog (jadwal otomatis)".
 *
 * Tugasnya sama persis dengan workflow lama: memicu Cloudflare Pages deploy hook
 * secara berkala (lihat jadwal cron di wrangler.toml) supaya artikel baru di
 * Notion otomatis tayang — tanpa GitHub Actions, jadi tidak terpengaruh masalah
 * billing GitHub.
 *
 * Secret yang dibutuhkan:
 *   DEPLOY_HOOK   (WAJIB)    URL deploy hook Cloudflare Pages
 *   MANUAL_TOKEN  (opsional) token untuk memicu rebuild manual lewat HTTP
 *
 * Set dengan:
 *   npx wrangler secret put DEPLOY_HOOK
 *   npx wrangler secret put MANUAL_TOKEN   # opsional
 */

/** Memicu satu kali rebuild via deploy hook. Throw kalau gagal. */
async function triggerRebuild(env) {
  const hook = env.DEPLOY_HOOK;
  if (!hook) {
    throw new Error(
      "Secret DEPLOY_HOOK belum di-set. Jalankan: npx wrangler secret put DEPLOY_HOOK"
    );
  }
  const res = await fetch(hook, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Deploy hook gagal: ${res.status} ${res.statusText}`);
  }
  return res;
}

export default {
  // Dipanggil otomatis oleh Cron Trigger (jadwal ada di wrangler.toml).
  async scheduled(event, env, ctx) {
    try {
      await triggerRebuild(env);
      console.log(
        `[${new Date().toISOString()}] Deploy hook terpicu — Cloudflare Pages akan rebuild.`
      );
    } catch (err) {
      // throw ulang supaya invocation ditandai gagal dan muncul di Workers Logs.
      console.error(err.message);
      throw err;
    }
  },

  // Opsional: pemicu manual lewat HTTP (pengganti tombol "Run workflow").
  // Aktif HANYA bila secret MANUAL_TOKEN di-set. Cara pakai:
  //   curl -X POST "https://<nama-worker>.<subdomain>.workers.dev/?token=ISI_TOKEN"
  async fetch(request, env, ctx) {
    if (!env.MANUAL_TOKEN) {
      return new Response(
        "Worker rebuild blog aktif. Rebuild otomatis berjalan via cron.\n" +
          "Pemicu manual nonaktif (set secret MANUAL_TOKEN untuk mengaktifkan).\n",
        { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }

    const url = new URL(request.url);
    const token =
      url.searchParams.get("token") ||
      (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");

    if (request.method !== "POST" || token !== env.MANUAL_TOKEN) {
      return new Response("Forbidden. Gunakan: POST /?token=...\n", {
        status: 403,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    try {
      await triggerRebuild(env);
      return new Response(
        "OK — deploy hook terpicu. Situs akan rebuild ~1-2 menit.\n",
        { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    } catch (err) {
      return new Response(`Gagal: ${err.message}\n`, {
        status: 502,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  },
};
