import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"
import { MarkBackdrop } from "@/components/fx/mark-backdrop"
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

			<PageHead
				lines={[c.headLine1, c.headLine2]}
				lead={c.headLead}
			/>

			<section className="stage stage--r relative px-[var(--pad)] pb-[var(--sec)]">
				<MarkBackdrop className="pointer-events-none absolute -top-[8%] left-[-20%] hidden h-[min(62vh,540px)] w-[min(62vh,540px)] opacity-60 lg:block" />

				<div className="relative z-10 grid gap-16 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-24">
					{/* تعهدها — روی خطِ عمودی، مثل روش کارِ صفحه‌ی اصلی */}
					<div className="lg:sticky lg:top-32 lg:h-fit">
						<h2 className="h3 mb-8">{c.sideTitle}</h2>
						<ol className="track">
							{assurances.map((a, i) => (
								<li key={a.t} className="group relative">
									<span className="track__dot" aria-hidden="true" />
									<Reveal as="rv-blur" delay={i * 90} className="py-7">
										<h3 className="font-medium transition-colors duration-500 group-hover:text-[var(--accent)]">
											{a.t}
										</h3>
										<p className="body-t mt-2 text-[15px]">{a.d}</p>
									</Reveal>
								</li>
							))}
						</ol>
					</div>

					{/* فرم، داخل یک تخته */}
					<Reveal as="rv-blur" delay={160}>
						<div className="panel p-[clamp(24px,4vw,56px)]">
							<span className="panel__edge" aria-hidden="true" />
							<h2 className="h3 mb-8">{c.formTitle}</h2>
							<ProjectRequestForm />
						</div>
					</Reveal>
				</div>
			</section>
		</>
	)
}
