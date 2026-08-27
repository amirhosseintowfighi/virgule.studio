"use client"

import { forwardRef } from "react"
import Link from "next/link"
import { clsx } from "clsx"

type Variant = "filled" | "tonal" | "outlined" | "text"
type Props = {
	variant?: Variant
	href?: string
	className?: string
	children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const styles: Record<Variant, string> = {
	filled: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[var(--elev-1)]",
	tonal: "bg-[var(--color-primary-container)] text-[var(--color-primary)] hover:brightness-95",
	outlined: "border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]",
	text: "text-[var(--color-primary)] hover:bg-[var(--color-primary-container)]/40",
}

const base =
	"inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-[.98] disabled:opacity-50"

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
	{ variant = "filled", href, className, children, ...rest },
	ref
) {
	const cls = clsx(base, styles[variant], className)
	if (href) return <Link href={href} className={cls}>{children}</Link>
	return <button ref={ref} className={cls} {...rest}>{children}</button>
})
