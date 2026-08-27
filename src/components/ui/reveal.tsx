"use client"

import { useEffect, useRef, useState } from "react"
import { clsx } from "clsx"

type Props = {
	children: React.ReactNode
	className?: string
	/** تاخیر شروع انیمیشن (میلی‌ثانیه) برای اثر پلکانی */
	delay?: number
}

/** محتوا را هنگام ورود به صفحه به آرامی ظاهر می‌کند. */
export function Reveal({ children, className, delay = 0 }: Props) {
	const ref = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (typeof IntersectionObserver === "undefined") {
			setInView(true)
			return
		}
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setInView(true)
						observer.disconnect()
					}
				})
			},
			{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const style = delay ? { transitionDelay: `${delay}ms` } : undefined

	return (
		<div ref={ref} style={style} className={clsx("reveal", inView && "in", className)}>
			{children}
		</div>
	)
}
