/**
 * دیتابیس محلی برای توسعه.
 *
 * روی این ماشین نه Docker هست نه PostgreSQL نصب‌شده، و برای دیدن سایت با داده‌ی
 * واقعی به یک Postgres واقعی نیاز است. `embedded-postgres` باینری رسمی Postgres را
 * داخل node_modules نگه می‌دارد و بدون نصب سیستمی اجرا می‌کند.
 *
 * فقط برای توسعه است — در پروڈاکشن از docker-compose استفاده کنید.
 *
 *   node scripts/dev-db.mjs start   # راه‌اندازی (تا وقتی فرایند زنده است)
 *   node scripts/dev-db.mjs init    # فقط ساخت data directory
 */
import EmbeddedPostgres from "embedded-postgres"
import { existsSync } from "node:fs"
import { resolve } from "node:path"

const DATA_DIR = resolve(process.cwd(), ".pgdata")
const PORT = Number(process.env.DEV_DB_PORT ?? 5432)

const pg = new EmbeddedPostgres({
	databaseDir: DATA_DIR,
	user: "virgule",
	password: "virgule",
	port: PORT,
	persistent: true,
	// بدون این، initdb از locale ویندوز پیروی می‌کند و کلاستر WIN1252 می‌شود؛
	// آن‌وقت هیچ متن فارسی‌ای در دیتابیس جا نمی‌شود.
	initdbFlags: ["--encoding=UTF8", "--locale=C"],
})

const cmd = process.argv[2] ?? "start"

// اولین اجرا باید data directory را بسازد؛ دفعات بعد نباید (وگرنه initdb خطا می‌دهد)
if (!existsSync(DATA_DIR)) {
	console.log("[dev-db] initialising data directory…")
	await pg.initialise()
}

if (cmd === "init") {
	console.log("[dev-db] ready:", DATA_DIR)
	process.exit(0)
}

await pg.start()
console.log(`[dev-db] postgres listening on localhost:${PORT}`)

// دیتابیس برنامه فقط یک‌بار لازم است ساخته شود
try {
	await pg.createDatabase("virgule")
	console.log("[dev-db] created database «virgule»")
} catch {
	console.log("[dev-db] database «virgule» already exists")
}

const stop = async () => {
	console.log("\n[dev-db] stopping…")
	await pg.stop()
	process.exit(0)
}
process.on("SIGINT", stop)
process.on("SIGTERM", stop)
