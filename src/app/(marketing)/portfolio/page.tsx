import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead, Folio } from "@/components/ui/section"
import { WorkCard } from "@/components/marketing/work-card"
import { Closing } from "@/components/marketing/closing"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"
import { faNum } from "@/lib/fa"

export const metadata = buildMetadata({
	title: "نمونه‌کارهای طراحی سایت",
	description:
		"پروژه‌هایی که استودیو ویرگول طراحی و پیاده‌سازی کرده است: وب‌سایت شرکتی، فروشگاه اینترنتی و اپلیکیشن وب — همراه با تکنولوژی‌های به‌کاررفته در هرکدام.",
	path: "/portfolio",
})

/* همان ریتمِ صفحه‌ی اصلی: پهن و باریک، یکی‌درمیان. */
const LAYOUT = [
	{ col: "md:col-span-7", aspect: "aspect-[4/3]", large: true },
	{ col: "md:col-span-5 md:mt-[clamp(64px,11vw,176px)]", aspect: "aspect-[4/5]", large: false },
	{ col: "md:col-span-5", aspect: "aspect-[4/5]", large: false },
	{ col: "md:col-span-7 md:mt-[clamp(64px,11vw,176px)]", aspect: "aspect-[4/3]", large: true },
]

export default async function PortfolioPage() {
	const [projects, c] = await Promise.all([
		safe(
			prisma.project.findMany({
				orderBy: [{ featured: "desc" }, { order: "asc" }],
				include: { category: true },
			}),
			[]
		),
		getContent("portfolio"),
	])

	return (
		<>
			<JsonLd data={breadcrumbJsonLd([{ name: "نمونه‌کارها", path: "/portfolio" }])} />

			<PageHead label="نمونه‌کارها" art={1} lines={[c.headLine1, c.headLine2]} lead={c.headLead} />

			<section className="wrap pb-[var(--sec)]">
				<Folio label="همه‌ی کارها" aside={projects.length > 0 ? `${faNum(projects.length)} پروژه` : undefined} />
				{projects.length === 0 ? (
					<p className="body-t mt-10">هنوز پروژه‌ای منتشر نشده است.</p>
				) : (
					<div className="g12 mt-[clamp(40px,5vw,72px)] !gap-y-[clamp(56px,7vw,104px)]">
						{projects.map((p, i) => {
							const l = LAYOUT[i % LAYOUT.length]
							return (
								<WorkCard
									key={p.id}
									project={p}
									index={i}
									aspect={l.aspect}
									large={l.large}
									heading="h2"
									className={l.col}
								/>
							)
						})}
					</div>
				)}
			</section>

			<Closing lines={[c.ctaLine1, c.ctaLine2]} lead={c.ctaLead} />
		</>
	)
}
