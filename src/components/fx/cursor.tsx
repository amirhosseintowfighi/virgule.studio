"use client"

import { useEffect, useRef, useState } from "react"

/**
 * کرسر سفارشی. سه حالت دارد:
 *  ۱. نقطه‌ی کوچک (پیش‌فرض)
 *  ۲. حلقه‌ی بزرگ‌تر روی هر عنصر تعاملی
 *  ۳. دایره‌ی برچسب‌دار روی عناصری با data-cursor="متن" (مثلاً «مشاهده»)
 * روی دستگاه‌های لمسی اصلاً رندر نمی‌شود.
 */
export function Cursor() {
	const el = useRef<HTMLDivElement>(null)
	const label = useRef<HTMLSpanElement>(null)
	const [on, setOn] = useState(false)

	useEffect(() => {
		const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
		if (!fine.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		setOn(true)
		document.body.classList.add("has-cursor")

		let tx = window.innerWidth / 2
		let ty = window.innerHeight / 2
		let x = tx
		let y = ty
		let raf = 0

		const onMove = (e: MouseEvent) => {
			tx = e.clientX
			ty = e.clientY
			const node = el.current
			if (!node) return
			const target = e.target as HTMLElement | null
			const labelled = target?.closest?.("[data-cursor]") as HTMLElement | null
			const text = labelled?.dataset.cursor
			if (text) {
				if (label.current) label.current.textContent = text
				node.classList.add("is-label")
				node.classList.remove("is-link")
			} else {
				node.classList.remove("is-label")
				node.classList.toggle("is-link", !!target?.closest?.("a,button,input,textarea,select,summary"))
			}
		}

		const loop = () => {
			// دنبال‌کردن با میرایی — حرکت باید کنترل‌شده حس شود، نه فنری
			x += (tx - x) * 0.19
			y += (ty - y) * 0.19
			if (el.current) el.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)

		const onLeave = () => el.current?.style.setProperty("opacity", "0")
		const onEnter = () => el.current?.style.setProperty("opacity", "1")

		window.addEventListener("mousemove", onMove, { passive: true })
		document.addEventListener("mouseleave", onLeave)
		document.addEventListener("mouseenter", onEnter)
		return () => {
			window.removeEventListener("mousemove", onMove)
			document.removeEventListener("mouseleave", onLeave)
			document.removeEventListener("mouseenter", onEnter)
			cancelAnimationFrame(raf)
			document.body.classList.remove("has-cursor")
		}
	}, [])

	if (!on) return null
	return (
		<div ref={el} className="cur" aria-hidden="true">
			<span ref={label} className="cur__label" />
		</div>
	)
}
