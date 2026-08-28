"use client"

import { useEffect } from "react"
import Lenis from "lenis"

/**
 * اسکرول نرم سراسری. کنترل‌شده و کوتاه — نه شناور و کند.
 * با prefers-reduced-motion کاملاً خاموش می‌شود و اسکرول بومی مرورگر برمی‌گردد.
 */
export function SmoothScroll() {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		const lenis = new Lenis({
			duration: 1.05,
			easing: (t: number) => 1 - Math.pow(1 - t, 3),
			// روی لمس، اسکرول بومی طبیعی‌تر و سریع‌تر است
			syncTouch: false,
			touchMultiplier: 1,
		})

		let raf = 0
		const loop = (time: number) => {
			lenis.raf(time)
			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)

		// لنگرهای داخل صفحه از همین موتور عبور کنند
		const onClick = (e: MouseEvent) => {
			const a = (e.target as HTMLElement)?.closest?.("a[href^='#']") as HTMLAnchorElement | null
			if (!a) return
			const id = a.getAttribute("href")
			if (!id || id === "#") return
			const el = document.querySelector(id)
			if (!el) return
			e.preventDefault()
			lenis.scrollTo(el as HTMLElement, { offset: -80 })
		}
		document.addEventListener("click", onClick)

		return () => {
			document.removeEventListener("click", onClick)
			cancelAnimationFrame(raf)
			lenis.destroy()
		}
	}, [])

	return null
}
