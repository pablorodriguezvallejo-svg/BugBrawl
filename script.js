/* ==========================================
   BUG BRAWL — JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    createFloatingLeaves();
});

/* ==========================================
   1. NAVBAR
   ========================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================
   2. MENÚ MOBILE
   ========================================== */
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const close = document.getElementById('menu-close');
    const links = menu.querySelectorAll('a');

    toggle.addEventListener('click', () => {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));

    function closeMenu() {
        menu.classList.remove('open');
        document.body.style.overflow = '';
    }
}

/* ==========================================
   3. SCROLL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* ==========================================
   4. CONTADORES
   ========================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1600;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ==========================================
   5. ROBAR CARTA — Solo imagen
   ========================================== */

// Imágenes de cada carta. Pon aquí las rutas reales cuando tengas las fotos.
// Mientras tanto, las cartas se quedan en modo placeholder.
const cardImages = [
    'imagenes/hormiga.png',
    'imagenes/escarabajo.png',
    'imagenes/mariposa.png'
];

let isFlipped = false;
let lastIndex = -1;

function flipCard() {
    const card = document.getElementById('draw-card');
    const hint = document.getElementById('draw-hint');

    if (isFlipped) {
        card.classList.remove('flipped');
        setTimeout(() => {
            setCardImage();
            card.classList.add('flipped');
        }, 450);
    } else {
        setCardImage();
        card.classList.add('flipped');
        hint.style.opacity = '1';
    }

    isFlipped = true;
}

function setCardImage() {
    let index;
    do {
        index = Math.floor(Math.random() * cardImages.length);
    } while (index === lastIndex && cardImages.length > 1);
    lastIndex = index;

    const container = document.getElementById('draw-image');
    const src = cardImages[index];

    container.style.backgroundImage = "url('" + src + "')";

    // Si la imagen existe de verdad, quitar placeholder
    // Si no existe (404), mantener placeholder
    const testImg = new Image();
    testImg.onload = function () {
        container.classList.add('has-image');
    };
    testImg.onerror = function () {
        container.style.backgroundImage = '';
        container.classList.remove('has-image');
    };
    testImg.src = src;
}

/* ==========================================
   6. FORMULARIO EMAIL
   ========================================== */
function handleEmailSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('email-form');
    const success = document.getElementById('email-success');

    form.style.opacity = '0.5';
    form.style.pointerEvents = 'none';

    setTimeout(() => {
        form.style.display = 'none';
        success.style.opacity = '1';
    }, 800);
}

/* ==========================================
   7. SMOOTH SCROLL
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});

/* ==========================================
   8. HOJAS FLOTANTES
   ========================================== */
function createFloatingLeaves() {
    const container = document.getElementById('floating-leaves');
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const leafSVGs = [
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2C6.5 2 2 8 2 14c0 4 3 8 10 8s10-4 10-8c0-6-4.5-12-10-12Z"/><path d="M12 2v20" opacity="0.4"/></svg>',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1.5 5-4 8-9 10Z"/><path d="M11 20l-3-3" opacity="0.5"/></svg>',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22V8"/><path d="M5 12H2l4-4-4-4"/><path d="M19 12h3l-4-4 4-4"/><path d="M8 22l4-6 4 6"/></svg>'
    ];

    const colors = ['#5A7C3A', '#7A9E55', '#C4A35A', '#6B5B45', '#8FA66A'];
    const count = window.innerWidth < 768 ? 4 : 8;

    for (let i = 0; i < count; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('floating-leaf');

        const size = 16 + Math.random() * 14;
        const left = Math.random() * 100;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * duration;
        const color = colors[Math.floor(Math.random() * colors.length)];

        leaf.innerHTML = leafSVGs[Math.floor(Math.random() * leafSVGs.length)];
        leaf.style.cssText =
            'left:' + left + '%;' +
            'width:' + size + 'px;' +
            'height:' + size + 'px;' +
            'color:' + color + ';' +
            'animation-duration:' + duration + 's;' +
            'animation-delay:-' + delay + 's;';

        container.appendChild(leaf);
    }
}