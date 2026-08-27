import { clsx } from "clsx"

type Props = {
	className?: string
	/** نمایش نوشتار کنار نشان */
	withWordmark?: boolean
}

const NIB_PATH =
	"M 258.007812 139.054688 L 98.941406 297.347656 C 95.238281 283.875 92.921875 277.152344 92.921875 260.078125 L 221.828125 131.355469 C 235.054688 131.644531 245.84375 135.113281 258.007812 139.054688"

/** نشان ویرگول — همان مسیرهای img/mark.svg، درون‌خط تا رنگش از currentColor بیاید. */
export function LogoMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 366 404" fill="none" className={clsx("h-9 w-auto", className)} aria-hidden="true">
			<circle cx="218.1" cy="256.5" r="139.6" stroke="currentColor" strokeWidth="12" />
			<line x1="329" y1="6" x2="6" y2="329" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
			<path d={NIB_PATH} fill="currentColor" />
		</svg>
	)
}

export function Logo({ className, withWordmark = true }: Props) {
	return (
		<span className={clsx("flex items-center gap-2 font-extrabold", className)}>
			<LogoMark className="h-9" />
			{withWordmark && (
				<span className="flex items-baseline gap-1 text-lg leading-none">
					<span className="font-latin text-[var(--color-primary)]">Virgule</span>
					<span>ویرگول</span>
				</span>
			)}
		</span>
	)
}
