"use client"

import { useEffect, useRef } from "react"

/**
 * نورِ کم‌جانی که اشاره‌گر را دنبال می‌کند.
 * فقط دو متغیر CSS را می‌نویسد و بقیه‌ی کار با گرادیانِ `.spot::after` انجام می‌شود —
 * پس هیچ چیزی در جاوااسکریپت رنگ نمی‌کشد و هر فریم فقط یک style-set است.
 */
export function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		let raf = 0
		let px = 0
		let py = 0

		const onMove = (e: PointerEvent) => {
			const box = el.getBoundingClientRect()
			px = e.clientX - box.left
			py = e.clientY - box.top
			if (raf) return
			// یک نوشتن در هر فریم، نه در هر رویداد
			raf = requestAnimationFrame(() => {
				raf = 0
				el.style.setProperty("--mx", `${px}px`)
				el.style.setProperty("--my", `${py}px`)
			})
		}

		el.addEventListener("pointermove", onMove, { passive: true })
		return () => {
			el.removeEventListener("pointermove", onMove)
			cancelAnimationFrame(raf)
		}
	}, [])

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	)
}
