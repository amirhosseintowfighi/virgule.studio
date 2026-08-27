export function StatCard({
	label,
	value,
	icon,
	hint,
}: {
	label: string
	value: string | number
	icon: string
	hint?: string
}) {
	return (
		<div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
			<div className="mb-3 flex items-center justify-between">
				<span className="text-sm text-[var(--color-muted)]">{label}</span>
				<span className="text-xl">{icon}</span>
			</div>
			<div className="font-latin text-3xl font-extrabold">
				{typeof value === "number" ? value.toLocaleString("fa-IR") : value}
			</div>
			{hint && <div className="mt-1 text-xs text-[var(--color-muted)]">{hint}</div>}
		</div>
	)
}
