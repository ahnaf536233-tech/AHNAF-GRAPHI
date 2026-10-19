# AHNAF GRAPHI Website

A bilingual (English / Bangla) static website for a graphic design business. Plain HTML, CSS and JavaScript. No build tools, no paid libraries, no external APIs.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and SEO metadata |
| `style.css` | Design (brand colours are variables at the top) |
| `script.js` | Settings, English/Bangla text, gallery filters, pricing, order form, WhatsApp |
| `README.md` | This guide |

## 1. Change your settings (top of `script.js`)

```js
const CONFIG = {
  WHATSAPP_NUMBER: "8801890042863",   // <-- your number
  EMAIL: "hello@example.com",
  LOCATION: { en: "Bangladesh", bn: "বাংলাদেশ" },
  CURRENCY: "৳"
};
```

- **WhatsApp number:** country code plus number, digits only. No `+`, spaces or dashes. Example: `8801712345678`.
- Until you set a real number, the WhatsApp buttons still open WhatsApp, but you must pick the recipient yourself.

### Edit prices

Change the `amount` values in the `PRICES` array in `script.js`.

### Replace portfolio images

1. Create a folder named `images` next to `index.html`.
2. Add your designs (JPG, PNG or WebP, around 800x600 px, under 200 KB each for fast loading).
3. In the `PORTFOLIO` array, set `img: "images/your-file.jpg"`. Leave it as `""` to keep the placeholder.
4. Add or remove entries freely. Valid `cat` values: `logo`, `banner`, `poster`, `social`, `book`, `nikah`, `islamic`.

### Edit text

All visible text, in both languages, is in the `T` object in `script.js` (`en` and `bn`). Edit both versions together.

### SEO

In `index.html`, replace `https://YOUR-USERNAME.github.io/YOUR-REPO/` (appears in `canonical` and `og:url`) with your real site address once you know it.

## 2. What needs a backend (not included)

This is a static site. It has **no server and no database**.

- The order form **does not save or send orders by itself.** It checks the fields, builds a message and opens WhatsApp. The customer must press Send in WhatsApp.
- Not available without a backend or third-party service: storing orders, order history, email notifications, file uploads from customers, online payments, a login or admin panel.
- "Editable prices" means you edit `script.js`. There is no admin page.
- The language choice is remembered in the visitor's own browser only.

## 3. Test on your computer

1. Put all four files in one folder (for example `ahnaf-graphi`).
2. Double-click `index.html` to open it in your browser.
3. Check:
   - Every menu link scrolls to its section; the menu button works on a narrow window.
   - The language button switches the whole page between English and Bangla.
   - The portfolio filters show and hide items.
   - "Order this" on a price card pre-selects the service in the form.
   - Submit the empty form: errors appear. Fill it in correctly: WhatsApp opens with your message.
   - Resize the window, or use browser device mode (F12), to test tablet and mobile widths.
   - Press Tab to confirm keyboard focus is visible.
4. Optional: for a Lighthouse check, open Chrome DevTools > Lighthouse.

## 4. Publish free with GitHub Pages

1. Create a free account at github.com.
2. Click **New repository**. Name it, for example, `ahnaf-graphi`. Choose **Public**. Click **Create repository**.
3. Click **uploading an existing file**. Drag in `index.html`, `style.css`, `script.js`, `README.md` (and your `images` folder). Click **Commit changes**.
4. Go to **Settings > Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**. Choose branch **main** and folder **/ (root)**. Click **Save**.
6. Wait one to two minutes. Your site appears at `https://YOUR-USERNAME.github.io/ahnaf-graphi/`.
7. Update the canonical and `og:url` addresses in `index.html` (see SEO above), then commit again.

To update later, open a file on GitHub, click the pencil icon, edit and commit. The site refreshes in a minute or two.

A custom domain is optional and costs money to register. GitHub Pages hosting itself is free.

## Notes

- Quran verses: use verified Arabic text from a trusted source and double-check it before design and printing.
- Fonts use the visitor's system fonts for speed. Bangla and Arabic display well on modern phones and computers.
