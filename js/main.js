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
                target.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        });
    });

    const observerOptions = {threshold: 0.1, rootMargin: '0px 0px -50px 0px'};
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
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

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const button = contactForm.querySelector('button');
            const original = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = 'Message Sent!';
                button.style.background = '#28a745';
                setTimeout(() => {
                    button.textContent = original;
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
    /* Removed parallax effect on the services hero to prevent flicker */
});
