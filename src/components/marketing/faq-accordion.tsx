"use client"

import { useId, useState } from "react"
import { faIndex } from "@/lib/fa"

type Item = { q: string; a: string }

/** آکاردئون پرسش‌ها — فقط خط و فاصله. باز و بسته‌شدن با ارتفاع شبکه‌ای، بدون پرش. */
export function FaqAccordion({ items }: { items: Item[] }) {
	const [open, setOpen] = useState<number | null>(0)
	const uid = useId()

	return (
		<div className="border-t border-[var(--line-2)]">
			{items.map((item, i) => {
				const isOpen = open === i
				const panelId = `${uid}-p-${i}`
				const buttonId = `${uid}-b-${i}`
				return (
					<div key={i} className="border-b border-[var(--line)]">
						<h3>
							<button
								id={buttonId}
								onClick={() => setOpen(isOpen ? null : i)}
								aria-expanded={isOpen}
								aria-controls={panelId}
								className="group flex w-full items-baseline gap-5 py-6 text-start md:gap-8 md:py-7"
							>
								<span className="idx__n w-8 shrink-0 group-hover:text-[var(--accent)] group-aria-expanded:text-[var(--accent)]">
									{faIndex(i + 1)}
								</span>
								<span className="h3 flex-1">{item.q}</span>
								<span className="faq__sign" aria-hidden="true" />
							</button>
						</h3>
						<div
							id={panelId}
							role="region"
							aria-labelledby={buttonId}
							// بسته که هست، متنش نباید با Tab یا صفحه‌خوان پیدا شود
							inert={!isOpen}
							className="grid transition-[grid-template-rows] duration-700"
							style={{
								gridTemplateRows: isOpen ? "1fr" : "0fr",
								transitionTimingFunction: "var(--ease)",
							}}
						>
							<div className="overflow-hidden">
								<p className="body-t max-w-[62ch] pb-8 ps-[3.25rem] md:ps-16">{item.a}</p>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
