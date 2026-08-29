import type { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PageHead } from "@/components/ui/container"
import { Reveal } from "@/components/ui/reveal"

export const metadata: Metadata = {
	title: "خدمات",
	description: "خدمات طراحی و توسعه‌ی وب ویرگول.",
}

export default async function ServicesPage() {
	const services = await safe(prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }), [])

	return (
		<>
			<PageHead
				index="01"
				label="Services"
				lines={[<>چه کاری</>, <>انجام می‌دهیم</>]}
				lead="هر پروژه از صفر طراحی می‌شود. لیست زیر خدماتی است که واقعاً انجام می‌دهیم — نه هر چیزی که بشود فروخت."
			/>

			<div className="px-[var(--pad)] pb-[var(--sec)]">
				{services.length === 0 && <p className="body-t">فهرست خدمات در دسترس نیست.</p>}
				<Reveal as="rule" />
				<ul>
					{services.map((s, i) => (
						<li key={s.id}>
							<Link href={`/services/${s.slug}`} className="row-i py-9 md:py-12">
								<div className="relative z-10 flex items-baseline gap-6 md:gap-12">
									<span className="num w-10 shrink-0 pt-1 text-2xl font-bold text-[var(--fg-3)] md:text-4xl">{String(i + 1).padStart(2, "0")}</span>
									<div className="min-w-0 flex-1">
										<h2 className="row-i__t h3">{s.title}</h2>
										{s.summary && <p className="body-t mt-3 max-w-[62ch] text-[15px]">{s.summary}</p>}
										{s.features.length > 0 && (
											<ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
												{s.features.slice(0, 4).map((f) => (
													<li key={f} className="tag">
														{f}
													</li>
												))}
											</ul>
										)}
									</div>
									<span className="row-i__go hidden shrink-0 self-center text-2xl md:block" aria-hidden="true">
										←
									</span>
								</div>
							</Link>
							<Reveal as="rule" />
						</li>
					))}
				</ul>
			</div>
		</>
	)
}
