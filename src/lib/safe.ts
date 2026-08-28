/**
 * اگر دیتابیس در دسترس نباشد، صفحه نباید ۵۰۰ شود.
 * صفحه‌های فهرست با حالت خالی رندر می‌شوند و خطا در لاگ سرور می‌ماند.
 * صفحه‌های جزئیات عمداً از این استفاده نمی‌کنند: ۴۰۴ دادن به‌جای قطعی دیتابیس، دروغ است.
 */
export async function safe<T>(query: Promise<T>, fallback: T): Promise<T> {
	try {
		return await query
	} catch (err) {
		console.error("[db] query failed, rendering empty state:", err)
		return fallback
	}
}
