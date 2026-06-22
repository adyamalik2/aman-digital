/**
 * SATU sumber kebenaran untuk harga & fitur AMAN Digital (PRD v2.0).
 *
 * Kartu harga (`tierCards`) DAN tabel perbandingan (`comparisonRowsForGroups`)
 * sama-sama diturunkan dari `FEATURES` + `TIER_META`. Jangan pernah mengetik
 * ulang angka/fitur di page manapun — impor dari sini agar tidak bisa "drift".
 *
 * Canonical:
 *  - Tier: Gratis (Rp0) / Dasar (Rp49.000/bln) / Pro (Rp99.000/bln)
 *  - Kasir transaksi   : 100 / 500 / unlimited
 *  - Budget transaksi  : 100 / 500 / unlimited  + Goals 3 / 10 / unlimited
 *  - Invoice           : 10 / 100 / unlimited
 *  - Support WhatsApp  : 3 hari / 24 jam / prioritas 2 jam
 *  - Multi pengguna    : tidak / 2 user / 5 user
 */

export type TierKey = "gratis" | "dasar" | "pro";
export type CellValue = boolean | string;
export type FeatureGroup = "Kasir" | "Budget" | "Invoice" | "Umum";

export const TIER_ORDER: TierKey[] = ["gratis", "dasar", "pro"];

export type TierMeta = {
  key: TierKey;
  name: string;
  /** Harga bulanan & tahunan untuk ditampilkan (paid tier tanpa "Rp" — prefix
   *  ditambahkan di UI; Gratis memakai literal "Rp 0"). */
  monthly: string;
  annual: string;
  monthlyPeriod: string;
  annualPeriod: string;
  featured?: boolean;
  badge?: string;
};

export const TIER_META: Record<TierKey, TierMeta> = {
  gratis: {
    key: "gratis",
    name: "Gratis",
    monthly: "Rp 0",
    annual: "Rp 0",
    monthlyPeriod: "selamanya",
    annualPeriod: "selamanya",
  },
  dasar: {
    key: "dasar",
    name: "Dasar",
    monthly: "49rb",
    annual: "392rb",
    monthlyPeriod: "per bulan",
    annualPeriod: "per tahun (hemat Rp 196rb)",
    featured: true,
    badge: "Paling Populer",
  },
  pro: {
    key: "pro",
    name: "Pro",
    monthly: "99rb",
    annual: "792rb",
    monthlyPeriod: "per bulan",
    annualPeriod: "per tahun (hemat Rp 396rb)",
  },
};

export type Feature = {
  id: string;
  group: FeatureGroup;
  label: string;
  values: Record<TierKey, CellValue>;
};

/** Data fitur granular — sumber tunggal untuk tabel maupun kartu. */
export const FEATURES: Feature[] = [
  // ── AMAN Kasir ──
  { id: "kasir-trx", group: "Kasir", label: "Transaksi per bulan", values: { gratis: "100", dasar: "500", pro: "Unlimited" } },
  { id: "kasir-stok", group: "Kasir", label: "Stok barang", values: { gratis: true, dasar: true, pro: true } },
  { id: "kasir-laporan", group: "Kasir", label: "Laporan dasar", values: { gratis: true, dasar: true, pro: true } },
  { id: "kasir-pdf", group: "Kasir", label: "Export PDF", values: { gratis: true, dasar: true, pro: true } },
  { id: "kasir-backup-lokal", group: "Kasir", label: "Backup lokal", values: { gratis: true, dasar: true, pro: true } },
  { id: "kasir-cloud", group: "Kasir", label: "Cloud backup harian", values: { gratis: false, dasar: false, pro: true } },
  { id: "kasir-excel", group: "Kasir", label: "Export Excel", values: { gratis: false, dasar: false, pro: true } },

  // ── AMAN Budget ──
  { id: "budget-trx", group: "Budget", label: "Transaksi per bulan", values: { gratis: "100", dasar: "500", pro: "Unlimited" } },
  { id: "budget-goals", group: "Budget", label: "Goals tabungan", values: { gratis: "3", dasar: "10", pro: "Unlimited" } },
  { id: "budget-zakat", group: "Budget", label: "Kalkulator Zakat", values: { gratis: true, dasar: true, pro: true } },
  { id: "budget-aruskas", group: "Budget", label: "Laporan arus kas", values: { gratis: true, dasar: true, pro: true } },
  { id: "budget-familysync", group: "Budget", label: "Family Sync", values: { gratis: false, dasar: false, pro: true } },
  { id: "budget-reminder", group: "Budget", label: "Reminder tagihan", values: { gratis: false, dasar: false, pro: true } },
  { id: "budget-ocr", group: "Budget", label: "OCR Struk", values: { gratis: false, dasar: false, pro: true } },

  // ── AMAN Invoice ──
  { id: "invoice-count", group: "Invoice", label: "Invoice per bulan", values: { gratis: "10", dasar: "100", pro: "Unlimited" } },
  { id: "invoice-wa", group: "Invoice", label: "Kirim via WhatsApp", values: { gratis: true, dasar: true, pro: true } },
  { id: "invoice-status", group: "Invoice", label: "Status pembayaran", values: { gratis: true, dasar: true, pro: true } },
  { id: "invoice-pdf", group: "Invoice", label: "Download PDF", values: { gratis: false, dasar: true, pro: true } },
  { id: "invoice-db", group: "Invoice", label: "Database pelanggan", values: { gratis: false, dasar: true, pro: true } },
  { id: "invoice-logo", group: "Invoice", label: "Logo usaha di invoice", values: { gratis: false, dasar: false, pro: true } },
  { id: "invoice-piutang", group: "Invoice", label: "Laporan piutang", values: { gratis: false, dasar: false, pro: true } },
  { id: "invoice-jatuhtempo", group: "Invoice", label: "Pengingat jatuh tempo", values: { gratis: false, dasar: false, pro: true } },

  // ── Umum ──
  { id: "umum-support", group: "Umum", label: "Support WhatsApp", values: { gratis: "3 hari", dasar: "24 jam", pro: "Prioritas 2 jam" } },
  { id: "umum-multiuser", group: "Umum", label: "Multi pengguna", values: { gratis: false, dasar: "2 user", pro: "5 user" } },
];

const FEATURE_BY_ID: Record<string, Feature> = Object.fromEntries(
  FEATURES.map((f) => [f.id, f])
);

/** Nilai mentah satu fitur untuk satu tier (lempar error bila id salah ketik). */
export function featureValue(id: string, tier: TierKey): CellValue {
  const f = FEATURE_BY_ID[id];
  if (!f) throw new Error(`pricing: unknown feature id "${id}"`);
  return f.values[tier];
}

function bool(id: string, tier: TierKey): boolean {
  return featureValue(id, tier) === true;
}

function str(id: string, tier: TierKey): string {
  return String(featureValue(id, tier));
}

const GROUP_ORDER: FeatureGroup[] = ["Kasir", "Budget", "Invoice", "Umum"];

export type ComparisonRow =
  | { type: "group"; group: FeatureGroup }
  | { type: "feature"; label: string; values: Record<TierKey, CellValue> };

/** Baris tabel perbandingan untuk sekumpulan grup (mis. tab per-aplikasi). */
export function comparisonRowsForGroups(groups: FeatureGroup[]): ComparisonRow[] {
  const rows: ComparisonRow[] = [];
  for (const g of groups) {
    rows.push({ type: "group", group: g });
    for (const f of FEATURES) {
      if (f.group === g) rows.push({ type: "feature", label: f.label, values: f.values });
    }
  }
  return rows;
}

export const ALL_GROUPS: FeatureGroup[] = [...GROUP_ORDER];

export type TierCardFeature = { label: string; included: boolean; dim?: boolean };

/**
 * Ringkasan fitur untuk kartu harga. Label boleh diatur per tier (presentasi),
 * tetapi semua ANGKA & status diambil dari `FEATURES` lewat helper di atas
 * sehingga tidak mungkin berbeda dengan tabel perbandingan.
 */
export function tierCardFeatures(tier: TierKey): TierCardFeature[] {
  switch (tier) {
    case "gratis":
      return [
        { label: `Kasir: ${str("kasir-trx", tier)} transaksi/bln`, included: true },
        { label: `Budget: ${str("budget-trx", tier)} transaksi/bln`, included: true },
        { label: `Invoice: ${str("invoice-count", tier)} invoice/bln`, included: true },
        { label: "Stok & laporan dasar", included: bool("kasir-stok", tier) && bool("kasir-laporan", tier) },
        { label: "Backup lokal", included: bool("kasir-backup-lokal", tier) },
        { label: "Multi pengguna", included: bool("umum-multiuser", tier), dim: true },
      ];
    case "dasar":
      return [
        { label: `Kasir: ${str("kasir-trx", tier)} transaksi/bln`, included: true },
        { label: `Budget: ${str("budget-trx", tier)} transaksi/bln`, included: true },
        { label: `Invoice: ${str("invoice-count", tier)} invoice/bln`, included: true },
        { label: "Download PDF & database pelanggan", included: bool("invoice-pdf", tier) && bool("invoice-db", tier) },
        { label: `Multi pengguna: ${str("umum-multiuser", tier)}`, included: true },
        { label: `Support WhatsApp: ${str("umum-support", tier)}`, included: true },
      ];
    case "pro":
      return [
        { label: "Transaksi & invoice tak terbatas", included: true },
        { label: "Cloud backup harian & Export Excel", included: bool("kasir-cloud", tier) && bool("kasir-excel", tier) },
        { label: `Multi pengguna: ${str("umum-multiuser", tier)}`, included: true },
        { label: "Family Sync, OCR Struk & Reminder", included: bool("budget-familysync", tier) && bool("budget-ocr", tier) && bool("budget-reminder", tier) },
        { label: "Logo usaha & laporan piutang", included: bool("invoice-logo", tier) && bool("invoice-piutang", tier) },
        { label: `Support WhatsApp: ${str("umum-support", tier)}`, included: true },
      ];
  }
}
