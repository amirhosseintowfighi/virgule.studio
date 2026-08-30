"use client"

import { Children, useEffect, useRef, useState } from "react"

/**
 * ریل افقی نمونه‌کارها.
 *
 * روی دسکتاپ (و مرورگرهایی که scroll-driven animation دارند) بخش به بالای صفحه
 * می‌چسبد و اسکرولِ عمودی به حرکت افقی ترجمه می‌شود؛ وقتی کارها تمام شدند،
 * صفحه به حالت عادی ادامه می‌دهد. تمام آن کار در CSS انجام می‌شود.
 *
 * این کامپوننت فقط دو چیز اضافه می‌کند:
 *  ۱. تعداد کارت‌ها را به CSS می‌دهد تا طول بخشِ قفل‌شده متناسب باشد.
 *  ۲. دکمه‌های حرکت، برای حالت پایه (موبایل و مرورگرهای بدون پشتیبانی) که در آن
 *     ریل با اسکرول افقی معمولی کار می‌کند و کاربر ماوس راهی برای حرکت ندارد.
 */
export function WorkRail({ children }: { children: React.ReactNode }) {
	const ref = useRef<HTMLDivElement>(null)
	const [atStart, setAtStart] = useState(true)
	const [atEnd, setAtEnd] = useState(false)
	const count = Children.count(children)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const update = () => {
			// در RTL مقدار scrollLeft منفی است؛ با abs یکدست می‌شود
			const x = Math.abs(el.scrollLeft)
			const max = el.scrollWidth - el.clientWidth
			setAtStart(x < 8)
			setAtEnd(x > max - 8)
		}

		update()
		el.addEventListener("scroll", update, { passive: true })
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => {
			el.removeEventListener("scroll", update)
			ro.disconnect()
		}
	}, [])

	const step = (dir: 1 | -1) => {
		const el = ref.current
		if (!el) return
		// یک کارت در هر کلیک، نه یک مقدار ثابت
		const card = el.querySelector(".rail__i")
		const amount = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
		// جهت در RTL برعکس است
		el.scrollBy({ left: dir * amount * -1, behavior: "smooth" })
	}

	return (
		<>
			<div className="hscroll" style={{ "--n": count } as React.CSSProperties}>
				<div className="hscroll__pin">
					<div
						ref={ref}
						className="rail"
						// در حالت پایه با کیبورد هم قابل اسکرول باشد
						tabIndex={0}
						role="region"
						aria-label="نمونه‌کارهای منتخب"
					>
						{children}
					</div>
				</div>
			</div>

			{/* در حالت قفل‌شده: چقدر از کارها را دیده‌اید */}
			<div className="hscroll__bar mt-10" aria-hidden="true">
				<i />
			</div>

			<div className="rail-nav-row mt-10 flex items-center gap-3">
				<button
					type="button"
					onClick={() => step(-1)}
					disabled={atStart}
					className="rail-nav"
					aria-label="نمونه‌کار قبلی"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
				<button
					type="button"
					onClick={() => step(1)}
					disabled={atEnd}
					className="rail-nav"
					aria-label="نمونه‌کار بعدی"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</div>
		</>
	)
}
