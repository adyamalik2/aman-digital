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
| AMAN-in | ✅ `amanin.amandigital.my.id` | **v1.2.7 (vc19) dibangun 06-09** |

APK **belum pernah dibagikan ke pelanggan** dan **belum ada di Play Store**.

---

### APK AMAN-in 1.2.7 — dibangun 06-09-2026

`D:\Bukak toko Photo Copy dan percetakan\WEB\Aplikasi baru Amanin\APK\AMAN-in-1.2.7-vc19.apk`

6,5 MB, `versionCode 19`, ditandatangani keystore release
(`CN=Adya Malik, AMAN Digital`). Menimpa 1.2.6 tanpa masalah.

Baru sejak 1.2.6, sudah diperiksa ikut di dalam bundel APK-nya:

- Penyesuaian saldo wallet dicatat sebagai transaksi (+ migrasi data lama)
- Daftar transaksi per wallet, dibentangkan dari menu Wallet
- Pilihan Galeri/Kamera untuk foto struk dan Scan Nota
- Tampilan sisa kuota Scan Nota

Izin Android tetap **sembilan**, cocok dengan yang tertulis di halaman
Privasi & Data.

---

### APK AMAN-in 1.2.6 — dibangun 01-09-2026

`D:\Bukak toko Photo Copy dan percetakan\WEB\Aplikasi baru Amanin\APK\AMAN-in-1.2.6-vc18.apk`

6,5 MB, `versionCode 18`, ditandatangani keystore release
(`CN=Adya Malik, AMAN Digital`) — bukan debug, jadi bisa dipasang menimpa
1.2.5. `applicationId` dan konfigurasi penandatanganan tidak disentuh.

Delapan hal yang **belum pernah ada di APK mana pun** ikut di sini: Scan Nota,
Onboarding & tipe akun, foto struk terpisah, Privasi & Data, hapus akun
permanen, bagikan-notifikasi, ekspor CSV/PDF, dan langganan Pro.

**Yang cuma bisa diuji dari APK ini** (tidak mungkin diverifikasi dari sisi
pengembangan): bagikan notifikasi lewat menu Bagikan Android, input suara
native, biometrik, pengingat harian, dan share sheet untuk backup/ekspor.

> Saat membangunnya ketahuan halaman Privasi & Data menyebut 3 izin padahal
> APK meminta 9 — empat tambahan disumbang plugin biometrik dan notifikasi
> tanpa menyentuh AndroidManifest.xml kita. Sudah diperbaiki sebelum APK
> dirilis. Perintah pemeriksaannya dicatat di `aman-in/AGENTS.md`.

---

## Menunggu keputusan / data dari Malik

Diurutkan dari yang paling menghambat.

| # | Perkara | Yang dibutuhkan |
|---|---|---|
| 1 | ~~Skema harga AMAN-in~~ | ✅ **SELESAI 01-09.** Angkanya ditetapkan (K-15), gerbangnya menyala, aktivasi kode teruji ujung-ke-ujung. Tidak menunggu apa pun lagi. |
| 2 | ~~Dokumen legal~~ | ✅ **SELESAI 06-09.** Kebijakan Privasi & Syarat–Ketentuan terbit dan tertaut di footer; tiga halaman legal portal berita terisi; tautan privasi ada di form komentar. Sisa hanya Kelompok C (tinjauan ahli hukum). |
| 3 | ~~Cara pembayaran di `/harga`~~ | ✅ **SELESAI 06-09.** Blok "Cara membayar" tiga langkah dipasang, plus ketujuh produk beserta tautan checkout-nya. |
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

- `kebijakan-privasi.md` — ✅ **SUDAH TERBIT 06-09** di `/kebijakan-privasi`.
  Halamannya membaca berkas Markdown ini saat build, jadi tidak ada salinan
  kedua yang bisa menyimpang. Ubah berkasnya, halaman ikut.
- `syarat-ketentuan.md` — sebagian besar tersusun; 10 penanda
  `【PERLU DIPUTUSKAN】` masih terbuka.

Yang sudah menyusul: (1) ✅ halaman `/kebijakan-privasi` + tautan footer,
(3) ✅ keterangan "tidak ada refund" kini ada di **semua** halaman jual
(`/amanin` menyusul 06-09; empat lainnya sudah sejak lama).

(2) ✅ **Tiga halaman legal portal berita terisi 06-09** — `privacy`,
`disclaimer`, `pedoman-media-siber`, ditulis langsung ke D1 produksi.
(4) ✅ **Tautan kebijakan privasi kini ada di form komentar**, beserta
keterangan singkat bahwa nama & isi tampil publik dan email tidak pernah
ditampilkan.

**Seluruh daftar legal selesai.** Yang tersisa hanya Kelompok C: tinjauan
orang yang paham hukum atas batasan tanggung jawab (S&K bagian 12) dan klaim
keamanan data (Kebijakan Privasi bagian 7). Saya bisa menyusun kalimatnya,
tapi saya bukan penasihat hukum.

**~~Penataan halaman `/harga`~~** — ✅ **SELESAI 06-09.** Ketujuh produk kini
tampil di satu halaman: paket berlangganan (masih "Segera Hadir"), empat alat
bayar-sekali, dan tiga paket AMAN-in Pro. Tanpa mengubah angka mana pun.

Harga tampilannya diambil dari `lib/produk.ts`, dan **`npm run cek:harga`**
memastikannya sama dengan katalog server yang benar-benar menagih. Penjaga itu
sudah diuji dengan sengaja merusak satu harga — terdeteksi, bukan lolos.
Jalankan setiap kali mengubah harga di mana pun.

---

## Rencana AMAN-in — dikerjakan berurutan

Disepakati 31-08-2026. Dikerjakan **satu per satu**, tiap langkah diuji ke
produksi sebelum lanjut. Urutannya bukan selera: nomor 1 memperbaiki bug yang
akan menimpa pelanggan, sisanya menyusul.

| # | Pekerjaan | Kenapa sekarang | Status |
|---|---|---|---|
| 1 | **Foto struk keluar dari dokumen transaksi** | Bug nyata, lihat di bawah | ✅ selesai 31-08 (aturan Firestore sudah diterbitkan) |
| 2 | **Kebijakan privasi AMAN-in + layar Privasi & Data** | Scan Nota sudah rilis dan mengirim foto ke pihak ketiga tanpa pemberitahuan | ✅ live 31-08 — Profil → Privasi & Data |
| 3 | **Tombol hapus akun permanen** | Sekarang hanya ada reset data lokal; akun Firebase tetap hidup. Syarat mutlak Play Store | ✅ live 31-08 — Profil → Zona Bahaya |
| 4 | **Bagikan-notifikasi (Share Intent)** | Manfaat besar tanpa izin sensitif | ✅ live 01-09 — jalur manual & PWA aktif; jalur APK menunggu build |
| 5 | **Pembatas kuota gratis/berbayar** | Menegakkan K-14/K-15 | ✅ selesai 01-09 — teruji ujung-ke-ujung |
| 6 | **Ekspor CSV/PDF** | Sekarang hanya ekspor JSON, tidak terbaca pemilik warung | ✅ live 01-09 — Bagikan → Excel (CSV) / Laporan PDF |
| 7 | **Pecah transaksi per bulan** | Mencatat satu transaksi kini menulis ulang seluruh riwayat | ⏸ ditunda sampai banyak pelanggan (K-16) |

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

`aman-in/firestore.rules` diberi path `receipts` dan **sudah diterbitkan
Malik di Firebase Console 31-08**. Catatan untuk ke depan: aturan Firestore
tidak ikut ter-deploy bersama web — menambah path penyimpanan baru selalu
menuntut penerbitan ulang manual di Console, dan build yang sukses tidak
membuktikan apa pun tentang itu.

**Belum diverifikasi langsung.** Aturan yang terbit tidak bisa dibaca dari
sisi ini tanpa kredensial. Pemeriksaan yang menentukan: catat transaksi
berfoto, lalu lihat sub-koleksi `receipts` muncul di Firebase Console →
Firestore → Data → `users/{uid}`.

### AMAN-in Pro — sudah menyala

Harga & batas ditetapkan Malik 01-09 (K-15). Seluruhnya live dan terverifikasi.

| Bagian | Bukti |
|---|---|
| 3 produk di katalog server + masa berlaku | checkout `amanin-tahunan` → Rp144.000 |
| `POST /api/amanin-aktivasi` | token palsu ditolak 401, CORS APK diizinkan |
| Kode terikat uid Firebase (bukan cookie) | 14 pemeriksaan lulus |
| Halaman `/amanin` | 3 kartu paket; janji "gratis selamanya" sudah dicabut |
| Batas 1 bulan di Riwayat/Laporan/Analisis/Ekspor | 26 pemeriksaan lulus |
| **Scan Nota digerbangi di SERVER** | `ocr-nota.ts` menjawab 402 untuk non-Pro |

**Kode uji sudah diterbitkan.** `AIS-MMBD-7ED7` — produk `amanin-selamanya`,
ditulis langsung ke KV lewat wrangler dan ditandai `via: "uji-internal"`,
`buyer: "UJI COBA - Malik"` supaya jelas terbedakan dari penjualan asli.

**Sudah teruji ujung-ke-ujung 01-09.** Malik menukarkan `AIS-MMBD-7ED7` dengan
akun aslinya dan berhasil. Diperiksa langsung di KV produksi, bukan sekadar
laporan: entri kodenya memakai 1 dari 5 slot dengan uid Malik terikat di
dalamnya, dan indeks balik `amanin:akun:{uid}` menunjuk kembali ke kodenya —
indeks itulah yang dibaca gerbang Scan Nota, dan tanpanya Scan Nota tetap
tertutup walau aktivasinya sukses.

Artinya seluruh rantainya terbukti: Firebase ID token asli → verifikasi di
server → pengikatan kode ke akun → hak akses terbaca kembali.

**Keputusan desain yang jangan dibalik:**

- **Saldo tidak ikut disaring.** Menyembunyikan riwayat lama dari perhitungan
  saldo membuat aplikasi salah menyebutkan berapa uang yang dimiliki orang.
  `HomeScreen` karena itu menerima dua prop terpisah.
- **Ekspor ikut disaring**, kalau tidak batasnya bisa dilewati lewat tombol unduh.
- **Backup di Profil TIDAK disaring** — itu hak portabilitas data yang
  dijanjikan halaman Privasi & Data, bukan fitur berbayar.
- **Scan Nota digerbangi di server**, bukan di aplikasi. Satu-satunya fitur
  yang biayanya nyata; pemeriksaan klien bisa dilewati dan yang menanggung
  tagihannya bukan pelakunya.

**Masih tersisa:** Duitku masih sandbox (`"sandbox":true`), jadi belum ada yang
bisa benar-benar membayar. Sampai akun Duitku aktif, satu-satunya jalan
mendapat kode adalah diterbitkan manual.

---

### Ekspor laporan — apa yang sekarang bisa dihasilkan

Dari modal **Bagikan**, memakai pemilihan periode yang sudah ada
(harian/mingguan/bulanan/custom):

| Berkas | Untuk apa |
|---|---|
| **CSV** | Dibuka di Excel atau Google Sheets, bisa dijumlah dan dipivot |
| **PDF** | Laporan siap cetak: kop usaha, periode, ringkasan, rincian per kategori, tabel transaksi |

Tiga jebakan CSV yang ditangani khusus dan **jangan dihapus**: pemisah titik
koma (Excel id-ID memakai koma untuk desimal), BOM UTF-8, dan pelumpuhan
suntikan rumus pada sel yang diawali `=`, `+`, `-`, `@`.

41 pemeriksaan lulus (32 CSV + 9 PDF). Hasil PDF-nya diperiksa **secara
visual**, bukan hanya dipastikan tidak melempar error.

Dependensi baru: `jspdf`, dimuat dinamis hanya saat tombol PDF ditekan
(~130KB gzip). `html2canvas` ikut terbawa sebagai chunk terpisah tapi tidak
pernah diunduh karena `doc.html()` tidak dipakai.

---

### Notifikasi bank — tiga jalur, satu belum terverifikasi

`parseNotifikasi.js` mengubah teks notifikasi jadi draf transaksi. Teksnya
selalu diserahkan pengguna; aplikasi **tidak** membaca notifikasi sendiri.

| Jalur | Status |
|---|---|
| Tombol "Tempel Teks Notifikasi" di modal | ✅ live, teruji |
| PWA terpasang → `share_target` → `/?text=` | ✅ live, manifest terverifikasi |
| APK → `ACTION_SEND` → `SharedTextPlugin.java` | ⚠️ kode siap, **belum bisa diuji tanpa APK terpasang** |

27 pemeriksaan lulus dengan teks BRI, Mandiri, GoPay, QRIS, dan format IDR.
Dua jebakan yang ditangani khusus: mengambil **saldo** alih-alih nominal
transaksi, dan salah membaca `150.000` gaya Inggris jadi seratus lima puluh
rupiah.

---

### Dua celah dari perbandingan Catat-in — sudah ditutup 01-09

Croscek langsung ke screenshot Catat-in (aplikasi sejenis), bukan tebakan:

- **Foto struk hanya dari kamera** (`capture="environment"` memaksa buka
  kamera) — pengguna tidak bisa mengunggah struk elektronik (screenshot
  QRIS/e-wallet). **Diperbaiki**: Scan Nota dan Foto Struk masing-masing
  punya tombol Kamera dan Galeri terpisah.
- **Kuota Scan Nota tidak terlihat** — baru ketahuan saat ditolak. **Diperbaiki**:
  tombol membawa "Sisa X/30 hari ini" setelah percobaan pertama di sesi modal.
  `peekUsageCount()` (baru, di `_lib/ratelimit.ts`) murni membaca hitungan yang
  sudah dinaikkan `checkUsageLimit` — tidak mengubah tiga pemanggil lain
  (poster-text, amanin-aktivasi).

**Belum dikerjakan, menunggu keputusan Malik soal AMAN Budget** (lihat
percakapan 01-09): Pantauan Anggaran dan Target Tabungan ada di Catat-in tapi
tidak di AMAN-in. Menambahkan Anggaran ke AMAN-in berarti sebagian nilai
AMAN Budget pindah ke sini — itu keputusan bisnis, bukan teknis.

---

### Dua hal terbuka dari kebijakan privasi AMAN-in

Layar `src/screens/PrivacyScreen.jsx` sudah live, isinya diverifikasi dari kode
(nol pelacak, nol analitik, satu-satunya `fetch` pihak ketiga adalah endpoint
OCR). Dua hal sengaja dibiarkan terbuka:

1. **API Gemini berjalan di tier GRATIS — sudah dipastikan Malik 31-08.**
   Langganan Gemini pribadinya berbayar, tapi penagihan API terpisah dan tidak
   diaktifkan. Ketentuan Google untuk tier gratis mengizinkan isi yang dikirim
   dipakai mengembangkan layanan mereka dan ditinjau manusia. Karena struk
   memuat nama toko, nominal, dan tanggal, ini **diungkap terang-terangan** di
   halaman privasi beserta cara menghindarinya.

   **Usul yang belum diputuskan:** aktifkan penagihan pada project API-nya di
   Google Cloud. Di tier berbayar Google menyatakan isi kiriman tidak dipakai
   memperbaiki produk mereka. Pemakaian dibatasi 30 scan/pengguna/hari dengan
   model `gemini-2.5-flash`, jadi biayanya kemungkinan besar sangat kecil —
   tapi **angkanya belum diperiksa**, jangan dikutip sebelum dicek di halaman
   harga Google. Kalau diaktifkan, peringatan kuning di halaman privasi harus
   dicabut.
2. **Belum ada URL publik.** Play Store mewajibkan kebijakan privasi bisa
   diakses lewat tautan web, bukan hanya di dalam aplikasi. Perlu halaman di
   situs utama sebelum AMAN-in masuk Play Store.

Langkah 3 sudah selesai, jadi baris "belum ada tombolnya" di tabel hak sudah
dicabut dan diganti jalur yang sebenarnya.

**Belum diuji di perangkat sungguhan.** Logikanya lulus 25 pemeriksaan dengan
Firestore dan Firebase Auth palsu, tapi hapus akun tidak bisa diuji sungguhan
dari sisi ini tanpa mengorbankan akun asli. Sebelum APK dibagikan, Malik perlu
mencobanya dengan akun uji sekali pakai — terutama alur verifikasi ulang, yang
muncul hanya kalau sesi masuknya sudah lama.

---

### Yang sengaja TIDAK dikerjakan

| Perkara | Alasan |
|---|---|
| Iklan / AdMob | K-14 — hitungannya tidak masuk dan merusak kepercayaan |
| Pindah ke Supabase | K-13 |
| Pembaca notifikasi otomatis penuh | Butuh plugin native + izin sensitif Play Store, dan 20+ pengurai teks bank yang harus dirawat selamanya. Dicoba dulu versi ringannya (nomor 4) |
| Baca SMS | Izin sensitif, dan bank sekarang memakai notifikasi aplikasi, bukan SMS |
| Bot Telegram | Ditolak Malik 30-08 ("jangan dulu") |

---

### Audit AMAN-in 06-09-2026 — 4 bug parah diperbaiki, 10 masih terbuka

Audit menyeluruh diminta Malik. 14 temuan, semua dari pembacaan kode
(4 diverifikasi ulang langsung sebelum diperbaiki, bukan cuma dipercaya dari
laporan). Empat yang paling merusak data sudah diperbaiki dan live:

| # | Bug | Perbaikan | Uji |
|---|---|---|---|
| 1 | Membuka transaksi "Penyesuaian Saldo" mengganti kategorinya sendiri | Early-return untuk `SYSTEM_CATS` di effect penjaga kategori | 9/9 |
| 2 | Transaksi hilang kalau dicatat saat aplikasi baru dimuat | `applyData` baca state terkini lewat `resolveTx` fungsional | 11/11 |
| 3 | `receipts.set()` bisa menggantung selamanya (tidak seperti `get()`) | `WRITE_TIMEOUT_MS` ditambahkan | 9/9 + regresi 39/39 |
| 4 | Edit wallet setelah restore backup / gabung wallet yatim menggandakan saldo | `rawBalance` dicari dari `walletByName`, bukan asumsi `baseBalance`/`0` | 15/15 |

**Lanjutan 06-09 — 5 temuan berikutnya juga sudah diperbaiki:**

| # | Bug | Perbaikan | Uji |
|---|---|---|---|
| 5 | Cadangan otomatis tidak dipisah per akun (HP dipakai berdua bisa lihat data akun lain) | `backup.js` dapat `initBackup(uid)`, kunci per-akun seperti `store.js` | 9/9 |
| 6 | Kolom Tanggal kosong membuat transaksi hantu (`ts` jadi NaN) | `tanggalValid()` jadi gerbang wajib di `isDisabled` + `handleSubmit` | 16/16 |
| 7 | Hapus usaha meninggalkan penyesuaian saldo yatim | `deleteBusiness` ikut membersihkan `walletAdjustments[id]` | 9/9 |
| 8 | `hideBalance` (ikon mata) tidak berlaku di layar Wallet | Prop dioper seperti layar lain | terverifikasi bundel |
| 9 | Form Wallet melompat sendiri ke mode Edit, bisa menimpa ketikan | Dependensi effect dipersempit ke `[initialEditName]` saja | (gabung #7) |

**3 temuan masih terbuka**, kosmetik/berdampak kecil: "Transaksi Terbaru" di
Beranda tidak diurutkan, Kelola Kategori salah untuk akun Pribadi (menampilkan
kategori Usaha, menyembunyikan kategori Pribadi), dua baris geser-hapus bisa
sama-sama terbuka sebentar saat digeser bersamaan, timer penyimpanan tidak
dibatalkan saat keluar akun.

Detail lengkap tiap temuan (file:baris, skenario, akibat) ada di transkrip
percakapan 06-09 -- belum dipindah ke dokumen ini.

---

### Halaman legal portal berita — catatan penerapan

Ketiganya ditulis langsung ke D1 produksi 06-09 (bukan lewat panel admin).

- **`privacy`** sengaja **tidak menduplikasi** kebijakan privasi utama. Isinya
  ringkasan untuk pembaca/pengomentar lalu menautkan ke `/kebijakan-privasi`.
  Dua dokumen hukum yang saling menyalin pasti menyimpang.
- **`pedoman-media-siber`** **tidak menyalin naskah resmi Dewan Pers.** Yang
  ditulis adalah komitmen AMAN News dan cara penerapannya, plus tautan ke
  sumber resminya. Kalau Malik ingin naskah verbatim, salin sendiri dari
  dewanpers.or.id — jangan dikutip dari ingatan.
- **Waktu tanggap ralat/hak jawab ditulis 1×24 jam**, mengikuti standar yang
  sudah ditetapkan untuk kanal email yang sama (K-12). Kalau untuk urusan
  redaksi angkanya perlu beda, tinggal diubah.

**Temuan sampingan:** Cloudflare menyamarkan otomatis alamat email di halaman
portal berita (`__cf_email__`) — bagus untuk menahan panen spam, dan nomor
WhatsApp tetap terlihat sebagai jalur cadangan bila JavaScript mati.

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

## Traksi

**10.000+ pageviews** di `amandigital.my.id` pada Agustus 2026 (11.218 tepatnya,
laporan Cloudflare) — pertama kalinya situs melewati ambang itu, sejak dibuat
21-06-2026.

---

## Riwayat singkat

- **Agustus 2026** — audit visual & aksesibilitas (kontras, area sentuh),
  4 aplikasi di-deploy sebagai PWA dengan subdomain sendiri, portal berita
  diisi 18 artikel, panel Newsroom dapat kurasi beranda + pencarian + draf
  otomatis, audit teknis menyeluruh lalu perbaikan C01–C10 + C15.
- **21-08-2026** — hosting `amandigital.web.id` diterminasi.
- Sebelumnya — situs lama berbasis PHP di `web.id`; `amandigital.my.id`
  dibangun sebagai platform baru yang sepenuhnya terpisah.
