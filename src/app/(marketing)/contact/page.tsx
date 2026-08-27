import type { Metadata } from "next"
import { Container, Section } from "@/components/ui/container"
import { ContactForm } from "@/components/marketing/contact-form"

export const metadata: Metadata = {
	title: "تماس با ما",
	description: "با تیم ویرگول در تماس باشید.",
}

export default function ContactPage() {
	return (
		<Section eyebrow="تماس" title="با ما گفتگو کنید">
			<div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
				<div className="space-y-4">
					<p className="text-[var(--color-muted)]">
						برای شروع پروژه یا پرسش، فرم روبه‌رو را پر کنید یا مستقیم تماس بگیرید.
					</p>
					<div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
						<div className="text-sm text-[var(--color-muted)]">ایمیل</div>
						<div className="font-latin font-semibold">info@virgule.studio</div>
					</div>
					<div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
						<div className="text-sm text-[var(--color-muted)]">تلفن</div>
						<div className="font-latin font-semibold">09999571001</div>
					</div>
				</div>
				<ContactForm />
			</div>
		</Section>
	)
}
