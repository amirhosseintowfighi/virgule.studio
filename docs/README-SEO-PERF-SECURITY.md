# ویرگول — مرحله ۷: سئو + عملکرد + امنیت

## 🔍 سئو (SEO)
- **`sitemap.ts`** — نقشه‌ی سایت پویا (صفحات ثابت + مقالات + خدمات + نمونه‌کارها).
- **`robots.ts`** — مسدود‌کردن `/dashboard`، `/api`، `/login` + معرفی sitemap.
- **`manifest.ts`** — PWA manifest با رنگ برند و RTL.
- **`opengraph-image.tsx`** — تصویر OG پویا (Edge Runtime).
- **`lib/seo.ts`** — `buildMetadata()` یکپارچه (canonical، OpenGraph، Twitter، robots) + JSON-LD سازمان.

## ⚡ عملکرد (Performance)
- **`next.config.ts`**: فرمت تصویر AVIF/WebP، فشرده‌سازی، `optimizePackageImports`.
- **`LazyImage`**: lazy-loading، ابعاد پاسخگو (`sizes`)، کیفیت بهینه.
- **فونت**: `next/font` با `display: swap` (بدون CLS).
- **RSC**: صفحات سروری به صورت پیش‌فرض + کمینه client component.

## 🔒 امنیت (Security)
- **هدرهای امنیتی سراسری** در `next.config.ts`: HSTS، CSP، X-Frame-Options، X-Content-Type-Options، Referrer-Policy، Permissions-Policy.
- **CSRF** (`lib/csrf.ts`): الگوی double-submit با مقایسه‌ی timing-safe.
- **مکمل لایه‌های مرحله ۴**: Rate Limit، Zod، Honeypot، Sanitization، bcrypt، JWT.

## ✅ چک‌لیست Lighthouse (هدف ۱۰۰)
- تصاویر بهینه و ابعاد مشخص (بدون CLS)
- فونت با swap
- متادیتای کامل و canonical
- دسترس‌پذیری (aria، کنتراست، focus)
- HTTPS و هدرهای امنیتی

> توجه: نمره‌ی واقعی Lighthouse پس از اجرای `next build && next start` روی سرور واقعی قابل اندازه‌گیری است.
