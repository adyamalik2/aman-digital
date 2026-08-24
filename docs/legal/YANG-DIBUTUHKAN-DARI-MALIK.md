# Yang dibutuhkan dari Malik

Daftar pertanyaan yang harus dijawab sebelum draf legal bisa difinalkan.

Tidak perlu dijawab sekaligus. **Kelompok A saja sudah cukup untuk
menerbitkan Kebijakan Privasi**, yang merupakan kebutuhan paling mendesak.

---

## Kelompok A — supaya Kebijakan Privasi bisa terbit

Ini yang paling mendesak: situs sudah mengumpulkan data tanpa kebijakan apa
pun.

| # | Pertanyaan | Kenapa perlu |
|---|---|---|
| A1 | **Nama yang dipakai secara resmi** — badan usaha (PT/CV) atau perorangan? | Kebijakan privasi harus menyebut siapa yang bertanggung jawab atas data. Kalau usaha perorangan, tulis apa adanya — jangan mengaku badan usaha kalau bukan. |
| A2 | **Email untuk urusan data** | Belum ada email `@amandigital.my.id`. Sementara boleh pakai email lain, asal Anda pantau. Tanpa kanal, hak pengguna tidak bisa dipakai. |
| A3 | **Berapa lama komentar disimpan?** | Usulan: yang disetujui selama artikel tayang; yang spam dihapus tiap 90 hari. |
| A4 | **Berapa lama sidik pengunjung disimpan?** | Usulan: 90 hari, lalu tinggal angka agregat. |
| A5 | **Berapa lama kami menanggapi permintaan hapus data?** | Usulan: 7 hari kerja. |
| A6 | **Batas usia minimum pengguna** | Usulan: 17 tahun. |
| A7 | **Aplikasi (Kasir/Budget/Invoice/AMAN-in) dicakup kebijakan ini atau dibuat terpisah?** | **Rekomendasi saya: terpisah.** Aplikasi menyimpan data keuangan pengguna — jauh lebih sensitif daripada situs. Mencampurnya membuat keduanya kabur. |

> ⚠️ **Catatan penting soal A3–A4:** saat ini **belum ada mekanisme penghapusan
> berkala** di sistem. Kalau Anda menetapkan masa simpan, saya perlu
> membangunnya dulu — supaya kebijakan tidak menjanjikan sesuatu yang tidak
> berjalan. Menjanjikan lalu tidak menepati lebih buruk daripada tidak
> menjanjikan.

---

## Kelompok B — supaya Syarat & Ketentuan bisa terbit

| # | Pertanyaan | Catatan |
|---|---|---|
| B1 | **Ada refund atau tidak?** | Yang paling penting. Kalau tidak ada, katakan terus terang — itu sah, asal disampaikan sebelum pembeli bayar. Yang berbahaya justru diam. |
| B2 | **Kode akses: berapa perangkat?** | Sistem sekarang mengizinkan lebih dari satu. Batasnya berapa? |
| B3 | **Kode hilang / dibagikan ke orang lain — apa akibatnya?** | |
| B4 | **Kode kedaluwarsa?** | |
| B5 | **Arti "akses selamanya"** | Selama produk masih dioperasikan, atau tanpa syarat? Kalau produk dihentikan, pembeli dapat apa? |
| B6 | **Lisensi produk digital** | Boleh komersial? Boleh dimodifikasi? Boleh dibagikan ke tim? Boleh dijual ulang? Boleh dipakai untuk klien pembeli? |
| B7 | **Alur layanan/jasa** | Uang muka? Berapa revisi? Siapa pemilik hasil kerja? Kalau dibatalkan di tengah? |
| B8 | **Kanal koreksi/hak jawab berita** | Sama dengan WhatsApp umum, atau kanal khusus? Berapa lama ditanggapi? |
| B9 | **Teks pengungkapan afiliasi** | Kolom `affiliate_disclosure` di database **masih kosong**, jadi paragraf pengungkapan tidak pernah tampil — padahal badge "Bersponsor" sudah muncul. |
| B10 | **Penyelesaian sengketa** | Musyawarah dulu, lalu pengadilan mana? |
| B11 | **Pemilik hasil keluaran AI** | Kemungkinan besar: pengguna. Perlu ditegaskan. |

---

## Kelompok C — perlu ditinjau orang yang paham hukum

Saya bisa menyusun kalimatnya, tapi **saya bukan penasihat hukum** dan tidak
boleh dianggap begitu. Dua bagian ini sebaiknya dibaca orang yang paham
sebelum terbit:

1. **Pembatasan tanggung jawab** (bagian 12 Syarat & Ketentuan)
2. **Klaim keamanan data** — pastikan yang tertulis benar-benar sesuai
   kenyataan teknis, jangan melebih-lebihkan

---

## Yang TIDAK perlu Anda putuskan

Bagian teknis sudah saya audit langsung dari kode dan database, jadi tidak
perlu Anda jawab — sudah pasti:

- data apa yang disimpan di tabel `comments` dan `views`
- cookie apa yang dipasang dan sifatnya
- tidak adanya analitik/pelacak (sudah diverifikasi, nol)
- tidak adanya aset pihak ketiga yang dimuat di halaman
- layanan pihak ketiga yang terlibat (Cloudflare, Google Gemini, Lynk.id,
  YouTube mode privasi)
- pembayaran tidak pernah melewati server kami

---

## Saran urutan

1. **Jawab Kelompok A** → saya finalkan Kebijakan Privasi → terbit.
   Ini menutup risiko terbesar.
2. Kalau A3/A4 menetapkan masa simpan → saya bangun mekanisme
   penghapusannya.
3. **Jawab Kelompok B** perlahan → S&K menyusul.
4. Kelompok C ditinjau sebelum S&K terbit.

Kalau mau lebih cepat lagi: **B1 (refund)** sebenarnya bisa dijawab sekarang
juga dan langsung dipasang di halaman produk, terlepas dari S&K lengkapnya.
Itu pertanyaan yang paling sering muncul di benak pembeli sebelum membayar.
