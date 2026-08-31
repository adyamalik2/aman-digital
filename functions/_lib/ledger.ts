/**
 * ledger.ts — util kode akses bersama, dipakai semua Pages Function di
 * folder ini. Mengikuti pola aman-admin/codelib.php di situs PHP lama
 * dengan sengaja: 1 kode boleh dipakai di sampai MAX_DEVICES perangkat,
 * disimpan di satu KV namespace, bentuk data mirip agar mudah dibandingkan
 * kalau suatu saat perlu dipulihkan dari backup lama.
 *
 * "Ledger" = KV, satu key per kode:
 *   { devices: string[], via, date, buyer?, phone?, email? }
 * devices kosong = belum diaktifkan di perangkat mana pun.
 */

export const MAX_DEVICES = 5;

export type LedgerEntry = {
  devices: string[];
  via: string;
  date: string;
  buyer?: string;
  phone?: string;
  email?: string;
  /**
   * Produk yang boleh dibuka kode ini, mis. "aman-engine".
   *
   * Kode LAMA tidak punya field ini, dan sengaja tetap berlaku untuk semua
   * produk (lihat `codeAllowsProduct`) supaya pembeli lama tidak kehilangan
   * akses. Kode baru dari checkout selalu terikat satu produk.
   */
  product?: string;
  /** Pesanan yang menerbitkan kode ini, untuk penelusuran. */
  orderId?: string;
  /**
   * Kapan kode ini berhenti berlaku (ISO 8601). Hanya diisi untuk produk
   * berlangganan. Kode TANPA field ini berlaku selamanya -- itu perilaku
   * seluruh kode yang sudah terbit sebelum langganan ada, dan tidak boleh
   * berubah.
   */
  expiresAt?: string;
};

/** Kode tanpa `expiresAt` berlaku selamanya. */
export function sudahKedaluwarsa(entry: LedgerEntry, now = Date.now()): boolean {
  if (!entry.expiresAt) return false;
  const batas = Date.parse(entry.expiresAt);
  return Number.isFinite(batas) && batas < now;
}

/**
 * Ikat satu akun (uid Firebase) ke sebuah kode akses.
 *
 * Tool web mengikat kode ke cookie perangkat. AMAN-in tidak bisa begitu: ia
 * berjalan sebagai APK dan sebagai web, dan pengguna berpindah HP sambil
 * membawa akunnya. Jadi yang diikat di sini adalah uid, memakai slot yang
 * sama dengan `devices` supaya batas MAX_DEVICES tetap berlaku.
 *
 * BEDA PENTING DARI checkDevice: di sini kode WAJIB punya field `product`
 * yang cocok. `codeAllowsProduct` sengaja meloloskan kode lama tanpa field
 * itu supaya pembeli lama tidak kehilangan akses -- tapi kode-kode itu dijual
 * sebelum AMAN-in ada, jadi meloloskannya berarti membagikan produk baru
 * secara cuma-cuma.
 */
export async function bindAccount(
  kv: KVNamespace,
  code: string,
  uid: string,
  allowedProducts: string[]
): Promise<{ status: "ok" | "penuh" | "invalid" | "kedaluwarsa"; entry?: LedgerEntry }> {
  const entry = await loadEntry(kv, code);
  if (!entry) return { status: "invalid" };
  if (!entry.product || !allowedProducts.includes(entry.product)) return { status: "invalid" };
  if (sudahKedaluwarsa(entry)) return { status: "kedaluwarsa", entry };

  if (entry.devices.includes(uid)) return { status: "ok", entry };
  if (entry.devices.length >= MAX_DEVICES) return { status: "penuh", entry };

  entry.devices.push(uid);
  await saveEntry(kv, code, entry);
  return { status: "ok", entry };
}

/**
 * Apakah sebuah entri kode boleh membuka produk tertentu.
 *
 * Sebelum ada field `product`, login tiap tool hanya memeriksa "kode ini ada
 * di KV atau tidak" -- tanpa memeriksa kode itu untuk produk apa. Akibatnya
 * satu kode membuka SEMUA tool. Itu belum berbahaya selama kode diterbitkan
 * manual, tapi menjadi masalah begitu penerbitan otomatis setelah pembayaran:
 * membayar satu produk berarti mendapat semuanya.
 */
export function codeAllowsProduct(entry: LedgerEntry, productId: string): boolean {
  if (!entry.product) return true; // kode lama -- jangan diputus aksesnya
  return entry.product === productId;
}

export async function loadEntry(kv: KVNamespace, code: string): Promise<LedgerEntry | null> {
  const raw = await kv.get(code);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.devices)) parsed.devices = [];
    return parsed as LedgerEntry;
  } catch {
    return null;
  }
}

export async function saveEntry(kv: KVNamespace, code: string, entry: LedgerEntry): Promise<void> {
  await kv.put(code, JSON.stringify(entry));
}

// Indeks terbalik token->kode, key diberi awalan "tok:" supaya tidak pernah
// bentrok dengan key kode asli (kode selalu berawalan huruf produk, mis.
// "PROD-"). KV tidak punya cara memindai "cari semua kode yang punya token
// X" tanpa membaca tiap key satu per satu — untuk katalog kecil itu masih
// murah, tapi begitu nanti tool AI (lalu lintas lebih tinggi) memakai pola
// yang sama, pemindaian jadi lambat & mahal. Indeks ini membuat pencarian
// jadi satu kali baca langsung, seperti KV memang dirancang untuk itu.
const tokKey = (token: string) => `tok:${token}`;

export async function indexToken(kv: KVNamespace, token: string, code: string): Promise<void> {
  await kv.put(tokKey(token), code);
}

export async function findCodeByToken(kv: KVNamespace, token: string): Promise<string | null> {
  return await kv.get(tokKey(token));
}

export async function unindexToken(kv: KVNamespace, token: string): Promise<void> {
  await kv.delete(tokKey(token));
}

/** Token perangkat acak, dipakai sebagai isi cookie. */
export function newDeviceToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/**
 * Cek/daftarkan perangkat untuk sebuah kode.
 * Return 'ok-new' (perangkat baru terdaftar, pemanggil harus set cookie),
 * 'ok-known' (perangkat sudah dikenal), 'locked' (kuota penuh), atau
 * 'invalid' (kode tidak ada di ledger sama sekali).
 */
export async function checkDevice(
  kv: KVNamespace,
  code: string,
  cookieToken: string | null,
  /** Produk yang sedang dibuka. Kalau diisi, kode terikat produk lain ditolak. */
  productId?: string
): Promise<{ status: "ok-new" | "ok-known" | "locked" | "invalid"; token?: string }> {
  const entry = await loadEntry(kv, code);
  if (!entry) return { status: "invalid" };
  // Kode milik produk lain diperlakukan sama seperti kode tidak dikenal --
  // jangan membocorkan bahwa kodenya sebenarnya ada.
  if (productId && !codeAllowsProduct(entry, productId)) return { status: "invalid" };

  if (cookieToken && entry.devices.includes(cookieToken)) {
    return { status: "ok-known" };
  }
  if (entry.devices.length >= MAX_DEVICES) {
    return { status: "locked" };
  }

  const token = newDeviceToken();
  entry.devices.push(token);
  await saveEntry(kv, code, entry);
  await indexToken(kv, token, code);
  return { status: "ok-new", token };
}

/**
 * Lepas satu token perangkat, dari kode manapun ia terdaftar (untuk logout).
 * Dipanggil hanya dengan token dari cookie — tidak perlu tahu kodenya lebih
 * dulu, karena itu justru yang dicari lewat indeks terbalik.
 */
export async function removeDeviceByToken(kv: KVNamespace, token: string): Promise<boolean> {
  const code = await findCodeByToken(kv, token);
  if (!code) return false;
  const entry = await loadEntry(kv, code);
  if (!entry) { await unindexToken(kv, token); return false; }
  entry.devices = entry.devices.filter((t) => t !== token);
  await saveEntry(kv, code, entry);
  await unindexToken(kv, token);
  return true;
}

/** Ambil nilai satu cookie dari header Cookie mentah. */
export function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Header Set-Cookie dengan atribut aman standar, umur 1 tahun. */
export function setDeviceCookieHeader(name: string, value: string, path: string): string {
  const maxAge = 60 * 60 * 24 * 365;
  return `${name}=${encodeURIComponent(value)}; Path=${path}; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=Lax`;
}

/** Header Set-Cookie untuk menghapus cookie perangkat (logout). */
export function clearCookieHeader(name: string, path: string): string {
  return `${name}=; Path=${path}; Max-Age=0; Secure; HttpOnly; SameSite=Lax`;
}
