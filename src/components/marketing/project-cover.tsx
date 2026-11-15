import { clsx } from "clsx"
import { Composition, COMPOSITION_COUNT } from "@/components/ui/art"

/**
 * جلدِ ساخته‌شده برای پروژه‌هایی که هنوز تصویر واقعی ندارند.
 *
 * به‌جای یک کادر خالی، یکی از ترکیب‌های برداریِ سایت را نشان می‌دهد. شکل، زمینه و
 * چرخشِ رنگ همه از شماره‌ی ردیفِ پروژه می‌آیند، پس جلدها مثل هم نیستند ولی از یک
 * خانواده‌اند. نام و سال را برچسبِ شیشه‌ایِ WorkCard نشان می‌دهد.
 *
 * سرور-رندر و کاملاً قطعی است. به محض اینکه coverImage واقعی اضافه شود، این
 * کامپوننت اصلاً رندر نمی‌شود.
 */

export function ProjectCover({ index = 0 }: { index?: number }) {
	// گامِ ۲ روی پنج ترکیب: ۰، ۲، ۴، ۱، ۳ — دو جلدِ کنارِ هم هیچ‌وقت یک شکل نمی‌گیرند
	const variant = (index * 2) % COMPOSITION_COUNT
	// همین قاعده در WorkCard هم هست تا برچسبِ شیشه‌ای روی جلدِ تیره، تیره شود
	const dark = index % 3 === 0

	return (
		<div className={clsx("h-full w-full", dark ? "ink" : "bg-[var(--bg-2)]")}>
			<Composition variant={variant} shift={index} cover className="h-full" />
		</div>
	)
}
