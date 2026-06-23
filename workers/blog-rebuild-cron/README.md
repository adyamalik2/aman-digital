# Worker: rebuild blog otomatis (cron)

Pengganti GitHub Actions `.github/workflows/rebuild-blog.yml`. Worker ini memicu
**Cloudflare Pages deploy hook** setiap 30 menit supaya artikel baru di Notion
otomatis tayang — semuanya di Cloudflare, **tidak terpengaruh billing GitHub**.

Gratis: Cron Triggers tersedia di Workers Free plan.

---

## Sekali setup

Semua perintah dijalankan dari folder ini:

```bash
cd workers/blog-rebuild-cron
```

### 1. Install dependency

```bash
npm install
```

### 2. Login ke Cloudflare

```bash
npx wrangler login
```

Browser akan terbuka — izinkan akses. (Alternatif tanpa browser: pakai
`CLOUDFLARE_API_TOKEN`, lihat dokumen Wrangler.)

### 3. Siapkan URL deploy hook

Kamu bisa **memakai ulang** deploy hook yang sudah ada (yang dulu disimpan di
GitHub secret `CLOUDFLARE_DEPLOY_HOOK`). Kalau lupa / belum punya, buat baru:

Cloudflare Dashboard → **Workers & Pages** → pilih project Pages situsmu →
**Settings** → **Builds & deployments** → **Deploy hooks** → **Add deploy hook**
→ beri nama (mis. `cron-rebuild`), pilih branch `main` → **Save**. Salin URL-nya
(berbentuk `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...`).

### 4. Simpan URL itu sebagai secret (JANGAN ditaruh di file)

```bash
npx wrangler secret put DEPLOY_HOOK
```

Tempel URL deploy hook saat diminta, lalu Enter.

### 5. Deploy

```bash
npx wrangler deploy
```

Selesai. Worker langsung aktif dan cron mulai jalan sesuai jadwal.

---

## Verifikasi

- Dashboard → **Workers & Pages** → `aman-digital-blog-rebuild` → tab
  **Triggers** → harus ada Cron `*/30 * * * *`.
- Lihat log real-time:

  ```bash
  npx wrangler tail
  ```

  atau dashboard → worker → **Logs**. Saat cron jalan akan muncul
  `Deploy hook terpicu — Cloudflare Pages akan rebuild.`
- Cek tab **Deployments** di project Pages-mu: harusnya ada build baru tiap ~30 menit.

## Tes cepat tanpa menunggu 30 menit

Jalankan handler `scheduled` secara lokal:

```bash
npx wrangler dev --test-scheduled
# lalu di terminal lain:
curl "http://localhost:8787/__scheduled?cron=*/30+*+*+*+*"
```

> Saat `wrangler dev`, secret produksi tidak ikut. Untuk tes lokal yang benar-benar
> memicu hook, buat file `.dev.vars` berisi `DEPLOY_HOOK=...` (file ini sudah
> di-`.gitignore`). Atau cukup tunggu cron pertama di produksi.

## Pemicu manual (opsional, pengganti tombol "Run workflow")

Aktif hanya bila kamu set token:

```bash
npx wrangler secret put MANUAL_TOKEN     # isi token rahasia bebas
npx wrangler deploy
```

Lalu picu kapan saja:

```bash
curl -X POST "https://aman-digital-blog-rebuild.<subdomain>.workers.dev/?token=TOKEN_KAMU"
```

Tanpa `MANUAL_TOKEN`, endpoint manual nonaktif (aman dari penyalahgunaan); rebuild
otomatis lewat cron tetap jalan.

---

## Setelah Worker terbukti jalan: pensiunkan workflow GitHub

Supaya tidak ada job GitHub yang terus gagal:

```bash
git rm .github/workflows/rebuild-blog.yml
git commit -m "chore: ganti rebuild blog ke Cloudflare Worker cron"
```

(Atau minta Claude melakukannya.)

## Mengubah frekuensi

Edit `crons` di `wrangler.toml`, lalu `npx wrangler deploy`:

- `"*/30 * * * *"` — tiap 30 menit (default)
- `"0 * * * *"` — tiap 1 jam
- `"0 */6 * * *"` — tiap 6 jam
