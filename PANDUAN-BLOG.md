# Panduan Kelola Blog AMAN Digital

Blog ini mengambil isi dari **Notion** dan ditampilkan di situs lewat **Cloudflare Pages**.
Situsnya *static* (di-build sekali), jadi **artikel baru di Notion TIDAK langsung muncul** —
harus di-*rebuild* dulu. Ikuti 2 langkah di bawah.

---

## Langkah 1 — Tulis artikel di Notion

Buka database blog di Notion, tambah **page/baris baru**, lalu isi propertinya:

| Properti      | Wajib | Catatan |
|---------------|:----:|---------|
| **Title**     | ✅ | Judul artikel. |
| **Slug**      | ✅ | Jadi URL: `/blog/slug-anda`. Pakai **huruf kecil + strip**, tanpa spasi. Contoh: `tips-kelola-stok`. Harus unik. |
| **Published** | ✅ | **Centang ✔**. Kalau tidak dicentang, artikel tidak akan tampil. |
| **Date**      | ✅ | Tanggal terbit (dipakai untuk urutan, terbaru di atas). |
| **Category**  | ✅ | Pilih salah satu agar warna label pas: `Tips UMKM`, `Tutorial`, `Update Produk`, `Berita`, `Umum`. |
| **Summary**   | optional | Ringkasan singkat (tampil di kartu blog & di bawah judul artikel). |
| **Cover**     | optional | URL gambar sampul. |

Isi badan artikel seperti menulis biasa di Notion: heading, **bold**, list, gambar,
kutipan, dan blok kode semuanya didukung.

> **Catatan slug:** kalau Slug dikosongkan, sistem memakai ID page Notion sebagai URL
> (jelek & sulit dibaca). Selalu isi Slug.

---

## Langkah 2 — Rebuild situs agar artikel muncul

Pilih salah satu cara:

### Cara A — Lewat dashboard (paling mudah)
1. Buka **dash.cloudflare.com** → **Workers & Pages** → pilih project blog.
2. Tab **Deployments** → klik **Create deployment** (atau **Retry deployment**).
3. Tunggu ±1–2 menit. Buka `https://amandigital.my.id/blog` → artikel baru muncul.
   (Kalau belum berubah, tekan **Ctrl + F5** untuk buang cache browser.)

### Cara B — Deploy Hook (tombol publish 1-klik, sekali setup)
Setup sekali, lalu cukup buka 1 URL tiap mau publish — tanpa buka dashboard.

**Setup (sekali saja):**
1. Cloudflare Pages → project → **Settings** → **Builds & deployments**.
2. Bagian **Deploy hooks** → **Add deploy hook**.
   - Hook name: `Publish Blog`
   - Branch: `main`
3. **Save** → salin **URL** yang muncul (rahasia, jangan disebar).

**Cara pakai (tiap habis nulis artikel):**
> ⚠️ Deploy hook HARUS dipanggil dengan metode **POST**. Membuka URL-nya langsung di
> browser (itu GET) akan error `method_not_allowed` — bukan rusak, cuma salah metode.

- **PowerShell** (buka PowerShell, paste, Enter):
  ```powershell
  Invoke-RestMethod -Method Post -Uri "URL_DEPLOY_HOOK_ANDA"
  ```
- **atau Git Bash / curl:**
  ```bash
  curl -X POST "URL_DEPLOY_HOOK_ANDA"
  ```
- Sukses → respons `{"success": true, ...}`. Situs rebuild ±1–2 menit → artikel muncul.

**Lebih praktis (double-click):** lihat file `publish-blog.bat` di project ini — klik 2x
untuk publish tanpa buka terminal. (File itu berisi URL rahasia, jangan di-commit/ disebar.)

> Simpan URL deploy hook di tempat aman (mis. catatan pribadi). Siapa pun yang
> punya URL ini bisa memicu rebuild situs Anda.

---

## Mengedit / menghapus artikel
- **Edit:** ubah isi/properti di Notion → **rebuild** (Langkah 2).
- **Sembunyikan/hapus dari situs:** hilangkan centang **Published** di Notion → **rebuild**.
  Artikel akan hilang dari situs (data di Notion tetap aman).

---

## Kenapa harus rebuild? (penjelasan singkat)
Situs ini memakai **static export** (`output: 'export'`) demi cepat & murah.
Artinya isi blog "dibekukan" jadi file HTML saat proses build. Notion hanya dibaca
**pada saat build**, bukan saat pengunjung membuka halaman. Jadi setiap ada perubahan
konten, perlu build ulang agar file HTML-nya diperbarui.

---

## Catatan teknis (untuk developer)
- Kode integrasi Notion: `lib/notion.ts` (pakai `@notionhq/client` v5 → `dataSources.query`).
- Halaman: `app/(marketing)/blog/page.tsx` (daftar) & `app/(marketing)/blog/[slug]/page.tsx` (detail).
- Env var **wajib ada di Cloudflare Pages** (Settings → Variables and Secrets, Production + Preview):
  - `NOTION_API_KEY` (secret)
  - `NOTION_BLOG_DATABASE_ID`
  - Tanpa ini build blog gagal 401. File `.env.local` lokal sengaja tidak ikut ke GitHub.
- Build lokal: `npm run build` → hasil di folder `out/`.
