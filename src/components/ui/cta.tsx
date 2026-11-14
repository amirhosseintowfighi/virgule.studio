import Link from "next/link"
import { clsx } from "clsx"
import { Arrow } from "@/components/ui/marks"

/** دکمه‌ی پیوندی با پیکان. یک شکل برای همه‌ی فراخوان‌های سایت. */
export function Cta({
	href,
	children,
	solid,
	className,
}: {
	href: string
	children: React.ReactNode
	solid?: boolean
	className?: string
}) {
	return (
		<Link href={href} className={clsx("btn", solid && "btn--solid", className)}>
			{children}
			<Arrow />
		</Link>
	)
}

/** پیوندِ متنیِ «بیشتر» — زیرخط‌دار، با پیکان. */
export function More({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
	return (
		<Link href={href} className={clsx("link-a tap", className)}>
			{children}
			<Arrow />
		</Link>
	)
}
