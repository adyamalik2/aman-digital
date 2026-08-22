/* ==========================================================
   app.js — AMAN Content Engine (vanilla JS, tanpa framework).
   Kirim { topic, mode, audience, funnel } ke proxy.php (server yang
   memegang API key + system prompt), tampilkan hasil Markdown.
   ========================================================== */
(function () {
  'use strict';

  // ---- Mode: label ringkas + hint ----
  var MODE_HINT = {
    cepat:      'Analisis singkat, judul, hook, naskah 80–110 kata, caption, teks cover, CTA, dan hashtag.',
    lengkap:    'Seluruh 16 bagian: analisis, 5 judul, 5 hook, naskah, shot list, faceless, carousel, caption, story, prompt visual, cover, CTA, hashtag, repurpose, jadwal, versi siap salin.',
    reels:      'Naskah video + shot list (tabel) + prompt visual 9:16 + caption + hashtag.',
    carousel:   'Analisis singkat + carousel Instagram 7 slide + caption + hashtag.',
    faceless:   'Mode Cepat + Versi Faceless lengkap (footage, voice-over, teks layar, transisi, audio) — tanpa wajah.',
    jualan:     'Mode Cepat dengan CTA diarahkan ke konsultasi/demo/produk — tetap soft selling.',
    edukasi:    'Mode Cepat tanpa menyebut produk sama sekali. Fokus edukasi & nilai brand.',
    tujuh_hari: 'Rencana 7 hari: 7 topik (judul, hook, angle, format, produk terkait). Belum konten penuh.'
  };
  var MODE_LABEL = {
    cepat:'Cepat', lengkap:'Lengkap', reels:'Reels', carousel:'Carousel',
    faceless:'Faceless', jualan:'Jualan', edukasi:'Edukasi', tujuh_hari:'7 Hari'
  };
  var LOAD_STEPS = ['Menganalisis topik…','Menyusun angle & hook…','Menulis naskah…','Merapikan hasil…'];
  var HIST_KEY = 'amance_history_v1';
  var MODE_KEY = 'amance_mode_v1';
  var HIST_MAX = 12;

  // ---- Elemen ----
  var $ = function (id) { return document.getElementById(id); };
  var topicEl = $('topic'), modesEl = $('modes'), hintEl = $('modeHint');
  var audienceEl = $('audience'), funnelEl = $('funnel');
  var genBtn = $('generate'), genLabel = $('genLabel');
  var outSection = $('outputSection'), outEl = $('output'), outMeta = $('outputMeta');
  var copyAllBtn = $('copyAll'), regenBtn = $('regen');
  var histSection = $('historySection'), histList = $('historyList'), clearHistBtn = $('clearHistory');
  var ideaNicheEl = $('ideaNiche'), ideaBtn = $('ideaBtn'), startersEl = $('starters');

  var state = { mode: 'cepat', loading: false, markdown: '', loadTimer: null };

  // ========================================================
  // Util
  // ========================================================
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function copyText(text, btn, label) {
    var done = function () {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = label || '✓ Tersalin';
      btn.classList.add('copied');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('copied'); }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
    } else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ========================================================
  // Markdown -> HTML (aman: escape dulu, baru format)
  // ========================================================
  var SENT = ''; // sentinel private-use, tak pernah muncul di teks normal

  function renderInline(text) {
    // text sudah di-escape HTML. Lindungi isi code-span dulu supaya tidak ikut
    // diformat & tidak bentrok dengan angka biasa di teks.
    var codes = [];
    text = text.replace(/`([^`]+)`/g, function (m, c) {
      codes.push(c);
      return SENT + (codes.length - 1) + SENT;
    });
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    text = text.replace(new RegExp(SENT + '(\\d+)' + SENT, 'g'), function (m, i) {
      return '<code>' + codes[+i] + '</code>';
    });
    return text;
  }

  function tableCells(line) {
    var t = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return t.split('|').map(function (c) { return c.trim(); });
  }
  function isSeparatorRow(line) {
    if (line.indexOf('|') === -1) return false;
    return tableCells(line).every(function (c) { return /^:?-{1,}:?$/.test(c); });
  }

  // Render satu blok markdown (boleh mengandung ###, list, tabel, dll) -> HTML.
  function renderBlocks(md) {
    var lines = md.replace(/\r\n/g, '\n').split('\n');
    var html = '', i = 0, para = [];

    function flushParas() {
      if (para.length) { html += '<p>' + renderInline(escapeHtml(para.join(' '))) + '</p>'; para = []; }
    }

    while (i < lines.length) {
      var line = lines[i];

      // Tabel
      if (line.indexOf('|') !== -1 && i + 1 < lines.length && isSeparatorRow(lines[i + 1])) {
        flushParas();
        var head = tableCells(line);
        i += 2;
        var rows = [];
        while (i < lines.length && lines[i].indexOf('|') !== -1 && lines[i].trim() !== '') {
          rows.push(tableCells(lines[i])); i++;
        }
        html += '<div class="md-table-wrap"><table><thead><tr>';
        head.forEach(function (c) { html += '<th>' + renderInline(escapeHtml(c)) + '</th>'; });
        html += '</tr></thead><tbody>';
        rows.forEach(function (r) {
          html += '<tr>';
          for (var k = 0; k < head.length; k++) { html += '<td>' + renderInline(escapeHtml(r[k] || '')) + '</td>'; }
          html += '</tr>';
        });
        html += '</tbody></table></div>';
        continue;
      }

      // Heading (## / ###)
      var hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm) {
        flushParas();
        var tag = hm[1].length >= 3 ? 'h3' : 'h2';
        html += '<' + tag + '>' + renderInline(escapeHtml(hm[2].trim())) + '</' + tag + '>';
        i++; continue;
      }

      // Garis pemisah (--- *** ___)
      if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { flushParas(); html += '<hr>'; i++; continue; }

      // Blockquote
      if (/^\s*>\s?/.test(line)) {
        flushParas();
        var q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
        html += '<blockquote>' + renderInline(escapeHtml(q.join(' '))) + '</blockquote>';
        continue;
      }

      // List (ul / ol)
      if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
        flushParas();
        var ordered = /^\s*\d+[.)]\s+/.test(line);
        var tagL = ordered ? 'ol' : 'ul';
        html += '<' + tagL + '>';
        while (i < lines.length && (/^\s*[-*+]\s+/.test(lines[i]) || /^\s*\d+[.)]\s+/.test(lines[i]))) {
          var item = lines[i].replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '');
          html += '<li>' + renderInline(escapeHtml(item)) + '</li>';
          i++;
        }
        html += '</' + tagL + '>';
        continue;
      }

      // Baris kosong -> akhiri paragraf
      if (line.trim() === '') { flushParas(); i++; continue; }

      // Teks paragraf biasa
      para.push(line.trim());
      i++;
    }
    flushParas();
    return html;
  }

  // Label tombol salin sesuai FUNGSI bagian (biar tahu dipakai buat apa).
  function copyLabelFor(title) {
    var t = (title || '').toLowerCase();
    if (t.indexOf('naskah') !== -1)   return 'Salin naskah';
    if (t.indexOf('caption') !== -1)  return 'Salin caption';
    if (t.indexOf('hashtag') !== -1 || t.indexOf('kata kunci') !== -1) return 'Salin hashtag';
    if (t.indexOf('hook') !== -1)     return 'Salin hook';
    if (t.indexOf('judul') !== -1)    return 'Salin judul';
    if (t.indexOf('cover') !== -1)    return 'Salin teks cover';
    if (t.indexOf('cta') !== -1)      return 'Salin CTA';
    if (t.indexOf('carousel') !== -1) return 'Salin carousel';
    if (t.indexOf('shot') !== -1)     return 'Salin shot list';
    if (t.indexOf('story') !== -1)    return 'Salin story';
    if (t.indexOf('siap salin') !== -1) return 'Salin versi final';
    return 'Salin bagian ini';
  }

  // Pisah markdown per "## " jadi seksi (biar tiap seksi punya tombol salin).
  function renderMarkdown(md) {
    outEl.innerHTML = '';
    var lines = md.replace(/\r\n/g, '\n').split('\n');
    var sections = [];
    var cur = { title: null, lines: [] };
    lines.forEach(function (ln) {
      var m = ln.match(/^##\s+(.*)$/);
      if (m) {
        if (cur.title !== null || cur.lines.join('').trim() !== '') sections.push(cur);
        cur = { title: m[1].trim(), lines: [] };
      } else { cur.lines.push(ln); }
    });
    sections.push(cur);

    sections.forEach(function (sec) {
      var body = sec.lines.join('\n');
      if (sec.title === null) {
        if (body.trim() === '') return;
        var intro = document.createElement('div');
        intro.className = 'md-intro';
        intro.innerHTML = renderBlocks(body);
        outEl.appendChild(intro);
        return;
      }
      var wrap = document.createElement('section');
      wrap.className = 'md-section';
      var head = document.createElement('div');
      head.className = 'sec-head';
      var h = document.createElement('h2');
      h.innerHTML = renderInline(escapeHtml(sec.title));
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'btn-sm'; btn.textContent = copyLabelFor(sec.title);
      var raw = ('## ' + sec.title + '\n' + body).replace(/\s+$/, '');
      btn.addEventListener('click', function () { copyText(raw.trim(), btn, '✓'); });
      head.appendChild(h); head.appendChild(btn);
      wrap.appendChild(head);
      var bodyEl = document.createElement('div');
      bodyEl.innerHTML = renderBlocks(body);
      wrap.appendChild(bodyEl);
      outEl.appendChild(wrap);
    });
  }

  function showError(msg, offerReload) {
    outSection.hidden = false;
    outMeta.textContent = '';
    copyAllBtn.style.display = 'none';
    regenBtn.style.display = 'none';
    outEl.innerHTML = '';
    var box = document.createElement('div');
    box.className = 'error-box';
    box.textContent = '⚠ ' + msg;
    if (offerReload) {
      var a = document.createElement('a');
      a.href = 'login.php'; a.textContent = ' Muat ulang / login';
      a.style.color = '#fff'; a.style.fontWeight = '700';
      box.appendChild(a);
    }
    outEl.appendChild(box);
    outSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ========================================================
  // Generate
  // ========================================================
  function setLoading(on) {
    state.loading = on;
    genBtn.disabled = on;
    if (on) {
      var step = 0;
      genLabel.innerHTML = '<span class="spinner"></span> ' + LOAD_STEPS[0];
      state.loadTimer = setInterval(function () {
        step = (step + 1) % LOAD_STEPS.length;
        genLabel.innerHTML = '<span class="spinner"></span> ' + LOAD_STEPS[step];
      }, 2500);
    } else {
      if (state.loadTimer) { clearInterval(state.loadTimer); state.loadTimer = null; }
      genLabel.textContent = '✨ Buat Konten';
    }
  }

  function generate() {
    if (state.loading) return;
    var topic = topicEl.value.trim();
    if (topic === '') {
      topicEl.focus();
      topicEl.style.borderColor = 'var(--danger)';
      setTimeout(function () { topicEl.style.borderColor = ''; }, 1200);
      return;
    }
    setLoading(true);

    var payload = {
      topic: topic,
      mode: state.mode,
      audience: audienceEl.value || '',
      funnel: funnelEl.value || ''
    };

    fetch('/aman-content-engine/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.text().then(function (t) {
        var data = {};
        try { data = JSON.parse(t); } catch (e) {}
        return { status: res.status, data: data };
      });
    }).then(function (r) {
      setLoading(false);
      if (r.status === 401) { showError('Sesi habis atau belum login.', true); return; }
      if (r.data && r.data.error) {
        showError(r.data.error.message || 'Terjadi kesalahan pada layanan AI.'); return;
      }
      var text = '';
      var cand = r.data && r.data.candidates && r.data.candidates[0];
      if (cand && cand.content && cand.content.parts) {
        text = cand.content.parts.map(function (p) { return p.text || ''; }).join('');
      }
      if (!text.trim()) {
        var pf = r.data && r.data.promptFeedback;
        var reason = (cand && cand.finishReason) || (pf && pf.blockReason);
        if (reason === 'SAFETY' || reason === 'BLOCKLIST' || (pf && pf.blockReason)) {
          showError('Topik ini terblokir oleh filter keamanan AI. Coba ubah kata-katanya.');
        } else if (reason === 'MAX_TOKENS') {
          showError('Hasil terpotong (terlalu panjang). Coba mode lebih ringkas atau persempit topik.');
        } else {
          showError('AI tidak mengembalikan hasil. Coba lagi sebentar.');
        }
        return;
      }
      showResult(topic, state.mode, text.trim());
      saveHistory(topic, state.mode, text.trim());
    }).catch(function (err) {
      setLoading(false);
      showError('Gagal menghubungi server: ' + (err && err.message ? err.message : 'jaringan bermasalah') + '. Coba lagi.');
    });
  }

  // ========================================================
  // Carikan Ide (AI): dari niche/usaha → daftar ide topik
  // ========================================================
  function renderIdeaChips(label, ideas) {
    startersEl.innerHTML = '';
    var lbl = document.createElement('span');
    lbl.className = 'starters-label';
    lbl.textContent = label;
    startersEl.appendChild(lbl);
    ideas.forEach(function (idea) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'starter-chip'; b.textContent = idea;
      startersEl.appendChild(b);
    });
  }

  function fetchIdeas() {
    if (ideaBtn.disabled) return;
    var niche = ideaNicheEl.value.trim();
    var oldLabel = ideaBtn.textContent;
    ideaBtn.disabled = true;
    ideaBtn.textContent = '⏳ Mencari…';
    fetch('/aman-content-engine/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ideas', niche: niche })
    }).then(function (res) {
      return res.text().then(function (t) {
        var data = {}; try { data = JSON.parse(t); } catch (e) {}
        return { status: res.status, data: data };
      });
    }).then(function (r) {
      ideaBtn.disabled = false; ideaBtn.textContent = oldLabel;
      if (r.status === 401) { renderIdeaChips('Sesi habis — muat ulang halaman & login.', []); return; }
      if (r.data && r.data.error) { renderIdeaChips('Gagal: ' + (r.data.error.message || 'coba lagi.'), []); return; }
      var text = '';
      var cand = r.data && r.data.candidates && r.data.candidates[0];
      if (cand && cand.content && cand.content.parts) {
        text = cand.content.parts.map(function (p) { return p.text || ''; }).join('');
      }
      var ideas = text.split('\n').map(function (l) {
        return l.replace(/^\s*(?:[-*•]\s+|\d+[.)]\s+)?/, '')
                .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
                .trim();
      }).filter(function (l) { return l.length > 1 && l.length <= 90; }).slice(0, 8);
      if (!ideas.length) { renderIdeaChips('Belum dapat ide — coba lagi atau ubah kata usahanya.', []); return; }
      renderIdeaChips(niche ? ('Ide untuk "' + niche + '" — klik untuk pakai:') : 'Ide untukmu — klik untuk pakai:', ideas);
    }).catch(function (err) {
      ideaBtn.disabled = false; ideaBtn.textContent = oldLabel;
      renderIdeaChips('Gagal ambil ide (' + (err && err.message ? err.message : 'jaringan') + '). Coba lagi.', []);
    });
  }

  function showResult(topic, mode, md) {
    state.markdown = md;
    outSection.hidden = false;
    copyAllBtn.style.display = '';
    regenBtn.style.display = '';
    outMeta.textContent = MODE_LABEL[mode] + ' · ' + topic;
    renderMarkdown(md);
    outSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ========================================================
  // History (localStorage)
  // ========================================================
  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch (e) { return []; }
  }
  function saveHistory(topic, mode, md) {
    var h = loadHistory();
    h.unshift({ id: Date.now(), topic: topic, mode: mode, ts: Date.now(), md: md });
    if (h.length > HIST_MAX) h = h.slice(0, HIST_MAX);
    try { localStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch (e) {}
    renderHistory();
  }
  function timeAgo(ts) {
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'baru saja';
    if (s < 3600) return Math.floor(s / 60) + ' mnt lalu';
    if (s < 86400) return Math.floor(s / 3600) + ' jam lalu';
    return Math.floor(s / 86400) + ' hr lalu';
  }
  function renderHistory() {
    var h = loadHistory();
    if (!h.length) { histSection.hidden = true; return; }
    histSection.hidden = false;
    histList.innerHTML = '';
    h.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'history-item';
      var topic = document.createElement('span');
      topic.className = 'h-topic'; topic.textContent = item.topic;
      var mode = document.createElement('span');
      mode.className = 'h-mode'; mode.textContent = MODE_LABEL[item.mode] || item.mode;
      var time = document.createElement('span');
      time.className = 'h-time'; time.textContent = timeAgo(item.ts);
      li.appendChild(topic); li.appendChild(mode); li.appendChild(time);
      li.addEventListener('click', function () {
        topicEl.value = item.topic;
        setMode(item.mode);
        showResult(item.topic, item.mode, item.md);
      });
      histList.appendChild(li);
    });
  }

  // ========================================================
  // Mode selection
  // ========================================================
  function setMode(mode) {
    if (!MODE_HINT[mode]) mode = 'cepat';
    state.mode = mode;
    var chips = modesEl.querySelectorAll('.mode-chip');
    for (var j = 0; j < chips.length; j++) {
      chips[j].classList.toggle('active', chips[j].getAttribute('data-mode') === mode);
    }
    hintEl.textContent = MODE_HINT[mode];
    try { localStorage.setItem(MODE_KEY, mode); } catch (e) {}
  }

  // ========================================================
  // Wire up
  // ========================================================
  modesEl.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.mode-chip') : null;
    if (chip) setMode(chip.getAttribute('data-mode'));
  });
  if (startersEl) startersEl.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.starter-chip') : null;
    if (chip) {
      topicEl.value = chip.textContent.trim();
      topicEl.focus();
      topicEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  if (ideaBtn) ideaBtn.addEventListener('click', fetchIdeas);
  if (ideaNicheEl) ideaNicheEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); fetchIdeas(); }
  });
  genBtn.addEventListener('click', generate);
  regenBtn.addEventListener('click', generate);
  copyAllBtn.addEventListener('click', function () { copyText(state.markdown, copyAllBtn, '✓ Tersalin'); });
  clearHistBtn.addEventListener('click', function () {
    if (!confirm('Hapus semua riwayat di perangkat ini?')) return;
    try { localStorage.removeItem(HIST_KEY); } catch (e) {}
    renderHistory();
  });
  topicEl.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); generate(); }
  });

  // Init
  var savedMode = 'cepat';
  try { savedMode = localStorage.getItem(MODE_KEY) || 'cepat'; } catch (e) {}
  setMode(savedMode);
  renderHistory();
})();
