"use client"

import { Preloader } from "./preloader"
import { Cursor } from "./cursor"
import { SmoothScroll } from "./smooth-scroll"
import { ScrollProgress } from "./scroll-progress"

/** افکت‌های سراسری سایت عمومی. */
export function SiteFx() {
	return (
		<>
			<Preloader />
			<SmoothScroll />
			<Cursor />
			<ScrollProgress />
		</>
	)
}
