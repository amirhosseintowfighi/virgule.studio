import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Folio } from "@/components/ui/section"
import { Cta, More } from "@/components/ui/cta"
import { Arrow } from "@/components/ui/marks"
import { HeroArt, Glyph } from "@/components/ui/art"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { WorkCard } from "@/components/marketing/work-card"
import { Closing } from "@/components/marketing/closing"
import { buildMetadata, JsonLd, faqJsonLd, STUDIO } from "@/lib/seo"
import { getContent, pairs, lines } from "@/lib/content"
import { faIndex, faNum } from "@/lib/fa"

export const metadata = buildMetadata({
	title: "طراحی سایت اختصاصی و توسعه‌ی وب | استودیو ویرگول",
	description:
		"ویرگول استودیوی طراحی و توسعه‌ی وب در تهران است. وب‌سایت شرکتی، فروشگاه اینترنتی و اپلیکیشن وب را از صفر طراحی و با Next.js پیاده‌سازی می‌کنیم — سریع، امن و سئوشده.",
	path: "/",
	absoluteTitle: true,
})

/* داده‌ها از دیتابیس می‌آیند؛ هیچ آمار یا نمونه‌کار ساختگی روی صفحه نیست. */
async function getData() {
	const [projects, services, faqs, c] = await Promise.all([
		safe(
			prisma.project.findMany({
				orderBy: [{ featured: "desc" }, { order: "asc" }],
				take: 4,
				include: { category: true },
			}),
			[]
		),
		safe(prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }), []),
		safe(prisma.faq.findMany({ orderBy: { order: "asc" }, take: 6 }), []),
		getContent("home"),
	])
	return { projects, services, faqs, c }
}

/* ریتمِ شبکه‌ی کارهای منتخب: پهن و باریک، یکی‌درمیان، و ستونِ باریک پایین‌تر می‌نشیند. */
const WORK_LAYOUT = [
	{ col: "md:col-span-7", aspect: "aspect-[4/3]", large: true },
	{ col: "md:col-span-5 md:mt-[clamp(64px,11vw,176px)]", aspect: "aspect-[4/5]", large: false },
	{ col: "md:col-span-5", aspect: "aspect-[4/5]", large: false },
	{ col: "md:col-span-7 md:mt-[clamp(64px,11vw,176px)]", aspect: "aspect-[4/3]", large: true },
]

export default async function HomePage() {
	const { projects, services, faqs, c } = await getData()
	const faqItems = faqs.map((f) => ({ q: f.question, a: f.answer }))
	const process = pairs(c.process)
	const assurances = pairs(c.assurances)
	const promises = lines(c.heroPromises)

	// بخش‌های بی‌داده حذف می‌شوند، پس شماره‌ها از روی بخش‌های واقعاً رندرشده می‌آیند
	let n = 0

	return (
		<>
			{faqItems.length > 0 && <JsonLd data={faqJsonLd(faqItems)} />}

			{/* ══════════ معرفی ══════════
			    متن در راست، تصویر در چپ. کارتِ شیشه‌ای عمداً روی تصویر می‌نشیند —
			    شیشه فقط وقتی معنا دارد که چیزی پشتش باشد. */}
			<section className="wrap pt-[76px]">
				<div className="g12 items-center pb-[clamp(56px,7vw,112px)] pt-[clamp(32px,5vw,72px)] md:min-h-[calc(100svh-76px)]">
					<div className="md:col-span-6">
						<Reveal className="meta-fa flex items-center gap-3">
							<span className="h-px w-8 bg-[var(--accent)]" aria-hidden="true" />
							{`استودیوی طراحی و توسعه‌ی وب — ${STUDIO.city}، از سال ${STUDIO.foundedFa}`}
						</Reveal>

						<h1 className="display mt-[clamp(20px,2.4vw,36px)]">
							<RevealLines step={130} lines={[c.heroLine1, `${c.heroLine2} ${c.heroAccent}`]} />
						</h1>

						<Reveal delay={320} className="mt-[clamp(24px,2.8vw,40px)]">
							<p className="lead max-w-[38ch]">{c.heroLead}</p>
						</Reveal>

						<Reveal delay={440} className="mt-[clamp(28px,3vw,44px)] flex flex-wrap items-center gap-4">
							<Cta href="/request-project" solid>
								{c.heroCtaPrimary}
							</Cta>
							<Cta href="/portfolio">{c.heroCtaSecondary}</Cta>
						</Reveal>
					</div>

					<div className="relative md:col-span-5 md:col-start-8">
						<Reveal as="art-rv">
							<HeroArt className="mx-auto max-w-[min(100%,58svh)]" />
						</Reveal>

						{/* قول‌های کوتاه — همان‌هایی که پایین‌تر مفصل آمده‌اند */}
						{promises.length > 0 && (
							<Reveal delay={700} className="absolute bottom-[4%] start-0 w-[min(78%,300px)] md:-start-[8%]">
								<ul className="glass divide-y divide-[var(--line)] px-5 py-1 text-[.9rem] font-medium">
									{promises.map((t) => (
										<li key={t} className="flex items-center gap-3 py-3">
											<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
											{t}
										</li>
									))}
								</ul>
							</Reveal>
						)}
					</div>
				</div>
			</section>

			{/* ══════════ کارهای منتخب — اول مدرک، بعد ادعا ══════════ */}
			{projects.length > 0 && (
				<section id="work" className="wrap py-[var(--sec)]">
					<Folio n={++n} label="نمونه‌کارها" aside="کارهای منتخب" />
					<div className="g12 mt-[clamp(40px,6vw,88px)] items-end">
						<h2 className="h2 md:col-span-6">
							<RevealLines lines={[c.workLine1, c.workLine2]} />
						</h2>
						<Reveal delay={200} className="md:col-span-4 md:col-start-9">
							<p className="body-t">{c.workLead}</p>
						</Reveal>
					</div>

					<div className="g12 mt-[clamp(48px,7vw,104px)] !gap-y-[clamp(56px,7vw,104px)]">
						{projects.map((p, i) => {
							const l = WORK_LAYOUT[i % WORK_LAYOUT.length]
							return (
								<WorkCard key={p.id} project={p} index={i} aspect={l.aspect} large={l.large} className={l.col} />
							)
						})}
					</div>

					<Reveal className="mt-[clamp(48px,6vw,88px)] flex justify-end border-t border-[var(--line-2)] pt-6">
						<More href="/portfolio">{c.workCta}</More>
					</Reveal>
				</section>
			)}

			{/* ══════════ درباره — یک جمله، بزرگ ══════════ */}
			<section id="about" className="wrap py-[var(--sec)]">
				<Folio n={++n} label="استودیو" aside={`${STUDIO.city}، از سال ${STUDIO.foundedFa}`} />
				<div className="g12 mt-[clamp(40px,6vw,88px)]">
					<h2 className="meta-fa md:col-span-3">{`${c.aboutLine1} ${c.aboutLine2}`}</h2>
					<Reveal className="md:col-span-9">
						<p className="statement">{c.aboutPull}</p>
					</Reveal>
				</div>
				<div className="g12 mt-[clamp(40px,6vw,88px)]">
					<Reveal delay={100} className="md:col-span-4 md:col-start-4">
						<p className="body-t">{c.aboutP1}</p>
					</Reveal>
					<Reveal delay={200} className="md:col-span-4 md:col-start-9">
						<p className="body-t">{c.aboutP2}</p>
						<More href="/about" className="mt-8">
							بیشتر درباره‌ی ما
						</More>
					</Reveal>
				</div>
			</section>

			{/* ══════════ خدمات — فهرست، مثل فهرستِ کتاب ══════════ */}
			{services.length > 0 && (
				<section id="services" className="wrap py-[var(--sec)]">
					<Folio n={++n} label="خدمات" aside={`${faNum(services.length)} خدمت`} />
					<div className="g12 mt-[clamp(40px,6vw,88px)] items-end">
						<h2 className="h2 md:col-span-6">
							<RevealLines lines={[c.servicesLine1, c.servicesLine2]} />
						</h2>
						<Reveal delay={200} className="md:col-span-4 md:col-start-9">
							<p className="body-t">{c.servicesLead}</p>
						</Reveal>
					</div>

					<ul className="idx mt-[clamp(40px,5vw,72px)]">
						{services.map((s, i) => (
							<li key={s.id}>
								<Link href={`/services/${s.slug}`} className="idx__row">
									<Glyph i={i} className="idx__n self-center" />
									<h3 className="h3 idx__t">{s.title}</h3>
									{s.summary && <p className="body-t text-[.94rem]">{s.summary}</p>}
									<Arrow className="idx__go text-2xl" />
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* ══════════ روش کار ══════════ */}
			{process.length > 0 && (
				<section id="process" className="wrap py-[var(--sec)]">
					<Folio n={++n} label="روش کار" aside={`${faNum(process.length)} مرحله`} />
					<div className="g12 mt-[clamp(40px,6vw,88px)]">
						<div className="md:sticky md:top-28 md:col-span-4 md:h-fit">
							<h2 className="h2">
								<RevealLines lines={[c.processLine1, c.processLine2]} />
							</h2>
							<Reveal delay={200}>
								<p className="body-t mt-8 max-w-[38ch]">{c.processLead}</p>
							</Reveal>
						</div>

						<ol className="border-t border-[var(--line-2)] md:col-span-7 md:col-start-6">
							{process.map((s, i) => (
								<li key={s.t} className="border-b border-[var(--line)]">
									<Reveal className="grid grid-cols-[3.4rem_1fr] gap-x-4 py-[clamp(26px,3.2vw,44px)] md:grid-cols-[6rem_minmax(0,14rem)_1fr] md:gap-x-8">
										<span className="numeral text-[clamp(2.6rem,4.4vw,4.2rem)]" aria-hidden="true">
											{faNum(i + 1)}
										</span>
										<h3 className="h3 self-center md:self-start md:pt-1">{s.t}</h3>
										<p className="body-t col-start-2 mt-3 text-[.94rem] md:col-start-3 md:mt-1">{s.d}</p>
									</Reveal>
								</li>
							))}
						</ol>
					</div>
				</section>
			)}

			{/* ══════════ تعهدها — روی مرکب ══════════ */}
			{assurances.length > 0 && (
				<section id="assurances" className="ink">
					<div className="wrap py-[var(--sec)]">
						<Folio n={++n} label="تعهدها" aside="آنچه مکتوب می‌شود" />
						<h2 className="h1 mt-[clamp(40px,6vw,88px)] max-w-[12ch]">
							<RevealLines lines={[c.assurancesLine1, c.assurancesLine2]} />
						</h2>

						<ul className="mt-[clamp(48px,7vw,104px)] grid border-t border-[var(--line-2)] md:grid-cols-2">
							{assurances.map((a, i) => (
								<li
									key={a.t}
									className="border-b border-[var(--line)] py-[clamp(28px,3.4vw,52px)] md:odd:border-e md:odd:pe-[clamp(24px,4vw,72px)] md:even:ps-[clamp(24px,4vw,72px)]"
								>
									<Reveal delay={(i % 2) * 120}>
										<span className="numeral text-[1.5rem]" aria-hidden="true">
											{faIndex(i + 1)}
										</span>
										<h3 className="h3 mt-4">{a.t}</h3>
										<p className="body-t mt-4 max-w-[46ch] text-[.94rem]">{a.d}</p>
									</Reveal>
								</li>
							))}
						</ul>
					</div>
				</section>
			)}

			{/* ══════════ پرسش‌های متداول ══════════ */}
			{faqItems.length > 0 && (
				<section id="faq" className="wrap py-[var(--sec)]">
					<Folio n={++n} label="پرسش‌ها" />
					<div className="g12 mt-[clamp(40px,6vw,88px)]">
						<div className="md:sticky md:top-28 md:col-span-4 md:h-fit">
							<h2 className="h2">
								<RevealLines lines={[c.faqLine1, c.faqLine2]} />
							</h2>
							<Reveal delay={200}>
								<p className="body-t mt-8 max-w-[32ch]">{c.faqLead}</p>
								<More href="/faq" className="mt-8">
									همه‌ی پرسش‌ها
								</More>
							</Reveal>
						</div>
						<div className="md:col-span-7 md:col-start-6">
							<FaqAccordion items={faqItems} />
						</div>
					</div>
				</section>
			)}

			<Closing lines={[c.contactLine1, c.contactLine2]} lead={c.contactLead} cta={c.contactCta} />
		</>
	)
}
