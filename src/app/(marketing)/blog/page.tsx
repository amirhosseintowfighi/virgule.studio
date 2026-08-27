import type { Metadata } from "next"
import prisma from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/container"
import Link from "next/link"

export const metadata: Metadata = {
	title: "وبلاگ",
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
		prisma.post.findMany({
			where,
			include: { author: true, category: true },
			orderBy: { publishedAt: "desc" },
			skip: (current - 1) * PER_PAGE,
			take: PER_PAGE,
		}),
		prisma.post.count({ where }),
	])

	const pages = Math.ceil(total / PER_PAGE)

	return (
		<Section eyebrow="وبلاگ" title="آخرین مقالات">
			<form className="mx-auto mb-10 max-w-md" action="/blog">
				<input
					name="q"
					defaultValue={q}
					placeholder="جستجو در مقالات..."
					className="w-full rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm"
				/>
			</form>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{posts.map((p) => (
					<Link key={p.id} href={`/blog/${p.slug}`}>
						<Card className="h-full">
							<div className="mb-1 text-xs text-[var(--color-primary)]">{p.category?.name}</div>
							<h3 className="mb-2 font-bold leading-snug">{p.title}</h3>
							<p className="text-sm text-[var(--color-muted)]">{p.excerpt}</p>
							<div className="mt-4 flex items-center justify-between text-xs text-[var(--color-muted)]">
								<span>{p.author?.name}</span>
								<span className="font-latin">{p.readingTime} دقیقه</span>
							</div>
						</Card>
					</Link>
				))}
			</div>

			{pages > 1 && (
				<div className="mt-10 flex justify-center gap-2">
					{Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
						<Link
							key={n}
							href={`/blog?page=${n}${q ? `&q=${q}` : ""}`}
							className={`font-latin rounded-[var(--radius-md)] border px-4 py-2 text-sm ${
								n === current
									? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
									: "border-[var(--color-border)]"
							}`}
						>
							{n}
						</Link>
					))}
				</div>
			)}
		</Section>
	)
}
