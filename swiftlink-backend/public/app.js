/**
 * SwiftLink Express Application - Advanced Tracking System Engine
 * Enhanced with multi-shipment support, comprehensive tracking, and effective data display
 */

// Enhanced Shipment Database with Multiple Records for Testing
const mockShipmentDatabase = {
    "KCS00346789-CARGO": {
        status: "on-hold",
        shipDate: "2025-10-07",
        deliveryDate: "2025-10-28",
        origin: "UK",
        destination: "58 Hughenden Dr, Leicester LE2 7PX, Kingdom, United country. US AND UK",
        shipperName: "MORRIS EJECTOR",
        shipperAddr: "58 Hughenden Dr, Leicester LE2 7PX, Kingdom, United country. US AND UK",
        receiverName: "Yama Saffi",
        receiverAddr: "Åsumvej 211 5240 Odense NØ Danmark",
        description: "IPHONE 17 PRO MAX WHITE COLOUR",
        serviceType: "Air Freight Express Premium",
        weight: "14.20 kg",
        quantity: "7 Units",
        travelHistory: [
            { date: "2025-10-29", activity: "HOLD FOR PRODUCT IMPORTATION FEES 720 EURO", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-28", activity: "RELEASE AND IN TRANSIT", location: "DENMARK", details: "IN TRANSIT", highlight: false },
            { date: "2025-10-27", activity: "DEPOSIT 200 BALANCE REMAINING 245 EURO", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-23", activity: "Deposit 200 Euro Bal 445 Euro", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-23", activity: "HOLD FOR PRODUCT Delivery handling and tariff fees DENMARK 645 EURO", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-22", activity: "RELEASE AND IN TRANSIT", location: "DENMARK", details: "IN TRANSIT", highlight: false },
            { date: "2025-10-22", activity: "Deposit 100 Euro Bal 100 Euro", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-21", activity: "Deposit 520 Euro Balance Remaing 200 Euro", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-20", activity: "Deposit 200 Euro Bal 720 Euro", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-20", activity: "HOLD FOR PRODUCT TERMINAL GATE PASS 920 EURO", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-17", activity: "RELEASE AND IN TRANSIT", location: "DENMARK", details: "IN TRANSIT", highlight: false },
            { date: "2025-10-16", activity: "Deposit $350 Balance Remaing 350 dollars", location: "DENMARK", details: "HOLD", highlight: true },
            { date: "2025-10-16", activity: "HOLD FOR PRODUCT EXCESS WEIGHT 7 UNITS MISSPACKAGE", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-16", activity: "RELEASE AND IN TRANSIT", location: "DENMARK", details: "IN TRANSIT", highlight: false },
            { date: "2025-10-13", activity: "Deposit 250 USD Bal 300. USD Hold on", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-13", activity: "HOLD FOR PRODUCT TAX AND VAT FEES", location: "DENMARK", details: "ON HOLD", highlight: true },
            { date: "2025-10-10", activity: "REALEASED AND IN TRANSIT", location: "GERMANY", details: "IN TRANSIT", highlight: false },
            { date: "2025-10-10", activity: "HOLD FOR PRODUCT CLEARANCES FEES", location: "GERMANY", details: "ON HOLD", highlight: true },
            { date: "2025-10-07", activity: "SHIPPED OUT", location: "UK", details: "IN TRANSIT", highlight: false }
        ]
    },
    "SL-505-XYZ": {
        status: "transit",
        shipDate: "2025-11-01",
        deliveryDate: "2025-11-18",
        origin: "Singapore",
        destination: "Port Authority Warehouse, Lagos, Nigeria",
        shipperName: "TECH INNOVATIONS LTD",
        shipperAddr: "45 Tech Park, Singapore 067897",
        receiverName: "Johnson Okonkwo",
        receiverAddr: "23 Commerce Street, Ikoyi, Lagos, Nigeria",
        description: "ELECTRONICS - 200 UNITS LAPTOP COMPONENTS",
        serviceType: "Sea Freight FCL Container",
        weight: "8,500 kg",
        quantity: "1 x 40FT Container",
        travelHistory: [
            { date: "2025-11-15", activity: "CUSTOMS CLEARANCE PROCESSING", location: "NIGERIA", details: "IN CUSTOMS", highlight: true },
            { date: "2025-11-14", activity: "VESSEL ARRIVED AT PORT TERMINAL", location: "NIGERIA", details: "PORT ARRIVAL", highlight: false },
            { date: "2025-11-10", activity: "IN TRANSIT - AT SEA", location: "GULF OF GUINEA", details: "IN TRANSIT", highlight: false },
            { date: "2025-11-05", activity: "VESSEL DEPARTED PORT", location: "SINGAPORE", details: "IN TRANSIT", highlight: false },
            { date: "2025-11-02", activity: "CONTAINER LOADING COMPLETED", location: "SINGAPORE", details: "LOADING", highlight: false },
            { date: "2025-11-01", activity: "SHIPMENT RECEIVED AT PORT", location: "SINGAPORE", details: "PROCESSING", highlight: false }
        ]
    },
    "SL-101-ABC": {
        status: "delivered",
        shipDate: "2025-10-15",
        deliveryDate: "2025-10-22",
        origin: "USA",
        destination: "Apapa Container Offload Dock, Lagos, Nigeria",
        shipperName: "GLOBAL TRADERS USA",
        shipperAddr: "789 Commerce Ave, New York, NY 10001, USA",
        receiverName: "Ada Anambra",
        receiverAddr: "Apapa Container Offload Dock, Lagos, Nigeria",
        description: "AUTOMOTIVE PARTS - 50 UNITS ENGINE COMPONENTS",
        serviceType: "Air Freight Express Premium",
        weight: "2,500 kg",
        quantity: "50 Units",
        travelHistory: [
            { date: "2025-10-22", activity: "DELIVERED TO CONSIGNEE", location: "NIGERIA", details: "DELIVERED", highlight: false },
            { date: "2025-10-21", activity: "OUT FOR DELIVERY", location: "NIGERIA", details: "DELIVERY", highlight: false },
            { date: "2025-10-20", activity: "CUSTOMS CLEARANCE COMPLETED", location: "NIGERIA", details: "CLEARED", highlight: false },
            { date: "2025-10-19", activity: "ARRIVED AT DESTINATION AIRPORT", location: "NIGERIA", details: "ARRIVED", highlight: false },
            { date: "2025-10-15", activity: "DEPARTED FROM ORIGIN AIRPORT", location: "USA", details: "IN TRANSIT", highlight: false }
        ]
    }
};

// API base URL helper: use localhost backend when served locally (prefer 5001)
const API_BASE_URL = (() => {
    if (window.location.protocol === 'file:' || window.location.origin === 'null') {
        return 'http://localhost:5001';
    }
    // If running on localhost but different port, use origin so relative `/api` works
    return window.location.origin;
})();

function apiFetch(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    return fetch(url, options);
}

// 2. Client Side SPA View Switcher Engine Matrix with GSAP Integration
function navigateTo(pageId) {
    // Hide all view pages
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(page => page.classList.add('hidden'));

    // Remove active style state indicators from all links
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));

    // Reveal requested element block target layout
    const activePage = document.getElementById(`page-${pageId}`);
    if (activePage) {
        activePage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Force GSAP stagger animation on the elements inside the newly active page
        const revealElements = activePage.querySelectorAll('.gsap-reveal');
        if (revealElements.length > 0) {
            gsap.fromTo(revealElements, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }

    // Assign active color styling to chosen node link anchor tag element instance
    const activeLink = document.getElementById(`link-${pageId}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

// 3. Quick Track Home Bridge Transfer Interface Trigger Node
function executeQuickTrack() {
    const inputVal = document.getElementById('quick-track-input').value.trim();
    if (!inputVal) return;
    
    // Transfer string payload token variable over across to the primary module layout grid
    document.getElementById('main-track-input').value = inputVal;
    navigateTo('track');
    lookupShipment();
}

// 4. Database Query Processing Engine System Matcher Logic - ENHANCED
async function lookupShipment() {
    const trackingId = document.getElementById('main-track-input').value.trim();
    const resultBox = document.getElementById('tracking-result-box');
    const errorBox = document.getElementById('tracking-error-box');

    if (!resultBox || !errorBox) return;

    // Reset layout containers
    resultBox.classList.add('hidden');
    errorBox.classList.add('hidden');

    if (!trackingId) {
        errorBox.classList.remove('hidden');
        return;
    }
    // Try API lookup first
    const token = localStorage.getItem('sl_token');
    try {
        const res = await apiFetch(`/api/tracking/number/${encodeURIComponent(trackingId)}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (res.ok) {
            const json = await res.json();
            const shipment = json.data.shipment;
            const history = json.data.history || [];

            // Populate fields from API
            document.getElementById('lbl-tracking-no').innerText = shipment.trackingNumber || trackingId;
            document.getElementById('lbl-ship-date').innerText = shipment.shipDate ? new Date(shipment.shipDate).toLocaleDateString() : '';
            document.getElementById('lbl-delivery-date').innerText = shipment.estimatedDeliveryDate ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString() : (shipment.actualDeliveryDate ? new Date(shipment.actualDeliveryDate).toLocaleDateString() : '');
            document.getElementById('lbl-origin').innerText = (shipment.origin && (shipment.origin.city || shipment.origin.country)) ? `${shipment.origin.city || ''} ${shipment.origin.country || ''}`.trim() : '';
            document.getElementById('lbl-destination').innerText = shipment.destination && (shipment.destination.address || shipment.destination.city) ? (shipment.destination.address || shipment.destination.city) : '';
            document.getElementById('lbl-shipper-name').innerText = shipment.shipper?.name || '';
            document.getElementById('lbl-shipper-addr').innerText = shipment.shipper?.address || '';
            document.getElementById('lbl-receiver-name').innerText = shipment.receiver?.name || '';
            document.getElementById('lbl-receiver-addr').innerText = shipment.receiver?.address || '';
            document.getElementById('lbl-description').innerText = shipment.cargo?.description || '';
            document.getElementById('lbl-service-type').innerText = shipment.service?.type ? `${shipment.service.type} / ${shipment.service.mode}` : '';
            document.getElementById('lbl-weight').innerText = shipment.cargo?.weight ? `${shipment.cargo.weight.value} ${shipment.cargo.weight.unit}` : '';
            document.getElementById('lbl-quantity').innerText = shipment.cargo?.quantity ? shipment.cargo.quantity : '';
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
            if (gsap) gsap.fromTo(resultBox, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
            return;
        }

        // If API returned 404, fall back to local mock database
        if (res.status === 404) {
            const record = mockShipmentDatabase[trackingId];
            if (!record) {
                errorBox.classList.remove('hidden');
                return;
            }

            // reuse existing mock population logic
            document.getElementById('lbl-tracking-no').innerText = trackingId;
            document.getElementById('lbl-ship-date').innerText = record.shipDate;
            document.getElementById('lbl-delivery-date').innerText = record.deliveryDate;
            document.getElementById('lbl-origin').innerText = record.origin;
            document.getElementById('lbl-destination').innerText = record.destination;
            document.getElementById('lbl-shipper-name').innerText = record.shipperName;
            document.getElementById('lbl-shipper-addr').innerText = record.shipperAddr;
            document.getElementById('lbl-receiver-name').innerText = record.receiverName;
            document.getElementById('lbl-receiver-addr').innerText = record.receiverAddr;
            document.getElementById('lbl-description').innerText = record.description;
            document.getElementById('lbl-service-type').innerText = record.serviceType;
            document.getElementById('lbl-weight').innerText = record.weight;
            document.getElementById('lbl-quantity').innerText = record.quantity;
            document.getElementById('lbl-barcode-text').innerText = trackingId;

            const tbody = document.getElementById('travel-history-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            record.travelHistory.forEach((log) => {
                const row = document.createElement('tr');
                if (log.highlight) {
                    row.className = "bg-red-950/20 text-red-300 border-b border-slate-700/40 font-medium text-xs";
                } else {
                    row.className = "odd:bg-brandDark/40 even:bg-brandDark/20 text-slate-200 border-b border-slate-700/40 font-medium text-xs";
                }
                row.innerHTML = `
                    <td class="p-3 font-mono text-slate-400">${log.date}</td>
                    <td class="p-3 tracking-wide">${log.activity}</td>
                    <td class="p-3 uppercase font-semibold text-brandAccent">${log.location}</td>
                    <td class="p-3 font-bold ${log.highlight ? 'text-red-400' : 'text-emerald-400'}">${log.details}</td>
                `;
                tbody.appendChild(row);
            });

            resultBox.classList.remove('hidden');
            if (gsap) gsap.fromTo(resultBox, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
            return;
        }

        // Other API errors
        errorBox.classList.remove('hidden');
        return;
    } catch (err) {
        // Network error — fall back to mock DB if available
        const record = mockShipmentDatabase[trackingId];
        if (record) {
            document.getElementById('lbl-tracking-no').innerText = trackingId;
            document.getElementById('lbl-ship-date').innerText = record.shipDate;
            document.getElementById('lbl-delivery-date').innerText = record.deliveryDate;
            document.getElementById('lbl-origin').innerText = record.origin;
            document.getElementById('lbl-destination').innerText = record.destination;
            document.getElementById('lbl-shipper-name').innerText = record.shipperName;
            document.getElementById('lbl-shipper-addr').innerText = record.shipperAddr;
            document.getElementById('lbl-receiver-name').innerText = record.receiverName;
            document.getElementById('lbl-receiver-addr').innerText = record.receiverAddr;
            document.getElementById('lbl-description').innerText = record.description;
            document.getElementById('lbl-service-type').innerText = record.serviceType;
            document.getElementById('lbl-weight').innerText = record.weight;
            document.getElementById('lbl-quantity').innerText = record.quantity;
            document.getElementById('lbl-barcode-text').innerText = trackingId;

            const tbody = document.getElementById('travel-history-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            record.travelHistory.forEach((log) => {
                const row = document.createElement('tr');
                if (log.highlight) {
                    row.className = "bg-red-950/20 text-red-300 border-b border-slate-700/40 font-medium text-xs";
                } else {
                    row.className = "odd:bg-brandDark/40 even:bg-brandDark/20 text-slate-200 border-b border-slate-700/40 font-medium text-xs";
                }
                row.innerHTML = `
                    <td class="p-3 font-mono text-slate-400">${log.date}</td>
                    <td class="p-3 tracking-wide">${log.activity}</td>
                    <td class="p-3 uppercase font-semibold text-brandAccent">${log.location}</td>
                    <td class="p-3 font-bold ${log.highlight ? 'text-red-400' : 'text-emerald-400'}">${log.details}</td>
                `;
                tbody.appendChild(row);
            });

            resultBox.classList.remove('hidden');
            if (gsap) gsap.fromTo(resultBox, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
            return;
        }

        errorBox.classList.remove('hidden');
        return;
    }
}

function openPrintView() {
    const trackingId = (document.getElementById('lbl-tracking-no')?.innerText || '').trim()
        || (document.getElementById('main-track-input')?.value || '').trim();

    if (!trackingId) {
        alert('Please run a shipment lookup first before printing the waybill.');
        return;
    }

    window.open(`/print.html?id=${encodeURIComponent(trackingId)}`, '_blank');
}

// 5. Get List of Available Tracking Numbers for Reference
function getAvailableTrackingNumbers() {
    return Object.keys(mockShipmentDatabase);
}

// 7. Accordion Toggle Mechanism for FAQ Page Component Modules
function toggleFaq(element) {
    const para = element.querySelector('p');
    const icon = element.querySelector('i');
    
    if (para && icon) {
        para.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    }
}

// 8. Contact Form Verification Submission Handler Endpoint Mock Hook
async function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name')?.value?.trim();
    const email = document.getElementById('contact-email')?.value?.trim();
    const phone = document.getElementById('contact-phone')?.value?.trim();
    const trackingRef = document.getElementById('contact-tracking')?.value?.trim();
    const message = document.getElementById('contact-message')?.value?.trim();

    if (!name || !email || !message) {
        alert('Please provide your name, email, and message before submitting.');
        return;
    }

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, trackingRef, message })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || 'Unable to send inquiry.');
        alert('Thank you! Your inquiry was received. The admin will be notified and will respond shortly.');
        event.target.reset();
    } catch (err) {
        console.error(err);
        alert('Unable to submit your inquiry right now. Please try again later.');
    }
}

// 9. Initial Entrance Animations For Hero elements
function initGSAPEntrance() {
    const tl = gsap.timeline();
    tl.to("#hero-tag", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to("#hero-title", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
      .to("#hero-desc", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .to("#hero-input", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .to("#page-home .gsap-reveal", { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "-=0.2");
}

// Mobile Hamburger Menu Navigation Toggle Mechanism Hook Block
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Image Sliders Initialization
let currentSlideIndex = 0;
let slideIntervalId;
const totalSlidesCount = 3; // Adjusted to match your structural layout setup

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

    if(!slides.length) return;

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

// Master Orchestration Boot Trigger Setup
window.addEventListener('load', () => {
    // Setup initial coordinates for animation reveal tags
    gsap.set(".gsap-reveal", { y: 30, opacity: 0 });

    // Handle preloader clearing and start animations
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

// Structured Intent Knowledge base Mapping Array
const botKnowledgeBase = {
    greetings: ["hi", "hello", "hey", "good day", "start", "welcome"],
    trackingKeywords: ["track", "where is my package", "status", "delivery status", "package", "shipment", "not working", "delayed", "transit"],
    deliveryKeywords: ["location", "deliver to", "international", "how long", "same-day", "hours"],
    pricingKeywords: ["cost", "price", "quote", "payment", "charge", "fee"],
    companyKeywords: ["office", "location", "address", "contact", "support", "weekend", "services"]
};

// Standard Default Responses Configuration Template
const botResponses = {
    greeting: "Welcome to SwiftLink Express 👋. I'm your virtual logistics agent. How can I assist you with your operations today?",
    trackingInfo: "To locate your package parameters instantly, choose 'Track Shipment' below or enter your exact Tracking Reference ID (e.g., KCS00346789-CARGO).",
    deliveryInfo: "We deliver across major intercontinental routes! We specialize in Air Freight Express Premium, Maritime Container Sea Cargo, and regional Road Delivery networks. Most express air setups arrive within 3-5 business days.",
    pricingInfo: "Pricing maps directly to total mass weight, volumetric dimensions, destination coordinates, and cargo class requirements. Click 'Get Delivery Quote' below to coordinate parameters with our logistics desks.",
    escalation: "Let me get you over to a direct operational coordinator. You can reach our escalation desk directly on Telegram or WhatsApp at +17242916750, or submit an email ticket right here.",
    fallback: "I couldn't quite map that operational directive. Please use one of our quick-action utility options below or input a valid shipment sequence tracker identifier key."
};

// Interactive Quick Action Control Config Template Arrays
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
    
    // Check if the chat widget was just closed
    if (box.classList.contains('hidden')) {
        // Clear all previous chat bubbles immediately to save memory and reset privacy
        logs.innerHTML = '';
    } else {
        // If it was just opened and it's empty, render a fresh initial greeting
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
        switch(actionToken) {
            case "trigger_tracking_prompt":
                renderBotMessage(botResponses.trackingInfo);
                break;
            case "trigger_quote_prompt":
                renderBotMessage("To draft an accurate contract pipeline quote statement, please state: \n1. Cargo Dimension/Weight \n2. Route Origins & Destinations.\n\nOur human administrators will process your data coordinates as soon as they log back online.");
                break;
            case "trigger_support":
                renderBotMessage(botResponses.escalation);
                // Smart redirect trigger sequence context fallback pipeline
                window.open('https://wa.me/17242916750?text=Hello%20SwiftLink%20Express,%20I%20need%20help%20with%20my%20shipment.', '_blank');
                break;
            case "trigger_delivery":
                renderBotMessage(botResponses.deliveryInfo);
                break;
            case "trigger_company":
                renderBotMessage(botResponses.companyInfo);
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

// Main Intent Switch Router Mechanism Block
function processIncomingInputText(rawText) {
    const text = rawText.toLowerCase();

    // Context Hook Check Type A: Direct Reference Key Match Check onto Local Repository Grid System
    if (mockShipmentDatabase[rawText]) {
        const record = mockShipmentDatabase[rawText];
        let alertMarker = record.status === "on-hold";
        
        let reportStr = `<strong>🚨 SYSTEM UPDATE FOR TRACKING: ${rawText}</strong><br><br>` +
                        `• <strong>Current Status:</strong> <span class="${alertMarker ? 'text-red-500 font-bold': 'text-green-500'}">${record.status.toUpperCase()}</span><br>` +
                        `• <strong>Description:</strong> ${record.description}<br>` +
                        `• <strong>Destination:</strong> ${record.destination}<br><br>` +
                        `• <strong>Latest Activity Log:</strong> "${record.travelHistory[0].activity}" (${record.travelHistory[0].location})`;
                        
        renderBotMessage(reportStr, alertMarker);
        
        // Synchronized deep linking engine: Update and slide navigate background page layout across to the primary module framework seamlessly
        document.getElementById('main-track-input').value = rawText;
        navigateTo('track');
        lookupShipment();
        return;
    }

    // Context Check Type B: Key phrase intent classification checks
    if (botKnowledgeBase.greetings.some(word => text.includes(word))) {
        renderBotMessage(botResponses.greeting);
    } else if (botKnowledgeBase.trackingKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.trackingInfo);
    } else if (botKnowledgeBase.deliveryKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.deliveryInfo);
    } else if (botKnowledgeBase.pricingKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.pricingInfo);
    } else if (botKnowledgeBase.companyKeywords.some(word => text.includes(word))) {
        renderBotMessage(botResponses.companyInfo);
    } else {
        // Fallback checks to see if string mimics an invalid alphanumeric routing code identifier token layout format
        if (text.length > 5 && (text.includes('-') || /[0-9]/.test(text))) {
            renderBotMessage(`⚠️ <strong>Tracking Identification Mismatch:</strong> We detected string coordinates format resembling an invalid reference ledger key code sequence token. Please check documentation details or connect with our dispatch desk below.`, true);
        } else {
            renderBotMessage(botResponses.fallback);
        }
    }
}

// Frontend API: Login helper and handler
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
    if (token) {
        localStorage.setItem('sl_token', token);
    }
    if (user) {
        localStorage.setItem('sl_user', JSON.stringify(user));
    }
    return { user, token };
}

// Homepage login handler removed; admin login happens on /admin

// Resend verification UI helper
async function resendVerificationUI() {
    const email = prompt('Enter the email to resend verification to:');
    if (!email) return;
    const res = await apiFetch('/api/auth/resend-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (!res.ok) return alert('Failed to resend verification');
    alert('Verification email resent if the account exists.');
}

// Admin UI: fetch and render sessions
async function fetchAdminSessions(opts = {}) {
    const token = localStorage.getItem('sl_token');
    if (!token) return alert('Not authenticated as admin');
    const q = document.getElementById('admin-search')?.value || '';
    const role = document.getElementById('admin-filter-role')?.value || '';
    const page = opts.page || 1;
    const limit = opts.limit || 50;
    const params = new URLSearchParams({ q, role, page: String(page), limit: String(limit) });
    const res = await apiFetch('/api/admin/sessions?' + params.toString(), { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) {
        return alert('Failed to load sessions: ' + (await res.text()));
    }
    const json = await res.json();
    const list = document.getElementById('admin-sessions-list');
    list.innerHTML = '';

    // store cache for pagination/export
    window.adminSessionsCache = json.data || [];
    window.adminSessionsMeta = json.meta || { page: 1, limit: 50, total: window.adminSessionsCache.length };
    // render page 1 by default
    renderAdminSessionsPage(1);
}

// handle search input debounce
let adminSearchTimeout;
function handleAdminSearchChange() {
    clearTimeout(adminSearchTimeout);
    adminSearchTimeout = setTimeout(() => fetchAdminSessions({ page: 1 }), 350);
}

// allow server-side export which streams CSV for current page
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
    const start = (page -1)*pageSize;
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

    // Pagination controls
    const pager = document.createElement('div');
    pager.className = 'mt-4 flex items-center justify-center space-x-2';
    for (let p=1;p<=pages;p++) {
        const b = document.createElement('button');
        b.className = `px-3 py-1 rounded ${p===page? 'bg-brandDark text-white':'bg-gray-100'}`;
        b.innerText = p;
        b.onclick = () => renderAdminSessionsPage(p, pageSize);
        pager.appendChild(b);
    }
    list.appendChild(pager);

    // Export button
    const exportBtn = document.createElement('div');
    exportBtn.className = 'mt-3 text-right';
    exportBtn.innerHTML = `<button class="bg-brandAccent text-brandDark px-3 py-1 rounded" onclick="exportAdminSessionsCSV()">Export CSV</button>`;
    list.appendChild(exportBtn);
}

// Navigate to admin page only if user is admin
function openAdminIfAllowed() {
    const user = JSON.parse(localStorage.getItem('sl_user') || 'null');
    if (!user || user.role !== 'admin') {
        alert('Admin access required');
        return;
    }
    navigateTo('admin');
    fetchAdminSessions();
}

// Confirmation modal helpers
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
    rows.push(['userEmail','userName','role','sessionId','deviceName','ip','userAgent','createdAt','expiresAt']);
    data.forEach(u => {
        (u.sessions||[]).forEach(s => {
            rows.push([u.email, u.name, u.role, s.id, s.deviceName || '', s.ip || '', s.userAgent || '', s.createdAt || '', s.expiresAt || '']);
        });
    });

    const csv = rows.map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
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