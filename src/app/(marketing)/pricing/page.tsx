import type { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"

export const metadata: Metadata = {
	title: "تعرفه",
	description: "پلن‌های قیمت‌گذاری شفاف ویرگول برای طراحی و توسعه‌ی وب‌سایت حرفه‌ای.",
}

export default async function PricingPage() {
	const plans = await prisma.plan.findMany({ orderBy: { order: "asc" } })

	return (
		<>
			<PageHead
				label="Pricing"
				lines={[<>پلنی مناسب</>, <>هر کسب‌وکار</>]}
				lead="قیمت‌ها شفاف و بدون هزینه‌ی پنهان است. اگر مطمئن نیستید کدام پلن مناسب شماست، یک مشاوره‌ی رایگان رزرو کنید."
			/>

			<div className="px-[var(--pad)] pb-[var(--sec)]">
				<Reveal as="rule" />
				{plans.map((plan, i) => (
					<div key={plan.id}>
						<Reveal
							delay={i * 70}
							className="grid gap-8 py-12 md:grid-cols-[minmax(0,22rem)_1fr_auto] md:items-start md:gap-16"
						>
							<div>
								<div className="flex items-center gap-4">
									<span className="meta font-latin">{String(i + 1).padStart(2, "0")}</span>
									<h2 className="h3">{plan.name}</h2>
									{plan.highlighted && <span className="meta-fa accent">پیشنهاد ویژه</span>}
								</div>
								{plan.description && <p className="body-t mt-3 text-[15px]">{plan.description}</p>}
								<div className="mt-6">
									{plan.price > 0 ? (
										<div className="flex items-baseline gap-2">
											<span className="num h2">{plan.price.toLocaleString("fa-IR")}</span>
											<span className="meta-fa">تومان / {plan.period}</span>
										</div>
									) : (
										<span className="h3">تماس بگیرید</span>
									)}
								</div>
							</div>

							<ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
								{plan.features.map((f) => (
									<li key={f} className="flex items-baseline gap-3 text-[15px]">
										<span className="accent" aria-hidden="true">
											—
										</span>
										{f}
									</li>
								))}
							</ul>

							<Link href="/request-project" className={plan.highlighted ? "btn btn--solid" : "btn"}>
								انتخاب پلن
							</Link>
						</Reveal>
						<Reveal as="rule" />
					</div>
				))}
			</div>
		</>
	)
}
