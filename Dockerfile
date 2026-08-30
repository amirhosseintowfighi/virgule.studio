# syntax=docker/dockerfile:1

# مرحله ۱: وابستگی‌ها
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# مرحله ۲: بیلد
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# مرحله ۳: اجرا (خروجی standalone)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# اسکریپت‌های نگهداری داخل همین ایمیج باشند تا بشود با
# `docker compose exec web node scripts/admin.mjs ...` اجراشان کرد.
# دیتابیس فقط داخل شبکه‌ی داکر شنیده می‌شود، پس از روی هاست قابل دسترس نیست.
COPY --from=builder /app/scripts ./scripts

# bcryptjs را Next داخل چانک‌های سرور bundle می‌کند، پس در خروجی standalone
# به‌صورت یک پکیجِ قابل import باقی نمی‌ماند و اسکریپت نمی‌تواند صدایش بزند.
# (پکیج بدون وابستگی است، پس همین یک پوشه کافی است.)
COPY --from=deps /app/node_modules/bcryptjs ./node_modules/bcryptjs

# پوشه‌ی آپلود باید همین‌جا و با مالکیت nextjs ساخته شود.
# داکر هنگام ساختِ volume نام‌دار، محتوا و مالکیتِ همین مسیر در ایمیج را کپی
# می‌کند؛ بدون این خط، volume با مالکیت root ساخته می‌شود و پروسه‌ای که با
# کاربر nextjs اجرا می‌شود اجازه‌ی نوشتن ندارد (EACCES).
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
