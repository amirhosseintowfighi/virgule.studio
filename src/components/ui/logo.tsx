import { clsx } from "clsx"

type Props = {
	className?: string
	/** نمایش نوشتار کنار نشان */
	withWordmark?: boolean
}

/**
 * نشان (لوگوی) ویرگول — از فایل واقعی «public/logo.png» استفاده می‌کند.
 * فایل لوگوی خودتان را با همین نام در پوشه‌ی public قرار دهید.
 */
export function LogoMark({ className }: { className?: string }) {
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src="/logo.png"
			alt="ویرگول"
			className={clsx("w-auto object-contain", className)}
		/>
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
