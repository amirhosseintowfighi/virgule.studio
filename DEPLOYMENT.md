# راهنمای دیپلوی ویرگول

## ۱. آماده‌سازی سرور

```bash
# نصب Docker و Docker Compose
curl -fsSL https://get.docker.com | sh
```

## ۲. گواهی SSL (Let's Encrypt)

```bash
sudo certbot certonly --standalone -d virgule.studio -d www.virgule.studio
# کپی فایل‌ها به nginx/certs/
cp /etc/letsencrypt/live/virgule.studio/fullchain.pem nginx/certs/
cp /etc/letsencrypt/live/virgule.studio/privkey.pem nginx/certs/
```

## ۳. اجرا

```bash
./deploy.sh
```

اسکریپت: کد را از گیت می‌گیرد، `.env` را (بار اول، با مقادیر تصادفی) می‌سازد، در نبودِ گواهی واقعی یک گواهی self-signed می‌سازد، کانتینرها را بالا می‌آورد و اسکیما + داده‌ی اولیه را اعمال می‌کند. برای به‌روزرسانی دوباره همین را اجرا کن.

## ۴. راه‌اندازی بدون Docker (PM2)

```bash
npm ci && npm run build
pm2 start npm --name virgule -- start
pm2 save && pm2 startup
```

## ۵. پایش و نگهداری

```bash
docker compose logs -f web        # لاگ‌ها
docker compose exec db pg_dump ... # پشتیبان‌گیری
docker compose pull && docker compose up -d  # به‌روزرسانی
```

## ✅ چک‌لیست پیش از انتشار

- [ ] متغیرهای `.env` تنظیم شده (JWT_SECRET قوی)
- [ ] گواهی SSL نصب شده
- [ ] `prisma migrate deploy` اجرا شده
- [ ] رمز ادمین پیش‌فرض تغییر کرده
- [ ] دامنه به سرور اشاره می‌کند
- [ ] پشتیبان‌گیری خودکار دیتابیس فعال
