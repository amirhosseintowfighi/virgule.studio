import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Reveal, RevealLines } from "@/components/ui/reveal"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const project = await prisma.project.findUnique({ where: { slug } })
	if (!project) return { title: "نمونه‌کار" }
	return { title: project.title, description: project.summary ?? undefined }
}

/** شماره‌ی فصل‌ها بر اساس فصل‌هایی که واقعاً داده دارند ساخته می‌شود، نه یک قالب ثابت. */
function Chapter({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
	return (
		<section className="py-[clamp(48px,7vw,96px)]">
			<Reveal as="rule" className="mb-10" />
			<div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-16">
				<Reveal className="flex items-baseline gap-4 md:sticky md:top-28 md:h-fit">
					<span className="meta font-latin">{String(n).padStart(2, "0")}</span>
					<h2 className="h3">{title}</h2>
				</Reveal>
				<div>{children}</div>
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

	const paragraphs = (project.content ?? "")
		.split("\n\n")
		.map((p) => p.trim())
		.filter(Boolean)

	const facts = [
		project.client && { k: "کارفرما", v: project.client, latin: false },
		project.year && { k: "سال", v: String(project.year), latin: true },
		project.category && { k: "دسته", v: project.category.name, latin: false },
	].filter(Boolean) as { k: string; v: string; latin: boolean }[]

	let n = 0

	return (
		<>
			<header className="px-[var(--pad)] pb-[clamp(40px,6vw,80px)] pt-[clamp(120px,16vw,200px)]">
				<Reveal className="mb-8">
					<Link href="/portfolio" className="link-u meta-fa">
						→ بازگشت به نمونه‌کارها
					</Link>
				</Reveal>
				<h1 className="h1 max-w-[16ch]">
					<RevealLines lines={[project.title]} />
				</h1>
				{project.summary && (
					<Reveal delay={220}>
						<p className="body-t mt-8 max-w-[56ch]">{project.summary}</p>
					</Reveal>
				)}

				{facts.length > 0 && (
					<Reveal delay={300} className="mt-12 flex flex-wrap gap-x-16 gap-y-6">
						{facts.map((f) => (
							<div key={f.k}>
								<div className="meta-fa mb-2">{f.k}</div>
								<div className={f.latin ? "num font-bold" : "font-bold"}>{f.v}</div>
							</div>
						))}
						{project.url && (
							<div>
								<div className="meta-fa mb-2">لینک</div>
								<a
									href={project.url}
									target="_blank"
									rel="noopener noreferrer"
									className="link-u accent font-bold"
								>
									مشاهده‌ی سایت
								</a>
							</div>
						)}
					</Reveal>
				)}
			</header>

			<div className="px-[var(--pad)]">
				<Reveal as="img-rv" className="card-b">
					<div className="flex aspect-[16/8] items-center justify-center overflow-hidden bg-[var(--bg-2)]">
						{project.coverImage ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={project.coverImage}
								alt={project.title}
								className="h-full w-full object-cover"
								decoding="async"
							/>
						) : (
							<span className="stroke-text display leading-none">{project.title.slice(0, 2)}</span>
						)}
					</div>
				</Reveal>
			</div>

			<div className="px-[var(--pad)] pb-[var(--sec)]">
				{paragraphs.length > 0 && (
					<Chapter n={++n} title="روایت پروژه">
						<div className="space-y-6">
							{paragraphs.map((p, i) => (
								<Reveal key={i} delay={i * 60}>
									<p className="body-t max-w-[62ch] text-[var(--fg)]">{p}</p>
								</Reveal>
							))}
						</div>
					</Chapter>
				)}

				{project.features.length > 0 && (
					<Chapter n={++n} title="آنچه ساخته شد">
						<ul className="max-w-[62ch]">
							{project.features.map((f, i) => (
								<li key={f}>
									<Reveal delay={i * 50} className="flex items-baseline gap-5 border-b-[length:var(--bw-2)] border-[var(--fg)] py-5">
										<span className="meta font-latin">{String(i + 1).padStart(2, "0")}</span>
										<span>{f}</span>
									</Reveal>
								</li>
							))}
						</ul>
					</Chapter>
				)}

				{project.technologies.length > 0 && (
					<Chapter n={++n} title="پشته‌ی فنی">
						<Reveal className="flex flex-wrap gap-x-10 gap-y-4">
							{project.technologies.map((t) => (
								<span key={t} className="font-latin h3 stroke-text">
									{t}
								</span>
							))}
						</Reveal>
					</Chapter>
				)}

				{project.gallery.length > 0 && (
					<Chapter n={++n} title="تصاویر">
						<div className="grid gap-6 sm:grid-cols-2">
							{project.gallery.map((m) => (
								<Reveal key={m.id} as="img-rv" className="card-b">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={m.url}
										alt={m.alt ?? project.title}
										width={m.width ?? undefined}
										height={m.height ?? undefined}
										loading="lazy"
										decoding="async"
										className="w-full"
									/>
								</Reveal>
							))}
						</div>
					</Chapter>
				)}
			</div>

			<section className="border-t border-[var(--line)] px-[var(--pad)] py-[var(--sec)]">
				<h2 className="h2 max-w-[16ch]">
					<RevealLines lines={[<>پروژه‌ای مشابه</>, <>در ذهن دارید؟</>]} />
				</h2>
				<Reveal delay={220} className="mt-10">
					<Link href="/request-project" className="btn btn--solid">
						شروع پروژه
					</Link>
				</Reveal>
			</section>
		</>
	)
}
