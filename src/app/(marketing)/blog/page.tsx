import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PostStatus } from "@prisma/client"
import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"

export const metadata = buildMetadata({
	title: "یادداشت‌های طراحی و توسعه‌ی وب",
	description:
		"آنچه در پروژه‌های واقعی یاد گرفته‌ایم: طراحی رابط کاربری، سرعت سایت، سئوی فنی و تصمیم‌های مهندسی — بدون کلی‌گویی.",
	path: "/blog",
})

type Props = { searchParams: Promise<{ page?: string; q?: string }> }

const PER_PAGE = 9

export default async function BlogPage({ searchParams }: Props) {
	const { page = "1", q } = await searchParams
	const current = Math.max(1, Number(page) || 1)

	const where = {
		status: PostStatus.PUBLISHED,
		...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
	}

	const [posts, total] = await Promise.all([
		safe(
			prisma.post.findMany({
				where,
				include: { author: true, category: true },
				orderBy: { publishedAt: "desc" },
				skip: (current - 1) * PER_PAGE,
				take: PER_PAGE,
			}),
			[]
		),
		safe(prisma.post.count({ where }), 0),
	])

	const pages = Math.ceil(total / PER_PAGE)
	const c = await getContent("blog")

	return (
		<>
			<PageHead
				lines={[c.headLine1]}
				lead={c.headLead}
			>
				<Reveal delay={320} className="mt-10 max-w-md">
					<form action="/blog">
						<label>
							<span className="label">جستجو</span>
							<input name="q" defaultValue={q} placeholder="در یادداشت‌ها جستجو کنید…" className="field" />
						</label>
					</form>
				</Reveal>
			</PageHead>

			<section className="stage stage--l px-[var(--pad)] pb-[var(--sec)]">
				{posts.length === 0 ? (
					<p className="body-t">مقاله‌ای پیدا نشد.</p>
				) : (
					/* هر یادداشت یک تخته — همان سطحی که در بقیه‌ی سایت استفاده می‌شود */
					<ul className="grid gap-6 md:grid-cols-2">
						{posts.map((p, i) => (
							<li key={p.id} className={i % 3 === 0 ? "md:col-span-2" : ""}>
								<Reveal as="rv-blur" delay={(i % 3) * 90} className="h-full">
									<article className="panel h-full">
										<span className="panel__edge" aria-hidden="true" />
										<Link href={`/blog/${p.slug}`} className="group block h-full p-[clamp(22px,3vw,44px)]">
											<div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2">
												{p.category && <span className="meta-fa">{p.category.name}</span>}
												{p.readingTime && (
													<span className="meta font-latin">{p.readingTime} min</span>
												)}
											</div>

											<h2 className="h3 max-w-[26ch] transition-colors duration-500 group-hover:text-[var(--accent)]">
												{p.title}
											</h2>
											{p.excerpt && <p className="body-t mt-4 max-w-[60ch] text-[15px]">{p.excerpt}</p>}

											<div className="mt-8 flex flex-wrap items-center justify-between gap-4">
												{p.author && <span className="meta-fa">{p.author.name}</span>}
												<span
													className="meta-fa accent translate-x-3 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100"
													style={{ transitionTimingFunction: "var(--ease)" }}
													aria-hidden="true"
												>
													خواندن ←
												</span>
											</div>
										</Link>
									</article>
								</Reveal>
							</li>
						))}
					</ul>
				)}

				{pages > 1 && (
					<nav className="mt-16 flex gap-6" aria-label="صفحه‌بندی">
						{Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
							<Link
								key={n}
								href={`/blog?page=${n}${q ? `&q=${q}` : ""}`}
								aria-current={n === current ? "page" : undefined}
								className={n === current ? "num accent font-bold" : "num link-u text-[var(--fg-3)]"}
							>
								{String(n).padStart(2, "0")}
							</Link>
						))}
					</nav>
				)}
			</section>
		</>
	)
}
