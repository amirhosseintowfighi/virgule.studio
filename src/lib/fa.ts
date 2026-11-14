/** ابزارهای نمایشِ فارسی: رقم و تاریخ. */

const DIGITS = "۰۱۲۳۴۵۶۷۸۹"

/** رقم‌های لاتین را به فارسی برمی‌گرداند. متنِ غیرعددی دست‌نخورده می‌ماند. */
export function faNum(value: number | string): string {
	return String(value).replace(/\d/g, (d) => DIGITS[Number(d)])
}

/** شماره‌ی ردیف، دو رقمی: ۱ ← «۰۱». */
export function faIndex(n: number): string {
	return faNum(String(n).padStart(2, "0"))
}

const dateFmt = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" })

/** تاریخ شمسی، مثل «۲۳ آبان ۱۴۰۵». */
export function faDate(date: Date | string | null | undefined): string | null {
	if (!date) return null
	const d = typeof date === "string" ? new Date(date) : date
	return Number.isNaN(d.getTime()) ? null : dateFmt.format(d)
}
