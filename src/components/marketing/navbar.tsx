"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { clsx } from "clsx"
import { LogoMark } from "@/components/ui/logo"

const links = [
	{ href: "/services", label: "خدمات", en: "Services" },
	{ href: "/portfolio", label: "نمونه‌کارها", en: "Work" },
	{ href: "/about", label: "درباره", en: "About" },
	{ href: "/pricing", label: "تعرفه", en: "Pricing" },
	{ href: "/blog", label: "یادداشت‌ها", en: "Journal" },
	{ href: "/contact", label: "تماس", en: "Contact" },
]

export function Navbar() {
	const [open, setOpen] = useState(false)
	const [hidden, setHidden] = useState(false)
	const last = useRef(0)

	// پایین که می‌روی کنار می‌رود، بالا که برمی‌گردی پیدا می‌شود.
	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY
			setHidden(y > 140 && y > last.current)
			last.current = y
		}
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	useEffect(() => {
		document.body.classList.toggle("lock", open)
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
		window.addEventListener("keydown", onKey)
		return () => {
			window.removeEventListener("keydown", onKey)
			document.body.classList.remove("lock")
		}
	}, [open])

	return (
		<>
			<header
				className={clsx(
					"fixed inset-x-0 top-0 z-[9995] transition-transform duration-500",
					hidden && !open && "-translate-y-full"
				)}
				style={{ transitionTimingFunction: "var(--ease)" }}
			>
				<div className="flex items-center justify-between border-b-[length:var(--bw-2)] border-[var(--fg)] bg-[var(--bg)] px-[var(--pad)] py-4">
					<Link href="/" aria-label="ویرگول، خانه" className="flex items-center gap-3">
						<LogoMark className="h-8 w-8 text-[var(--fg)]" />
						<span className="text-[15px] font-bold">ویرگول</span>
					</Link>

					<nav className="hidden items-center md:flex" aria-label="ناوبری اصلی">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								className="border-s-[length:var(--bw)] border-[var(--line)] px-5 py-2 text-sm font-bold transition-colors duration-150 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
							>
								{l.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-4">
						<Link
							href="/request-project"
							className="hidden border-[length:var(--bw-2)] border-[var(--fg)] bg-[var(--accent-fill)] px-4 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-[var(--fg)] hover:text-[var(--bg)] md:inline-block"
						>
							شروع پروژه
						</Link>
						<button
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
							aria-controls="fullmenu"
							aria-label={open ? "بستن منو" : "باز کردن منو"}
							className="relative z-10 grid h-11 w-11 place-items-center border-[length:var(--bw-2)] border-[var(--fg)] md:hidden"
						>
							<span className="relative block h-[9px] w-4">
								<span
									className={clsx(
										"absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500",
										open && "translate-y-[4px] rotate-45"
									)}
								/>
								<span
									className={clsx(
										"absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500",
										open && "-translate-y-[4px] -rotate-45"
									)}
								/>
							</span>
						</button>
					</div>
				</div>
			</header>

			{/* منوی تمام‌صفحه — نه یک کشوی معمولی */}
			<div id="fullmenu" className={clsx("menu md:hidden", open && "open")} hidden={!open}>
				<div className="flex h-full flex-col justify-between px-[var(--pad)] pb-12 pt-28">
					<nav aria-label="ناوبری موبایل">
						{links.map((l, i) => (
							<Link
								key={l.href}
								href={l.href}
								onClick={() => setOpen(false)}
								className="menu-item border-b-[length:var(--bw-2)] border-[var(--fg)] py-5"
							>
								{/* لایه‌ی بیرونی حرکت ماسک را می‌گیرد (display:block از globals)، لایه‌ی درونی چیدمان را */}
								<span style={{ transitionDelay: `${140 + i * 60}ms` }}>
									<span className="flex items-baseline justify-between">
										<span className="h3">{l.label}</span>
										<span className="num text-xl font-bold text-[var(--fg-3)]">
											{String(i + 1).padStart(2, "0")}
										</span>
									</span>
								</span>
							</Link>
						))}
					</nav>
					<div className="menu-item">
						<span style={{ transitionDelay: "560ms" }}>
							<Link href="/request-project" onClick={() => setOpen(false)} className="btn btn--solid w-full">
								شروع پروژه
							</Link>
							<a href="mailto:info@virgule.studio" className="meta font-latin mt-6 block">
								info@virgule.studio
							</a>
						</span>
					</div>
				</div>
			</div>
		</>
	)
}
