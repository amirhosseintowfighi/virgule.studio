import type { Metadata } from "next"
import { Container, Section } from "@/components/ui/container"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
	title: "درباره ما",
	description: "داستان ویرگول و ارزش‌های ما.",
}

const values = [
	{ icon: "🎯", t: "تمرکز بر نتیجه", d: "هر پروژه با هدف رشد کسب‌وکار شما." },
	{ icon: "💎", t: "کیفیت بی‌اما", d: "جزئیات برای ما اهمیت دارد." },
	{ icon: "🤝", t: "همکاری شفاف", d: "ارتباط مستمر در تمام مراحل." },
]

export default function AboutPage() {
	return (
		<>
			<section className="py-16 md:py-24">
				<Container className="max-w-3xl text-center">
					<h1 className="text-3xl font-extrabold md:text-5xl">درباره‌ی ویرگول</h1>
					<p className="mt-6 text-lg leading-loose text-[var(--color-muted)]">
						ویرگول یک استودیوی طراحی و توسعه‌ی وب است که با تمرکز بر کیفیت، زیبایی و عملکرد، حضور دیجیتال برندها را متمایز می‌کند. ما باور داریم هر جزئیات، حتی یک مکث، می‌تواند دیده شود.
					</p>
				</Container>
			</section>

			<Section eyebrow="ارزش‌های ما" title="آنچه به آن پایبندیم">
				<div className="grid gap-6 md:grid-cols-3">
					{values.map((v) => (
						<Card key={v.t} className="text-center">
							<div className="mb-3 text-3xl">{v.icon}</div>
							<h3 className="mb-2 font-bold">{v.t}</h3>
							<p className="text-sm text-[var(--color-muted)]">{v.d}</p>
						</Card>
					))}
				</div>
			</Section>
		</>
	)
}
