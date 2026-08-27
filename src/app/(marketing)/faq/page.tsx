import type { Metadata } from "next"
import prisma from "@/lib/prisma"
import { Section } from "@/components/ui/container"
import { FaqAccordion } from "@/components/marketing/faq-accordion"

export const metadata: Metadata = {
	title: "سوالات متداول",
	description: "پاسخ پرسش‌های رایج درباره‌ی خدمات ویرگول.",
}

export default async function FaqPage() {
	const faqs = await prisma.faq.findMany({
		where: { active: true },
		orderBy: { order: "asc" },
	})
	const items = faqs.map((f) => ({ q: f.question, a: f.answer }))

	return (
		<Section eyebrow="سوالات متداول" title="هر چه باید بدانید">
			<div className="mx-auto max-w-3xl">
				<FaqAccordion items={items} />
			</div>
		</Section>
	)
}
