'use strict';
/* ===== কনফিগারেশন: এখানে আপনার তথ্য বদলান ===== */
const CONFIG = {
  WHATSAPP_NUMBER: "8801890042863", // আন্তর্জাতিক ফরম্যাট, + ছাড়া। ফাঁকা রাখলে হোয়াটসঅ্যাপ অর্ডার বন্ধ থাকবে
  BRAND: "AHNAF GRAPHI"
};
const K = {p:'ag_products', c:'ag_cats', cart:'ag_cart', o:'ag_orders', pass:'ag_admin_pass'};
const PH = 'assets/product-placeholder.svg';
const STATUS = ['Pending','Contacted','Confirmed','Completed'];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bn = n => Number(n).toLocaleString('bn-BD');
const tk = n => '৳' + bn(n);
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

function load(k, def, valid) { try { const v = JSON.parse(localStorage.getItem(k)); return v && valid(v) ? v : def(); } catch { return def(); } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { toast('সংরক্ষণ করা যায়নি – ব্রাউজারের স্টোরেজ ভরে গেছে বা বন্ধ।', 'err'); return false; } }
function toast(m, t) { const d = document.createElement('div'); d.className = 'toast ' + (t || ''); d.textContent = m; $('#toasts').append(d); setTimeout(() => d.remove(), 3800); }

const CAT_NAMES = ['লোগো ডিজাইন','ফেসবুক পোস্ট ডিজাইন','সোশ্যাল মিডিয়া ডিজাইন','ব্যানার ডিজাইন','পোস্টার ডিজাইন','ইসলামিক পোস্টার ও দাওয়াহ ডিজাইন','কুরআন আয়াত ও হাদিস ওয়াল ফ্রেম','প্রিমিয়াম নিকাহনামা ডিজাইন','বইয়ের কভার ডিজাইন','আমন্ত্রণপত্র ডিজাইন','বিজনেস কার্ড ডিজাইন','রেস্টুরেন্ট মেনু ডিজাইন','জন্ম স্মারক ডিজাইন','স্মরণ/মেমোরিয়াল ডিজাইন','ইসলামিক ভিডিও থাম্বনেইল','কাস্টম গ্রাফিক ডিজাইন'];
const seedCats = () => CAT_NAMES.map((name, i) => ({id: 'c' + (i + 1), name}));
const seedProds = () => [
  ['লোগো ডিজাইন','c1',1500,1200,true],['ফেসবুক পোস্ট (১টি)','c2',300,0,true],['ইভেন্ট ব্যানার','c4',800,650,false],
  ['ইসলামিক পোস্টার','c6',500,0,true],['আয়াত ওয়াল ফ্রেম','c7',700,0,false],['নিকাহনামা ডিজাইন','c8',1800,1500,true],
  ['বইয়ের কভার','c9',2000,0,false],['ভিজিটিং কার্ড','c11',400,0,false]
].map((a, i) => ({id: 'p' + (i + 1), name: '[নমুনা] ' + a[0], cat: a[1], price: a[2], disc: a[3], short: 'নমুনা সার্ভিস – আসল তথ্য দিয়ে বদলান।', desc: 'এটি একটি ডেমো সার্ভিস ও নমুনা দাম; আসল অফার নয়। অ্যাডমিন প্যানেল থেকে এডিট করুন।', img: '', feat: a[4], active: true, sample: true, created: new Date(Date.now() - i * 864e5).toISOString()}));

const S = {
  cats: load(K.c, seedCats, v => Array.isArray(v) && v.length && v.every(c => c && c.id && c.name)),
  prods: load(K.p, seedProds, v => Array.isArray(v) && v.every(p => p && p.id && p.name && isFinite(p.price))),
  cart: load(K.cart, () => [], v => Array.isArray(v)),
  orders: load(K.o, () => [], v => Array.isArray(v)),
  cat: '', view: 'all', q: '', sort: ''
};
if (localStorage.getItem(K.c) === null) save(K.c, S.cats);
if (localStorage.getItem(K.p) === null) save(K.p, S.prods);
const persist = () => { save(K.c, S.cats); save(K.p, S.prods); save(K.cart, S.cart); save(K.o, S.orders); };

const eff = p => (+p.disc > 0 && +p.disc < +p.price) ? +p.disc : +p.price;
const catName = id => (S.cats.find(c => c.id === id) || {name: 'অন্যান্য'}).name;
const prod = id => S.prods.find(p => p.id === id);
const waOK = () => /^\d{10,15}$/.test(CONFIG.WHATSAPP_NUMBER);
const waLink = msg => `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* ===== পাবলিক ক্যাটালগ ===== */
function visible() {
  let l = S.prods.filter(p => p.active);
  if (S.cat) l = l.filter(p => p.cat === S.cat);
  if (S.view === 'feat') l = l.filter(p => p.feat);
  if (S.view === 'offer') l = l.filter(p => +p.disc > 0 && +p.disc < +p.price);
  if (S.view === 'new') l = [...l].sort((a, b) => (b.created || '').localeCompare(a.created || '')).slice(0, 6);
  const q = S.q.trim().toLowerCase();
  if (q) l = l.filter(p => (p.name + ' ' + p.short).toLowerCase().includes(q));
  if (S.sort) l = [...l].sort((a, b) => S.sort === 'asc' ? eff(a) - eff(b) : eff(b) - eff(a));
  return l;
}
function renderShop() {
  $('#catChips').innerHTML = [{id: '', name: 'সব ক্যাটেগরি'}, ...S.cats].map(c => `<button class="${S.cat === c.id ? 'on' : ''}" data-cat="${esc(c.id)}">${esc(c.name)}</button>`).join('');
  const l = visible();
  $('#grid').innerHTML = l.length ? l.map(p => `<article class="card"><img src="${esc(p.img || PH)}" alt="${esc(p.name)}" loading="lazy" data-detail="${p.id}" onerror="this.onerror=null;this.src='${PH}'">
   <div class="in">${p.sample ? '<span class="tag s">নমুনা</span>' : (p.feat ? '<span class="tag">ফিচার্ড</span>' : '')}<h3>${esc(p.name)}</h3><span class="cat">${esc(catName(p.cat))}</span><p style="margin:0">${esc(p.short)}</p>
   <div class="price">${tk(eff(p))}${eff(p) < p.price ? `<s>${tk(p.price)}</s>` : ''}</div>
   <button class="btn pri" data-add="${p.id}">কার্টে যোগ করুন</button><button class="btn sm dark" data-detail="${p.id}">বিস্তারিত</button></div></article>`).join('')
    : `<div class="empty">${S.q ? `"${esc(S.q)}" নামে কোনো সার্ভিস পাওয়া যায়নি। অন্য শব্দে খুঁজুন বা ক্যাটেগরি বদলান।` : 'এই ক্যাটেগরিতে এখন কোনো সার্ভিস নেই।'}</div>`;
  $('#pf').innerHTML = S.cats.slice(0, 8).map(c => `<figure><img src="assets/product-placeholder.svg" alt="ডেমো ছবি"><figcaption>${esc(c.name)}<br><small>(ডেমো)</small></figcaption></figure>`).join('');
  $$('#viewTabs button').forEach(b => b.classList.toggle('on', b.dataset.v === S.view));
  $('#sampleNote').hidden = !S.prods.some(p => p.sample);
  const n = S.cart.reduce((a, i) => a + i.qty, 0); $('#cartCount').textContent = bn(n);
}

/* ===== কার্ট ===== */
const cartItems = () => S.cart.map(i => ({p: prod(i.id), qty: i.qty})).filter(i => i.p);
const cartTotal = () => cartItems().reduce((a, i) => a + eff(i.p) * i.qty, 0);
function addCart(id) { const i = S.cart.find(x => x.id === id); i ? i.qty++ : S.cart.push({id, qty: 1}); save(K.cart, S.cart); renderShop(); renderCart(); toast('কার্টে যোগ হয়েছে'); }
function renderCart() {
  const it = cartItems();
  $('#cartBody').innerHTML = it.length ? it.map(({p, qty}) => `<div class="ci"><img src="${esc(p.img || PH)}" alt=""><div><b>${esc(p.name)}</b><br>${tk(eff(p))} × ${bn(qty)} = ${tk(eff(p) * qty)}<br>
   <span class="qty"><button data-q="${p.id}" data-d="-1" aria-label="কমান">−</button>${bn(qty)}<button data-q="${p.id}" data-d="1" aria-label="বাড়ান">+</button></span></div><button class="icon" data-rm="${p.id}" aria-label="সরান">🗑</button></div>`).join('')
    + `<p><b>সাবটোটাল: ${tk(it.reduce((a, i) => a + i.p.price * i.qty, 0))}</b><br><b>সর্বমোট (ছাড়সহ): ${tk(cartTotal())}</b></p><p class="note">কাস্টম কাজে চূড়ান্ত দাম, রিভিশন, সময় ও পেমেন্ট নিশ্চিত করা হবে।</p>
   <button class="btn pri" id="checkoutBtn">চেকআউট করুন</button><button class="btn ghost dark" data-close>কেনাকাটা চালিয়ে যান</button>`
    : '<div class="empty">আপনার কার্ট খালি। ক্যাটালগ থেকে সার্ভিস যোগ করুন।</div>';
}
const drawer = open => { $('#drawer').classList.toggle('open', open); $('#drawer').setAttribute('aria-hidden', !open); if (open) renderCart(); };

/* ===== অর্ডার ===== */
function orderMsg(o) {
  const L = ['*নতুন অর্ডার – ' + CONFIG.BRAND + '*', 'রেফারেন্স: ' + o.ref, 'নাম: ' + o.name, 'মোবাইল: ' + o.phone];
  if (o.email) L.push('ইমেইল: ' + o.email);
  if (o.addr) L.push('ঠিকানা: ' + o.addr);
  L.push('', '*সার্ভিস:*'); o.items.forEach(i => L.push(`- ${i.name} × ${i.qty} = ${i.price * i.qty} টাকা`));
  L.push('মোট: ' + o.total + ' টাকা (চূড়ান্ত দাম নিশ্চিত করা হবে)', '', 'চাহিদা: ' + o.req);
  if (o.size) L.push('সাইজ: ' + o.size); if (o.refImg) L.push('রেফারেন্স ছবি: ' + o.refImg); if (o.notes) L.push('নোট: ' + o.notes);
  return L.join('\n');
}
function openWA(o) { if (!waOK()) return toast('হোয়াটসঅ্যাপ নম্বর এখনো কনফিগার করা হয়নি (script.js → WHATSAPP_NUMBER)।', 'err'); window.open(waLink(orderMsg(o)), '_blank', 'noopener'); }
const phoneOK = p => /^(?:\+?88)?01[3-9]\d{8}$/.test(p.replace(/[\s-]/g, ''));
function checkout() {
  const it = cartItems(); if (!it.length) return toast('কার্ট খালি', 'err');
  drawer(false);
  $('#dlgBody').innerHTML = `<h3>চেকআউট</h3><form id="ckForm" novalidate>
  <label class="f">পুরো নাম *<input name="name" required><span class="err"></span></label>
  <label class="f">মোবাইল নম্বর * (যেমন 01XXXXXXXXX)<input name="phone" inputmode="tel" required><span class="err"></span></label>
  <label class="f">ইমেইল (ঐচ্ছিক)<input name="email" type="email"></label>
  <label class="f">ঠিকানা (ঐচ্ছিক – ডিজিটাল সার্ভিসে দরকার নেই)<input name="addr"></label>
  <label class="f">ডিজাইনের চাহিদা *<textarea name="req" rows="3" required></textarea><span class="err"></span></label>
  <label class="f">পছন্দের সাইজ<input name="size" placeholder="যেমন 1080×1080"></label>
  <label class="f">রেফারেন্স ছবির লিংক<input name="refImg" type="url"></label>
  <label class="f">অতিরিক্ত নোট<textarea name="notes" rows="2"></textarea></label>
  <h4>অর্ডার সারাংশ</h4>${it.map(i => `<div>${esc(i.p.name)} × ${bn(i.qty)} – ${tk(eff(i.p) * i.qty)}</div>`).join('')}<p><b>মোট: ${tk(cartTotal())}</b></p>
  <p class="note">চূড়ান্ত দাম, রিভিশন, ডেলিভারি সময় ও পেমেন্ট ব্যবস্থা কথা বলে নিশ্চিত করা হবে। ক্যাশ অন ডেলিভারি প্রযোজ্য নয়।</p>
  <button class="btn pri">অর্ডার সংরক্ষণ করুন</button><button type="button" class="btn ghost dark" data-dclose>বাতিল</button></form>`;
  $('#dlg').showModal();
  $('#ckForm').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target, d = Object.fromEntries(new FormData(f)); let bad = false;
    const set = (n, m) => { $('[name=' + n + ']', f).nextElementSibling.textContent = m; if (m) bad = true; };
    set('name', d.name.trim() ? '' : 'নাম লিখুন'); set('phone', phoneOK(d.phone) ? '' : 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন'); set('req', d.req.trim() ? '' : 'চাহিদা লিখুন');
    if (bad) return toast('ফর্মের ভুলগুলো ঠিক করুন', 'err');
    const o = {ref: 'AG-' + Date.now().toString(36).toUpperCase(), date: new Date().toISOString(), status: 'Pending', total: cartTotal(),
      items: cartItems().map(i => ({name: i.p.name, qty: i.qty, price: eff(i.p)})), ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v.trim()]))};
    S.orders.unshift(o); if (!save(K.o, S.orders)) return; S.cart = []; save(K.cart, S.cart); renderShop();
    $('#dlgBody').innerHTML = `<h3>✅ অর্ডার সংরক্ষিত হয়েছে</h3><p>রেফারেন্স: <b>${o.ref}</b> · মোট ${tk(o.total)}</p>
     <p class="note"><b>পরের ধাপ:</b> নিচের বাটনে হোয়াটসঅ্যাপ খুলে মেসেজটি নিজে "Send" করুন। পাঠানোর আগে পর্যন্ত আমরা অর্ডারটি পাইনি। এটি শুধু আপনার ব্রাউজারে সংরক্ষিত।</p>
     <button class="btn pri" id="waSend">হোয়াটসঅ্যাপে পাঠান</button><button class="btn ghost dark" data-dclose>বন্ধ করুন</button>`;
    $('#waSend').onclick = () => openWA(o);
  });
}

/* ===== বিস্তারিত ===== */
function detail(id) {
  const p = prod(id); if (!p) return;
  $('#dlgBody').innerHTML = `<img class="big" src="${esc(p.img || PH)}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src='${PH}'"><h3>${esc(p.name)}</h3><span class="cat">${esc(catName(p.cat))}</span>
   <p>${esc(p.desc || p.short)}</p><div class="price">${tk(eff(p))}${eff(p) < p.price ? `<s>${tk(p.price)}</s>` : ''}</div>${p.sample ? '<p class="note">নমুনা সার্ভিস ও নমুনা দাম।</p>' : ''}
   <button class="btn pri" data-add="${p.id}" data-dclose>কার্টে যোগ করুন</button><button class="btn ghost dark" data-dclose>বন্ধ</button>`;
  $('#dlg').showModal();
}

/* ===== অ্যাডমিন ===== */
let tab = 'dash', af = {q: '', cat: ''};
async function sha(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
async function gate() {
  if (sessionStorage.getItem('ag_ok')) return true;
  const saved = localStorage.getItem(K.pass), pw = prompt(saved ? 'অ্যাডমিন পাসকোড দিন:' : 'প্রথমবার: একটি নতুন পাসকোড ঠিক করুন (শুধু সুবিধার জন্য, প্রকৃত নিরাপত্তা নয়):');
  if (!pw) return false;
  try { const h = await sha(pw); if (!saved) localStorage.setItem(K.pass, h); else if (h !== saved) { toast('ভুল পাসকোড', 'err'); return false; } } catch { toast('এই ব্রাউজারে পাসকোড চেক সম্ভব নয় (HTTPS দরকার)', 'err'); return false; }
  sessionStorage.setItem('ag_ok', '1'); return true;
}
async function route() {
  const adm = location.hash === '#admin';
  if (adm && !(await gate())) { location.hash = '#shop'; return; }
  $('#shop').hidden = adm; $('#admin').hidden = !adm; if (adm) renderAdmin();
}
const download = (name, text, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], {type})); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); };
const csvCell = v => '"' + String(v ?? '').replace(/"/g, '""').replace(/^([=+\-@])/, "'$1") + '"';
function exportCSV() {
  const h = ['Ref', 'Date', 'Status', 'Name', 'Phone', 'Email', 'Items', 'Total', 'Requirements', 'Size', 'Notes'];
  const rows = S.orders.map(o => [o.ref, o.date, o.status, o.name, o.phone, o.email, o.items.map(i => `${i.name} x${i.qty}`).join('; '), o.total, o.req, o.size, o.notes]);
  download('orders.csv', '\ufeff' + [h, ...rows].map(r => r.map(csvCell).join(',')).join('\r\n'), 'text/csv');
}
function renderAdmin() {
  const A = $('#admin'), act = S.prods.filter(p => p.active).length;
  const tabs = [['dash', 'ড্যাশবোর্ড'], ['prods', 'সার্ভিস'], ['cats', 'ক্যাটেগরি'], ['orders', 'অর্ডার'], ['data', 'ডেটা ও ব্যাকআপ']];
  let body = '';
  if (tab === 'dash') body = `<div class="stats"><div class="stat"><b>${bn(S.prods.length)}</b>মোট সার্ভিস</div><div class="stat"><b>${bn(act)}</b>সক্রিয়</div><div class="stat"><b>${bn(S.prods.length - act)}</b>নিষ্ক্রিয়</div><div class="stat"><b>${bn(S.orders.length)}</b>স্থানীয় অর্ডার</div></div>
   <p class="note">এই তথ্য শুধু এই ব্রাউজারে আছে (localStorage)। অন্য ফোন/ব্রাউজারে দেখা যাবে না; ব্রাউজার ডেটা মুছলে হারাতে পারে। নিয়মিত ব্যাকআপ নিন।</p>`;
  if (tab === 'prods') {
    const l = S.prods.filter(p => (!af.cat || p.cat === af.cat) && p.name.toLowerCase().includes(af.q.toLowerCase()));
    body = `<p><button class="btn pri" data-pf="new">+ নতুন সার্ভিস</button> <input id="aq" placeholder="নামে খুঁজুন" value="${esc(af.q)}"> <select id="ac"><option value="">সব ক্যাটেগরি</option>${S.cats.map(c => `<option value="${c.id}" ${af.cat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></p>
    <div class="tw"><table><tr><th></th><th>নাম</th><th>ক্যাটেগরি</th><th>দাম</th><th>অবস্থা</th><th></th></tr>${l.map(p => `<tr><td><img src="${esc(p.img || PH)}" alt=""></td><td>${esc(p.name)}${p.feat ? ' ⭐' : ''}</td><td>${esc(catName(p.cat))}</td><td>${tk(eff(p))}</td><td>${p.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</td>
    <td><button class="btn sm dark" data-pf="${p.id}">এডিট</button><button class="btn sm red" data-pdel="${p.id}">ডিলিট</button></td></tr>`).join('') || '<tr><td colspan=6>কোনো সার্ভিস নেই</td></tr>'}</table></div>`;
  }
  if (tab === 'cats') body = `<p><button class="btn pri" data-cadd>+ নতুন ক্যাটেগরি</button></p><div class="tw"><table>${S.cats.map(c => `<tr><td>${esc(c.name)}</td><td>${bn(S.prods.filter(p => p.cat === c.id).length)} সার্ভিস</td><td><button class="btn sm dark" data-cren="${c.id}">নাম বদলান</button><button class="btn sm red" data-cdel="${c.id}">ডিলিট</button></td></tr>`).join('')}</table></div>`;
  if (tab === 'orders') body = `<p><button class="btn pri" id="csvBtn">CSV এক্সপোর্ট</button></p><div class="tw"><table><tr><th>রেফ</th><th>তারিখ</th><th>নাম</th><th>মোট</th><th>স্ট্যাটাস</th><th></th></tr>${S.orders.map(o => `<tr><td>${o.ref}</td><td>${new Date(o.date).toLocaleDateString('bn-BD')}</td><td>${esc(o.name)}</td><td>${tk(o.total)}</td>
   <td><select data-ost="${o.ref}">${STATUS.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td><td><button class="btn sm dark" data-ov="${o.ref}">বিস্তারিত</button><button class="btn sm red" data-odel="${o.ref}">ডিলিট</button></td></tr>`).join('') || '<tr><td colspan=6>এখনো কোনো অর্ডার নেই</td></tr>'}</table></div>`;
  if (tab === 'data') body = `<p class="note">ছবি বেশি আপলোড করলে ব্রাউজারের স্টোরেজ (প্রায় ৫MB) ভরে যেতে পারে; ছবির জন্য সম্ভব হলে URL ব্যবহার করুন।</p>
   <p><button class="btn pri" id="expJson">সার্ভিস JSON এক্সপোর্ট</button> <label class="btn ghost dark">JSON ইমপোর্ট<input type="file" id="impJson" accept=".json" hidden></label></p>
   <p><button class="btn dark" id="expAll">পূর্ণ ব্যাকআপ (সার্ভিস+ক্যাটেগরি+অর্ডার)</button> <label class="btn ghost dark">ব্যাকআপ রিস্টোর<input type="file" id="impAll" accept=".json" hidden></label></p>
   <p><button class="btn red" id="clearAll">সব ডেটা মুছুন</button> <button class="btn ghost dark" id="passReset">পাসকোড রিসেট</button></p>`;
  A.innerHTML = `<h2>অ্যাডমিন প্যানেল</h2><a href="#shop">← ওয়েবসাইটে ফিরুন</a><div class="ad-nav">${tabs.map(t => `<button data-tab="${t[0]}" class="${tab === t[0] ? 'on' : ''}">${t[1]}</button>`).join('')}</div>${body}`;
}
function prodForm(id) {
  const p = id === 'new' ? {name: '', cat: S.cats[0].id, price: '', disc: '', short: '', desc: '', img: '', feat: false, active: true} : prod(id); if (!p) return;
  $('#dlgBody').innerHTML = `<h3>${id === 'new' ? 'নতুন সার্ভিস' : 'সার্ভিস এডিট'}</h3><form id="pForm"><label class="f">নাম *<input name="name" value="${esc(p.name)}" required></label>
  <label class="f">ক্যাটেগরি<select name="cat">${S.cats.map(c => `<option value="${c.id}" ${c.id === p.cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
  <label class="f">দাম (৳) *<input name="price" type="number" min="0" value="${p.price}" required></label><label class="f">ছাড়ের দাম (ঐচ্ছিক)<input name="disc" type="number" min="0" value="${p.disc || ''}"></label>
  <label class="f">সংক্ষিপ্ত বিবরণ<input name="short" value="${esc(p.short)}"></label><label class="f">পূর্ণ বিবরণ<textarea name="desc" rows="3">${esc(p.desc)}</textarea></label>
  <label class="f">ছবির URL<input name="img" value="${p.img && !p.img.startsWith('data:') ? esc(p.img) : ''}"></label><label class="f">অথবা ছবি আপলোড<input type="file" id="pFile" accept="image/*"></label>
  <label><input type="checkbox" name="feat" ${p.feat ? 'checked' : ''}> ফিচার্ড</label> <label><input type="checkbox" name="active" ${p.active ? 'checked' : ''}> সক্রিয়</label><p><button class="btn pri">সংরক্ষণ</button><button type="button" class="btn ghost dark" data-dclose>বাতিল</button></p></form>`;
  $('#dlg').showModal(); let up = '';
  $('#pFile').onchange = e => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { const s = Math.min(1, 640 / im.width), c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); up = c.toDataURL('image/jpeg', .72); toast('ছবি প্রস্তুত'); }; im.onerror = () => toast('ছবি পড়া যায়নি', 'err'); im.src = URL.createObjectURL(f); };
  $('#pForm').onsubmit = e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); if (!d.name.trim() || !(+d.price >= 0) || d.price === '') return toast('নাম ও সঠিক দাম দিন', 'err');
    const n = {...p, name: d.name.trim(), cat: d.cat, price: +d.price, disc: +d.disc || 0, short: d.short, desc: d.desc, img: up || d.img.trim() || (p.img && p.img.startsWith('data:') ? p.img : ''), feat: !!d.feat, active: !!d.active};
    if (id === 'new') { n.id = uid('p'); n.created = new Date().toISOString(); S.prods.unshift(n); } else { n.sample = false; S.prods[S.prods.findIndex(x => x.id === id)] = n; }
    if (save(K.p, S.prods)) { $('#dlg').close(); renderShop(); renderAdmin(); toast('সংরক্ষিত'); }
  };
}
const readJSON = (file, cb) => { const r = new FileReader(); r.onload = () => { try { cb(JSON.parse(r.result)); } catch { toast('ফাইলটি সঠিক JSON নয়', 'err'); } }; r.readAsText(file); };

/* ===== ইভেন্ট ===== */
document.addEventListener('click', e => {
  const t = e.target.closest('button,img,a'); if (!t) return; const D = t.dataset;
  if (D.cat !== undefined) { S.cat = D.cat; renderShop(); }
  if (D.v) { S.view = D.v; renderShop(); }
  if (D.add) { addCart(D.add); }
  if (D.detail) detail(D.detail);
  if (D.q) { const i = S.cart.find(x => x.id === D.q); i.qty += +D.d; if (i.qty < 1) S.cart = S.cart.filter(x => x !== i); save(K.cart, S.cart); renderCart(); renderShop(); }
  if (D.rm) { S.cart = S.cart.filter(x => x.id !== D.rm); save(K.cart, S.cart); renderCart(); renderShop(); }
  if (t.id === 'checkoutBtn') checkout();
  if (t.id === 'cartBtn') drawer(true);
  if ('close' in D) drawer(false);
  if ('dclose' in D) $('#dlg').close();
  if (t.id === 'menuBtn') { const o = $('#nav').classList.toggle('open'); t.setAttribute('aria-expanded', o); }
  if (t.closest('#nav') && t.tagName === 'A') $('#nav').classList.remove('open');
  if (D.tab) { tab = D.tab; renderAdmin(); }
  if (D.pf) prodForm(D.pf);
  if (D.pdel && confirm('এই সার্ভিস ডিলিট করবেন? এটি ফেরানো যাবে না।')) { S.prods = S.prods.filter(p => p.id !== D.pdel); S.cart = S.cart.filter(c => c.id !== D.pdel); persist(); renderShop(); renderAdmin(); }
  if ('cadd' in D) { const n = prompt('নতুন ক্যাটেগরির নাম:'); if (n && n.trim()) { S.cats.push({id: uid('c'), name: n.trim()}); save(K.c, S.cats); renderAdmin(); renderShop(); } }
  if (D.cren) { const c = S.cats.find(x => x.id === D.cren), n = prompt('নতুন নাম:', c.name); if (n && n.trim()) { c.name = n.trim(); save(K.c, S.cats); renderAdmin(); renderShop(); } }
  if (D.cdel) { const used = S.prods.filter(p => p.cat === D.cdel).length; if (S.cats.length < 2) return toast('অন্তত একটি ক্যাটেগরি রাখতে হবে', 'err'); if (confirm(used ? `এই ক্যাটেগরিতে ${bn(used)}টি সার্ভিস আছে; সেগুলো "অন্যান্য" দেখাবে। তবু ডিলিট করবেন?` : 'ক্যাটেগরি ডিলিট করবেন?')) { S.cats = S.cats.filter(c => c.id !== D.cdel); if (S.cat === D.cdel) S.cat = ''; save(K.c, S.cats); renderAdmin(); renderShop(); } }
  if (D.ov) { const o = S.orders.find(x => x.ref === D.ov); $('#dlgBody').innerHTML = `<h3>${o.ref}</h3><pre style="white-space:pre-wrap;font:inherit">${esc(orderMsg(o))}</pre><button class="btn pri" id="owa">হোয়াটসঅ্যাপে খুলুন</button><button class="btn ghost dark" data-dclose>বন্ধ</button>`; $('#owa').onclick = () => openWA(o); $('#dlg').showModal(); }
  if (D.odel && confirm('এই অর্ডার ডিলিট করবেন?')) { S.orders = S.orders.filter(o => o.ref !== D.odel); save(K.o, S.orders); renderAdmin(); }
  if (t.id === 'csvBtn') exportCSV();
  if (t.id === 'expJson') download('services.json', JSON.stringify({products: S.prods}, null, 1), 'application/json');
  if (t.id === 'expAll') download('ahnaf-graphi-backup.json', JSON.stringify({products: S.prods, cats: S.cats, orders: S.orders, at: new Date().toISOString()}, null, 1), 'application/json');
  if (t.id === 'clearAll' && confirm('⚠ সব সার্ভিস, ক্যাটেগরি, কার্ট ও অর্ডার মুছে যাবে। আগে ব্যাকআপ নিয়েছেন? এগিয়ে যাবেন?')) { [K.p, K.c, K.cart, K.o].forEach(k => localStorage.removeItem(k)); location.reload(); }
  if (t.id === 'passReset' && confirm('পাসকোড মুছে নতুন করে সেট করতে হবে। চালিয়ে যাবেন?')) { localStorage.removeItem(K.pass); sessionStorage.removeItem('ag_ok'); toast('পাসকোড রিসেট হয়েছে'); }
  if (t.id === 'toTop') scrollTo({top: 0});
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'sort') { S.sort = t.value; renderShop(); }
  if (t.id === 'ac') { af.cat = t.value; renderAdmin(); }
  if (t.dataset.ost) { S.orders.find(o => o.ref === t.dataset.ost).status = t.value; save(K.o, S.orders); toast('স্ট্যাটাস আপডেট'); }
  if (t.id === 'impJson' && t.files[0]) readJSON(t.files[0], j => { const a = Array.isArray(j) ? j : j.products; if (!Array.isArray(a) || !a.every(p => p && p.name && isFinite(p.price))) return toast('JSON-এ সঠিক সার্ভিস তালিকা নেই', 'err'); if (!confirm(`${bn(a.length)}টি সার্ভিস ইমপোর্ট হবে এবং বর্তমান সার্ভিস প্রতিস্থাপিত হবে। চালিয়ে যাবেন?`)) return; S.prods = a.map(p => ({id: p.id || uid('p'), cat: S.cats[0].id, short: '', desc: '', img: '', feat: false, active: true, created: new Date().toISOString(), disc: 0, ...p})); save(K.p, S.prods); renderShop(); renderAdmin(); toast('ইমপোর্ট সম্পন্ন'); });
  if (t.id === 'impAll' && t.files[0]) readJSON(t.files[0], j => { if (!Array.isArray(j.products) || !Array.isArray(j.cats) || !Array.isArray(j.orders)) return toast('এটি সঠিক ব্যাকআপ ফাইল নয়', 'err'); if (!confirm('রিস্টোর করলে বর্তমান সব ডেটা প্রতিস্থাপিত হবে। চালিয়ে যাবেন?')) return; S.prods = j.products; S.cats = j.cats.length ? j.cats : seedCats(); S.orders = j.orders; persist(); renderShop(); renderAdmin(); toast('রিস্টোর সম্পন্ন'); });
});
document.addEventListener('input', e => { if (e.target.id === 'aq') { af.q = e.target.value; const p = e.target.selectionStart; renderAdmin(); const n = $('#aq'); n.focus(); n.setSelectionRange(p, p); } });
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); S.q = $('#q').value; renderShop(); $('#catalog').scrollIntoView(); });
$('#q').addEventListener('input', e => { S.q = e.target.value; renderShop(); });
addEventListener('scroll', () => { $('#toTop').hidden = scrollY < 500; });
addEventListener('hashchange', route);
document.addEventListener('keydown', e => { if (e.key === 'Escape') drawer(false); });
$('#yr').textContent = new Date().getFullYear();
const wa = $('#waText'), wf = $('#waFloat');
if (waOK()) { wa.textContent = '+' + CONFIG.WHATSAPP_NUMBER; wa.href = wf.href = 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER; } else { wa.textContent = '[হোয়াটসঅ্যাপ নম্বর কনফিগার করা হয়নি]'; wf.hidden = true; }
renderShop(); renderCart(); route();
