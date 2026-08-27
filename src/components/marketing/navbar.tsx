"use client"

import Link from "next/link"
import { useState } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/ui/logo"

const links = [
	{ href: "/services", label: "خدمات" },
	{ href: "/portfolio", label: "نمونه‌کارها" },
	{ href: "/blog", label: "وبلاگ" },
	{ href: "/pricing", label: "تعرفه" },
	{ href: "/about", label: "درباره ما" },
	{ href: "/contact", label: "تماس" },
]

export function Navbar() {
	const { theme, toggle } = useTheme()
	const [open, setOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 pt-3 md:pt-4">
			<Container>
				<div className="flex h-14 items-center justify-between gap-3 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 pr-5 shadow-[var(--elev-2)] backdrop-blur-xl">
					<Link href="/" aria-label="ویرگول">
						<Logo />
					</Link>

					<nav className="hidden items-center gap-1 md:flex">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								className="rounded-[var(--radius-full)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-2)]"
							>
								{l.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<button
							onClick={toggle}
							aria-label="تغییر حالت روشن/تاریک"
							className="rounded-[var(--radius-full)] border border-[var(--color-border)] p-2 text-sm transition-colors hover:bg-[var(--color-surface-2)]"
						>
							{theme === "dark" ? "☀️" : "🌙"}
						</button>
						<Button href="/request-project" className="hidden md:inline-flex">
							ثبت سفارش
						</Button>
						<button
							onClick={() => setOpen((v) => !v)}
							aria-label="منو"
							className="rounded-[var(--radius-full)] border border-[var(--color-border)] p-2 md:hidden"
						>
							☰
						</button>
					</div>
				</div>
			</Container>

			{open && (
				<Container className="md:hidden">
					<div className="mt-2 flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--elev-2)]">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								className="rounded-[var(--radius-md)] px-4 py-2.5 text-sm hover:bg-[var(--color-surface-2)]"
								onClick={() => setOpen(false)}
							>
								{l.label}
							</Link>
						))}
						<Button href="/request-project" className="mt-2" onClick={() => setOpen(false)}>
							ثبت سفارش
						</Button>
					</div>
				</Container>
			)}
		</header>
	)
}
