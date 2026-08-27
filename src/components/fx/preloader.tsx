"use client"

import { useEffect, useState } from "react"
import { clsx } from "clsx"

/** پری‌لودرِ شمارنده (۰ تا ۱۰۰٪) که پس از بارگذاری محو می‌شود. */
export function Preloader() {
	const [count, setCount] = useState(0)
	const [done, setDone] = useState(false)

	useEffect(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		if (reduce) {
			setCount(100)
			setDone(true)
			return
		}
		const startTime = performance.now()
		const dur = 1300
		let raf = 0
		document.body.style.overflow = "hidden"
		const tick = (now: number) => {
			const p = Math.min(1, (now - startTime) / dur)
			setCount(Math.round(p * 100))
			if (p < 1) raf = requestAnimationFrame(tick)
			else window.setTimeout(() => setDone(true), 220)
		}
		raf = requestAnimationFrame(tick)
		return () => {
			cancelAnimationFrame(raf)
			document.body.style.overflow = ""
		}
	}, [])

	useEffect(() => {
		if (done) document.body.style.overflow = ""
	}, [done])

	const formatted = new Intl.NumberFormat("fa-IR").format(count)
	return (
		<div className={clsx("preloader", done && "done")} aria-hidden="true">
			<div className="text-center">
				<div className="text-gradient font-latin text-6xl font-extrabold md:text-7xl">{formatted}٪</div>
				<div className="mt-3 text-sm tracking-wide text-[var(--color-muted)]">ویرگول در حال آماده‌سازی…</div>
			</div>
		</div>
	)
}
