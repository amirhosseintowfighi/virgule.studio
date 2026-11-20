/**
 * رسانه‌ی هر نمونه‌کار: نشانِ برند برای جلد، و تصویرِ صفحه‌ی اصلی برای صفحه‌ی جزئیات.
 *
 * چرا اینجا و نه در دیتابیس: این فایل‌ها بخشی از خودِ مخزن‌اند (public/img/portfolio)
 * و باید بلافاصله بعد از `prisma db seed` کار کنند، بدون آپلود و بدون مهاجرتِ اسکیما.
 * کلید، اسلاگِ پروژه است. پروژه‌ای که اینجا نیست (مثلاً از پنل ساخته شده) جلدِ
 * برداریِ ساده می‌گیرد و بخشِ تصویر برایش رندر نمی‌شود.
 *
 * - logo: فایلِ نشانِ واقعیِ برند، برداشته‌شده از مخزنِ همان پروژه.
 * - monogram: فقط وقتی فایلِ نشانی در دست نیست — نامِ برند با حروفِ خودِ ما.
 *   این نشانِ رسمیِ آن برند نیست؛ به‌محض رسیدنِ فایلِ واقعی باید با logo جایگزین شود.
 * - screenshot: نمای دسکتاپِ صفحه‌ی اصلی، ۱۶۰۰×۱۰۰۰.
 */
export type ProjectMedia = {
	logo?: string
	monogram?: string
	screenshot?: string
}

const dir = "/img/portfolio"

export const PROJECT_MEDIA: Record<string, ProjectMedia> = {
	"gereh-cloud": { logo: `${dir}/logos/gereh-cloud.svg`, screenshot: `${dir}/gereh-cloud-home.webp` },
	"doping-network": { monogram: "دوپینگ" },
	"carbonix-beverage-systems": {
		logo: `${dir}/logos/carbonix-beverage-systems.svg`,
		screenshot: `${dir}/carbonix-beverage-systems-home.webp`,
	},
	"nena-studio-nl": { logo: `${dir}/logos/nena-studio-nl.svg`, screenshot: `${dir}/nena-studio-nl-home.webp` },
	"denver-house-furniture": { monogram: "دنور" },
	"cyrush-energy-aquajoy": {
		logo: `${dir}/logos/cyrush-energy-aquajoy.svg`,
		screenshot: `${dir}/cyrush-energy-aquajoy-home.webp`,
	},
	"manak-ecolodge-yazd": {
		logo: `${dir}/logos/manak-ecolodge-yazd.webp`,
		screenshot: `${dir}/manak-ecolodge-yazd-home.webp`,
	},
}

export const SCREENSHOT_SIZE = { width: 1600, height: 1000 }

/**
 * srcset برای تصویرِ صفحه‌ی اصلی. کنارِ هر فایلِ «-home.webp» یک نسخه‌ی ۸۰۰ پیکسلی
 * («-home-800.webp») هست تا موبایل نسخه‌ی ۱۶۰۰ پیکسلی را دانلود نکند.
 */
export function screenshotSrcSet(src: string): string {
	return `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} ${SCREENSHOT_SIZE.width}w`
}

export function projectMedia(slug: string): ProjectMedia {
	return PROJECT_MEDIA[slug] ?? {}
}

/** نامِ دامنه برای نمایش: بدون پروتکل و www. */
export function hostOf(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, "")
	} catch {
		return url
	}
}
