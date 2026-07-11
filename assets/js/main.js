/* =====================================================
   Pollard Samba Portfolio — main.js
   Interactions, animations, and ambient life
   ===================================================== */

/* ── 1. Mobile menu ─────────────────────────────────── */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

/* ── 2. Scroll-reveal ───────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 3. Active nav highlight ────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

sections.forEach(section => activeObserver.observe(section));

/* ── 4. Cursor glow (desktop only) ─────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    Object.assign(glow.style, {
        position: 'fixed',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,92,38,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.18s ease, top 0.18s ease',
        zIndex: '0',
        left: '-999px',
        top: '-999px',
    });
    document.body.appendChild(glow);

    window.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    });
}

/* ── 5. Skill pill staggered entrance ───────────────── */
const skillSection = document.getElementById('skills');
if (skillSection) {
    const pillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pills = entry.target.querySelectorAll('.skill-pill');
                pills.forEach((pill, i) => {
                    pill.style.opacity = '0';
                    pill.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        pill.style.transition = 'opacity 0.35s ease, transform 0.35s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease';
                        pill.style.opacity = '1';
                        pill.style.transform = 'translateY(0)';
                    }, i * 45);
                });
                pillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    pillObserver.observe(skillSection);
}

/* ── 6. Project card tilt on hover (desktop) ────────── */
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-4px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
            card.style.transition = 'transform 0.1s ease, box-shadow 0.25s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.4s ease, box-shadow 0.25s ease';
        });
    });
}

/* ── 7. Typewriter cycle in hero subtitle ───────────── */
const roles = [
    'Software Engineer',
    'Web & Mobile Developer',
    'GitOps Engineer',
    'AI / ML Enthusiast',
    'Builder of things.',
];

const typeTarget = document.getElementById('typewriter');
if (typeTarget) {
    let rIdx = 0, cIdx = 0, deleting = false;

    function tick() {
        const current = roles[rIdx];
        if (!deleting) {
            typeTarget.textContent = current.slice(0, ++cIdx);
            if (cIdx === current.length) {
                deleting = true;
                setTimeout(tick, 1800);
                return;
            }
        } else {
            typeTarget.textContent = current.slice(0, --cIdx);
            if (cIdx === 0) {
                deleting = false;
                rIdx = (rIdx + 1) % roles.length;
            }
        }
        setTimeout(tick, deleting ? 45 : 80);
    }
    setTimeout(tick, 900);
}

/* ── 8. Scroll progress bar ─────────────────────────── */
const progressBar = document.createElement('div');
Object.assign(progressBar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '2px',
    width: '0%',
    background: 'linear-gradient(90deg, #c45c26, #a3471a)',
    zIndex: '9999',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
});
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
}, { passive: true });

/* ── 9. Smooth anchor nav with offset ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ── 10. Footer year auto-update ────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── 11. Hello World tooltip on language pills ──────── */
(function () {
    const tooltip = document.createElement('div');
    tooltip.className = 'hw-tooltip';
    document.body.appendChild(tooltip);

    let typeTimer = null;

    function typeInto(text) {
        tooltip.textContent = '';
        let i = 0;
        clearInterval(typeTimer);
        typeTimer = setInterval(() => {
            tooltip.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(typeTimer);
        }, 28);
    }

    function position(pill) {
        const rect  = pill.getBoundingClientRect();
        const tw    = tooltip.offsetWidth;
        const pad   = 10;

        let left = rect.left + (rect.width / 2) - (tw / 2);
        let top  = rect.top - tooltip.offsetHeight - 14;

        left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
        if (top < 10) top = rect.bottom + 14;

        tooltip.style.left = left + 'px';
        tooltip.style.top  = top  + 'px';
    }

    document.querySelectorAll('[data-hello]').forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            const raw = pill.getAttribute('data-hello')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>');
            typeInto(raw);
            tooltip.classList.add('visible');
            position(pill);
        });

        pill.addEventListener('mousemove', () => position(pill));

        pill.addEventListener('mouseleave', () => {
            clearInterval(typeTimer);
            tooltip.classList.remove('visible');
        });
    });
})();
