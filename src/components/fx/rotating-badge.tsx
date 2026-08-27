import { clsx } from "clsx"

/** نشان دایره‌ای چرخان با متن دور تا دور و فلش پایین (نشانگر اسکرول). */
export function RotatingBadge({ className }: { className?: string }) {
	const text = " ویرگول •  اسکرول کنید •  کاوش کنید • "
	const textStyle = { fontSize: "8.5px", letterSpacing: "0.18em" }
	return (
		<div className={clsx("relative h-28 w-28", className)} aria-hidden="true">
			<svg viewBox="0 0 100 100" className="animate-spin-med h-full w-full">
				<defs>
					<path id="virgule-badge-path" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" fill="none" />
				</defs>
				<text className="fill-[var(--color-muted)]" style={textStyle}>
					<textPath href="#virgule-badge-path">{text + text}</textPath>
				</text>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center text-xl text-[var(--color-primary)]">↓</div>
		</div>
	)
}
