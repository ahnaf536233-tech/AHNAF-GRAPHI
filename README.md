# AHNAF GRAPHI – সুরক্ষিত অ্যাডমিন প্যানেল + Supabase (সেটআপ গাইড)

> ⚠ এই প্যাকেজ আপনার **বিদ্যমান সাইটের ফাইল ছাড়াই** বানানো হয়েছে (ফাইল আমি পাইনি)। তাই আপনার `index.html`, `style.css`, `script.js` এতে নেই এবং বদলানো হয়নি। এই ফোল্ডারের ফাইলগুলো আপনার রিপোজিটরিতে **যোগ** করতে হবে। পাবলিক সাইটকে Supabase-এর সাথে জোড়ার কাজ (ধাপ ৯) আপনার ফাইল দেখার পর করা হবে।

## ফোল্ডার কাঠামো
```
config.js                      ← Project URL ও publishable key (শুধু পাবলিক তথ্য)
public-api.js                  ← পাবলিক সাইটের জন্য: সার্ভিস/পোর্টফোলিও পড়া, অর্ডার জমা
admin/index.html, admin/admin.js   ← অ্যাডমিন প্যানেল (/admin/)
supabase/migrations/001_initial_schema.sql   ← টেবিল, RLS, স্টোরেজ নিয়ম
supabase/functions/submit-order/index.ts     ← অর্ডার জমার Edge Function
.gitignore, .env.example
```

## ধাপ ১: Supabase থেকে URL ও Key নিন
Supabase ড্যাশবোর্ড → আপনার প্রজেক্ট → **Project Settings → API**। সেখান থেকে **Project URL** ও **publishable (anon) key** কপি করে `config.js`-এ বসান।
**`service_role` বা `secret` কী কখনো `config.js`, GitHub বা চ্যাটে দেবেন না।**

## ধাপ ২: SQL চালান
1. Supabase → **SQL Editor → New query**।
2. `supabase/migrations/001_initial_schema.sql`-এর লেখা পড়ে দেখুন (কোনো DROP/DELETE নেই), তারপর পুরোটা পেস্ট করে **Run** চাপুন।
3. আগে থেকে আপনার প্রজেক্টে একই নামের টেবিল থাকলে চালানোর আগে আমাকে জানান।

## ধাপ ৩: প্রথম অ্যাডমিন বানান (নিরাপদ পদ্ধতি)
1. **Authentication → Providers → Email**-এ **"Allow new users to sign up" বন্ধ** করুন (যাতে কেউ নিজে রেজিস্টার করতে না পারে)।
2. **Authentication → Users → Add user → Create new user**: আপনার ইমেইল ও শক্তিশালী পাসওয়ার্ড দিন, "Auto Confirm User" টিক দিন।
3. **SQL Editor**-এ নিচেরটা চালান (আপনার ইমেইল বসিয়ে):
```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'আপনার-ইমেইল@example.com';
```
শুধু এই তালিকার ব্যবহারকারী অ্যাডমিন। ব্রাউজার থেকে এই তালিকায় লেখার কোনো উপায় নেই; প্রথম রেজিস্টার হওয়া কেউ স্বয়ংক্রিয়ভাবে অ্যাডমিন হয় না।

## ধাপ ৪: Auth URL কনফিগারেশন
**Authentication → URL Configuration**:
- Site URL: `https://USERNAME.github.io/REPOSITORY/`
- Redirect URLs-এ যোগ করুন: `https://USERNAME.github.io/REPOSITORY/admin/`

## ধাপ ৫: অর্ডারের Edge Function ডেপ্লয়
GitHub Pages-এ সার্ভার কোড চলে না, তাই অর্ডার Supabase Edge Function দিয়ে জমা হয়।
1. Supabase → **Edge Functions → Deploy a new function (Via Editor)**, নাম ঠিক `submit-order`, `index.ts`-এর কোড পেস্ট করে Deploy করুন।
2. ফাংশনের সেটিংসে **"Verify JWT" বন্ধ** করুন (নতুন publishable key JWT নয়; যাচাই ফাংশনের ভেতরেই হয়)।
3. **Edge Functions → Secrets**-এ যোগ করুন: `ALLOWED_ORIGINS` = `https://USERNAME.github.io` (শুধু আপনার সাইটের origin)। `SUPABASE_URL` ও `SUPABASE_SERVICE_ROLE_KEY` Supabase নিজেই ফাংশনে দেয়; কিছু করতে হবে না।
(CLI পছন্দ হলে: `supabase functions deploy submit-order --no-verify-jwt`)

## ধাপ ৬: GitHub-এ আপলোড
রিপোজিটরি → **Add file → Upload files** → এই ফোল্ডারের সব ফাইল (`admin` ও `supabase` ফোল্ডারসহ) টেনে ছাড়ুন → **Commit changes**। আপনার পুরনো `index.html`, `style.css`, `script.js` আপাতত যেমন আছে থাকুক। ভুলে আপলোড হওয়া ZIP বা `SS` ফাইল রিপোজিটরি থেকে মুছে দিন।
GitHub Pages: **Settings → Pages → Deploy from a branch → main / root**। অ্যাডমিন লিংক: `https://USERNAME.github.io/REPOSITORY/admin/`

## ধাপ ৭: ব্যবহার
`/admin/`-এ লগইন → পোর্টফোলিও (ছবি আপলোডসহ), সার্ভিস, অর্ডার (স্ট্যাটাস বদল), সেটিংস। নতুন আইটেম **খসড়া** থাকে; "পাবলিশ" চাপলে তবেই পাবলিক সাইটে দেখা যায়। ডিলিটে নিশ্চিতকরণ চায়।

## ধাপ ৮: পাবলিক সাইটে জোড়া (আপনার ফাইল পেলে করব)
`index.html`-এ `supabase-js` CDN, `config.js` ও `public-api.js` যোগ করে `AGApi.services()`, `AGApi.portfolio()`, `AGApi.settings()`, `AGApi.submitOrder({...})` ব্যবহার করতে হবে। অর্ডার ফর্মের `honeypot` ফিল্ড `website` (লুকানো, ফাঁকা)। শুধু `submitOrder` সফল (`ok:true`) হলেই "অর্ডার সংরক্ষিত" দেখাবেন; হোয়াটসঅ্যাপ লিংক আলাদা অপশন, সংরক্ষণের প্রমাণ নয়।

## নিরাপত্তা যেভাবে কাজ করে
- লগইন: Supabase Auth; পাসওয়ার্ড কোথাও সংরক্ষিত নয়।
- প্রতিটি টেবিলে RLS চালু। অ্যাডমিন চেক সার্ভারে `is_admin()` (লগইন করা ব্যবহারকারীর আসল ID দিয়ে); ব্রাউজারের কোনো ভেরিয়েবলের ওপর নির্ভর নয়।
- পাবলিক শুধু **প্রকাশিত** সার্ভিস/প্রজেক্ট ও `is_public` সেটিং পড়তে পারে। `orders` টেবিলে anonymous-এর কোনো অ্যাক্সেস নেই; অর্ডার শুধু Edge Function (সার্ভার-সাইড যাচাই ও রেট-লিমিটসহ) লিখতে পারে।
- স্টোরেজ বাকেট `portfolio`: ছবি সবাই দেখতে পারে, আপলোড/বদল/ডিলিট শুধু অ্যাডমিন; শুধু JPG/PNG/WebP, সর্বোচ্চ ৫MB।
- ক্লায়েন্ট কোডে service-role/secret কী নেই। (publishable key পাবলিক হতে পারে, কারণ নিরাপত্তা RLS-এ।)

## সমস্যা সমাধান
- **"এই অ্যাকাউন্টের অ্যাডমিন অনুমতি নেই"**: ধাপ ৩-এর SQL চালানো হয়নি বা ইমেইল মেলেনি।
- **লগইন হয় না**: Auth-এ ব্যবহারকারী "confirmed" কিনা দেখুন; ইমেইল/পাসওয়ার্ড মিলিয়ে নিন।
- **config.js-এ বসানো হয়নি বার্তা**: ধাপ ১ করুন।
- **সার্ভিস/ছবি পাবলিক সাইটে আসে না**: আইটেম "পাবলিশ" করেছেন কিনা দেখুন।
- **অর্ডার জমায় 403**: `ALLOWED_ORIGINS` ঠিক origin (পাথ ছাড়া, শেষে `/` ছাড়া) কিনা দেখুন।
- **অর্ডার জমায় 401**: Edge Function-এ "Verify JWT" বন্ধ করুন।
- **আপলোড ব্যর্থ**: ফাইল ৫MB-এর কম ও JPG/PNG/WebP কিনা এবং SQL-এর স্টোরেজ অংশ চলেছে কিনা দেখুন।
- **সাইট আপডেট হয় না**: কয়েক মিনিট অপেক্ষা করে `Ctrl+F5`।
