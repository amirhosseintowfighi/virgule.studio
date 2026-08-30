import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PageHead } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { buildMetadata, JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const service = await prisma.service.findUnique({ where: { slug } })
	if (!service) return { title: "خدمت پیدا نشد" }
	return buildMetadata({
		title: service.title,
		description: service.summary ?? `${service.title} در استودیو ویرگول — طراحی و پیاده‌سازی اختصاصی.`,
		path: `/services/${service.slug}`,
	})
}

export default async function ServiceDetailPage({ params }: Props) {
	const { slug } = await params
	const service = await prisma.service.findUnique({ where: { slug } })
	if (!service) notFound()

	const paragraphs = (service.content ?? "")
		.split("\n\n")
		.map((p) => p.trim())
		.filter(Boolean)

	const related = await prisma.service.findMany({
		where: { active: true, slug: { not: service.slug } },
		orderBy: { order: "asc" },
		take: 3,
	})

	return (
		<>
			<JsonLd
				data={[
					serviceJsonLd({
						name: service.title,
						description: service.summary ?? service.title,
						path: `/services/${service.slug}`,
					}),
					breadcrumbJsonLd([
						{ name: "خدمات", path: "/services" },
						{ name: service.title, path: `/services/${service.slug}` },
					]),
				]}
			/>
			<PageHead lines={[service.title]} lead={service.summary ?? undefined}>
				<Reveal delay={320} className="mt-10 flex flex-wrap gap-4">
					<Link href="/request-project" className="btn btn--solid">
						درخواست این خدمت
					</Link>
					<Link href="/contact" className="btn">
						مشاوره‌ی رایگان
					</Link>
				</Reveal>
			</PageHead>

			<div className="stage stage--r px-[var(--pad)] pb-[var(--sec)]">
				{paragraphs.length > 0 && (
					<section className="py-[clamp(40px,6vw,80px)]">
						<Reveal as="rule" className="mb-14" />
						<div className="grid gap-10 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-20">
							<Reveal className="md:sticky md:top-32 md:h-fit">
								<h2 className="h3">این خدمت چیست</h2>
							</Reveal>
							<div className="space-y-7">
								{paragraphs.map((t, i) => (
									<Reveal key={i} as="rv-blur" delay={i * 80}>
										<p className={i === 0 ? "lead max-w-[54ch]" : "body-t max-w-[62ch]"}>{t}</p>
									</Reveal>
								))}
							</div>
						</div>
					</section>
				)}

				{service.features.length > 0 && (
					<section className="py-[clamp(40px,6vw,80px)]">
						<Reveal as="rule" className="mb-14" />
						<div className="grid gap-10 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-20">
							<Reveal className="md:sticky md:top-32 md:h-fit">
								<h2 className="h3">چه چیزی شامل می‌شود</h2>
							</Reveal>
							{/* هر ویژگی یک گره روی خط — همان الگوی روش کار */}
							<ol className="track">
								{service.features.map((f, i) => (
									<li key={f} className="group relative">
										<span className="track__dot" aria-hidden="true" />
										<Reveal delay={i * 70} className="py-6">
											<p className="max-w-[54ch] transition-colors duration-500 group-hover:text-[var(--accent)]">
												{f}
											</p>
										</Reveal>
									</li>
								))}
							</ol>
						</div>
					</section>
				)}

				{related.length > 0 && (
					<section className="py-[clamp(40px,6vw,80px)]">
						<Reveal as="rule" className="mb-14" />
						<h2 className="h3 mb-10">خدمات دیگر</h2>
						<ul className="grid gap-6 md:grid-cols-3">
							{related.map((r, i) => (
								<li key={r.id}>
									<Reveal as="rv-blur" delay={i * 90} className="h-full">
										<article className="panel h-full">
											<span className="panel__edge" aria-hidden="true" />
											<Link href={`/services/${r.slug}`} className="group block h-full p-8">
												<h3 className="h3 transition-colors duration-500 group-hover:text-[var(--accent)]">
													{r.title}
												</h3>
												{r.summary && <p className="body-t mt-3 text-[15px]">{r.summary}</p>}
											</Link>
										</article>
									</Reveal>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>

			<section className="stage stage--c px-[var(--pad)] py-[var(--sec)]">
				<Reveal as="rule" className="mb-[var(--sec)]" />
				<h2 className="display max-w-[14ch]">
					<RevealLines className="sheen" step={130} lines={["شروع", "کنیم؟"]} />
				</h2>
				<Reveal delay={280} className="mt-10">
					<p className="body-t max-w-[52ch]">
						هزینه‌ی هر پروژه به دامنه‌ی کار بستگی دارد. بعد از یک گفتگوی کوتاه، پیشنهاد مکتوب با
						زمان‌بندی و قیمت نهایی دریافت می‌کنید.
					</p>
				</Reveal>
				<Reveal delay={420} className="mt-14 flex flex-wrap items-center gap-x-12 gap-y-6">
					<Link href="/request-project" className="btn btn--solid">
						ثبت درخواست پروژه
					</Link>
					<a href="mailto:info@virgule.studio" className="link-u h3 font-latin" dir="ltr">
						info@virgule.studio
					</a>
				</Reveal>
			</section>
		</>
	)
}
