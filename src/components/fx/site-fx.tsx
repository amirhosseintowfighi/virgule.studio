"use client"

import { Preloader } from "./preloader"
import { CustomCursor } from "./custom-cursor"
import { ScrollProgress } from "./scroll-progress"

/** جمع‌کننده‌ی افکت‌های سراسری سایت. */
export function SiteFx() {
	return (
		<>
			<Preloader />
			<CustomCursor />
			<ScrollProgress />
		</>
	)
}
