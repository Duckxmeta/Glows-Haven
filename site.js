/* Browser-only scripts for Glow's Haven (loaded via <script src="site.js">) */

function toggleMobileMenu() {
    if (window.innerWidth <= 991) {
        const menu = document.getElementById('navigationMenu');
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const overlay = document.getElementById('navPagesOverlay');

        menu.classList.toggle('mobile-menu-active');
        toggleBtn.classList.toggle('open-active');
        if (overlay) closeNavPagesOverlay();

        document.body.style.overflow = menu.classList.contains('mobile-menu-active')
            ? 'hidden'
            : '';
    }
}

/* Full-screen pages overlay (Team, Contact, …) */
(function initNavPagesOverlay() {
    const toggle = document.getElementById('navMoreToggle');
    const overlay = document.getElementById('navPagesOverlay');
    const backdrop = document.getElementById('navPagesBackdrop');
    const closeBtn = document.getElementById('navPagesClose');
    const wrap = document.querySelector('.nav-more-wrap');
    const menu = document.getElementById('navMoreMenu');

    if (!toggle || !overlay || !menu) return;

    function openOverlay() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        if (wrap) wrap.classList.add('is-open');
        document.body.classList.add('nav-pages-open');
        document.body.style.overflow = 'hidden';
    }

    function closeOverlay() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        if (wrap) wrap.classList.remove('is-open');
        document.body.classList.remove('nav-pages-open');
        document.body.style.overflow = '';
    }

    window.closeNavPagesOverlay = closeOverlay;

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (overlay.classList.contains('is-open')) {
            closeOverlay();
        } else {
            openOverlay();
        }
    });

    if (backdrop) backdrop.addEventListener('click', closeOverlay);
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeOverlay();
        }
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeOverlay);
        var path = window.location.pathname.split('/').pop() || 'index.html';
        if (link.getAttribute('href') === path) {
            link.classList.add('is-current');
        }
    });
})();

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
