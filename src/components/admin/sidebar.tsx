"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"
import { FULL_ACCESS_ROLES } from "@/lib/permissions"

type NavItem = { href: string; label: string; icon: string; permission?: string }

const items: NavItem[] = [
	{ href: "/dashboard", label: "داشبورد", icon: "📊" },
	{ href: "/dashboard/posts", label: "مقالات", icon: "📝", permission: "post:read" },
	{ href: "/dashboard/projects", label: "نمونه‌کارها", icon: "💼", permission: "project:read" },
	{ href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: "🏷️", permission: "project:read" },
	{ href: "/dashboard/services", label: "خدمات", icon: "🛠️", permission: "service:read" },
	{ href: "/dashboard/submissions", label: "فرم‌های دریافتی", icon: "📩", permission: "form:read" },
	{ href: "/dashboard/users", label: "کاربران", icon: "👥", permission: "user:read" },
	{ href: "/dashboard/settings", label: "تنظیمات و محتوا", icon: "⚙️", permission: "setting:manage" },
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
		<aside className="hidden w-64 shrink-0 border-l border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:block">
			<Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2 font-extrabold">
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
							className={clsx(
								"flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
								active
									? "bg-[var(--color-primary-container)] text-[var(--color-primary)]"
									: "hover:bg-[var(--color-surface-2)]"
							)}
						>
							<span>{item.icon}</span>
							{item.label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
