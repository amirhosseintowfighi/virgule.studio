import Link from "next/link"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Container, Section } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"
import { AuroraBlobs, GridPattern } from "@/components/ui/decorations"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { NeuralCanvas } from "@/components/fx/neural-canvas"
import { Magnetic } from "@/components/fx/magnetic"
import { Marquee } from "@/components/fx/marquee"
import { CountUp } from "@/components/fx/count-up"
import { TiltCard } from "@/components/fx/tilt-card"
import { RotatingBadge } from "@/components/fx/rotating-badge"
import { StackingCards, type StackItem } from "@/components/fx/stacking-cards"

const services: StackItem[] = [
	{ icon: "🌐", grad: "from-indigo-500 to-violet-600", title: "طراحی سایت شرکتی", desc: "وب‌سایتی که در نگاه اول اعتماد مشتری را جلب می‌کند؛ از معماری اطلاعات تا هویت بصری، همه در خدمت اعتبار برند شما." },
	{ icon: "🛒", grad: "from-emerald-500 to-teal-600", title: "فروشگاه اینترنتی", desc: "فروشگاهی سریع، امن و بهینه‌شده برای فروش؛ طراحی شده تا بازدیدکننده را به خریدار وفادار تبدیل کند." },
	{ icon: "🎨", grad: "from-fuchsia-500 to-pink-600", title: "طراحی UI/UX", desc: "تجربه‌ی کاربری روان، زیبا و هدفمند که هر کلیک را طبیعی و لذت‌بخش می‌کند." },
	{ icon: "📈", grad: "from-sky-500 to-blue-600", title: "سئو (SEO)", desc: "دیده‌شدن واقعی در گوگل و جذب مستمر ترافیک ارگانیک؛ رشدی پایدار که به تبلیغ وابسته نیست." },
	{ icon: "⚡", grad: "from-amber-500 to-orange-600", title: "بهینه‌سازی سرعت", desc: "نمره‌ی Lighthouse نزدیک به ۱۰۰ و بارگذاری فوق‌سریع در هر دستگاهی — چون هر ثانیه مهم است." },
	{ icon: "🛡️", grad: "from-rose-500 to-red-600", title: "پشتیبانی و نگهداری", desc: "کنار شما می‌مانیم؛ پشتیبانی مستمر، به‌روزرسانی و امنیت همیشگی برای آرامش خیال شما." },
]

const steps = [
	{ n: "۰۱", t: "کشف و تحلیل", d: "اول گوش می‌دهیم؛ کسب‌وکار، مخاطب و اهداف شما را دقیق می‌شناسیم." },
	{ n: "۰۲", t: "طراحی", d: "طراحی UI/UX مطابق هویت برند و رفتار واقعی کاربران." },
	{ n: "۰۳", t: "توسعه", d: "پیاده‌سازی با مدرن‌ترین تکنولوژی‌ها و کدی تمیز و مقیاس‌پذیر." },
	{ n: "۰۴", t: "تحویل و رشد", d: "راه‌اندازی، آموزش و پشتیبانی مستمر برای رشد مداوم." },
]

const stats = [
	{ end: 120, suffix: "+", label: "پروژه‌ی موفق" },
	{ end: 98, suffix: "٪", label: "رضایت مشتریان" },
	{ end: 7, suffix: "+ سال", label: "تجربه‌ی حرفه‌ای" },
	{ end: 24, suffix: "/۷", label: "پشتیبانی واقعی" },
]

const techTags = [
	"Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "PostgreSQL", "Prisma", "Figma", "Node.js", "SEO", "UI/UX", "Cloudinary",
]

const faqs = [
	{ q: "طراحی وب‌سایت چقدر طول می‌کشد؟", a: "بسته به پیچیدگی پروژه، معمولاً بین ۲ تا ۸ هفته. پس از جلسه‌ی کشف، یک زمان‌بندی دقیق و مکتوب به شما می‌دهیم." },
	{ q: "بعد از تحویل، پشتیبانی هم دارید؟", a: "بله؛ همه‌ی پروژه‌ها دوره‌ی پشتیبانی رایگان دارند و پس از آن هم با قرارداد نگهداری کنارتان هستیم." },
	{ q: "آیا سایت برای موبایل بهینه می‌شود؟", a: "قطعاً. همه‌ی پروژه‌ها کاملاً ریسپانسیو و برای همه‌ی دستگاه‌ها و مرورگرها بهینه می‌شوند." },
	{ q: "مالکیت کد و محتوا با کیست؟", a: "۱۰۰٪ با شما. پس از تسویه، کد، داده‌ها و دسترسی‌های کامل به شما تحویل داده می‌شود." },
]

async function getFeatured() {
	return prisma.project
		.findMany({ where: { featured: true }, take: 4, orderBy: { order: "asc" }, include: { category: true } })
		.catch(() => [])
}

export default async function HomePage() {
	const featured = await getFeatured()

	return (
		<>
			{/* Hero — پنل قاب‌دار شناور (عکس ۱) */}
			<div className="px-3 pt-3 md:px-5 md:pt-5">
				<section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-b from-[var(--color-primary-container)] via-[var(--color-surface-2)] to-[var(--color-surface)] py-24 md:rounded-[40px]">
					<NeuralCanvas className="absolute inset-0 h-full w-full opacity-70" />
					<AuroraBlobs />
					<GridPattern />
					<Container className="relative z-10 text-center">
						<span className="mb-6 inline-block rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)]/70 px-4 py-1.5 text-sm font-semibold text-[var(--color-primary)] backdrop-blur">
							✨ استودیوی طراحی و توسعه‌ی وب
						</span>
						<h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.15] md:text-7xl">
							<span className="text-gradient">برندی که دیده می‌شود</span>، با وب‌سایتی که اعتماد می‌سازد
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
							در ویرگول، طراحی زیبا را با مهندسی دقیق ترکیب می‌کنیم تا کسب‌وکار شما حرفه‌ای، سریع و قابل‌اعتماد دیده شود. از ایده تا رشد، کنار شماییم.
						</p>
						<div className="mt-9 flex flex-wrap items-center justify-center gap-4">
							<Magnetic>
								<Button href="/request-project">شروع پروژه‌ی شما</Button>
							</Magnetic>
							<Magnetic>
								<Button href="/portfolio" variant="outlined">مشاهده نمونه‌کارها</Button>
							</Magnetic>
						</div>
					</Container>
					<div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
						<RotatingBadge />
					</div>
				</section>
			</div>

			{/* Tech marquee */}
			<section className="mt-6 border-y border-[var(--color-border)] bg-[var(--color-surface-2)]/40 py-6">
				<Marquee duration={30} items={techTags} itemClassName="mx-5 font-latin text-lg font-semibold text-[var(--color-muted)]" />
			</section>

			{/* Stats */}
			<Container className="py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					{stats.map((s, i) => (
						<Reveal key={s.label} delay={i * 90} className="text-center">
							<div className="text-gradient font-latin text-4xl font-extrabold md:text-5xl">
								<CountUp end={s.end} suffix={s.suffix} />
							</div>
							<div className="mt-2 text-sm text-[var(--color-muted)]">{s.label}</div>
						</Reveal>
					))}
				</div>
			</Container>

			{/* Services — کارت‌های جمع‌شونده با اسکرول (عکس ۲) */}
			<section id="services" className="py-16 md:py-24">
				<Container>
					<div className="grid gap-10 md:grid-cols-2 md:gap-14">
						<div className="md:sticky md:top-28 md:self-start">
							<span className="mb-3 inline-block rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-4 py-1 text-xs font-semibold text-[var(--color-primary)]">
								خدمات ما
							</span>
							<h2 className="text-gradient pb-1 text-3xl font-extrabold leading-tight md:text-5xl">
								راهکاری کامل برای حضور دیجیتال
							</h2>
							<p className="mt-4 max-w-md leading-8 text-[var(--color-muted)]">
								هر چیزی که برای دیده‌شدن لازم دارید، یکجا و یکپارچه. اسکرول کنید تا خدمات یکی پس از دیگری روی هم بنشینند.
							</p>
							<div className="mt-6">
								<Magnetic>
									<Button href="/services" variant="outlined">مشاهده‌ی همه‌ی خدمات</Button>
								</Magnetic>
							</div>
						</div>
						<StackingCards items={services} />
					</div>
				</Container>
			</section>

			{/* چرا ویرگول — ترکیب‌بندی بنتو (عکس ۳) */}
			<section className="py-16 md:py-24">
				<Container>
					<Reveal className="grid gap-5 md:grid-cols-3">
						{/* کارت بزرگ */}
						<div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:col-span-2">
							<div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-sky-400/30 blur-2xl" />
							<div className="relative z-10">
								<span className="mb-4 inline-block rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-4 py-1 text-xs font-semibold text-[var(--color-primary)]">چرا ویرگول؟</span>
								<h2 className="max-w-lg text-3xl font-extrabold leading-tight md:text-4xl">ما فقط توسعه‌دهنده نیستیم؛ شریک فنی شماییم</h2>
								<p className="mt-4 max-w-lg leading-8 text-[var(--color-muted)]">هر تصمیمی را با اهداف بلندمدت کسب‌وکار شما هم‌راستا می‌کنیم و تا رسیدن به نتیجه کنارتان می‌مانیم.</p>
								<div className="mt-6">
									<Magnetic>
										<Button href="/contact">گفتگو درباره‌ی استراتژی</Button>
									</Magnetic>
								</div>
							</div>
						</div>
						{/* کارت استراتژی */}
						<div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-7">
							<div className="text-3xl">🧭</div>
							<h3 className="mt-4 text-lg font-bold">رویکرد استراتژی‌محور</h3>
							<p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">پیش از یک خط کد، هدف را روشن می‌کنیم.</p>
							<div className="mt-5 space-y-2">
								{["درک چشم‌انداز", "تدوین استراتژی", "ساخت هدفمند", "سنجش و بهینه‌سازی"].map((x, idx) => (
									<div key={x} className={"rounded-[var(--radius-md)] px-3 py-2 text-sm " + (idx === 2 ? "bg-[var(--color-ink)] font-semibold text-[var(--color-surface)]" : "bg-[var(--color-surface)] text-[var(--color-muted)]")}>
										{x}
									</div>
								))}
							</div>
						</div>
						{/* سه کارت پایین */}
						<div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
							<h3 className="text-lg font-bold">کد تمیز و مقیاس‌پذیر</h3>
							<p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">کدی که سال‌ها قابل نگهداری و توسعه است.</p>
							<pre dir="ltr" className="no-scrollbar mt-4 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-ink)] p-3 text-left font-latin text-xs leading-6 text-emerald-300">{"function Button({ label }) {\n  return <button className=\"btn\">\n    {label}\n  </button>\n}"}</pre>
						</div>
						<div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
							<div className="text-3xl">🧪</div>
							<h3 className="mt-4 text-lg font-bold">تست و کیفیت</h3>
							<p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">کیفیت در تمام مراحل تضمین می‌شود، نه فقط در پایان کار.</p>
						</div>
						<div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
							<div className="text-3xl">💬</div>
							<h3 className="mt-4 text-lg font-bold">ارتباط شفاف</h3>
							<p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">گزارش هفتگی، دموی زنده و همکاری لحظه‌ای در تمام طول پروژه.</p>
						</div>
					</Reveal>
				</Container>
			</section>

			{/* Featured works */}
			{featured.length > 0 && (
				<Section eyebrow="نمونه‌کارها" title="پروژه‌هایی که به آن‌ها می‌بالیم" subtitle="منتخبی از کارهایی که با عشق ساختیم.">
					<div className="grid gap-6 md:grid-cols-2">
						{featured.map((p) => (
							<Link key={p.id} href={"/portfolio/" + p.slug}>
								<TiltCard className="group h-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--elev-1)] hover:shadow-[var(--elev-3)]">
									<div className="flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--color-primary-container)] to-[var(--color-surface-2)] text-5xl transition-transform duration-500 group-hover:scale-110">
										🖼️
									</div>
									<div className="p-6">
										<div className="text-xs font-semibold text-[var(--color-primary)]">{p.category ? p.category.name : "پروژه"}</div>
										<h3 className="mt-1 text-xl font-bold">{p.title}</h3>
										<p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{p.summary}</p>
									</div>
								</TiltCard>
							</Link>
						))}
					</div>
					<div className="mt-8 text-center">
						<Button href="/portfolio" variant="outlined">دیدن همه‌ی نمونه‌کارها</Button>
					</div>
				</Section>
			)}

			{/* Process */}
			<Section eyebrow="فرآیند کار" title="چگونه پروژه‌ی شما را پیش می‌بریم" subtitle="یک مسیر شفاف و قابل‌پیش‌بینی، از اولین گفتگو تا رشد.">
				<div className="grid gap-6 md:grid-cols-4">
					{steps.map((s, i) => (
						<Reveal key={s.n} delay={i * 90}>
							<div className="group h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--elev-3)]">
								<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-full)] bg-gradient-to-br from-[var(--color-primary)] to-fuchsia-500 font-latin text-xl font-bold text-white shadow-[var(--elev-2)]">
									{s.n}
								</div>
								<h3 className="mb-1 font-bold">{s.t}</h3>
								<p className="text-sm leading-7 text-[var(--color-muted)]">{s.d}</p>
							</div>
						</Reveal>
					))}
				</div>
			</Section>

			{/* Big outline marquee */}
			<section className="overflow-hidden py-10">
				<Marquee reverse duration={26} items={["ایده‌های الهام‌بخش", "ذهن‌های خلاق", "طراحیِ ماندگار", "کدِ تمیز", "تجربه‌ی روان"]} itemClassName="mx-6 text-5xl font-black text-outline md:text-7xl" />
			</section>

			{/* FAQ */}
			<Section eyebrow="سوالات متداول" title="پاسخ پرسش‌های رایج">
				<div className="mx-auto max-w-3xl">
					<FaqAccordion items={faqs} />
				</div>
			</Section>

			{/* CTA — کارت قاب‌دار با شکل‌های شیشه‌ای گوشه (عکس ۵) */}
			<section className="px-3 pb-10 md:px-5">
				<Container>
					<Reveal>
						<div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center md:rounded-[40px] md:py-24">
							<div className="animate-float pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-400/40 to-fuchsia-400/30 blur-2xl" />
							<div className="animate-float-slow pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-gradient-to-tr from-violet-400/40 to-sky-400/30 blur-2xl" />
							<div className="relative z-10">
								<span className="mb-5 inline-block rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-4 py-1 text-xs font-semibold text-[var(--color-primary)]">بیایید در ارتباط باشیم</span>
								<h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">آماده‌ی رشد هوشمندانه‌اید؟</h2>
								<p className="mx-auto mt-4 max-w-xl leading-8 text-[var(--color-muted)]">درخواستتان را ثبت کنید؛ در کمتر از یک روز کاری با یک مشاوره‌ی رایگان تماس می‌گیریم و مسیر رشد را با هم می‌چینیم.</p>
								<div className="mt-7">
									<Magnetic>
										<Button href="/request-project">ثبت سفارش رایگان</Button>
									</Magnetic>
								</div>
							</div>
						</div>
					</Reveal>
				</Container>
			</section>
		</>
	)
}
