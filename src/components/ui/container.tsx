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
	index,
	label,
	lines,
	lead,
	children,
}: {
	/** شماره‌ی بخش، مثل «01» */
	index?: string
	/** برچسب لاتین کوچک بالای عنوان */
	label?: string
	/** خطوط عنوان — شکستن سطر عمدی است */
	lines: React.ReactNode[]
	lead?: React.ReactNode
	children?: React.ReactNode
}) {
	return (
		<header className="px-[var(--pad)] pb-[clamp(48px,7vw,96px)] pt-[clamp(120px,16vw,200px)]">
			{(index || label) && (
				<Reveal className="meta font-latin mb-8 flex gap-4">
					{index && <span>{index}</span>}
					{label && <span>{label}</span>}
				</Reveal>
			)}
			<h1 className="h1 max-w-[16ch]">
				<RevealLines lines={lines} />
			</h1>
			{lead && (
				<Reveal delay={240}>
					<p className="body-t mt-8 max-w-[56ch]">{lead}</p>
				</Reveal>
			)}
			{children}
		</header>
	)
}
