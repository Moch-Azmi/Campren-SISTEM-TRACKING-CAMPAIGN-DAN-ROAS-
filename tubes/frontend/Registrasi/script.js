/* ============================================================
   CAMPREN — signup.js
   Wave canvas + form validation + toggle password + ripple
============================================================ */

// ── WAVE CANVAS ──────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('waveCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const WAVES  = [];
  const COUNT  = 62;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildWaves();
  }

  function buildWaves() {
    WAVES.length = 0;
    for (let i = 0; i < COUNT; i++) {
      WAVES.push({
        yBase:     H * 0.08 + H * 0.86 * (i / COUNT),
        amplitude: 24 + Math.random() * 62,
        frequency: 0.003 + Math.random() * 0.006,
        speed:     0.0003 + Math.random() * 0.0008,
        phase:     Math.random() * Math.PI * 2,
        alpha:     0.05 + 0.28 * Math.pow(Math.sin((i / COUNT) * Math.PI), 1.4),
        hue:       255 + (i / COUNT) * 45,
        sat:       45  + (i / COUNT) * 30,
        lgt:       38  + (i / COUNT) * 22,
      });
    }
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Glow blob
    const grd = ctx.createRadialGradient(W * 0.26, H * 0.46, 0, W * 0.26, H * 0.46, H * 0.58);
    grd.addColorStop(0,   'rgba(95, 50, 160, 0.13)');
    grd.addColorStop(0.5, 'rgba(55, 20,  95, 0.06)');
    grd.addColorStop(1,   'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    WAVES.forEach((w) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y =
          w.yBase
          + Math.sin(x * w.frequency + t * w.speed * 1000 + w.phase) * w.amplitude
          + Math.sin(x * w.frequency * 1.7 + t * w.speed * 550 + w.phase * 1.4) * w.amplitude * 0.32;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${w.hue},${w.sat}%,${w.lgt}%,${w.alpha})`;
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    t += 0.016;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


// ── TOGGLE PASSWORD ───────────────────────────────────────────
document.querySelectorAll('.toggle-password').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const icon  = btn.querySelector('.eye-icon');
    const show  = input.type === 'password';
    input.type  = show ? 'text' : 'password';
    icon.innerHTML = show
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });
});


// ── VALIDATION HELPERS ────────────────────────────────────────
const $ = (id) => document.getElementById(id);

function showErr(input, errId, msg) {
  input.classList.add('error');
  input.classList.remove('success');
  const el = $(errId);
  el.textContent = msg;
  el.classList.add('visible');
}

function clearErr(input, errId) {
  input.classList.remove('error');
  const el = $(errId);
  el.textContent = '';
  el.classList.remove('visible');
}

function markOk(input) {
  input.classList.remove('error');
  input.classList.add('success');
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Inputs
const fullnameInput = $('fullname');
const emailInput    = $('email');
const passInput     = $('password');
const confirmInput  = $('confirm-password');
const signupBtn     = $('signupBtn');
const btnLoader     = $('btnLoader');
const btnText       = signupBtn.querySelector('.btn-text');


// ── BLUR VALIDATION ───────────────────────────────────────────
fullnameInput.addEventListener('blur', () => {
  const v = fullnameInput.value.trim();
  if (!v)           showErr(fullnameInput, 'fullname-error', 'Nama lengkap wajib diisi.');
  else if (v.length < 2) showErr(fullnameInput, 'fullname-error', 'Nama terlalu pendek.');
  else { clearErr(fullnameInput, 'fullname-error'); markOk(fullnameInput); }
});

emailInput.addEventListener('blur', () => {
  const v = emailInput.value.trim();
  if (!v)           showErr(emailInput, 'email-error', 'Email wajib diisi.');
  else if (!isEmail(v)) showErr(emailInput, 'email-error', 'Format email tidak valid.');
  else { clearErr(emailInput, 'email-error'); markOk(emailInput); }
});

passInput.addEventListener('blur', () => {
  const v = passInput.value;
  if (!v)           showErr(passInput, 'password-error', 'Password wajib diisi.');
  else if (v.length < 8) showErr(passInput, 'password-error', 'Password minimal 8 karakter.');
  else { clearErr(passInput, 'password-error'); markOk(passInput); }
});

confirmInput.addEventListener('blur', () => {
  const v = confirmInput.value;
  if (!v)                showErr(confirmInput, 'confirm-password-error', 'Konfirmasi password wajib diisi.');
  else if (v !== passInput.value) showErr(confirmInput, 'confirm-password-error', 'Password tidak cocok.');
  else { clearErr(confirmInput, 'confirm-password-error'); markOk(confirmInput); }
});

// Clear state on input
[fullnameInput, emailInput, passInput, confirmInput].forEach((el) => {
  el.addEventListener('input', () => el.classList.remove('error', 'success'));
});


// ── SUBMIT ────────────────────────────────────────────────────
signupBtn.addEventListener('click', function (e) {
  // Ripple
  const rect   = this.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const circle = document.createElement('span');
  circle.classList.add('ripple');
  circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  this.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());

  // Validate all
  let ok = true;

  const fn  = fullnameInput.value.trim();
  const em  = emailInput.value.trim();
  const pw  = passInput.value;
  const cpw = confirmInput.value;

  if (!fn || fn.length < 2) { showErr(fullnameInput, 'fullname-error', fn ? 'Nama terlalu pendek.' : 'Nama lengkap wajib diisi.'); ok = false; }
  else { clearErr(fullnameInput, 'fullname-error'); markOk(fullnameInput); }

  if (!em) { showErr(emailInput, 'email-error', 'Email wajib diisi.'); ok = false; }
  else if (!isEmail(em)) { showErr(emailInput, 'email-error', 'Format email tidak valid.'); ok = false; }
  else { clearErr(emailInput, 'email-error'); markOk(emailInput); }

  if (!pw) { showErr(passInput, 'password-error', 'Password wajib diisi.'); ok = false; }
  else if (pw.length < 8) { showErr(passInput, 'password-error', 'Password minimal 8 karakter.'); ok = false; }
  else { clearErr(passInput, 'password-error'); markOk(passInput); }

  if (!cpw) { showErr(confirmInput, 'confirm-password-error', 'Konfirmasi password wajib diisi.'); ok = false; }
  else if (cpw !== pw) { showErr(confirmInput, 'confirm-password-error', 'Password tidak cocok.'); ok = false; }
  else { clearErr(confirmInput, 'confirm-password-error'); markOk(confirmInput); }

  if (!ok) return;

  // Loading
  signupBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.add('show');

  setTimeout(() => {
    signupBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.remove('show');

    // Success state
    btnText.textContent        = '✓ Akun Berhasil Dibuat!';
    signupBtn.style.background = '#4dd9ac';
    signupBtn.style.boxShadow  = '0 4px 20px rgba(77,217,172,0.4)';

    setTimeout(() => {
      btnText.textContent        = 'Sign Up';
      signupBtn.style.background = '';
      signupBtn.style.boxShadow  = '';
    }, 2500);
  }, 1800);
});