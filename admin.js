'use strict';
const $ = s => document.querySelector(s);
const saved = (() => { try { return JSON.parse(localStorage.getItem('ag_cfg')) || {}; } catch { return {}; } })();
const C = (window.AG_CONFIG && window.AG_CONFIG.SUPABASE_URL && window.AG_CONFIG.SUPABASE_KEY) ? window.AG_CONFIG : saved;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const msg = (t, e) => { const d = document.createElement('div'); d.className = 'm' + (e ? ' e' : ''); d.textContent = t; $('#msg').append(d); setTimeout(() => d.remove(), 4000); };
function badKey(k) {
  if (/^sb_secret_/.test(k)) return true;
  if (k.startsWith('eyJ')) { try { return JSON.parse(atob(k.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role === 'service_role'; } catch { return true; } }
  return !k.startsWith('sb_publishable_');
}
function setupView() {
  $('#app').innerHTML = `<form class="box" id="cf" style="max-width:520px;margin:30px auto"><h2>প্রথমবার সংযোগ</h2><p>Supabase → Project Settings → API থেকে দুটি মান পেস্ট করুন। (শুধু পাবলিক মান; <b>secret/service_role কী নয়</b>)</p>
  <label>Project URL<input name="u" placeholder="https://xxxx.supabase.co" required></label><label>Publishable key<input name="k" placeholder="sb_publishable_..." required></label><p class="err" id="ce"></p><button class="btn">সংরক্ষণ</button></form>`;
  $('#cf').onsubmit = e => { e.preventDefault(); const u = e.target.u.value.trim().replace(/\/$/, ''), k = e.target.k.value.trim();
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(u)) { $('#ce').textContent = 'URL সঠিক নয়। এটি https://xxxx.supabase.co ধরনের হতে হবে (GitHub লিংক নয়)।'; return; }
    if (badKey(k)) { $('#ce').textContent = 'এটি publishable key নয়। secret/service_role কী এখানে দেবেন না।'; return; }
    localStorage.setItem('ag_cfg', JSON.stringify({SUPABASE_URL: u, SUPABASE_KEY: k})); location.reload(); };
}
if (!C.SUPABASE_URL || !C.SUPABASE_KEY) { setupView(); throw new Error('setup needed'); }
const sb = supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY);
const STATUS = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const T = {
  projects: {label: 'পোর্টফোলিও', table: 'portfolio_projects', show: ['title_bn', 'category', 'published'], search: 'title_bn',
    f: [['title_bn', 'শিরোনাম (বাংলা) *', 'text', 1], ['title_en', 'Title (English)', 'text'], ['category', 'ক্যাটেগরি', 'text'], ['sort_order', 'ক্রম', 'number'], ['published', 'প্রকাশিত', 'bool'], ['image_path', 'ছবি (JPG/PNG/WebP, ৫MB পর্যন্ত)', 'img']]},
  services: {label: 'সার্ভিস', table: 'services', show: ['name_bn', 'price', 'published'], search: 'name_bn',
    f: [['name_bn', 'নাম (বাংলা) *', 'text', 1], ['name_en', 'Name (English)', 'text'], ['desc_bn', 'বিবরণ (বাংলা)', 'area'], ['desc_en', 'Description (English)', 'area'], ['price', 'দাম (৳)', 'number'], ['price_note', 'দামের নোট', 'text'], ['sort_order', 'ক্রম', 'number'], ['published', 'প্রকাশিত', 'bool']]}
};
let tab = 'projects', q = '', st = '';

async function boot() {
  const {data: {session}} = await sb.auth.getSession();
  if (!session) return loginView();
  const {data, error} = await sb.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle();
  if (error || !data) { await sb.auth.signOut(); loginView('এই অ্যাকাউন্টের অ্যাডমিন অনুমতি নেই।'); return; }
  $('#who').textContent = session.user.email; $('#out').hidden = false; render();
}
function loginView(err) {
  $('#out').hidden = true; $('#who').textContent = '';
  $('#app').innerHTML = `<form class="box" id="lf" style="max-width:380px;margin:40px auto"><h2>অ্যাডমিন লগইন</h2><label>ইমেইল<input name="e" type="email" required autocomplete="username"></label>
  <label>পাসওয়ার্ড<input name="p" type="password" required autocomplete="current-password"></label><p class="err">${esc(err || '')}</p><button class="btn">লগইন</button> <button type="button" class="btn sm" id="rc">সংযোগ বদলান</button></form>`;
  $('#rc').onclick = () => { localStorage.removeItem('ag_cfg'); location.reload(); };
  $('#lf').onsubmit = async ev => { ev.preventDefault(); const b = ev.target.querySelector('button'); b.disabled = true; b.textContent = 'অপেক্ষা করুন…';
    const {error} = await sb.auth.signInWithPassword({email: ev.target.e.value.trim(), password: ev.target.p.value});
    if (error) { loginView('ইমেইল বা পাসওয়ার্ড ভুল।'); return; } boot(); };
}
$('#out').onclick = async () => { await sb.auth.signOut(); loginView(); };
const guard = async r => { if (r.error) { if (r.status === 401 || /JWT|permission|row-level/i.test(r.error.message)) { msg('সেশন শেষ বা অনুমতি নেই। আবার লগইন করুন।', 1); await sb.auth.signOut(); loginView(); } else msg('ত্রুটি: ' + r.error.message, 1); return false; } return true; };

const nav = () => `<nav>${[...Object.entries(T).map(([k, v]) => [k, v.label]), ['orders', 'অর্ডার'], ['settings', 'সেটিংস']].map(([k, l]) => `<button class="btn ${tab === k ? 'on' : ''}" data-t="${k}">${l}</button>`).join('')}</nav>`;
async function render() {
  $('#app').innerHTML = nav() + '<div id="body" class="box">লোড হচ্ছে…</div>';
  $('#app').querySelectorAll('[data-t]').forEach(b => b.onclick = () => { tab = b.dataset.t; q = ''; st = ''; render(); });
  $('#body').outerHTML = `<div id="body">${tab === 'orders' ? await ordersView() : tab === 'settings' ? await settingsView() : await listView(T[tab])}</div>`; bind();
}
async function listView(c) {
  const r = await sb.from(c.table).select('*').order('created_at', {ascending: false}); if (!(await guard(r))) return '<div class="box err">লোড করা যায়নি</div>';
  const rows = r.data.filter(x => String(x[c.search] || '').toLowerCase().includes(q.toLowerCase()));
  return `<p><button class="btn gold" data-new>+ নতুন</button> <input id="q" placeholder="খুঁজুন" value="${esc(q)}"></p><div class="tw"><table><tr>${c.show.map(k => `<th>${k}</th>`).join('')}<th></th></tr>
  ${rows.map(x => `<tr>${c.show.map(k => `<td>${k === 'published' ? (x[k] ? '✅ প্রকাশিত' : '⏸ খসড়া') : esc(x[k])}</td>`).join('')}<td><button class="btn sm" data-edit="${x.id}">এডিট</button> <button class="btn sm gold" data-pub="${x.id}">${x.published ? 'আনপাবলিশ' : 'পাবলিশ'}</button> <button class="btn sm red" data-del="${x.id}">ডিলিট</button></td></tr>`).join('') || '<tr><td colspan="9">কিছু নেই।</td></tr>'}</table></div>`;
}
async function ordersView() {
  const r = await sb.from('orders').select('*').order('created_at', {ascending: false}); if (!(await guard(r))) return '<div class="box err">লোড করা যায়নি</div>';
  const rows = r.data.filter(o => (!st || o.status === st) && (o.name + o.contact).toLowerCase().includes(q.toLowerCase()));
  return `<p><input id="q" placeholder="নাম/যোগাযোগ" value="${esc(q)}"> <select id="stf"><option value="">সব স্ট্যাটাস</option>${STATUS.map(s => `<option ${st === s ? 'selected' : ''}>${s}</option>`).join('')}</select></p>
  <div class="tw"><table><tr><th>তারিখ</th><th>নাম</th><th>যোগাযোগ</th><th>সার্ভিস</th><th>স্ট্যাটাস</th><th></th></tr>${rows.map(o => `<tr><td>${new Date(o.created_at).toLocaleDateString('bn-BD')}</td><td>${esc(o.name)}</td><td>${esc(o.contact)}</td><td>${esc(o.service_name)}</td>
  <td><select data-os="${o.id}">${STATUS.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td><td><button class="btn sm" data-ov="${o.id}">বিস্তারিত</button> <button class="btn sm red" data-od="${o.id}">ডিলিট</button></td></tr>`).join('') || '<tr><td colspan="6">কোনো অর্ডার নেই।</td></tr>'}</table></div>`;
}
async function settingsView() {
  const r = await sb.from('site_settings').select('*').order('key'); if (!(await guard(r))) return '<div class="box err">লোড করা যায়নি</div>';
  window.__settings = Object.fromEntries(r.data.map(s => [s.key, s]));
  return `<p class="box">উদাহরণ কী: <code>whatsapp_number</code> (৮৮০… ফরম্যাট), <code>contact_phone</code>, <code>contact_email</code>, <code>hero_title_bn</code>, <code>hero_title_en</code>। "পাবলিক" টিক দিলে তবেই সাইটে দেখা যাবে।</p><p><button class="btn gold" data-sn>+ সেটিং</button></p>
  <div class="tw"><table><tr><th>কী</th><th>মান</th><th>পাবলিক</th><th></th></tr>${r.data.map(s => `<tr><td>${esc(s.key)}</td><td>${esc(typeof s.value === 'string' ? s.value : JSON.stringify(s.value))}</td><td>${s.is_public ? 'হ্যাঁ' : 'না'}</td><td><button class="btn sm" data-se="${esc(s.key)}">এডিট</button> <button class="btn sm red" data-sd="${esc(s.key)}">ডিলিট</button></td></tr>`).join('') || '<tr><td colspan="4">কিছু নেই</td></tr>'}</table></div>`;
}
function dlg(h) { const d = $('#dlg'); d.innerHTML = `<div style="padding:16px">${h}</div>`; d.querySelectorAll('[data-x]').forEach(b => b.onclick = () => d.close()); d.showModal(); return d; }
function bind() {
  const c = T[tab], A = $('#app'), on = (sel, fn) => A.querySelectorAll(sel).forEach(e => e.onclick = () => fn(e));
  const qi = $('#q'); if (qi) qi.oninput = () => { q = qi.value; clearTimeout(bind.t); bind.t = setTimeout(async () => { await render(); const n = $('#q'); if (n) { n.focus(); n.setSelectionRange(q.length, q.length); } }, 300); };
  const sf = $('#stf'); if (sf) sf.onchange = () => { st = sf.value; render(); };
  if (c) {
    on('[data-new]', () => form(c, null));
    on('[data-edit]', async e => { const r = await sb.from(c.table).select('*').eq('id', e.dataset.edit).single(); if (await guard(r)) form(c, r.data); });
    on('[data-pub]', async e => { const r0 = await sb.from(c.table).select('published').eq('id', e.dataset.pub).single(); if (!(await guard(r0))) return; if (await guard(await sb.from(c.table).update({published: !r0.data.published}).eq('id', e.dataset.pub))) { msg('আপডেট হয়েছে'); render(); } });
    on('[data-del]', async e => { if (!confirm('ডিলিট করবেন? এটি ফেরানো যাবে না।')) return; const id = e.dataset.del;
      if (c.table === 'portfolio_projects') { const r = await sb.from(c.table).select('image_path').eq('id', id).single(); if (r.data?.image_path) await sb.storage.from('portfolio').remove([r.data.image_path]); }
      if (await guard(await sb.from(c.table).delete().eq('id', id))) { msg('ডিলিট হয়েছে'); render(); } });
  }
  A.querySelectorAll('[data-os]').forEach(s => s.onchange = async () => { if (await guard(await sb.from('orders').update({status: s.value}).eq('id', s.dataset.os))) msg('স্ট্যাটাস আপডেট হয়েছে'); });
  on('[data-od]', async e => { if (confirm('অর্ডার ডিলিট করবেন?') && await guard(await sb.from('orders').delete().eq('id', e.dataset.od))) { msg('ডিলিট হয়েছে'); render(); } });
  on('[data-ov]', async e => { const r = await sb.from('orders').select('*').eq('id', e.dataset.ov).single(); if (!(await guard(r))) return; const o = r.data;
    dlg(`<h3>অর্ডার</h3>${['name', 'contact', 'service_name', 'requirements', 'deadline', 'reference_url', 'status', 'created_at'].map(k => `<p><b>${k}:</b> ${esc(o[k])}</p>`).join('')}<button class="btn" data-x>বন্ধ</button>`); });
  on('[data-sn]', () => sform(null)); on('[data-se]', e => sform(window.__settings[e.dataset.se]));
  on('[data-sd]', async e => { if (confirm('সেটিং ডিলিট করবেন?') && await guard(await sb.from('site_settings').delete().eq('key', e.dataset.sd))) { msg('ডিলিট হয়েছে'); render(); } });
}
function form(c, row) {
  const d = dlg(`<h3>${row ? 'এডিট' : 'নতুন'}: ${c.label}</h3><form id="ef">${c.f.map(([k, l, t, req]) => {
    const v = row ? row[k] : ''; if (t === 'bool') return `<label><input type="checkbox" name="${k}" ${v ? 'checked' : ''}> ${l}</label>`;
    if (t === 'area') return `<label>${l}<textarea name="${k}" rows="3" maxlength="1000">${esc(v)}</textarea></label>`;
    if (t === 'img') return `<label>${l}<input type="file" name="__file" accept="image/jpeg,image/png,image/webp">${v ? `<small>বর্তমান: ${esc(v)}</small>` : ''}</label>`;
    return `<label>${l}<input name="${k}" type="${t}" value="${esc(v)}" ${req ? 'required' : ''} ${t === 'number' ? 'step="any" min="0"' : 'maxlength="120"'}></label>`; }).join('')}
  <button class="btn gold">সংরক্ষণ</button> <button type="button" class="btn" data-x>বাতিল</button></form>`);
  $('#ef').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, b = f.querySelector('.gold'), reset = () => { b.disabled = false; b.textContent = 'সংরক্ষণ'; };
    b.disabled = true; b.textContent = 'সংরক্ষণ হচ্ছে…';
    const p = {}; c.f.forEach(([k, , t]) => { if (t === 'img') return; const el = f.elements[k]; p[k] = t === 'bool' ? el.checked : t === 'number' ? (el.value === '' ? null : Number(el.value)) : (el.value.trim() || null); });
    if ('sort_order' in p && p.sort_order == null) p.sort_order = 0;
    const file = f.elements.__file && f.elements.__file.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { msg('শুধু JPG/PNG/WebP চলবে', 1); reset(); return; }
      if (file.size > 5 * 1024 * 1024) { msg('ছবি ৫MB-এর বেশি', 1); reset(); return; }
      const ext = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}[file.type], path = `projects/${crypto.randomUUID()}.${ext}`;
      const u = await sb.storage.from('portfolio').upload(path, file, {contentType: file.type});
      if (u.error) { msg('আপলোড ব্যর্থ: ' + u.error.message, 1); reset(); return; }
      if (row && row.image_path) await sb.storage.from('portfolio').remove([row.image_path]);
      p.image_path = path;
    }
    const r = row ? await sb.from(c.table).update(p).eq('id', row.id) : await sb.from(c.table).insert(p);
    if (await guard(r)) { msg('সংরক্ষিত হয়েছে'); d.close(); render(); } else reset();
  };
}
function sform(row) {
  const d = dlg(`<h3>সেটিং</h3><form id="sf"><label>কী (ছোট হাতের ইংরেজি, সংখ্যা, _ - .)<input name="key" required pattern="[a-z0-9_.\\-]{1,60}" value="${esc(row?.key)}" ${row ? 'readonly' : ''}></label>
  <label>মান<input name="value" required value="${esc(row ? (typeof row.value === 'string' ? row.value : JSON.stringify(row.value)) : '')}"></label><label><input type="checkbox" name="pub" ${row?.is_public ? 'checked' : ''}> পাবলিক (সাইটে দেখা যাবে)</label>
  <button class="btn gold">সংরক্ষণ</button> <button type="button" class="btn" data-x>বাতিল</button></form>`);
  $('#sf').onsubmit = async ev => { ev.preventDefault(); const f = ev.target;
    if (await guard(await sb.from('site_settings').upsert({key: f.key.value.trim(), value: f.value.value.trim(), is_public: f.pub.checked}))) { msg('সংরক্ষিত হয়েছে'); d.close(); render(); } };
}
boot();
