import localFont from "next/font/local"
import { Inter } from "next/font/google"

/** IRANYekan — متن و رابط. self-hosted از public/fonts. */
export const iranYekan = localFont({
	src: [
		{ path: "../../public/fonts/iranyekanwebregular.woff", weight: "400", style: "normal" },
		{ path: "../../public/fonts/iranyekanwebmedium.woff", weight: "500", style: "normal" },
		{ path: "../../public/fonts/iranyekanwebbold.woff", weight: "700", style: "normal" },
	],
	variable: "--font-iranyekan",
	display: "swap",
})

/**
 * Markazi Text — صدای تیترها. یک نسخِ کتابی که برنا ایزدپناه برای فارسی طراحی کرده.
 * متغیر (۴۰۰ تا ۷۰۰)، self-hosted تا بیلد به شبکه‌ی بیرونی وابسته نباشد. مجوز: OFL.
 *
 * دو خانواده‌ی جدا، نه دو src در یک خانواده: next/font برای فونت محلی unicode-range
 * نمی‌گذارد، پس دو فایل با یک نام و یک وزن همدیگر را می‌پوشانند. با دو نام، مرورگر
 * خودش برای هر نویسه سراغ خانواده‌ی بعدیِ پشته می‌رود.
 */
export const markazi = localFont({
	src: "../../public/fonts/markazi-text-arabic.woff2",
	weight: "400 700",
	variable: "--font-markazi",
	display: "swap",
	// بدون fallback خودکار: next/font یک «Arial با متریکِ تنظیم‌شده» بعد از این خانواده
	// می‌گذارد که همه‌ی نویسه‌های لاتین را می‌گیرد و نوبت به لاتینِ Markazi نمی‌رسد.
	adjustFontFallback: false,
})

/** لاتینِ همان خانواده — برای ایمیل و نام‌های لاتین درونِ تیتر. */
export const markaziLatin = localFont({
	src: "../../public/fonts/markazi-text-latin.woff2",
	weight: "400 700",
	variable: "--font-markazi-latin",
	display: "swap",
	preload: false,
	adjustFontFallback: false,
})

export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
})
