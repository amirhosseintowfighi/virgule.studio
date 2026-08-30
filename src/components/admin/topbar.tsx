"use client"

import { logoutAction } from "@/server/actions/auth"

export function Topbar({ name, role }: { name: string; role: string }) {
	return (
		<header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6">
			<div className="text-sm text-[var(--color-muted)]">پنل مدیریت ویرگول</div>
			<div className="flex items-center gap-4">
				<div className="text-left">
					<div className="text-sm font-semibold">{name}</div>
					<div className="text-xs text-[var(--color-muted)]">{role}</div>
				</div>
				<form action={logoutAction}>
					<button className="rounded-[var(--radius-full)] border border-[var(--color-border)] px-5 py-2 text-sm transition-colors duration-300 hover:bg-[var(--color-surface-2)]">
						خروج
					</button>
				</form>
			</div>
		</header>
	)
}
