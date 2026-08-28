import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import { Reveal } from "@/components/ui/reveal"
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
			<article>
			<div className="mx-auto max-w-[70ch] px-[var(--pad)] pb-[var(--sec)] pt-[clamp(110px,15vw,180px)]">
				<Reveal className="meta-fa mb-8">
					<Link href="/blog" className="link-u">→ همه‌ی یادداشت‌ها</Link>
				</Reveal>

				{post.category && <div className="meta-fa mb-4">{post.category.name}</div>}
				<h1 className="h1">{post.title}</h1>
				<div className="mt-6 flex flex-wrap items-center gap-6">
					{post.author && <span className="meta-fa">{post.author.name}</span>}
					{post.readingTime && <span className="meta font-latin">{post.readingTime} min read</span>}
				</div>

				<div className="mt-14 space-y-6">
					{post.content.split("\n\n").map((para, i) => (
						<p key={i} className="body-t text-[var(--fg)]">{para}</p>
					))}
				</div>

				<div className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
					{post.tags.map((t) => (
						<Link key={t.id} href={`/blog/tag/${t.slug}`} className="meta-fa link-u">
							#{t.name}
						</Link>
					))}
				</div>

				{related.length > 0 && (
					<div className="mt-20">
						<h2 className="meta font-latin mb-6">Related</h2>
						<div className="grid gap-4 md:grid-cols-3">
							{related.map((r) => (
								<Link key={r.id} href={`/blog/${r.slug}`} className="link-u block border-t border-[var(--line)] pt-4 font-bold">
									{r.title}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
			<script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml} />
		</article>
	)
}
