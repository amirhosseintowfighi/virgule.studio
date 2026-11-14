import { PageHead, Folio } from "@/components/ui/section"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Closing } from "@/components/marketing/closing"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent, pairs, lines } from "@/lib/content"
import { faIndex } from "@/lib/fa"

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

			<PageHead label="درباره" art={0} lines={[c.headLine1, c.headLine2]} lead={c.headLead} />

			{/* ══════════ داستان ══════════ */}
			<section className="wrap pb-[var(--sec)]">
				<Folio n={1} label="داستان" />
				<div className="g12 mt-[clamp(40px,6vw,88px)]">
					<Reveal className="md:col-span-9 md:col-start-4">
						<p className="statement">{c.storyLead}</p>
					</Reveal>
				</div>
				<div className="g12 mt-[clamp(40px,6vw,88px)]">
					<Reveal delay={100} className="md:col-span-4 md:col-start-4">
						<p className="body-t">{c.storyP1}</p>
					</Reveal>
					<Reveal delay={200} className="md:col-span-4 md:col-start-9">
						<p className="body-t">{c.storyP2}</p>
					</Reveal>
				</div>
			</section>

			{/* ══════════ ارزش‌ها — سه ستون، روی مرکب ══════════ */}
			{values.length > 0 && (
				<section className="ink">
					<div className="wrap py-[var(--sec)]">
						<Folio n={2} label="ارزش‌ها" />
						<h2 className="h1 mt-[clamp(40px,6vw,88px)] max-w-[10ch]">
							<RevealLines lines={[c.valuesLine1, c.valuesLine2]} />
						</h2>
						<ul className="mt-[clamp(48px,7vw,104px)] grid border-t border-[var(--line-2)] md:grid-cols-3">
							{values.map((v, i) => (
								<li
									key={v.t}
									className="border-b border-[var(--line)] py-[clamp(28px,3.4vw,48px)] md:border-b-0 md:border-e md:px-[clamp(20px,2.6vw,44px)] md:first:ps-0 md:last:border-e-0 md:last:pe-0"
								>
									<Reveal delay={i * 110}>
										<span className="numeral text-[1.5rem]" aria-hidden="true">
											{faIndex(i + 1)}
										</span>
										<h3 className="h3 mt-4">{v.t}</h3>
										<p className="body-t mt-4 text-[.94rem]">{v.d}</p>
									</Reveal>
								</li>
							))}
						</ul>
					</div>
				</section>
			)}

			{/* ══════════ مرزِ کار — صراحت، بیشتر از هر ادعایی اعتماد می‌سازد ══════════ */}
			{notForUs.length > 0 && (
				<section className="wrap py-[var(--sec)]">
					<Folio n={3} label="مرزِ کار" />
					<div className="g12 mt-[clamp(40px,6vw,88px)]">
						<div className="md:sticky md:top-28 md:col-span-4 md:h-fit">
							<h2 className="h2">
								<RevealLines lines={[c.boundaryLine1, c.boundaryLine2]} />
							</h2>
							<Reveal delay={200}>
								<p className="body-t mt-8 max-w-[36ch]">{c.boundaryLead}</p>
							</Reveal>
						</div>

						<ul className="border-t border-[var(--line-2)] md:col-span-7 md:col-start-6">
							{notForUs.map((item, i) => (
								<li key={item} className="border-b border-[var(--line)]">
									<Reveal delay={i * 90} className="flex items-baseline gap-6 py-[clamp(24px,3vw,40px)]">
										{/* علامتِ منها: «این را نه» */}
										<span className="h-px w-6 shrink-0 -translate-y-[.4em] bg-[var(--accent)]" aria-hidden="true" />
										<p className="h3 max-w-[30ch]">{item}</p>
									</Reveal>
								</li>
							))}
						</ul>
					</div>
				</section>
			)}

			<Closing lines={[c.ctaLine1, c.ctaLine2]} lead={c.ctaLead} />
		</>
	)
}
