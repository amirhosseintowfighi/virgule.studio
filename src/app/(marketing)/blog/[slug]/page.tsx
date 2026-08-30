import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { buildMetadata, JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo"
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
		include: { author: true, category: true, tags: true, seo: true },
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


	return (
		<>
			<JsonLd
				data={[
					articleJsonLd({
						title: post.seo?.metaTitle ?? post.title,
						description: post.seo?.metaDesc ?? post.excerpt,
						path: `/blog/${post.slug}`,
						published: post.publishedAt,
						modified: post.updatedAt,
						author: post.author?.name,
						image: post.featuredImage,
					}),
					breadcrumbJsonLd([
						{ name: "یادداشت‌ها", path: "/blog" },
						{ name: post.title, path: `/blog/${post.slug}` },
					]),
				]}
			/>
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

				{/* مسیر /blog/tag/... وجود ندارد؛ برچسب‌ها به جستجوی همان صفحه وصل می‌شوند */}
				{post.tags.length > 0 && (
					<ul className="mt-12 flex flex-wrap gap-2">
						{post.tags.map((t) => (
							<li key={t.id}>
								<Link href={`/blog?q=${encodeURIComponent(t.name)}`} className="tag">
									#{t.name}
								</Link>
							</li>
						))}
					</ul>
				)}

				{related.length > 0 && (
					<div className="mt-24">
						<Reveal as="rule" className="mb-10" />
						<h2 className="h3 mb-8">یادداشت‌های مرتبط</h2>
						<div className="grid gap-4 md:grid-cols-3">
							{related.map((r, i) => (
								<Reveal key={r.id} as="rv-blur" delay={i * 90} className="h-full">
									<article className="panel h-full">
										<span className="panel__edge" aria-hidden="true" />
										<Link href={`/blog/${r.slug}`} className="group block h-full p-6">
											<h3 className="font-medium leading-relaxed transition-colors duration-500 group-hover:text-[var(--accent)]">
												{r.title}
											</h3>
										</Link>
									</article>
								</Reveal>
							))}
						</div>
					</div>
				)}
			</div>
		</article>
		</>
	)
}
