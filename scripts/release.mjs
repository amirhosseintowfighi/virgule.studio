/**
 * مرحله‌ی «انتشار» برای میزبانی‌هایی که فقط ایمیجِ نهایی را اجرا می‌کنند (مثل PaaS گره)
 * و docker compose ندارند که `migrate` را جدا اجرا کند.
 *
 *   node scripts/release.mjs
 *
 * دو کار می‌کند، و هر دو را می‌شود بارها تکرار کرد:
 * ۱) اگر دیتابیس خالی است، جدول‌ها را از prisma/schema.sql می‌سازد.
 * ۲) داده‌ی اولیه را وارد می‌کند (prisma/seed.cjs) — فقط چیزهایی که نیستند ساخته می‌شوند.
 *
 * چرا نه `prisma db push`؟ ایمیجِ نهایی خروجیِ standalone است و CLI پریزما را ندارد
 * (بیش از ۱۵۰ مگابایت با وابستگی‌هایش). هر دو فایلِ بالا هنگام بیلد ساخته می‌شوند
 * (`npm run build:release`) و اینجا فقط با @prisma/client اجرا می‌شوند.
 *
 * محدودیت: اگر دیتابیس از قبل جدول داشته باشد، اسکیما را تغییر نمی‌دهد. بعد از هر
 * تغییرِ schema.prisma باید مهاجرت را جدا اعمال کرد (`prisma db push` از محیطی که CLI دارد).
 */
import { PrismaClient } from "@prisma/client"
import { existsSync, readFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const schemaSql = resolve(root, "prisma/schema.sql")
const seedJs = resolve(root, "prisma/seed.cjs")

for (const f of [schemaSql, seedJs]) {
	if (!existsSync(f)) {
		console.error(`[release] ${f} پیدا نشد. اول «npm run build:release» را اجرا کنید (Dockerfile خودش این کار را می‌کند).`)
		process.exit(1)
	}
}

const prisma = new PrismaClient()
try {
	const [{ ready }] = await prisma.$queryRaw`SELECT to_regclass('public."User"') IS NOT NULL AS ready`
	if (ready) {
		console.log("[release] جدول‌ها از قبل هستند؛ اسکیما دست نمی‌خورد.")
	} else {
		// اسکریپتِ پریزما هر دستور را با «;» و سطرِ تازه تمام می‌کند؛ سطرهای توضیح کنار می‌روند
		const statements = readFileSync(schemaSql, "utf8")
			.split("\n")
			.filter((line) => !line.trimStart().startsWith("--"))
			.join("\n")
			.split(/;\s*\n/)
			.map((s) => s.trim())
			.filter(Boolean)
		console.log(`[release] دیتابیس خالی است؛ ${statements.length} دستور اجرا می‌شود…`)
		for (const stmt of statements) await prisma.$executeRawUnsafe(stmt)
		console.log("[release] جدول‌ها ساخته شدند.")
	}
} finally {
	await prisma.$disconnect()
}

const seed = spawnSync(process.execPath, [seedJs], { stdio: "inherit", cwd: root })
process.exit(seed.status ?? 1)
