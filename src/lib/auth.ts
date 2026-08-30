import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import prisma from "./prisma"

const SESSION_COOKIE = "virgule_session"
const encoder = new TextEncoder()
const MAX_AGE = Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24 * 7) // 7d

/**
 * کلید امضای نشست.
 *
 * اگر JWT_SECRET تنظیم نشده باشد، در پروڈاکشن باید فرایند بمیرد — نه اینکه به یک
 * مقدار پیش‌فرضِ عمومی برگردد. مقدار پیش‌فرضِ داخل مخزن یعنی هر کسی که کد را
 * دیده می‌تواند برای خودش توکن مدیر کل بسازد.
 */
function secret(): Uint8Array {
	const s = process.env.JWT_SECRET
	if (!s || s.length < 32) {
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				"JWT_SECRET تنظیم نشده یا کوتاه‌تر از ۳۲ کاراکتر است. بدون آن نشست‌ها قابل جعل‌اند."
			)
		}
		// فقط برای توسعه‌ی محلی
		return encoder.encode("dev-only-secret-not-for-production-use")
	}
	return encoder.encode(s)
}

export type SessionPayload = {
	userId: string
	email: string
	role: string
	permissions: string[]
}

// ---------- Passwords ----------
export const hashPassword = (plain: string) => bcrypt.hash(plain, 12)
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash)

// ---------- JWT ----------
export async function signToken(payload: SessionPayload): Promise<string> {
	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${MAX_AGE}s`)
		.sign(secret())
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
	try {
		// الگوریتم را قفل می‌کنیم تا توکنی با alg دیگر (مثلاً none) پذیرفته نشود
		const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] })
		return payload as unknown as SessionPayload
	} catch {
		return null
	}
}

// ---------- Session cookie helpers ----------
export async function createSession(payload: SessionPayload) {
	const token = await signToken(payload)
	const store = await cookies()
	store.set(SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: MAX_AGE,
	})
}

export async function destroySession() {
	const store = await cookies()
	store.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<SessionPayload | null> {
	const store = await cookies()
	const token = store.get(SESSION_COOKIE)?.value
	if (!token) return null
	return verifyToken(token)
}

/**
 * نشست را با وضعیت فعلی کاربر در دیتابیس تطبیق می‌دهد.
 *
 * توکن بدون حالت است و تا ۷ روز اعتبار دارد؛ بدون این بررسی، غیرفعال‌کردن یک
 * کاربر یا پایین‌آوردن نقشش تا انقضای توکن هیچ اثری ندارد. یک کوئری در هر
 * درخواستِ پنل — ترافیک پنل کم است و این هزینه می‌ارزد.
 */
export async function getLiveSession(): Promise<SessionPayload | null> {
	const session = await getSession()
	if (!session) return null

	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		include: { role: { include: { permissions: true } } },
	})
	if (!user || !user.isActive) return null

	return {
		userId: user.id,
		email: user.email,
		role: user.role.name,
		permissions: user.role.permissions.map((p) => p.key),
	}
}

// ---------- Authenticate credentials ----------
export async function authenticate(email: string, password: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		include: { role: { include: { permissions: true } } },
	})
	if (!user || !user.isActive) {
		// هزینه‌ی زمانی را برابر نگه می‌داریم تا وجود/نبودِ ایمیل از تفاوت زمان پاسخ لو نرود
		await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin")
		return null
	}
	const okPass = await verifyPassword(password, user.passwordHash)
	if (!okPass) return null

	const payload: SessionPayload = {
		userId: user.id,
		email: user.email,
		role: user.role.name,
		permissions: user.role.permissions.map((p) => p.key),
	}
	return { user, payload }
}
