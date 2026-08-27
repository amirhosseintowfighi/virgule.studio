"use client"

import { useEffect, useState } from "react"
import { clsx } from "clsx"

const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
const fa = (n: number) => String(n).replace(/\d/g, (d) => FA[+d])

/** پری‌لودر: نشان ویرگول خودش را می‌کشد، بعد نوار و درصد. (پورت دقیق طرح اصلی) */
export function Preloader() {
	const [count, setCount] = useState(0)
	const [done, setDone] = useState(false)

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setCount(100)
			setDone(true)
			return
		}
		document.body.classList.add("lock")
		const t0 = performance.now()
		const dur = 2250
		let raf = 0
		const tick = (now: number) => {
			const p = Math.min(1, (now - t0) / dur)
			setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100))
			if (p < 1) raf = requestAnimationFrame(tick)
			else window.setTimeout(() => setDone(true), 140)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [])

	useEffect(() => {
		if (done) document.body.classList.remove("lock")
	}, [done])

	return (
		<div className={clsx("pre", done && "done")} role="status" aria-label="در حال بارگذاری">
			<div className="pre__glow" aria-hidden="true" />
			<div className="pre__box">
				<svg className="pre__mark" viewBox="0 0 366 404" fill="none" aria-hidden="true">
					<circle className="vm-ring" cx="218.1" cy="256.5" r="139.6" stroke="currentColor" strokeWidth="12" />
					<line className="vm-pen" x1="329" y1="6" x2="6" y2="329" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
					<path
						className="vm-nib"
						d="M 258.007812 139.054688 L 98.941406 297.347656 C 95.238281 283.875 92.921875 277.152344 92.921875 260.078125 L 221.828125 131.355469 C 235.054688 131.644531 245.84375 135.113281 258.007812 139.054688"
						fill="currentColor"
					/>
				</svg>
				<div className="pre__word">ویرگول استودیو</div>
				<div className="pre__bar">
					<i style={{ width: `${count}%` }} />
				</div>
				<div className="pre__num">
					<span>{fa(count)}</span>٪
				</div>
			</div>
		</div>
	)
}
