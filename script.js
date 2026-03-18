/* ═══════════════════════════════════════════════
   AMNA'S 18TH BIRTHDAY — script.js
═══════════════════════════════════════════════ */
'use strict';

/* ── DOM References ── */
const navbar = document.getElementById('navbar');
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bgMusic');
const sparkleBg = document.getElementById('sparkleBg');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpConfirm = document.getElementById('rsvpConfirm');
const rsvpReset = document.getElementById('rsvpReset');
const confirmText = document.getElementById('confirmText');
const confettiCanvas = document.getElementById('confetti-canvas');
const heroContent = document.getElementById('heroContent');

/* ── Hero entry animation (double-rAF guarantees it runs after first paint) ── */
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        if (heroContent) heroContent.classList.add('animate-in');
    });
});

/* ════════════════════════════════════════════════
   1. SPARKLE BACKGROUND
════════════════════════════════════════════════ */
(function createSparkles() {
    const colors = ['#f8c8d4', '#e8a0b8', '#d4a843', '#f0d080', '#e8e0f0', '#fde8ef'];
    const sizes = [4, 6, 8, 10, 5, 7];
    for (let i = 0; i < 50; i++) {
        const el = document.createElement('div');
        el.className = 'sparkle';
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dur = (3 + Math.random() * 5).toFixed(2) + 's';
        const delay = (Math.random() * 8).toFixed(2) + 's';
        el.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      --dur:${dur}; --delay:${delay};
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
        sparkleBg.appendChild(el);
    }
})();

/* ════════════════════════════════════════════════
   2. NAVBAR — scroll effect + hamburger
════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navHamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navHamburger.setAttribute('aria-expanded', open);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ════════════════════════════════════════════════
   3. SMOOTH SCROLL (for older browsers without CSS scroll-behavior)
════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 62;
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});


/* ════════════════════════════════════════════════
   4. FADE-ON-SCROLL — Intersection Observer
════════════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            // Stagger child elements within the same parent
            setTimeout(() => entry.target.classList.add('visible'), idx * 80);
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-on-scroll').forEach(el => fadeObserver.observe(el));

/* ════════════════════════════════════════════════
   5. COUNTDOWN TIMER — March 21, 2026 08:00 AM
════════════════════════════════════════════════ */
(function initCountdown() {
    const target = new Date('2026-03-21T08:00:00+08:00').getTime();
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');
    const doneEl = document.getElementById('countdown-done');
    const cdEl = document.getElementById('countdown');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            cdEl.classList.add('hidden');
            doneEl.classList.remove('hidden');
            return;
        }

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        dEl.textContent = pad(days);
        hEl.textContent = pad(hours);
        mEl.textContent = pad(mins);
        sEl.textContent = pad(secs);
    }

    tick();
    setInterval(tick, 1000);
})();

/* ════════════════════════════════════════════════
   6. RSVP FORM — Validation & Submission
════════════════════════════════════════════════ */
function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}
function clearErrors() {
    ['name-error', 'attend-error'].forEach(id => showError(id, ''));
}

rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('rsvp-name').value.trim();
    const attend = document.querySelector('input[name="attend"]:checked');
    const message = document.getElementById('rsvp-message').value.trim();
    let valid = true;

    if (!name) {
        showError('name-error', 'Please enter your name.');
        valid = false;
    }
    if (!attend) {
        showError('attend-error', 'Please let us know if you can attend.');
        valid = false;
    }

    if (!valid) return;

    const attending = attend.value === 'yes';

    // Build confirmation message
    let msg = attending
        ? `We're so excited to see you, <strong>${name}</strong>! 🌸 Your presence will make the day even more special.`
        : `We understand, <strong>${name}</strong>. You will be missed! 💕 Thank you for letting us know.`;

    if (message) {
        msg += `<br/><br/><em>"${message}"</em>`;
    }

    confirmText.innerHTML = msg;

    // Show confirmation panel
    rsvpForm.classList.add('hidden');
    rsvpConfirm.classList.remove('hidden');

    // Fire confetti if attending!
    if (attending) launchConfetti();
});

rsvpReset.addEventListener('click', () => {
    rsvpForm.reset();
    clearErrors();
    rsvpConfirm.classList.add('hidden');
    rsvpForm.classList.remove('hidden');
});

/* ════════════════════════════════════════════════
   7. CONFETTI ANIMATION
════════════════════════════════════════════════ */
function launchConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    const W = confettiCanvas.width = window.innerWidth;
    const H = confettiCanvas.height = window.innerHeight;
    const colors = ['#f8c8d4', '#e8a0b8', '#d4a843', '#f0d080', '#c97a8a', '#e8e0f0', '#ffffff'];
    const pieces = [];
    const count = 180;

    for (let i = 0; i < count; i++) {
        pieces.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            w: 6 + Math.random() * 8,
            h: 10 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: -2 + Math.random() * 4,
            vy: 3 + Math.random() * 5,
            angle: Math.random() * Math.PI * 2,
            spin: (-0.1 + Math.random() * 0.2),
            alpha: 1,
        });
    }

    let raf;
    let frames = 0;
    const maxFrames = 200;

    function draw() {
        ctx.clearRect(0, 0, W, H);
        frames++;

        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.spin;
            if (frames > 120) p.alpha -= 0.012;
            p.alpha = Math.max(0, p.alpha);

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        if (frames < maxFrames) {
            raf = requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, W, H);
            cancelAnimationFrame(raf);
        }
    }

    draw();
}

/* Auto-launch confetti on page load */
window.addEventListener('load', () => {
    setTimeout(launchConfetti, 600);
});

/* ════════════════════════════════════════════════
   8. MUSIC TOGGLE (graceful — requires actual audio src)
════════════════════════════════════════════════ */
let musicPlaying = false;

musicToggle.addEventListener('click', async () => {
    if (!bgMusic.src || bgMusic.src === window.location.href) {
        // No audio file set — show a gentle hint
        musicToggle.style.animation = 'none';
        musicIcon.textContent = '🎵';
        setTimeout(() => { musicIcon.textContent = '♪'; }, 1200);
        return;
    }

    try {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicToggle.classList.remove('playing');
            musicIcon.textContent = '♪';
        } else {
            await bgMusic.play();
            musicPlaying = true;
            musicToggle.classList.add('playing');
            musicIcon.textContent = '♫';
        }
    } catch (_) {
        // Autoplay blocked — do nothing
    }
});

/* ════════════════════════════════════════════════
   9. HANDLE WINDOW RESIZE for confetti canvas
════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}, { passive: true });
