/**
 * ساخت یا بازنشانی کاربر مدیر — بدون دست‌زدن به بقیه‌ی محتوا.
 *
 * چرا جدا از seed؟ چون `prisma db seed` روی سرورِ زنده مخرب است: پرسش‌های
 * متداول را پاک و از نو می‌سازد و خدمات و نمونه‌کارها را با داده‌ی دمو بازنویسی
 * می‌کند. برای ساختن یا عوض‌کردن رمز مدیر، فقط همین اسکریپت را اجرا کنید.
 *
 *   node scripts/admin.mjs list
 *   node scripts/admin.mjs set <email> <password> [name]
 */
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
const [cmd, email, password, name] = process.argv.slice(2)

async function list() {
	const users = await prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: "asc" } })
	if (users.length === 0) {
		console.log("هیچ کاربری در دیتابیس نیست. با دستور set یکی بسازید.")
		return
	}
	console.log(`${users.length} کاربر:\n`)
	for (const u of users) {
		console.log(`  ${u.email}\n    نقش: ${u.role.name}   فعال: ${u.isActive ? "بله" : "خیر"}\n`)
	}
}

async function set() {
	if (!email || !password) {
		console.error("استفاده: node scripts/admin.mjs set <email> <password> [name]")
		process.exit(1)
	}
	if (password.length < 8) {
		console.error("رمز عبور باید حداقل ۸ کاراکتر باشد.")
		process.exit(1)
	}

	const role = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } })
	if (!role) {
		console.error(
			"نقش SUPER_ADMIN وجود ندارد. روی یک دیتابیس خالی، یک‌بار `npx prisma db seed` را اجرا کنید."
		)
		process.exit(1)
	}

	const passwordHash = await bcrypt.hash(password, 12)
	const user = await prisma.user.upsert({
		where: { email },
		update: { passwordHash, roleId: role.id, isActive: true },
		create: { email, passwordHash, roleId: role.id, name: name ?? "مدیر" },
	})

	console.log(`آماده شد: ${user.email}  (نقش SUPER_ADMIN، فعال)`)
	console.log("حالا از /login وارد شوید.")
}

try {
	if (cmd === "list") await list()
	else if (cmd === "set") await set()
	else {
		console.log("دستورها:\n  node scripts/admin.mjs list\n  node scripts/admin.mjs set <email> <password> [name]")
	}
} finally {
	await prisma.$disconnect()
}
