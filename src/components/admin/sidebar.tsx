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
	{ href: "/dashboard/submissions", label: "فرم‌های دریافتی", icon: "submissions", permission: "form:read" },
	{ href: "/dashboard/users", label: "کاربران", icon: "users", permission: "user:read" },
	{ href: "/dashboard/settings", label: "تنظیمات و محتوا", icon: "settings", permission: "setting:manage" },
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
		<aside className="hidden w-64 shrink-0 border-s-[length:var(--bw-2)] border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:block">
			<Link
				href="/dashboard"
				className="mb-5 flex items-center gap-2 border-b-[length:var(--bw-2)] border-[var(--color-border)] px-2 pb-4 font-extrabold"
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
								"flex items-center gap-3 border-[length:var(--bw-2)] px-3 py-2.5 text-sm font-bold transition-colors duration-150",
								active
									? "border-[var(--color-border)] bg-[var(--color-primary-fill)] text-white"
									: "border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
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
