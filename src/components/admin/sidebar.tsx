"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"
import { FULL_ACCESS_ROLES } from "@/lib/permissions"
import { icons, type IconName } from "@/components/admin/icons"

type NavItem = { href: string; label: string; icon: IconName; permission?: string }

const items: NavItem[] = [
	{ href: "/dashboard", label: "داشبورد", icon: "dashboard" },
	{ href: "/dashboard/posts", label: "مقالات", icon: "posts", permission: "post:read" },
	{ href: "/dashboard/projects", label: "نمونه‌کارها", icon: "projects", permission: "project:read" },
	{ href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: "categories", permission: "project:read" },
	{ href: "/dashboard/services", label: "خدمات", icon: "services", permission: "service:read" },
	{ href: "/dashboard/faqs", label: "پرسش‌های متداول", icon: "faq", permission: "setting:manage" },
	{ href: "/dashboard/submissions", label: "فرم‌های دریافتی", icon: "submissions", permission: "form:read" },
	{ href: "/dashboard/users", label: "کاربران", icon: "users", permission: "user:read" },
	{ href: "/dashboard/content", label: "متن صفحات", icon: "content", permission: "setting:manage" },
	{ href: "/dashboard/settings", label: "تنظیمات سایت", icon: "settings", permission: "setting:manage" },
]

export function Sidebar({
	role,
	permissions,
}: {
	role: string
	permissions: string[]
}) {
	const pathname = usePathname()
	const can = (p?: string) => !p || FULL_ACCESS_ROLES.includes(role) || permissions.includes(p)

	return (
		<aside className="hidden w-64 shrink-0 border-s border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:block">
			<Link
				href="/dashboard"
				className="mb-7 flex items-center gap-2 px-2 pb-5 font-bold"
			>
				<span className="font-latin text-[var(--color-primary)]">Virgule</span> پنل
			</Link>
			<nav className="space-y-1">
				{items.filter((i) => can(i.permission)).map((item) => {
					const active =
						pathname === item.href ||
						(item.href !== "/dashboard" && pathname.startsWith(item.href))
					return (
						<Link
							key={item.href}
							href={item.href}
							aria-current={active ? "page" : undefined}
							className={clsx(
								"flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors duration-300",
								active
									? "bg-[var(--color-primary-fill)] text-[var(--color-on-primary)]"
									: "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
							)}
						>
							{icons[item.icon]}
							{item.label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
