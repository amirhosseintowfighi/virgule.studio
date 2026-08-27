# ویرگول (Virgule) — وب‌سایت شرکتی

> **ویرگول؛ مکثی که دیده می‌شود.**

وب‌سایت شرکتی حرفه‌ای استودیوی طراحی و توسعه‌ی وب ویرگول، ساخته‌شده با Next.js 15 و طراحی Material Design 3.

---

## 🧱 پشته‌ی فناوری

| لایه | فناوری |
|------|---------|
| Frontend | Next.js 15 (App Router)، React 19، TypeScript، Tailwind CSS، MUI، Framer Motion |
| Backend | Server Actions، Route Handlers، Prisma ORM |
| Database | PostgreSQL 16 |
| Auth | JWT (jose)، bcrypt، RBAC نقش‌محور |
| فرم | React Hook Form + Zod |
| رسانه | Cloudinary |
| دیپلوی | Docker، Docker Compose، Nginx، HTTPS |
| تست | Vitest (unit)، Playwright (E2E) |

---

## 🚀 راه‌اندازی سریع (توسعه)

```bash
# ۱. کلون و نصب وابستگی‌ها
npm install

# ۲. تنظیم متغیرهای محیطی
cp .env.example .env
# مقادیر را ویرایش کنید

# ۳. راه‌اندازی دیتابیس و داده‌ی اولیه
npx prisma migrate dev
npx prisma db seed

# ۴. اجرا
npm run dev
```

سایت روی `http://localhost:3000` و پنل مدیریت روی `/dashboard` در دسترس است.

**ورود پیش‌فرض ادمین:** `info@virgule.studio` / `Virgule@1404`

---

## 🐳 دیپلوی با Docker

```bash
# تنظیم متغیرها
cp .env.example .env

# قراردادن گواهی SSL در nginx/certs/ (fullchain.pem, privkey.pem)

# بیلد و اجرا
docker compose up -d --build

# اجرای migration و seed
docker compose exec web npx prisma migrate deploy
docker compose exec web npx prisma db seed
```

ساختار: `nginx` (پورت 80/443) ← `web` (Next.js standalone) ← `db` (PostgreSQL).

> یادآوری: در `next.config.ts` گزینه‌ی `output: "standalone"` را برای خروجی Docker فعال کنید.

---

## 🧪 تست

```bash
npm run test         # تست‌های واحد (Vitest)
npm run test:e2e     # تست‌های E2E (Playwright)
npm run lint         # ESLint
npx tsc --noEmit     # بررسی تایپ
```

CI خودکار در `.github/workflows/ci.yml`: lint → type-check → test → build.

---

## 📁 ساختار پروژه

```
src/
├─ app/
│  ├─ (marketing)/       # صفحات عمومی (خانه، خدمات، بلاگ، ...)
│  ├─ (auth)/            # ورود
│  ├─ (dashboard)/       # پنل مدیریت
│  ├─ api/               # Route Handlers
│  ├─ sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx
├─ components/           # ui / marketing / admin / perf
├─ lib/                  # auth, rbac, validators, seo, csrf, prisma, ...
├─ server/actions/       # Server Actions
└─ middleware.ts
prisma/                   # schema.prisma + seed.ts
tests/                    # unit + e2e
```

---

## 📦 مراحل تحویل‌داده‌شده

۱. معماری و ساختار · ۲. طراحی و Design System · ۳. دیتابیس · ۴. Backend · ۵. Frontend · ۶. پنل مدیریت · ۷. سئو + عملکرد + امنیت · ۸. تست + دیپلوی

---

## 📞 ارتباط

- وب‌سایت: https://virgule.studio
- ایمیل: info@virgule.studio
- تلفن: 09999571001

© ۱۴۰۴ ویرگول. تمامی حقوق محفوظ است.
