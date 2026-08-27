# ویرگول — مرحله ۳: دیتابیس (Prisma + PostgreSQL)

این بسته شامل پیاده‌سازی کامل لایه‌ی دیتابیس پروژه است.

## محتوای بسته

```
virgule-db/
├─ prisma/
│  ├─ schema.prisma        # اسکیمای کامل (20+ مدل، enum، index)
│  └─ seed.ts              # داده‌ی اولیه‌ی واقعی فارسی
├─ src/lib/prisma.ts       # Prisma Client Singleton
├─ .env.example            # متغیرهای محیطی
└─ package.snippet.json    # اسکریپت‌ها و پکیج‌های مورد نیاز
```

## مراحل راه‌اندازی

### ۱) نصب پکیج‌ها
```bash
npm install @prisma/client bcryptjs
npm install -D prisma tsx @types/bcryptjs
```

### ۲) تنظیم محیط
```bash
cp .env.example .env
# DATABASE_URL و سایر مقادیر را وارد کنید
```

### ۳) راه‌اندازی PostgreSQL (اختیاری — با Docker)
```bash
docker run --name virgule-pg -e POSTGRES_USER=virgule \
  -e POSTGRES_PASSWORD=password -e POSTGRES_DB=virgule \
  -p 5432:5432 -d postgres:16
```

### ۴) مایگریشن و ساخت Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### ۵) پر کردن دیتابیس با داده‌ی اولیه
```bash
npm run db:seed
```

### ۶) مشاهده‌ی دیتابیس
```bash
npx prisma studio
```

## حساب ادمین پیش‌فرض (پس از seed)
- ایمیل: `info@virgule.studio`
- رمز: مقدار `ADMIN_PASSWORD` در `.env` (پیش‌فرض `Virgule@1404`)

> ⚠️ رمز عبور پیش‌فرض را حتماً در محیط واقعی تغییر دهید.

## داده‌ی Seed شامل
- ۴ نقش (ADMIN/EDITOR/AUTHOR/VIEWER) + ۱۳ مجوز
- ۸ خدمت کامل فارسی
- ۳ مقاله‌ی منتشرشده + دسته‌بندی و برچسب
- ۲ نمونه‌کار
- ۳ پلن تعرفه
- ۳ سوال متداول
- تنظیمات پایه‌ی سایت (general/social/seo)
