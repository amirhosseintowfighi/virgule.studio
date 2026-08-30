import Link from "next/link"
import { PageHead } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Magnetic } from "@/components/fx/magnetic"
import { MarkBackdrop } from "@/components/fx/mark-backdrop"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent, pairs, lines } from "@/lib/content"

export const metadata = buildMetadata({
	title: "درباره‌ی استودیو ویرگول",
	description:
		"ویرگول یک استودیوی کوچک طراحی و توسعه‌ی وب در تهران است؛ طراحی و مهندسی در یک تیم. اینجا می‌خوانید چطور کار می‌کنیم، به چه چیزی پایبندیم و برای چه پروژه‌هایی گزینه‌ی درستی نیستیم.",
	path: "/about",
})

export default async function AboutPage() {
	const c = await getContent("about")
	const values = pairs(c.values)
	const notForUs = lines(c.notForUs)

	return (
		<>
			<JsonLd data={breadcrumbJsonLd([{ name: "درباره‌ی ما", path: "/about" }])} />

			<PageHead
				lines={[c.headLine1, c.headLine2]}
				lead={c.headLead}
			/>

			{/* ══════════ داستان ══════════ */}
			<section className="stage stage--r relative px-[var(--pad)] pb-[var(--sec)]">
				<MarkBackdrop className="pointer-events-none absolute -top-[10%] left-[-18%] hidden h-[min(64vh,560px)] w-[min(64vh,560px)] opacity-70 md:block" />
				<div className="relative z-10 grid gap-14 md:grid-cols-2 md:gap-24">
					<Reveal as="rv-blur">
						<p className="lead">{c.storyLead}</p>
					</Reveal>
					<Reveal delay={200}>
						<p className="body-t">{c.storyP1}</p>
						<p className="body-t mt-8">{c.storyP2}</p>
					</Reveal>
				</div>
			</section>

			{/* ══════════ ارزش‌ها — پشته‌ی چسبان، مثل خدمات ══════════ */}
			<section className="stage stage--tl px-[var(--pad)] pb-[var(--sec)]">
				<h2 className="h2 mb-16 max-w-[16ch]">
					<RevealLines lines={[c.valuesLine1, c.valuesLine2]} />
				</h2>

				<ul className="stack">
					{values.map((v, i) => (
						<li key={v.t} className="stack__i" style={{ "--i": i } as React.CSSProperties}>
							<article className="panel flex min-h-[clamp(280px,42svh,420px)] flex-col p-[clamp(24px,4vw,64px)]">
								<span className="panel__edge" aria-hidden="true" />
								<span className="panel__ghost num" aria-hidden="true">
									{String(i + 1).padStart(2, "0")}
								</span>
								<div className="my-auto grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-16">
									<h3 className="h2 text-[clamp(1.5rem,2.4vw,2.2rem)]">{v.t}</h3>
									<p className="body-t max-w-[58ch]">{v.d}</p>
								</div>
							</article>
						</li>
					))}
				</ul>
			</section>

			{/* ══════════ مرزِ کار — صراحت، بیشتر از هر ادعایی اعتماد می‌سازد ══════════ */}
			<section className="stage stage--br px-[var(--pad)] pb-[var(--sec)]">
				<div className="grid gap-12 md:grid-cols-[minmax(0,24rem)_1fr] md:gap-28">
					<div className="md:sticky md:top-32 md:h-fit">
						<h2 className="h2 max-w-[14ch]">
							<RevealLines lines={[c.boundaryLine1, c.boundaryLine2]} />
						</h2>
						<Reveal delay={200}>
							<p className="body-t mt-8 max-w-[36ch]">{c.boundaryLead}</p>
						</Reveal>
					</div>

					<ol className="track">
						{notForUs.map((n, i) => (
							<li key={n} className="group relative">
								<span className="track__dot" aria-hidden="true" />
								<Reveal as="rv-blur" delay={i * 90} className="py-10">
									<p className="body-t max-w-[54ch] text-[var(--fg)]">{n}</p>
								</Reveal>
							</li>
						))}
					</ol>
				</div>
			</section>

			{/* ══════════ تماس ══════════ */}
			<section className="stage stage--c px-[var(--pad)] py-[var(--sec)]">
				<Reveal as="rule" className="mb-[var(--sec)]" />
				<h2 className="display max-w-[14ch]">
					<RevealLines className="sheen" step={130} lines={[c.ctaLine1, c.ctaLine2]} />
				</h2>
				<Reveal delay={280} className="mt-10">
					<p className="body-t max-w-[50ch]">{c.ctaLead}</p>
				</Reveal>
				<Reveal delay={420} className="mt-14 flex flex-wrap items-center gap-x-12 gap-y-6">
					<Magnetic strength={0.22}>
						<Link href="/request-project" className="btn btn--solid">
							ثبت درخواست پروژه
						</Link>
					</Magnetic>
					<Link href="/portfolio" className="link-u tap font-medium">
						دیدن نمونه‌کارها ←
					</Link>
				</Reveal>
			</section>
		</>
	)
}
