# Dokumen Legal — status DRAF

> **Berkas di folder ini BELUM diterbitkan ke situs.** Semuanya masih draf
> yang menunggu tinjauan dan persetujuan Malik.

## Kenapa ada folder ini

Per 24-08-2026 situs AMAN Digital mengumpulkan data (nama & email lewat form
komentar, cookie kode akses, penghitung baca) **tanpa kebijakan privasi sama
sekali**. Tiga halaman legal di portal berita juga masih berisi placeholder
"Halaman ini akan diisi lebih lanjut oleh redaksi."

## Isi folder

| Berkas | Status |
|---|---|
| `kebijakan-privasi.md` | Draf cukup lengkap — isinya fakta teknis yang sudah diverifikasi dari kode |
| `syarat-ketentuan.md` | Kerangka + bagian yang butuh keputusan bisnis Malik |
| `YANG-DIBUTUHKAN-DARI-MALIK.md` | Daftar pertanyaan yang harus dijawab sebelum draf bisa difinalkan |

## Cara draf ini disusun

Bagian teknis **tidak dikarang** — diaudit langsung dari source code dan
database:

- kolom tabel `comments` dan `views` di D1 (apa yang benar-benar disimpan)
- cookie yang benar-benar dipasang (`functions/_lib/ledger.ts`, `adminsess.ts`)
- masa berlaku sesi (`SESS_TTL_SECS`)
- pemanggilan API pihak ketiga (`functions/*/proxy.ts`)
- pemeriksaan HTML produksi: **nol aset pihak ketiga dimuat** di halaman

Bagian yang **butuh keputusan bisnis** sengaja dibiarkan kosong dan ditandai
`【BUTUH KEPUTUSAN MALIK: ...】` — bukan diisi tebakan. Jangan terbitkan
sebelum semua penanda itu terisi.

## Setelah disetujui

Rencana penempatan (belum dikerjakan):

1. **Situs utama** — halaman baru `/kebijakan-privasi` dan `/syarat-ketentuan`
   di `app/(marketing)/`, ditautkan dari footer.
2. **Portal berita** — isi ulang tiga halaman di tabel D1 `pages`
   (`privacy`, `disclaimer`, `pedoman-media-siber`) lewat panel
   `/admin/berita`, menggantikan placeholder.
3. Tambahkan tautan kebijakan privasi di dekat form komentar.
