import { clsx } from "clsx"

export function Card({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<div
			className={clsx(
				"rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--elev-2)]",
				className
			)}
		>
			{children}
		</div>
	)
}
