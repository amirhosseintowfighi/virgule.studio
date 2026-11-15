"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { clsx } from "clsx"
import { LogoMark, Arrow } from "@/components/ui/marks"

const links = [
	{ href: "/portfolio", label: "نمونه‌کارها" },
	{ href: "/services", label: "خدمات" },
	{ href: "/about", label: "درباره" },
	{ href: "/blog", label: "یادداشت‌ها" },
	{ href: "/contact", label: "تماس" },
]

export function Navbar() {
	const pathname = usePathname()
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
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	// با عوض‌شدن صفحه، منو بسته می‌شود
	useEffect(() => setOpen(false), [pathname])

	useEffect(() => {
		document.body.classList.toggle("lock", open)
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
		window.addEventListener("keydown", onKey)
		return () => {
			window.removeEventListener("keydown", onKey)
			document.body.classList.remove("lock")
		}
	}, [open])

	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

	return (
		<>
			<header
				className={clsx(
					"site-nav fixed inset-x-0 top-0 z-[45] border-b transition-[transform,background-color,border-color] duration-500",
					hidden && !open && "-translate-y-full",
					scrolled && !open ? "is-glass" : "border-transparent"
				)}
				style={{ transitionTimingFunction: "var(--ease)" }}
			>
				<div className="wrap flex h-[76px] items-center justify-between gap-6">
					<Link href="/" aria-label="ویرگول، خانه" className="tap flex items-center gap-3">
						<LogoMark className="h-9 w-9" />
						<span className="serif text-[1.7rem] leading-none">ویرگول</span>
					</Link>

					<nav className="hidden items-center gap-9 md:flex" aria-label="ناوبری اصلی">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								aria-current={isActive(l.href) ? "page" : undefined}
								className="nav-l text-[.92rem]"
							>
								{l.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-4">
						<Link href="/request-project" className="link-a hidden text-[.92rem] md:inline-flex">
							شروع پروژه
							<Arrow />
						</Link>
						<button
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
							aria-controls="fullmenu"
							aria-label={open ? "بستن منو" : "باز کردن منو"}
							className="grid h-11 w-11 place-items-center md:hidden"
						>
							<span className="relative block h-[9px] w-6">
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

			{/* منوی تمام‌صفحه‌ی موبایل. inert: وقتی بسته است، از ترتیبِ Tab و صفحه‌خوان بیرون است. */}
			<div id="fullmenu" className={clsx("menu md:hidden", open && "open")} inert={!open}>
				<div className="wrap flex min-h-full flex-col justify-between pb-10 pt-[104px]">
					<nav aria-label="ناوبری موبایل" className="border-t border-[var(--fg)]">
						{links.map((l, i) => (
							<Link
								key={l.href}
								href={l.href}
								aria-current={isActive(l.href) ? "page" : undefined}
								onClick={() => setOpen(false)}
								className="menu-item border-b border-[var(--line)] py-4"
							>
								<span style={{ transitionDelay: `${120 + i * 55}ms` }}>
									<span className="flex items-center justify-between gap-6">
										<span className="serif text-[2.6rem] leading-[1.15]">{l.label}</span>
										<Arrow className="accent text-xl" />
									</span>
								</span>
							</Link>
						))}
					</nav>
					<div className="menu-item mt-10">
						<span style={{ transitionDelay: "460ms" }}>
							<Link href="/request-project" onClick={() => setOpen(false)} className="btn btn--solid w-full">
								شروع پروژه
								<Arrow />
							</Link>
							<a href="mailto:info@virgule.studio" className="font-latin mt-6 block text-sm text-[var(--fg-2)]" dir="ltr">
								info@virgule.studio
							</a>
						</span>
					</div>
				</div>
			</div>
		</>
	)
}
