import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead, Folio } from "@/components/ui/section"
import { Arrow } from "@/components/ui/marks"
import { Closing } from "@/components/marketing/closing"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"
import { Glyph } from "@/components/ui/art"
import { faNum } from "@/lib/fa"

export const metadata = buildMetadata({
	title: "خدمات طراحی و توسعه‌ی وب",
	description:
		"طراحی سایت شرکتی، فروشگاه اینترنتی، طراحی رابط کاربری، سئوی فنی و بهینه‌سازی سرعت — هر پروژه بر اساس هدف و مخاطب همان کسب‌وکار.",
	path: "/services",
})

export default async function ServicesPage() {
	const [services, c] = await Promise.all([
		safe(prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }), []),
		getContent("services"),
	])

	return (
		<>
			<JsonLd data={breadcrumbJsonLd([{ name: "خدمات", path: "/services" }])} />

			<PageHead label="خدمات" art={2} lines={[c.headLine1, c.headLine2]} lead={c.headLead} />

			<section className="wrap pb-[var(--sec)]">
				<Folio label="فهرست" aside={services.length > 0 ? `${faNum(services.length)} خدمت` : undefined} />
				{services.length === 0 ? (
					<p className="body-t mt-10">فهرست خدمات در دسترس نیست.</p>
				) : (
					// همان فهرستِ صفحه‌ی اصلی، با جزئیاتِ بیشتر: ستونِ سوم ویژگی‌های هر خدمت است
					<ul className="idx mt-[clamp(32px,4vw,56px)]">
						{services.map((s, i) => (
							<li key={s.id}>
								<Link href={`/services/${s.slug}`} className="idx__row !items-start">
									<Glyph i={i} className="idx__n mt-1" />
									<div>
										<h2 className="h2 idx__t text-[clamp(1.9rem,3vw,2.8rem)]">{s.title}</h2>
										{s.summary && <p className="body-t mt-4 max-w-[44ch]">{s.summary}</p>}
									</div>
									{s.features.length > 0 ? (
										<ul className="flex flex-col gap-2.5 md:pt-3">
											{s.features.map((f) => (
												<li key={f} className="feat body-t text-[.94rem] leading-relaxed">
													{f}
												</li>
											))}
										</ul>
									) : (
										<span />
									)}
									<Arrow className="idx__go mt-4 !self-start text-2xl" />
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>

			<Closing lines={[c.ctaLine1, c.ctaLine2]} lead={c.ctaLead} cta="دریافت مشاوره‌ی رایگان" />
		</>
	)
}
