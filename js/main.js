// Common interactive behaviors
window.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const expanded = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', expanded);
        });

        navLinks.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('click', e => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('header');
                const offset = header ? header.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({top, behavior: 'smooth'});
            }
        });
    });

    const observerOptions = {threshold: 0.1, rootMargin: '0px 0px -50px 0px'};
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale').forEach(el => {
        observer.observe(el);
    });

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        stat.style.transitionDelay = `${index * 0.2}s`;
    });

    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('#navLinks a[href^="#"]');
    const navMap = {};
    navAnchors.forEach(link => {
        const id = link.getAttribute('href').substring(1);
        navMap[id] = link;
    });
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const active = navMap[id];
                if (active) {
                    navAnchors.forEach(a => a.classList.remove('active'));
                    active.classList.add('active');
                }
            }
        });
    }, {threshold: 0.6});
    sections.forEach(section => sectionObserver.observe(section));

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const button = contactForm.querySelector('button');
            const original = button.textContent;
            
            // Add loading spinner
            button.innerHTML = '<span class="loading-spinner"></span>Sending...';
            button.disabled = true;
            
            // Form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ff4757';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                button.innerHTML = original;
                button.disabled = false;
                return;
            }
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                button.style.background = '#28a745';
                setTimeout(() => {
                    button.innerHTML = original;
                    button.disabled = false;
                    button.style.background = '';
                    contactForm.reset();
                }, 2000);
            }, 1000);
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        other.querySelector('.faq-answer').classList.remove('active');
                    }
                });
                if (isActive) {
                    item.classList.remove('active');
                    answer.classList.remove('active');
                } else {
                    item.classList.add('active');
                    answer.classList.add('active');
                }
            });
        });
    }

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        header.style.background = window.scrollY > 100 ? 'rgba(10, 10, 10, 0.98)' : 'rgba(10, 10, 10, 0.95)';
    }
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const total = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / total) * 100;
        progressBar.style.width = progress + '%';
    }

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.style.display = window.scrollY > 200 ? 'flex' : 'none';
    }
    /* Removed parallax effect on the services hero to prevent flicker */
});
