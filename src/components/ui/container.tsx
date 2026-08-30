import { clsx } from "clsx"
import { Reveal, RevealLines } from "@/components/ui/reveal"

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
	return (
		<div className={clsx("mx-auto w-full max-w-[var(--container)] px-4 md:px-6", className)}>{children}</div>
	)
}

/** بخش استاندارد پنل مدیریت و صفحات فرعی. */
export function Section({
	id,
	eyebrow,
	title,
	subtitle,
	children,
}: {
	id?: string
	eyebrow?: string
	title?: string
	subtitle?: string
	children: React.ReactNode
}) {
	return (
		<section id={id} className="py-16 md:py-24">
			<Container>
				{(eyebrow || title) && (
					<Reveal className="mb-10">
						{eyebrow && <div className="meta-fa mb-4">{eyebrow}</div>}
						{title && <h2 className="h2 max-w-[20ch]">{title}</h2>}
						{subtitle && <p className="body-t mt-4 max-w-[54ch]">{subtitle}</p>}
					</Reveal>
				)}
				{children}
			</Container>
		</section>
	)
}

/**
 * سرصفحه‌ی صفحات داخلی سایت عمومی.
 * یک الگو برای همه‌ی مسیرها تا ریتم ورود به هر صفحه یکسان بماند.
 */
export function PageHead({
	lines,
	lead,
	children,
}: {
	/** خطوط عنوان — شکستن سطر عمدی است */
	lines: React.ReactNode[]
	lead?: React.ReactNode
	children?: React.ReactNode
}) {
	return (
		<header className="stage stage--tl px-[var(--pad)] pb-[clamp(56px,8vw,120px)] pt-[clamp(128px,17vw,240px)]">
			<h1 className="h1 max-w-[17ch]">
				{/* sheen روی همان عنصری می‌نشیند که کلاس `in` می‌گیرد */}
				<RevealLines lines={lines} className="sheen" />
			</h1>
			{lead && (
				<Reveal delay={320}>
					<p className="lead mt-10 max-w-[52ch]">{lead}</p>
				</Reveal>
			)}
			{children}
			{/* خط مویی پایان سربرگ — مرزی که حس می‌شود، نه دیده */}
			<Reveal as="rule" className="mt-[clamp(48px,7vw,96px)]" />
		</header>
	)
}
