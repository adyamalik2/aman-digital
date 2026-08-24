# Status Proyek — AMAN Digital

**Diperbarui:** 24 Agustus 2026

Isi berkas ini cepat basi. Kalau ada yang terasa tidak cocok dengan kenyataan,
**percayai produksi**, lalu perbarui berkas ini.

---

## Yang sudah live

### Situs utama — `amandigital.my.id`

| Bagian | Status |
|---|---|
| Halaman pemasaran (22 rute) | ✅ live |
| Portal berita AMAN News (`/berita`) | ✅ live, 18 artikel terbit, 8 kategori terisi |
| Panel admin (`/admin`, `/admin/berita`) | ✅ live |
| 4 tool berbayar (Engine, Content Engine, Poster, Produk Digital) | ✅ live, digerbangi kode akses |
| Sitemap & robots | ✅ 44 URL |
| Redirect `/blog` → `/berita` | ✅ live 24-08-2026 |

### Empat aplikasi

| Aplikasi | Web | APK |
|---|---|---|
| AMAN Kasir | ✅ `kasir.amandigital.my.id` | terpasang (dipakai Malik) |
| AMAN Budget | ✅ `budget.amandigital.my.id` | terpasang (dipakai Malik, Pro aktif) |
| AMAN Invoice | ✅ `invoice.amandigital.my.id` | terpasang |
| AMAN-in | ✅ `amanin.amandigital.my.id` | terpasang |

APK **belum pernah dibagikan ke pelanggan** dan **belum ada di Play Store**.

---

## Menunggu keputusan / data dari Malik

Diurutkan dari yang paling menghambat.

| # | Perkara | Yang dibutuhkan |
|---|---|---|
| 1 | **Skema harga AMAN-in** | Aplikasinya belum punya pembatas kuota sama sekali, jadi "gratis kalau sedikit, bayar kalau banyak" belum bisa ditegakkan. Butuh angka: batas gratis berapa, tarif berapa. |
| 2 | **Dokumen legal** | Kebijakan Privasi, S&K, Refund, Lisensi produk digital, ketentuan kode akses, moderasi komentar, koreksi berita, retensi data, definisi "akses selamanya". **Belum ada satu pun.** Situs mengumpulkan data (komentar, kode akses) tanpa kebijakan privasi. |
| 3 | **Cara pembayaran di `/harga`** | Paragraf lama dihapus karena tidak terverifikasi. Halaman harga kini tidak menjelaskan cara bayar sama sekali. Menunggu Duitku atau konfirmasi jalur lain. |
| 4 | **Duitku** | Akun sudah didaftarkan, email terverifikasi, **masih menunggu approval manual**. Belum ada API key. Tanpa ini, paket berbayar tidak bisa diaktifkan. |
| 5 | **Hosting `web.id`** | Domain `amandigital.web.id` sudah **terminated 21-08-2026**. Belum diputuskan Hostinger atau Rumahweb. Terpisah dari my.id — my.id bukan hasil migrasi web.id, melainkan platform baru. |
| 6 | **Email bisnis** | Belum ada email `@amandigital.my.id`. Kartu Email di `/kontak` sementara diganti kartu Telepon (ada komentar penjelasnya di kode). |
| 7 | **Pin Google Maps** | Tautan di `/kontak` masih pencarian area "Blangpidie Aceh Barat Daya", bukan pin alamat. Butuh koordinat/alamat persis. |
| 8 | **Aman Ibadah** | Masih kerangka kosong. Dibangun atau dilupakan? |
| 9 | **Login per-penulis Newsroom** | Sekarang satu password admin bersama. Baru relevan kalau ada penulis lain selain Malik. |
| 10 | **Gambar 12 artikel** | Sudah dimasukkan Malik 24-08. *(Kalau ada artikel baru tanpa sampul, catat di sini.)* |

---

## Sudah diusulkan, menunggu persetujuan

**C06 — memendekkan metadata.** 8 meta description melebihi 160 karakter
(terpanjang `/digital-store` 205) dan 2 title melebihi 60 (65 & 63). Usulan
teks pengganti sudah disiapkan, tinggal ditinjau. Belum diterapkan karena
ini copy pemasaran milik Malik.

**Penataan halaman `/harga`.** Sekarang hanya memuat Kasir/Budget/Invoice;
5 produk lain harganya hardcode terpisah di halaman masing-masing, jadi
pengunjung tidak punya satu tempat untuk melihat seluruh harga. Usulan: satu
halaman dengan tiga blok — langganan, bayar-sekali, gratis. Tanpa mengubah
angka mana pun. Belum dikerjakan.

---

## Ditunda dengan sengaja

| Perkara | Alasan |
|---|---|
| Schema Organization / Product / Offer / FAQPage | Menunggu data yang ditampilkan stabil & dikonfirmasi |
| Analitik, tracking, cookie banner | Belum diputuskan Malik pakai apa |
| Halaman 404 kustom | Prioritas rendah; sudah `noindex` otomatis |
| Google Play Billing | Belum diperlukan — APK belum dibagikan ke pelanggan |

---

## Utang teknis yang diketahui

| Perkara | Catatan |
|---|---|
| ~8 lint error situs utama | Pre-existing: `setState` di dalam effect pada panel admin (7×) + satu `require()` import. Sudah ada sebelum pekerjaan Agustus 2026. |
| 1 test gagal di AMAN Invoice | `deriveInvoiceStatus` — fixture memakai `dueDate: '2026-06-08'` yang sudah lewat, jadi hasilnya `overdue` bukan `unpaid`. Test time-bomb, rusak karena kalender. |
| `isPro` AMAN Budget hanya sisi klien | Cukup untuk sekarang (APK belum dibagikan), **wajib** diganti entitlement resmi sebelum distribusi ke pelanggan. Lihat `KEPUTUSAN.md` K-01. |
| Komentar berita: tanpa CSRF, format email tak divalidasi | Risiko rendah (endpoint publik tanpa sesi). Honeypot & moderasi `pending` sudah ada. Rate-limit hanya menahan percobaan gagal, bukan volume submit valid. |
| Gambar artikel PNG tanpa `width`/`height` | Sebagian termitigasi CSS `aspect-ratio`. Belum diukur dampaknya dengan Lighthouse. |
| Kutipan waktu muat AMAN-in ~4,6 detik | Dari satu sesi browser cloud, **belum** diverifikasi Lighthouse. Pengukuran cepat lain memberi 145 ms. Jangan dianggap fakta sampai diukur benar. |

---

## Riwayat singkat

- **Agustus 2026** — audit visual & aksesibilitas (kontras, area sentuh),
  4 aplikasi di-deploy sebagai PWA dengan subdomain sendiri, portal berita
  diisi 18 artikel, panel Newsroom dapat kurasi beranda + pencarian + draf
  otomatis, audit teknis menyeluruh lalu perbaikan C01–C10 + C15.
- **21-08-2026** — hosting `amandigital.web.id` diterminasi.
- Sebelumnya — situs lama berbasis PHP di `web.id`; `amandigital.my.id`
  dibangun sebagai platform baru yang sepenuhnya terpisah.
