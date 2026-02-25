/* ================================================
   PROFESSIONAL PORTFOLIO - JAVASCRIPT
   Interactive Features & Animations
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initLoader();
    initThemeToggle();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initTypingEffect();
    initCounterAnimation();
    initScrollAnimations();
    initPortfolioFilter();
    initFlipCards();
    initSkillBars();
    initBackToTop();
    initCursorEffect();
    initFormHandling();
    initTestimonialsSlider();
    initAudioPlayers();
    initClientsLightbox();
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 800);
    });
}

/* ============================================
   THEME TOGGLE
   ============================================ */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const links = navLinks.querySelectorAll('.nav-link');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;

    const texts = [
        'قسم التصميـــــم',
        'قسم المونتــــاج',
        'موشن جرافيـــك',
        'تصميم المواقـــع',
        'قسم التصويـــــر',
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing after loader
    setTimeout(type, 1500);
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.section-header, .about-content, .service-card, .portfolio-item, .skill-item, .contact-content');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal', 'active');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            items.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================================
   FLIP SERVICE CARDS
   ============================================ */
function initFlipCards() {
    const flipCards = document.querySelectorAll('.service-card-flip');

    if (!flipCards.length) return;

    flipCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent clicks on links from triggering flip
            if (e.target.closest('a')) return;

            // Toggle flipped state
            card.classList.toggle('flipped');
        });
    });
}

/* ============================================
   SKILL BARS ANIMATION
   ============================================ */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = `${progress}%`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   CURSOR EFFECT
   ============================================ */
function initCursorEffect() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    // Check if device supports hover
    if (window.matchMedia('(hover: hover)').matches && window.innerWidth >= 1024) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;

            setTimeout(() => {
                follower.style.left = `${e.clientX}px`;
                follower.style.top = `${e.clientY}px`;
            }, 50);
        });

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover');
            });
        });
    }
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initFormHandling() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple validation
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });

        // Email validation
        const emailInput = form.querySelector('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput && !emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.style.borderColor = '#ef4444';
        }

        if (isValid) {
            // Show success message
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-check"></i> <span>تم الإرسال بنجاح!</span>';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            // Reset form
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);

            console.log('Form submitted:', data);
        }
    });

    // Clear error styling on input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    });
}

/* ============================================
   PARTICLES EFFECT (Optional Enhancement)
   ============================================ */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Add particle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
function initTestimonialsSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (!cards.length) return;

    let currentSlide = 0;
    const totalSlides = cards.length;

    function showSlide(index) {
        // Stop all audio when changing slides
        cards.forEach(card => {
            const audio = card.querySelector('audio');
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            const playBtn = card.querySelector('.play-btn');
            if (playBtn) {
                playBtn.classList.remove('playing');
                playBtn.querySelector('i').className = 'fas fa-play';
            }
        });

        // Update slides
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    // Event Listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            nextSlide();
        } else if (e.key === 'ArrowRight') {
            prevSlide();
        }
    });
}

/* ============================================
   AUDIO PLAYERS
   ============================================ */
function initAudioPlayers() {
    const playButtons = document.querySelectorAll('.play-btn');

    if (!playButtons.length) return;

    let currentlyPlaying = null;

    playButtons.forEach(btn => {
        const audioId = btn.getAttribute('data-audio');
        const audio = document.getElementById(audioId);
        const progressBar = document.getElementById('progress-' + audioId.split('-')[1]);
        const timeDisplay = document.getElementById('time-' + audioId.split('-')[1]);

        if (!audio) return;

        // Play/Pause toggle
        btn.addEventListener('click', () => {
            // Stop other playing audio
            if (currentlyPlaying && currentlyPlaying !== audio) {
                currentlyPlaying.pause();
                currentlyPlaying.currentTime = 0;
                const otherBtn = document.querySelector(`[data-audio="${currentlyPlaying.id}"]`);
                if (otherBtn) {
                    otherBtn.classList.remove('playing');
                    otherBtn.querySelector('i').className = 'fas fa-play';
                }
            }

            if (audio.paused) {
                audio.play();
                btn.classList.add('playing');
                btn.querySelector('i').className = 'fas fa-pause';
                currentlyPlaying = audio;
            } else {
                audio.pause();
                btn.classList.remove('playing');
                btn.querySelector('i').className = 'fas fa-play';
                currentlyPlaying = null;
            }
        });

        // Update progress bar
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }

            // Update time display
            if (timeDisplay) {
                const minutes = Math.floor(audio.currentTime / 60);
                const seconds = Math.floor(audio.currentTime % 60);
                timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        });

        // Reset on end
        audio.addEventListener('ended', () => {
            btn.classList.remove('playing');
            btn.querySelector('i').className = 'fas fa-play';
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            if (timeDisplay) {
                timeDisplay.textContent = '0:00';
            }
            currentlyPlaying = null;
        });

        // Click on progress bar to seek
        const progressContainer = progressBar?.parentElement;
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                audio.currentTime = pos * audio.duration;
            });
        }
    });
}

/* ============================================
   CLIENTS LOGOS LIGHTBOX
   ============================================ */
function initClientsLightbox() {
    const clientLogos = document.querySelectorAll('.client-logo');
    const lightbox = document.getElementById('logoLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxOverlay = lightbox?.querySelector('.lightbox-overlay');

    if (!clientLogos.length || !lightbox) return;

    // Open lightbox on logo click
    clientLogos.forEach(logo => {
        logo.addEventListener('click', () => {
            const img = logo.querySelector('img');
            if (img) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300);
    }

    // Close on button click
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on overlay click
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ============================================
   CLIENTS MARQUEE - JAVASCRIPT CONTROLLED ANIMATION
   ============================================ */
function initClientsMarquee() {
    // Wait for all images to load before starting animation
    window.addEventListener('load', () => {
        const marquees = document.querySelectorAll('.clients-marquee');

        marquees.forEach((marquee) => {
            const track = marquee.querySelector('.clients-marquee-track');
            if (!track) return;

            // Clone all logos to create seamless loop
            const logos = Array.from(track.children);
            logos.forEach(logo => {
                const clone = logo.cloneNode(true);
                track.appendChild(clone);
            });

            // Calculate the actual width of original content
            // After cloning, track has double the logos, so we need half
            const trackWidth = track.scrollWidth;
            const halfWidth = trackWidth / 2;

            // Animation variables
            let position = 0;
            const isReverse = marquee.classList.contains('clients-marquee-reverse');
            const speed = isReverse ? 1 : -1;
            let isPaused = false;

            // For reverse, start from -halfWidth
            if (isReverse) {
                position = -halfWidth;
            }

            // Pause on hover
            marquee.addEventListener('mouseenter', () => isPaused = true);
            marquee.addEventListener('mouseleave', () => isPaused = false);

            function animate() {
                if (!isPaused) {
                    position += speed;

                    // Reset position for seamless loop
                    if (!isReverse && position <= -halfWidth) {
                        position = 0;
                    } else if (isReverse && position >= 0) {
                        position = -halfWidth;
                    }

                    track.style.transform = `translateX(${position}px)`;
                }
                requestAnimationFrame(animate);
            }

            // Start animation
            animate();
        });
    });
}
