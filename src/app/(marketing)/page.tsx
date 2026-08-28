import Link from "next/link"
import prisma from "@/lib/prisma"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Marquee } from "@/components/fx/marquee"
import { Magnetic } from "@/components/fx/magnetic"
import { MarkField } from "@/components/fx/mark-field"

/* داده‌ها از دیتابیس می‌آیند؛ هیچ آمار یا نمونه‌کار ساختگی روی صفحه نیست. */
async function getData() {
	const [projects, services] = await Promise.all([
		prisma.project
			.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }], take: 5, include: { category: true } })
			.catch(() => []),
		prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }).catch(() => []),
	])
	return { projects, services }
}

const capabilities = [
	"Next.js", "React", "TypeScript", "Tailwind", "Prisma", "PostgreSQL",
	"Design Systems", "SEO", "Performance", "Motion",
]

const process = [
	{ n: "۰۱", t: "کشف", d: "پیش از هر خط کد، کسب‌وکار و مخاطب شما را می‌شناسیم. اینجا تصمیم می‌گیریم چه چیزی نباید ساخته شود." },
	{ n: "۰۲", t: "طراحی", d: "ساختار، تایپوگرافی و ریتم بصری. طراحی روی هویت برند شما بنا می‌شود، نه روی یک قالب آماده." },
	{ n: "۰۳", t: "ساخت", d: "پیاده‌سازی با کد تمیز و تایپ‌دار. سرعت و دسترس‌پذیری از روز اول در نظر گرفته می‌شود، نه در پایان." },
	{ n: "۰۴", t: "صیقل", d: "ریزتعامل‌ها، حالت‌های خطا، موبایل، مرورگرهای مختلف. تفاوت کار خوب و کار عالی همین‌جاست." },
	{ n: "۰۵", t: "انتشار", d: "راه‌اندازی روی زیرساخت شما، آموزش پنل مدیریت، و پشتیبانی پس از تحویل." },
]

export default async function HomePage() {
	const { projects, services } = await getData()

	return (
		<>
			{/* ══════════ ۰۱ — معرفی ══════════ */}
			<section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-[var(--pad)] pb-14 pt-32">
				<MarkField className="pointer-events-none absolute inset-0 h-full w-full opacity-[.55]" />

				<div className="relative z-10">
					<Reveal className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-2">
						<span className="meta font-latin">Virgule Studio</span>
						<span className="meta-fa">استودیوی طراحی و توسعه‌ی وب — تهران</span>
					</Reveal>

					<h1 className="display max-w-[16ch]">
						<RevealLines
							lines={[
								<>مکثی که</>,
								<>
									دیده <span className="accent">می‌شود</span>
								</>,
							]}
						/>
					</h1>

					<div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
						<Reveal delay={260} className="max-w-[52ch]">
							<p className="body-t">
								وب‌سایت‌هایی می‌سازیم که سریع‌اند، درست کار می‌کنند و شبیه هیچ قالب آماده‌ای نیستند.
								از معماری اطلاعات تا آخرین ریزتعامل — طراحی و مهندسی، هر دو در یک تیم.
							</p>
						</Reveal>

						<Reveal delay={360} className="flex flex-wrap items-center gap-4">
							<Magnetic strength={0.22}>
								<Link href="/portfolio" className="btn btn--solid">
									نمونه‌کارها
								</Link>
							</Magnetic>
							<Magnetic strength={0.22}>
								<Link href="/contact" className="btn">
									بیایید حرف بزنیم
								</Link>
							</Magnetic>
						</Reveal>
					</div>
				</div>

				<div className="relative z-10 mt-16 flex items-center gap-3 md:mt-20">
					<span className="meta font-latin">Scroll</span>
					<span className="h-px w-16 bg-[var(--line-2)]" />
				</div>
			</section>

			{/* نوار توانمندی‌ها */}
			<div className="border-y border-[var(--line)] py-5">
				<Marquee
					duration={40}
					items={capabilities.map((c) => (
						<span key={c} className="mx-7 flex items-center gap-7">
							<span className="font-latin text-sm text-[var(--fg-3)]">{c}</span>
							<span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
						</span>
					))}
				/>
			</div>

			{/* ══════════ ۰۲ — چه کاری انجام می‌دهیم ══════════ */}
			<section id="services" className="px-[var(--pad)] py-[var(--sec)]">
				<div className="mb-16 flex flex-wrap items-end justify-between gap-6">
					<div>
						<Reveal className="meta font-latin mb-6">01 — Services</Reveal>
						<h2 className="h2 max-w-[14ch]">
							<RevealLines lines={[<>چه کاری</>, <>انجام می‌دهیم</>]} />
						</h2>
					</div>
					<Reveal delay={200} className="max-w-[38ch]">
						<p className="body-t">
							هر پروژه از صفر طراحی می‌شود. لیست زیر خدماتی است که واقعاً انجام می‌دهیم — نه هر چیزی که بشود فروخت.
						</p>
					</Reveal>
				</div>

				<Reveal as="rule" className="mb-2" />
				<ul>
					{services.map((s, i) => (
						<li key={s.id}>
							<Link href={`/services/${s.slug}`} className="row-i group py-9 md:py-11">
								<div className="relative z-10 flex items-baseline gap-6 md:gap-12">
									<span className="meta font-latin w-8 shrink-0 pt-2">
										{String(i + 1).padStart(2, "0")}
									</span>
									<div className="min-w-0 flex-1">
										<h3 className="row-i__t h3">{s.title}</h3>
										<p className="body-t mt-2 max-w-[62ch] text-[15px] md:mt-3">{s.summary}</p>
									</div>
									<span className="row-i__go accent hidden shrink-0 self-center text-2xl md:block" aria-hidden="true">
										←
									</span>
								</div>
							</Link>
							<Reveal as="rule" />
						</li>
					))}
				</ul>
			</section>

			{/* ══════════ ۰۳ — کارهای منتخب ══════════ */}
			{projects.length > 0 && (
				<section id="work" className="px-[var(--pad)] py-[var(--sec)]">
					<div className="mb-16">
						<Reveal className="meta font-latin mb-6">02 — Selected Work</Reveal>
						<h2 className="h2 max-w-[16ch]">
							<RevealLines lines={[<>کارهایی که</>, <>ساخته‌ایم</>]} />
						</h2>
					</div>

					<div className="grid gap-y-[clamp(56px,9vw,130px)]">
						{projects.map((p, i) => {
							// چیدمان نامتقارن: پروژه‌ها یک‌درمیان به راست و چپ می‌نشینند
							const wide = i % 3 === 0
							const alignEnd = i % 2 === 1
							return (
								<article
									key={p.id}
									className={
										wide
											? "w-full"
											: alignEnd
												? "w-full md:ms-auto md:w-[62%]"
												: "w-full md:w-[62%]"
									}
								>
									<Link href={`/portfolio/${p.slug}`} data-cursor="مشاهده" className="group block">
										<Reveal as="img-rv" className="rounded-[var(--radius-lg)]">
											<div
												className={`relative flex items-center justify-center overflow-hidden bg-[var(--bg-2)] ${
													wide ? "aspect-[16/8]" : "aspect-[4/3]"
												}`}
											>
												{p.coverImage ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={p.coverImage}
														alt={p.title}
														loading="lazy"
														decoding="async"
														className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.04]"
														style={{ transitionTimingFunction: "var(--ease)" }}
													/>
												) : (
													/* بدون تصویر واقعی، جای‌نگهدار تایپوگرافیک — نه اسکرین‌شات ساختگی */
													<span className="stroke-text display px-6 text-center leading-none">
														{p.title.slice(0, 2)}
													</span>
												)}
											</div>
										</Reveal>

										<div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
											<div className="flex items-baseline gap-5">
												<span className="meta font-latin">{String(i + 1).padStart(2, "0")}</span>
												<h3 className="h3 link-u">{p.title}</h3>
											</div>
											<div className="flex items-center gap-5">
												{p.category && <span className="meta-fa">{p.category.name}</span>}
												{p.year && <span className="meta font-latin">{p.year}</span>}
											</div>
										</div>

										{p.summary && <p className="body-t mt-3 max-w-[58ch] text-[15px]">{p.summary}</p>}

										{p.technologies.length > 0 && (
											<ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
												{p.technologies.map((t) => (
													<li key={t} className="meta font-latin">
														{t}
													</li>
												))}
											</ul>
										)}
									</Link>
								</article>
							)
						})}
					</div>

					<Reveal delay={120} className="mt-20">
						<Link href="/portfolio" className="link-u h3">
							همه‌ی نمونه‌کارها ←
						</Link>
					</Reveal>
				</section>
			)}

			{/* ══════════ ۰۴ — چطور کار می‌کنیم ══════════ */}
			<section id="process" className="px-[var(--pad)] py-[var(--sec)]">
				<div className="grid gap-16 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-24">
					<div className="md:sticky md:top-28 md:h-fit">
						<Reveal className="meta font-latin mb-6">03 — Process</Reveal>
						<h2 className="h2">
							<RevealLines lines={[<>چطور کار</>, <>می‌کنیم</>]} />
						</h2>
						<Reveal delay={200}>
							<p className="body-t mt-7 max-w-[34ch]">
								پنج مرحله‌ی روشن. در هر مرحله می‌دانید کجای کار هستید و قدم بعدی چیست.
							</p>
						</Reveal>
					</div>

					<ol>
						{process.map((s, i) => (
							<li key={s.n}>
								<Reveal as="rule" />
								<Reveal delay={i * 60} className="flex items-start gap-6 py-9 md:gap-12">
									<span className="num h3 shrink-0 text-[var(--fg-3)]">{s.n}</span>
									<div>
										<h3 className="h3">{s.t}</h3>
										<p className="body-t mt-3 max-w-[52ch] text-[15px]">{s.d}</p>
									</div>
								</Reveal>
							</li>
						))}
						<Reveal as="rule" />
					</ol>
				</div>
			</section>

			{/* ══════════ ۰۵ — درباره ══════════ */}
			<section id="about" className="px-[var(--pad)] py-[var(--sec)]">
				<Reveal className="meta font-latin mb-10">04 — Studio</Reveal>
				<div className="grid gap-14 md:grid-cols-[1fr_minmax(0,30rem)] md:gap-24">
					<h2 className="h2 max-w-[18ch]">
						<RevealLines
							lines={[
								<>ویرگول یک استودیوی</>,
								<>طراحی و توسعه‌ی وب است.</>,
							]}
						/>
					</h2>
					<div>
						<Reveal delay={160}>
							<p className="body-t">
								اسم ما از همان علامت کوچکی می‌آید که در میان متن، مکث می‌سازد. باور ما این است که
								همین مکث‌ها — فاصله‌ها، ریتم، چیزهایی که حذف می‌شوند — تفاوت یک وب‌سایت معمولی و
								یک وب‌سایت ماندگار را می‌سازند.
							</p>
						</Reveal>
						<Reveal delay={240}>
							<p className="body-t mt-6">
								طراحی و مهندسی را جدا نمی‌کنیم. همان کسی که چیدمان را می‌چیند، کدش را هم می‌نویسد؛
								برای همین چیزی که تحویل می‌گیرید دقیقاً همان چیزی است که دیده‌اید — با همان سرعت و همان جزئیات.
							</p>
						</Reveal>
						<Reveal delay={320} className="mt-9">
							<Link href="/about" className="link-u font-bold">
								بیشتر درباره‌ی ما ←
							</Link>
						</Reveal>
					</div>
				</div>
			</section>

			{/* ══════════ ۰۶ — تماس ══════════ */}
			<section id="contact" className="border-t border-[var(--line)] px-[var(--pad)] py-[var(--sec)]">
				<Reveal className="meta font-latin mb-10">05 — Contact</Reveal>
				<h2 className="display max-w-[14ch]">
					<RevealLines lines={[<>پروژه‌ای در</>, <>ذهن دارید؟</>]} />
				</h2>

				<div className="mt-14 flex flex-wrap items-center gap-x-12 gap-y-8">
					<Magnetic strength={0.22}>
						<Link href="/request-project" className="btn btn--solid">
							شروع پروژه
						</Link>
					</Magnetic>
					<a href="mailto:info@virgule.studio" className="link-u h3 font-latin" dir="ltr">
						info@virgule.studio
					</a>
					<a href="tel:09999571001" className="link-u num h3" dir="ltr">
						0999 957 1001
					</a>
				</div>
			</section>
		</>
	)
}
