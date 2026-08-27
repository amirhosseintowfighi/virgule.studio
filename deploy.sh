#!/usr/bin/env bash
# راه‌اندازی ویرگول روی سرور: ./deploy.sh
# دوباره اجرا کن تا آخرین تغییرات گیت را بگیرد و به‌روزرسانی کند.
set -euo pipefail
cd "$(dirname "$0")"

# ۱. آخرین کد
[ -d .git ] && git pull --ff-only

# ۲. .env (فقط بار اول ساخته می‌شود)
if [ ! -f .env ]; then
	sed -e "s|^JWT_SECRET=.*|JWT_SECRET=\"$(openssl rand -hex 32)\"|" \
	    -e "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$(openssl rand -hex 16)|" \
	    -e "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$(openssl rand -base64 12)|" \
	    .env.example > .env
	echo "→ .env ساخته شد با مقادیر تصادفی. رمز ادمین:"
	grep '^ADMIN_PASSWORD=' .env
fi

# ۳. گواهی SSL — اگر گواهی واقعی نگذاشته‌ای، self-signed می‌سازد (مرورگر هشدار می‌دهد)
mkdir -p nginx/certs
if [ ! -f nginx/certs/fullchain.pem ]; then
	openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
		-keyout nginx/certs/privkey.pem -out nginx/certs/fullchain.pem \
		-subj "/CN=${DOMAIN:-virgule.studio}" 2>/dev/null
	echo "→ گواهی self-signed ساخته شد. برای گواهی واقعی فایل‌های Let's Encrypt را در nginx/certs/ بگذار."
fi

# ۴. بالا آوردن
docker compose up -d --build

# ۵. اسکیما و داده‌ی اولیه (idempotent — هر بار اجرا مشکلی ندارد)
docker compose run --rm migrate

echo
echo "✅ بالا آمد → https://${DOMAIN:-$(hostname -I 2>/dev/null | awk '{print $1}')}/"
echo "   پنل مدیریت: /dashboard   ·   لاگ: docker compose logs -f web"
