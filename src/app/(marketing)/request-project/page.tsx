import type { Metadata } from "next"
import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"
import { ProjectRequestForm } from "@/components/marketing/project-request-form"

export const metadata: Metadata = {
	title: "ثبت سفارش",
	description: "درخواست پروژه‌ی خود را ثبت کنید تا تیم ویرگول با شما تماس بگیرد.",
}

/* همان تعهدهایی که از قبل روی سایت بود. */
const assurances = [
	{ t: "پاسخ در کمتر از ۲۴ ساعت", d: "درخواست شما را سریع بررسی می‌کنیم." },
	{ t: "مشاوره‌ی رایگان", d: "بدون هیچ الزامی برای همکاری." },
	{ t: "پیشنهاد شفاف", d: "زمان‌بندی و هزینه‌ی دقیق و مکتوب." },
]

export default function RequestProjectPage() {
	return (
		<>
			<PageHead
				label="Start a project"
				lines={[<>پروژه‌تان را</>, <>برایمان تعریف کنید</>]}
				lead="فرم را پر کنید؛ در اولین فرصت تماس می‌گیریم تا با هم بهترین مسیر را انتخاب کنیم."
			/>

			<section className="px-[var(--pad)] pb-[var(--sec)]">
				<div className="grid gap-16 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-24">
					<div>
						{assurances.map((a, i) => (
							<Reveal key={a.t} delay={i * 80} className="border-b border-[var(--line)] py-6 first:pt-0">
								<div className="flex items-baseline gap-4">
									<span className="meta font-latin">{String(i + 1).padStart(2, "0")}</span>
									<div>
										<div className="font-bold">{a.t}</div>
										<div className="body-t mt-1 text-[15px]">{a.d}</div>
									</div>
								</div>
							</Reveal>
						))}
					</div>

					<Reveal delay={120}>
						<ProjectRequestForm />
					</Reveal>
				</div>
			</section>
		</>
	)
}
