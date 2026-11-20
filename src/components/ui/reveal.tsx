"use client"

import { useEffect, useRef, useState } from "react"
import { clsx } from "clsx"

type Props = {
	children?: React.ReactNode
	className?: string
	/** تاخیر پلکانی (میلی‌ثانیه) */
	delay?: number
	/** نوع حرکت: جابه‌جایی ساده، بازشدنِ تصویر، خطِ کشیده‌شونده، یا تصویرِ برداری */
	as?: "rv" | "img-rv" | "rule" | "art-rv"
	/**
	 * برای محتوای بالای صفحه (بخش معرفی، سرصفحه‌ها): حرکت با بارگذاریِ صفحه و فقط با CSS
	 * اجرا می‌شود، نه بعد از رسیدنِ جاوااسکریپت. بدون این، متنِ اصلی تا پایانِ hydration
	 * پنهان می‌ماند و روی موبایلِ کند چند ثانیه دیرتر دیده می‌شد (LCP).
	 */
	now?: boolean
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
			{
				// آستانه‌ی کوچک و بدونِ حاشیه‌ی پایین: عنصری که نزدیکِ لبه‌ی پایینِ صفحه
				// نشسته (مثل دکمه‌های بخش معرفی) هم باید همان لحظه وارد شود، نه بعد از اسکرول.
				threshold: 0.01,
				//
				// بالا: کادرِ ناظر را بسیار بلند می‌کنیم تا هر عنصری که از بالای صفحه
				// رد شده هنوز «در حال تقاطع» حساب شود. بدون این، اسکرول سریع —
				// مخصوصاً momentum روی iOS — عنصر را کامل رد می‌کرد: حالت از
				// «پایینِ کادر، بدون تقاطع» به «بالای کادر، بدون تقاطع» می‌رفت،
				// هیچ آستانه‌ای قطع نمی‌شد، پس callback اصلاً صدا زده نمی‌شد و آن
				// محتوا تا پایان عمرِ صفحه نامرئی می‌ماند.
				// چپ و راست هم باز است: موقعیت افقی نباید ورودِ عنصر را کنترل کند.
				rootMargin: "100000px 100000px 0px 100000px",
			}
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
export function Reveal({ children, className, delay = 0, as = "rv", now = false }: Props) {
	const ref = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el || now) return
		return observe(el, () => setInView(true))
	}, [now])

	return (
		<div
			ref={ref}
			style={delay ? (now ? { animationDelay: `${delay}ms` } : { transitionDelay: `${delay}ms` }) : undefined}
			className={clsx(as, now ? "now" : inView && "in", className)}
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
	now = false,
}: {
	lines: React.ReactNode[]
	className?: string
	lineClassName?: string
	step?: number
	delay?: number
	/** همان `now` در Reveal: برای تیترِ بالای صفحه، حرکت با CSS و بدون انتظار برای JS */
	now?: boolean
}) {
	const ref = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el || now) return
		return observe(el, () => setInView(true))
	}, [now])

	return (
		<div ref={ref} className={clsx("lines", now ? "now" : inView && "in", className)}>
			{lines.map((line, i) => (
				<span key={i} className={clsx("line-mask", lineClassName)}>
					<span style={now ? { animationDelay: `${delay + i * step}ms` } : { transitionDelay: `${delay + i * step}ms` }}>{line}</span>
				</span>
			))}
		</div>
	)
}
