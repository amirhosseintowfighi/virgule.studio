import type { Metadata } from "next"
import { Container } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"
import { AuroraBlobs, GridPattern } from "@/components/ui/decorations"
import { ProjectRequestForm } from "@/components/marketing/project-request-form"

export const metadata: Metadata = {
	title: "ثبت سفارش",
	description: "درخواست پروژه‌ی خود را ثبت کنید تا تیم ویرگول با شما تماس بگیرد.",
}

const assurances = [
	{ icon: "⏱️", chip: "from-indigo-500/15 to-violet-500/15 text-indigo-500", t: "پاسخ در کمتر از ۲۴ ساعت", d: "درخواست شما را سریع بررسی می‌کنیم." },
	{ icon: "💬", chip: "from-emerald-500/15 to-teal-500/15 text-emerald-500", t: "مشاوره‌ی رایگان", d: "بدون هیچ الزامی برای همکاری." },
	{ icon: "📝", chip: "from-fuchsia-500/15 to-pink-500/15 text-fuchsia-500", t: "پیشنهاد شفاف", d: "زمان‌بندی و هزینه‌ی دقیق و مکتوب." },
]

export default function RequestProjectPage() {
	return (
		<section className="relative overflow-hidden py-14 md:py-20">
			<AuroraBlobs />
			<GridPattern />
			<Container className="relative z-10 max-w-5xl">
				<div className="grid gap-10 md:grid-cols-5">
					<Reveal className="md:col-span-2">
						<span className="mb-4 inline-block rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)]/70 px-4 py-1.5 text-sm font-semibold text-[var(--color-primary)] backdrop-blur">
							🚀 شروع همکاری
						</span>
						<h1 className="text-gradient pb-1 text-3xl font-extrabold leading-tight md:text-4xl">پروژه‌تان را برای ما تعریف کنید</h1>
						<p className="mt-4 leading-8 text-[var(--color-muted)]">
							فرم روبه‌رو را پر کنید؛ تیم ویرگول در اولین فرصت با شما تماس می‌گیرد تا با هم بهترین مسیر را برای پروژه‌ی شما انتخاب کنیم.
						</p>
						<div className="mt-8 space-y-4">
							{assurances.map((a) => (
								<div key={a.t} className="flex items-start gap-3">
									<span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br text-lg ${a.chip}`}>
										{a.icon}
									</span>
									<div>
										<div className="font-semibold">{a.t}</div>
										<div className="text-sm text-[var(--color-muted)]">{a.d}</div>
									</div>
								</div>
							))}
						</div>
					</Reveal>
					<Reveal className="md:col-span-3" delay={120}>
						<div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6 shadow-[var(--elev-2)] backdrop-blur md:p-8">
							<ProjectRequestForm />
						</div>
					</Reveal>
				</div>
			</Container>
		</section>
	)
}
