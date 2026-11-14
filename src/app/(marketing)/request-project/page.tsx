import { PageHead, Folio } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { ProjectRequestForm } from "@/components/marketing/project-request-form"
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo"
import { getContent, pairs } from "@/lib/content"

export const metadata = buildMetadata({
	title: "ثبت درخواست پروژه",
	description:
		"فرم درخواست طراحی سایت را پر کنید تا در کمتر از ۲۴ ساعت با شما تماس بگیریم. مشاوره‌ی اول رایگان است و هیچ الزامی برای همکاری ندارد.",
	path: "/request-project",
})

export default async function RequestProjectPage() {
	const c = await getContent("request")
	const assurances = pairs(c.assurances)

	return (
		<>
			<JsonLd data={breadcrumbJsonLd([{ name: "ثبت درخواست پروژه", path: "/request-project" }])} />

			<PageHead label="شروع پروژه" art={2} lines={[c.headLine1, c.headLine2]} lead={c.headLead} />

			<section className="wrap pb-[var(--sec)]">
				<div className="g12">
					{/* فرم اول می‌آید — در موبایل هم. تعهدها حاشیه‌ی آن‌اند، نه مانعِ رسیدن به آن. */}
					<div className="md:col-span-7">
						<Folio label={c.formTitle} />
						<div className="mt-10">
							<ProjectRequestForm />
						</div>
					</div>

					<aside className="md:sticky md:top-28 md:col-span-4 md:col-start-9 md:h-fit">
						<Folio label={c.sideTitle} />
						<ul className="mt-2">
							{assurances.map((a, i) => (
								<li key={a.t} className="border-b border-[var(--line)]">
									<Reveal delay={i * 80} className="py-6">
										<h3 className="t-title">{a.t}</h3>
										<p className="body-t mt-1 text-[.94rem]">{a.d}</p>
									</Reveal>
								</li>
							))}
						</ul>
					</aside>
				</div>
			</section>
		</>
	)
}
