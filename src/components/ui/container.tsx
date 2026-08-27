import { clsx } from "clsx"
import { Reveal } from "@/components/ui/reveal"

export function Container({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<div className={clsx("mx-auto w-full max-w-[var(--container)] px-4 md:px-6", className)}>
			{children}
		</div>
	)
}

export function Section({
	id,
	eyebrow,
	title,
	subtitle,
	children,
}: {
	id?: string
	eyebrow?: string
	title?: string
	subtitle?: string
	children: React.ReactNode
}) {
	return (
		<section id={id} className="py-16 md:py-24">
			<Container>
				{(eyebrow || title) && (
					<Reveal className="mb-10 text-center">
						{eyebrow && (
							<span className="mb-3 inline-block rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-4 py-1 text-xs font-semibold text-[var(--color-primary)]">
								{eyebrow}
							</span>
						)}
						{title && (
							<h2 className="text-gradient mx-auto max-w-3xl pb-1 text-3xl font-extrabold leading-tight md:text-4xl">
								{title}
							</h2>
						)}
						{subtitle && (
							<p className="mx-auto mt-3 max-w-2xl text-[var(--color-muted)]">{subtitle}</p>
						)}
					</Reveal>
				)}
				<Reveal delay={120}>{children}</Reveal>
			</Container>
		</section>
	)
}
