import { icons, type IconName } from "@/components/admin/icons"

export function StatCard({
	label,
	value,
	icon,
	hint,
}: {
	label: string
	value: string | number
	icon: IconName
	hint?: string
}) {
	return (
		<div className="border-[length:var(--bw-2)] border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--elev-1)]">
			<div className="mb-3 flex items-center justify-between text-[var(--color-muted)]">
				<span className="text-sm font-bold">{label}</span>
				{icons[icon]}
			</div>
			<div className="font-latin text-4xl font-extrabold leading-none">
				{typeof value === "number" ? value.toLocaleString("fa-IR") : value}
			</div>
			{hint && <div className="mt-2 text-xs text-[var(--color-muted)]">{hint}</div>}
		</div>
	)
}
