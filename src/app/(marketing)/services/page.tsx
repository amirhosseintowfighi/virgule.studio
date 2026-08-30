import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Magnetic } from "@/components/fx/magnetic"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"

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

			<PageHead
				lines={[c.headLine1, c.headLine2]}
				lead={c.headLead}
			/>

			<section className="stage stage--r px-[var(--pad)] pb-[var(--sec)]">
				{services.length === 0 ? (
					<p className="body-t">فهرست خدمات در دسترس نیست.</p>
				) : (
					// همان پشته‌ی چسبان صفحه‌ی اصلی — یک زبان، در همه‌ی صفحه‌ها
					<ul className="stack">
						{services.map((s, i) => (
							<li key={s.id} className="stack__i" style={{ "--i": i } as React.CSSProperties}>
								<article className="panel flex min-h-[clamp(320px,50svh,480px)] flex-col p-[clamp(24px,4vw,64px)]">
									<span className="panel__edge" aria-hidden="true" />
									<span className="panel__ghost num" aria-hidden="true">
										{String(i + 1).padStart(2, "0")}
									</span>

									<div className="my-auto grid gap-10 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-16">
										<div>
											<h2 className="h2 text-[clamp(1.6rem,2.6vw,2.4rem)]">{s.title}</h2>
											{s.summary && <p className="body-t mt-5 max-w-[48ch]">{s.summary}</p>}
											<div className="mt-10">
												<Magnetic strength={0.18}>
													<Link href={`/services/${s.slug}`} className="btn">
														جزئیات این خدمت
													</Link>
												</Magnetic>
											</div>
										</div>

										{s.features.length > 0 && (
											<ul className="flex flex-col gap-4 md:border-s md:border-[var(--line)] md:ps-12">
												{s.features.map((f) => (
													<li key={f} className="feat body-t text-[15px] leading-relaxed">
														{f}
													</li>
												))}
											</ul>
										)}
									</div>
								</article>
							</li>
						))}
					</ul>
				)}
			</section>

			<section className="stage stage--c px-[var(--pad)] py-[var(--sec)]">
				<Reveal as="rule" className="mb-[var(--sec)]" />
				<h2 className="h2 max-w-[18ch]">
					<RevealLines className="sheen" lines={[c.ctaLine1, c.ctaLine2]} />
				</h2>
				<Reveal delay={240} className="mt-10">
					<p className="body-t max-w-[54ch]">{c.ctaLead}</p>
				</Reveal>
				<Reveal delay={380} className="mt-12">
					<Magnetic strength={0.22}>
						<Link href="/request-project" className="btn btn--solid">
							دریافت مشاوره‌ی رایگان
						</Link>
					</Magnetic>
				</Reveal>
			</section>
		</>
	)
}
