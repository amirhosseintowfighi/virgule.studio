// Rate limiter ساده و درون‌حافظه (برای تولید، از Redis / Upstash استفاده کنید).
type Bucket = { count: number; resetAt: number }
const store = new Map<string, Bucket>()

export type RateLimitResult = {
	success: boolean
	remaining: number
	resetAt: number
}

/**
 * @param key   شناسه (معمولاً IP + مسیر)
 * @param limit سقف درخواست در پنجره
 * @param windowMs طول پنجره بر حسب میلی‌ثانیه
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
	const now = Date.now()
	const bucket = store.get(key)
	if (!bucket || bucket.resetAt < now) {
		store.set(key, { count: 1, resetAt: now + windowMs })
		return { success: true, remaining: limit - 1, resetAt: now + windowMs }
	}
	if (bucket.count >= limit) {
		return { success: false, remaining: 0, resetAt: bucket.resetAt }
	}
	bucket.count += 1
	return { success: true, remaining: limit - bucket.count, resetAt: bucket.resetAt }
}

// پاک‌سازی دوره‌ای باکت‌های منقضی‌شده
if (typeof setInterval !== "undefined") {
	setInterval(() => {
		const now = Date.now()
		for (const [k, v] of store) if (v.resetAt < now) store.delete(k)
	}, 5 * 60_000).unref?.()
}
