"use client"

import { useRef } from "react"
import { clsx } from "clsx"

/** عنصر مغناطیسی: با نزدیک‌شدن ماوس کمی به سمت آن کشیده می‌شود. */
export function Magnetic({
	children,
	className,
	strength = 0.35,
}: {
	children: React.ReactNode
	className?: string
	strength?: number
}) {
	const ref = useRef<HTMLSpanElement>(null)

	const onMove = (e: React.MouseEvent) => {
		const el = ref.current
		if (!el) return
		const r = el.getBoundingClientRect()
		const x = e.clientX - (r.left + r.width / 2)
		const y = e.clientY - (r.top + r.height / 2)
		el.style.transform = "translate(" + x * strength + "px," + y * strength + "px)"
	}
	const onLeave = () => {
		const el = ref.current
		if (el) el.style.transform = "translate(0px,0px)"
	}

	return (
		<span
			ref={ref}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			className={clsx("inline-block transition-transform duration-200 ease-out will-change-transform", className)}
		>
			{children}
		</span>
	)
}
