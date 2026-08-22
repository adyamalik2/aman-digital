/**
 * affiliateImport.ts — parser impor massal produk afiliasi, dipindah PERSIS
 * dari newsroom/afiliasi.php (nr_aff_parse() dkk). Ini logika yang sudah
 * lolos beberapa putaran perbaikan bug nyata (lihat komentar tiap aturan) --
 * ditulis ulang ke TypeScript, bukan didesain ulang, supaya bug yang sudah
 * pernah diperbaiki di versi PHP tidak muncul lagi di sini.
 */

export type AffRow = {
  title: string;
  url: string;
  price: string;
  merchant: string;
  image: string;
  error: string;
  warn: string;
  raw: string;
};

/** Host tautan pendek yang MEMBAWA pelacakan afiliasi (lihat catatan asli di afiliasi.php). */
const SHORTLINK_HOSTS = [
  "s.shopee.co.id", "shope.ee", "shp.ee", "tokopedia.link",
  "vt.tokopedia.com", "s.lazada.co.id", "c.lazada.co.id", "invol.co",
];

function urlScore(u: string): number {
  let score = 0;
  try {
    const host = new URL(u).host.toLowerCase();
    if (SHORTLINK_HOSTS.includes(host)) score += 100;
  } catch {
    // bukan URL valid, skor 0
  }
  if (/[?&](utm_|aff|affiliate|trackid|mmp_pid)/i.test(u)) score += 50;
  return score;
}

/** Pecah satu baris CSV (koma/titik-koma) menghormati tanda kutip, atau split biasa untuk tab/pipa. */
function splitLine(line: string, delim: string): string[] {
  if (delim === "," || delim === ";") {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
        } else {
          cur += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === delim) {
        out.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  }
  return line.split(delim).map((s) => s.trim());
}

/** Tentukan pemisah dari konsistensi jumlah kolom (modus), bukan dari ada/tidaknya karakter. */
function detectDelim(lines: string[]): string {
  let best = "|";
  let bestScore = 0;
  for (const d of ["\t", ",", ";", "|"]) {
    const freq: Record<number, number> = {};
    for (const l of lines) {
      const n = splitLine(l, d).length;
      freq[n] = (freq[n] || 0) + 1;
    }
    let modal = 1;
    let modalN = 0;
    for (const [nStr, c] of Object.entries(freq)) {
      const n = Number(nStr);
      if (c > modalN || (c === modalN && n > modal)) { modal = n; modalN = c; }
    }
    if (modal < 2) continue;
    const score = modal * (modalN / Math.max(1, lines.length));
    if (score > bestScore) { bestScore = score; best = d; }
  }
  return bestScore > 0 ? best : "|";
}

export function parseAffiliateBulk(raw: string): AffRow[] {
  raw = raw.replace(/^﻿/, ""); // buang BOM
  const lines = raw
    .split(/\r\n|\r|\n/)
    .map((l) => l.trim())
    .filter((l) => l !== "" && !l.startsWith("#"));
  if (!lines.length) return [];

  const delim = detectDelim(lines);
  const positional = delim === "|";
  const out: AffRow[] = [];

  for (const line of lines) {
    const cols = splitLine(line, delim);
    const row: AffRow = { title: "", url: "", price: "", merchant: "", image: "", error: "", warn: "", raw: line };

    if (positional) {
      row.title = cols[0] || "";
      row.url = cols[1] || "";
      row.price = cols[2] || "";
      row.merchant = cols[3] || "";
      row.image = cols[4] || "";
    } else {
      const urls: string[] = [];
      const leftover: string[] = [];

      for (const cellRaw of cols) {
        const cell = cellRaw;
        if (cell === "") continue;

        const isUrl = /^https?:\/\//i.test(cell);
        const isImg = isUrl && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(cell);
        const isMediaPath = /^\d{4}\/\d{2}\/[\w.-]+\.(jpe?g|png|webp)$/i.test(cell);

        if ((isImg || isMediaPath) && row.image === "") { row.image = cell; continue; }
        if (isUrl) { urls.push(cell); continue; }

        // ID produk / angka panjang tanpa pemisah -- bukan harga & bukan judul.
        if (/^\d{5,}$/.test(cell)) continue;
        // Jumlah terjual: "10RB+", "53", dst.
        if (/^[\d.,]+\s*(rb|jt|k)?\+$/i.test(cell)) continue;
        if (/^\d{1,4}$/.test(cell)) continue;
        // Persentase komisi.
        if (/^[\d.,]+\s*%$/.test(cell)) continue;
        if (/\b(terjual|sold)\b/i.test(cell)) continue;
        if (/komisi|commission/i.test(cell)) continue;

        // Nilai uang: "Rp24.800" / "155,0RB" / "1.234.567" -- yang pertama jadi
        // harga, sisanya DIBUANG (jangan sampai nilai komisi jadi nama toko).
        const looksMoney =
          /^rp\s*[\d.,]+$/i.test(cell) ||
          /^[\d][\d.,]*\s*(rb|jt|k)$/i.test(cell) ||
          /^\d{1,3}([.,]\d{3})+$/.test(cell);
        if (looksMoney) {
          if (row.price === "") row.price = cell;
          continue;
        }

        leftover.push(cell);
      }

      if (urls.length) {
        urls.sort((a, b) => urlScore(b) - urlScore(a));
        row.url = urls[0];
      }

      if (leftover.length) {
        leftover.sort((a, b) => b.length - a.length);
        row.title = leftover[0];
        if (leftover[1]) row.merchant = leftover[1];
      }
    }

    // Baris judul tabel: tanpa URL + memuat kata kunci header -> lewati diam-diam.
    if (row.url === "" && /(nama produk|link produk|product name|id produk|harga|price|tautan|url|komisi)/i.test(line)) {
      continue;
    }
    if (row.title === "" && row.url === "") continue;

    if (row.url === "") {
      row.error = "tautan tidak ditemukan";
    } else if (!/^https?:\/\//i.test(row.url) || !isValidUrl(row.url)) {
      row.error = "tautan tidak valid";
    } else if (row.url.length > 490) {
      row.error = "tautan terlalu panjang";
    } else if (row.title === "") {
      row.error = "nama produk tidak ditemukan";
    } else if (!positional && urlScore(row.url) === 0) {
      row.warn = "tautan ini tidak terlihat berkomisi";
    }

    row.title = row.title.slice(0, 155);
    row.merchant = row.merchant.slice(0, 55);
    out.push(row);
  }

  return out;
}

function isValidUrl(u: string): boolean {
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
}
