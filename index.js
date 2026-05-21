const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/* ==========================================================================
   MOBILE INTERACTIVE HAMBURGER NAV LOGIC
   ========================================================================== */
function toggleMobileMenu() {
    if (window.innerWidth <= 991) {
        const menu = document.getElementById('navigationMenu');
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const moreWrap = document.querySelector('.nav-more-wrap');

        menu.classList.toggle('mobile-menu-active');
        toggleBtn.classList.toggle('open-active');
        if (moreWrap) moreWrap.classList.remove('is-open');

        if (menu.classList.contains('mobile-menu-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

/* More-pages dropdown (desktop hamburger) */
(function initNavMoreMenu() {
    const wrap = document.querySelector('.nav-more-wrap');
    const toggle = document.getElementById('navMoreToggle');
    const menu = document.getElementById('navMoreMenu');
    if (!wrap || !toggle || !menu) return;

    function closeMenu() {
        wrap.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        wrap.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (wrap.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
})();

/* ==========================================================================
   HERO STAR CANVAS: TWINKLING CONSTELLATION LAYER
   Draws ~160 stars with sinusoidal opacity animation.
   Each star has its own phase and speed so they breathe independently.
   ========================================================================== */
(function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let animFrame;

    function resize() {
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        buildStars();
    }

    function buildStars() {
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 5800);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.4 + 0.3,
                phase: Math.random() * Math.PI * 2,
                speed: 0.4 + Math.random() * 1.1,
                baseAlpha: 0.25 + Math.random() * 0.55,
                color: Math.random() > 0.85
                    ? 'rgba(72,201,176,'
                    : Math.random() > 0.6
                        ? 'rgba(232,213,176,'
                        : 'rgba(255,255,255,'
            });
        }
    }

    function draw(ts) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = ts * 0.001;

        for (const s of stars) {
            const alpha = s.baseAlpha * (0.45 + 0.55 * Math.sin(t * s.speed + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color + alpha.toFixed(3) + ')';
            ctx.fill();
        }

        animFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    animFrame = requestAnimationFrame(draw);
})();

/* ==========================================================================
   LETTER FRAME: scroll fades at top/bottom of inner viewport
   ========================================================================== */
(function initLetterScrollFades() {
    const scrollEl = document.getElementById('letterScroll');
    const viewport = scrollEl ? scrollEl.closest('.scroll-card-viewport') : null;
    if (!scrollEl || !viewport) return;

    const fadeTop = viewport.querySelector('.scroll-card-fade--top');
    const fadeBottom = viewport.querySelector('.scroll-card-fade--bottom');
    const edgeThreshold = 20;

    function updateFades() {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        const atTop = scrollTop <= edgeThreshold;
        const atBottom = scrollTop + clientHeight >= scrollHeight - edgeThreshold;

        if (fadeTop) fadeTop.classList.toggle('is-hidden', atTop);
        if (fadeBottom) fadeBottom.classList.toggle('is-hidden', atBottom);
    }

    scrollEl.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);
    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(updateFades);
        ro.observe(scrollEl);
    }
    updateFades();
})();
