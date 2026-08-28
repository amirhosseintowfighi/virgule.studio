import type { Metadata } from "next"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead } from "@/components/ui/container"
import { FaqAccordion } from "@/components/marketing/faq-accordion"

export const metadata: Metadata = {
	title: "سوالات متداول",
	description: "پاسخ پرسش‌های رایج درباره‌ی خدمات ویرگول.",
}

export default async function FaqPage() {
	const faqs = await safe(prisma.faq.findMany({ orderBy: { order: "asc" } }), [])
	const items = faqs.map((f) => ({ q: f.question, a: f.answer }))

	return (
		<>
			<PageHead label="FAQ" lines={[<>هر چه</>, <>باید بدانید</>]} />
			<div className="px-[var(--pad)] pb-[var(--sec)]">
				<div className="max-w-[70rem]">
					{items.length === 0 ? <p className="body-t">سوالی برای نمایش نیست.</p> : <FaqAccordion items={items} />}
				</div>
			</div>
		</>
	)
}
