import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import { Container } from "@/components/ui/container"
import Link from "next/link"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const post = await prisma.post.findUnique({ where: { slug }, include: { seo: true } })
	if (!post) return { title: "مقاله" }
	return {
		title: post.seo?.metaTitle ?? post.title,
		description: post.seo?.metaDesc ?? post.excerpt ?? undefined,
		openGraph: { title: post.title, description: post.excerpt ?? undefined, type: "article" },
	}
}

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params
	const post = await prisma.post.findUnique({
		where: { slug },
		include: { author: true, category: true, tags: true },
	})
	if (!post || post.status !== PostStatus.PUBLISHED) notFound()

	// افزایش شمارنده‌ی بازدید
	await prisma.post.update({
		where: { id: post.id },
		data: { views: { increment: 1 } },
	})

	const related = await prisma.post.findMany({
		where: { status: PostStatus.PUBLISHED, categoryId: post.categoryId, NOT: { id: post.id } },
		take: 3,
	})

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		author: { "@type": "Person", name: post.author?.name },
		datePublished: post.publishedAt?.toISOString(),
	}
	const jsonLdHtml = { __html: JSON.stringify(jsonLd) }

	return (
		<article className="py-12 md:py-20">
			<Container className="max-w-3xl">
				{/* Breadcrumb */}
				<nav className="mb-6 text-sm text-[var(--color-muted)]">
					<Link href="/">خانه</Link> / <Link href="/blog">وبلاگ</Link> /{" "}
					<span className="text-[var(--color-ink)]">{post.title}</span>
				</nav>

				<div className="mb-2 text-sm text-[var(--color-primary)]">{post.category?.name}</div>
				<h1 className="text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h1>
				<div className="mt-4 flex items-center gap-4 text-sm text-[var(--color-muted)]">
					<span>{post.author?.name}</span>
					<span className="font-latin">{post.readingTime} دقیقه مطالعه</span>
				</div>

				<div className="prose prose-lg mt-8 max-w-none leading-loose">
					{post.content.split("\n\n").map((para, i) => (
						<p key={i} className="mb-4">{para}</p>
					))}
				</div>

				<div className="mt-8 flex flex-wrap gap-2">
					{post.tags.map((t) => (
						<Link key={t.id} href={`/blog/tag/${t.slug}`} className="rounded-[var(--radius-full)] bg-[var(--color-surface-2)] px-3 py-1 text-xs">
							#{t.name}
						</Link>
					))}
				</div>

				{related.length > 0 && (
					<div className="mt-14">
						<h2 className="mb-4 text-xl font-bold">مقالات مرتبط</h2>
						<div className="grid gap-4 md:grid-cols-3">
							{related.map((r) => (
								<Link key={r.id} href={`/blog/${r.slug}`} className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 text-sm font-semibold hover:shadow-[var(--elev-1)]">
									{r.title}
								</Link>
							))}
						</div>
					</div>
				)}
			</Container>
			<script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml} />
		</article>
	)
}
