# Status Proyek — AMAN Digital

**Diperbarui:** 31 Agustus 2026

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
| 1 | **Skema harga AMAN-in** | Modelnya **sudah diputuskan 31-08**: gratis dengan batas → bayar untuk melepas batas, tanpa iklan (K-14). Yang masih kosong **angkanya** — batas gratis berapa, tarif berapa. Pembatas kuotanya juga belum dibangun, jadi skema ini masih rencana. Pembanding pasar yang diketahui: pesaing Rp29rb/bulan, Rp12.500/bulan bila tahunan. |
| 2 | **Dokumen legal** | 📝 Kelompok A **sudah dijawab** 25-08 (lihat K-12). **Kebijakan Privasi siap terbit** — tinggal Malik baca versi finalnya lalu saya buatkan halamannya. S&K masih menunggu 10 pertanyaan Kelompok B, terutama **B6 (lisensi produk)** dan **B7 (arti "akses selamanya")**. |
| 3 | **Cara pembayaran di `/harga`** | Paragraf lama dihapus karena tidak terverifikasi. Halaman harga kini tidak menjelaskan cara bayar sama sekali. Menunggu Duitku atau konfirmasi jalur lain. |
| 4 | **Duitku** | ✅ Ketiga syarat **selesai 28-08**: harga di halaman utama, checkout di situs sendiri, integrasi Sandbox teruji (kode akses terbit otomatis, callback palsu & nominal dikurangi ditolak, kode terikat produk). Tombol beli sudah diarahkan ke `/checkout`. **MASIH SANDBOX** (`DUITKU_SANDBOX=1`) — pembayaran belum menagih uang sungguhan, jadi halaman checkout menampilkan jalur Lynk.id sebagai pembelian nyata. Begitu akun Duitku aktif: ganti secret ke kredensial produksi + `DUITKU_SANDBOX=0`, banner hilang sendiri. Panduan: `docs/duitku-setup.md`. |
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

**Dokumen legal.** Draf ada di `docs/legal/`, **belum ditautkan ke situs**.
Bagian teknis diaudit dari kode (tidak dikarang); keputusan bisnis Malik
sudah masuk (K-12).

- `kebijakan-privasi.md` — **siap terbit**, menunggu Malik membaca versi
  final lalu menyatakan setuju.
- `syarat-ketentuan.md` — sebagian besar tersusun; 10 penanda
  `【PERLU DIPUTUSKAN】` masih terbuka.

Setelah disetujui, tiga hal yang menyusul: (1) halaman
`/kebijakan-privasi` + tautan footer + tautan dekat form komentar,
(2) isi ulang tiga halaman legal portal berita di D1 yang masih placeholder,
(3) **pasang keterangan "tidak ada refund" di halaman produk dekat tombol
beli** — kalau hanya ada di S&K, secara praktis dianggap tidak
diberitahukan.

**Penataan halaman `/harga`.** Sekarang hanya memuat Kasir/Budget/Invoice;
5 produk lain harganya hardcode terpisah di halaman masing-masing, jadi
pengunjung tidak punya satu tempat untuk melihat seluruh harga. Usulan: satu
halaman dengan tiga blok — langganan, bayar-sekali, gratis. Tanpa mengubah
angka mana pun. Belum dikerjakan.

---

## Rencana AMAN-in — dikerjakan berurutan

Disepakati 31-08-2026. Dikerjakan **satu per satu**, tiap langkah diuji ke
produksi sebelum lanjut. Urutannya bukan selera: nomor 1 memperbaiki bug yang
akan menimpa pelanggan, sisanya menyusul.

| # | Pekerjaan | Kenapa sekarang | Status |
|---|---|---|---|
| 1 | **Foto struk keluar dari dokumen transaksi** | Bug nyata, lihat di bawah | ✅ live 31-08 — **menunggu Malik menerbitkan `firestore.rules`** |
| 2 | **Kebijakan privasi AMAN-in + layar Privasi & Data** | Scan Nota sudah rilis dan mengirim foto ke pihak ketiga tanpa pemberitahuan | belum |
| 3 | **Tombol hapus akun permanen** | Sekarang hanya ada reset data lokal; akun Firebase tetap hidup. Syarat mutlak Play Store | belum |
| 4 | **Bagikan-notifikasi (Share Intent)** | Manfaat besar tanpa izin sensitif | belum |
| 5 | **Pembatas kuota gratis/berbayar** | Menegakkan K-14; menunggu angka dari Malik | belum |
| 6 | **Ekspor CSV/PDF** | Sekarang hanya ekspor JSON, tidak terbaca pemilik warung | belum |
| 7 | **Pecah transaksi per bulan** | Mencatat satu transaksi kini menulis ulang seluruh riwayat | belum |

### Bug yang memicu nomor 1

Seluruh transaksi disimpan dalam **satu dokumen Firestore**
(`users/{uid}/data/aman-in:transactions-v2`), dan foto struk ikut masuk ke
dalamnya sebagai base64 hingga 200KB per foto. Firestore membatasi **1 MiB
per dokumen**, dan base64 membengkakkan ukuran ±33%.

**Akibatnya sekitar 3–4 foto struk membuat dokumen penuh dan sinkronisasi
berhenti total.** Scan Nota yang baru dirilis justru mengajak pengguna
memotret struk, jadi ini akan menimpa pelanggan yang paling rajin lebih dulu.

Bug ini **tidak sembuh dengan pindah database** — lihat K-13.

**Diperbaiki 31-08-2026** (commit `56bb492` di repo `aman-in`, live di
`amanin.amandigital.my.id`). Foto kini disimpan satu dokumen per transaksi di
`users/{uid}/receipts/{txId}`, lokalnya di IndexedDB; transaksi hanya membawa
penanda `hasReceipt`. Migrasi berjalan sendiri saat data dimuat dan saat
backup lama dipulihkan. Diuji 33 pemeriksaan dengan Firestore & IndexedDB
palsu, termasuk bukti model lama melewati 1 MiB pada foto ke-4.

> ⚠ **Satu langkah masih di tangan Malik.** `aman-in/firestore.rules` sudah
> diberi path `receipts`, tapi aturan Firestore **hanya berlaku setelah
> diterbitkan ulang di Firebase Console** (project `aman-in-app` → Firestore
> Database → Rules → paste isi berkas → Publish). Sampai itu dilakukan, foto
> hanya tersimpan di perangkat dan mengantre; transaksinya sendiri sudah
> aman. Deploy web tidak bisa menggantikan langkah ini.

### Yang sengaja TIDAK dikerjakan

| Perkara | Alasan |
|---|---|
| Iklan / AdMob | K-14 — hitungannya tidak masuk dan merusak kepercayaan |
| Pindah ke Supabase | K-13 |
| Pembaca notifikasi otomatis penuh | Butuh plugin native + izin sensitif Play Store, dan 20+ pengurai teks bank yang harus dirawat selamanya. Dicoba dulu versi ringannya (nomor 4) |
| Baca SMS | Izin sensitif, dan bank sekarang memakai notifikasi aplikasi, bukan SMS |
| Bot Telegram | Ditolak Malik 30-08 ("jangan dulu") |

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
