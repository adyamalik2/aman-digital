<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AMAN Digital — Panduan Proyek

**Pemilik: Malik (Adya Malik), Blangpidie, Aceh Barat Daya.**
Bahasa kerja: **Bahasa Indonesia**, termasuk untuk komentar kode dan pesan commit.

Dokumen ini untuk siapa pun — manusia maupun AI — yang baru masuk ke proyek
ini. Tujuannya satu: **supaya Anda tidak "memperbaiki" sesuatu yang sebenarnya
sengaja dibuat begitu.**

Baca juga:
- `KEPUTUSAN.md` — keputusan bisnis & teknis beserta alasannya
- `STATUS.md` — apa yang sudah live, apa yang masih menunggu keputusan Malik

**Ketiga berkas ini wajib dirawat.** Lihat bagian terakhir dokumen ini.

---

## 1. Peta sistem

AMAN Digital bukan satu aplikasi, melainkan **satu situs + empat aplikasi
terpisah** yang masing-masing punya repo, deployment, dan Firebase sendiri.

### Situs utama — repo ini (`amandigital.my.id`)

Dua sistem render yang hidup berdampingan dalam satu repo. **Jangan
tertukar** — ini sumber kebingungan paling sering:

| | Halaman pemasaran | Portal berita "AMAN News" |
|---|---|---|
| Lokasi | `app/(marketing)/*/page.tsx` | `functions/berita*.ts` |
| Teknologi | Next.js 16 App Router, React 19, Tailwind v4 | HTML string builder murni (bukan JSX/React) |
| Render | **Statis** — `output: 'export'` saat build | **Per-request** di Cloudflare Pages Functions |
| Sumber data | Hardcode di file | Cloudflare D1 (`aman-blog`) |
| CSS | Tailwind | CSS sendiri di konstanta `STYLE` (`functions/_lib/newsRender.ts`) |
| Metadata | `lib/seo.ts` → `pageMeta()` | `renderShell()` di `newsRender.ts` |

Konsekuensinya: **kelas Tailwind tidak berlaku di portal berita.** Kalau
butuh utilitas seperti `.sr-only` di sana, harus ditulis manual di `STYLE`.

### Binding Cloudflare (lihat `wrangler.jsonc`)

| Binding | Jenis | Isi |
|---|---|---|
| `DB` | D1 | `aman-blog` — artikel, kategori, penulis, komentar, halaman statis, afiliasi |
| `AMAN_LEDGER` | KV | kode akses, ikatan perangkat, sesi admin, rate-limit |
| `MEDIA` | R2 | `aman-blog-media` — gambar unggahan newsroom |

### Empat aplikasi terpisah (repo lain)

| Aplikasi | Subdomain | Repo lokal |
|---|---|---|
| AMAN Kasir | `kasir.amandigital.my.id` | `WEB/aman-kasir` |
| AMAN Budget | `budget.amandigital.my.id` | `WEB/Aplikasi baru AMAN-budget` |
| AMAN Invoice | `invoice.amandigital.my.id` | `WEB/aman-Invoice1` |
| AMAN-in | `amanin.amandigital.my.id` | `WEB/Aplikasi baru Amanin/aman-in` |

Semuanya: Vite + React + **Capacitor 8** (APK Android), Firebase project
**masing-masing terpisah**. Halaman `/kasir`, `/budget`, `/invoice`, `/amanin`
di repo ini hanya **landing page pemasaran** — bukan aplikasinya.

---

## 2. Autentikasi — tiga sistem berbeda

Jangan disamakan, ketiganya independen:

1. **Panel admin** (`/admin/*`) — satu password bersama (`ADMIN_PASSWORD`),
   sesi disimpan di KV (`admsess:<token>`), bukan JWT. Digerbangi
   `functions/admin/**/_middleware.ts`.
2. **Tool berbayar** — kode akses per-pembeli, terikat perangkat.
   Gerbangnya `functions/{tool}/app/_middleware.ts` untuk `aman-engine`,
   `aman-content-engine`, `aman-poster`; dan
   `functions/produk-digital/katalog/_middleware.ts`.
3. **Aplikasi terpisah** — Firebase Auth, beda-beda per aplikasi
   (lihat AGENTS.md masing-masing repo).

---

## 3. Alur deploy

```
git push origin main  →  Cloudflare Pages build otomatis  →  live
```

Branch default `main` **adalah** mekanisme deploy. Jangan buat branch lain
untuk perubahan yang memang dimaksudkan tayang.

**Jangan commit/push tanpa diminta Malik.** Dia ingin meninjau dulu.

Artikel berita **tidak** perlu rebuild — dirender per-request dari D1, jadi
terbit lewat panel `/admin/berita` langsung tayang.

---

## 4. Aturan yang tidak boleh dilanggar

### Jangan pernah mengarang isi

Ini aturan paling penting di proyek ini. **Jangan membuat** harga, statistik,
testimoni, nama klien, metrik hasil, tanggal, NIB, alamat, atau klaim fitur
yang belum dikonfirmasi Malik. Kalau data tidak ada — **tanyakan, atau
kosongkan**, jangan diisi tebakan.

Berlaku juga untuk structured data: field JSON-LD yang datanya tidak ada
**tidak dikirim sama sekali**, bukan diisi nilai karangan. Schema berisi data
palsu lebih berbahaya daripada tidak ada schema.

Pernah terjadi: paragraf metode pembayaran di `/harga` menyebut transfer bank
dengan aktivasi 1×24 jam — ternyata jalur itu belum pernah ada. Sekarang
dihapus dan diberi `TODO(pemilik)`.

### Verifikasi ke produksi, bukan cuma baca kode

"Build sukses" ≠ "berfungsi". Sebelum menyatakan sesuatu beres, uji endpoint
sungguhan (`curl`/browser) ke situs live. Beberapa kelas bug di proyek ini
**hanya** ketahuan lewat cara ini:

- **HEAD vs GET** — `/berita` pernah 200 untuk GET tapi 404 untuk HEAD,
  bikin error merah di console tiap halaman yang menautkannya. Uji keduanya.
- **Cache edge** — `/blog` pernah membalas **200 berisi situs versi lama**
  selama berhari-hari setelah kodenya dihapus, bukan 404. Header `Age:` yang
  besar adalah petunjuknya.
- **Login berhasil ≠ tool jalan** — pernah login sukses tapi aplikasinya mati
  total karena error runtime di halaman berikutnya.

### Periksa hasil build, bukan hanya source

Kalau perubahan bergantung pada tree-shaking atau kondisi build, **buktikan di
bundle hasil build** — bukan berhenti di source. Contoh nyata: pemisahan build
owner di AMAN Budget diverifikasi dengan mencari string owner di seluruh
bundle tiap mode.

### Satu warna tidak bisa benar di dua latar

Token `--color-emerald` `#059669` **lolos kontras di latar gelap** (~5,1:1)
tapi **gagal di latar terang** (3,77:1). Cari-ganti massal akan memperbaiki
satu sisi sambil merusak sisi lain — ini pernah terjadi pada komponen `Mark`.

Sebelum mengubah warna teks: **periksa latarnya**, dan untuk komponen bersama
periksa **semua** tempat pemakaiannya.

| Latar | Token yang benar |
|---|---|
| Putih polos | `text-emerald-dark` `#047857` (5,48:1) |
| Bertint `bg-emerald/10` | `text-emerald-cta-hover` `#065f46` (5,86:1) |
| Gelap `#070B14` | `text-emerald` biarkan apa adanya |

### Alat ukur pun bisa salah

Skrip pengukur kontras **wajib mengomposit alpha** latar semi-transparan.
Versi naif membaca `rgba(5,150,105,0.1)` sebagai hijau pekat dan memberi
angka yang salah. Untuk area gelap (navbar `bg-[#070B14]/80` di atas body
tanpa background) skrip semacam ini tetap tidak andal — jangan percaya
laporan "gagal" massal darinya, ukur elemen yang diubah saja.

---

## 5. Jangan "perbaiki" ini — semuanya disengaja

| Yang terlihat seperti bug | Kenyataannya |
|---|---|
| Tombol "Pulihkan Akses Pro Pemilik" di AMAN Budget | **Sengaja.** APK pribadi Malik butuh Pro. Sudah dipisah lewat build mode — baca `AGENTS.md` repo Budget sebelum menyentuhnya. |
| Link "Masuk Newsroom" tampil ke pembaca umum di portal berita | Sengaja, biar Malik gampang masuk. Tujuannya tetap digerbangi login. |
| Warna AMAN-in ungu, tidak seperti emerald situs utama | Sengaja — identitas produk sendiri. |
| AMAN News memuat politik, olahraga, lifestyle | Sengaja — ini portal berita **umum**, bukan blog UMKM. |
| AMAN Kasir bisa dibuka tanpa login | Sengaja — offline-first, login opsional hanya untuk cloud backup. |
| Paket Dasar & Pro "Segera Hadir", tombolnya cuma "Daftar Minat" | Jujur apa adanya — jalur pembelian otomatisnya memang belum ada. |
| Digital Store ada di menu **Produk**, bukan Layanan | Keputusan bisnis. AMAN Digital punya **4 layanan**. |
| Halaman pemasaran punya array `services`/`apps` masing-masing | Memang terpisah per halaman, bukan satu sumber global. |

Kalau menurut Anda salah satu di atas tetap perlu diubah: **laporkan dengan
alasannya, jangan langsung ubah.**

---

## 6. Perintah yang sering dipakai

```bash
npm run dev          # dev server
npm run build        # static export ke out/
npm run lint         # eslint
npx tsc --noEmit -p functions/tsconfig.json    # typecheck Pages Functions

# D1 (SELECT aman; hati-hati dengan --remote untuk tulis)
npx wrangler d1 execute aman-blog --remote --command "SELECT ..."
npx wrangler d1 execute aman-blog --local  --command "SELECT ..."
```

**Catatan lint:** ada ~8 error pre-existing (`setState` di dalam effect pada
panel admin, dan satu `require()` import). Bukan akibat perubahan baru —
jangan perbaiki kalau tidak diminta, dan jangan pakai itu sebagai alasan
menggagalkan pekerjaan lain.

**Menguji portal berita secara lokal** butuh D1 lokal yang sudah berisi
skema — `wrangler pages dev` dan `wrangler d1 execute --local` bisa memakai
berkas SQLite berbeda, jadi seringkali lebih cepat menguji fungsi render
langsung (bundel `functions/_lib/newsRender.ts` dengan esbuild lalu panggil
`renderShell()` dari Node).

---

## 7. Kalau menyentuh repo aplikasi

Empat aplikasi punya APK yang **sudah terpasang dan dipakai Malik sehari-hari**.

Yang wajib dipahami:
- Keempatnya membundel aset web **di dalam** APK (`webDir: "dist"`, tanpa
  `server.url`). Tidak ada live-update, tidak ada Remote Config.
- **Deploy web tidak memengaruhi APK terpasang sama sekali.** Perubahan
  source baru berlaku kalau APK dibangun ulang dan dipasang.
- **Jangan** jalankan `adb`, `cap sync`, Gradle build, atau membuat APK
  tanpa diminta. Jangan sentuh keystore/signing.
- Jangan klaim perubahan source "sudah memperbarui aplikasi" — jelaskan
  bahwa itu baru berlaku setelah rebuild.

Tiap repo aplikasi punya `AGENTS.md` sendiri. **Baca dulu** — terutama
AMAN Budget.

---

## 8. Merawat dokumen ini — WAJIB

Dokumen yang basi lebih berbahaya daripada tidak ada dokumen, karena orang
telanjur memercayainya. Karena itu memperbarui ketiga berkas ini **bagian dari
pekerjaan**, bukan tambahan opsional — sama wajibnya dengan menjalankan lint.

Kalau Anda mengubah sesuatu yang masuk salah satu pemicu di bawah, perbarui
berkasnya **dalam commit yang sama**. Jangan ditunda "nanti".

### Kapan memperbarui yang mana

| Berkas | Perbarui ketika |
|---|---|
| **`STATUS.md`** | Sesuatu naik ke produksi · sesuatu selesai · muncul/selesai hal yang menunggu keputusan Malik · ditemukan utang teknis baru · ada temuan pre-existing yang perlu diketahui orang lain |
| **`KEPUTUSAN.md`** | Malik memutuskan sesuatu yang **tidak terlihat dari kode** · sebuah usulan ditolak beserta alasannya · keputusan lama berubah (jangan hapus yang lama — tandai dan tulis penggantinya) |
| **`AGENTS.md`** | Ditemukan jebakan/gotcha baru · arsitektur berubah · ada hal yang tampak seperti bug padahal disengaja · perintah atau alur kerja berubah |

### Cara menulis yang benar

- **Alasan lebih penting daripada keputusannya.** "Digital Store itu produk"
  akan diperdebatkan lagi; "Digital Store itu produk karena layanan
  dikerjakan untuk klien sedangkan ini barang jadi" tidak.
- **Verifikasi angkanya**, jangan mengarang. Jumlah rute dihitung dari berkas,
  jumlah artikel dari query D1, jumlah URL dari sitemap. Klaim "19 halaman"
  pernah ditulis di sini dan ternyata salah — yang benar 22.
- **Catat juga yang pre-existing**, supaya orang berikutnya tidak mengira
  dialah yang merusaknya.
- **Jangan hapus keputusan lama** yang sudah tidak berlaku. Tandai bahwa itu
  sudah digantikan, dan tulis kenapa berubah. Riwayat itu berguna.
- Perbarui tanggal "Diperbarui" di `STATUS.md`.

### Yang paling cepat basi

`STATUS.md`. Kalau isinya tidak cocok dengan kenyataan: **percayai produksi**,
lalu perbaiki berkasnya. Jangan diamkan.

### Kalau Anda AI yang baru masuk

Setelah membaca ketiganya, **konfirmasi dulu ke Malik** kalau ada yang terasa
sudah tidak akurat. Jangan langsung memperbaiki kode berdasarkan dokumen yang
mungkin sudah usang — dan jangan pula langsung mengubah dokumen berdasarkan
tebakan.
