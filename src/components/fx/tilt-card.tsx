"use client"

import { useRef } from "react"
import { clsx } from "clsx"

/** کارت سه‌بعدی که با حرکت ماوس کج می‌شود. */
export function TiltCard({
	children,
	className,
	max = 9,
}: {
	children: React.ReactNode
	className?: string
	max?: number
}) {
	const ref = useRef<HTMLDivElement>(null)

	const onMove = (e: React.MouseEvent) => {
		const el = ref.current
		if (!el) return
		const r = el.getBoundingClientRect()
		const px = (e.clientX - r.left) / r.width
		const py = (e.clientY - r.top) / r.height
		const rx = (0.5 - py) * max * 2
		const ry = (px - 0.5) * max * 2
		el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)"
	}
	const onLeave = () => {
		const el = ref.current
		if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"
	}

	return (
		<div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={clsx("tilt", className)}>
			{children}
		</div>
	)
}
