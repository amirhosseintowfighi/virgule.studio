import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import { Folio } from "@/components/ui/section"
import { Arrow } from "@/components/ui/marks"
import { Closing } from "@/components/marketing/closing"
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { faDate, faIndex, faNum } from "@/lib/fa"

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

	const meta = [
		post.author?.name,
		faDate(post.publishedAt),
		post.readingTime ? `${faNum(post.readingTime)} دقیقه مطالعه` : null,
	].filter(Boolean)

	const paragraphs = post.content
		.split("\n\n")
		.map((p) => p.trim())
		.filter(Boolean)

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

			<article className="wrap pb-[var(--sec)] pt-[clamp(120px,13vw,190px)]">
				<Folio
					label={post.category?.name ?? "یادداشت"}
					aside={
						<Link href="/blog" className="link-u tap">
							همه‌ی یادداشت‌ها
						</Link>
					}
				/>

				<header className="g12 mt-[clamp(40px,6vw,96px)]">
					<h1 className="h1 text-[clamp(2.8rem,6.4vw,6.2rem)] md:col-span-10">{post.title}</h1>
				</header>

				<div className="g12 mt-[clamp(40px,6vw,88px)]">
					{/* ستونِ حاشیه: نویسنده، تاریخ، زمان مطالعه */}
					{meta.length > 0 && (
						<aside className="md:col-span-3">
							<ul className="meta-fa flex flex-wrap gap-x-6 gap-y-1 border-t border-[var(--line-2)] pt-4 md:sticky md:top-28 md:flex-col">
								{meta.map((m) => (
									<li key={m}>{m}</li>
								))}
							</ul>
						</aside>
					)}

					<div className="md:col-span-7 md:col-start-5">
						{post.excerpt && <p className="statement mb-[clamp(28px,3.4vw,52px)]">{post.excerpt}</p>}

						<div className="prose-v max-w-[64ch]">
							{paragraphs.map((para, i) => (
								<p key={i}>{para}</p>
							))}
						</div>

						{/* مسیر /blog/tag/... وجود ندارد؛ برچسب‌ها به جستجوی همان صفحه وصل می‌شوند */}
						{post.tags.length > 0 && (
							<ul className="mt-12 flex flex-wrap gap-2">
								{post.tags.map((t) => (
									<li key={t.id}>
										<Link href={`/blog?q=${encodeURIComponent(t.name)}`} className="tag">
											{t.name}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{related.length > 0 && (
					<section className="mt-[var(--sec)]">
						<Folio label="یادداشت‌های مرتبط" heading />
						<ul className="idx mt-[clamp(24px,3vw,40px)]">
							{related.map((r, i) => (
								<li key={r.id}>
									<Link href={`/blog/${r.slug}`} className="idx__row">
										<span className="idx__n" aria-hidden="true">
											{faIndex(i + 1)}
										</span>
										<h3 className="h3 idx__t">{r.title}</h3>
										{r.excerpt ? <p className="body-t text-[.94rem]">{r.excerpt}</p> : <span />}
										<Arrow className="idx__go text-2xl" />
									</Link>
								</li>
							))}
						</ul>
					</section>
				)}
			</article>

			<Closing
				lines={["پروژه‌ای در", "ذهن دارید؟"]}
				lead="جلسه‌ی اول رایگان است و بدون هیچ الزامی: درباره‌ی هدف پروژه حرف می‌زنیم و صادقانه می‌گوییم که آیا ما گزینه‌ی درستی برای آن هستیم یا نه."
			/>
		</>
	)
}
