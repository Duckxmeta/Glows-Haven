/* Browser-only scripts for Glow's Haven */

(function removeLegacyNavUI() {
    document.querySelectorAll('.mobile-nav-toggle').forEach(function (el) {
        el.remove();
    });
    document.querySelectorAll('.nav-more-menu').forEach(function (el) {
        el.remove();
    });
    var nav = document.getElementById('navigationMenu');
    if (nav) {
        nav.classList.remove('mobile-menu-active');
        var stray = nav.querySelectorAll('a[href="team.html"], a[href="contact.html"]');
        stray.forEach(function (link) {
            link.remove();
        });
    }
})();

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
    }

    function closeOverlay() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        if (wrap) wrap.classList.remove('is-open');
        document.body.classList.remove('nav-pages-open');
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

    var path = window.location.pathname.split('/').pop() || 'index.html';
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeOverlay);
        var href = link.getAttribute('href');
        if (href && (href === path || href.split('#')[0] === path)) {
            link.classList.add('is-current');
        }
    });
})();

(function initDonateModal() {
    var openers = document.querySelectorAll('[data-donate-modal]');
    var modal = document.getElementById('donateModal');
    if (!modal) return;

    var backdrop = modal.querySelector('.donate-modal-backdrop');
    var closeBtn = modal.querySelector('.donate-modal-close');
    var steps = modal.querySelectorAll('.donate-step');

    function showStep(name) {
        steps.forEach(function (step) {
            var active = step.getAttribute('data-step') === name;
            step.classList.toggle('is-active', active);
            if (active) {
                step.removeAttribute('hidden');
            } else {
                step.setAttribute('hidden', '');
            }
        });
    }

    function openModal() {
        showStep('paths');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('donate-modal-open');
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('donate-modal-open');
        showStep('paths');
    }

    openers.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    });

    modal.querySelectorAll('[data-donate-go]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            showStep(btn.getAttribute('data-donate-go'));
        });
    });

    modal.querySelectorAll('[data-donate-back]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            showStep('paths');
        });
    });

    modal.querySelectorAll('[data-copy-target]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-copy-target');
            var el = document.getElementById(id);
            if (!el) return;
            var text = el.textContent.trim();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    btn.textContent = 'Copied';
                    setTimeout(function () {
                        btn.textContent = 'Copy Address';
                    }, 2000);
                });
            }
        });
    });

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
})();

(function initSpeciesSlider() {
    var slider = document.getElementById('speciesSlider');
    var range = document.getElementById('speciesRange');
    if (!slider || !range) return;

    function update() {
        var val = parseInt(range.value, 10);
        range.setAttribute('aria-valuenow', String(val));
        slider.classList.remove('is-past-heavy', 'is-future-heavy');
        if (val < 40) slider.classList.add('is-past-heavy');
        if (val > 60) slider.classList.add('is-future-heavy');
        var track = slider.querySelector('.before-after-slider-track');
        if (track) {
            track.style.gridTemplateColumns = val + '% ' + (100 - val) + '%';
        }
    }

    range.addEventListener('input', update);
    update();
})();

(function initRescueMap() {
    var mapEl = document.getElementById('rescueMap');
    if (!mapEl || typeof L === 'undefined') return;

    var map = L.map(mapEl, {
        scrollWheelZoom: false,
        attributionControl: true
    }).setView([28.5, -87.2], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 12,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var route = [
        [24.2, -83.5],
        [26.1, -85.0],
        [27.8, -86.4],
        [28.9, -87.1],
        [29.4, -88.2],
        [28.6, -89.0]
    ];

    var path = L.polyline(route, {
        color: '#48C9B0',
        weight: 3,
        opacity: 0.85,
        dashArray: '8, 10'
    }).addTo(map);

    var marker = L.circleMarker(route[route.length - 1], {
        radius: 10,
        fillColor: '#E8D5B0',
        color: '#48C9B0',
        weight: 2,
        fillOpacity: 0.95
    }).addTo(map).bindPopup('<strong>Marina</strong><br>Last sighting: Gulf Coast<br>Status: Recovering / Healthy');

    map.fitBounds(path.getBounds(), { padding: [28, 28] });

    var step = 0;
    setInterval(function () {
        step = (step + 1) % route.length;
        marker.setLatLng(route[step]);
    }, 4000);

    setTimeout(function () {
        map.invalidateSize();
    }, 400);
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
