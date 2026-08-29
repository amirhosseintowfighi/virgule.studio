import Link from "next/link"
import prisma from "@/lib/prisma"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Marquee } from "@/components/fx/marquee"
import { Magnetic } from "@/components/fx/magnetic"
import { MarkField } from "@/components/fx/mark-field"
import { Slab } from "@/components/ui/container"

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
			{/* ══════════ ۰۰ — سربرگ نشریه ══════════ */}
			<section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-[var(--pad)] pb-10 pt-24">
				<MarkField className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />

				{/* نوار شناسنامه — مثل هد یک نشریه */}
				<Reveal className="relative z-10 grid grid-cols-2 border-y-[length:var(--bw-2)] border-[var(--fg)] md:grid-cols-4">
					{[
						["Studio", "استودیوی طراحی و توسعه‌ی وب"],
						["Based in", "تهران، ایران"],
						["Founded", "۱۴۰۰"],
						["Issue", "۰۱ — ویرگول"],
					].map(([en, fa]) => (
						// خط جداکننده فقط بین ستون‌های یک ردیف — نه در ابتدای ردیف (۲ ستون موبایل، ۴ ستون دسکتاپ)
						<div
							key={en}
							className="border-s-[length:var(--bw)] border-[var(--line)] px-3 py-3 [&:nth-child(2n+1)]:border-s-0 md:[&:nth-child(2n+1)]:border-s-[length:var(--bw)] md:[&:nth-child(4n+1)]:border-s-0"
						>
							<div className="meta font-latin mb-1">{en}</div>
							<div className="text-[13px] leading-tight">{fa}</div>
						</div>
					))}
				</Reveal>

				<div className="relative z-10 py-10">
					<h1 className="display max-w-[15ch]">
						<RevealLines
							lines={[
								<>مکثی که</>,
								<>
									دیده <span className="accent">می‌شود</span>
								</>,
							]}
						/>
					</h1>

					<div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
						<Reveal delay={260} className="max-w-[52ch]">
							<p className="body-t lead">
								وب‌سایت‌هایی می‌سازیم که سریع‌اند، درست کار می‌کنند و شبیه هیچ قالب آماده‌ای نیستند.
								از معماری اطلاعات تا آخرین ریزتعامل — طراحی و مهندسی، هر دو در یک تیم.
							</p>
						</Reveal>

						<Reveal delay={360} className="flex flex-wrap items-center gap-4">
							<Magnetic strength={0.18}>
								<Link href="/portfolio" className="btn btn--solid">
									نمونه‌کارها
								</Link>
							</Magnetic>
							<Magnetic strength={0.18}>
								<Link href="/contact" className="btn">
									بیایید حرف بزنیم
								</Link>
							</Magnetic>
						</Reveal>
					</div>
				</div>

				<div className="relative z-10 flex items-center gap-3">
					<span className="meta font-latin">Scroll</span>
					<span className="h-[var(--bw-2)] w-16 bg-[var(--fg)]" />
				</div>
			</section>

			{/* نوار توانمندی‌ها — بلوک تخت تأکید، لبه‌به‌لبه */}
			<div className="ticker relative z-[1] py-3.5">
				<Marquee
					duration={40}
					items={capabilities.map((c) => (
						<span key={c} className="mx-6 flex items-center gap-6">
							<span className="font-latin text-sm font-bold tracking-wider">{c}</span>
							<span className="h-1.5 w-1.5 bg-white" />
						</span>
					))}
				/>
			</div>

			{/* ══════════ ۰۱ — چه کاری انجام می‌دهیم ══════════ */}
			{/* بدون داده، عنوانِ تنها روی یک فضای خالی می‌نشیند — پس کل بخش حذف می‌شود. */}
			{services.length > 0 && (
			<section id="services" className="px-[var(--pad)] py-[var(--sec)]">
				<div className="mb-14 flex flex-wrap items-end justify-between gap-8">
					<div>
						<Slab index="01" label="Services" />
						<h2 className="h2 mt-7 max-w-[14ch]">
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
									<span className="num shrink-0 text-2xl font-bold text-[var(--fg-3)] md:text-4xl">
										{String(i + 1).padStart(2, "0")}
									</span>
									<div className="min-w-0 flex-1">
										<h3 className="row-i__t h3">{s.title}</h3>
										<p className="body-t mt-2 max-w-[62ch] text-[15px] md:mt-3">{s.summary}</p>
									</div>
									<span className="row-i__go hidden shrink-0 self-center text-2xl md:block" aria-hidden="true">
										←
									</span>
								</div>
							</Link>
							<Reveal as="rule" className="rule--thin" />
						</li>
					))}
				</ul>
			</section>
			)}

			{/* ══════════ ۰۲ — کارهای منتخب ══════════ */}
			{projects.length > 0 && (
				<section id="work" className="px-[var(--pad)] py-[var(--sec)]">
					<div className="mb-14">
						<Slab index="02" label="Selected Work" />
						<h2 className="h2 mt-7 max-w-[16ch]">
							<RevealLines lines={[<>کارهایی که</>, <>ساخته‌ایم</>]} />
						</h2>
					</div>

					<div className="grid gap-y-[clamp(56px,9vw,120px)]">
						{projects.map((p, i) => {
							// چیدمان نامتقارن: پروژه‌ها یک‌درمیان به راست و چپ می‌نشینند
							const wide = i % 3 === 0
							const alignEnd = i % 2 === 1
							return (
								<article
									key={p.id}
									className={
										wide ? "w-full" : alignEnd ? "w-full md:ms-auto md:w-[62%]" : "w-full md:w-[62%]"
									}
								>
									<Link href={`/portfolio/${p.slug}`} data-cursor="مشاهده" className="group block">
										<Reveal as="img-rv" className="card-b">
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

										<div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t-[length:var(--bw-2)] border-[var(--fg)] pt-4">
											<div className="flex items-baseline gap-5">
												<span className="num text-xl font-bold text-[var(--fg-3)]">
													{String(i + 1).padStart(2, "0")}
												</span>
												<h3 className="h3 link-u">{p.title}</h3>
											</div>
											<div className="flex items-center gap-5">
												{p.category && <span className="meta-fa">{p.category.name}</span>}
												{p.year && <span className="meta font-latin">{p.year}</span>}
											</div>
										</div>

										{p.summary && <p className="body-t mt-3 max-w-[58ch] text-[15px]">{p.summary}</p>}

										{p.technologies.length > 0 && (
											<ul className="mt-4 flex flex-wrap gap-2">
												{p.technologies.map((t) => (
													<li key={t} className="tag font-latin">
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

					<Reveal delay={120} className="mt-16">
						<Link href="/portfolio" className="btn">
							همه‌ی نمونه‌کارها ←
						</Link>
					</Reveal>
				</section>
			)}

			{/* ══════════ ۰۳ — چطور کار می‌کنیم ══════════ */}
			<section id="process" className="px-[var(--pad)] py-[var(--sec)]">
				<div className="grid gap-14 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-20">
					<div className="md:sticky md:top-28 md:h-fit">
						<Slab index="03" label="Process" />
						<h2 className="h2 mt-7">
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
								<Reveal as="rule" className={i === 0 ? undefined : "rule--thin"} />
								<Reveal delay={i * 60} className="flex items-start gap-6 py-9 md:gap-12">
									<span className="num shrink-0 text-4xl font-bold leading-none text-[var(--fg-3)] md:text-6xl">
										{String(i + 1).padStart(2, "0")}
									</span>
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

			{/* ══════════ ۰۴ — درباره ══════════ */}
			<section id="about" className="px-[var(--pad)] py-[var(--sec)]">
				<Slab index="04" label="Studio" />
				<div className="mt-10 grid gap-12 md:grid-cols-[1fr_minmax(0,30rem)] md:gap-20">
					<div>
						<h2 className="h2 max-w-[18ch]">
							<RevealLines lines={[<>ویرگول یک استودیوی</>, <>طراحی و توسعه‌ی وب است.</>]} />
						</h2>
						<Reveal delay={200} className="mt-10">
							<p className="pull">
								مکث‌ها — فاصله‌ها، ریتم، چیزهایی که حذف می‌شوند — تفاوت یک وب‌سایت معمولی و یک
								وب‌سایت ماندگار را می‌سازند.
							</p>
						</Reveal>
					</div>
					<div>
						<Reveal delay={160}>
							<p className="body-t">
								اسم ما از همان علامت کوچکی می‌آید که در میان متن، مکث می‌سازد. باور ما این است که
								همین مکث‌ها همان چیزی هستند که یک صفحه را خواندنی می‌کنند.
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

			{/* ══════════ ۰۵ — تماس ══════════ */}
			<section
				id="contact"
				className="border-t-[length:var(--bw-2)] border-[var(--fg)] px-[var(--pad)] py-[var(--sec)]"
			>
				<Slab index="05" label="Contact" />
				<h2 className="display mt-10 max-w-[14ch]">
					<RevealLines lines={[<>پروژه‌ای در</>, <>ذهن دارید؟</>]} />
				</h2>

				<div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
					<Magnetic strength={0.18}>
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
