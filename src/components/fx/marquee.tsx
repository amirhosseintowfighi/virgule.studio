import { clsx } from "clsx"

/** نوار متحرک بی‌نهایت (مارکی). با هاور متوقف می‌شود. */
export function Marquee({
	items,
	duration = 30,
	reverse = false,
	className,
	itemClassName,
}: {
	items: React.ReactNode[]
	duration?: number
	reverse?: boolean
	className?: string
	itemClassName?: string
}) {
	const trackStyle = { animationDuration: duration + "s" }
	const doubled = [...items, ...items]
	return (
		<div className={clsx("marquee overflow-hidden", className)}>
			<div className={clsx("marquee-track", reverse && "reverse")} style={trackStyle}>
				{doubled.map((it, i) => (
					<span key={i} className={clsx("shrink-0 whitespace-nowrap", itemClassName)}>
						{it}
					</span>
				))}
			</div>
		</div>
	)
}
