import type { Metadata } from "next"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/container"
import Link from "next/link"

export const metadata: Metadata = {
	title: "خدمات",
	description: "خدمات طراحی و توسعه‌ی وب ویرگول.",
}

export default async function ServicesPage() {
	const services = await prisma.service.findMany({
		where: { active: true },
		orderBy: { order: "asc" },
	})

	return (
		<Section eyebrow="خدمات" title="آنچه در ویرگول ارائه می‌دهیم">
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{services.map((s) => (
					<Link key={s.id} href={`/services/${s.slug}`}>
						<Card className="h-full">
							<h3 className="mb-2 font-bold">{s.title}</h3>
							<p className="text-sm text-[var(--color-muted)]">{s.summary}</p>
						</Card>
					</Link>
				))}
			</div>
		</Section>
	)
}
