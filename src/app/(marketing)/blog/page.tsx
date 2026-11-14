import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PostStatus } from "@prisma/client"
import { PageHead, Folio } from "@/components/ui/section"
import { Arrow } from "@/components/ui/marks"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"
import { faDate, faIndex, faNum } from "@/lib/fa"

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

	const [posts, total, c] = await Promise.all([
		safe(
			prisma.post.findMany({
				where,
				include: { category: true },
				orderBy: { publishedAt: "desc" },
				skip: (current - 1) * PER_PAGE,
				take: PER_PAGE,
			}),
			[]
		),
		safe(prisma.post.count({ where }), 0),
		getContent("blog"),
	])

	const pages = Math.ceil(total / PER_PAGE)
	const pageHref = (n: number) => `/blog?page=${n}${q ? `&q=${encodeURIComponent(q)}` : ""}`

	return (
		<>
			<JsonLd data={breadcrumbJsonLd([{ name: "یادداشت‌ها", path: "/blog" }])} />

			<PageHead label="یادداشت‌ها" art={3} lines={[c.headLine1]} lead={c.headLead}>
				<form action="/blog" role="search" className="mt-8 flex items-end gap-4">
					<label className="block flex-1">
						<span className="label">جستجو در یادداشت‌ها</span>
						<input name="q" type="search" defaultValue={q} className="field" />
					</label>
					<button type="submit" className="btn min-h-[52px] px-5" aria-label="جستجو">
						<Arrow />
					</button>
				</form>
			</PageHead>

			<section className="wrap pb-[var(--sec)]">
				<Folio
					label={q ? `نتیجه‌ی جستجو برای «${q}»` : "همه‌ی یادداشت‌ها"}
					aside={total > 0 ? `${faNum(total)} یادداشت` : undefined}
				/>

				{posts.length === 0 ? (
					<div className="mt-10">
						<p className="h3">یادداشتی پیدا نشد.</p>
						{q && (
							<Link href="/blog" className="link-a tap mt-6">
								نمایش همه‌ی یادداشت‌ها
								<Arrow />
							</Link>
						)}
					</div>
				) : (
					<ul className="idx mt-[clamp(32px,4vw,56px)]">
						{posts.map((p, i) => {
							const meta = [
								p.category?.name,
								faDate(p.publishedAt),
								p.readingTime ? `${faNum(p.readingTime)} دقیقه مطالعه` : null,
							].filter(Boolean)
							return (
								<li key={p.id}>
									<Link href={`/blog/${p.slug}`} className="idx__row !items-start">
										<span className="idx__n" aria-hidden="true">
											{faIndex((current - 1) * PER_PAGE + i + 1)}
										</span>
										<div>
											<h2 className="h2 idx__t max-w-[20ch] text-[clamp(1.9rem,3vw,2.9rem)]">{p.title}</h2>
											{meta.length > 0 && <p className="meta-fa mt-4">{meta.join(" · ")}</p>}
										</div>
										{p.excerpt ? <p className="body-t md:pt-2">{p.excerpt}</p> : <span />}
										<Arrow className="idx__go mt-3 !self-start text-2xl" />
									</Link>
								</li>
							)
						})}
					</ul>
				)}

				{pages > 1 && (
					<nav className="mt-14 flex items-baseline gap-7" aria-label="صفحه‌بندی">
						<span className="meta-fa">صفحه</span>
						{Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
							<Link
								key={n}
								href={pageHref(n)}
								aria-current={n === current ? "page" : undefined}
								className={
									n === current
										? "numeral tap text-[1.6rem]"
										: "serif link-u tap text-[1.6rem] leading-none text-[var(--fg-3)]"
								}
							>
								{faNum(n)}
							</Link>
						))}
					</nav>
				)}
			</section>
		</>
	)
}
