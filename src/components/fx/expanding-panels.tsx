"use client"

import { useState } from "react"
import { clsx } from "clsx"

export type Panel = { title: string; desc: string; icon: string; grad: string }

/** پنل‌های بازشونده: با هاور/کلیک باز می‌شوند و متن را نشان می‌دهند. */
export function ExpandingPanels({ panels }: { panels: Panel[] }) {
	const [active, setActive] = useState(0)
	return (
		<div className="flex flex-col gap-3 md:h-[400px] md:flex-row">
			{panels.map((p, i) => {
				const isActive = active === i
				return (
					<div
						key={p.title}
						onMouseEnter={() => setActive(i)}
						onClick={() => setActive(i)}
						className={clsx(
							"relative cursor-pointer overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
							isActive
								? "bg-gradient-to-br text-white shadow-[var(--elev-3)] md:flex-[3.2] " + p.grad
								: "bg-[var(--color-surface-2)] md:flex-[1]"
						)}
					>
						<div className="text-3xl">{p.icon}</div>
						<h3 className={clsx("mt-4 text-lg font-bold", isActive ? "text-white" : "text-[var(--color-ink)]")}>
							{p.title}
						</h3>
						<p
							className={clsx(
								"mt-3 max-w-md text-sm leading-7 transition-opacity duration-300",
								isActive ? "text-white/90 opacity-100" : "text-[var(--color-muted)] opacity-0"
							)}
						>
							{p.desc}
						</p>
						<div className={clsx("absolute bottom-5 left-6 font-latin text-4xl font-black opacity-20", isActive ? "text-white" : "text-[var(--color-muted)]")}>
							{"0" + (i + 1)}
						</div>
					</div>
				)
			})}
		</div>
	)
}
