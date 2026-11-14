import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PageHead, Folio } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { Cta, More } from "@/components/ui/cta"
import { Arrow } from "@/components/ui/marks"
import { Closing } from "@/components/marketing/closing"
import { buildMetadata, JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { faIndex } from "@/lib/fa"

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

	let n = 0

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

			<PageHead label="خدمات" lines={[service.title]} lead={service.summary ?? undefined}>
				<div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
					<Cta href="/request-project" solid>
						درخواست این خدمت
					</Cta>
					<More href="/services">همه‌ی خدمات</More>
				</div>
			</PageHead>

			{paragraphs.length > 0 && (
				<section className="wrap pb-[var(--sec)]">
					<Folio n={++n} label="این خدمت چیست" />
					<div className="g12 mt-[clamp(40px,6vw,88px)]">
						<Reveal className="md:col-span-9 md:col-start-4">
							<p className="statement">{paragraphs[0]}</p>
						</Reveal>
						{paragraphs.length > 1 && (
							<div className="prose-v mt-[clamp(32px,4vw,64px)] md:col-span-6 md:col-start-4">
								{paragraphs.slice(1).map((t, i) => (
									<Reveal key={i} delay={i * 80}>
										<p>{t}</p>
									</Reveal>
								))}
							</div>
						)}
					</div>
				</section>
			)}

			{service.features.length > 0 && (
				<section className="wrap pb-[var(--sec)]">
					<Folio n={++n} label="چه چیزی شامل می‌شود" />
					<ul className="mt-[clamp(32px,4vw,56px)] grid gap-x-[var(--gap)] border-t border-[var(--line-2)] md:grid-cols-2">
						{service.features.map((f, i) => (
							<li key={f} className="border-b border-[var(--line)]">
								<Reveal delay={(i % 2) * 90} className="flex items-baseline gap-6 py-6">
									<span className="idx__n" aria-hidden="true">
										{faIndex(i + 1)}
									</span>
									<span className="h3">{f}</span>
								</Reveal>
							</li>
						))}
					</ul>
				</section>
			)}

			{related.length > 0 && (
				<section className="wrap pb-[var(--sec)]">
					<Folio n={++n} label="خدمات دیگر" />
					<ul className="idx mt-[clamp(32px,4vw,56px)]">
						{related.map((r, i) => (
							<li key={r.id}>
								<Link href={`/services/${r.slug}`} className="idx__row">
									<span className="idx__n" aria-hidden="true">
										{faIndex(i + 1)}
									</span>
									<h3 className="h3 idx__t">{r.title}</h3>
									{r.summary ? <p className="body-t text-[.94rem]">{r.summary}</p> : <span />}
									<Arrow className="idx__go text-2xl" />
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			<Closing
				lines={["شروع", "کنیم؟"]}
				lead="هزینه‌ی هر پروژه به دامنه‌ی کار بستگی دارد. بعد از یک گفتگوی کوتاه، پیشنهاد مکتوب با زمان‌بندی و قیمت نهایی دریافت می‌کنید."
			/>
		</>
	)
}
