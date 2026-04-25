/* ============================================================
   CAMPREN — Sign Up Page Script
   - Animated wave canvas background
   - Form validation
   - Toggle password visibility
   - Button ripple + loading state
============================================================ */

// ── WAVE CANVAS ──────────────────────────────────────────────

(function initWave() {
  const canvas  = document.getElementById('waveCanvas');
  const ctx     = canvas.getContext('2d');
  let W, H, animId;

  const WAVES = [];
  const WAVE_COUNT = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildWaves();
  }

  function buildWaves() {
    WAVES.length = 0;
    for (let i = 0; i < WAVE_COUNT; i++) {
      WAVES.push({
        yBase:     H * 0.1 + (H * 0.85) * (i / WAVE_COUNT),
        amplitude: 28 + Math.random() * 60,
        frequency: 0.003 + Math.random() * 0.006,
        speed:     0.0003 + Math.random() * 0.0007,
        phase:     Math.random() * Math.PI * 2,
        alpha:     0.05 + 0.25 * Math.pow(Math.sin((i / WAVE_COUNT) * Math.PI), 1.5),
        hue:       260 + (i / WAVE_COUNT) * 40,   // purple → blueish
        sat:       50 + (i / WAVE_COUNT) * 30,
        lgt:       40 + (i / WAVE_COUNT) * 20,
      });
    }
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Subtle radial glow on left side
    const grd = ctx.createRadialGradient(W * 0.28, H * 0.48, 0, W * 0.28, H * 0.48, H * 0.6);
    grd.addColorStop(0,   'rgba(100, 50, 160, 0.12)');
    grd.addColorStop(0.5, 'rgba(60,  20, 100, 0.06)');
    grd.addColorStop(1,   'rgba(0,   0,   0,  0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    WAVES.forEach((w) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        // Two overlapping sines for organic look
        const y =
          w.yBase +
          Math.sin(x * w.frequency + t * w.speed * 1000 + w.phase) * w.amplitude +
          Math.sin(x * w.frequency * 1.8 + t * w.speed * 600 + w.phase * 1.3) * w.amplitude * 0.35;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${w.hue}, ${w.sat}%, ${w.lgt}%, ${w.alpha})`;
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    t += 0.016;
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


// ── TOGGLE PASSWORD ───────────────────────────────────────────

document.querySelectorAll('.toggle-password').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input    = document.getElementById(targetId);
    const icon     = btn.querySelector('.eye-icon');

    if (input.type === 'password') {
      input.type = 'text';
      // Eye-slash icon
      icon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
    } else {
      input.type = 'password';
      icon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
    }
  });
});


// ── FORM VALIDATION ───────────────────────────────────────────

const fullnameInput = document.getElementById('fullname');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput  = document.getElementById('confirm-password');
const signupBtn     = document.getElementById('signupBtn');
const btnLoader     = document.getElementById('btnLoader');
const btnText       = signupBtn.querySelector('.btn-text');

function showError(inputEl, errorId, msg) {
  inputEl.classList.add('error');
  inputEl.classList.remove('success');
  const errEl = document.getElementById(errorId);
  errEl.textContent = msg;
  errEl.classList.add('visible');
}

function clearError(inputEl, errorId) {
  inputEl.classList.remove('error');
  const errEl = document.getElementById(errorId);
  errEl.textContent = '';
  errEl.classList.remove('visible');
}

function markSuccess(inputEl) {
  inputEl.classList.remove('error');
  inputEl.classList.add('success');
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value) {
  return value.length >= 8;
}

// Live validation
emailInput.addEventListener('blur', () => {
  const v = emailInput.value.trim();
  if (!v) {
    showError(emailInput, 'email-error', 'Email is required.');
  } else if (!validateEmail(v)) {
    showError(emailInput, 'email-error', 'Enter a valid email address.');
  } else {
    clearError(emailInput, 'email-error');
    markSuccess(emailInput);
  }
});

fullnameInput.addEventListener('blur', () => {
  const v = fullnameInput.value.trim();

  if (!v) {
    showError(fullnameInput, 'fullname-error', 'Nama wajib diisi.');
  } else if (v.length < 3) {
    showError(fullnameInput, 'fullname-error', 'Nama terlalu pendek.');
  } else {
    clearError(fullnameInput, 'fullname-error');
    markSuccess(fullnameInput);
  }
});

passwordInput.addEventListener('blur', () => {
  const v = passwordInput.value;
  if (!v) {
    showError(passwordInput, 'password-error', 'Password is required.');
  } else if (!validatePassword(v)) {
    showError(passwordInput, 'password-error', 'Password must be at least 8 characters.');
  } else {
    clearError(passwordInput, 'password-error');
    markSuccess(passwordInput);
  }
});

confirmInput.addEventListener('blur', () => {
  const v  = confirmInput.value;
  const pw = passwordInput.value;
  if (!v) {
    showError(confirmInput, 'confirm-password-error', 'Please confirm your password.');
  } else if (v !== pw) {
    showError(confirmInput, 'confirm-password-error', 'Passwords do not match.');
  } else {
    clearError(confirmInput, 'confirm-password-error');
    markSuccess(confirmInput);
  }
});

// Clear error on input
[fullnameInput, emailInput, passwordInput, confirmInput].forEach((el) => {
  el.addEventListener('input', () => {
    el.classList.remove('error', 'success');
  });
});


// ── RIPPLE EFFECT ─────────────────────────────────────────────

signupBtn.addEventListener('click', function (e) {
  // Ripple
  const btn    = this;
  const circle = document.createElement('span');
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  circle.classList.add('ripple');
  circle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top: ${e.clientY - rect.top - size / 2}px;
  `;
  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());

  // Validate all
  let valid = true;

  const namaVal    = fullnameInput.value.trim();
  const emailVal   = emailInput.value.trim();
  const passVal    = passwordInput.value;
  const confirmVal = confirmInput.value;

  if (!namaVal) {
    showError(fullnameInput, 'fullname-error', 'Nama wajib diisi.');
    valid = false;
} else if (namaVal.length < 3) {
    showError(fullnameInput, 'fullname-error', 'Nama terlalu pendek.');
    valid = false;
} else {
    clearError(fullnameInput, 'fullname-error');
    markSuccess(fullnameInput);
}

  if (!emailVal) {
    showError(emailInput, 'email-error', 'Email is required.'); valid = false;
  } else if (!validateEmail(emailVal)) {
    showError(emailInput, 'email-error', 'Enter a valid email address.'); valid = false;
  } else {
    clearError(emailInput, 'email-error');
    markSuccess(emailInput);
  }

  if (!passVal) {
    showError(passwordInput, 'password-error', 'Password is required.'); valid = false;
  } else if (!validatePassword(passVal)) {
    showError(passwordInput, 'password-error', 'Password must be at least 8 characters.'); valid = false;
  } else {
    clearError(passwordInput, 'password-error');
    markSuccess(passwordInput);
  }

  if (!confirmVal) {
    showError(confirmInput, 'confirm-password-error', 'Please confirm your password.'); valid = false;
  } else if (confirmVal !== passVal) {
    showError(confirmInput, 'confirm-password-error', 'Passwords do not match.'); valid = false;
  } else {
    clearError(confirmInput, 'confirm-password-error');
    markSuccess(confirmInput);
  }

  if (!valid) return;

  // REAL SIGNUP API

signupBtn.disabled = true;
btnText.classList.add('hidden');
btnLoader.classList.add('show');

fetch("http://localhost:8080/api/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nama: namaVal,
      email: emailVal,
      password: passVal
  })
})
.then(response => response.text())
.then(result => {

    signupBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.remove('show');

    if (result === "registered") {

        btnText.textContent = "✓ Account Created!";
        signupBtn.style.background = "#4dd9ac";

        setTimeout(() => {
            btnText.textContent = "Sign Up";
            signupBtn.style.background = "";
        }, 2500);

    } else if (result === "email exists") {

        showError(emailInput, "email-error", "Email already registered.");

    } else {

        alert("Signup failed.");

    }

})
.catch(error => {

    signupBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.remove('show');

    alert("Server error.");
    console.error(error);

});
});