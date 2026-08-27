# ویرگول — مرحله ۶: پنل مدیریت (Admin Dashboard)

پنل مدیریت کامل با احراز هویت، کنترل دسترسی نقش‌محور و مدیریت محتوا.

## صفحات

```
/login                       → ورود (متصل به loginAction)
/dashboard                   → داشبورد با آمار و آخرین پیام‌ها
/dashboard/posts             → لیست مقالات + حذف
/dashboard/posts/new         → ایجاد مقاله
/dashboard/posts/[id]        → ویرایش مقاله
/dashboard/submissions       → فرم‌های دریافتی (با نشانه‌ی اسپم)
/dashboard/users             → کاربران و نقش‌ها
```

## امنیت و دسترسی
- لایه‌ی `(dashboard)` در سمت سرور `getSession` را چک می‌کند و در صورت نبود نشست، به `/login` هدایت می‌کند.
- هر صفحه‌ی حساس با `requirePermission(...)` محافظت می‌شود.
- منوی کناری بر اساس مجوزهای کاربر موارد را فیلتر می‌کند.

## ساختار

```
src/
├─ app/
│  ├─ (auth)/login/page.tsx
│  └─ (dashboard)/
│     ├─ layout.tsx                 # Auth Guard + Sidebar + Topbar
│     └─ dashboard/
│        ├─ page.tsx                # آمار
│        ├─ posts / [id] / new
│        ├─ submissions
│        └─ users
├─ components/admin/
│  ├─ sidebar.tsx  topbar.tsx  stat-card.tsx
│  ├─ login-form.tsx  post-editor.tsx  delete-post-button.tsx
└─ lib/labels.ts
```

> این مرحله بر روی Server Actionهای مرحله ۴ (auth/posts) و مدل‌های مرحله ۳ سوار است.
