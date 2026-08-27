"use client"

import { useEffect, useState } from "react"

/** نوار پیشرفت اسکرول در بالای صفحه. */
export function ScrollProgress() {
	const [p, setP] = useState(0)
	useEffect(() => {
		const onScroll = () => {
			const el = document.documentElement
			const max = el.scrollHeight - el.clientHeight
			setP(max > 0 ? el.scrollTop / max : 0)
		}
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		window.addEventListener("resize", onScroll)
		return () => {
			window.removeEventListener("scroll", onScroll)
			window.removeEventListener("resize", onScroll)
		}
	}, [])
	const style = { transform: "scaleX(" + p + ")" }
	return <div className="scroll-progress aurora" style={style} aria-hidden="true" />
}
