import { clsx } from "clsx"
import { Composition, COMPOSITION_COUNT } from "@/components/ui/art"
import { projectMedia } from "@/lib/project-media"

/**
 * جلدِ ساخته‌شده برای پروژه‌هایی که تصویرِ جلدِ آپلودشده ندارند.
 *
 * دو لایه که با هم خوانده می‌شوند: یکی از ترکیب‌های برداریِ سایت در زمینه، و در
 * مرکزش نشانِ خودِ آن برند روی یک صفحه‌ی کاغذی. صفحه همیشه روشن است، چون نشان‌ها
 * با رنگ‌های خودشان می‌آیند و برای زمینه‌ی روشن طراحی شده‌اند.
 *
 * شکل، زمینه و چرخشِ رنگ همه از شماره‌ی ردیفِ پروژه می‌آیند، پس جلدها مثل هم نیستند
 * ولی از یک خانواده‌اند. نام و سال را برچسبِ شیشه‌ایِ WorkCard نشان می‌دهد.
 *
 * سرور-رندر و کاملاً قطعی است. به محض اینکه coverImage واقعی اضافه شود، این
 * کامپوننت اصلاً رندر نمی‌شود.
 */
export function ProjectCover({ slug, title, index = 0 }: { slug: string; title: string; index?: number }) {
	// گامِ ۲ روی پنج ترکیب: ۰، ۲، ۴، ۱، ۳ — دو جلدِ کنارِ هم هیچ‌وقت یک شکل نمی‌گیرند
	const variant = (index * 2) % COMPOSITION_COUNT
	// همین قاعده در WorkCard هم هست تا برچسبِ شیشه‌ای روی جلدِ تیره، تیره شود
	const dark = index % 3 === 0
	const { logo, monogram } = projectMedia(slug)
	const name = title.split(" — ")[0]

	return (
		<div className={clsx("relative h-full w-full", dark ? "ink" : "bg-[var(--bg-2)]")}>
			<Composition variant={variant} shift={index} cover className="h-full" />

			{(logo || monogram) && (
				<div className="cover-badge">
					{logo ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={logo} alt={`نشان ${name}`} width={176} height={176} loading="lazy" decoding="async" />
					) : (
						<span aria-hidden="true">{monogram}</span>
					)}
				</div>
			)}
		</div>
	)
}
