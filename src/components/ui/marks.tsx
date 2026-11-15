import { clsx } from "clsx"

/** ویرگولِ نشان — در کادر ۶۴×۶۴، روی خطِ کرسیِ y=58. */
const COMMA_PATH =
	"M26 58C18.09 58 12.24 51.81 12.24 43.55C12.24 29.79 21.87 18.1 36.32 11.22C28.06 18.78 23.94 25.66 23.94 30.82C24.62 30.57 25.31 30.48 26 30.48C33.91 30.48 39.76 36.33 39.76 44.24C39.76 51.81 33.91 58 26 58Z"

/**
 * نشان ویرگول — «تعادل هندسی و مکث».
 * ویرگولِ فارسی با انحنای کاملش، و یک مربعِ ۱۰×۱۰ روی همان خطِ کرسی: منحنی در
 * برابر زاویه‌ی قائم. بدنه رنگش را از currentColor می‌گیرد و مربع از توکنِ شنگرف،
 * پس روی نوارِ مرکبی (‎.ink) خودبه‌خود روشن‌تر می‌شود.
 */
export function LogoMark({ className }: { className?: string }) {
	return (
		// کادر به اندازه‌ی خودِ نشان بریده شده (شبکه همان ۶۴×۶۴ است) تا کنار نوشته کوچک دیده نشود
		<svg viewBox="8 8 52 52" className={clsx("h-9 w-auto", className)} aria-hidden="true">
			<path d={COMMA_PATH} fill="currentColor" />
			<rect x="46" y="48" width="10" height="10" fill="var(--accent, #c63d1f)" />
		</svg>
	)
}

/** پیکانِ «ادامه». در راست‌به‌چپ، جلو یعنی چپ. */
export function Arrow({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={clsx("arrow", className)} aria-hidden="true">
			<path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
