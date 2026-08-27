// ابزارهای امنیتی

/** پاک‌سازی ورودی متنی برای جلوگیری از XSS (ساده). */
export function sanitizeText(input: string): string {
	return input
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\u0000/g, "")
		.trim()
}

/** استخراج IP از هدرها (پشت Nginx / Proxy). */
export function getClientIp(headers: Headers): string {
	const xff = headers.get("x-forwarded-for")
	if (xff) return xff.split(",")[0]!.trim()
	return headers.get("x-real-ip") ?? "unknown"
}

/** هدرهای امنیتی استاندارد (در middleware اعمال می‌شوند). */
export const securityHeaders: Record<string, string> = {
	"X-Frame-Options": "SAMEORIGIN",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
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
