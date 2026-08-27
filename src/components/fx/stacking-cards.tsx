import { clsx } from "clsx"

export type StackItem = {
	icon: string
	title: string
	desc: string
	grad: string
}

/**
 * کارت‌هایی که با اسکرول روی هم جمع/تلنبار می‌شوند (فقط CSS sticky).
 * والد نباید overflow-hidden یا transform داشته باشد.
 */
export function StackingCards({ items }: { items: StackItem[] }) {
	return (
		<div className="flex flex-col gap-6">
			{items.map((it, i) => {
				const style = { top: 96 + i * 18 + "px", zIndex: i + 1 }
				return (
					<div key={it.title} className="sticky" style={style}>
						<div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--elev-2)] md:p-8">
							<div className="flex items-start gap-5">
								<div className={clsx("flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br text-2xl text-white shadow-[var(--elev-1)]", it.grad)}>
									{it.icon}
								</div>
								<div>
									<div className="mb-1 font-latin text-sm font-bold text-[var(--color-muted)]">{"0" + (i + 1)}</div>
									<h3 className="text-xl font-bold">{it.title}</h3>
									<p className="mt-2 leading-8 text-[var(--color-muted)]">{it.desc}</p>
								</div>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
