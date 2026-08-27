"use client"

import { useState } from "react"

type Item = { q: string; a: string }

export function FaqAccordion({ items }: { items: Item[] }) {
	const [open, setOpen] = useState<number | null>(0)
	return (
		<div className="space-y-3">
			{items.map((item, i) => {
				const isOpen = open === i
				return (
					<div
						key={i}
						className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]"
					>
						<button
							onClick={() => setOpen(isOpen ? null : i)}
							className="flex w-full items-center justify-between gap-4 p-4 text-right font-semibold transition-colors hover:bg-[var(--color-surface-2)]"
							aria-expanded={isOpen}
						>
							<span>{item.q}</span>
							<span className="text-[var(--color-primary)]">{isOpen ? "−" : "+"}</span>
						</button>
						{isOpen && (
							<div className="px-4 pb-4 text-sm text-[var(--color-muted)]">{item.a}</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
