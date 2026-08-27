import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Container, Section } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"
import { AuroraBlobs, GridPattern } from "@/components/ui/decorations"

type Props = { params: Promise<{ slug: string }> }

const processSteps = [
	{
		title: "۱. کشف و تحلیل",
		desc: "ابتدا در یک جلسه‌ی تخصصی، کسب‌وکار، مخاطب و اهداف شما را می‌شناسیم و نیازمندی‌ها را دقیق مستند می‌کنیم.",
	},
	{
		title: "۲. طراحی و تجربه‌ی کاربری",
		desc: "ساختار اطلاعات، وایرفریم و رابط کاربری بر پایه‌ی اصول Material Design و هویت بصری برند شما طراحی می‌شود.",
	},
	{
		title: "۳. توسعه و پیاده‌سازی",
		desc: "کدنویسی اصولی با جدیدترین تکنولوژی‌ها، بهینه‌سازی سرعت و امنیت، همراه با تست‌های دقیق در هر مرحله.",
	},
	{
		title: "۴. تحویل و پشتیبانی",
		desc: "پس از انتشار، آموزش کار با پنل، مستندات و پشتیبانی پیوسته را ارائه می‌دهیم تا خیالتان راحت باشد.",
	},
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const service = await prisma.service.findUnique({ where: { slug } })
	if (!service) return { title: "خدمت" }
	return { title: service.title, description: service.summary ?? undefined }
}

export default async function ServiceDetailPage({ params }: Props) {
	const { slug } = await params
	const service = await prisma.service.findUnique({ where: { slug } })
	if (!service) notFound()

	const paragraphs = (service.content ?? "")
		.split("\n\n")
		.map((p) => p.trim())
		.filter(Boolean)

	const related = await prisma.service.findMany({
		where: { active: true, slug: { not: service.slug } },
		orderBy: { order: "asc" },
		take: 3,
	})

	return (
		<>
			{/* Hero */}
			<section className="relative overflow-hidden py-16 md:py-24">
				<AuroraBlobs />
				<GridPattern />
				<Container className="relative z-10 max-w-3xl text-center">
					{service.icon && (
						<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-3xl">
							{service.icon}
						</div>
					)}
					<h1 className="text-gradient pb-1 text-3xl font-extrabold md:text-5xl">{service.title}</h1>
					{service.summary && (
						<p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">{service.summary}</p>
					)}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Button href="/request-project">درخواست این خدمت</Button>
						<Button href="/contact" variant="outlined">مشاوره‌ی رایگان</Button>
					</div>
				</Container>
			</section>

			{/* Overview / rich content */}
			{paragraphs.length > 0 && (
				<Section title="معرفی خدمت">
					<div className="mx-auto max-w-3xl space-y-5 text-lg leading-9 text-[var(--color-ink)]/85">
						{paragraphs.map((p, i) => (
							<Reveal key={i} delay={i * 60}>
								<p>{p}</p>
							</Reveal>
						))}
					</div>
				</Section>
			)}

			{/* Features */}
			{service.features.length > 0 && (
				<Section title="آنچه دریافت می‌کنید">
					<div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
						{service.features.map((f, i) => (
							<Reveal key={f} delay={i * 60}>
								<div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--elev-1)]">
									<span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-gradient-to-br from-[var(--color-primary)] to-fuchsia-500 text-xs text-white">✔</span>
									<span className="leading-7">{f}</span>
								</div>
							</Reveal>
						))}
					</div>
				</Section>
			)}

			{/* Process */}
			<Section title="فرآیند همکاری">
				<div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{processSteps.map((step, i) => (
						<Reveal key={step.title} delay={i * 80}>
							<div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
								<h3 className="mb-2 font-bold text-[var(--color-primary)]">{step.title}</h3>
								<p className="text-sm leading-7 text-[var(--color-muted)]">{step.desc}</p>
							</div>
						</Reveal>
					))}
				</div>
			</Section>

			{/* Related services */}
			{related.length > 0 && (
				<Section title="خدمات مرتبط">
					<div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
						{related.map((r, i) => (
							<Reveal key={r.id} delay={i * 70}>
								<a
									href={`/services/${r.slug}`}
									className="block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--elev-2)]"
								>
									{r.icon && <div className="mb-3 text-2xl">{r.icon}</div>}
									<h3 className="font-bold">{r.title}</h3>
									{r.summary && (
										<p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--color-muted)]">{r.summary}</p>
									)}
								</a>
							</Reveal>
						))}
					</div>
				</Section>
			)}

			{/* CTA */}
			<Container className="pb-20">
				<div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-primary)] to-fuchsia-600 p-10 text-center text-white">
					<h2 className="text-2xl font-extrabold md:text-3xl">آماده‌اید پروژه‌تان را شروع کنیم؟</h2>
					<p className="mx-auto mt-3 max-w-xl text-white/85">
						یک مشاوره‌ی رایگان رزرو کنید تا بهترین مسیر را برای تحقق ایده‌ی شما پیدا کنیم.
					</p>
					<div className="mt-6">
						<Button
							href="/request-project"
							className="!bg-white !text-[var(--color-primary)] hover:!bg-white/90 shadow-[var(--elev-1)]"
						>
							ثبت درخواست پروژه
						</Button>
					</div>
				</div>
			</Container>
		</>
	)
}
