import { cookies } from "next/headers"
import { randomBytes, timingSafeEqual } from "crypto"

const CSRF_COOKIE = "virgule_csrf"

// تولید و ذخیره‌ی توکن CSRF (الگوی double-submit)
export async function issueCsrfToken(): Promise<string> {
	const token = randomBytes(32).toString("hex")
	const store = await cookies()
	store.set(CSRF_COOKIE, token, {
		httpOnly: false, // باید توسط کلاینت خوانده شود
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	})
	return token
}

// اعتبارسنجی توکن ارسالی در مقابل کوکی
export async function verifyCsrfToken(submitted: string | null): Promise<boolean> {
	if (!submitted) return false
	const store = await cookies()
	const cookieToken = store.get(CSRF_COOKIE)?.value
	if (!cookieToken) return false
	const a = Buffer.from(cookieToken)
	const b = Buffer.from(submitted)
	if (a.length !== b.length) return false
	return timingSafeEqual(a, b)
}
