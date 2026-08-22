/* ==========================================================
   app.js — AMAN Poster Generator (vanilla JS, tanpa build).
   Tool INI hanya MERACIK PROMPT (JSON + teks) untuk poster — tidak generate
   gambar (hemat biaya, tanpa billing). Prompt hasilnya tinggal disalin ke
   Canva Magic Media / ChatGPT / Gemini / AI gambar lain.
   Tombol bantu AI memakai proxy.php (model teks, gratis). Akses di-gate sesi login.
   ========================================================== */
'use strict';

const apiUrl = '/aman-poster/proxy';
let lastPromptData = null; // objek JSON prompt terakhir

// --- DOM ELEMENTS ---
const generateBtn = document.getElementById('generate-btn');
const emptyState = document.getElementById('empty-state');
const jsonOutput = document.getElementById('json-output');
const modelBadge = document.getElementById('model-badge');
const copyJsonBtn = document.getElementById('copy-json-btn');
const copyCanvaBtn = document.getElementById('copy-canva-btn');

const resetBtn = document.getElementById('reset-btn');
const confirmModal = document.getElementById('confirm-modal');
const confirmResetBtn = document.getElementById('confirm-reset-btn');
const cancelResetBtn = document.getElementById('cancel-reset-btn');

const btnHeadline = document.getElementById('btn-idea-headline');
const inputHeadline = document.getElementById('headline-text');
const btnEnhance = document.getElementById('btn-enhance-desc');
const inputDesc = document.getElementById('product-desc');
const btnCta = document.getElementById('btn-idea-cta');
const inputCta = document.getElementById('contact-text');
const btnUsp = document.getElementById('btn-idea-usp');
const btnPrice = document.getElementById('btn-idea-price');
const marketingSection = document.getElementById('marketing-tips-section');
const btnGetTips = document.getElementById('btn-get-tips');
const marketingContent = document.getElementById('marketing-tips-content');
const inputPrice = document.getElementById('price-text');
const inputBrand = document.getElementById('brand-name');
const inputTarget = document.getElementById('target-audience');
const inputUsp = document.getElementById('selling-point');
const inputColor = document.getElementById('color-palette');
const inputContentDetails = document.getElementById('content-details');
const labelContentDetails = document.getElementById('label-content-details');
const btnContent = document.getElementById('btn-idea-content');

const selectCategory = document.getElementById('business-category');
const manualCategory = document.getElementById('business-category-manual');
const selectStyle = document.getElementById('visual-style-select');
const manualStyle = document.getElementById('visual-style-manual');
const selectMood = document.getElementById('lighting-mood');
const manualMood = document.getElementById('lighting-mood-manual');
const selectOrientation = document.getElementById('orientation-select');
const manualOrientation = document.getElementById('orientation-manual');
const selectDesignType = document.getElementById('design-type-select');
const manualDesignType = document.getElementById('design-type-manual');

// --- DYNAMIC UI CONFIGURATION ---
const categoryConfig = {
  'edukasi': {
    brandPlaceholder: 'Contoh: AMAN DIGITAL / Les Privat Cerdas',
    headlinePlaceholder: 'Contoh: YUK, JADI JAGOAN KOMPUTER CILIK!',
    uspPlaceholder: 'Contoh: Belajar Seru, Aman, Guru Sabar',
    pricePlaceholder: 'Contoh: HANYA Rp 199.000 / Bulan',
    contactPlaceholder: 'Contoh: WA: 0811-XXXX-XXXX',
    targetPlaceholder: 'Contoh: Siswa SD & SMP, Orang Tua',
    colorPlaceholder: 'Contoh: Biru, Kuning, Hijau Cerah',
    label: 'Detail Materi / Kurikulum',
    placeholder: '- Kurikulum SD: Word, Excel, PPT\n- Jadwal: Senin-Jumat 15.00\n- Fasilitas: 1 Anak 1 PC',
    designTypes: [
      {val: 'Poster Promosi', txt: '🖼️ Poster Promosi (Standar)'},
      {val: 'Brosur Pendaftaran', txt: '📄 Brosur Pendaftaran (Detail)'},
      {val: 'Jadwal Pelajaran', txt: '📅 Jadwal Pelajaran'},
      {val: 'Sertifikat', txt: '📜 Sertifikat / Piagam'},
      {val: 'Spanduk Sekolah', txt: '🚩 Spanduk Sekolah'},
      {val: 'Konten Sosmed', txt: '📱 Konten Sosmed'}
    ]
  },
  'teknologi': {
    brandPlaceholder: 'Contoh: Abdaya Komputer / Tech Zone',
    headlinePlaceholder: 'Contoh: Laptop Gaming Murah Meriah!',
    uspPlaceholder: 'Contoh: Garansi Resmi, Gratis Instalasi',
    pricePlaceholder: 'Contoh: Diskon 2 Juta Hari Ini!',
    contactPlaceholder: 'Contoh: DM Instagram @abdayacomputer',
    targetPlaceholder: 'Contoh: Gamer, Konten Kreator, Kantor',
    colorPlaceholder: 'Contoh: Hitam, Neon Blue, Silver',
    label: 'Spesifikasi Teknis / Daftar Barang',
    placeholder: '- Processor: Intel Core i5\n- RAM: 8GB DDR4\n- SSD: 512GB NVMe\n- Bonus: Mouse Wireless',
    designTypes: [
      {val: 'Poster Promo', txt: '🖼️ Poster Promo (Standar)'},
      {val: 'Brosur Spesifikasi', txt: '📄 Brosur Spesifikasi (Detail)'},
      {val: 'Daftar Harga (Pricelist)', txt: '💰 Daftar Harga (Pricelist)'},
      {val: 'Banner Toko', txt: '🚩 Banner Toko'},
      {val: 'Review Produk', txt: '📱 Review Produk (Sosmed)'}
    ]
  },
  'kuliner': {
    brandPlaceholder: 'Contoh: Burger Bang Jago / Kopi Senja',
    headlinePlaceholder: 'Contoh: Promo Jumat Berkah: Beli 1 Gratis 1',
    uspPlaceholder: 'Contoh: Rasa Bintang Lima, Harga Kaki Lima',
    pricePlaceholder: 'Contoh: Mulai Rp 15.000 Aja',
    contactPlaceholder: 'Contoh: Gofood / Grabfood: Burger Bang Jago',
    targetPlaceholder: 'Contoh: Pecinta Pedas, Mahasiswa, Keluarga',
    colorPlaceholder: 'Contoh: Merah, Kuning, Oranye (Menggugah Selera)',
    label: 'Daftar Menu / Paket Hemat',
    placeholder: '- Paket Kenyang: Nasi + Ayam + Teh\n- Menu Andalan: Kopi Gula Aren\n- Diskon Jumat Berkah',
    designTypes: [
      {val: 'Poster Menu', txt: '🖼️ Poster Menu (Standar)'},
      {val: 'Buku Menu', txt: '📖 Buku Menu (Detail)'},
      {val: 'Tent Card Meja', txt: '⛺ Tent Card Meja'},
      {val: 'Voucher Diskon', txt: '🎫 Voucher Diskon'},
      {val: 'Banner Stand', txt: '🚩 Banner Stand (X-Banner)'}
    ]
  },
  'fashion': {
    brandPlaceholder: 'Contoh: Outfit Kekinian / Hijab Style',
    headlinePlaceholder: 'Contoh: New Collection Arrival!',
    uspPlaceholder: 'Contoh: Bahan Premium, Jahitan Rapi',
    pricePlaceholder: 'Contoh: Diskon 50% All Item',
    contactPlaceholder: 'Contoh: Shopee: OutfitKekinian_Official',
    targetPlaceholder: 'Contoh: Wanita Karir, Remaja Putri',
    colorPlaceholder: 'Contoh: Pastel, Earth Tone, Monochrome',
    label: 'Detail Ukuran / Bahan / Koleksi',
    placeholder: '- Bahan: Cotton Combed 30s\n- Size Chart: S, M, L, XL\n- Warna: Hitam, Putih, Sage',
    designTypes: [
      {val: 'Poster Sale', txt: '🖼️ Poster Sale (Standar)'},
      {val: 'Flyer Promo', txt: '📄 Flyer Promo Fashion'},
      {val: 'Lookbook / Katalog', txt: '📖 Lookbook / Katalog'},
      {val: 'Story OOTD', txt: '📱 Story OOTD'},
      {val: 'Label Harga', txt: '🏷️ Label Harga'},
      {val: 'Banner Toko', txt: '🚩 Banner Toko'}
    ]
  },
  'jasa': {
    brandPlaceholder: 'Contoh: Bengkel Motor Kilat / Laundry Bersih',
    headlinePlaceholder: 'Contoh: Servis AC Bergaransi Dingin!',
    uspPlaceholder: 'Contoh: Teknisi Sertifikat, Pengerjaan Cepat',
    pricePlaceholder: 'Contoh: Cuci 1 PK Cuma 75rb',
    contactPlaceholder: 'Contoh: Telp/WA: 0812-3456-7890',
    targetPlaceholder: 'Contoh: Ibu Rumah Tangga, Kantor',
    colorPlaceholder: 'Contoh: Biru Tua, Putih, Bersih',
    label: 'Daftar Layanan / Service',
    placeholder: '- Cuci AC Split 0.5 - 1 PK\n- Tambah Freon R32\n- Garansi Kebocoran 30 Hari',
    designTypes: [
      {val: 'Poster Jasa', txt: '🖼️ Poster Jasa (Standar)'},
      {val: 'Flyer Layanan', txt: '📄 Flyer Layanan (Detail)'},
      {val: 'Kartu Nama', txt: '💳 Kartu Nama'},
      {val: 'Banner Bengkel', txt: '🚩 Banner Bengkel/Toko'}
    ]
  },
  'properti': {
    brandPlaceholder: 'Contoh: Grand Wisata Residence',
    headlinePlaceholder: 'Contoh: Rumah Idaman DP 0 Rupiah',
    uspPlaceholder: 'Contoh: Lokasi Strategis, Bebas Banjir',
    pricePlaceholder: 'Contoh: Cicilan Mulai 2 Jutaan',
    contactPlaceholder: 'Contoh: Hubungi Marketing: 0813-XXXX-XXXX',
    targetPlaceholder: 'Contoh: Pasangan Muda, Investor',
    colorPlaceholder: 'Contoh: Gold, Navy, Putih Elegan',
    label: 'Fasilitas / Spesifikasi Bangunan',
    placeholder: '- Luas Tanah: 90m2\n- 2 Kamar Tidur, 1 KM\n- Carport, Taman, Air PDAM',
    designTypes: [
      {val: 'Poster Jual', txt: '🖼️ Poster Jual (Standar)'},
      {val: 'Brosur Perumahan', txt: '📄 Brosur Perumahan (Detail)'},
      {val: 'Flyer Open House', txt: '🏡 Flyer Open House'},
      {val: 'Spanduk Lokasi', txt: '🚩 Spanduk Lokasi'}
    ]
  },
  'event': {
    brandPlaceholder: 'Contoh: Music Fest 2025 / Seminar Nasional',
    headlinePlaceholder: 'Contoh: Konser Amal Peduli Sesama',
    uspPlaceholder: 'Contoh: Guest Star Papan Atas, Tiket Terbatas',
    pricePlaceholder: 'Contoh: Presale 1: Rp 50.000',
    contactPlaceholder: 'Contoh: Tiket Box: Loket.com',
    targetPlaceholder: 'Contoh: Anak Muda, Pecinta Musik',
    colorPlaceholder: 'Contoh: Warni-warni, Gelap Neon',
    label: 'Lineup Artis / Rundown Acara',
    placeholder: '- Guest Star: Band A, Penyanyi B\n- Open Gate: 15.00 WIB\n- Lokasi: Lapangan Merdeka',
    designTypes: [
      {val: 'Poster Konser', txt: '🖼️ Poster Konser (Standar)'},
      {val: 'Rundown Acara', txt: '📅 Rundown Acara'},
      {val: 'Tiket / Undangan', txt: '🎫 Tiket / Undangan'},
      {val: 'Backdrop Panggung', txt: '🎭 Backdrop Panggung'}
    ]
  },
  'percetakan': {
    brandPlaceholder: 'Contoh: Cetak Kilat 24 Jam / Print Station',
    headlinePlaceholder: 'Contoh: Cetak Spanduk Ditunggu Jadi!',
    uspPlaceholder: 'Contoh: Mesin Terbaru, Warna Tajam',
    pricePlaceholder: 'Contoh: Spanduk Rp 15.000/meter',
    contactPlaceholder: 'Contoh: Kirim File ke: email@print.com',
    targetPlaceholder: 'Contoh: UMKM, Mahasiswa, Kantor',
    colorPlaceholder: 'Contoh: CMYK (Cyan Magenta Yellow Black)',
    label: 'Daftar Produk / Layanan Cetak',
    placeholder: '- Cetak Spanduk Kilat 1 Jam\n- Kartu Nama Full Color\n- Sticker A3+ Kiss Cut',
    designTypes: [
      {val: 'Poster Promo Cetak', txt: '🖼️ Poster Promo (Standar)'},
      {val: 'Flyer / Brosur', txt: '📄 Flyer / Brosur Cetak'},
      {val: 'Banner Spanduk', txt: '🚩 Banner / Spanduk'},
      {val: 'Kartu Nama', txt: '💳 Kartu Nama'},
      {val: 'Stiker Label', txt: '🏷️ Stiker Label'},
      {val: 'Kalender Dinding/Meja', txt: '📅 Kalender'}
    ]
  },
  'umum': {
    brandPlaceholder: 'Contoh: Nama Brand Anda',
    headlinePlaceholder: 'Contoh: Headline Promo Menarik',
    uspPlaceholder: 'Contoh: Keunggulan Produk Anda',
    pricePlaceholder: 'Contoh: Harga Spesial',
    contactPlaceholder: 'Contoh: Info Kontak',
    targetPlaceholder: 'Contoh: Target Pasar Anda',
    colorPlaceholder: 'Contoh: Warna Identitas Brand',
    label: 'Detail Informasi Tambahan',
    placeholder: '- Poin 1...\n- Poin 2...\n- Catatan Penting...',
    designTypes: [
      {val: 'Poster Umum', txt: '🖼️ Poster Umum'},
      {val: 'Pengumuman', txt: '📢 Pengumuman'},
      {val: 'Kartu Ucapan', txt: '💌 Kartu Ucapan'},
      {val: 'Quote Motivasi', txt: '💬 Quote Motivasi'}
    ]
  }
};

function updateUIBasedOnCategory() {
  let cat = selectCategory.value;
  if (cat === 'other') cat = 'umum';
  const config = categoryConfig[cat];
  if (!config) return;

  inputBrand.placeholder = config.brandPlaceholder;
  inputHeadline.placeholder = config.headlinePlaceholder;
  inputUsp.placeholder = config.uspPlaceholder;
  inputPrice.placeholder = config.pricePlaceholder;
  inputCta.placeholder = config.contactPlaceholder;
  inputTarget.placeholder = config.targetPlaceholder;
  inputColor.placeholder = config.colorPlaceholder;
  labelContentDetails.innerText = config.label;
  inputContentDetails.placeholder = config.placeholder;

  selectDesignType.innerHTML = '';
  config.designTypes.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.val;
    option.innerText = opt.txt;
    selectDesignType.appendChild(option);
  });
  const otherOpt = document.createElement('option');
  otherOpt.value = 'other';
  otherOpt.innerText = '✏️ Lainnya (Ketik Sendiri)';
  selectDesignType.appendChild(otherOpt);
  manualDesignType.classList.add('hidden-input');
}

selectCategory.addEventListener('change', updateUIBasedOnCategory);
updateUIBasedOnCategory();

// --- TOGGLE MANUAL INPUTS ---
function setupCustomInput(selectElem, inputElem) {
  selectElem.addEventListener('change', () => {
    if (selectElem.value === 'other') {
      inputElem.classList.remove('hidden-input');
      inputElem.focus();
    } else {
      inputElem.classList.add('hidden-input');
    }
  });
}
setupCustomInput(selectCategory, manualCategory);
setupCustomInput(selectStyle, manualStyle);
setupCustomInput(selectMood, manualMood);
setupCustomInput(selectOrientation, manualOrientation);
setupCustomInput(selectDesignType, manualDesignType);

// --- RESET ---
resetBtn.addEventListener('click', () => confirmModal.classList.remove('hidden-input'));
cancelResetBtn.addEventListener('click', () => confirmModal.classList.add('hidden-input'));

confirmResetBtn.addEventListener('click', () => {
  [inputBrand, inputHeadline, inputDesc, inputPrice, inputCta, inputTarget, inputUsp, inputColor, inputContentDetails,
   manualCategory, manualStyle, manualMood, manualOrientation, manualDesignType].forEach(el => el.value = '');

  selectCategory.value = 'edukasi';
  updateUIBasedOnCategory();
  manualCategory.classList.add('hidden-input');
  selectStyle.value = '3d-cartoon'; manualStyle.classList.add('hidden-input');
  selectOrientation.value = 'square'; manualOrientation.classList.add('hidden-input');
  selectMood.value = 'bright'; manualMood.classList.add('hidden-input');
  manualDesignType.classList.add('hidden-input');

  lastPromptData = null;
  jsonOutput.textContent = '';
  jsonOutput.classList.add('hidden-input');
  emptyState.classList.remove('hidden-input');
  marketingSection.classList.add('hidden-input');

  confirmModal.classList.add('hidden-input');
  showToast('Formulir berhasil dibersihkan!');
});

// --- CLIPBOARD (robust fallback) ---
function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).catch(() => {}); return; }
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (err) { /* ignore */ }
  document.body.removeChild(ta);
}

copyJsonBtn.addEventListener('click', () => {
  if (!lastPromptData) { showToast('Klik "Buat Prompt" dulu.'); return; }
  copyTextToClipboard(JSON.stringify(lastPromptData, null, 2));
  showToast('Prompt JSON berhasil disalin!');
});

copyCanvaBtn.addEventListener('click', () => {
  if (!lastPromptData) { showToast('Klik "Buat Prompt" dulu.'); return; }
  copyTextToClipboard(lastPromptData.visual_description || '');
  showToast('Teks visual (untuk Canva) berhasil disalin!');
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').innerText = msg;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- BACKEND (proxy.php) — hanya untuk bantuan teks AI ---
async function callBackend(action, payload = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      signal: controller.signal,
      body: JSON.stringify({ action, ...payload })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      if (response.status === 401) throw new Error('Sesi habis. Muat ulang halaman lalu masuk lagi dengan kode akses.');
      throw new Error(data.message || `Server error (${response.status})`);
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Permintaan terlalu lama. Silakan coba lagi.');
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callGeminiText(prompt) {
  const result = await callBackend('text', { prompt });
  return result.text || 'Maaf, AI sedang sibuk.';
}

function getFinalValue(selectElem, manualElem, defaultVal = '') {
  if (selectElem.value === 'other') return manualElem.value || defaultVal;
  return selectElem.value;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function renderAiText(value) {
  let safe = escapeHtml(value);
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return safe.replace(/\n/g, '<br>');
}

// --- STATUS badge ---
window.addEventListener('load', async () => {
  try {
    const status = await callBackend('status');
    if (status.configured && status.transport !== 'none') {
      modelBadge.innerText = `Bantuan AI Aktif`;
      modelBadge.className = 'badge ok';
    } else if (!status.configured) {
      modelBadge.innerText = 'API Key Belum Diisi';
      modelBadge.className = 'badge err';
    } else {
      modelBadge.innerText = 'Transport PHP Tidak Aktif';
      modelBadge.className = 'badge err';
    }
  } catch (error) {
    modelBadge.innerText = 'Bantuan AI Offline';
    modelBadge.className = 'badge warn';
  }
});

// --- AI: helper untuk tombol kecil ---
async function runAiButton(btn, loadingLabel, task) {
  const original = btn.innerHTML;
  btn.innerHTML = `<span class="loader-sm"></span> ${loadingLabel}`;
  btn.disabled = true;
  try { await task(); }
  catch (e) { console.error(e); showToast(e.message || 'Gagal memproses AI.'); }
  finally { btn.innerHTML = original; btn.disabled = false; }
}

btnHeadline.addEventListener('click', () => runAiButton(btnHeadline, 'Loading...', async () => {
  const category = getFinalValue(selectCategory, manualCategory);
  const brand = inputBrand.value || 'Brand Saya';
  const target = inputTarget.value || 'Umum';
  const usp = inputUsp.value || '';
  const prompt = `Perbaiki dan pertajam headline promosi berikut agar lebih catchy, menjual, dan profesional.\n\nKonteks Lengkap:\n1. Bisnis: ${category}\n2. Nama Brand: ${brand}\n3. Target Audiens: ${target}\n4. Keunggulan Utama (USP): ${usp}\n5. Ide Kasar User: "${inputHeadline.value}" (Referensi utama)\n\nTugas:\nBuat 1 variasi headline terbaik yang pendek (maks 5-7 kata). Pastikan bahasa cocok dengan 'Target Audiens'.\nOutput HANYA teks headline-nya saja.`;
  const result = await callGeminiText(prompt);
  inputHeadline.value = result.trim().replace(/^"|"$/g, '');
  showToast('Headline berhasil diperbaiki!');
}));

btnUsp.addEventListener('click', () => runAiButton(btnUsp, 'Loading...', async () => {
  const category = getFinalValue(selectCategory, manualCategory);
  const brand = inputBrand.value || 'Brand Saya';
  const target = inputTarget.value || 'Umum';
  const prompt = `Bertindaklah sebagai strategi marketing ahli. Rumuskan 3 poin Keunggulan Utama (USP) yang singkat, padat, dan menarik untuk bisnis ini.\n\nKonteks:\n1. Kategori: ${category}\n2. Brand: ${brand}\n3. Target Audiens: ${target}\n4. Draft User: "${inputUsp.value}" (Gunakan ini sebagai basis jika ada)\n\nInstruksi:\n- Buat 3 poin singkat dipisahkan koma atau strip. Contoh: "Garansi Resmi, Gratis Ongkir, Teknisi Bersertifikat".\n- Fokus pada manfaat bagi customer (benefit-oriented).\n- Bahasa Indonesia yang menjual.\n- Output HANYA teks USP-nya saja.`;
  const result = await callGeminiText(prompt);
  inputUsp.value = result.trim().replace(/^"|"$/g, '');
  showToast('Ide Keunggulan berhasil dibuat!');
}));

btnPrice.addEventListener('click', () => runAiButton(btnPrice, 'Loading...', async () => {
  const category = getFinalValue(selectCategory, manualCategory);
  const brand = inputBrand.value || 'Brand Saya';
  const target = inputTarget.value || 'Umum';
  const prompt = `Bertindaklah sebagai copywriter penjualan. Buatkan 1 kalimat penawaran harga atau promo yang SANGAT MENARIK, SINGKAT, dan PSIKOLOGIS untuk poster.\n\nKonteks:\n1. Kategori: ${category}\n2. Brand: ${brand}\n3. Target: ${target}\n4. Draft User: "${inputPrice.value}" (Gunakan ini sebagai basis jika ada)\n\nInstruksi:\n- Buat kalimat singkat (max 5-7 kata).\n- Gunakan teknik psikologi harga (misal: "Hanya", "Mulai dari", "Diskon", "Terbatas").\n- Output HANYA teks promo-nya saja tanpa tanda kutip.`;
  const result = await callGeminiText(prompt);
  inputPrice.value = result.trim().replace(/^"|"$/g, '');
  showToast('Ide Promo berhasil dibuat!');
}));

btnCta.addEventListener('click', () => runAiButton(btnCta, 'Loading...', async () => {
  const category = getFinalValue(selectCategory, manualCategory);
  const brand = inputBrand.value || 'Brand Saya';
  const headline = inputHeadline.value || 'Promo';
  const price = inputPrice.value || 'Harga Spesial';
  const usp = inputUsp.value || '';
  const prompt = `Buatkan 1 kalimat Call to Action (CTA) pendek & nendang.\n\nKonteks:\n1. Brand: ${brand} (${category})\n2. Headline: "${headline}"\n3. Harga: "${price}"\n4. Keunggulan: "${usp}"\n\nInstruksi:\n- CTA harus memicu urgensi atau rasa ingin tahu.\n- Jika ada keunggulan (misal: Garansi), bisa diselipkan sedikit.\n- Output HANYA teks CTA.\n- Gunakan placeholder [No WA] atau [Link].`;
  const result = await callGeminiText(prompt);
  inputCta.value = result.trim().replace(/^"|"$/g, '');
  showToast('Ide CTA berhasil dibuat!');
}));

btnContent.addEventListener('click', () => runAiButton(btnContent, 'Ngarang Isi...', async () => {
  const category = getFinalValue(selectCategory, manualCategory);
  const designType = getFinalValue(selectDesignType, manualDesignType, 'Flyer');
  const brand = inputBrand.value || 'Brand Saya';
  const target = inputTarget.value || 'Umum';
  const currentLabel = labelContentDetails.innerText;
  const prompt = `Buatkan detail isi materi (poin-poin) untuk desain grafis berikut.\n\nKonteks:\n1. Jenis Desain: ${designType}\n2. Kategori Usaha: ${category}\n3. Brand: ${brand}\n4. Target: ${target}\n5. Jenis Konten yang diminta: ${currentLabel}\n\nInstruksi:\n- Buat 3-5 poin singkat yang relevan dan menarik.\n- Gunakan simbol bullet point (-) atau emoji.\n- Sesuaikan gaya bahasa dengan target audiens.\n- Jika "Kuliner", buat contoh menu enak. Jika "Teknologi", buat spek gahar.\n- Output HANYA daftar poinnya saja.`;
  const result = await callGeminiText(prompt);
  inputContentDetails.value = result.trim();
  showToast('Detail materi berhasil dibuat!');
}));

btnEnhance.addEventListener('click', () => runAiButton(btnEnhance, 'Meracik Visual...', async () => {
  const category = getFinalValue(selectCategory, manualCategory);
  const designType = getFinalValue(selectDesignType, manualDesignType, 'Poster Promosi');
  const style = getFinalValue(selectStyle, manualStyle, 'Auto Style');
  const mood = getFinalValue(selectMood, manualMood, 'Bright');
  const brand = inputBrand.value || 'Brand';
  const headline = inputHeadline.value || '';
  const currentDesc = inputDesc.value || '';
  const target = inputTarget.value || 'General';
  const usp = inputUsp.value || '';
  const colors = inputColor.value || '';
  const contentDetails = inputContentDetails.value || '';
  const prompt = `Bertindaklah sebagai creative director profesional. Buat deskripsi visual yang SANGAT DETAIL dan artistik untuk generator gambar AI (seperti Imagen/Midjourney) berdasarkan strategi pemasaran LENGKAP ini:\n\nKONTEKS STRATEGI:\n1. Jenis Media Desain: ${designType} (Pastikan layout sesuai format ini!)\n2. Bisnis: ${category} (${brand})\n3. Target Audiens: ${target} (Desain karakter harus cocok dengan ini!)\n4. Keunggulan Utama (USP): ${usp}\n5. Detail Isi Materi: ${contentDetails} (Penting: Desain harus menyediakan ruang kosong/panel untuk teks ini)\n\nPANDUAN GAYA VISUAL:\n6. Nuansa Headline: "${headline}" (Jangkar mood)\n7. Gaya Seni: ${style}\n8. Palet Warna: ${colors} (Ikuti dengan ketat)\n9. Pencahayaan/Mood: ${mood}\n\nIDE KASAR PENGGUNA:\n"${currentDesc}"\n\nTUGAS:\nGabungkan SEMUA elemen ini menjadi satu deskripsi adegan yang kohesif dan memukau secara visual.\n- Karena ini adalah '${designType}' yang memiliki detail isi: "${contentDetails}", pastikan komposisi ruang (negative space) atau panel teks disiapkan dengan jelas agar tidak menabrak ilustrasi utama.\n- Jika targetnya "Anak-anak", buat karakter lucu/ekspresif. Jika "Gamer", buat keren/teknologis.\n- Jelaskan pencahayaan, tekstur, sudut kamera, dan latar belakang secara detail.\n- Pastikan "Palet Warna" dominan.\n- Panjang sekitar 60-80 kata.\n- Output HANYA teks deskripsi dalam BAHASA INDONESIA yang detail dan puitis agar user paham.`;
  const result = await callGeminiText(prompt);
  inputDesc.value = result.trim();
  showToast('Visual berhasil diracik (Bahasa Indonesia)!');
}));

btnGetTips.addEventListener('click', async () => {
  const category = getFinalValue(selectCategory, manualCategory);
  const designType = getFinalValue(selectDesignType, manualDesignType, 'Poster');
  const desc = inputDesc.value;
  const target = inputTarget.value;
  btnGetTips.innerHTML = `<span class="loader-sm"></span> Sedang Menganalisa Pasar...`;
  btnGetTips.disabled = true;
  try {
    const prompt = `Berikan 3 tips marketing spesifik untuk mempromosikan desain ini.\nJenis Desain: ${designType}\nBisnis: ${category}\nTarget Audiens: ${target}\nVisual: ${desc}\nBahasa: Indonesia. Gunakan emoji.`;
    const result = await callGeminiText(prompt);
    marketingContent.innerHTML = renderAiText(result);
    btnGetTips.classList.add('hidden-input');
  } catch (e) {
    console.error(e);
    marketingContent.innerHTML = "<span style='color:#fca5a5'>Gagal mengambil tips marketing.</span>";
    btnGetTips.innerHTML = '🔄 Coba Lagi';
    btnGetTips.disabled = false;
  }
});

// --- BUAT PROMPT (JSON) — semua di sisi browser, tanpa API, tanpa biaya ---
function buildFallbackVisual(designType, category, style, mood, colors) {
  const parts = [`Desain ${designType} profesional untuk usaha ${category}.`];
  if (style && style !== 'auto') parts.push(`Gaya seni: ${style}.`);
  if (mood) parts.push(`Pencahayaan/mood: ${mood}.`);
  if (colors) parts.push(`Palet warna dominan: ${colors}.`);
  parts.push('Komposisi seimbang dengan ruang kosong untuk teks, kontras tinggi agar mudah dibaca.');
  return parts.join(' ');
}

const ASPECT_MAP = { square: '1:1', vertical: '9:16', portrait: '4:5', landscape: '16:9' };

function buildPromptData() {
  const category = getFinalValue(selectCategory, manualCategory, 'umum');
  const designType = getFinalValue(selectDesignType, manualDesignType, 'Poster Promosi');
  const style = getFinalValue(selectStyle, manualStyle, 'auto');
  const mood = getFinalValue(selectMood, manualMood, 'bright');
  const orientationVal = getFinalValue(selectOrientation, manualOrientation, 'square');
  const aspect = ASPECT_MAP[selectOrientation.value] || (selectOrientation.value === 'other' ? orientationVal : '1:1');

  const colors = inputColor.value.trim();
  let visual = inputDesc.value.trim();
  if (!visual) visual = buildFallbackVisual(designType, category, style, mood, colors);

  // Buang field kosong biar JSON rapi.
  const textToRender = {};
  if (inputBrand.value.trim())          textToRender.brand_name   = inputBrand.value.trim();
  if (inputHeadline.value.trim())       textToRender.headline     = inputHeadline.value.trim();
  if (inputPrice.value.trim())          textToRender.price_offer  = inputPrice.value.trim();
  if (inputCta.value.trim())            textToRender.contact_cta  = inputCta.value.trim();
  if (inputContentDetails.value.trim()) textToRender.body_content = inputContentDetails.value.trim();

  return {
    task: 'advertising_poster_design',
    language: 'Indonesian (Bahasa Indonesia)',
    business: {
      category,
      brand_name: inputBrand.value.trim() || undefined,
      target_audience: inputTarget.value.trim() || undefined,
      unique_selling_point: inputUsp.value.trim() || undefined
    },
    design: {
      type: designType,
      aspect_ratio: aspect,
      art_style: style,
      lighting_mood: mood,
      color_palette: colors || undefined
    },
    visual_description: visual,
    text_to_render: textToRender,
    requirements: [
      'Render SEMUA teks persis seperti tertulis, ejaan Indonesia yang benar (jangan diterjemahkan).',
      'Tipografi jelas & mudah dibaca, kontras tinggi.',
      'Layout terstruktur: area untuk headline, visual utama, isi/body, dan footer.',
      'Sediakan ruang kosong (negative space) untuk teks agar tidak menabrak ilustrasi.',
      'Kualitas komersial profesional, detail tinggi.'
    ]
  };
}

// Bersihkan properti undefined agar JSON.stringify tidak menyertakannya.
function pruneUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

generateBtn.addEventListener('click', () => {
  const data = pruneUndefined(buildPromptData());
  lastPromptData = data;

  jsonOutput.textContent = JSON.stringify(data, null, 2);
  emptyState.classList.add('hidden-input');
  jsonOutput.classList.remove('hidden-input');

  // Tampilkan bagian tips marketing.
  marketingSection.classList.remove('hidden-input');
  marketingContent.innerHTML = '';
  btnGetTips.classList.remove('hidden-input');
  btnGetTips.innerHTML = '💡 Dapatkan Tips Cara Jualan Produk Ini';
  btnGetTips.disabled = false;

  showToast('Prompt JSON siap — tinggal salin!');
});
