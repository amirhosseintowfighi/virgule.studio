import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Container, Section } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { AuroraBlobs, GridPattern } from "@/components/ui/decorations"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const project = await prisma.project.findUnique({ where: { slug } })
	if (!project) return { title: "نمونه‌کار" }
	return { title: project.title, description: project.summary ?? undefined }
}

export default async function PortfolioDetailPage({ params }: Props) {
	const { slug } = await params
	const project = await prisma.project.findUnique({
		where: { slug },
		include: { category: true },
	})
	if (!project) notFound()

	return (
		<>
			<section className="relative overflow-hidden py-14 md:py-20">
				<AuroraBlobs />
				<GridPattern />
				<Container className="relative z-10 max-w-3xl text-center">
					{project.category?.name && (
						<span className="mb-3 inline-block rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-4 py-1 text-xs font-semibold text-[var(--color-primary)]">
							{project.category.name}
						</span>
					)}
					<h1 className="text-gradient pb-1 text-3xl font-extrabold md:text-5xl">{project.title}</h1>
					{project.summary && (
						<p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">{project.summary}</p>
					)}
				</Container>
			</section>

			<Container className="max-w-4xl">
				<div className="flex aspect-video items-center justify-center rounded-[var(--radius-xl)] bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-sky-500/10 text-6xl">
					🖼️
				</div>
			</Container>

			<Section title="درباره‌ی پروژه">
				<div className="mx-auto max-w-3xl space-y-8">
					{project.content && (
						<p className="leading-8 text-[var(--color-muted)]">{project.content}</p>
					)}

					<div className="grid gap-4 sm:grid-cols-3">
						{project.client && (
							<div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
								<div className="text-xs text-[var(--color-muted)]">کارفرما</div>
								<div className="mt-1 font-semibold">{project.client}</div>
							</div>
						)}
						{project.year && (
							<div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
								<div className="text-xs text-[var(--color-muted)]">سال</div>
								<div className="mt-1 font-latin font-semibold">{project.year}</div>
							</div>
						)}
						{project.url && (
							<div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
								<div className="text-xs text-[var(--color-muted)]">لینک</div>
								<a href={project.url} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold text-[var(--color-primary)]">مشاهده</a>
							</div>
						)}
					</div>

					{project.technologies.length > 0 && (
						<div>
							<h3 className="mb-3 font-bold">تکنولوژی‌ها</h3>
							<div className="flex flex-wrap gap-2">
								{project.technologies.map((t) => (
									<span key={t} className="font-latin rounded-[var(--radius-full)] bg-[var(--color-surface-2)] px-3 py-1 text-xs">{t}</span>
								))}
							</div>
						</div>
					)}

					<div className="pt-4 text-center">
						<Button href="/request-project">پروژه‌ای مشابه دارید؟ ثبت سفارش</Button>
					</div>
				</div>
			</Section>
		</>
	)
}
