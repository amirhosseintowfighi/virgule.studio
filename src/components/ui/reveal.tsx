"use client"

import { useEffect, useRef, useState } from "react"
import { clsx } from "clsx"

type Props = {
	children?: React.ReactNode
	className?: string
	/** تاخیر پلکانی (میلی‌ثانیه) */
	delay?: number
	/** نوع حرکت: جابه‌جایی ساده، پرده‌ی تصویر، یا خطِ کشیده‌شونده */
	as?: "rv" | "rv-blur" | "img-rv" | "rule" | "line-mask"
}

/** یک ناظر برای کل صفحه — به‌جای یک IntersectionObserver به ازای هر عنصر. */
let io: IntersectionObserver | null = null
const marks = new WeakMap<Element, () => void>()

function observe(el: Element, cb: () => void) {
	if (typeof IntersectionObserver === "undefined") {
		cb()
		return () => {}
	}
	if (!io) {
		io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) continue
					marks.get(e.target)?.()
					io?.unobserve(e.target)
					marks.delete(e.target)
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
		)
	}
	marks.set(el, cb)
	io.observe(el)
	return () => {
		io?.unobserve(el)
		marks.delete(el)
	}
}

/** محتوا را هنگام ورود به کادر دید، یک‌بار، ظاهر می‌کند. */
export function Reveal({ children, className, delay = 0, as = "rv" }: Props) {
	const ref = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		return observe(el, () => setInView(true))
	}, [])

	return (
		<div
			ref={ref}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
			className={clsx(as, inView && "in", className)}
		>
			{children}
		</div>
	)
}

/**
 * متن را خط‌به‌خط، از پشت ماسک، بالا می‌آورد.
 * خطوط را خودتان به‌صورت آرایه می‌دهید تا شکستن سطر عمدی و قابل‌کنترل بماند.
 */
export function RevealLines({
	lines,
	className,
	lineClassName,
	step = 90,
	delay = 0,
}: {
	lines: React.ReactNode[]
	className?: string
	lineClassName?: string
	step?: number
	delay?: number
}) {
	const ref = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		return observe(el, () => setInView(true))
	}, [])

	return (
		<div ref={ref} className={clsx(inView && "in", className)}>
			{lines.map((line, i) => (
				<span key={i} className={clsx("line-mask", lineClassName)}>
					<span style={{ transitionDelay: `${delay + i * step}ms` }}>{line}</span>
				</span>
			))}
		</div>
	)
}
