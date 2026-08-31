# Catatan Keputusan — AMAN Digital

Keputusan yang **tidak terlihat dari kode**, beserta alasannya. Tujuannya
supaya tidak diperdebatkan atau "diperbaiki" ulang oleh orang/AI berikutnya.

Format: apa yang diputuskan → kenapa → apa yang terjadi kalau dilanggar.

Diurutkan dari yang paling berisiko kalau dilanggar.

---

## K-01 · Akses Pro pemilik di AMAN Budget dipertahankan

**Tanggal:** 24-08-2026

**Keputusan.** Jalur aktivasi Pro di AMAN Budget **tidak dihapus**, tapi
dipisahkan lewat build mode: hanya ikut ter-bundle pada
`npm run build:android:owner`.

**Kenapa.** Malik memakai APK Budget sendiri sehari-hari dan memang butuh
fitur Pro. Menghapus tombolnya begitu saja terlihat benar dari sisi keamanan,
tapi menghilangkan **jalur pemulihan** — begitu Malik ganti HP, install
ulang, atau menghapus data aplikasi, Pro-nya hilang permanen tanpa cara
mengembalikan.

**Riwayat.** Audit awal menandai ini sebagai celah dan mengusulkan
penghapusan. Usulan itu **ditarik** setelah Malik menjelaskan konteksnya:
APK belum pernah dibagikan ke pelanggan, belum ada di Play Store.

**Kalau dilanggar.** Malik kehilangan akses Pro di aplikasinya sendiri, tanpa
cara memulihkan selain mengembalikan kode ini.

**Batasnya.** Ini pemisahan **distribusi**, bukan sistem lisensi. `isPro`
tetap nilai localStorage sisi klien. Sebelum APK diberikan ke pelanggan atau
naik Play Store, entitlement wajib diganti Google Play Billing atau validasi
lisensi resmi. Lihat `AGENTS.md` repo AMAN Budget.

---

## K-02 · Jangan pernah mengarang isi

**Tanggal:** berlaku sejak awal proyek

**Keputusan.** Dilarang membuat harga, statistik, testimoni, nama klien,
metrik hasil, identitas badan usaha, atau klaim fitur yang belum
dikonfirmasi Malik.

**Kenapa.** Ini situs bisnis nyata dengan pelanggan nyata. Angka atau klaim
karangan bukan cuma salah — bisa jadi masalah hukum dan menghancurkan
kepercayaan.

**Contoh nyata.** Paragraf metode pembayaran di `/harga` pernah menyebut
transfer bank BCA/Mandiri/BRI/BNI dengan aktivasi 1×24 jam. Ternyata jalur
itu tidak pernah ada. Sekarang dihapus dan ditandai `TODO(pemilik)` sampai
Malik mengonfirmasi cara bayar yang sebenarnya.

**Contoh kedua.** Waktu diminta menyalin "database artikel web.id lama",
ternyata isinya 12 artikel contoh bawaan installer yang **menyatakan dirinya
sendiri** sebagai contoh ("Bukan berita sungguhan"). Menyalinnya berarti
menerbitkan konten yang mengaku palsu. Yang dilakukan: topiknya dipakai,
isinya ditulis ulang dari nol sebagai artikel asli.

**Kalau ragu:** tanya Malik, atau kosongkan. Jangan tebak.

---

## K-03 · Digital Store adalah produk, bukan layanan

**Tanggal:** 24-08-2026 (final)

**Keputusan.** AMAN Digital punya **4 layanan** — Data & System, IT Advisor,
Print Center, Creative Studio. Digital Store / "Produk Digital (700+)" adalah
**produk**, dan tampil di menu Produk.

**Kenapa.** Layanan itu dikerjakan untuk klien; Digital Store adalah barang
jadi yang tinggal dibeli. Beda sifat, beda alur pembelian.

**Kalau dilanggar.** Muncul lagi kontradiksi antara beranda, FAQ, dan menu
navigasi — persis masalah yang sudah diperbaiki 24-08-2026.

**Catatan.** Beranda menampilkan **5 produk pilihan** dengan judul "5 Produk
Unggulan", sementara menu Produk memuat 8 produk. Ini disengaja: beranda
kurasi, menu lengkap.

---

## K-04 · AMAN News tetap portal berita umum

**Tanggal:** 24-08-2026

**Keputusan.** AMAN News memuat topik luas — politik, olahraga, lifestyle,
pendidikan, teknologi, ekonomi, nasional, daerah. **Bukan** blog khusus UMKM.

**Kenapa.** Ini keputusan editorial Malik. Audit sempat mempertanyakan apakah
topik luas "mencampur intent bisnis" — dijawab: pertahankan.

**Kalau dilanggar.** Jangan menghapus kategori, menyempitkan topik, atau
menghapus artikel karena dianggap tidak relevan dengan UMKM.

**Cara menaikkan SEO-nya:** kualitas SEO teknis, struktur halaman, metadata,
internal link, dan mutu konten — **bukan** dengan mengubah fokus editorial.

---

## K-05 · Link "Masuk Newsroom" tetap terlihat publik

**Tanggal:** 24-08-2026

**Keputusan.** Link `/admin/berita` di header portal berita tetap tampil ke
semua pengunjung.

**Kenapa.** Supaya Malik gampang masuk dari mana saja. Halaman tujuannya
tetap digerbangi autentikasi, jadi ini bukan celah keamanan — hanya soal
kerapian tampilan.

**Kalau dilanggar.** Jangan menyembunyikan atau memindahkannya. Yang **tidak
boleh** dikurangi adalah pengamanan login-nya.

---

## K-06 · Identitas warna AMAN-in tetap ungu

**Tanggal:** 24-08-2026

**Keputusan.** AMAN-in memakai ungu `#7C3AED`, berbeda dari emerald/navy
situs utama. Dipertahankan.

**Kenapa.** Identitas produk tersendiri. Emerald di dalam aplikasi itu hanya
warna semantik untuk "pemasukan/positif", bukan warna brand.

---

## K-07 · Login opsional di AMAN Kasir

**Tanggal:** keputusan desain awal (terdokumentasi di source)

**Keputusan.** Dashboard dan layar transaksi AMAN Kasir bisa dibuka tanpa
login. Tidak ada route guard.

**Kenapa.** Positioning aplikasi ini offline-first — "kasir yang jalan terus
walau sinyal pergi". Login (Google) hanya dipakai untuk cloud backup.
Tertulis eksplisit di `src/services/auth/AuthService.ts`.

**Kalau dilanggar.** Menambahkan gerbang login akan merusak alasan utama
aplikasi ini ada.

---

## K-08 · Paket berbayar jujur "Segera Hadir"

**Tanggal:** sebelum 24-08-2026

**Keputusan.** Paket Dasar & Pro di `/harga` diberi badge "Segera Hadir" dan
tombolnya "Daftar Minat" (ke WhatsApp), bukan "Beli".

**Kenapa.** Jalur pembelian otomatis memang belum ada — akun Duitku masih
menunggu approval. Menampilkan tombol beli yang tidak berfungsi = menipu
pelanggan.

**Catatan.** Hero halaman masih berbunyi "Mulai gratis, bayar saat bisnis
berkembang", padahal jalur upgrade-nya belum ada. **Belum diputuskan** apakah
copy-nya diubah atau menunggu paket berbayar aktif.

---

## K-09 · Redirect `/blog` → `/berita`

**Tanggal:** 24-08-2026

**Keputusan.** `public/_redirects` memetakan URL blog lama ke portal berita,
dengan 2 slug spesifik di atas aturan wildcard.

**Kenapa.** Situs dulu memakai `/blog` sebelum pindah ke `/berita`. Rutenya
sudah lama hilang dari source, **tapi cache edge Cloudflare masih menyajikan
HTTP 200 berisi tampilan situs versi lama** — nav dan footer usang — bukan
404 seperti yang diperkirakan. Pengunjung dari Google melihat situs lama.

**Penting.** Baris spesifik harus **di atas** wildcard; Cloudflare Pages
memakai aturan pertama yang cocok.

---

## K-10 · Penulis artikel = "Tim AMAN Digital"

**Tanggal:** 24-08-2026

**Keputusan.** Penulis semua artikel diubah dari "Redaksi" menjadi "Tim AMAN
Digital" (slug `tim-aman-digital`).

**Kenapa.** 18 artikel yang ada ditulis dengan bantuan AI, bukan tim redaksi
manusia. "Redaksi" menyiratkan hal yang tidak benar.

**Efek samping yang diketahui.** `/berita/penulis/redaksi` sekarang 404.
Tidak ada tautan keras ke slug lama di dalam kode (sudah dicek).

**Sifat artikel.** Kedelapan belas artikel adalah **konten panduan
evergreen**, bukan liputan berita. Tidak memuat nama orang, statistik,
peristiwa, atau kutipan karangan. Satu artikel ("Keterbukaan Informasi
Publik") memuat gambaran umum aturan yang **belum diverifikasi ke sumber
resmi** — Malik memilih membiarkannya tayang setelah diberi tahu.

---

## K-11 · Dokumentasi proyek wajib dirawat, bukan opsional

**Tanggal:** 24-08-2026

**Keputusan.** `AGENTS.md`, `KEPUTUSAN.md`, dan `STATUS.md` **wajib ikut
diperbarui dalam commit yang sama** dengan perubahan yang memicunya. Bukan
pekerjaan tambahan yang bisa ditunda.

**Kenapa.** Sebelum 24-08-2026, seluruh konteks proyek hanya hidup di kepala
Malik dan di riwayat percakapan — tidak bisa dibaca siapa pun yang baru masuk.
Akibatnya sudah pernah nyaris fatal: sebuah audit mengusulkan menghapus akses
Pro pemilik di AMAN Budget, kesimpulan yang wajar dari sisi kode tapi salah
(lihat K-01). Usulan itu batal hanya karena Malik kebetulan hadir menjelaskan.

Dokumen yang basi lebih berbahaya daripada tidak ada dokumen, karena orang
telanjur memercayainya. Jadi merawatnya bagian dari pekerjaan itu sendiri.

**Cara menerapkan.** Aturan lengkap beserta tabel pemicunya ada di bagian 8
`AGENTS.md`. Empat repo aplikasi punya versi ringkasnya masing-masing.

**Kalau dilanggar.** Dokumen pelan-pelan menyimpang dari kenyataan, lalu orang
berikutnya mengambil keputusan berdasarkan informasi yang salah — persis
masalah yang dokumen ini diciptakan untuk mencegahnya.

---

## K-12 · Kebijakan data: disimpan tanpa batas waktu, dan tidak ada refund

**Tanggal:** 25-08-2026

**Keputusan Malik**, menjawab pertanyaan Kelompok A dokumen legal:

| Perkara | Keputusan |
|---|---|
| Identitas usaha | **Perorangan** atas nama Adya Malik — bukan PT/CV |
| Email urusan data | adya.malik2@gmail.com (sementara) |
| Masa simpan komentar | **Selamanya**, sampai pengomentar minta dihapus |
| Masa simpan sidik pengunjung | **Selamanya** |
| Waktu tanggap permintaan hapus | **1×24 jam** |
| Usia minimum pengguna | **13 tahun** |
| Kebijakan privasi aplikasi | **Terpisah** dari kebijakan situs |
| Refund produk digital | **TIDAK ADA** |

**Kenapa perlu dicatat:**

1. **Tanpa batas simpan berarti tidak perlu mekanisme penghapusan berkala.**
   Draf awal sempat memperingatkan bahwa menetapkan masa simpan menuntut
   pembangunan proses purge otomatis. Karena Malik memilih menyimpan tanpa
   batas, kebutuhan itu gugur. Kebijakan menyatakannya apa adanya — lebih
   baik daripada mencantumkan angka yang tidak benar-benar dijalankan.

2. **"Tidak ada refund" wajib terlihat SEBELUM pembeli membayar**, bukan
   hanya tersembunyi di halaman S&K. Kalau hanya ada di sana, secara praktis
   dianggap tidak diberitahukan. **Belum dipasang** di halaman produk.

3. **Usaha perorangan, bukan badan usaha.** Jangan menulis PT/CV di mana pun.
   Kalau suatu saat berbadan hukum, seluruh dokumen legal harus diperbarui.

4. **Kebijakan aplikasi dibuat terpisah** karena aplikasi menyimpan data
   keuangan pengguna — jauh lebih sensitif daripada situs. Mencampurnya
   membuat keduanya kabur.

**Catatan.** Email yang dipakai masih Gmail pribadi dan akan dipanen robot
spam begitu dipublikasikan. Malik menyebutnya sementara — ganti ke email
berdomain sendiri begitu tersedia.

---

## K-13 · AMAN-in tetap di Firebase, bukan pindah Supabase

**Tanggal:** 31-08-2026

**Keputusan.** Basis data empat aplikasi **tetap Firebase (Firestore +
Auth)**. Supabase dipertimbangkan lalu ditolak.

**Kenapa.** Tiga alasan, diurutkan dari yang paling menentukan:

1. **Paket gratis Supabase menjeda proyek setelah ±7 hari tanpa aktivitas.**
   Aplikasi berbayar dengan pengguna sedikit justru sering sepi seminggu.
   Pelanggan membuka aplikasi, servernya tidur, dia menyimpulkan aplikasinya
   rusak. Menghindarinya butuh paket Pro ±$25/bulan untuk produk seharga
   Rp39rb. Firestore paket Spark tidak pernah dijeda.
2. **Keempat aplikasi memakai Firebase Auth.** Pindah berarti menulis ulang
   login di Kasir, Budget, Invoice, dan AMAN-in — dan **APK yang sudah
   terpasang akan berhenti bekerja**, karena asetnya ter-bundle dan tidak
   ikut berubah saat web di-deploy.
3. **Di skala sekarang keduanya gratis.** Harga bukan pembeda, jadi tidak
   ada alasan finansial untuk memindahkan.

**Yang penting dipahami.** Pertanyaan "Supabase atau Firebase" muncul karena
sinkronisasi AMAN-in bermasalah. Tapi sebabnya **bukan merek databasenya** —
melainkan seluruh transaksi ditulis ke satu dokumen (lihat K-14). Pindah
database hanya menyembunyikan gejalanya sebentar lalu memunculkannya lagi
sebagai lambat dan boros kuota.

**Kalau suatu hari benar-benar pindah**, tujuan yang paling masuk akal bukan
Supabase melainkan **Cloudflare D1 + R2** — sudah dibayar, sudah dipakai
situs utama, tidak menambah vendor ketiga.

---

## K-14 · AMAN-in tidak beriklan; monetisasi lewat batas pemakaian

**Tanggal:** 31-08-2026

**Keputusan.** **Tidak ada iklan** (AdMob atau lainnya) di aplikasi mana pun.
Model pendapatan AMAN-in: **gratis dengan batas, bayar untuk melepas batas.**

**Kenapa.**

- **Hitungannya tidak masuk.** Perkiraan kasar 200 pengguna aktif × 10
  tayangan/hari ≈ 60.000 tayangan/bulan → sekitar Rp300rb–900rb/bulan, itu
  pun optimistis, dengan ambang pencairan AdMob $100. Iklan baru mengalahkan
  penjualan langsung kalau penggunanya sudah ribuan.
- **Aplikasi berbayar yang tetap beriklan terasa menagih dua kali.** Pesaing
  boleh beriklan karena mereka gratis — itu imbalan yang jujur.
- **Iklan berarti pelacakan**, yang wajib diungkap di kebijakan privasi dan
  langsung membatalkan nilai jual "tanpa iklan, tanpa pelacak" pada aplikasi
  yang memegang data keuangan orang.

**Skema yang dipilih Malik.** Batas gratis, lalu berbayar untuk melepasnya.
Angkanya **belum final** — yang beredar sebagai contoh: 50 transaksi/bulan
dan Scan Nota tidak termasuk paket gratis. **Jangan tulis angka ini di
halaman produk atau kebijakan sampai Malik menetapkannya** (lihat K-02).

**Catatan penegakan.** Aplikasi **belum punya pembatas kuota sama sekali**.
Skema ini baru jadi kenyataan setelah pembatasnya dibangun; sampai saat itu
ia masih rencana, bukan fitur.

---

## Keputusan yang masih terbuka

Lihat `STATUS.md` bagian "Menunggu keputusan Malik".
