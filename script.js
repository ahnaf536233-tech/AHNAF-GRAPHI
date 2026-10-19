"use strict";

/* ============================================================
   CONFIGURATION: edit this block to customise your site
   ============================================================ */
const CONFIG = {
  // >>> WHATSAPP NUMBER <<<  Country code + number, digits only (no +, spaces or dashes).
  // Example for Bangladesh: "8801712345678"
  WHATSAPP_NUMBER: "8801890042863",
  EMAIL: "hello@example.com",
  LOCATION: { en: "Bangladesh", bn: "বাংলাদেশ" },
  CURRENCY: "৳"
};

/* PRICES: change the "amount" numbers. "service" pre-selects that service in the form. */
const PRICES = [
  { key: "starter", amount: 500,  service: "social", featured: false },
  { key: "brand",   amount: 2000, service: "logo",   featured: true  },
  { key: "premium", amount: 3500, service: "nikah",  featured: false }
];

/* PORTFOLIO: replace "img" with your own file, e.g. "images/logo-1.jpg".
   Leave "img" empty ("") to show an auto-generated placeholder. */
const PORTFOLIO = [
  { cat: "logo",    img: "", en: "Brand logo concept",      bn: "ব্র্যান্ড লোগো কনসেপ্ট" },
  { cat: "banner",  img: "", en: "Shop opening banner",     bn: "দোকান উদ্বোধনের ব্যানার" },
  { cat: "poster",  img: "", en: "Event poster",            bn: "ইভেন্ট পোস্টার" },
  { cat: "social",  img: "", en: "Social media post set",   bn: "সোশ্যাল মিডিয়া পোস্ট সেট" },
  { cat: "book",    img: "", en: "Book cover",              bn: "বইয়ের কভার" },
  { cat: "nikah",   img: "", en: "Premium Nikahnama",       bn: "প্রিমিয়াম নিকাহনামা" },
  { cat: "islamic", img: "", en: "Calligraphy artwork",     bn: "ক্যালিগ্রাফি শিল্পকর্ম" },
  { cat: "islamic", img: "", en: "Quran verse frame",       bn: "কুরআনের আয়াতের ফ্রেম" }
];

/* ============================================================
   TEXT (English / Bangla)
   ============================================================ */
const T = {
  en: {
    skip: "Skip to content", menu: "Menu",
    "nav.home": "Home", "nav.about": "About", "nav.services": "Services", "nav.portfolio": "Portfolio", "nav.pricing": "Pricing", "nav.order": "Order", "nav.contact": "Contact",
    "hero.badge": "Graphic design studio",
    "hero.title": "Designs that carry your story with grace.",
    "hero.sub": "Logos, Nikahnama, Islamic calligraphy and Quran verse frames, crafted with care by AHNAF GRAPHI.",
    "hero.cta1": "Order a design", "hero.cta2": "See portfolio", "hero.wa": "Chat on WhatsApp",
    "about.title": "About AHNAF GRAPHI",
    "about.p1": "AHNAF GRAPHI is a graphic design studio creating clean, modern work rooted in Islamic art: geometry, calligraphy and quiet elegance.",
    "about.p2": "Every project starts with a conversation. You share the idea, we shape it, and you approve each step before delivery.",
    "about.v1": "Respectful design", "about.v2": "Clear communication", "about.v3": "Print-ready files",
    "services.title": "Our services", "services.intro": "Choose a service, then tell us the details in the order form.",
    "svc.logo": "Logo design", "svc.logo.d": "A distinct mark for your brand, with colour and black-white versions.",
    "svc.banner": "Banners", "svc.banner.d": "Web, event and shop banners sized for where they will be used.",
    "svc.poster": "Posters", "svc.poster.d": "Eye-catching posters for events, campaigns and announcements.",
    "svc.social": "Social media posts", "svc.social.d": "Consistent post and story designs for Facebook and Instagram.",
    "svc.book": "Book covers", "svc.book.d": "Front, back and spine layouts ready for print or e-book.",
    "svc.nikah": "Premium Nikahnama", "svc.nikah.d": "Elegant, print-ready Nikahnama layouts with ornamental borders.",
    "svc.calli": "Islamic calligraphy", "svc.calli.d": "Arabic and Bangla calligraphy artwork for walls, gifts and branding.",
    "svc.quran": "Quran verse frames", "svc.quran.d": "Verse designs with careful layout, using verified text you provide.",
    "portfolio.title": "Portfolio", "portfolio.intro": "A selection of our work.",
    "cat.all": "All", "cat.islamic": "Islamic art",
    "pricing.title": "Pricing", "pricing.intro": "Starting prices. The final price depends on your design details.",
    "plan.starter": "Starter", "plan.starter.d": "Social posts, banners and posters",
    "plan.brand": "Brand", "plan.brand.d": "Logo with colour and black-white versions",
    "plan.premium": "Premium", "plan.premium.d": "Nikahnama, calligraphy and Quran verse frames",
    "plan.f1": "Free revisions as agreed", "plan.f2": "Files in common formats",
    "plan.from": "From", "plan.cta": "Order this",
    "order.title": "Place your order", "order.intro": "Fill in the details and WhatsApp will open with your message ready to send.",
    "order.name": "Your name", "order.service": "Service", "order.choose": "Choose a service",
    "order.details": "Design details", "order.detailsPh": "Text, colours, size, style, references...",
    "order.deadline": "Deadline", "order.budget": "Budget", "order.submit": "Send order on WhatsApp",
    "order.note": "This form does not save orders anywhere. It only prepares a WhatsApp message; you press send there.",
    "err.name": "Enter your name.", "err.service": "Choose a service.",
    "err.details": "Describe your design in at least 10 characters.",
    "err.deadline": "Choose a deadline that is today or later.", "err.budget": "Enter a budget above 0.",
    "ok.msg": "WhatsApp should have opened. If it did not, use this link:", "ok.link": "Open WhatsApp",
    "ok.nonum": "The WhatsApp number is not set yet, so you will pick the recipient inside WhatsApp.",
    "ok.preview": "Your message:",
    "wa.hello": "Hello AHNAF GRAPHI, I would like to place an order.",
    "wa.general": "Hello AHNAF GRAPHI, I would like to ask about your design services.",
    "wa.name": "Name", "wa.service": "Service", "wa.details": "Details", "wa.deadline": "Deadline", "wa.budget": "Budget",
    "contact.title": "Contact", "contact.intro": "Message us on WhatsApp or email. We reply as soon as we can.",
    "contact.wa": "WhatsApp", "contact.email": "Email", "contact.loc": "Location",
    "footer.rights": "All rights reserved.", "footer.top": "Back to top",
    "meta.title": "AHNAF GRAPHI | Graphic Design, Nikahnama & Islamic Calligraphy",
    "meta.desc": "AHNAF GRAPHI is a graphic design studio for logos, banners, posters, social media posts, book covers, premium Nikahnama designs, Islamic calligraphy and Quran verse frames.",
    switchTo: "বাংলা"
  },
  bn: {
    skip: "মূল অংশে যান", menu: "মেনু",
    "nav.home": "হোম", "nav.about": "পরিচিতি", "nav.services": "সেবাসমূহ", "nav.portfolio": "পোর্টফোলিও", "nav.pricing": "মূল্য", "nav.order": "অর্ডার", "nav.contact": "যোগাযোগ",
    "hero.badge": "গ্রাফিক ডিজাইন স্টুডিও",
    "hero.title": "আপনার গল্প বলবে মার্জিত ডিজাইন।",
    "hero.sub": "লোগো, নিকাহনামা, ইসলামিক ক্যালিগ্রাফি ও কুরআনের আয়াতের ফ্রেম, যত্ন ও নিপুণতায় তৈরি করে আহনাফ গ্রাফি।",
    "hero.cta1": "ডিজাইন অর্ডার করুন", "hero.cta2": "পোর্টফোলিও দেখুন", "hero.wa": "হোয়াটসঅ্যাপে কথা বলুন",
    "about.title": "আহনাফ গ্রাফি সম্পর্কে",
    "about.p1": "আহনাফ গ্রাফি একটি গ্রাফিক ডিজাইন স্টুডিও, যেখানে ইসলামি শিল্পের জ্যামিতি, ক্যালিগ্রাফি ও সাদাসিধে সৌন্দর্যের ছোঁয়ায় আধুনিক ডিজাইন তৈরি হয়।",
    "about.p2": "প্রতিটি কাজ শুরু হয় কথোপকথনে। আপনি ধারণা জানান, আমরা রূপ দিই, আর ডেলিভারির আগে প্রতিটি ধাপ আপনি অনুমোদন করেন।",
    "about.v1": "শালীন ডিজাইন", "about.v2": "স্পষ্ট যোগাযোগ", "about.v3": "প্রিন্ট-রেডি ফাইল",
    "services.title": "আমাদের সেবা", "services.intro": "একটি সেবা বেছে নিন, তারপর অর্ডার ফর্মে বিস্তারিত জানান।",
    "svc.logo": "লোগো ডিজাইন", "svc.logo.d": "আপনার ব্র্যান্ডের স্বতন্ত্র প্রতীক, রঙিন ও সাদাকালো সংস্করণসহ।",
    "svc.banner": "ব্যানার", "svc.banner.d": "ওয়েব, ইভেন্ট ও দোকানের ব্যানার, ব্যবহারের মাপ অনুযায়ী।",
    "svc.poster": "পোস্টার", "svc.poster.d": "ইভেন্ট, প্রচারণা ও ঘোষণার জন্য দৃষ্টিনন্দন পোস্টার।",
    "svc.social": "সোশ্যাল মিডিয়া পোস্ট", "svc.social.d": "ফেসবুক ও ইনস্টাগ্রামের জন্য সামঞ্জস্যপূর্ণ পোস্ট ও স্টোরি ডিজাইন।",
    "svc.book": "বইয়ের কভার", "svc.book.d": "প্রিন্ট বা ই-বুকের জন্য সামনে, পেছনে ও স্পাইনের ডিজাইন।",
    "svc.nikah": "প্রিমিয়াম নিকাহনামা", "svc.nikah.d": "অলংকৃত বর্ডারসহ মার্জিত, প্রিন্ট-রেডি নিকাহনামা ডিজাইন।",
    "svc.calli": "ইসলামিক ক্যালিগ্রাফি", "svc.calli.d": "দেয়াল, উপহার ও ব্র্যান্ডিংয়ের জন্য আরবি ও বাংলা ক্যালিগ্রাফি।",
    "svc.quran": "কুরআনের আয়াতের ফ্রেম", "svc.quran.d": "আপনার দেওয়া যাচাইকৃত আয়াত নিয়ে যত্নের সঙ্গে সাজানো ডিজাইন।",
    "portfolio.title": "পোর্টফোলিও", "portfolio.intro": "আমাদের কাজের একটি নির্বাচিত সংকলন।",
    "cat.all": "সব", "cat.islamic": "ইসলামিক শিল্প",
    "pricing.title": "মূল্য", "pricing.intro": "শুরুর মূল্য। চূড়ান্ত মূল্য আপনার ডিজাইনের বিস্তারিতের উপর নির্ভর করে।",
    "plan.starter": "স্টার্টার", "plan.starter.d": "সোশ্যাল পোস্ট, ব্যানার ও পোস্টার",
    "plan.brand": "ব্র্যান্ড", "plan.brand.d": "রঙিন ও সাদাকালো সংস্করণসহ লোগো",
    "plan.premium": "প্রিমিয়াম", "plan.premium.d": "নিকাহনামা, ক্যালিগ্রাফি ও কুরআনের আয়াতের ফ্রেম",
    "plan.f1": "সম্মত অনুযায়ী বিনামূল্যে সংশোধন", "plan.f2": "প্রচলিত ফরম্যাটে ফাইল",
    "plan.from": "শুরু", "plan.cta": "এটি অর্ডার করুন",
    "order.title": "অর্ডার করুন", "order.intro": "বিস্তারিত পূরণ করুন, হোয়াটসঅ্যাপ আপনার বার্তাসহ খুলে যাবে।",
    "order.name": "আপনার নাম", "order.service": "সেবা", "order.choose": "সেবা বেছে নিন",
    "order.details": "ডিজাইনের বিস্তারিত", "order.detailsPh": "লেখা, রং, মাপ, ধরন, রেফারেন্স...",
    "order.deadline": "ডেডলাইন", "order.budget": "বাজেট", "order.submit": "হোয়াটসঅ্যাপে অর্ডার পাঠান",
    "order.note": "এই ফর্ম কোথাও অর্ডার সংরক্ষণ করে না। এটি শুধু হোয়াটসঅ্যাপ বার্তা তৈরি করে; পাঠানোর বোতাম আপনি সেখানে চাপবেন।",
    "err.name": "আপনার নাম লিখুন।", "err.service": "একটি সেবা বেছে নিন।",
    "err.details": "কমপক্ষে ১০ অক্ষরে ডিজাইনের বিবরণ দিন।",
    "err.deadline": "আজ বা পরবর্তী একটি তারিখ বেছে নিন।", "err.budget": "০-এর বেশি একটি বাজেট লিখুন।",
    "ok.msg": "হোয়াটসঅ্যাপ খুলে যাওয়ার কথা। না খুললে এই লিংক ব্যবহার করুন:", "ok.link": "হোয়াটসঅ্যাপ খুলুন",
    "ok.nonum": "হোয়াটসঅ্যাপ নম্বর এখনো সেট করা হয়নি, তাই প্রাপক আপনাকে হোয়াটসঅ্যাপের ভেতরে বেছে নিতে হবে।",
    "ok.preview": "আপনার বার্তা:",
    "wa.hello": "আসসালামু আলাইকুম আহনাফ গ্রাফি, আমি একটি অর্ডার দিতে চাই।",
    "wa.general": "আসসালামু আলাইকুম আহনাফ গ্রাফি, আপনাদের ডিজাইন সেবা সম্পর্কে জানতে চাই।",
    "wa.name": "নাম", "wa.service": "সেবা", "wa.details": "বিস্তারিত", "wa.deadline": "ডেডলাইন", "wa.budget": "বাজেট",
    "contact.title": "যোগাযোগ", "contact.intro": "হোয়াটসঅ্যাপ বা ইমেইলে বার্তা পাঠান। আমরা যত দ্রুত সম্ভব উত্তর দিই।",
    "contact.wa": "হোয়াটসঅ্যাপ", "contact.email": "ইমেইল", "contact.loc": "অবস্থান",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।", "footer.top": "উপরে যান",
    "meta.title": "আহনাফ গ্রাফি | গ্রাফিক ডিজাইন, নিকাহনামা ও ইসলামিক ক্যালিগ্রাফি",
    "meta.desc": "আহনাফ গ্রাফি: লোগো, ব্যানার, পোস্টার, সোশ্যাল মিডিয়া পোস্ট, বইয়ের কভার, প্রিমিয়াম নিকাহনামা, ইসলামিক ক্যালিগ্রাফি ও কুরআনের আয়াতের ফ্রেম ডিজাইন।",
    switchTo: "English"
  }
};

/* ============================================================
   APP
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let lang = "en", filter = "all";
try { const s = localStorage.getItem("ag-lang"); if (s === "bn" || s === "en") lang = s; } catch (e) {}

const t = k => T[lang][k] || T.en[k] || k;
const numberReady = () => /^\d{8,15}$/.test(CONFIG.WHATSAPP_NUMBER);
const waUrl = text => (numberReady() ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}` : "https://wa.me/") + "?text=" + encodeURIComponent(text);
const fmt = n => Number(n).toLocaleString(lang === "bn" ? "bn-BD" : "en-US");

/* Placeholder image (SVG). Replace by setting "img" in PORTFOLIO. */
function placeholder(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#003F2E"/><g fill="none" stroke="#C9A45C" stroke-opacity=".35"><path d="M400 90l55 120 120-55-55 120 120 55-120 55 55 120-120-55-55 120-55-120-120 55 55-120-120-55 120-55-55-120 120 55z"/><rect x="24" y="24" width="752" height="552" stroke-opacity=".8"/></g><text x="400" y="540" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#C9A45C">${label.replace(/[<&>]/g, "")}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function renderFilters() {
  const cats = ["all", "logo", "banner", "poster", "social", "book", "nikah", "islamic"];
  $("#filters").innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.cat = c;
    b.textContent = c === "all" || c === "islamic" ? t("cat." + c) : t("svc." + c);
    b.setAttribute("aria-pressed", String(c === filter));
    b.addEventListener("click", () => { filter = c; applyFilter(); });
    $("#filters").appendChild(b);
  });
}
function renderGallery() {
  $("#gallery").innerHTML = "";
  PORTFOLIO.forEach(p => {
    const f = document.createElement("figure"); f.className = "work"; f.dataset.cat = p.cat;
    const img = document.createElement("img");
    img.src = p.img || placeholder(p.en); img.alt = p[lang]; img.width = 800; img.height = 600; img.loading = "lazy";
    const c = document.createElement("figcaption"); c.textContent = p[lang];
    f.append(img, c); $("#gallery").appendChild(f);
  });
  applyFilter();
}
function applyFilter() {
  $$("#gallery .work").forEach(w => { w.hidden = !(filter === "all" || w.dataset.cat === filter); });
  $$("#filters button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.cat === filter)));
}
function renderPlans() {
  $("#plans").innerHTML = "";
  PRICES.forEach(p => {
    const d = document.createElement("article"); d.className = "plan" + (p.featured ? " featured" : "");
    d.innerHTML = `<h3>${t("plan." + p.key)}</h3><p>${t("plan." + p.key + ".d")}</p><p class="from">${t("plan.from")}</p><p class="price">${CONFIG.CURRENCY}${fmt(p.amount)}</p><ul><li>${t("plan.f1")}</li><li>${t("plan.f2")}</li></ul>`;
    const a = document.createElement("a"); a.className = "btn"; a.href = "#order"; a.textContent = t("plan.cta");
    a.addEventListener("click", () => { $("#service").value = p.service; });
    d.appendChild(a); $("#plans").appendChild(d);
  });
}
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.title = t("meta.title");
  $('meta[name="description"]').content = t("meta.desc");
  $("#langBtn").textContent = t("switchTo");
  $("#locText").textContent = CONFIG.LOCATION[lang];
  $$(".cur").forEach(c => { c.textContent = CONFIG.CURRENCY; });
  renderFilters(); renderGallery(); renderPlans();
  clearErrors(); $("#status").innerHTML = "";
}
function setContacts() {
  $("#emailLink").textContent = CONFIG.EMAIL; $("#emailLink").href = "mailto:" + CONFIG.EMAIL;
  $("#waText").textContent = numberReady() ? "+" + CONFIG.WHATSAPP_NUMBER : "WhatsApp";
  $("#year").textContent = new Date().getFullYear();
}
function refreshWaLinks() {
  $$("[data-wa='general']").forEach(a => { a.href = waUrl(t("wa.general")); });
}

/* ---------- Order form ---------- */
const form = $("#orderForm");
function clearErrors() {
  $$(".err", form).forEach(e => { e.textContent = ""; });
  $$("[aria-invalid]", form).forEach(e => e.removeAttribute("aria-invalid"));
}
function fail(id, key) { $("#err-" + id).textContent = t(key); $("#" + id).setAttribute("aria-invalid", "true"); }
function todayStr() { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }

form.addEventListener("submit", e => {
  e.preventDefault(); clearErrors();
  const v = { name: $("#name").value.trim(), service: $("#service").value, details: $("#details").value.trim(), deadline: $("#deadline").value, budget: $("#budget").value };
  const bad = [];
  if (!v.name) bad.push(["name", "err.name"]);
  if (!v.service) bad.push(["service", "err.service"]);
  if (v.details.length < 10) bad.push(["details", "err.details"]);
  if (!v.deadline || v.deadline < todayStr()) bad.push(["deadline", "err.deadline"]);
  if (!(Number(v.budget) > 0)) bad.push(["budget", "err.budget"]);
  if (bad.length) { bad.forEach(b => fail(...b)); $("#" + bad[0][0]).focus(); return; }

  const serviceName = $("#service").selectedOptions[0].textContent;
  const msg = [t("wa.hello"), "",
    `${t("wa.name")}: ${v.name}`, `${t("wa.service")}: ${serviceName}`, `${t("wa.details")}: ${v.details}`,
    `${t("wa.deadline")}: ${v.deadline}`, `${t("wa.budget")}: ${CONFIG.CURRENCY}${v.budget}`].join("\n");
  const url = waUrl(msg);
  window.open(url, "_blank", "noopener");

  const s = $("#status"); s.innerHTML = "";
  const p = document.createElement("p"); p.textContent = t("ok.msg") + " ";
  const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = t("ok.link");
  p.appendChild(a); s.appendChild(p);
  if (!numberReady()) { const w = document.createElement("p"); w.textContent = t("ok.nonum"); s.appendChild(w); }
  const pre = document.createElement("pre"); pre.textContent = msg; s.appendChild(pre);
});

/* ---------- Init ---------- */
$("#langBtn").addEventListener("click", () => {
  lang = lang === "en" ? "bn" : "en";
  try { localStorage.setItem("ag-lang", lang); } catch (e) {}
  applyLang(); refreshWaLinks();
});
const menuBtn = $("#menuBtn"), nav = $("#nav");
menuBtn.addEventListener("click", () => { const o = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(o)); });
$$("#nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }));
document.addEventListener("keydown", e => { if (e.key === "Escape") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

$("#deadline").min = todayStr();
setContacts(); applyLang(); refreshWaLinks();
