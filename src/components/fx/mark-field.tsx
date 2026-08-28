"use client"

import { useEffect, useRef } from "react"

/**
 * نشان ویرگول از دلِ نویز شکل می‌گیرد — «مکثی که دیده می‌شود».
 * ذرات به نقاط نمونه‌برداری‌شده از خودِ لوگو میل می‌کنند و از کرسر می‌گریزند.
 * Canvas 2D است، نه WebGL: بدون وابستگی، سبک، و روی موبایل هم روان.
 */

const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 366 404" width="366" height="404">
<circle cx="218.1" cy="256.5" r="139.6" stroke="#fff" stroke-width="12" fill="none"/>
<line x1="329" y1="6" x2="6" y2="329" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
<path d="M 258.007812 139.054688 L 98.941406 297.347656 C 95.238281 283.875 92.921875 277.152344 92.921875 260.078125 L 221.828125 131.355469 C 235.054688 131.644531 245.84375 135.113281 258.007812 139.054688" fill="#fff"/>
</svg>`

type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; r: number }

export function MarkField({ className }: { className?: string }) {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = ref.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		let parts: P[] = []
		let w = 0
		let h = 0
		let dpr = 1
		let raf = 0
		let visible = true
		const mouse = { x: -9999, y: -9999 }

		const img = new Image()
		img.src = "data:image/svg+xml;utf8," + encodeURIComponent(MARK_SVG)

		/** نقاط هدف را با رسم لوگو روی یک بوم کمکی و خواندن پیکسل‌ها می‌سازد. */
		function sample() {
			const box = canvas!.getBoundingClientRect()
			w = box.width
			h = box.height
			dpr = Math.min(window.devicePixelRatio || 1, 2)
			canvas!.width = Math.round(w * dpr)
			canvas!.height = Math.round(h * dpr)
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

			// لوگو را در مرکز، به اندازه‌ی ~۶۲٪ کوچک‌ترین ضلع
			const size = Math.min(w, h) * 0.62
			const dw = size * (366 / 404)
			const dh = size
			const ox = (w - dw) / 2
			const oy = (h - dh) / 2

			const off = document.createElement("canvas")
			off.width = Math.max(1, Math.round(dw))
			off.height = Math.max(1, Math.round(dh))
			const octx = off.getContext("2d", { willReadFrequently: true })
			if (!octx) return
			octx.drawImage(img, 0, 0, off.width, off.height)
			const data = octx.getImageData(0, 0, off.width, off.height).data

			// فاصله‌ی نمونه‌برداری با اندازه‌ی صفحه بالا می‌رود تا تعداد ذرات ثابت بماند
			const step = w < 600 ? 5 : 4
			const targets: { x: number; y: number }[] = []
			for (let y = 0; y < off.height; y += step) {
				for (let x = 0; x < off.width; x += step) {
					if (data[(y * off.width + x) * 4 + 3] > 128) targets.push({ x: ox + x, y: oy + y })
				}
			}

			parts = targets.map((t) => ({
				x: Math.random() * w,
				y: Math.random() * h,
				tx: t.x,
				ty: t.y,
				vx: 0,
				vy: 0,
				r: Math.random() * 1.1 + 0.7,
			}))

			if (reduce) draw(true)
		}

		function draw(settle = false) {
			ctx!.clearRect(0, 0, w, h)
			for (const p of parts) {
				if (settle) {
					p.x = p.tx
					p.y = p.ty
				} else {
					// جذب به نقطه‌ی هدف
					p.vx += (p.tx - p.x) * 0.014
					p.vy += (p.ty - p.y) * 0.014
					// گریز از کرسر
					const dx = p.x - mouse.x
					const dy = p.y - mouse.y
					const d2 = dx * dx + dy * dy
					if (d2 < 14400) {
						const f = (14400 - d2) / 14400
						const d = Math.sqrt(d2) || 1
						p.vx += (dx / d) * f * 2.6
						p.vy += (dy / d) * f * 2.6
					}
					p.vx *= 0.86
					p.vy *= 0.86
					p.x += p.vx
					p.y += p.vy
				}
				ctx!.fillRect(p.x, p.y, p.r, p.r)
			}
		}

		function loop() {
			if (visible) draw()
			raf = requestAnimationFrame(loop)
		}

		const onMove = (e: MouseEvent) => {
			const box = canvas.getBoundingClientRect()
			mouse.x = e.clientX - box.left
			mouse.y = e.clientY - box.top
		}
		const onLeave = () => {
			mouse.x = -9999
			mouse.y = -9999
		}

		img.onload = () => {
			ctx.fillStyle = "#c13bd1"
			sample()
			if (!reduce) loop()
		}

		const ro = new ResizeObserver(() => {
			if (img.complete && img.naturalWidth) sample()
		})
		ro.observe(canvas)

		// خارج از کادر دید، هیچ کاری نکن
		const vis = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
		vis.observe(canvas)

		window.addEventListener("mousemove", onMove, { passive: true })
		window.addEventListener("mouseout", onLeave)

		return () => {
			window.removeEventListener("mousemove", onMove)
			window.removeEventListener("mouseout", onLeave)
			ro.disconnect()
			vis.disconnect()
			cancelAnimationFrame(raf)
		}
	}, [])

	return <canvas ref={ref} className={className} aria-hidden="true" />
}
