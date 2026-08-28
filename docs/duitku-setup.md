# Mengaktifkan Pembayaran Duitku

Status per 28-08-2026: **kode sudah siap, kredensial belum dipasang.**
Tombol beli masih mengarah ke Lynk.id — sengaja, supaya penjualan tidak
terputus selama Duitku belum aktif.

---

## Langkah 1 — Ambil kredensial dari Duitku

1. Masuk ke dashboard Duitku, pastikan toggle kiri atas berada di **Sandbox**
2. Buka menu **Proyek Saya** (yang ada tanda seru merahnya)
3. Buat proyek baru bila belum ada — isi nama dan URL situs
   (`https://amandigital.my.id`)
4. Catat dari dalam proyek itu:
   - **Merchant Code** (sandbox biasanya diawali `DS`)
   - **API Key** / Merchant Key

> Kredensial **tidak** ada di Dashboard maupun Profil Saya. Hanya di dalam
> proyek.

---

## Langkah 2 — Pasang sebagai secret di Cloudflare

Jangan menulisnya di berkas kode mana pun. Lewat dashboard Cloudflare:

**Workers & Pages → aman-digital → Settings → Variables and Secrets**

Tambahkan tiga variabel, **semuanya bertipe Secret (Encrypted)**:

| Nama | Isi |
|---|---|
| `DUITKU_MERCHANT_CODE` | Merchant Code dari proyek |
| `DUITKU_API_KEY` | API Key dari proyek |
| `DUITKU_SANDBOX` | `1` selama masih sandbox |

Setelah disimpan, **deploy ulang** supaya variabel terbaca.

Kalau nanti sudah produksi: ganti isinya dengan kredensial produksi dan ubah
`DUITKU_SANDBOX` jadi `0`.

---

## Langkah 3 — Daftarkan URL callback di Duitku

Di pengaturan proyek Duitku, isi:

| Kolom | Nilai |
|---|---|
| Callback URL | `https://amandigital.my.id/api/duitku-callback` |
| Return URL | `https://amandigital.my.id/checkout/selesai` |

Callback URL yang salah = pembayaran masuk tapi kode akses tidak pernah
terbit.

---

## Langkah 4 — Uji di sandbox

1. Buka `https://amandigital.my.id/checkout?produk=aman-poster`
2. Isi nama & email, klik Bayar
3. Anda diarahkan ke halaman pembayaran Duitku sandbox
4. Selesaikan pembayaran memakai simulator sandbox Duitku
5. Anda kembali ke `/checkout/selesai` dan **kode akses tampil**
6. Coba kode itu di `/aman-poster/masuk` — harus bisa masuk
7. Coba kode yang sama di `/aman-engine/masuk` — **harus ditolak**
   (bukti pengikatan produk bekerja)

---

## Langkah 5 — Alihkan tombol beli

Baru **setelah** langkah 4 berhasil. Ubah tautan checkout dari Lynk.id ke
halaman sendiri:

| Berkas | Dari | Ke |
|---|---|---|
| `app/(marketing)/aman-engine/page.tsx` | `CHECKOUT` lynk.id | `/checkout?produk=aman-engine` |
| `app/(marketing)/aman-content-engine/page.tsx` | idem | `/checkout?produk=aman-content-engine` |
| `app/(marketing)/aman-poster/page.tsx` | idem | `/checkout?produk=aman-poster` |
| `app/(marketing)/digital-store/page.tsx` | idem | `/checkout?produk=produk-digital` |
| `app/(marketing)/page.tsx` | `paidProducts[].checkout` | idem, per produk |

**Jangan lakukan langkah ini sebelum langkah 4 berhasil** — kalau Duitku
belum siap, `/api/checkout` menolak dan pembeli tidak bisa membayar sama
sekali.

---

## Yang perlu diketahui soal harga

Harga ada di **dua tempat** dan keduanya harus sama:

- `functions/_lib/orders.ts` → `PRODUCTS` — **yang dipakai membuat tagihan**
- `app/(marketing)/checkout/page.tsx` → `PRODUK` — hanya untuk ditampilkan

Harga yang menentukan adalah yang di server. Kalau berbeda, pembeli melihat
satu angka tapi ditagih angka lain. **Ubah keduanya bersamaan.**

Harga di halaman produk masing-masing juga harus ikut diselaraskan.

---

## Keamanan yang sudah terpasang

| Perlindungan | Cara kerja |
|---|---|
| Harga tidak bisa dimanipulasi | Diambil dari katalog server, bukan dari kiriman browser |
| Callback palsu ditolak | Signature diverifikasi `md5(merchantCode + amount + merchantOrderId + apiKey)` |
| Nominal kurang ditolak | Jumlah dibayar dicocokkan dengan harga pesanan |
| Kode tidak terbit dua kali | Callback idempoten — pesanan berstatus `paid` langsung dibalas OK |
| Kode terikat produk | Entri ledger menyimpan `product`; login menolak kode produk lain |
| Serangan tebak | Rate limit per IP pada `/api/checkout` |

Kode akses lama yang tidak punya field `product` **tetap berlaku untuk semua
produk** — sengaja, supaya pembeli lama tidak kehilangan akses.

---

## Kalau ada pesanan bermasalah

Data pesanan ada di KV `AMAN_LEDGER` dengan awalan `order:`:

```bash
npx wrangler kv key get --remote --namespace-id bafb921cce8e4a3bb73e89db2af90b9b "order:AD..."
```

Berisi status, produk, email pembeli, dan kode akses yang diterbitkan.
