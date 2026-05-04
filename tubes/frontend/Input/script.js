/**
 * CAMPREN – Input Data | script.js
 * Handles:
 *   1. Smooth scroll antar section
 *   2. Sidebar step progress tracker
 *   3. Channel button selection
 *   4. ROAS Aktual calculation
 *   5. CTR preview bar
 *   6. Section fade-in on scroll (Intersection Observer)
 *   7. Save Campaign validation & toast
 */

// ============================================================
// 1. SCROLL TO SECTION
// ============================================================
/**
 * Scroll ke section tertentu secara smooth di dalam container.
 * @param {string} sectionId - ID element section (misal: 'section-2')
 */
function scrollToSection(sectionId) {
  const container = document.getElementById('formScroll');
  const target    = document.getElementById(sectionId);

  if (!container || !target) return;

  // Hitung posisi offset section relatif terhadap container
  const containerTop = container.getBoundingClientRect().top;
  const targetTop    = target.getBoundingClientRect().top;
  const offset       = targetTop - containerTop + container.scrollTop - 20; // 20px margin atas

  container.scrollTo({
    top:      offset,
    behavior: 'smooth'
  });
}

// ============================================================
// 2. INTERSECTION OBSERVER – Fade-in & Sidebar Progress
// ============================================================
const sections = document.querySelectorAll('.form-section');
const spSteps  = document.querySelectorAll('.sp-step');
const spLines  = document.querySelectorAll('.sp-line');

/**
 * Map section ID ke index step sidebar
 */
const sectionIndexMap = {
  'section-1': 0,
  'section-2': 1,
  'section-3': 2
};

/**
 * Update sidebar step indicator berdasarkan section yang sedang aktif
 * @param {number} activeIndex - index step yang sedang di-view
 */
function updateSidebarProgress(activeIndex) {
  spSteps.forEach((step, i) => {
    step.classList.remove('active', 'done');
    if (i < activeIndex)  step.classList.add('done');
    if (i === activeIndex) step.classList.add('active');
  });

  // Update garis antar step
  spLines.forEach((line, i) => {
    if (i < activeIndex) {
      line.style.background = 'var(--green)';
    } else if (i === activeIndex - 1) {
      line.style.background = 'var(--accent)';
    } else {
      line.style.background = 'var(--border)';
    }
  });
}

// Observer untuk fade-in section saat masuk viewport
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');       // fade-in class
        entry.target.classList.add('in-view');       // highlight border
        
        const idx = sectionIndexMap[entry.target.id];
        if (idx !== undefined) updateSidebarProgress(idx);
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  },
  {
    root:       document.getElementById('formScroll'), // scroll dalam container
    rootMargin: '-10% 0px -50% 0px',                  // trigger saat ~40% terlihat
    threshold:  0
  }
);

sections.forEach(section => fadeObserver.observe(section));

// Trigger fade-in pertama kali (section pertama langsung visible)
setTimeout(() => {
  document.getElementById('section-1')?.classList.add('visible');
}, 100);

// ============================================================
// 3. SIDEBAR STEP CLICK – Scroll ke section
// ============================================================
spSteps.forEach((step, index) => {
  step.addEventListener('click', () => {
    const targetId = step.getAttribute('data-target');
    if (targetId) scrollToSection(targetId);
  });
});

// ============================================================
// 4. CHANNEL BUTTON SELECTION
// ============================================================
const channelBtns = document.querySelectorAll('.channel-btn');
let selectedChannel = null;

channelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Toggle: kalau sudah selected, unselect
    if (btn.classList.contains('selected')) {
      btn.classList.remove('selected');
      selectedChannel = null;
    } else {
      // Unselect semua dulu
      channelBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedChannel = btn.getAttribute('data-channel');
    }
  });
});

// ============================================================
// 5. ROAS AKTUAL CALCULATION
// ============================================================
const anggaranInput  = document.getElementById('anggaran');
const estRevenueInput = document.getElementById('estRevenue');
const targetRoasInput = document.getElementById('targetRoas');
const roasAktualCard  = document.getElementById('roasAktualCard');
const roasFormula     = document.getElementById('roasFormula');
const roasValue       = document.getElementById('roasValue');
const roasStatus      = document.getElementById('roasStatus');

/**
 * Format angka ke format Rupiah singkat
 * Misal: 12500000 → "12,5 Jt"
 */
function formatRupiahShort(value) {
  if (!value || isNaN(value)) return '–';
  const num = parseFloat(value);
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' M';
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(1) + ' Jt';
  if (num >= 1_000)         return (num / 1_000).toFixed(0) + ' Rb';
  return num.toLocaleString('id-ID');
}

/**
 * Hitung dan tampilkan ROAS Aktual
 * ROAS = Revenue / Anggaran
 */
function calculateROAS() {
  const anggaran  = parseFloat(anggaranInput.value)   || 0;
  const revenue   = parseFloat(estRevenueInput.value) || 0;
  const targetROAS = parseFloat(targetRoasInput.value) || 0;

  if (anggaran > 0 && revenue > 0) {
    const aktualROAS = revenue / anggaran;

    // Update formula display
    roasFormula.textContent = `${formatRupiahShort(revenue)} / ${formatRupiahShort(anggaran)}`;
    roasValue.textContent   = aktualROAS.toFixed(2) + 'x';

    // Bandingkan dengan target ROAS
    if (targetROAS > 0) {
      const isGood = aktualROAS >= targetROAS;
      roasStatus.classList.add('show');
      roasStatus.className = 'roas-status show ' + (isGood ? 'good' : 'bad');
      roasStatus.textContent = isGood
        ? `▲ Di atas target ${targetROAS}x`
        : `▼ Di bawah target ${targetROAS}x`;

      roasAktualCard.className = 'roas-aktual-card ' + (isGood ? 'status-good' : 'status-bad');
    } else {
      roasStatus.classList.remove('show');
      roasAktualCard.className = 'roas-aktual-card';
    }

  } else {
    // Reset jika input kosong
    roasFormula.textContent = '– / –';
    roasValue.textContent   = '–x';
    roasStatus.classList.remove('show');
    roasAktualCard.className = 'roas-aktual-card';
  }
}

// Event listeners untuk ROAS
anggaranInput.addEventListener('input', calculateROAS);
estRevenueInput.addEventListener('input', calculateROAS);
targetRoasInput.addEventListener('input', calculateROAS);

// ============================================================
// 6. CTR PREVIEW BAR
// ============================================================
const targetCTRInput = document.getElementById('targetCTR');
const ctrPreview     = document.getElementById('ctrPreview');
const ctrBarFill     = document.getElementById('ctrBarFill');
const ctrBarLabel    = document.getElementById('ctrBarLabel');

targetCTRInput.addEventListener('input', () => {
  const ctr = parseFloat(targetCTRInput.value);

  if (!isNaN(ctr) && ctr >= 0) {
    ctrPreview.style.display = 'flex';
    
    // Clamp antara 0-100%
    const clampedCTR = Math.min(Math.max(ctr, 0), 100);
    ctrBarFill.style.width = clampedCTR + '%';
    ctrBarLabel.textContent = clampedCTR.toFixed(2) + '%';

    // Warna bar berdasarkan nilai CTR
    // CTR > 5% dianggap sangat baik untuk digital ads
    if (clampedCTR >= 5) {
      ctrBarFill.style.background = 'linear-gradient(90deg, #22c55e, #86efac)';
    } else if (clampedCTR >= 2) {
      ctrBarFill.style.background = 'linear-gradient(90deg, #6366f1, #a5b4fc)';
    } else {
      ctrBarFill.style.background = 'linear-gradient(90deg, #ef4444, #fca5a5)';
    }
  } else {
    ctrPreview.style.display = 'none';
  }
});

// ============================================================
// 7. SAVE CAMPAIGN – Validasi & Toast
// ============================================================

/**
 * Tampilkan toast notification
 * @param {string} message - pesan yang ditampilkan
 * @param {'success'|'error'} type - tipe notifikasi
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = `toast show ${type}`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 3500);
}

/**
 * Kumpulkan semua data form ke object
 * @returns {object} data campaign
 */
function collectFormData() {
  return {
    namaCampaign:  document.getElementById('namaCampaign').value.trim(),
    channel:       selectedChannel,
    namaProduk:    document.getElementById('namaProduk').value.trim(),
    anggaran:      parseFloat(document.getElementById('anggaran').value)    || 0,
    estRevenue:    parseFloat(document.getElementById('estRevenue').value)  || 0,
    targetRoas:    parseFloat(document.getElementById('targetRoas').value)  || 0,
    targetViews:   parseInt(document.getElementById('targetViews').value)   || 0,
    targetClicks:  parseInt(document.getElementById('targetClicks').value)  || 0,
    targetRevenue: parseFloat(document.getElementById('targetRevenue').value) || 0,
    targetCTR:     parseFloat(document.getElementById('targetCTR').value)   || 0,
  };
}

/**
 * Validasi form sebelum simpan
 * @param {object} data - data dari collectFormData()
 * @returns {{ valid: boolean, message: string }}
 */
function validateForm(data) {
  if (!data.namaCampaign) {
    scrollToSection('section-1');
    return { valid: false, message: '⚠️ Nama Campaign wajib diisi!' };
  }
  if (!data.channel) {
    scrollToSection('section-1');
    return { valid: false, message: '⚠️ Pilih minimal 1 Channel!' };
  }
  if (!data.namaProduk) {
    scrollToSection('section-1');
    return { valid: false, message: '⚠️ Nama Produk wajib diisi!' };
  }
  if (data.anggaran <= 0) {
    scrollToSection('section-2');
    return { valid: false, message: '⚠️ Anggaran harus diisi!' };
  }
  if (data.targetViews <= 0) {
    scrollToSection('section-3');
    return { valid: false, message: '⚠️ Target Jumlah Views harus diisi!' };
  }
  if (data.targetClicks <= 0) {
    scrollToSection('section-3');
    return { valid: false, message: '⚠️ Target Clicks harus diisi!' };
  }
  if (data.targetRevenue <= 0) {
    scrollToSection('section-3');
    return { valid: false, message: '⚠️ Target Revenue harus diisi!' };
  }
  if (data.targetCTR <= 0) {
    scrollToSection('section-3');
    return { valid: false, message: '⚠️ Target Rasio CTR harus diisi!' };
  }

  return { valid: true, message: '' };
}

/**
 * Handle tombol Save Campaign
 */
function saveCampaign() {
  const data       = collectFormData();
  const validation = validateForm(data);

  if (!validation.valid) {
    showToast(validation.message, 'error');
    return;
  }

  // Simulasi save (di real app, ini akan kirim ke API/backend)
  const btn = document.getElementById('btnSave');
  btn.disabled     = true;
  btn.textContent  = 'Menyimpan...';

  setTimeout(() => {
    console.log('Data Campaign tersimpan:', data);
    showToast(`✅ Campaign "${data.namaCampaign}" berhasil disimpan!`, 'success');
    btn.disabled    = false;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
      Save Campaign
    `;
  }, 1200);
}

// ============================================================
// INIT – jalankan saat DOM siap
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set section pertama langsung terlihat
  const firstSection = document.getElementById('section-1');
  if (firstSection) {
    setTimeout(() => firstSection.classList.add('visible'), 50);
  }

  // Init sidebar step pertama sebagai active
  updateSidebarProgress(0);
});
