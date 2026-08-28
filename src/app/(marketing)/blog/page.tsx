import type { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PostStatus } from "@prisma/client"
import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"

export const metadata: Metadata = {
	title: "یادداشت‌ها",
	description: "مقالات و آموزش‌های ویرگول درباره‌ی طراحی، توسعه و سئو.",
}

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

	return (
		<>
			<PageHead label="Journal" lines={[<>یادداشت‌ها</>]}>
				<Reveal delay={240} className="mt-10 max-w-md">
					<form action="/blog">
						<label>
							<span className="meta-fa">جستجو</span>
							<input name="q" defaultValue={q} placeholder="در مقالات جستجو کنید…" className="field" />
						</label>
					</form>
				</Reveal>
			</PageHead>

			<div className="px-[var(--pad)] pb-[var(--sec)]">
				{posts.length === 0 ? (
					<p className="body-t">مقاله‌ای پیدا نشد.</p>
				) : (
					<>
						<Reveal as="rule" />
						<ul>
							{posts.map((p, i) => (
								<li key={p.id}>
									<Link href={`/blog/${p.slug}`} className="row-i py-9">
										<div className="relative z-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-baseline md:gap-12">
											<div>
												<div className="mb-3 flex items-center gap-5">
													<span className="meta font-latin">{String(i + 1).padStart(2, "0")}</span>
													{p.category && <span className="meta-fa">{p.category.name}</span>}
												</div>
												<h2 className="row-i__t h3 max-w-[24ch]">{p.title}</h2>
												{p.excerpt && <p className="body-t mt-3 max-w-[62ch] text-[15px]">{p.excerpt}</p>}
											</div>
											<div className="flex items-center gap-5 md:flex-col md:items-end md:gap-2">
												{p.author && <span className="meta-fa">{p.author.name}</span>}
												{p.readingTime && <span className="meta font-latin">{p.readingTime} min</span>}
											</div>
										</div>
									</Link>
									<Reveal as="rule" />
								</li>
							))}
						</ul>
					</>
				)}

				{pages > 1 && (
					<nav className="mt-14 flex gap-6" aria-label="صفحه‌بندی">
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
			</div>
		</>
	)
}
