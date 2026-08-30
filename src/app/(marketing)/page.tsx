import { Fragment } from "react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Magnetic } from "@/components/fx/magnetic"
import { Spotlight } from "@/components/fx/spotlight"
import { MarkBackdrop } from "@/components/fx/mark-backdrop"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { ProjectCover } from "@/components/marketing/project-cover"
import { WorkRail } from "@/components/marketing/work-rail"
import { buildMetadata, JsonLd, faqJsonLd } from "@/lib/seo"
import { getContent, pairs } from "@/lib/content"

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

export default async function HomePage() {
	const { projects, services, faqs, c } = await getData()
	const faqItems = faqs.map((f) => ({ q: f.question, a: f.answer }))
	const process = pairs(c.process)
	const assurances = pairs(c.assurances)

	return (
		<>
			{faqItems.length > 0 && <JsonLd data={faqJsonLd(faqItems)} />}

			{/* ══════════ معرفی ══════════ */}
			<Spotlight className="stage spot relative flex min-h-[100svh] flex-col justify-center px-[var(--pad)] pb-28 pt-40">
				{/* نشان برند، بزرگ و کم‌نور — لنگرِ بصری سمت چپ، در برابر تیتر راست‌چین */}
				<MarkBackdrop className="pointer-events-none absolute left-[-26%] top-[6%] h-[min(46vh,380px)] w-[min(46vh,380px)] opacity-60 md:left-[-6%] md:top-1/2 md:h-[min(86vh,900px)] md:w-[min(86vh,900px)] md:-translate-y-1/2 md:opacity-100" />

				<div className="relative z-10">
					<h1 className="display max-w-[15ch]">
						<RevealLines
							className="sheen"
							step={130}
							// رشته‌ها کلید نمی‌خواهند؛ تنها خطی که نشانه‌گذاری درونی دارد کلید می‌گیرد
							lines={[
								c.heroLine1,
								<Fragment key="accent">
									{c.heroLine2} <span className="accent">{c.heroAccent}</span>
								</Fragment>,
							]}
						/>
					</h1>

					<Reveal as="rv-blur" delay={420} className="mt-12">
						<p className="lead max-w-[34ch]">{c.heroLead}</p>
					</Reveal>

					<Reveal delay={580} className="mt-12 flex flex-wrap items-center gap-4">
						<Magnetic strength={0.22}>
							<Link href="/request-project" className="btn btn--solid">
								{c.heroCtaPrimary}
							</Link>
						</Magnetic>
						<Magnetic strength={0.22}>
							<Link href="/portfolio" className="btn">
								{c.heroCtaSecondary}
							</Link>
						</Magnetic>
					</Reveal>
				</div>

				<Reveal delay={760} className="relative z-10 mt-24 flex items-center gap-4">
					<span className="meta">Scroll</span>
					<span className="h-px w-14 bg-[var(--accent-line)]" />
				</Reveal>
			</Spotlight>

			{/* ══════════ چه کاری انجام می‌دهیم ══════════ */}
			{/* بدون داده، عنوانِ تنها روی فضای خالی می‌نشیند — پس کل بخش حذف می‌شود. */}
			{services.length > 0 && (
				<section id="services" className="stage stage--r px-[var(--pad)] py-[var(--sec)]">
					<div className="mb-16 grid gap-10 md:grid-cols-2 md:items-end">
						<h2 className="h2 max-w-[16ch]">
							<RevealLines lines={[c.servicesLine1, c.servicesLine2]} />
						</h2>
						<Reveal delay={220} className="md:justify-self-end">
							<p className="body-t max-w-[40ch]">{c.servicesLead}</p>
						</Reveal>
					</div>

					{/* پشته‌ی چسبان: هر خدمت بالا می‌ایستد و بعدی رویش سر می‌خورد */}
					<ul className="stack">
						{services.map((s, i) => (
							<li
								key={s.id}
								className="stack__i"
								style={{ "--i": i } as React.CSSProperties}
							>
								<article className="panel flex min-h-[clamp(320px,50svh,480px)] flex-col p-[clamp(24px,4vw,64px)]">
									<span className="panel__edge" aria-hidden="true" />
									<span className="panel__ghost num" aria-hidden="true">
										{String(i + 1).padStart(2, "0")}
									</span>

									{/* my-auto وسط‌چین می‌کند ولی برخلاف justify-center، وقتی محتوا بلندتر شود نمی‌بُرد */}
										<div className="my-auto grid gap-10 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-16">
										<div>
											<h3 className="h2 text-[clamp(1.6rem,2.6vw,2.4rem)]">{s.title}</h3>
											{s.summary && <p className="body-t mt-5 max-w-[48ch]">{s.summary}</p>}
											<div className="mt-10">
												<Magnetic strength={0.18}>
													<Link href={`/services/${s.slug}`} className="btn">
														جزئیات این خدمت
													</Link>
												</Magnetic>
											</div>
										</div>

										{/* ویژگی‌ها همان داده‌ی واقعی دیتابیس‌اند — نه پرکننده‌ی تزئینی */}
										{s.features.length > 0 && (
											<ul className="flex flex-col gap-4 md:border-s md:border-[var(--line)] md:ps-12">
												{s.features.map((f) => (
													<li key={f} className="feat body-t text-[15px] leading-relaxed">
														{f}
													</li>
												))}
											</ul>
										)}
									</div>
								</article>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* ══════════ کارهای منتخب ══════════ */}
			{projects.length > 0 && (
				<section id="work" className="stage stage--tl px-[var(--pad)] py-[var(--sec)]">
					<div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
						<h2 className="h2 max-w-[16ch]">
							<RevealLines lines={[c.workLine1, c.workLine2]} />
						</h2>
						<Reveal delay={220} className="md:justify-self-end">
							<p className="body-t max-w-[38ch]">{c.workLead}</p>
						</Reveal>
					</div>

					{/* ریل افقی: اسکرول بومی + snap، و پارالاکس جلد هنگام حرکت */}
					<WorkRail>
						{projects.map((p) => (
							<article key={p.id} className="rail__i">
								<Link href={`/portfolio/${p.slug}`} data-cursor="مشاهده" className="group block">
									<Reveal as="img-rv" className="rail__par">
										<div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-2)]">
											{p.coverImage ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={p.coverImage}
													alt={`نمونه‌کار ${p.title} — ${p.category?.name ?? "طراحی و توسعه‌ی وب"} توسط استودیو ویرگول`}
													loading="lazy"
													decoding="async"
													className="h-full w-full object-cover"
												/>
											) : (
												/* بدون تصویر واقعی: جلدِ ساخته‌شده از داده‌ی خود پروژه */
												<ProjectCover
													title={p.title}
													client={p.client}
													category={p.category?.name}
													year={p.year}
												/>
											)}
										</div>
									</Reveal>

									{/* دسته و سال روی خودِ جلد آمده‌اند؛ اینجا تکرارشان نمی‌کنیم */}
									<div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
										<h3 className="h3 link-u">{p.title}</h3>
										<span
											className="meta-fa accent translate-x-3 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100"
											style={{ transitionTimingFunction: "var(--ease)" }}
											aria-hidden="true"
										>
											مشاهده‌ی پروژه ←
										</span>
									</div>

									{p.summary && <p className="body-t mt-3 text-[15px]">{p.summary}</p>}

									{p.technologies.length > 0 && (
										<ul className="mt-5 flex flex-wrap gap-2">
											{p.technologies.map((t) => (
												<li key={t} className="tag font-latin">
													{t}
												</li>
											))}
										</ul>
									)}
								</Link>
							</article>
						))}
					</WorkRail>

					<Reveal delay={160} className="mt-14">
						<Magnetic strength={0.22}>
							<Link href="/portfolio" className="btn btn--solid">
								{c.workCta}
							</Link>
						</Magnetic>
					</Reveal>
				</section>
			)}

			{/* ══════════ چطور کار می‌کنیم ══════════ */}
			<section id="process" className="stage stage--l px-[var(--pad)] py-[var(--sec)]">
				<div className="grid gap-16 md:grid-cols-[minmax(0,24rem)_1fr] md:gap-28">
					<div className="md:sticky md:top-32 md:h-fit">
						<h2 className="h2">
							<RevealLines lines={[c.processLine1, c.processLine2]} />
						</h2>
						<Reveal delay={240}>
							<p className="body-t mt-8 max-w-[40ch]">{c.processLead}</p>
						</Reveal>
					</div>

					{/* خطِ کناری با اسکرول پر می‌شود — پیشرفت را حس می‌کنید، نه اینکه بخوانید */}
					<ol className="track">
						{process.map((s, i) => (
							<li key={s.t} className="group relative">
								{/* گرهِ روی خط — با نزدیک‌شدن اشاره‌گر روشن می‌شود */}
								<span className="track__dot" aria-hidden="true" />
								<Reveal as="rv-blur" delay={i * 90} className="py-12">
									<h3 className="h3 transition-colors duration-500 group-hover:text-[var(--accent)]">
										{s.t}
									</h3>
									<p className="body-t mt-4 max-w-[56ch] text-[15px]">{s.d}</p>
								</Reveal>
							</li>
						))}
					</ol>
				</div>
			</section>

			{/* ══════════ تعهدها — چیدمان پلکانی، نه شبکه‌ی متقارن ══════════ */}
			<section id="assurances" className="stage stage--br px-[var(--pad)] py-[var(--sec)]">
				<h2 className="h2 mb-20 max-w-[18ch]">
					<RevealLines lines={[c.assurancesLine1, c.assurancesLine2]} />
				</h2>

				<ul className="grid gap-y-2">
					{assurances.map((a, i) => (
						<li
							key={a.t}
							// عرض و تورفتگیِ متفاوت برای هر ردیف — ریتم دستی، نه شبکه‌ی یکنواخت
							className={i % 2 === 0 ? "md:w-[74%]" : "md:ms-auto md:w-[74%] lg:w-[68%]"}
						>
							<Reveal as="rule" />
							<Reveal
								as="rv-blur"
								delay={i * 100}
								className="grid gap-4 py-10 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12"
							>
								<h3 className="h3">{a.t}</h3>
								<p className="body-t text-[15px]">{a.d}</p>
							</Reveal>
						</li>
					))}
					<Reveal as="rule" className="md:w-[74%]" />
				</ul>
			</section>

			{/* ══════════ درباره ══════════ */}
			<section id="about" className="stage stage--r px-[var(--pad)] py-[var(--sec)]">
				<div className="grid gap-16 md:grid-cols-[1fr_minmax(0,32rem)] md:gap-28">
					<div>
						<h2 className="h2 max-w-[18ch]">
							<RevealLines lines={[c.aboutLine1, c.aboutLine2]} />
						</h2>
						<Reveal as="rv-blur" delay={240} className="mt-12">
							<p className="pull">{c.aboutPull}</p>
						</Reveal>
					</div>
					<div>
						<Reveal delay={180}>
							<p className="body-t">{c.aboutP1}</p>
						</Reveal>
						<Reveal delay={280}>
							<p className="body-t mt-8">{c.aboutP2}</p>
						</Reveal>
						<Reveal delay={380} className="mt-12">
							<Link href="/about" className="link-u font-medium">
								بیشتر درباره‌ی ما ←
							</Link>
						</Reveal>
					</div>
				</div>
			</section>

			{/* ══════════ پرسش‌های متداول — تعامل واقعی، و خوراکِ نتایج گوگل ══════════ */}
			{faqItems.length > 0 && (
				<section id="faq" className="stage stage--c px-[var(--pad)] py-[var(--sec)]">
					<div className="grid gap-14 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-24">
						<div className="md:sticky md:top-32 md:h-fit">
							<h2 className="h2">
								<RevealLines lines={[c.faqLine1, c.faqLine2]} />
							</h2>
							<Reveal delay={220}>
								<p className="body-t mt-8 max-w-[32ch]">{c.faqLead}</p>
							</Reveal>
						</div>
						<div>
							<FaqAccordion items={faqItems} />
							<Reveal delay={160} className="mt-12">
								<Link href="/faq" className="link-u font-medium">
									همه‌ی پرسش‌ها ←
								</Link>
							</Reveal>
						</div>
					</div>
				</section>
			)}

			{/* ══════════ تماس ══════════ */}
			<section id="contact" className="stage stage--c relative px-[var(--pad)] py-[var(--sec)]">
				<MarkBackdrop className="pointer-events-none absolute -bottom-[18%] right-[-14%] hidden h-[min(70vh,640px)] w-[min(70vh,640px)] opacity-70 md:block" />

				<div className="relative z-10">
					<h2 className="display max-w-[14ch]">
						<RevealLines className="sheen" step={130} lines={[c.contactLine1, c.contactLine2]} />
					</h2>

					<Reveal delay={280} className="mt-10">
						<p className="body-t max-w-[52ch]">{c.contactLead}</p>
					</Reveal>

					<Reveal delay={420} className="mt-14 flex flex-wrap items-center gap-x-14 gap-y-8">
						<Magnetic strength={0.22}>
							<Link href="/request-project" className="btn btn--solid">
								{c.contactCta}
							</Link>
						</Magnetic>
						<a href="mailto:info@virgule.studio" className="link-u h3 font-latin" dir="ltr">
							info@virgule.studio
						</a>
						<a href="tel:+989999571001" className="link-u num h3" dir="ltr">
							0999 957 1001
						</a>
					</Reveal>
				</div>
			</section>
		</>
	)
}
