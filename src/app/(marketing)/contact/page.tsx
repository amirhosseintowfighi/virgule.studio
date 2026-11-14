import { PageHead, Folio } from "@/components/ui/section"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Cta, More } from "@/components/ui/cta"
import { ContactForm } from "@/components/marketing/contact-form"
import { buildMetadata, JsonLd, breadcrumbJsonLd, STUDIO } from "@/lib/seo"
import { getContent } from "@/lib/content"
import { faNum } from "@/lib/fa"

export const metadata = buildMetadata({
	title: "تماس با استودیو ویرگول",
	description:
		"ایمیل، تلفن و فرم تماس استودیو ویرگول در تهران. معمولاً همان روز کاری پاسخ می‌دهیم و جلسه‌ی مشاوره‌ی اول رایگان است.",
	path: "/contact",
})

const channels = [
	{ label: "ایمیل", value: STUDIO.email, href: `mailto:${STUDIO.email}` },
	{ label: "تلفن", value: faNum(STUDIO.phoneDisplay), href: `tel:${STUDIO.phone}` },
	{ label: "محل", value: `${STUDIO.city}، ایران`, href: null },
]

export default async function ContactPage() {
	const c = await getContent("contact")

	return (
		<>
			<JsonLd data={breadcrumbJsonLd([{ name: "تماس", path: "/contact" }])} />

			<PageHead label="تماس" art={4} lines={[c.headLine1, c.headLine2]} lead={c.headLead} />

			<section className="wrap pb-[var(--sec)]">
				<div className="g12">
					{/* راه‌های تماسِ مستقیم */}
					<div className="md:col-span-4">
						<Folio n={1} label="مستقیم" />
						<dl className="m-0 mt-2">
							{channels.map((ch, i) => (
								<Reveal key={ch.label} delay={i * 80} className="border-b border-[var(--line)] py-6">
									<dt className="meta-fa">{ch.label}</dt>
									<dd className="m-0 mt-1">
										{ch.href ? (
											<a href={ch.href} className="link-u tap h3" dir="ltr">
												{ch.value}
											</a>
										) : (
											<span className="h3">{ch.value}</span>
										)}
									</dd>
								</Reveal>
							))}
						</dl>
						<Reveal delay={280} className="mt-8">
							<p className="body-t max-w-[36ch] text-[.94rem]">
								اگر درخواست‌تان مفصل است، فرم ثبت پروژه تصویر کامل‌تری به ما می‌دهد.
							</p>
							<More href="/request-project" className="mt-5">
								فرم ثبت پروژه
							</More>
						</Reveal>
					</div>

					<div className="md:col-span-7 md:col-start-6">
						<Folio n={2} label={c.formTitle} />
						<div className="mt-10">
							<ContactForm />
						</div>
					</div>
				</div>
			</section>

			{/* هزینه — پرسشی که همه دارند و کمتر کسی می‌پرسد */}
			<section className="ink">
				<div className="wrap py-[var(--sec)]">
					<Folio label="هزینه" />
					<div className="g12 mt-[clamp(40px,6vw,88px)] items-end">
						<h2 className="h1 md:col-span-7">
							<RevealLines lines={[c.priceLine1, c.priceLine2]} />
						</h2>
						<Reveal delay={220} className="md:col-span-4 md:col-start-9">
							<p className="body-t">{c.priceBody}</p>
							<Cta href="/request-project" solid className="mt-8">
								{c.priceCta}
							</Cta>
						</Reveal>
					</div>
				</div>
			</section>
		</>
	)
}
