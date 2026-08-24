# AMAN Digital

Situs dan platform **AMAN Digital** — partner digital untuk UMKM, toko, dan
kantor kecil. Berbasis di Blangpidie, Aceh Barat Daya.

Live: **https://amandigital.my.id**

---

## Isi repo ini

Satu repo, **dua sistem render** yang hidup berdampingan:

| | Halaman pemasaran | Portal berita "AMAN News" |
|---|---|---|
| Rute | `/`, `/harga`, `/kasir`, … (22 rute) | `/berita/**` |
| Lokasi | `app/(marketing)/` | `functions/berita*.ts` |
| Teknologi | Next.js 16 App Router (`output: 'export'`) | Cloudflare Pages Functions + D1 |
| Render | statis saat build | per-request |

Plus **panel admin** (`/admin`) dan **4 tool berbayar** dengan gerbang kode
akses (AMAN Engine, Content Engine, Poster Generator, Produk Digital).

Empat aplikasi lain — **AMAN Kasir, Budget, Invoice, AMAN-in** — ada di repo
terpisah dan tayang di subdomain masing-masing. Halaman `/kasir`, `/budget`,
`/invoice`, `/amanin` di repo ini hanya landing page pemasarannya.

---

## Menjalankan secara lokal

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # static export ke out/
npm run lint
npx tsc --noEmit -p functions/tsconfig.json    # typecheck Pages Functions
```

Halaman pemasaran jalan penuh dengan `npm run dev`. **Portal berita tidak** —
bagian itu butuh Cloudflare Pages Functions beserta binding D1/KV/R2.

---

## Deploy

```
git push origin main  →  Cloudflare Pages build otomatis  →  live
```

Artikel berita **tidak** perlu rebuild — dirender per-request dari D1, jadi
terbit lewat panel `/admin/berita` langsung tayang.

---

## Dokumentasi

Sebelum mengubah apa pun, baca:

| Berkas | Isi |
|---|---|
| **`AGENTS.md`** | Arsitektur, aturan kerja, dan daftar hal yang **sengaja** dibuat begitu — jangan "diperbaiki" |
| **`KEPUTUSAN.md`** | Keputusan bisnis & teknis beserta alasannya |
| **`STATUS.md`** | Apa yang sudah live, apa yang menunggu keputusan pemilik |

Repo aplikasi juga punya `AGENTS.md` masing-masing — **terutama AMAN Budget**,
yang memuat aturan penting soal pemisahan build owner/pelanggan.
