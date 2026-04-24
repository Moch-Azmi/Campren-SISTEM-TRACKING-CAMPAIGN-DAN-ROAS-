/* ─── Wave Canvas ─────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('waveCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, frame = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Curve definitions: each wave has amplitude, frequency, speed, y-offset, color
  const waves = [];
  const palette = [
    'rgba(91,110,245,',   // indigo
    'rgba(120, 80,200,',  // violet
    'rgba(160,100,230,',  // lavender
    'rgba(255,255,255,',  // white ghost
  ];

  for (let i = 0; i < 28; i++) {
    const band = Math.floor(Math.random() * palette.length);
    waves.push({
      amp:   40  + Math.random() * 120,
      freq:  0.003 + Math.random() * 0.006,
      speed: 0.003 + Math.random() * 0.007,
      phase: Math.random() * Math.PI * 2,
      yBase: H * (0.15 + Math.random() * 0.75),
      color: palette[band],
      alpha: 0.04 + Math.random() * 0.14,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    waves.forEach(w => {
      // update yBase lazily so it stays relative after resize
      w.phase += w.speed;
      ctx.beginPath();
      ctx.moveTo(0, H);

      for (let x = 0; x <= W; x += 3) {
        const y = w.yBase
          + Math.sin(x * w.freq + w.phase) * w.amp
          + Math.sin(x * w.freq * 0.4 + w.phase * 1.3) * w.amp * 0.4;
        if (x === 0) ctx.moveTo(x, y);
        else         ctx.lineTo(x, y);
      }

      ctx.strokeStyle = w.color + w.alpha + ')';
      ctx.lineWidth   = 1.2;
      ctx.stroke();
    });

    frame++;
    requestAnimationFrame(draw);
  }

  draw();
})();


/* ─── Password Strength ───────────────────────────────────────────── */
const newPwdInput   = document.getElementById('newPassword');
const confirmInput  = document.getElementById('confirmPassword');
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');
const matchLabel    = document.getElementById('matchLabel');

function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)                    score++;
  if (pwd.length >= 12)                   score++;
  if (/[A-Z]/.test(pwd))                  score++;
  if (/[0-9]/.test(pwd))                  score++;
  if (/[^A-Za-z0-9]/.test(pwd))          score++;
  return score; // 0–5
}

const levels = [
  { pct: '0%',   color: '#f05b5b', label: '' },
  { pct: '20%',  color: '#f05b5b', label: 'Weak' },
  { pct: '40%',  color: '#f0b85b', label: 'Fair' },
  { pct: '65%',  color: '#f0b85b', label: 'Good' },
  { pct: '85%',  color: '#4fdc9a', label: 'Strong' },
  { pct: '100%', color: '#4fdc9a', label: 'Very strong' },
];

newPwdInput.addEventListener('input', () => {
  const pwd   = newPwdInput.value;
  const score = pwd.length ? getStrength(pwd) : 0;
  const lv    = levels[score];
  strengthFill.style.width      = lv.pct;
  strengthFill.style.background = lv.color;
  strengthLabel.textContent     = lv.label;
  strengthLabel.style.color     = lv.color;
  validateMatch();
});

/* ─── Match Validation ────────────────────────────────────────────── */
confirmInput.addEventListener('input', validateMatch);

function validateMatch() {
  const a = newPwdInput.value;
  const b = confirmInput.value;
  if (!b) { matchLabel.textContent = ''; return; }
  if (a === b) {
    matchLabel.textContent = '✓ Passwords match';
    matchLabel.style.color = '#4fdc9a';
  } else {
    matchLabel.textContent = '✗ Passwords do not match';
    matchLabel.style.color = '#f05b5b';
  }
}

/* ─── Eye Toggle ──────────────────────────────────────────────────── */
document.querySelectorAll('.toggle-eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input    = document.getElementById(targetId);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.querySelector('.eye-icon').style.opacity = isHidden ? '.5' : '1';
  });
});

/* ─── Submit ──────────────────────────────────────────────────────── */
document.getElementById('submitBtn').addEventListener('click', () => {
  const pwd     = newPwdInput.value;
  const confirm = confirmInput.value;

  if (!pwd || !confirm) {
    shake(pwd ? confirmInput : newPwdInput);
    return;
  }
  if (pwd !== confirm) {
    shake(confirmInput);
    return;
  }
  if (getStrength(pwd) < 2) {
    shake(newPwdInput);
    strengthLabel.textContent = 'Password is too weak';
    strengthLabel.style.color = '#f05b5b';
    return;
  }

  // Success feedback
  const btn = document.getElementById('submitBtn');
  btn.querySelector('.btn-text').textContent = 'Password updated ✓';
  btn.style.background = '#4fdc9a';
  btn.style.color      = '#0d0d10';
  btn.disabled         = true;
});

function shake(el) {
  el.style.animation = 'none';
  el.getBoundingClientRect(); // reflow
  el.style.animation = 'shake .4s ease';
}

/* ─── Inject shake keyframe ───────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%,100%{ transform: translateX(0); }
  20%    { transform: translateX(-6px); }
  40%    { transform: translateX(6px); }
  60%    { transform: translateX(-4px); }
  80%    { transform: translateX(4px); }
}`;
document.head.appendChild(style);