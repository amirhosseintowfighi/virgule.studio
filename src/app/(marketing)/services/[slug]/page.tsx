import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PageHead } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const service = await prisma.service.findUnique({ where: { slug } })
	if (!service) return { title: "خدمت" }
	return { title: service.title, description: service.summary ?? undefined }
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
			<PageHead label="Service" lines={[service.title]} lead={service.summary ?? undefined}>
				<Reveal delay={320} className="mt-10 flex flex-wrap gap-4">
					<Link href="/request-project" className="btn btn--solid">
						درخواست این خدمت
					</Link>
					<Link href="/contact" className="btn">
						مشاوره‌ی رایگان
					</Link>
				</Reveal>
			</PageHead>

			<div className="px-[var(--pad)] pb-[var(--sec)]">
				{paragraphs.length > 0 && (
					<section className="py-[clamp(40px,6vw,80px)]">
						<Reveal as="rule" className="mb-12" />
						<div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-16">
							<Reveal className="meta font-latin md:sticky md:top-28 md:h-fit">Overview</Reveal>
							<div className="space-y-6">
								{paragraphs.map((p, i) => (
									<Reveal key={i} delay={i * 60}>
										<p className="body-t max-w-[62ch] text-[var(--fg)]">{p}</p>
									</Reveal>
								))}
							</div>
						</div>
					</section>
				)}

				{service.features.length > 0 && (
					<section className="py-[clamp(40px,6vw,80px)]">
						<Reveal as="rule" className="mb-12" />
						<div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-16">
							<Reveal className="meta font-latin md:sticky md:top-28 md:h-fit">Included</Reveal>
							<ul className="max-w-[62ch]">
								{service.features.map((f, i) => (
									<li key={f}>
										<Reveal
											delay={i * 50}
											className="flex items-baseline gap-5 border-b border-[var(--line)] py-5"
										>
											<span className="meta font-latin">{String(i + 1).padStart(2, "0")}</span>
											<span>{f}</span>
										</Reveal>
									</li>
								))}
							</ul>
						</div>
					</section>
				)}

				{related.length > 0 && (
					<section className="py-[clamp(40px,6vw,80px)]">
						<Reveal as="rule" className="mb-12" />
						<h2 className="meta font-latin mb-8">Other services</h2>
						<ul>
							{related.map((r) => (
								<li key={r.id}>
									<Link href={`/services/${r.slug}`} className="row-i py-7">
										<div className="relative z-10 flex items-baseline justify-between gap-6">
											<h3 className="row-i__t h3">{r.title}</h3>
											<span className="row-i__go accent text-xl" aria-hidden="true">
												←
											</span>
										</div>
									</Link>
									<Reveal as="rule" />
								</li>
							))}
						</ul>
					</section>
				)}
			</div>

			<section className="border-t border-[var(--line)] px-[var(--pad)] py-[var(--sec)]">
				<h2 className="h2 max-w-[16ch]">
					<RevealLines lines={[<>شروع کنیم؟</>]} />
				</h2>
				<Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
					<Link href="/request-project" className="btn btn--solid">
						ثبت درخواست پروژه
					</Link>
					<a href="mailto:info@virgule.studio" className="link-u font-latin" dir="ltr">
						info@virgule.studio
					</a>
				</Reveal>
			</section>
		</>
	)
}
