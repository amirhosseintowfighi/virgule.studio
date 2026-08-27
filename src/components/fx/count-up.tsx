"use client"

import { useEffect, useRef, useState } from "react"

/** شمارنده‌ی متحرک که هنگام دیده‌شدن از صفر تا مقدار نهایی می‌شمارد (اعداد فارسی). */
export function CountUp({
	end,
	duration = 1800,
	suffix = "",
	prefix = "",
	decimals = 0,
}: {
	end: number
	duration?: number
	suffix?: string
	prefix?: string
	decimals?: number
}) {
	const ref = useRef<HTMLSpanElement>(null)
	const started = useRef(false)
	const [val, setVal] = useState(0)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const io = new IntersectionObserver(
			(entries) => {
				const e = entries[0]
				if (e && e.isIntersecting && !started.current) {
					started.current = true
					const startTime = performance.now()
					const tick = (now: number) => {
						const p = Math.min(1, (now - startTime) / duration)
						const eased = 1 - Math.pow(1 - p, 3)
						setVal(end * eased)
						if (p < 1) requestAnimationFrame(tick)
						else setVal(end)
					}
					requestAnimationFrame(tick)
					io.disconnect()
				}
			},
			{ threshold: 0.4 }
		)
		io.observe(el)
		return () => io.disconnect()
	}, [end, duration])

	const formatted = new Intl.NumberFormat("fa-IR", {
		maximumFractionDigits: decimals,
		minimumFractionDigits: decimals,
	}).format(val)

	return (
		<span ref={ref}>
			{prefix}
			{formatted}
			{suffix}
		</span>
	)
}
