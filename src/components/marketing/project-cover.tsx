import { clsx } from "clsx"
import { Composition, COMPOSITION_COUNT } from "@/components/ui/art"

/**
 * جلدِ ساخته‌شده برای پروژه‌هایی که هنوز تصویر واقعی ندارند.
 *
 * به‌جای یک کادر خالی، یکی از ترکیب‌های برداریِ سایت را نشان می‌دهد. شکل با hash
 * نام پروژه انتخاب می‌شود و زمینه و چرخشِ رنگ با شماره‌ی ردیف، پس جلدها مثل هم
 * نیستند ولی از یک خانواده‌اند. نام و دسته را برچسبِ شیشه‌ایِ WorkCard نشان می‌دهد.
 *
 * سرور-رندر و کاملاً قطعی است. به محض اینکه coverImage واقعی اضافه شود، این
 * کامپوننت اصلاً رندر نمی‌شود.
 */

/** hash ساده و پایدار — فقط برای انتخاب یکی از چند ترکیب. */
function hash(s: string) {
	let h = 0
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
	return h
}

export function ProjectCover({ title, index = 0 }: { title: string; index?: number }) {
	// ردیف‌های پیاپی نباید یک شکل بگیرند: hash نقطه‌ی شروع است و ردیف جابه‌جایش می‌کند
	const variant = (hash(title) + index) % COMPOSITION_COUNT
	// همین قاعده در WorkCard هم هست تا برچسبِ شیشه‌ای روی جلدِ تیره، تیره شود
	const dark = index % 3 === 0

	return (
		<div className={clsx("h-full w-full", dark ? "ink" : "bg-[var(--bg-2)]")}>
			<Composition variant={variant} shift={index} cover className="h-full" />
		</div>
	)
}
