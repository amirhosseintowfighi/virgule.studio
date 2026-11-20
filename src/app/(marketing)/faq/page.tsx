import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead, Folio } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { More } from "@/components/ui/cta"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { Closing } from "@/components/marketing/closing"
import { buildMetadata, JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent } from "@/lib/content"
import { faNum } from "@/lib/fa"

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

			<PageHead label="پرسش‌ها" art={3} lines={[c.headLine1, c.headLine2]} lead={c.headLead} />

			<section className="wrap pb-[var(--sec)]">
				<Folio label="پاسخ‌ها" aside={items.length > 0 ? `${faNum(items.length)} پرسش` : undefined} heading />
				<div className="g12 mt-[clamp(32px,4vw,56px)]">
					<Reveal className="md:sticky md:top-28 md:col-span-4 md:h-fit">
						<p className="h3 max-w-[18ch]">{c.sideNote}</p>
						<More href="/contact" className="mt-8">
							پرسیدن سوال
						</More>
					</Reveal>

					<div className="md:col-span-7 md:col-start-6">
						{items.length === 0 ? (
							<p className="body-t">سوالی برای نمایش نیست.</p>
						) : (
							<FaqAccordion items={items} />
						)}
					</div>
				</div>
			</section>

			<Closing lines={[c.ctaLine1, c.ctaLine2]} lead={c.ctaLead} cta="تماس با ما" href="/contact" />
		</>
	)
}
