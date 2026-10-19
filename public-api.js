// আপনার পাবলিক সাইটে config.js ও supabase-js-এর পরে এটি যোগ করুন।
(function () {
  const C = window.AG_CONFIG || {};
  const ok = () => C.SUPABASE_URL && C.SUPABASE_KEY;
  const sb = ok() ? supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY) : null;
  const imgUrl = p => p ? `${C.SUPABASE_URL}/storage/v1/object/public/portfolio/${p}` : '';
  window.AGApi = {
    configured: ok,
    async services() { const {data, error} = await sb.from('services').select('*').order('sort_order'); if (error) throw error; return data; },
    async portfolio() { const {data, error} = await sb.from('portfolio_projects').select('*').order('sort_order'); if (error) throw error; return data.map(p => ({...p, image_url: imgUrl(p.image_path)})); },
    async settings() { const {data, error} = await sb.from('site_settings').select('key,value'); if (error) throw error; return Object.fromEntries(data.map(r => [r.key, r.value])); },
    async submitOrder(o) {
      const r = await fetch(`${C.SUPABASE_URL}/functions/v1/submit-order`, {method: 'POST', headers: {'Content-Type': 'application/json', apikey: C.SUPABASE_KEY}, body: JSON.stringify(o)});
      const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'অর্ডার জমা হয়নি'); return j; // শুধু ok:true হলেই "সংরক্ষিত" বলবেন
    }
  };
})();
