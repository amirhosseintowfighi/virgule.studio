import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Folio } from "@/components/ui/section"
import { Arrow, ArrowOut } from "@/components/ui/marks"
import { ProjectCover } from "@/components/marketing/project-cover"
import { Closing } from "@/components/marketing/closing"
import { buildMetadata, JsonLd, projectJsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { faIndex, faNum } from "@/lib/fa"
import { projectMedia, hostOf, SCREENSHOT_SIZE } from "@/lib/project-media"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const project = await prisma.project.findUnique({ where: { slug } })
	if (!project) return { title: "نمونه‌کار پیدا نشد" }
	return buildMetadata({
		title: `${project.title} — نمونه‌کار`,
		description:
			project.summary ?? `${project.title}؛ پروژه‌ای که استودیو ویرگول طراحی و پیاده‌سازی کرده است.`,
		path: `/portfolio/${project.slug}`,
		...(project.coverImage ? { image: project.coverImage } : {}),
	})
}

/**
 * دکمه‌ی «سایتِ زنده»: هم بالای صفحه می‌آید هم پایانِ روایت، تا بازدیدکننده هر جا که
 * قانع شد بتواند خودِ کار را ببیند. نام دامنه چپ‌به‌راست نوشته می‌شود.
 */
function LiveLink({ url, className }: { url: string; className?: string }) {
	return (
		<a href={url} target="_blank" rel="noopener noreferrer" className={`btn btn--solid ${className ?? ""}`}>
			<span>مشاهده وب‌سایت زنده</span>
			<span className="font-latin text-[.86em] opacity-80" dir="ltr">
				{hostOf(url)}
			</span>
			<ArrowOut />
		</a>
	)
}

/** شماره‌ی فصل‌ها بر اساس فصل‌هایی که واقعاً داده دارند ساخته می‌شود، نه یک قالب ثابت. */
function Chapter({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
	return (
		<section className="pt-[clamp(56px,7vw,112px)]">
			<Folio n={n} label={title} />
			<div className="g12 mt-[clamp(32px,4vw,64px)]">
				<div className="md:col-span-8 md:col-start-5">{children}</div>
			</div>
		</section>
	)
}

export default async function PortfolioDetailPage({ params }: Props) {
	const { slug } = await params
	const project = await prisma.project.findUnique({
		where: { slug },
		include: { category: true, gallery: true },
	})
	if (!project) notFound()

	// ترتیبِ همان صفحه‌ی فهرست — تا «پروژه‌ی بعدی» همان چیزی باشد که بازدیدکننده انتظار دارد
	const order = await safe(
		prisma.project.findMany({
			orderBy: [{ featured: "desc" }, { order: "asc" }],
			select: { slug: true, title: true },
		}),
		[]
	)
	const at = order.findIndex((p) => p.slug === project.slug)
	const next = order.length > 1 ? order[(at + 1) % order.length] : null

	const paragraphs = (project.content ?? "")
		.split("\n\n")
		.map((p) => p.trim())
		.filter(Boolean)

	const facts = [
		project.client && { k: "کارفرما", v: project.client },
		project.category && { k: "دسته", v: project.category.name },
		project.year && { k: "سال", v: faNum(project.year) },
	].filter(Boolean) as { k: string; v: string }[]

	const media = projectMedia(project.slug)
	const name = project.title.split(" — ")[0]

	let n = 0

	return (
		<>
			<JsonLd
				data={[
					projectJsonLd({
						title: project.title,
						description: project.summary,
						path: `/portfolio/${project.slug}`,
						image: project.coverImage,
						year: project.year,
					}),
					breadcrumbJsonLd([
						{ name: "نمونه‌کارها", path: "/portfolio" },
						{ name: project.title, path: `/portfolio/${project.slug}` },
					]),
				]}
			/>

			<header className="wrap pb-[clamp(40px,5vw,72px)] pt-[clamp(120px,13vw,190px)]">
				<Folio
					label="نمونه‌کار"
					aside={
						<Link href="/portfolio" className="link-u tap">
							بازگشت به همه‌ی کارها
						</Link>
					}
				/>
				<div className="g12 mt-[clamp(40px,6vw,96px)] items-end">
					<h1 className="h1 md:col-span-8">
						<RevealLines lines={[project.title]} />
					</h1>
					{project.summary && (
						<Reveal delay={220} className="md:col-span-4 md:pb-3">
							<p className="lead">{project.summary}</p>
						</Reveal>
					)}
				</div>

				{project.url && (
					<Reveal delay={260} className="mt-[clamp(28px,3.4vw,48px)]">
						<LiveLink url={project.url} />
					</Reveal>
				)}

				{facts.length > 0 && (
					<Reveal delay={300}>
						<dl className="mt-[clamp(40px,5vw,72px)] grid grid-cols-2 gap-x-[var(--gap)] gap-y-6 border-t border-[var(--line-2)] pt-6 md:grid-cols-4">
							{facts.map((f) => (
								<div key={f.k}>
									<dt className="meta-fa">{f.k}</dt>
									<dd className="t-title m-0 mt-1">{f.v}</dd>
								</div>
							))}
						</dl>
					</Reveal>
				)}
			</header>

			<div className="wrap">
				<Reveal as="img-rv">
					<div className="aspect-[4/3] overflow-hidden rounded-[var(--r)] bg-[var(--bg-2)] md:aspect-[16/8]">
						{project.coverImage ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={project.coverImage}
								alt={`${project.title} — نمای اصلی پروژه`}
								className="h-full w-full object-cover"
								decoding="async"
								fetchPriority="high"
							/>
						) : (
							<ProjectCover slug={project.slug} title={project.title} index={Math.max(at, 0)} />
						)}
					</div>
				</Reveal>
			</div>

			<div className="wrap pb-[var(--sec)]">
				{media.screenshot && (
					<section className="pt-[clamp(56px,7vw,112px)]">
						<Folio n={++n} label="صفحه‌ی اصلی" aside="نمای دسکتاپ" />
						<Reveal className="mt-[clamp(32px,4vw,64px)]">
							<figure className="browser m-0">
								<div className="browser__bar" aria-hidden="true">
									<span className="browser__dots">
										<i />
										<i />
										<i />
									</span>
									<span className="font-latin" dir="ltr">
										{project.url ? hostOf(project.url) : name}
									</span>
									<span />
								</div>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={media.screenshot}
									alt={`صفحه‌ی اصلی وب‌سایت ${name}، نمای دسکتاپ`}
									width={SCREENSHOT_SIZE.width}
									height={SCREENSHOT_SIZE.height}
									loading="lazy"
									decoding="async"
								/>
							</figure>
						</Reveal>
					</section>
				)}

				{paragraphs.length > 0 && (
					<Chapter n={++n} title="روایت پروژه">
						<Reveal>
							<p className="statement">{paragraphs[0]}</p>
						</Reveal>
						{paragraphs.length > 1 && (
							<div className="prose-v mt-[clamp(28px,3.4vw,52px)] max-w-[62ch]">
								{paragraphs.slice(1).map((p, i) => (
									<Reveal key={i} delay={i * 60}>
										<p>{p}</p>
									</Reveal>
								))}
							</div>
						)}
					</Chapter>
				)}

				{project.features.length > 0 && (
					<Chapter n={++n} title="آنچه ساخته شد">
						<ul className="border-t border-[var(--line-2)]">
							{project.features.map((f, i) => (
								<li key={f} className="border-b border-[var(--line)]">
									<Reveal delay={i * 50} className="flex items-baseline gap-6 py-5">
										<span className="idx__n" aria-hidden="true">
											{faIndex(i + 1)}
										</span>
										<span className="h3">{f}</span>
									</Reveal>
								</li>
							))}
						</ul>
					</Chapter>
				)}

				{project.technologies.length > 0 && (
					<Chapter n={++n} title="پشته‌ی فنی">
						<Reveal>
							<ul className="flex flex-wrap gap-x-10 gap-y-2" dir="ltr">
								{project.technologies.map((t) => (
									<li key={t} className="h2 !font-normal text-[clamp(2rem,3.6vw,3.4rem)]">
										{t}
									</li>
								))}
							</ul>
						</Reveal>
					</Chapter>
				)}

				{project.gallery.length > 0 && (
					<Chapter n={++n} title="تصاویر">
						<div className="grid gap-[var(--gap)] sm:grid-cols-2">
							{project.gallery.map((m) => (
								<Reveal key={m.id} as="img-rv">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={m.url}
										alt={m.alt ?? project.title}
										width={m.width ?? undefined}
										height={m.height ?? undefined}
										loading="lazy"
										decoding="async"
										className="h-auto w-full"
									/>
								</Reveal>
							))}
						</div>
					</Chapter>
				)}

				{project.url && (
					<div className="mt-[clamp(56px,7vw,112px)] flex flex-wrap items-center justify-between gap-6 border-t border-[var(--line-2)] pt-8">
						<p className="h3 max-w-[22ch]">خودِ کار را ببینید.</p>
						<LiveLink url={project.url} />
					</div>
				)}

				{next && (
					<Link
						href={`/portfolio/${next.slug}`}
						className="group mt-[clamp(72px,9vw,144px)] flex items-end justify-between gap-8 border-t border-[var(--fg)] pt-6"
					>
						<span>
							<span className="meta-fa block">پروژه‌ی بعدی</span>
							<span className="h2 mt-3 block transition-colors duration-500 group-hover:text-[var(--accent)]">
								{next.title}
							</span>
						</span>
						<Arrow className="mb-2 text-4xl transition-transform duration-500 group-hover:-translate-x-2" />
					</Link>
				)}
			</div>

			<Closing
				lines={["پروژه‌ای مشابه", "در ذهن دارید؟"]}
				lead="پروژه‌تان را برایمان تعریف کنید. جلسه‌ی اول رایگان است و اگر کار به ما نخورد، همان‌جا صادقانه می‌گوییم."
			/>
		</>
	)
}
