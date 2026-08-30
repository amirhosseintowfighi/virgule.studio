import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Magnetic } from "@/components/fx/magnetic"
import { ProjectCover } from "@/components/marketing/project-cover"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"

export const metadata = buildMetadata({
	title: "نمونه‌کارهای طراحی سایت",
	description:
		"پروژه‌هایی که استودیو ویرگول طراحی و پیاده‌سازی کرده است: وب‌سایت شرکتی، فروشگاه اینترنتی و اپلیکیشن وب — همراه با تکنولوژی‌های به‌کاررفته در هرکدام.",
	path: "/portfolio",
})

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

			<PageHead
				lines={[c.headLine1, c.headLine2]}
				lead={c.headLead}
			/>

			<section className="stage stage--l px-[var(--pad)] pb-[var(--sec)]">
				{projects.length === 0 ? (
					<p className="body-t">هنوز پروژه‌ای منتشر نشده است.</p>
				) : (
					<div className="grid gap-x-[clamp(20px,3vw,48px)] gap-y-[clamp(56px,8vw,120px)] md:grid-cols-2">
						{projects.map((p, i) => {
							// هر سومین کار تمام‌عرض می‌شود تا ریتم شبکه یکنواخت نماند
							const wide = i % 3 === 0
							return (
								<article key={p.id} className={wide ? "md:col-span-2" : ""}>
									<Link href={`/portfolio/${p.slug}`} data-cursor="مشاهده" className="group block">
										<Reveal as="img-rv" className="parallax">
											<div
												className={`relative overflow-hidden bg-[var(--bg-2)] ${
													wide ? "aspect-[16/7]" : "aspect-[4/3]"
												}`}
											>
												{p.coverImage ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={p.coverImage}
														alt={`نمونه‌کار ${p.title} — ${p.category?.name ?? "طراحی و توسعه‌ی وب"} توسط استودیو ویرگول`}
														loading="lazy"
														decoding="async"
														className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-[1.04]"
														style={{ transitionTimingFunction: "var(--ease)" }}
													/>
												) : (
													<div
														className="h-full w-full transition-transform duration-[1.6s] group-hover:scale-[1.04]"
														style={{ transitionTimingFunction: "var(--ease)" }}
													>
														<ProjectCover
															title={p.title}
															client={p.client}
															category={p.category?.name}
															year={p.year}
															wide={wide}
														/>
													</div>
												)}
											</div>
										</Reveal>

										{/* دسته و سال روی خودِ جلد آمده‌اند */}
										<div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
											<h2 className="h3 link-u">{p.title}</h2>
											<span
												className="meta-fa accent translate-x-3 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100"
												style={{ transitionTimingFunction: "var(--ease)" }}
												aria-hidden="true"
											>
												مشاهده‌ی پروژه ←
											</span>
										</div>

										{p.summary && <p className="body-t mt-3 max-w-[56ch] text-[15px]">{p.summary}</p>}

										{p.technologies.length > 0 && (
											<ul className="mt-5 flex flex-wrap gap-2">
												{p.technologies.map((t) => (
													<li key={t} className="tag font-latin">
														{t}
													</li>
												))}
											</ul>
										)}
									</Link>
								</article>
							)
						})}
					</div>
				)}
			</section>

			<section className="stage stage--c px-[var(--pad)] py-[var(--sec)]">
				<Reveal as="rule" className="mb-[var(--sec)]" />
				<h2 className="h2 max-w-[16ch]">
					<RevealLines className="sheen" lines={[c.ctaLine1, c.ctaLine2]} />
				</h2>
				<Reveal delay={240} className="mt-10">
					<p className="body-t max-w-[52ch]">{c.ctaLead}</p>
				</Reveal>
				<Reveal delay={380} className="mt-12">
					<Magnetic strength={0.22}>
						<Link href="/request-project" className="btn btn--solid">
							ثبت درخواست پروژه
						</Link>
					</Magnetic>
				</Reveal>
			</section>
		</>
	)
}
