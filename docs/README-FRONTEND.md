# ویرگول — مرحله ۵: Frontend (صفحات عمومی)

لایه‌ی نمایشی سایت با **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind** و زبان طراحی **Material 3**.

## ویژگی‌ها
- **RTL کامل** + فونت وزیرمتن (فارسی) و Inter (لاتین/اعداد)
- **حالت روشن/تاریک** با ذخیره‌سازی و تشخیص ترجیح سیستم
- **توکن‌های طراحی** (رنگ، فاصله، گردی، Elevation، Motion) به صورت CSS Variables
- **SEO**: Metadata API، OpenGraph، JSON-LD (Schema)، breadcrumb
- **دسترس‌پذیری**: focus-visible، aria، prefers-reduced-motion

## صفحات پیاده‌شده

```
/                     → خانه (Hero + خدمات + فرآیند + FAQ + CTA)
/services             → لیست خدمات (از دیتابیس)
/services/[slug]      → جزئیات خدمت
/portfolio            → گالری نمونه‌کارها
/blog                 → لیست مقالات + جستجو + صفحه‌بندی
/blog/[slug]          → صفحه‌ی مقاله (breadcrumb + زمان مطالعه + مرتبط + JSON-LD)
/pricing              → پلن‌های قیمت
/about                → درباره ما
/contact              → فرم تماس (متصل به Server Action + Honeypot)
/faq                  → سوالات متداول (آکاردئون)
not-found             → صفحه‌ی ۴۰۴
```

## ساختار

```
src/
├─ app/
│  ├─ layout.tsx              # لایه ریشه (RTL، فونت، ThemeProvider، Metadata)
│  ├─ not-found.tsx
│  └─ (marketing)/            # گروه مسیر صفحات عمومی
│     ├─ layout.tsx           # Navbar + Footer
│     ├─ page.tsx             # خانه
│     ├─ services / [slug]
│     ├─ portfolio
│     ├─ blog / [slug]
│     ├─ pricing / about / contact / faq
├─ components/
│  ├─ providers/theme-provider.tsx
│  ├─ ui/ (button, card, container/section)
│  └─ marketing/ (navbar, footer, faq-accordion, contact-form)
├─ styles/ (tokens.css, globals.css)
└─ lib/fonts.ts
```

## اجرا

```bash
npm install
npx prisma generate
npm run dev
```

> صفحات `services`، `portfolio`، `blog`، `pricing` و `faq` داده‌ها را از دیتابیس (مرحله ۳) می‌خوانند؛ ابتدا `prisma migrate` و `seed` را اجرا کنید.
