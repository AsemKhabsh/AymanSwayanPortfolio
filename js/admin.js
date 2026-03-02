// ============================================
// ADMIN DASHBOARD - PHP API VERSION
// ============================================

const API = 'api/';

// ==================== AUTH CHECK ====================
(async function checkAuth() {
    try {
        const res = await fetch(API + 'auth.php?action=check');
        if (!res.ok) {
            window.location.href = 'login.html';
        }
    } catch (e) {
        window.location.href = 'login.html';
    }
})();

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch(API + 'auth.php?action=logout', { method: 'POST' });
    window.location.href = 'login.html';
});

// ==================== SIDEBAR NAVIGATION ====================
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
const panels = document.querySelectorAll('.section-panel');
let currentSection = 'hero';

const sectionTitles = {
    hero: ['الصفحة الرئيسية', 'إدارة محتوى قسم Hero'],
    about: ['من أنا', 'إدارة قسم التعريف'],
    portfolio: ['الأعمال', 'إدارة معرض الأعمال'],
    services: ['أقسام الخدمات', 'إدارة خدمات الفريق'],
    clients: ['شعارات العملاء', 'إدارة شعارات العملاء'],
    testimonials: ['آراء العملاء', 'إدارة المقاطع الصوتية للعملاء'],
    contact: ['معلومات التواصل', 'إدارة بيانات التواصل'],
    settings: ['الإعدادات', 'إعدادات عامة'],
};

sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        const section = link.dataset.section;
        currentSection = section;

        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        panels.forEach(p => p.classList.remove('active'));
        document.getElementById('panel-' + section).classList.add('active');

        document.getElementById('sectionTitle').textContent = sectionTitles[section][0];
        document.getElementById('sectionDesc').textContent = sectionTitles[section][1];

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    });
});

// Mobile sidebar
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('active');
});
document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
});

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} visible`;
    setTimeout(() => toast.classList.remove('visible'), 4000);
}

// ==================== MODAL FUNCTIONS ====================
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ==================== IMAGE PREVIEW ====================
function setupImagePreview(inputId, previewId, iconId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const preview = document.getElementById(previewId);
            preview.src = ev.target.result;
            preview.style.display = 'block';
            const icon = document.getElementById(iconId);
            if (icon) icon.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
}
setupImagePreview('heroImageInput', 'heroImagePreview', 'heroUploadIcon');
setupImagePreview('aboutImageInput', 'aboutImagePreview', 'aboutUploadIcon');
setupImagePreview('portfolioImageInput', 'portfolioImagePreview', 'portfolioUploadIcon');
setupImagePreview('clientImageInput', 'clientImagePreview', 'clientUploadIcon');

// Video preview
const videoInput = document.getElementById('portfolioVideoInput');
if (videoInput) {
    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = document.getElementById('portfolioVideoPreview');
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        const icon = document.getElementById('portfolioVideoIcon');
        if (icon) icon.style.display = 'none';
    });
}

// Audio preview for testimonials
const audioInput = document.getElementById('testimonialAudioInput');
if (audioInput) {
    audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = document.getElementById('testimonialAudioPreview');
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        const icon = document.getElementById('testimonialAudioIcon');
        if (icon) icon.style.display = 'none';
    });
}

// ==================== TAGS INPUT ====================
function setupTagsInput(containerId, inputId) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    if (!container || !input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = input.value.trim();
            if (!val) return;
            addTag(container, val);
            input.value = '';
        }
    });
}

function addTag(container, text) {
    const input = container.querySelector('.tags-input');
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${text} <i class="fas fa-times remove-tag"></i>`;
    tag.querySelector('.remove-tag').addEventListener('click', () => tag.remove());
    container.insertBefore(tag, input);
}

function getTags(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} .tag`))
        .map(t => t.textContent.trim().replace('', '').trim());
}

function clearTags(containerId) {
    document.querySelectorAll(`#${containerId} .tag`).forEach(t => t.remove());
}

setupTagsInput('typingTextsContainer', 'typingInput');
setupTagsInput('serviceSkillsContainer', 'serviceSkillsInput');

// ==================== IMAGE TO BASE64 ====================
function compressAndEncode(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 800;
                let w = img.width, h = img.height;
                if (w > MAX || h > MAX) {
                    if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                    else { w = Math.round(w * MAX / h); h = MAX; }
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// File to Base64 (for audio/video)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ==================== LOAD ALL DATA ====================
async function loadAllData() {
    try {
        await Promise.all([
            loadHeroData(),
            loadAboutData(),
            loadPortfolioData(),
            loadServicesData(),
            loadClientsData(),
            loadTestimonialsData(),
            loadContactData(),
            loadSettingsData(),
        ]);
    } catch (e) {
        console.log('Load error:', e);
    }

    // Hide loading
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

loadAllData();

// ==================== HERO ====================
async function loadHeroData() {
    try {
        const res = await fetch(API + 'content.php?section=hero');
        const data = await res.json();
        if (!data || data.error) return;

        document.getElementById('heroName').value = data.name || '';
        document.getElementById('heroFullName').value = data.fullName || '';
        document.getElementById('heroDescription').value = data.description || '';
        document.getElementById('statProjects').value = data.statProjects || '';
        document.getElementById('statClients').value = data.statClients || '';
        document.getElementById('statYears').value = data.statYears || '';

        clearTags('typingTextsContainer');
        (data.typingTexts || []).forEach(t => addTag(document.getElementById('typingTextsContainer'), t));

        if (data.profileImage) {
            const preview = document.getElementById('heroImagePreview');
            preview.src = data.profileImage;
            preview.style.display = 'block';
        }
    } catch (e) { console.log('Hero load:', e); }
}

async function saveHeroData() {
    const data = {
        name: document.getElementById('heroName').value,
        fullName: document.getElementById('heroFullName').value,
        description: document.getElementById('heroDescription').value,
        typingTexts: getTags('typingTextsContainer'),
        statProjects: parseInt(document.getElementById('statProjects').value) || 0,
        statClients: parseInt(document.getElementById('statClients').value) || 0,
        statYears: parseInt(document.getElementById('statYears').value) || 0,
    };

    const imageInput = document.getElementById('heroImageInput');
    if (imageInput.files.length > 0) {
        data.profileImage = await compressAndEncode(imageInput.files[0]);
    }

    await fetch(API + 'content.php?section=hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// ==================== ABOUT ====================
async function loadAboutData() {
    try {
        const res = await fetch(API + 'content.php?section=about');
        const data = await res.json();
        if (!data || data.error) return;

        document.getElementById('aboutSubtitle').value = data.subtitle || '';
        document.getElementById('aboutDesc1').value = data.desc1 || '';
        document.getElementById('aboutDesc2').value = data.desc2 || '';
        document.getElementById('aboutDesc3').value = data.desc3 || '';
        document.getElementById('aboutEmail').value = data.email || '';
        document.getElementById('aboutPhone').value = data.phone || '';
        document.getElementById('aboutLocation').value = data.location || '';

        if (data.image) {
            const preview = document.getElementById('aboutImagePreview');
            preview.src = data.image;
            preview.style.display = 'block';
        }
    } catch (e) { console.log('About load:', e); }
}

async function saveAboutData() {
    const data = {
        subtitle: document.getElementById('aboutSubtitle').value,
        desc1: document.getElementById('aboutDesc1').value,
        desc2: document.getElementById('aboutDesc2').value,
        desc3: document.getElementById('aboutDesc3').value,
        email: document.getElementById('aboutEmail').value,
        phone: document.getElementById('aboutPhone').value,
        location: document.getElementById('aboutLocation').value,
    };

    const imageInput = document.getElementById('aboutImageInput');
    if (imageInput.files.length > 0) {
        data.image = await compressAndEncode(imageInput.files[0]);
    }

    await fetch(API + 'content.php?section=about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// ==================== PORTFOLIO ====================
async function loadPortfolioData() {
    try {
        const res = await fetch(API + 'portfolio.php');
        const items = await res.json();
        if (!Array.isArray(items)) return;

        document.getElementById('totalPortfolio').textContent = items.length;
        const grid = document.getElementById('portfolioGrid');
        grid.innerHTML = '';

        items.forEach(item => {
            const imgSrc = item.image_path || item.image || '';
            grid.innerHTML += `
                <div class="item-card">
                    <div class="item-card-image">
                        ${imgSrc ? `<img src="${imgSrc}" alt="${item.title}">` : '<i class="fas fa-image"></i>'}
                    </div>
                    <div class="item-card-body">
                        <h4>${item.title}</h4>
                        <div class="item-category">${item.category}</div>
                        <div class="item-card-actions">
                            <button class="item-btn item-btn-edit" onclick="editPortfolioItem('${item.id}')">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="item-btn item-btn-delete" onclick="deleteItem('portfolio', '${item.id}')">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>`;
        });

        window._portfolioItems = items;
    } catch (e) { console.log('Portfolio load:', e); }
}

function openPortfolioModal() {
    document.getElementById('portfolioEditId').value = '';
    document.getElementById('portfolioTitle').value = '';
    document.getElementById('portfolioImagePreview').style.display = 'none';
    document.getElementById('portfolioUploadIcon').style.display = '';
    document.getElementById('portfolioImageInput').value = '';
    document.getElementById('portfolioModalTitle').textContent = 'إضافة عمل جديد';
    openModal('portfolioModal');
}

function editPortfolioItem(id) {
    const item = (window._portfolioItems || []).find(i => String(i.id) === String(id));
    if (!item) return;

    document.getElementById('portfolioEditId').value = id;
    document.getElementById('portfolioTitle').value = item.title || '';

    const imgSrc = item.image_path || item.image || '';
    if (imgSrc) {
        document.getElementById('portfolioImagePreview').src = imgSrc;
        document.getElementById('portfolioImagePreview').style.display = 'block';
        document.getElementById('portfolioUploadIcon').style.display = 'none';
    }

    document.getElementById('portfolioModalTitle').textContent = 'تعديل العمل';
    openModal('portfolioModal');
}

async function savePortfolioItem() {
    const editId = document.getElementById('portfolioEditId').value;
    const imageInput = document.getElementById('portfolioImageInput');

    const data = {
        title: document.getElementById('portfolioTitle').value,
    };

    try {
        if (imageInput.files.length > 0) {
            data.image = await compressAndEncode(imageInput.files[0]);
        }

        const videoInput = document.getElementById('portfolioVideoInput');
        if (videoInput && videoInput.files.length > 0) {
            data.video = await fileToBase64(videoInput.files[0]);
        }

        const url = editId ? `${API}portfolio.php?id=${editId}` : `${API}portfolio.php`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showToast(editId ? 'تم تحديث العمل بنجاح' : 'تمت إضافة العمل بنجاح');
        closeModal('portfolioModal');
        await loadPortfolioData();
    } catch (e) {
        console.error('Save portfolio error:', e);
        showToast('حدث خطأ أثناء الحفظ', 'error');
    }
}

// ==================== SERVICES ====================
async function loadServicesData() {
    try {
        const res = await fetch(API + 'services.php');
        const items = await res.json();
        if (!Array.isArray(items)) return;

        const grid = document.getElementById('servicesGrid');
        grid.innerHTML = '';

        items.forEach(item => {
            grid.innerHTML += `
                <div class="item-card">
                    <div class="item-card-image">
                        <i class="${item.icon || 'fas fa-cog'}"></i>
                    </div>
                    <div class="item-card-body">
                        <h4>${item.title}</h4>
                        <div class="item-category">${item.category}</div>
                        <div class="item-card-actions">
                            <button class="item-btn item-btn-edit" onclick="editServiceItem('${item.id}')">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="item-btn item-btn-delete" onclick="deleteItem('service', '${item.id}')">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>`;
        });

        window._serviceItems = items;
    } catch (e) { console.log('Services load:', e); }
}

function openServiceModal() {
    document.getElementById('serviceEditId').value = '';
    document.getElementById('serviceTitle').value = '';
    document.getElementById('serviceIcon').value = '';
    document.getElementById('serviceCategory').value = 'design';
    document.getElementById('serviceOrder').value = '';
    clearTags('serviceSkillsContainer');
    document.getElementById('serviceModalTitle').textContent = 'إضافة قسم خدمة';
    openModal('serviceModal');
}

function editServiceItem(id) {
    const item = (window._serviceItems || []).find(i => String(i.id) === String(id));
    if (!item) return;

    document.getElementById('serviceEditId').value = id;
    document.getElementById('serviceTitle').value = item.title || '';
    document.getElementById('serviceIcon').value = item.icon || '';
    document.getElementById('serviceCategory').value = item.category || 'design';
    document.getElementById('serviceOrder').value = item.sort_order || item.order || '';

    clearTags('serviceSkillsContainer');
    (item.skills || []).forEach(s => addTag(document.getElementById('serviceSkillsContainer'), s));

    document.getElementById('serviceModalTitle').textContent = 'تعديل الخدمة';
    openModal('serviceModal');
}

async function saveServiceItem() {
    const editId = document.getElementById('serviceEditId').value;
    const data = {
        title: document.getElementById('serviceTitle').value,
        icon: document.getElementById('serviceIcon').value || 'fas fa-cog',
        skills: getTags('serviceSkillsContainer'),
        category: document.getElementById('serviceCategory').value,
        order: parseInt(document.getElementById('serviceOrder').value) || 0,
    };

    try {
        const url = editId ? `${API}services.php?id=${editId}` : `${API}services.php`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showToast(editId ? 'تم تحديث الخدمة' : 'تمت إضافة الخدمة');
        closeModal('serviceModal');
        await loadServicesData();
    } catch (e) {
        showToast('حدث خطأ أثناء الحفظ', 'error');
    }
}

// ==================== CLIENTS ====================
async function loadClientsData() {
    try {
        const res = await fetch(API + 'clients.php');
        const items = await res.json();
        if (!Array.isArray(items)) return;

        const grid = document.getElementById('clientsGrid');
        grid.innerHTML = '';

        items.forEach(item => {
            const logoSrc = item.logo_path || item.logoUrl || '';
            grid.innerHTML += `
                <div class="item-card">
                    <div class="item-card-image">
                        ${logoSrc ? `<img src="${logoSrc}" alt="${item.name}">` : '<i class="fas fa-building"></i>'}
                    </div>
                    <div class="item-card-body">
                        <h4>${item.name}</h4>
                        <div class="item-card-actions">
                            <button class="item-btn item-btn-edit" onclick="editClientItem('${item.id}')">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="item-btn item-btn-delete" onclick="deleteItem('client', '${item.id}')">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>`;
        });

        window._clientItems = items;
    } catch (e) { console.log('Clients load:', e); }
}

function openClientModal() {
    document.getElementById('clientEditId').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('clientOrder').value = '';
    document.getElementById('clientImagePreview').style.display = 'none';
    document.getElementById('clientUploadIcon').style.display = '';
    document.getElementById('clientImageInput').value = '';
    document.getElementById('clientModalTitle').textContent = 'إضافة شعار عميل';
    openModal('clientModal');
}

function editClientItem(id) {
    const item = (window._clientItems || []).find(i => String(i.id) === String(id));
    if (!item) return;

    document.getElementById('clientEditId').value = id;
    document.getElementById('clientName').value = item.name || '';
    document.getElementById('clientOrder').value = item.sort_order || item.order || '';

    const logoSrc = item.logo_path || item.logoUrl || '';
    if (logoSrc) {
        document.getElementById('clientImagePreview').src = logoSrc;
        document.getElementById('clientImagePreview').style.display = 'block';
        document.getElementById('clientUploadIcon').style.display = 'none';
    }

    document.getElementById('clientModalTitle').textContent = 'تعديل شعار العميل';
    openModal('clientModal');
}

async function saveClientItem() {
    const editId = document.getElementById('clientEditId').value;
    const imageInput = document.getElementById('clientImageInput');
    const data = {
        name: document.getElementById('clientName').value,
        order: parseInt(document.getElementById('clientOrder').value) || 0,
    };

    try {
        if (imageInput.files.length > 0) {
            data.logoUrl = await compressAndEncode(imageInput.files[0]);
        }

        const url = editId ? `${API}clients.php?id=${editId}` : `${API}clients.php`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showToast(editId ? 'تم تحديث الشعار' : 'تمت إضافة الشعار');
        closeModal('clientModal');
        await loadClientsData();
    } catch (e) {
        showToast('حدث خطأ أثناء الحفظ', 'error');
    }
}

// ==================== TESTIMONIALS ====================
async function loadTestimonialsData() {
    try {
        const res = await fetch(API + 'testimonials.php');
        const items = await res.json();
        if (!Array.isArray(items)) return;

        const grid = document.getElementById('testimonialsGrid');
        grid.innerHTML = '';

        items.forEach(item => {
            grid.innerHTML += `
                <div class="item-card">
                    <div class="item-card-image">
                        <i class="fas fa-microphone" style="font-size:1.5rem;"></i>
                    </div>
                    <div class="item-card-body">
                        <h4>${item.position}</h4>
                        ${item.audio_path ? `<audio src="${item.audio_path}" controls style="width:100%;margin:8px 0;"></audio>` : '<small>لا يوجد مقطع صوتي</small>'}
                        <div class="item-card-actions">
                            <button class="item-btn item-btn-edit" onclick="editTestimonialItem('${item.id}')">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="item-btn item-btn-delete" onclick="deleteItem('testimonial', '${item.id}')">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>`;
        });

        window._testimonialItems = items;
    } catch (e) { console.log('Testimonials load:', e); }
}

function openTestimonialModal() {
    document.getElementById('testimonialEditId').value = '';
    document.getElementById('testimonialPosition').value = '';
    document.getElementById('testimonialOrder').value = '';
    document.getElementById('testimonialAudioPreview').style.display = 'none';
    document.getElementById('testimonialAudioPreview').src = '';
    const icon = document.getElementById('testimonialAudioIcon');
    if (icon) icon.style.display = '';
    document.getElementById('testimonialAudioInput').value = '';
    document.getElementById('testimonialModalTitle').textContent = 'إضافة رأي عميل';
    openModal('testimonialModal');
}

function editTestimonialItem(id) {
    const item = (window._testimonialItems || []).find(i => String(i.id) === String(id));
    if (!item) return;

    document.getElementById('testimonialEditId').value = id;
    document.getElementById('testimonialPosition').value = item.position || '';
    document.getElementById('testimonialOrder').value = item.sort_order || item.order || '';

    if (item.audio_path) {
        const preview = document.getElementById('testimonialAudioPreview');
        preview.src = item.audio_path;
        preview.style.display = 'block';
        const icon = document.getElementById('testimonialAudioIcon');
        if (icon) icon.style.display = 'none';
    }

    document.getElementById('testimonialModalTitle').textContent = 'تعديل رأي العميل';
    openModal('testimonialModal');
}

async function saveTestimonialItem() {
    const editId = document.getElementById('testimonialEditId').value;
    const audioInput = document.getElementById('testimonialAudioInput');
    const data = {
        position: document.getElementById('testimonialPosition').value,
        order: parseInt(document.getElementById('testimonialOrder').value) || 0,
    };

    try {
        if (audioInput.files.length > 0) {
            data.audioData = await fileToBase64(audioInput.files[0]);
        }

        const url = editId ? `${API}testimonials.php?id=${editId}` : `${API}testimonials.php`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showToast(editId ? 'تم تحديث الرأي' : 'تمت إضافة الرأي');
        closeModal('testimonialModal');
        await loadTestimonialsData();
    } catch (e) {
        showToast('حدث خطأ أثناء الحفظ', 'error');
    }
}

// ==================== CONTACT ====================
async function loadContactData() {
    try {
        const res = await fetch(API + 'content.php?section=contact');
        const data = await res.json();
        if (!data || data.error) return;

        document.getElementById('contactEmail').value = data.email || '';
        document.getElementById('contactPhone').value = data.phone || '';
        document.getElementById('contactWhatsapp').value = data.whatsapp || '';
        document.getElementById('contactLocation').value = data.location || '';
        document.getElementById('socialTwitter').value = data.twitter || '';
        document.getElementById('socialInstagram').value = data.instagram || '';
        document.getElementById('socialLinkedin').value = data.linkedin || '';
        document.getElementById('socialBehance').value = data.behance || '';
    } catch (e) { console.log('Contact load:', e); }
}

async function saveContactData() {
    const data = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        whatsapp: document.getElementById('contactWhatsapp').value,
        location: document.getElementById('contactLocation').value,
        twitter: document.getElementById('socialTwitter').value,
        instagram: document.getElementById('socialInstagram').value,
        linkedin: document.getElementById('socialLinkedin').value,
        behance: document.getElementById('socialBehance').value,
    };

    await fetch(API + 'content.php?section=contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// ==================== SETTINGS ====================
async function loadSettingsData() {
    try {
        const res = await fetch(API + 'content.php?section=settings');
        const data = await res.json();
        if (!data || data.error) return;

        document.getElementById('footerText').value = data.footerText || '';
        document.getElementById('servicesCta').value = data.servicesCta || '';
    } catch (e) { console.log('Settings load:', e); }
}

async function saveSettingsData() {
    const data = {
        footerText: document.getElementById('footerText').value,
        servicesCta: document.getElementById('servicesCta').value,
    };

    await fetch(API + 'content.php?section=settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// ==================== DELETE ====================
let deleteTarget = { type: '', id: '' };

function deleteItem(type, id) {
    deleteTarget = { type, id };
    document.getElementById('confirmDelete').classList.add('active');
}

function closeConfirm() {
    document.getElementById('confirmDelete').classList.remove('active');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    const { type, id } = deleteTarget;
    const endpoints = {
        portfolio: 'portfolio.php',
        service: 'services.php',
        client: 'clients.php',
        testimonial: 'testimonials.php'
    };

    try {
        await fetch(`${API}${endpoints[type]}?id=${id}`, { method: 'DELETE' });
        showToast('تم الحذف بنجاح');
        closeConfirm();

        if (type === 'portfolio') await loadPortfolioData();
        if (type === 'service') await loadServicesData();
        if (type === 'client') await loadClientsData();
        if (type === 'testimonial') await loadTestimonialsData();
    } catch (e) {
        showToast('حدث خطأ أثناء الحذف', 'error');
    }
});

// ==================== SAVE CURRENT SECTION ====================
async function saveCurrentSection() {
    const btn = document.getElementById('saveBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري الحفظ...</span>';

    try {
        switch (currentSection) {
            case 'hero': await saveHeroData(); break;
            case 'about': await saveAboutData(); break;
            case 'contact': await saveContactData(); break;
            case 'settings': await saveSettingsData(); break;
        }
        showToast('تم حفظ التغييرات بنجاح ✓');
    } catch (e) {
        console.error('Save error:', e);
        showToast('حدث خطأ أثناء الحفظ', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i><span>حفظ التغييرات</span>';
    }
}

// ==================== THEME TOGGLE ====================
function toggleAdminTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const icon = document.getElementById('themeIcon');
    icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('adminTheme', isLight ? 'light' : 'dark');
}

(function () {
    if (localStorage.getItem('adminTheme') === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = 'fas fa-moon';
    }
})();
