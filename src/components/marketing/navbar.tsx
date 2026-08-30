"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { clsx } from "clsx"
import { LogoMark } from "@/components/ui/logo"

const links = [
	{ href: "/services", label: "خدمات", en: "Services" },
	{ href: "/portfolio", label: "نمونه‌کارها", en: "Work" },
	{ href: "/about", label: "درباره", en: "About" },
	{ href: "/blog", label: "یادداشت‌ها", en: "Journal" },
	{ href: "/contact", label: "تماس", en: "Contact" },
]

export function Navbar() {
	const [open, setOpen] = useState(false)
	const [hidden, setHidden] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const last = useRef(0)

	// پایین که می‌روی کنار می‌رود، بالا که برمی‌گردی پیدا می‌شود.
	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY
			setHidden(y > 140 && y > last.current)
			setScrolled(y > 24)
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
				{/* نوار شیشه‌ای: وقتی صفحه پایین می‌رود، پس‌زمینه آرام ظاهر می‌شود */}
				<div
					className={clsx(
						"flex items-center justify-between px-[var(--pad)] py-6 transition-[background-color,backdrop-filter,border-color] duration-700",
						scrolled
							? "border-b border-[var(--line)] bg-[var(--bg-glass)] backdrop-blur-xl"
							: "border-b border-transparent"
					)}
					style={{ transitionTimingFunction: "var(--ease)" }}
				>
					<Link href="/" aria-label="ویرگول، خانه" className="tap flex items-center gap-3">
						<LogoMark className="h-8 w-8 text-[var(--fg)]" />
						<span className="text-[15px] font-medium">ویرگول</span>
					</Link>

					<nav className="hidden items-center gap-10 md:flex" aria-label="ناوبری اصلی">
						{links.map((l) => (
							// متن دولایه: با هاور، نسخه‌ی طلایی از پایین بالا می‌آید.
							// نسخه‌ی دوم از صفحه‌خوان پنهان است تا برچسب دوبار خوانده نشود.
							<Link key={l.href} href={l.href} className="nav-l text-sm text-[var(--fg-2)]">
								<span className="nav-l__in">
									<span>{l.label}</span>
									<span aria-hidden="true">{l.label}</span>
								</span>
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-4">
						{/* پوشش لازم است: .link-u در globals مقدار display را می‌دهد و
						    کلاس `hidden` تیلویند را خنثی می‌کند. */}
						<span className="hidden md:inline-block">
							<Link href="/request-project" className="link-u tap accent text-sm font-medium">
								شروع پروژه
							</Link>
						</span>
						<button
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
							aria-controls="fullmenu"
							aria-label={open ? "بستن منو" : "باز کردن منو"}
							className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-[var(--line-2)] transition-colors duration-500 hover:border-[var(--accent-line)] md:hidden"
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
								className="menu-item border-b border-[var(--line)] py-6"
							>
								{/* لایه‌ی بیرونی حرکت ماسک را می‌گیرد (display:block از globals)، لایه‌ی درونی چیدمان را */}
								<span style={{ transitionDelay: `${140 + i * 60}ms` }}>
									<span className="flex items-baseline justify-between gap-6">
										<span className="h3">{l.label}</span>
										<span className="accent text-xl" aria-hidden="true">
											←
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
