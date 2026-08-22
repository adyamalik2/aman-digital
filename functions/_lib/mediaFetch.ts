/**
 * mediaFetch.ts — tarik gambar dari URL eksternal ke Media Library (R2)
 * sendiri. Port dari news_media_fetch_remote() di berita/inc/media.php,
 * dipakai afiliasi.php untuk "tarik gambar produk yang masih menumpang di
 * CDN toko". Validasi tipe file lewat magic bytes (bukan cuma percaya
 * header Content-Type dari server luar), sama seperti getimagesize() di
 * versi PHP.
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB, sama dengan batas unggah manual

function sniffImageType(buf: ArrayBuffer): { mime: string; ext: string } | null {
  const b = new Uint8Array(buf.slice(0, 12));
  if (b[0] === 0xff && b[1] === 0xd8) return { mime: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: "image/png", ext: "png" };
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return { mime: "image/gif", ext: "gif" };
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50)
    return { mime: "image/webp", ext: "webp" };
  return null;
}

export type FetchRemoteResult = { ok: true; url: string } | { ok: false; error: string };

export async function fetchRemoteImage(bucket: R2Bucket, url: string): Promise<FetchRemoteResult> {
  if (!/^https:\/\//i.test(url)) return { ok: false, error: "URL harus https://" };

  let res: Response;
  try {
    res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; AMANNewsBot/1.0)" } });
  } catch {
    return { ok: false, error: "Gambar tidak bisa diunduh." };
  }
  if (!res.ok) return { ok: false, error: `Server gambar membalas HTTP ${res.status}.` };

  const buf = await res.arrayBuffer();
  if (buf.byteLength === 0) return { ok: false, error: "Gambar kosong." };
  if (buf.byteLength > MAX_BYTES) return { ok: false, error: "Gambar terlalu besar (maks 8MB)." };

  const type = sniffImageType(buf);
  if (!type) return { ok: false, error: "Berkas yang diunduh bukan gambar JPG/PNG/WebP/GIF." };

  const rand = crypto.randomUUID().slice(0, 8);
  const date = new Date().toISOString().slice(0, 10);
  const key = `${date}/${rand}.${type.ext}`;
  await bucket.put(key, buf, { httpMetadata: { contentType: type.mime } });

  return { ok: true, url: `/media/${key}` };
}
