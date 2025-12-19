const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
const html = document.documentElement;

const sunIcon = '<circle cx="12" cy="12" r="5"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>';
const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
} else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
        updateIcon('dark');
    }
}

darkModeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
    
    darkModeToggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
        darkModeToggle.style.transform = '';
    }, 300);
});

function updateIcon(theme) {
    if (theme === 'dark') {
        darkModeIcon.innerHTML = sunIcon;
    } else {
        darkModeIcon.innerHTML = moonIcon;
    }
}

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = mobileMenuToggle.classList.toggle('open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        nav.classList.toggle('active', isOpen);
    });
}

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 4px 20px var(--shadow-color)';
    } else {
        header.style.boxShadow = '0 6px 30px var(--shadow-color)';
    }
    
    lastScroll = currentScroll;
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const serviceCards = document.querySelectorAll('.service-card');
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('.modal-close');

serviceCards.forEach(card => {
    const openModal = () => {
        const modalId = card.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    };
    
    card.addEventListener('click', openModal);
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    });
});

modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = closeBtn.closest('.modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; 
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Form handling removed (no form present in markup)

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.service-card, .contact-item, .partner-logo');
elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

const galleryItems = document.querySelectorAll('.gallery-item');

function initGalleryScrollReveal() {
    const isMobile = window.matchMedia('(max-width: 968px)').matches;
    
    if (isMobile && galleryItems.length > 0) {
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(galleryItems).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100); 
                } else {
                    entry.target.classList.remove('revealed');
                }
            });
        }, {
            threshold: 0.3, 
            rootMargin: '-20% 0px -20% 0px' 
        });

        galleryItems.forEach(item => {
            galleryObserver.observe(item);
        });
        
        return galleryObserver;
    }
    
    return null;
}

let galleryObserver = initGalleryScrollReveal();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (galleryObserver) {
            galleryItems.forEach(item => {
                galleryObserver.unobserve(item);
                item.classList.remove('revealed'); 
            });
        }
        if (partnerObserver) {
            partnerLogos.forEach(logo => {
                partnerObserver.unobserve(logo);
                logo.classList.remove('revealed');
            });
        }
        galleryObserver = initGalleryScrollReveal();
        partnerObserver = initPartnerLogoReveal();
    }, 250);
});

const partnerLogos = document.querySelectorAll('.partner-logo');

function initPartnerLogoReveal() {
    const isMobile = window.matchMedia('(max-width: 968px)').matches;
    
    if (isMobile && partnerLogos.length > 0) {
        const partnerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                } else {
                    entry.target.classList.remove('revealed');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-30% 0px -30% 0px'
        });

        partnerLogos.forEach(logo => {
            partnerObserver.observe(logo);
        });
        
        return partnerObserver;
    }
    
    return null;
}

let partnerObserver = initPartnerLogoReveal();

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

const hero = document.querySelector('.hero');
if (hero) {
    let ticking = false;

    function updateHeroParallax() {
        const scrollY = window.pageYOffset || window.scrollY;
        const heroTop = hero.offsetTop;
        const distance = scrollY - heroTop;

        const offset = Math.round(distance * 0.25);
        hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeroParallax);
            ticking = true;
        }
    }

    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) {
        window.addEventListener('scroll', onScroll, { passive: true });
        updateHeroParallax();
    }
}

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('SAFI - Site initialisé avec succès ✓');
console.log('🌙 Dark mode disponible - Cliquez sur le bouton en bas à droite');
