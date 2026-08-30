import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Magnetic } from "@/components/fx/magnetic"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { buildMetadata, JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"

export const metadata = buildMetadata({
	title: "پرسش‌های متداول درباره‌ی طراحی سایت",
	description:
		"هزینه‌ی طراحی سایت چطور تعیین می‌شود؟ چقدر طول می‌کشد؟ کد پروژه مال کیست؟ پاسخ صریح پرسش‌های رایج درباره‌ی همکاری با استودیو ویرگول.",
	path: "/faq",
})

export default async function FaqPage() {
	const [faqs, c] = await Promise.all([
		safe(prisma.faq.findMany({ orderBy: { order: "asc" } }), []),
		getContent("faq"),
	])
	const items = faqs.map((f) => ({ q: f.question, a: f.answer }))

	return (
		<>
			{/* FAQPage فقط وقتی معنا دارد که واقعاً سوالی روی صفحه باشد */}
			{items.length > 0 && <JsonLd data={faqJsonLd(items)} />}
			<JsonLd data={breadcrumbJsonLd([{ name: "پرسش‌های متداول", path: "/faq" }])} />

			<PageHead
				lines={[c.headLine1, c.headLine2]}
				lead={c.headLead}
			/>

			<section className="stage stage--l px-[var(--pad)] pb-[var(--sec)]">
				<div className="grid gap-14 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-24">
					<div className="lg:sticky lg:top-32 lg:h-fit">
						<Reveal>
							<p className="body-t max-w-[32ch]">{c.sideNote}</p>
						</Reveal>
						<Reveal delay={160} className="mt-8">
							<Link href="/contact" className="link-u accent font-medium">
								پرسیدن سوال ←
							</Link>
						</Reveal>
					</div>

					<div>
						{items.length === 0 ? (
							<p className="body-t">سوالی برای نمایش نیست.</p>
						) : (
							<FaqAccordion items={items} />
						)}
					</div>
				</div>
			</section>

			<section className="stage stage--c px-[var(--pad)] py-[var(--sec)]">
				<Reveal as="rule" className="mb-[var(--sec)]" />
				<h2 className="h2 max-w-[18ch]">
					<RevealLines className="sheen" lines={[c.ctaLine1, c.ctaLine2]} />
				</h2>
				<Reveal delay={240} className="mt-10">
					<p className="body-t max-w-[52ch]">{c.ctaLead}</p>
				</Reveal>
				<Reveal delay={380} className="mt-12">
					<Magnetic strength={0.22}>
						<Link href="/contact" className="btn btn--solid">
							تماس با ما
						</Link>
					</Magnetic>
				</Reveal>
			</section>
		</>
	)
}
