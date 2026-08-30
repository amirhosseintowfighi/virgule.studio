import Link from "next/link"
import { PageHead } from "@/components/ui/container"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Magnetic } from "@/components/fx/magnetic"
import { MarkBackdrop } from "@/components/fx/mark-backdrop"
import { ContactForm } from "@/components/marketing/contact-form"
import { buildMetadata, JsonLd, breadcrumbJsonLd, STUDIO } from "@/lib/seo"
import { getContent } from "@/lib/content"

export const metadata = buildMetadata({
	title: "تماس با استودیو ویرگول",
	description:
		"ایمیل، تلفن و فرم تماس استودیو ویرگول در تهران. معمولاً همان روز کاری پاسخ می‌دهیم و جلسه‌ی مشاوره‌ی اول رایگان است.",
	path: "/contact",
})

const channels = [
	{ label: "ایمیل", value: STUDIO.email, href: `mailto:${STUDIO.email}`, latin: true },
	{ label: "تلفن", value: STUDIO.phoneDisplay, href: `tel:${STUDIO.phone}`, latin: true },
	{ label: "محل", value: `${STUDIO.city}، ایران`, href: null, latin: false },
]

export default async function ContactPage() {
	const c = await getContent("contact")

	return (
		<>
			<JsonLd data={breadcrumbJsonLd([{ name: "تماس", path: "/contact" }])} />

			<PageHead
				lines={[c.headLine1, c.headLine2]}
				lead={c.headLead}
			/>

			<section className="stage stage--l relative px-[var(--pad)] pb-[var(--sec)]">
				<MarkBackdrop className="pointer-events-none absolute -top-[6%] left-[-20%] hidden h-[min(60vh,520px)] w-[min(60vh,520px)] opacity-60 lg:block" />

				<div className="relative z-10 grid gap-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24">
					{/* راه‌های تماس */}
					<div className="lg:sticky lg:top-32 lg:h-fit">
						<ul>
							{channels.map((ch, i) => (
								<li key={ch.label}>
									<Reveal as="rule" />
									<Reveal delay={i * 90} className="py-7">
										<div className="meta-fa mb-3">{ch.label}</div>
										{ch.href ? (
											<a
												href={ch.href}
												className={`link-u tap h3 ${ch.latin ? "font-latin" : ""}`}
												dir={ch.latin ? "ltr" : undefined}
											>
												{ch.value}
											</a>
										) : (
											<span className="h3">{ch.value}</span>
										)}
									</Reveal>
								</li>
							))}
							<Reveal as="rule" />
						</ul>

						<Reveal delay={320} className="mt-10">
							<p className="body-t max-w-[34ch] text-[15px]">
								اگر درخواست‌تان مفصل است، بهتر است{" "}
								<Link href="/request-project" className="link-u tap-inline accent">
									فرم ثبت پروژه
								</Link>{" "}
								را پر کنید تا از همان ابتدا تصویر کامل‌تری داشته باشیم.
							</p>
						</Reveal>
					</div>

					{/* فرم، داخل یک تخته — مثل بقیه‌ی سطوح سایت */}
					<Reveal as="rv-blur" delay={160}>
						<div className="panel p-[clamp(24px,4vw,56px)]">
							<span className="panel__edge" aria-hidden="true" />
							<h2 className="h3 mb-8">{c.formTitle}</h2>
							<ContactForm />
						</div>
					</Reveal>
				</div>
			</section>

			<section className="stage stage--c px-[var(--pad)] py-[var(--sec)]">
				<Reveal as="rule" className="mb-[var(--sec)]" />
				<h2 className="h2 max-w-[20ch]">
					<RevealLines className="sheen" lines={[c.priceLine1, c.priceLine2]} />
				</h2>
				<Reveal delay={240} className="mt-10">
					<p className="body-t max-w-[56ch]">{c.priceBody}</p>
				</Reveal>
				<Reveal delay={380} className="mt-12">
					<Magnetic strength={0.22}>
						<Link href="/request-project" className="btn btn--solid">
							{c.priceCta}
						</Link>
					</Magnetic>
				</Reveal>
			</section>
		</>
	)
}
