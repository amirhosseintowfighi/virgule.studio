import type { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"

export const metadata: Metadata = {
	title: "نمونه‌کارها",
	description: "منتخبی از پروژه‌های ویرگول.",
}

export default async function PortfolioPage() {
	const projects = await prisma.project.findMany({
		orderBy: [{ featured: "desc" }, { order: "asc" }],
		include: { category: true },
	})

	return (
		<>
			<PageHead
				index="02"
				label="Selected Work"
				lines={[<>کارهایی که</>, <>ساخته‌ایم</>]}
				lead="هر پروژه از صفر طراحی و ساخته شده. اینجا فقط کارهایی هست که واقعاً تحویل داده‌ایم."
			/>

			<div className="px-[var(--pad)] pb-[var(--sec)]">
				{projects.length === 0 ? (
					<p className="body-t">هنوز پروژه‌ای منتشر نشده است.</p>
				) : (
					<div className="grid gap-x-8 gap-y-[clamp(48px,7vw,96px)] md:grid-cols-2">
						{projects.map((p, i) => (
							<article key={p.id} className={i % 3 === 0 ? "md:col-span-2" : ""}>
								<Link href={`/portfolio/${p.slug}`} data-cursor="مشاهده" className="group block">
									<Reveal as="img-rv" className="rounded-[var(--radius-lg)]">
										<div
											className={`flex items-center justify-center overflow-hidden bg-[var(--bg-2)] ${
												i % 3 === 0 ? "aspect-[16/7]" : "aspect-[4/3]"
											}`}
										>
											{p.coverImage ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={p.coverImage}
													alt={p.title}
													loading="lazy"
													decoding="async"
													className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.04]"
													style={{ transitionTimingFunction: "var(--ease)" }}
												/>
											) : (
												<span className="stroke-text display leading-none">{p.title.slice(0, 2)}</span>
											)}
										</div>
									</Reveal>
									<div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
										<h2 className="h3 link-u">{p.title}</h2>
										<div className="flex items-center gap-5">
											{p.category && <span className="meta-fa">{p.category.name}</span>}
											{p.year && <span className="meta font-latin">{p.year}</span>}
										</div>
									</div>
									{p.summary && <p className="body-t mt-2 max-w-[58ch] text-[15px]">{p.summary}</p>}
								</Link>
							</article>
						))}
					</div>
				)}
			</div>
		</>
	)
}
