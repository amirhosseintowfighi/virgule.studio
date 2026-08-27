import type { Metadata } from "next"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/container"
import Link from "next/link"

export const metadata: Metadata = {
	title: "نمونه‌کارها",
	description: "منتخبی از پروژه‌های ویرگول.",
}

export default async function PortfolioPage() {
	const projects = await prisma.project.findMany({
		orderBy: [{ featured: "desc" }, { order: "asc" }],
		include: { category: true },
	})

	return (
		<Section eyebrow="نمونه‌کارها" title="پروژه‌هایی که به آن‌ها افتخار می‌کنیم">
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{projects.map((p) => (
					<Link key={p.id} href={`/portfolio/${p.slug}`}>
						<Card className="h-full">
							<div className="mb-4 flex aspect-video items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-2)] text-4xl">
								🖼️
							</div>
							<div className="mb-1 text-xs text-[var(--color-primary)]">{p.category?.name}</div>
							<h3 className="mb-1 font-bold">{p.title}</h3>
							<p className="text-sm text-[var(--color-muted)]">{p.summary}</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{p.technologies.slice(0, 3).map((t) => (
									<span key={t} className="font-latin rounded-[var(--radius-full)] bg-[var(--color-surface-2)] px-3 py-1 text-xs">{t}</span>
								))}
							</div>
						</Card>
					</Link>
				))}
			</div>
		</Section>
	)
}
