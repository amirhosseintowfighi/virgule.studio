import type { Metadata } from "next"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
	title: "تعرفه",
	description: "پلن‌های قیمت‌گذاری شفاف ویرگول برای طراحی و توسعه‌ی وب‌سایت حرفه‌ای.",
}

export default async function PricingPage() {
	const plans = await prisma.plan.findMany({
		orderBy: { order: "asc" },
	})

	return (
		<Section
			eyebrow="تعرفه"
			title="پلنی مناسب هر کسب‌وکار"
			subtitle="قیمت‌ها شفاف و بدون هزینه‌ی پنهان است. اگر مطمئن نیستید کدام پلن مناسب شماست، یک مشاوره‌ی رایگان رزرو کنید تا کنار هم بهترین مسیر را انتخاب کنیم."
		>
			<div className="grid gap-6 md:grid-cols-3">
				{plans.map((plan) => (
					<Card
						key={plan.id}
						className={plan.highlighted ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]" : ""}
					>
						{plan.highlighted && (
							<span className="mb-3 inline-block rounded-[var(--radius-full)] bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
								پیشنهاد ویژه
							</span>
						)}
						<h3 className="text-lg font-bold">{plan.name}</h3>
						{plan.description && (
							<p className="mt-1 text-sm text-[var(--color-muted)]">{plan.description}</p>
						)}
						<div className="my-4">
							{plan.price > 0 ? (
								<>
									<span className="font-latin text-3xl font-extrabold">
										{plan.price.toLocaleString("fa-IR")}
									</span>
									<span className="text-sm text-[var(--color-muted)]"> تومان / {plan.period}</span>
								</>
							) : (
								<span className="text-2xl font-extrabold">تماس بگیرید</span>
							)}
						</div>
						<ul className="mb-6 space-y-2 text-sm">
							{plan.features.map((f) => (
								<li key={f} className="flex items-center gap-2">
									<span className="text-[var(--color-primary)]">✔</span> {f}
								</li>
							))}
						</ul>
						<Button href="/request-project" variant={plan.highlighted ? "filled" : "outlined"} className="w-full">
							انتخاب پلن
						</Button>
					</Card>
				))}
			</div>
		</Section>
	)
}
