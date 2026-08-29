import { clsx } from "clsx"
import { Reveal, RevealLines } from "@/components/ui/reveal"

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
	return (
		<div className={clsx("mx-auto w-full max-w-[var(--container)] px-4 md:px-6", className)}>{children}</div>
	)
}

/**
 * برچسب شماره‌دار بخش — قاب ضخیم با سایه‌ی سخت.
 * جای «eyebrow» ساده‌ی قبلی را می‌گیرد تا ساختار نشریه‌ای دیده شود.
 */
export function Slab({ index, label }: { index?: string; label: string }) {
	return (
		<Reveal className="w-fit">
			<span className="slab font-latin">
				{index && <b>{index}</b>}
				{label}
			</span>
		</Reveal>
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
		<header className="px-[var(--pad)] pb-[clamp(40px,6vw,80px)] pt-[clamp(112px,15vw,190px)]">
			{label && <Slab index={index} label={label} />}
			<h1 className={clsx("h1 max-w-[16ch]", label && "mt-8")}>
				<RevealLines lines={lines} />
			</h1>
			{lead && (
				<Reveal delay={240}>
					<p className="body-t mt-8 max-w-[56ch]">{lead}</p>
				</Reveal>
			)}
			{children}
			{/* خطِ ضخیمِ پایانِ سربرگ — مرز صریح میان تیتر و محتوا */}
			<Reveal as="rule" className="mt-[clamp(32px,5vw,64px)]" />
		</header>
	)
}
