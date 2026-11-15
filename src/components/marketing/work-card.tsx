import Link from "next/link"
import { clsx } from "clsx"
import { Reveal } from "@/components/ui/reveal"
import { ProjectCover } from "@/components/marketing/project-cover"
import { faIndex, faNum } from "@/lib/fa"

export type WorkItem = {
	slug: string
	title: string
	summary: string | null
	client: string | null
	year: number | null
	coverImage: string | null
	technologies: string[]
	category: { name: string } | null
}

/** یک نمونه‌کار: جلد، و زیرش شماره، عنوان و یک سطر توضیح. */
export function WorkCard({
	project: p,
	index,
	aspect = "aspect-[4/3]",
	large,
	heading: Heading = "h3",
	className,
}: {
	project: WorkItem
	index: number
	/** نسبتِ جلد — صفحه‌ها با همین ریتمِ شبکه را می‌سازند */
	aspect?: string
	large?: boolean
	heading?: "h2" | "h3"
	className?: string
}) {
	// عنوان‌ها به شکل «نام — توضیح» نوشته می‌شوند. روی جلد فقط نام می‌آید: برچسبِ شیشه‌ای
	// باید کوتاه بماند تا تصویر را نپوشاند؛ دسته زیرِ عنوان می‌نشیند.
	const name = p.title.split(" — ")[0]
	const year = p.year ? faNum(p.year) : null

	return (
		<article className={className}>
			<Link href={`/portfolio/${p.slug}`} className="work group">
				<Reveal as="img-rv">
					<div className={clsx("work__cover", aspect)}>
						{p.coverImage ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={p.coverImage}
								alt={`نمونه‌کار ${p.title} — ${p.category?.name ?? "طراحی و توسعه‌ی وب"} توسط استودیو ویرگول`}
								loading="lazy"
								decoding="async"
								className="h-full w-full object-cover"
							/>
						) : (
							<ProjectCover index={index} />
						)}
						{/* شیشه روی تصویر: نامِ کارفرما و دسته، خوانا روی هر جلدی */}
						<div className={clsx("work__label glass", !p.coverImage && index % 3 === 0 && "ink")}>
							<span className={clsx("min-w-0 truncate", large ? "h3" : "t-title")}>{name}</span>
							{year && <span className="meta-fa shrink-0 !text-[var(--fg-2)]">{year}</span>}
						</div>
					</div>
				</Reveal>

				<div className="mt-5 flex items-baseline gap-4">
					<span className="numeral text-[1.35rem]" aria-hidden="true">
						{faIndex(index + 1)}
					</span>
					<div className="min-w-0 flex-1">
						<Heading className="h3">
							<span className="link-u">{p.title}</span>
						</Heading>
						{p.category && <p className="meta-fa mt-1">{p.category.name}</p>}
						{p.summary && <p className="body-t mt-2 max-w-[52ch] text-[.94rem]">{p.summary}</p>}
						{p.technologies.length > 0 && (
							<ul className="techs font-latin mt-3" dir="ltr" aria-label="تکنولوژی‌ها">
								{p.technologies.map((t) => (
									<li key={t}>{t}</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</Link>
		</article>
	)
}
