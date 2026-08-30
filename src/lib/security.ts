// ابزارهای امنیتی

/** پاک‌سازی ورودی متنی برای جلوگیری از XSS (ساده). */
export function sanitizeText(input: string): string {
	return input
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\u0000/g, "")
		.trim()
}

/**
 * استخراج IP از هدرها (پشت Nginx / Proxy).
 *
 * هشدار: x-forwarded-for را کلاینت هم می‌تواند بفرستد. این مقدار فقط وقتی
 * قابل‌اتکاست که برنامه پشت پراکسی‌ای باشد که خودش هدر را بازنویسی کند —
 * همان کاری که nginx.conf این پروژه انجام می‌دهد. اگر مستقیم روی اینترنت
 * اجرا شود، محدودکردن نرخ قابل دور زدن است.
 */
export function getClientIp(headers: Headers): string {
	const xff = headers.get("x-forwarded-for")
	if (xff) return xff.split(",")[0]!.trim()
	return headers.get("x-real-ip") ?? "unknown"
}

/** هدرهای امنیتی استاندارد (در middleware اعمال می‌شوند). */
/**
 * سیاست امنیتی محتوا.
 *
 * 'unsafe-inline' برای اسکریپت لازم است چون Next.js داده‌های هیدریشن را به‌صورت
 * inline تزریق می‌کند؛ بدون nonce در هر پاسخ نمی‌شود حذفش کرد. بقیه‌ی مسیرها
 * (منابع خارجی، frame، form-action، object) بسته‌اند.
 * در توسعه 'unsafe-eval' لازم است، در پروڈاکشن نه.
 */
function csp(): string {
	const dev = process.env.NODE_ENV !== "production"
	return [
		"default-src 'self'",
		`script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: https:",
		"font-src 'self' data:",
		`connect-src 'self'${dev ? " ws: wss:" : ""}`,
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'self'",
		"upgrade-insecure-requests",
	].join("; ")
}

/** هدرهای امنیتی استاندارد (در middleware اعمال می‌شوند). */
export const securityHeaders: Record<string, string> = {
	"Content-Security-Policy": csp(),
	"X-Frame-Options": "SAMEORIGIN",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
	"Cross-Origin-Opener-Policy": "same-origin",
	"X-DNS-Prefetch-Control": "on",
	"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
}

/** تشخیص اسپم ساده بر اساس honeypot + طول محتوا + لینک. */
export function looksLikeSpam(payload: {
	website?: string
	message?: string
	description?: string
}): boolean {
	if (payload.website && payload.website.length > 0) return true // honeypot پر شده
	const text = `${payload.message ?? ""} ${payload.description ?? ""}`
	const linkCount = (text.match(/https?:\/\//g) ?? []).length
	if (linkCount >= 4) return true
	return false
}
