/* ================================================
   DYNAMIC CONTENT LOADER - PHP API VERSION
   Loads content from PHP/MySQL backend into website pages
   ================================================ */

const API_BASE = 'api/';

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadDynamicContent, 100);
});

async function loadDynamicContent() {
    try {
        const page = detectPage();

        if (page === 'index') {
            await Promise.all([
                loadHeroContent(),
                loadAboutContent(),
                loadContactContent(),
                loadTestimonialsContent(),
            ]);
        } else if (page === 'services') {
            await loadServicesContent();
        } else if (page === 'portfolio') {
            await loadPortfolioContent();
        }
    } catch (error) {
        console.log('Dynamic content: using static fallback', error);
    }
}

function detectPage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('services')) return 'services';
    if (path.includes('portfolio')) return 'portfolio';
    return 'index';
}

// ==================== HERO CONTENT ====================
async function loadHeroContent() {
    try {
        const res = await fetch(API_BASE + 'content.php?section=hero');
        const data = await res.json();
        if (!data || data.error) return;

        const nameEl = document.querySelector('.hero-title .name');
        if (nameEl && data.name) nameEl.textContent = data.name;

        const descEl = document.querySelector('.hero-description');
        if (descEl && data.description) descEl.textContent = data.description;

        if (data.statProjects) {
            const statEl = document.querySelectorAll('.stat-number');
            if (statEl[0]) statEl[0].setAttribute('data-count', data.statProjects);
            if (statEl[1]) statEl[1].setAttribute('data-count', data.statClients);
            if (statEl[2]) statEl[2].setAttribute('data-count', data.statYears);
        }

        if (data.profileImage) {
            const heroImg = document.querySelector('.profile-image img');
            if (heroImg) heroImg.src = data.profileImage;
        }

        if (data.typingTexts && data.typingTexts.length > 0) {
            window.dynamicTypingTexts = data.typingTexts;
        }
    } catch (e) {
        console.log('Hero: using static content', e);
    }
}

// ==================== ABOUT CONTENT ====================
async function loadAboutContent() {
    try {
        const res = await fetch(API_BASE + 'content.php?section=about');
        const data = await res.json();
        if (!data || data.error) return;

        const subtitleEl = document.querySelector('.about-subtitle');
        if (subtitleEl && data.subtitle) subtitleEl.textContent = data.subtitle;

        const descEls = document.querySelectorAll('.about-description');
        if (descEls[0] && data.desc1) descEls[0].textContent = data.desc1;
        if (descEls[1] && data.desc2) descEls[1].textContent = data.desc2;
        if (descEls[2] && data.desc3) descEls[2].textContent = data.desc3;

        if (data.image) {
            const aboutImg = document.querySelector('.about-profile-image img');
            if (aboutImg) aboutImg.src = data.image;
        }

        const infoItems = document.querySelectorAll('.info-item span');
        if (infoItems.length >= 3) {
            if (data.email) infoItems[0].textContent = data.email;
            if (data.phone) infoItems[1].textContent = data.phone;
            if (data.location) infoItems[2].textContent = data.location;
        }
    } catch (e) {
        console.log('About: using static content', e);
    }
}

// ==================== CONTACT CONTENT ====================
async function loadContactContent() {
    try {
        const res = await fetch(API_BASE + 'content.php?section=contact');
        const data = await res.json();
        if (!data || data.error) return;

        if (data.email) {
            document.querySelectorAll('a[href*="mailto:"]').forEach(link => {
                link.href = `mailto:${data.email}`;
                const span = link.querySelector('span');
                if (span) span.textContent = data.email;
            });
        }

        if (data.whatsapp) {
            document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
                link.href = data.whatsapp;
            });
        }

        if (data.twitter) {
            const el = document.querySelector('a[href*="twitter"], a[href*="x.com"]');
            if (el) el.href = data.twitter;
        }
        if (data.instagram) {
            const el = document.querySelector('a[href*="instagram"]');
            if (el) el.href = data.instagram;
        }
        if (data.linkedin) {
            const el = document.querySelector('a[href*="linkedin"]');
            if (el) el.href = data.linkedin;
        }
        if (data.behance) {
            const el = document.querySelector('a[href*="behance"]');
            if (el) el.href = data.behance;
        }
    } catch (e) {
        console.log('Contact: using static content', e);
    }
}

// ==================== SERVICES CONTENT ====================
async function loadServicesContent() {
    try {
        const res = await fetch(API_BASE + 'services.php');
        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) return;

        const grid = document.querySelector('.services-grid');
        if (!grid) return;

        let html = '';
        items.forEach(item => {
            const skillsHtml = (item.skills || []).map(s => `<li>${s}</li>`).join('');

            html += `
                <div class="team-service-card" data-aos="fade-up">
                    <h3 class="team-service-title">
                        <i class="${item.icon || 'fas fa-cog'}"></i>
                        <span>${item.title}</span>
                    </h3>
                    <div class="team-service-content">
                        ${skillsHtml ? `<div class="team-skills"><ul>${skillsHtml}</ul></div>` : ''}
                        <a href="portfolio.html?category=${item.category || 'design'}" class="btn btn-primary btn-sm">
                            <i class="fas fa-eye"></i>
                            <span>عرض الأعمال</span>
                        </a>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    } catch (e) {
        console.log('Services: using static content', e);
    }
}

// ==================== PORTFOLIO CONTENT ====================
async function loadPortfolioContent() {
    try {
        const res = await fetch(API_BASE + 'portfolio.php');
        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) return;

        const grid = document.querySelector('.portfolio-gallery-grid');
        if (!grid) return;

        const categoryNames = {
            design: 'التصميم الجرافيكي', montage: 'المونتاج', motion: 'الموشن جرافيك',
            websites: 'المواقع الإلكترونية', photography: 'التصوير'
        };

        const gradientMap = {
            design: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            montage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            motion: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            websites: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            photography: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        };

        const iconMap = {
            design: 'fas fa-palette',
            montage: 'fas fa-video',
            motion: 'fas fa-wand-magic-sparkles',
            websites: 'fas fa-laptop-code',
            photography: 'fas fa-camera'
        };

        let html = '';
        items.forEach(item => {
            const imgSrc = item.image_path || '';
            const videoSrc = item.video_path || '';

            let mediaHtml = '';
            if (videoSrc) {
                mediaHtml = `<video src="${videoSrc}" controls playsinline style="width:100%;height:auto;display:block;"></video>`;
            } else if (imgSrc) {
                mediaHtml = `<img src="${imgSrc}" alt="${item.title}" style="width:100%;height:auto;display:block;">`;
            } else {
                const gradient = gradientMap[item.category] || gradientMap.design;
                const icon = iconMap[item.category] || 'fas fa-star';
                mediaHtml = `<div style="width:100%;min-height:300px;background:${gradient};display:flex;align-items:center;justify-content:center;"><i class="${icon}" style="font-size:3.5rem;color:rgba(255,255,255,0.25);"></i></div>`;
            }

            html += `
                <div class="portfolio-item" data-category="${item.category || 'design'}">
                    <div class="portfolio-item-inner">
                        <div class="portfolio-item-image">
                            ${mediaHtml}
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
        reinitPortfolioFilters();
    } catch (e) {
        console.log('Portfolio: using static content', e);
    }
}

// ==================== RE-INIT PORTFOLIO FILTERS ====================
function reinitPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            items.forEach((item, index) => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s both`;
                } else {
                    item.style.display = 'none';
                    item.style.animation = '';
                }
            });
        });
    });

    // Apply URL category filter
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    if (cat) {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === cat) btn.classList.add('active');
        });
        items.forEach(item => {
            item.style.display = (item.dataset.category === cat) ? '' : 'none';
        });
    }
}

// ==================== TESTIMONIALS CONTENT ====================
async function loadTestimonialsContent() {
    try {
        const res = await fetch(API_BASE + 'testimonials.php');
        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) return;

        const container = document.getElementById('testimonialsContainer');
        if (!container) return;

        let html = '';
        items.forEach(item => {
            html += `
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="testimonial-icon">
                            <i class="fas fa-microphone"></i>
                        </div>
                        <div class="testimonial-position">${item.position}</div>
                    </div>
                    <div class="testimonial-audio">
                        ${item.audio_path ? `<audio src="${item.audio_path}" controls preload="none"></audio>` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (e) {
        console.log('Testimonials: using static content', e);
    }
}
