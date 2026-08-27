"use client"

import { useEffect, useRef, useState } from "react"

/** کرسر سفارشی (نقطه + حلقه‌ی دنبال‌کننده). فقط روی دستگاه‌های دارای ماوس. */
export function CustomCursor() {
	const dot = useRef<HTMLDivElement>(null)
	const ring = useRef<HTMLDivElement>(null)
	const [enabled, setEnabled] = useState(false)

	useEffect(() => {
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
		setEnabled(true)
		document.body.classList.add("has-custom-cursor")

		let dx = 0
		let dy = 0
		let rx = 0
		let ry = 0
		let raf = 0

		const onMove = (e: MouseEvent) => {
			dx = e.clientX
			dy = e.clientY
			if (dot.current) dot.current.style.transform = "translate(" + dx + "px," + dy + "px) translate(-50%,-50%)"
			const t = e.target as HTMLElement
			const interactive = t && t.closest ? t.closest("a,button,input,textarea,select,[data-cursor]") : null
			if (ring.current) ring.current.classList.toggle("hovered", !!interactive)
		}
		const loop = () => {
			rx += (dx - rx) * 0.18
			ry += (dy - ry) * 0.18
			if (ring.current) ring.current.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)"
			raf = requestAnimationFrame(loop)
		}
		loop()
		window.addEventListener("mousemove", onMove)
		return () => {
			window.removeEventListener("mousemove", onMove)
			cancelAnimationFrame(raf)
			document.body.classList.remove("has-custom-cursor")
		}
	}, [])

	if (!enabled) return null
	return (
		<>
			<div ref={dot} className="cursor-dot" aria-hidden="true" />
			<div ref={ring} className="cursor-ring" aria-hidden="true" />
		</>
	)
}
