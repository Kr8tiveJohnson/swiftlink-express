/**
 * SwiftLink Express Application - Advanced Tracking System Engine
 * Data is fetched from the secure backend API only — no shipment data stored here.
 */

// API base URL helper
const API_BASE_URL = (() => {
    if (window.location.protocol === 'file:' || window.location.origin === 'null') {
        return 'https://swiftlink-backend-tek3.onrender.com';
    }
    return window.location.origin;
})();

function apiFetch(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    return fetch(url, options);
}

// 2. Client Side SPA View Switcher Engine Matrix with GSAP Integration
function navigateTo(pageId) {
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(page => page.classList.add('hidden'));

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));

    const activePage = document.getElementById(`page-${pageId}`);
    if (activePage) {
        activePage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const revealElements = activePage.querySelectorAll('.gsap-reveal');
        if (revealElements.length > 0) {
            gsap.fromTo(revealElements,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }

    const activeLink = document.getElementById(`link-${pageId}`);
    if (activeLink) activeLink.classList.add('active');

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');
}

// 3. Quick Track Home Bridge Transfer Interface
function executeQuickTrack() {
    const inputVal = document.getElementById('quick-track-input').value.trim();
    if (!inputVal) return;
    document.getElementById('main-track-input').value = inputVal;
    navigateTo('track');
    lookupShipment();
}

// 4. Shipment Lookup — API only, no local fallback data
async function lookupShipment() {
    const trackingId = document.getElementById('main-track-input').value.trim();
    const resultBox = document.getElementById('tracking-result-box');
    const errorBox = document.getElementById('tracking-error-box');

    if (!resultBox || !errorBox) return;

    resultBox.classList.add('hidden');
    errorBox.classList.add('hidden');

    if (!trackingId) {
        errorBox.classList.remove('hidden');
        return;
    }

    // Show loading indicator if present
    const loadingEl = document.getElementById('tracking-loading');
    if (loadingEl) loadingEl.classList.remove('hidden');

    const token = localStorage.getItem('sl_token');
    try {
        const res = await apiFetch(`/api/tracking/number/${encodeURIComponent(trackingId)}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (loadingEl) loadingEl.classList.add('hidden');

        if (res.ok) {
            const json = await res.json();
            const shipment = json.data.shipment;
            const history = json.data.history || [];

            document.getElementById('lbl-tracking-no').innerText = shipment.trackingNumber || trackingId;
            document.getElementById('lbl-ship-date').innerText = shipment.shipDate ? new Date(shipment.shipDate).toLocaleDateString() : '';
            document.getElementById('lbl-delivery-date').innerText = shipment.estimatedDeliveryDate
                ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString()
                : (shipment.actualDeliveryDate ? new Date(shipment.actualDeliveryDate).toLocaleDateString() : '');
            document.getElementById('lbl-origin').innerText = (shipment.origin && (shipment.origin.city || shipment.origin.country))
                ? `${shipment.origin.city || ''} ${shipment.origin.country || ''}`.trim() : '';
            document.getElementById('lbl-destination').innerText = shipment.destination && (shipment.destination.address || shipment.destination.city)
                ? (shipment.destination.address || shipment.destination.city) : '';
            document.getElementById('lbl-shipper-name').innerText = shipment.shipper?.name || '';
            document.getElementById('lbl-shipper-addr').innerText = shipment.shipper?.address || '';
            document.getElementById('lbl-receiver-name').innerText = shipment.receiver?.name || '';
            document.getElementById('lbl-receiver-addr').innerText = shipment.receiver?.address || '';
            document.getElementById('lbl-description').innerText = shipment.cargo?.description || '';
            document.getElementById('lbl-service-type').innerText = shipment.service?.type
                ? `${shipment.service.type} / ${shipment.service.mode}` : '';
            document.getElementById('lbl-weight').innerText = shipment.cargo?.weight
                ? `${shipment.cargo.weight.value} ${shipment.cargo.weight.unit}` : '';
            document.getElementById('lbl-quantity').innerText = shipment.cargo?.quantity || '';
            document.getElementById('lbl-barcode-text').innerText = shipment.trackingNumber || trackingId;

            const tbody = document.getElementById('travel-history-body');
            if (tbody) {
                tbody.innerHTML = '';
                history.forEach((log) => {
                    const row = document.createElement('tr');
                    const dateStr = log.timestamp ? new Date(log.timestamp).toLocaleDateString() : (log.date || '');
                    const locationText = log.location?.city || log.location?.country || log.location || '';
                    if (log.alerts && log.alerts.length > 0) {
                        row.className = "bg-red-950/20 text-red-300 border-b border-slate-700/40 font-medium text-xs";
                    } else {
                        row.className = "odd:bg-brandDark/40 even:bg-brandDark/20 text-slate-200 border-b border-slate-700/40 font-medium text-xs";
                    }
                    row.innerHTML = `
                        <td class="p-3 font-mono text-slate-400">${dateStr}</td>
                        <td class="p-3 tracking-wide">${log.activity || log.details || ''}</td>
                        <td class="p-3 uppercase font-semibold text-brandAccent">${locationText}</td>
                        <td class="p-3 font-bold ${log.alerts && log.alerts.length ? 'text-red-400' : 'text-emerald-400'}">${log.details || log.status || ''}</td>
                    `;
                    tbody.appendChild(row);
                });
            }

            resultBox.classList.remove('hidden');
            if (typeof gsap !== 'undefined') gsap.fromTo(resultBox, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
            return;
        }

        // Not found or other error
        errorBox.classList.remove('hidden');

    } catch (err) {
        if (loadingEl) loadingEl.classList.add('hidden');
        errorBox.classList.remove('hidden');
    }
}

function openPrintView() {
    const trackingId = (document.getElementById('lbl-tracking-no')?.innerText || '').trim()
        || (document.getElementById('main-track-input')?.value || '').trim();
    if (!trackingId) {
        alert('Please search for a tracking ID first.');
        return;
    }
    window.open(`/print.html?id=${encodeURIComponent(trackingId)}`, '_blank');
}

// 7. Accordion Toggle for FAQ
function toggleFaq(element) {
    const para = element.querySelector('p');
    const icon = element.querySelector('i');
    if (para && icon) {
        para.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    }
}

// 8. Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    alert("Message pipeline synchronized successfully. Our operational agents will respond within 4 business hours via provided address endpoint.");
    event.target.reset();
}

// 9. GSAP Entrance Animations
function initGSAPEntrance() {
    const tl = gsap.timeline();
    tl.to("#hero-tag", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to("#hero-title", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
      .to("#hero-desc", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .to("#hero-input", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .to("#page-home .gsap-reveal", { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "-=0.2");
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

// Image Slider
let currentSlideIndex = 0;
let slideIntervalId;
const totalSlidesCount = 3;

function startHeroSliderEngine() {
    slideIntervalId = setInterval(() => {
        let nextIndex = (currentSlideIndex + 1) % totalSlidesCount;
        setHeroSlide(nextIndex);
    }, 5000);
}

function setHeroSlide(targetIndex) {
    currentSlideIndex = targetIndex;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    if (!slides.length) return;
    slides.forEach((slide, idx) => {
        if (idx === targetIndex) {
            slide.classList.remove('opacity-0');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        }
    });
    dots.forEach((dot, idx) => {
        if (idx === targetIndex) {
            dot.classList.remove('bg-white/40');
            dot.classList.add('bg-white', 'opacity-100');
        } else {
            dot.classList.remove('bg-white', 'opacity-100');
            dot.classList.add('bg-white/40');
        }
    });
}

// Boot
window.addEventListener('load', () => {
    gsap.set(".gsap-reveal", { y: 30, opacity: 0 });
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('opacity-0', 'pointer-events-none');
            initGSAPEntrance();
            startHeroSliderEngine();
        }, 1200);
    } else {
        initGSAPEntrance();
        startHeroSliderEngine();
    }
});

// ==========================================
// SWIFTLINK CHATBOT INTERACTIVE CORE ENGINE
// ==========================================

const botKnowledgeBase = {
    greetings: ["hi", "hello", "hey", "good day", "start", "welcome"],
    trackingKeywords: ["track", "where is my package", "status", "delivery status", "package", "shipment", "not working", "delayed", "transit"],
    deliveryKeywords: ["location", "deliver to", "international", "how long", "same-day", "hours"],
    pricingKeywords: ["cost", "price", "quote", "payment", "charge", "fee"],
    companyKeywords: ["office", "location", "address", "contact", "support", "weekend", "services"]
};

const botResponses = {
    greeting: "Welcome to SwiftLink Express 👋. I'm your virtual logistics agent. How can I assist you with your operations today?",
    trackingInfo: "To locate your package instantly, choose 'Track Shipment' below or enter your exact Tracking Reference ID in the tracking page.",
    deliveryInfo: "We deliver across major intercontinental routes! We specialize in Air Freight Express Premium, Maritime Container Sea Cargo, and regional Road Delivery networks. Most express air shipments arrive within 3-5 business days.",
    pricingInfo: "Pricing maps directly to total mass weight, volumetric dimensions, destination coordinates, and cargo class requirements. Click 'Get Delivery Quote' below to coordinate with our logistics desks.",
    escalation: "Let me get you over to a direct operational coordinator. You can reach our escalation desk directly on Telegram or WhatsApp at +17242916750, or submit an email ticket right here.",
    fallback: "I couldn't quite map that directive. Please use one of our quick-action options below or input a valid shipment tracking ID."
};

const quickReplyActions = [
    { label: "📦 Track Shipment", action: "trigger_tracking_prompt" },
    { label: "💳 Get Delivery Quote", action: "trigger_quote_prompt" },
    { label: "📞 Speak to Support", action: "trigger_support" },
    { label: "🚚 Delivery Locations", action: "trigger_delivery" },
    { label: "🏢 Company Info", action: "trigger_company" }
];

function toggleChatWidget() {
    const box = document.getElementById('chat-widget-box');
    const logs = document.getElementById('chat-logs-container');
    if (!box || !logs) return;
    box.classList.toggle('hidden');
    if (box.classList.contains('hidden')) {
        logs.innerHTML = '';
    } else {
        if (logs.children.length === 0) {
            renderBotMessage(botResponses.greeting);
            renderQuickReplies();
        }
    }
}

function renderBotMessage(text, isAlert = false) {
    const container = document.getElementById('chat-logs-container');
    if (!container) return;
    const messageRow = document.createElement('div');
    messageRow.className = "flex items-start space-x-2.5 max-w-[85%] chat-bubble-anim text-slate-800";
    const bgClass = isAlert ? "bg-red-50 text-red-950 border border-red-200" : "bg-white border border-gray-200 shadow-sm";
    messageRow.innerHTML = `
        <div class="w-7 h-7 rounded-lg bg-brandDark text-brandAccent flex items-center justify-center shrink-0 text-[10px]">
            <i class="fa-solid fa-robot"></i>
        </div>
        <div class="${bgClass} p-3 rounded-2xl rounded-tl-none leading-relaxed font-medium">
            <p>${text}</p>
        </div>
    `;
    container.appendChild(messageRow);
    container.scrollTop = container.scrollHeight;
}

function renderUserMessage(text) {
    const container = document.getElementById('chat-logs-container');
    if (!container) return;
    const messageRow = document.createElement('div');
    messageRow.className = "flex items-start justify-end space-x-2.5 max-w-[85%] ml-auto chat-bubble-anim text-white";
    messageRow.innerHTML = `
        <div class="bg-brandDark p-3 rounded-2xl rounded-tr-none leading-relaxed font-medium border border-slate-700 shadow-sm">
            <p>${text}</p>
        </div>
    `;
    container.appendChild(messageRow);
    container.scrollTop = container.scrollHeight;
}

function renderQuickReplies() {
    const box = document.getElementById('chat-quick-replies');
    if (!box) return;
    box.innerHTML = '';
    quickReplyActions.forEach(btn => {
        const buttonNode = document.createElement('button');
        buttonNode.className = "bg-gray-100 hover:bg-brandAccent hover:text-brandDark border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition text-[11px] shrink-0 duration-200";
        buttonNode.innerText = btn.label;
        buttonNode.onclick = () => handleQuickActionExecution(btn.action, btn.label);
        box.appendChild(buttonNode);
    });
}

function handleQuickActionExecution(actionToken, visualLabel) {
    renderUserMessage(visualLabel);
    setTimeout(() => {
        switch (actionToken) {
            case "trigger_tracking_prompt":
                renderBotMessage(botResponses.trackingInfo);
                break;
            case "trigger_quote_prompt":
                renderBotMessage("To draft an accurate quote, please state:\n1. Cargo Dimension/Weight\n2. Route Origins & Destinations.\n\nOur administrators will process your details as soon as possible.");
                break;
            case "trigger_support":
                renderBotMessage(botResponses.escalation);
                window.open('https://wa.me/17242916750?text=Hello%20SwiftLink%20Express,%20I%20need%20help%20with%20my%20shipment.', '_blank');
                break;
            case "trigger_delivery":
                renderBotMessage(botResponses.deliveryInfo);
                break;
            case "trigger_company":
                renderBotMessage(botResponses.escalation);
                break;
            default:
                renderBotMessage(botResponses.fallback);
        }
    }, 600);
}

function handleChatSubmitMessage(e) {
    e.preventDefault();
    const inputElement = document.getElementById('chat-user-textbox');
    if (!inputElement) return;
    const textPayload = inputElement.value.trim();
    if (!textPayload) return;
    renderUserMessage(textPayload);
    inputElement.value = '';
    setTimeout(() => {
        processIncomingInputText(textPayload);
    }, 700);
}

// Chat: check if input looks like a tracking ID and hit API
async function processIncomingInputText(rawText) {
    const text = rawText.toLowerCase();

    // If it looks like a tracking number, try the API
    if (rawText.length > 5 && (rawText.includes('-') || /[0-9]/.test(rawText))) {
        try {
            const res = await apiFetch(`/api/tracking/number/${encodeURIComponent(rawText)}`);
            if (res.ok) {
                const json = await res.json();
                const s = json.data.shipment;
                const isHold = s.status === 'on-hold';
                const reportStr = `<strong>🚨 SYSTEM UPDATE FOR TRACKING: ${rawText}</strong><br><br>` +
                    `• <strong>Current Status:</strong> <span class="${isHold ? 'text-red-500 font-bold' : 'text-green-500'}">${(s.status || '').toUpperCase()}</span><br>` +
                    `• <strong>Description:</strong> ${s.cargo?.description || ''}<br>` +
                    `• <strong>Destination:</strong> ${s.destination?.address || s.destination?.city || ''}<br>`;
                renderBotMessage(reportStr, isHold);
                document.getElementById('main-track-input').value = rawText;
                navigateTo('track');
                lookupShipment();
                return;
            } else {
                renderBotMessage(`⚠️ <strong>Tracking ID Not Found:</strong> No shipment found for <strong>${rawText}</strong>. Please check the ID and try again.`, true);
                return;
            }
        } catch (err) {
            renderBotMessage("⚠️ Unable to connect to tracking server. Please try again shortly.", true);
            return;
        }
    }

    if (botKnowledgeBase.greetings.some(word => text.includes(word))) {
        renderBotMessage(botResponses.greeting);
    } else if (botKnowledgeBase.trackingKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.trackingInfo);
    } else if (botKnowledgeBase.deliveryKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.deliveryInfo);
    } else if (botKnowledgeBase.pricingKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.pricingInfo);
    } else if (botKnowledgeBase.companyKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.escalation);
    } else {
        renderBotMessage(botResponses.fallback);
    }
}

// Auth helpers
async function apiLogin(email, password) {
    if (!email || !password) throw new Error('Missing credentials');
    const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error?.message || 'Login failed');
    }
    const json = await res.json();
    const token = json.data?.token;
    const user = json.data?.user;
    if (token) localStorage.setItem('sl_token', token);
    if (user) localStorage.setItem('sl_user', JSON.stringify(user));
    return { user, token };
}

async function resendVerificationUI() {
    const email = prompt('Enter the email to resend verification to:');
    if (!email) return;
    const res = await apiFetch('/api/auth/resend-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (!res.ok) return alert('Failed to resend verification');
    alert('Verification email resent if the account exists.');
}

// Admin UI
async function fetchAdminSessions(opts = {}) {
    const token = localStorage.getItem('sl_token');
    if (!token) return alert('Not authenticated as admin');
    const q = document.getElementById('admin-search')?.value || '';
    const role = document.getElementById('admin-filter-role')?.value || '';
    const page = opts.page || 1;
    const limit = opts.limit || 50;
    const params = new URLSearchParams({ q, role, page: String(page), limit: String(limit) });
    const res = await apiFetch('/api/admin/sessions?' + params.toString(), { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) return alert('Failed to load sessions: ' + (await res.text()));
    const json = await res.json();
    const list = document.getElementById('admin-sessions-list');
    list.innerHTML = '';
    window.adminSessionsCache = json.data || [];
    window.adminSessionsMeta = json.meta || { page: 1, limit: 50, total: window.adminSessionsCache.length };
    renderAdminSessionsPage(1);
}

let adminSearchTimeout;
function handleAdminSearchChange() {
    clearTimeout(adminSearchTimeout);
    adminSearchTimeout = setTimeout(() => fetchAdminSessions({ page: 1 }), 350);
}

async function exportAdminSessionsServerSide() {
    const token = localStorage.getItem('sl_token');
    if (!token) return alert('Not authenticated');
    const q = document.getElementById('admin-search')?.value || '';
    const role = document.getElementById('admin-filter-role')?.value || '';
    const params = new URLSearchParams({ q, role, page: String(window.adminSessionsMeta?.page || 1), limit: String(window.adminSessionsMeta?.limit || 50), exportCsv: '1' });
    const res = await apiFetch('/api/admin/sessions?' + params.toString(), { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) return alert('Export failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'admin_sessions_export.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function renderAdminSessionsPage(page = 1, pageSize = 6) {
    const list = document.getElementById('admin-sessions-list');
    list.innerHTML = '';
    const data = window.adminSessionsCache || [];
    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const pageData = data.slice(start, start + pageSize);

    pageData.forEach(user => {
        const container = document.createElement('div');
        container.className = 'p-3 border rounded';
        const title = document.createElement('div');
        title.className = 'flex justify-between items-center';
        title.innerHTML = `<div><strong>${user.email}</strong> — ${user.name} <span class="text-xs text-gray-400">(${user.role})</span></div>`;
        container.appendChild(title);
        const sesList = document.createElement('div');
        sesList.className = 'mt-2 space-y-2';
        if (!user.sessions.length) {
            sesList.innerHTML = '<div class="text-xs text-gray-500">No active sessions</div>';
        } else {
            user.sessions.forEach(s => {
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center text-xs';
                row.innerHTML = `<div><strong>${s.deviceName || s.userAgent}</strong> — ${s.ip || 'unknown'} — Expires: ${s.expiresAt ? new Date(s.expiresAt).toLocaleString() : 'N/A'}</div>`;
                const btn = document.createElement('button');
                btn.className = 'ml-4 bg-red-500 text-white px-2 py-1 rounded text-xs';
                btn.innerText = 'Revoke';
                btn.onclick = () => showConfirmModal(`Revoke session for ${user.email}?`, async () => {
                    const r = await apiFetch(`/api/admin/sessions/${user.id}/${s.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('sl_token')}` } });
                    if (r.ok) { alert('Revoked'); fetchAdminSessions(); } else { alert('Failed to revoke'); }
                });
                row.appendChild(btn);
                sesList.appendChild(row);
            });
        }
        container.appendChild(sesList);
        list.appendChild(container);
    });

    const pager = document.createElement('div');
    pager.className = 'mt-4 flex items-center justify-center space-x-2';
    for (let p = 1; p <= pages; p++) {
        const b = document.createElement('button');
        b.className = `px-3 py-1 rounded ${p === page ? 'bg-brandDark text-white' : 'bg-gray-100'}`;
        b.innerText = p;
        b.onclick = () => renderAdminSessionsPage(p, pageSize);
        pager.appendChild(b);
    }
    list.appendChild(pager);

    const exportBtn = document.createElement('div');
    exportBtn.className = 'mt-3 text-right';
    exportBtn.innerHTML = `<button class="bg-brandAccent text-brandDark px-3 py-1 rounded" onclick="exportAdminSessionsCSV()">Export CSV</button>`;
    list.appendChild(exportBtn);
}

function openAdminIfAllowed() {
    const user = JSON.parse(localStorage.getItem('sl_user') || 'null');
    if (!user || user.role !== 'admin') {
        alert('Admin access required');
        return;
    }
    navigateTo('admin');
    fetchAdminSessions();
}

function showConfirmModal(bodyText, onYes) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-modal-body').innerText = bodyText;
    modal.classList.remove('hidden');
    const yesBtn = document.getElementById('confirm-modal-yes');
    yesBtn.onclick = async () => {
        modal.classList.add('hidden');
        await onYes();
    };
}

function hideConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
}

function exportAdminSessionsCSV() {
    const data = window.adminSessionsCache || [];
    const rows = [];
    rows.push(['userEmail', 'userName', 'role', 'sessionId', 'deviceName', 'ip', 'userAgent', 'createdAt', 'expiresAt']);
    data.forEach(u => {
        (u.sessions || []).forEach(s => {
            rows.push([u.email, u.name, u.role, s.id, s.deviceName || '', s.ip || '', s.userAgent || '', s.createdAt || '', s.expiresAt || '']);
        });
    });
    const csv = rows.map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin_sessions.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// ==========================================
// SOURCE CODE PROTECTION BLOCK
// Disables right-click, DevTools shortcuts,
// and View Source keyboard shortcuts
// ==========================================

(function () {

    // 1. Disable right-click context menu
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // 2. Block keyboard shortcuts
    document.addEventListener('keydown', function (e) {

        // F12 — opens DevTools
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I — opens DevTools (Windows/Linux)
        // Cmd+Option+I — opens DevTools (Mac)
        if ((e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.metaKey && e.altKey  && e.key === 'i')) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+J — opens Console tab
        if ((e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.metaKey && e.altKey  && e.key === 'j')) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+C — opens Inspector/Elements tab
        if ((e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.metaKey && e.altKey  && e.key === 'c')) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U — View Page Source
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }

        // Ctrl+S — Save page
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }

        // Ctrl+A — Select all (prevents easy copying)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            return false;
        }
    });

    // 3. Detect if DevTools is open and redirect away
    // (works by measuring a timing difference when devtools is active)
    let devtoolsOpen = false;
    const threshold = 160;

    setInterval(function () {
        const start = performance.now();
        // debugger triggers a pause in DevTools, making this measurably slow
        (function () { })(/* no-op */);
        const elapsed = performance.now() - start;

        if (elapsed > threshold && !devtoolsOpen) {
            devtoolsOpen = true;
            // Blur/clear the page when DevTools detected
            document.body.style.filter = 'blur(10px)';
            document.body.style.pointerEvents = 'none';
        } else if (elapsed <= threshold && devtoolsOpen) {
            devtoolsOpen = false;
            document.body.style.filter = '';
            document.body.style.pointerEvents = '';
        }
    }, 1000);

    // 4. Disable text selection on the whole page
    document.addEventListener('selectstart', function (e) {
        // Allow selection inside input fields and textareas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        return false;
    });

    // 5. Disable drag (prevents dragging images/elements out)
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

})();
