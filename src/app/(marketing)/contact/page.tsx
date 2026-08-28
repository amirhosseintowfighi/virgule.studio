import type { Metadata } from "next"
import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"
import { ContactForm } from "@/components/marketing/contact-form"

export const metadata: Metadata = {
	title: "تماس با ما",
	description: "با تیم ویرگول در تماس باشید.",
}

export default function ContactPage() {
	return (
		<>
			<PageHead
				index="05"
				label="Contact"
				lines={[<>پروژه‌ای در</>, <>ذهن دارید؟</>]}
				lead="فرم را پر کنید یا مستقیم تماس بگیرید. معمولاً همان روز کاری جواب می‌دهیم."
			/>

			<section className="px-[var(--pad)] pb-[var(--sec)]">
				<div className="grid gap-16 md:grid-cols-[minmax(0,24rem)_1fr] md:gap-24">
					<div>
						<Reveal>
							<div className="meta-fa mb-3">ایمیل</div>
							<a href="mailto:info@virgule.studio" className="link-u font-latin h3" dir="ltr">
								info@virgule.studio
							</a>
						</Reveal>
						<Reveal delay={90} className="mt-10">
							<div className="meta-fa mb-3">تلفن</div>
							<a href="tel:09999571001" className="link-u num h3" dir="ltr">
								0999 957 1001
							</a>
						</Reveal>
						<Reveal delay={180} className="mt-10">
							<div className="meta-fa mb-3">وب‌سایت</div>
							<span className="font-latin h3" dir="ltr">
								virgule.studio
							</span>
						</Reveal>
					</div>

					<Reveal delay={120}>
						<ContactForm />
					</Reveal>
				</div>
			</section>
		</>
	)
}
