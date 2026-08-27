# ویرگول — مرحله ۴: Backend

لایه‌ی سرور کامل پروژه: احراز هویت، کنترل دسترسی، Server Actions، REST API و امنیت.

## ساختار

```
src/
├─ lib/
│  ├─ auth.ts          # JWT (jose) + bcrypt + کوکی نشست + authenticate()
│  ├─ rbac.ts          # requireUser / requirePermission / hasPermission
│  ├─ validators.ts    # اسکیماهای Zod (لاگین، فرم‌ها، مقاله، دیدگاه)
│  ├─ rate-limit.ts    # محدودیت نرخ درخواست
│  ├─ security.ts      # sanitize + IP + secure headers + ضداسپم
│  └─ api.ts           # پاسخ‌های استاندارد + مدیریت خطا
├─ server/actions/
│  ├─ auth.ts          # loginAction / logoutAction
│  ├─ forms.ts         # submitContact / submitProjectRequest / subscribeNewsletter
│  └─ posts.ts         # upsertPost / deletePost (با RBAC)
├─ app/api/
│  ├─ auth/login/route.ts
│  ├─ posts/route.ts   # GET لیست + POST ایجاد
│  └─ contact/route.ts
└─ middleware.ts        # Auth Guard + Secure Headers
```

## پکیج‌های مورد نیاز

```bash
npm install jose bcryptjs zod
npm install -D @types/bcryptjs
```

## نکات امنیتی پیاده‌شده
- **JWT** امضاشده با HS256 (کتابخانه‌ی `jose`، سازگار با Edge)
- **کوکی HttpOnly + Secure + SameSite** برای نشست
- **RBAC**: کنترل مجوز در Server Action و API
- **Rate Limit** روی ورود و فرم‌ها
- **Honeypot + تشخیص اسپم** در فرم‌ها
- **Sanitization** ورودی‌های کاربر (ضد XSS)
- **Secure Headers** در middleware (HSTS, X-Frame-Options, ...)
- **اعتبارسنجی Zod** در تمام ورودی‌ها

> نکته: در تولید، Rate Limit را با Redis/Upstash جایگزین کنید تا در چنداینستنس کار کند.
