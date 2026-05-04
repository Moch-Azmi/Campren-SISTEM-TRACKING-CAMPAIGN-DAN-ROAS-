/* =====================
   CAMPREN – app.js
   ===================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV ACTIVE STATE ──────────────────────────────────────
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      document.querySelector('.page-title').textContent =
        item.dataset.page.charAt(0).toUpperCase() + item.dataset.page.slice(1);
    });
  });

  // ── PENCAPAIAN TARGET ─────────────────────────────────────
  const TOTAL_REVENUE = 85_000_000;
  const targetInput   = document.getElementById('targetRevenue');
  const pencapaianEl  = document.getElementById('pencapaianPct');

  function updatePencapaian() {
    const target = parseFloat(targetInput.value);
    if (!target || target <= 0) {
      pencapaianEl.textContent = '—';
      return;
    }
    const pct = ((TOTAL_REVENUE / target) * 100).toFixed(1);
    pencapaianEl.textContent = pct + '%';
  }

  // Seed default
  targetInput.value = 566_666_667;
  updatePencapaian();
  targetInput.addEventListener('input', updatePencapaian);

  // ── DONUT CHART ───────────────────────────────────────────
  const donutCtx = document.getElementById('donutChart').getContext('2d');
  new Chart(donutCtx, {
    type: 'doughnut',
    data: {
      labels: ['TikTok', 'Youtube', 'Instagram', 'Tokopedia'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: ['#3B82F6', '#F87171', '#FBBF24', '#A78BFA'],
        borderWidth: 2,
        borderColor: '#181A22',
        hoverOffset: 6,
      }]
    },
    options: {
      cutout: '72%',
      plugins: { legend: { display: false }, tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
        },
        backgroundColor: '#1C1E28',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleColor: '#F0F0F5',
        bodyColor: '#8B8FA8',
      }},
      animation: { animateRotate: true, duration: 900 },
    }
  });

  // ── AREA CHART ────────────────────────────────────────────
  const areaCtx = document.getElementById('areaChart').getContext('2d');

  // Gradient helpers
  function makeGradient(ctx, color1, color2) {
    const g = ctx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    return g;
  }

  const revGrad  = makeGradient(areaCtx, 'rgba(52,211,153,0.4)', 'rgba(52,211,153,0)');
  const spendGrad = makeGradient(areaCtx, 'rgba(59,130,246,0.3)', 'rgba(59,130,246,0)');

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
  const revenueData = [2, 3, 5, 7, 12, 18, 25];
  const spendData   = [1, 2, 3, 4,  7, 11, 16];

  new Chart(areaCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          borderColor: '#34D399',
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#34D399',
          pointBorderColor: '#181A22',
          pointBorderWidth: 2,
          fill: true,
          backgroundColor: revGrad,
          tension: 0.4,
        },
        {
          label: 'Ad Spend',
          data: spendData,
          borderColor: '#3B82F6',
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#181A22',
          pointBorderWidth: 2,
          fill: true,
          backgroundColor: spendGrad,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1C1E28',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#F0F0F5',
          bodyColor: '#8B8FA8',
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}jt`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#555870',
            font: { family: 'DM Sans', size: 11 }
          },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#555870',
            font: { family: 'DM Sans', size: 11 },
            callback: v => v + 'jt'
          },
          border: { display: false },
          min: 0,
        }
      }
    }
  });

  // ── ANIMATE PROGRESS BARS ─────────────────────────────────
  // Done via CSS transitions; widths are set inline in HTML.
  // Trigger on page load with a slight delay so transition plays.
  const bars = document.querySelectorAll('.troas-bar, .roas-progress-fill');
  const origWidths = [...bars].map(b => b.style.width);
  bars.forEach(b => b.style.width = '0');

  setTimeout(() => {
    bars.forEach((b, i) => { b.style.width = origWidths[i]; });
  }, 300);

  // ── KPI NUMBER COUNTER ANIMATION ─────────────────────────
  function animateCounter(el, start, end, duration, prefix, suffix) {
    const startTime = performance.now();
    const range = end - start;
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * ease);
      el.textContent = prefix + current.toLocaleString('id-ID') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Animate KPI values on load
  setTimeout(() => {
    const spendEl = document.querySelector('.spend-val');
    const revEl   = document.querySelector('.revenue-val');
    if (spendEl) animateCounter(spendEl, 0, 46000000, 1000, 'Rp ', '');
    if (revEl)   animateCounter(revEl,   0, 85000000, 1000, 'Rp ', '');
  }, 200);

});
