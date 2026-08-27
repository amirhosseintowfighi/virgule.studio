"use client"

import { useEffect, useRef } from "react"

/**
 * بک‌گراند شبکه‌ی عصبیِ متحرک و تعاملی با ماوس (Canvas 2D).
 * والد باید relative باشد. کارت را با className تمام‌صفحه بدهید.
 */
export function NeuralCanvas({ className }: { className?: string }) {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = ref.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		let w = 0
		let h = 0
		let raf = 0
		const mouse = { x: -9999, y: -9999 }
		type P = { x: number; y: number; vx: number; vy: number }
		let pts: P[] = []

		const readColor = () => {
			const c = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()
			const hex = c.startsWith("#") ? c : "#4f46e5"
			const n = hex.replace("#", "")
			const full = n.length === 3 ? n.split("").map((x) => x + x).join("") : n
			const int = parseInt(full, 16)
			return [(int >> 16) & 255, (int >> 8) & 255, int & 255] as const
		}
		let rgb = readColor()

		const resize = () => {
			const parent = canvas.parentElement
			w = parent ? parent.clientWidth : window.innerWidth
			h = parent ? parent.clientHeight : 480
			canvas.width = Math.floor(w * dpr)
			canvas.height = Math.floor(h * dpr)
			canvas.style.width = w + "px"
			canvas.style.height = h + "px"
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			const count = Math.max(24, Math.min(70, Math.floor((w * h) / 16000)))
			pts = Array.from({ length: count }, () => ({
				x: Math.random() * w,
				y: Math.random() * h,
				vx: (Math.random() - 0.5) * 0.45,
				vy: (Math.random() - 0.5) * 0.45,
			}))
			rgb = readColor()
		}
		resize()

		const onMove = (e: MouseEvent) => {
			const r = canvas.getBoundingClientRect()
			mouse.x = e.clientX - r.left
			mouse.y = e.clientY - r.top
		}
		const onLeave = () => {
			mouse.x = -9999
			mouse.y = -9999
		}

		const draw = () => {
			const [r0, g0, b0] = rgb
			ctx.clearRect(0, 0, w, h)

			for (const p of pts) {
				p.x += p.vx
				p.y += p.vy
				if (p.x < 0 || p.x > w) p.vx *= -1
				if (p.y < 0 || p.y > h) p.vy *= -1
			}

			for (let i = 0; i < pts.length; i++) {
				for (let j = i + 1; j < pts.length; j++) {
					const a = pts[i]
					const b = pts[j]
					const dx = a.x - b.x
					const dy = a.y - b.y
					const dist = Math.sqrt(dx * dx + dy * dy)
					if (dist < 118) {
						const op = (1 - dist / 118) * 0.45
						ctx.strokeStyle = "rgba(" + r0 + "," + g0 + "," + b0 + "," + op + ")"
						ctx.lineWidth = 1
						ctx.beginPath()
						ctx.moveTo(a.x, a.y)
						ctx.lineTo(b.x, b.y)
						ctx.stroke()
					}
				}
			}

			for (const p of pts) {
				const dx = mouse.x - p.x
				const dy = mouse.y - p.y
				const dist = Math.sqrt(dx * dx + dy * dy)
				if (dist < 170) {
					const op = (1 - dist / 170) * 0.85
					ctx.strokeStyle = "rgba(" + r0 + "," + g0 + "," + b0 + "," + op + ")"
					ctx.lineWidth = 1
					ctx.beginPath()
					ctx.moveTo(mouse.x, mouse.y)
					ctx.lineTo(p.x, p.y)
					ctx.stroke()
				}
				ctx.fillStyle = "rgba(" + r0 + "," + g0 + "," + b0 + ",0.85)"
				ctx.beginPath()
				ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
				ctx.fill()
			}

			raf = requestAnimationFrame(draw)
		}
		draw()

		window.addEventListener("resize", resize)
		window.addEventListener("mousemove", onMove)
		canvas.addEventListener("mouseleave", onLeave)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", resize)
			window.removeEventListener("mousemove", onMove)
			canvas.removeEventListener("mouseleave", onLeave)
		}
	}, [])

	return <canvas ref={ref} aria-hidden="true" className={className} />
}
