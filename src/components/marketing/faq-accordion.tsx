"use client"

import { useState } from "react"
import { clsx } from "clsx"

type Item = { q: string; a: string }

/** آکاردئون سوالات — بدون کادر، فقط خط و فاصله. باز و بسته‌شدن با ارتفاع شبکه‌ای، بدون پرش. */
export function FaqAccordion({ items }: { items: Item[] }) {
	const [open, setOpen] = useState<number | null>(0)

	return (
		<div>
			{items.map((item, i) => {
				const isOpen = open === i
				return (
					<div key={i} className="border-b border-[var(--line)]">
						<h3>
							<button
								onClick={() => setOpen(isOpen ? null : i)}
								aria-expanded={isOpen}
								className="flex w-full items-baseline gap-6 py-7 text-right"
							>
								<span className="meta font-latin shrink-0">{String(i + 1).padStart(2, "0")}</span>
								<span className={clsx("h3 flex-1 transition-colors duration-500", isOpen && "accent")}>
									{item.q}
								</span>
								<span
									className={clsx(
										"accent shrink-0 text-2xl transition-transform duration-500",
										isOpen && "rotate-45"
									)}
									aria-hidden="true"
									style={{ transitionTimingFunction: "var(--ease)" }}
								>
									+
								</span>
							</button>
						</h3>
						<div
							className="grid transition-[grid-template-rows] duration-700"
							style={{
								gridTemplateRows: isOpen ? "1fr" : "0fr",
								transitionTimingFunction: "var(--ease)",
							}}
						>
							<div className="overflow-hidden">
								<p className="body-t max-w-[62ch] pb-8 ps-[calc(2rem+1.5rem)] text-[15px]">{item.a}</p>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
