import { Folio } from "@/components/ui/section"

/** قالبِ صفحه‌های قانونی: ستونِ باریکِ خواندنی، با همان سرصفحه‌ی بقیه‌ی سایت. */
export function LegalPage({
	title,
	updated,
	intro,
	sections,
}: {
	title: string
	updated: string
	intro: string
	sections: { t: string; d: React.ReactNode }[]
}) {
	return (
		<article className="wrap pb-[var(--sec)] pt-[clamp(120px,13vw,190px)]">
			<Folio label="قانونی" aside={`آخرین به‌روزرسانی: ${updated}`} />
			<div className="g12 mt-[clamp(40px,6vw,96px)]">
				<h1 className="h1 md:col-span-5">{title}</h1>
				<div className="prose-v md:col-span-6 md:col-start-7">
					<p>{intro}</p>
					{sections.map((s) => (
						<section key={s.t}>
							<h2>{s.t}</h2>
							<p className="mt-3">{s.d}</p>
						</section>
					))}
				</div>
			</div>
		</article>
	)
}
