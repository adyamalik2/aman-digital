# 🚧 DRAFT — MENUNGGU PERSETUJUAN AKHIR MALIK 🚧

> Semua pertanyaan Kelompok A sudah dijawab Malik (25-08-2026) dan sudah
> dimasukkan ke draf ini. **Belum diterbitkan ke situs** — menunggu Malik
> membaca versi final ini dan menyatakan setuju.

---

# Kebijakan Privasi

**Berlaku sejak:** 【diisi tanggal terbit】
**Terakhir diperbarui:** 【diisi tanggal terbit】

Halaman ini menjelaskan data apa yang kami kumpulkan saat Anda memakai
**amandigital.my.id**, untuk apa data itu dipakai, dan hak Anda atasnya.

Kami menulis ini apa adanya — termasuk bagian yang mungkin tidak Anda sukai,
seperti berapa lama data disimpan. Kalau ada yang kurang jelas, silakan
hubungi kami lewat kanal di bagian akhir.

**Cakupan.** Kebijakan ini berlaku untuk situs **amandigital.my.id** beserta
portal berita dan alat bantu di dalamnya. Aplikasi AMAN Kasir, AMAN Budget,
AMAN Invoice, dan AMAN-in berjalan terpisah dan **akan memiliki kebijakan
privasinya sendiri** — data yang ditangani aplikasi berbeda jauh dari situs
ini.

---

## Ringkasan singkat

Kalau Anda hanya membaca satu bagian, baca yang ini:

- Kami **tidak memasang layanan analitik, pelacak, atau iklan** apa pun.
- Halaman kami **tidak memuat aset dari pihak ketiga** — font pun kami
  simpan sendiri, jadi membuka situs ini tidak mengirim jejak Anda ke
  server lain.
- Cookie yang kami pasang **hanya untuk fungsi**, bukan pelacakan.
- Kami **tidak pernah menerima data kartu atau rekening Anda** — pembayaran
  ditangani sepenuhnya oleh penyedia pembayaran.
- Kami **tidak menjual atau menyewakan data Anda** kepada siapa pun.
- **Data disimpan tanpa batas waktu**, dan dihapus bila Anda memintanya.

---

## 1. Data yang kami kumpulkan

### a. Saat Anda menulis komentar di AMAN News

| Data | Sifat | Keterangan |
|---|---|---|
| Nama | Wajib | Ditampilkan publik bersama komentar Anda |
| Email | **Opsional** | **Tidak pernah ditampilkan publik.** Boleh dikosongkan |
| Isi komentar | Wajib | Ditampilkan publik setelah disetujui redaksi |
| Sidik alamat IP | Otomatis | Disimpan sebagai **hash**, bukan alamat IP aslinya |
| Jenis peramban | Otomatis | Untuk membedakan komentar asli dari kiriman robot |
| Waktu kirim | Otomatis | — |

Komentar **tidak langsung tampil**. Semua masuk antrean moderasi dan baru
terbit setelah ditinjau redaksi.

### b. Saat Anda membaca artikel

Kami menghitung jumlah pembaca per artikel. Untuk mencegah satu orang
terhitung berulang kali dalam sehari, kami menyimpan **sidik acak (hash)**
dari kombinasi alamat IP dan jenis peramban Anda.

Sidik ini **tidak bisa dikembalikan menjadi identitas Anda**, tidak dipakai
untuk membangun profil, dan tidak dihubungkan dengan aktivitas Anda di
halaman lain.

### c. Saat Anda memakai produk berbayar (kode akses)

Setelah memasukkan kode akses, kami memasang **token acak** di peramban Anda
sebagai penanda perangkat. Token ini yang membuat Anda tidak perlu memasukkan
kode berulang kali.

Yang kami simpan hanyalah kode akses beserta daftar token perangkat yang
terhubung padanya. **Bukan** nama, email, atau identitas Anda.

### d. Saat Anda memakai alat bantu AI

AMAN Engine, AMAN Content Engine, dan AMAN Poster Generator memproses teks
yang Anda ketik dengan bantuan layanan AI **Google Gemini**.

Yang perlu Anda tahu:

- Teks yang Anda masukkan **dikirim ke server Google** untuk diproses.
- Pengiriman dilakukan lewat server kami, bukan langsung dari peramban Anda.
- Kami **tidak menyimpan** isi masukan maupun hasilnya di server kami.
- Karena itu, **jangan memasukkan data rahasia atau data pribadi orang lain**
  ke dalam alat-alat ini.

### e. Yang TIDAK kami kumpulkan

- Tidak ada layanan analitik (Google Analytics, Meta Pixel, dan sejenisnya).
- Tidak ada cookie iklan atau cookie pelacak lintas situs.
- Tidak ada data lokasi.
- Tidak ada data kartu kredit, rekening, atau identitas pembayaran.
- Tidak ada pembuatan profil otomatis atas diri Anda.

---

## 2. Cookie yang kami pasang

Semua cookie kami bersifat **fungsional** — tanpanya, fitur yang bersangkutan
tidak jalan. Semuanya `HttpOnly` (tidak bisa dibaca skrip halaman), `Secure`
(hanya lewat koneksi terenkripsi), dan `SameSite=Lax`.

| Cookie | Guna |
|---|---|
| `amaneng_dev`, `amceng_dev`, `amanposter_dev`, `amanprod_dev` | Menandai perangkat yang sudah memasukkan kode akses |
| `amanadmin_sess` | Sesi login panel pengelola — hanya untuk kami, masa berlaku 30 hari |

Kami **tidak** memasang cookie untuk iklan maupun analitik. Karena itu situs
ini tidak menampilkan spanduk persetujuan cookie.

---

## 3. Untuk apa data dipakai

- **Menampilkan komentar Anda** di artikel yang bersangkutan.
- **Menahan spam dan penyalahgunaan** — sidik IP dan jenis peramban dipakai
  untuk membatasi pengiriman berulang dari sumber yang sama.
- **Menghitung jumlah pembaca** artikel secara agregat.
- **Menjaga akses produk berbayar** tetap sesuai dengan yang Anda beli.
- **Menghubungi Anda** — hanya kalau Anda mengisi email dan ada hal yang
  perlu ditanyakan tentang komentar Anda. Kami **tidak** mengirim newsletter
  atau promosi ke email dari kolom komentar.

---

## 4. Siapa yang bisa melihat data Anda

- **Publik** — nama dan isi komentar Anda, setelah disetujui redaksi.
- **Kami** — pengelola AMAN Digital, untuk keperluan moderasi.
- **Penyedia infrastruktur:**
  - **Cloudflare** — tempat situs dan basis data ini berjalan.
  - **Google (Gemini)** — hanya teks yang Anda masukkan ke alat bantu AI.
  - **Lynk.id** — penyedia pembayaran; data pembelian Anda ada pada mereka,
    tunduk pada kebijakan privasi mereka sendiri.
  - **YouTube** — hanya kalau artikel yang Anda buka memuat video. Kami
    memakai mode privasi (`youtube-nocookie.com`).

Kami **tidak menjual, menyewakan, atau menukar** data Anda kepada pihak lain.

---

## 5. Berapa lama data disimpan

Kami menyampaikan ini terus terang: **kami tidak menetapkan batas waktu
penyimpanan, dan tidak ada proses penghapusan otomatis.**

| Data | Masa simpan |
|---|---|
| Komentar (nama, email, isi) | Disimpan **selama artikelnya ada**, sampai Anda meminta penghapusan |
| Sidik pengunjung (hash IP + peramban) | Disimpan tanpa batas waktu |
| Kode akses & token perangkat | Selama kode tersebut masih berlaku |

Artinya: data Anda **tetap tersimpan sampai Anda sendiri meminta kami
menghapusnya**. Cara memintanya ada di bagian 6.

Kami memilih menyampaikan ini apa adanya daripada mencantumkan angka yang
tidak benar-benar kami jalankan.

---

## 6. Hak Anda

Anda berhak:

- **Meminta salinan** data Anda yang kami simpan.
- **Meminta koreksi** kalau ada yang keliru.
- **Meminta penghapusan** komentar Anda beserta data yang menyertainya.
- **Menarik email Anda** dari komentar yang sudah terkirim.

**Cara memakainya:** kirim permintaan ke email di bagian 10, sebutkan artikel
dan nama yang Anda pakai saat berkomentar. **Kami menanggapi dalam 1×24
jam.**

Karena kami sengaja tidak menyimpan identitas Anda secara lengkap, untuk
sebagian permintaan kami mungkin perlu bertanya balik untuk memastikan
komentar itu memang milik Anda.

---

## 7. Keamanan

- Seluruh situs diakses lewat koneksi terenkripsi (HTTPS).
- Alamat IP tidak disimpan mentah — hanya sidiknya.
- Cookie sesi bersifat `HttpOnly` dan `Secure`.
- Akses panel pengelola dibatasi kata sandi dan pembatasan percobaan masuk.

Kami berusaha sebaik mungkin, tetapi tidak ada sistem yang sepenuhnya kebal.
Kalau terjadi kebocoran yang berdampak pada data Anda, kami akan
mengumumkannya di situs ini dan menghubungi Anda bila kami punya email Anda.

---

## 8. Anak-anak

Layanan ini ditujukan untuk pengguna berusia **13 tahun ke atas**. Kami tidak
sengaja mengumpulkan data anak di bawah usia tersebut. Kalau Anda orang tua
atau wali dan menemukan anak Anda mengirim data ke kami, hubungi kami dan
akan segera kami hapus.

---

## 9. Perubahan kebijakan

Kalau kebijakan ini berubah, kami perbarui tanggal di bagian atas. Perubahan
yang berdampak besar akan kami umumkan di halaman depan.

---

## 10. Menghubungi kami

**AMAN Digital** — usaha perorangan milik **Adya Malik**
Blangpidie, Aceh Barat Daya, Indonesia

- **Email (urusan data pribadi):** adya.malik2@gmail.com
- **WhatsApp:** +62 822-1076-8038

Untuk urusan pemberitaan — koreksi, hak jawab, atau pengaduan isi artikel —
silakan pakai kanal yang sama.
