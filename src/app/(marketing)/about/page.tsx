import type { Metadata } from "next"
import Link from "next/link"
import { PageHead, Slab } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"

export const metadata: Metadata = {
	title: "درباره ما",
	description: "داستان ویرگول و ارزش‌های ما.",
}

/* ارزش‌ها همان سه ارزشی است که از قبل روی سایت بود — فقط بازنویسی شده، نه اضافه‌شده. */
const values = [
	{
		t: "تمرکز بر نتیجه",
		d: "هر تصمیم طراحی و فنی با هدف رشد کسب‌وکار شما گرفته می‌شود. زیبایی بدون نتیجه، تزئین است.",
	},
	{
		t: "کیفیت بی‌اما",
		d: "جزئیات برای ما اهمیت دارد؛ حالت‌های خطا، موبایل، دسترس‌پذیری و سرعت هم بخشی از طراحی‌اند، نه کارِ بعد از تحویل.",
	},
	{
		t: "همکاری شفاف",
		d: "در تمام مراحل می‌دانید کجای کار هستیم، چه چیزی ساخته شده و قدم بعدی چیست.",
	},
]

export default function AboutPage() {
	return (
		<>
			<PageHead
				index="04"
				label="Studio"
				lines={[<>ویرگول یک استودیوی</>, <>طراحی و توسعه‌ی وب است</>]}
			/>

			<section className="px-[var(--pad)] pb-[var(--sec)]">
				<div className="grid gap-12 md:grid-cols-2 md:gap-20">
					<Reveal>
						<p className="body-t lead">
							اسم ما از همان علامت کوچکی می‌آید که در میان متن، مکث می‌سازد. باور ما این است که همین
							مکث‌ها — فاصله‌ها، ریتم، چیزهایی که حذف می‌شوند — تفاوت یک وب‌سایت معمولی و یک وب‌سایت
							ماندگار را می‌سازند.
						</p>
					</Reveal>
					<Reveal delay={120}>
						<p className="body-t">
							با تمرکز بر کیفیت، زیبایی و عملکرد، حضور دیجیتال برندها را متمایز می‌کنیم. طراحی و
							مهندسی را از هم جدا نمی‌کنیم: همان کسی که چیدمان را می‌چیند، کدش را هم می‌نویسد؛ برای
							همین چیزی که تحویل می‌گیرید دقیقاً همان چیزی است که دیده‌اید.
						</p>
					</Reveal>
				</div>
			</section>

			<section className="px-[var(--pad)] pb-[var(--sec)]">
				<Slab label="Values" />
				<div className="h-10" />
				<Reveal as="rule" />
				<ul>
					{values.map((v, i) => (
						<li key={v.t}>
							<Reveal delay={i * 70} className="grid gap-4 py-9 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
								<div className="flex items-baseline gap-5">
									<span className="num text-xl font-bold text-[var(--fg-3)]">{String(i + 1).padStart(2, "0")}</span>
									<h2 className="h3">{v.t}</h2>
								</div>
								<p className="body-t max-w-[58ch] text-[15px]">{v.d}</p>
							</Reveal>
							<Reveal as="rule" />
						</li>
					))}
				</ul>
			</section>

			<section className="border-t-[length:var(--bw-2)] border-[var(--fg)] px-[var(--pad)] py-[var(--sec)]">
				<h2 className="h2 max-w-[16ch]">
					<RevealLines lines={[<>با هم کار کنیم؟</>]} />
				</h2>
				<Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
					<Link href="/request-project" className="btn btn--solid">
						شروع پروژه
					</Link>
					<Link href="/portfolio" className="link-u font-bold">
						دیدن نمونه‌کارها ←
					</Link>
				</Reveal>
			</section>
		</>
	)
}
