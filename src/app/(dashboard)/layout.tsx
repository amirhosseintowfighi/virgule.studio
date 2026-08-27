import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Sidebar } from "@/components/admin/sidebar"
import { Topbar } from "@/components/admin/topbar"

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getSession()
	if (!session) redirect("/login?redirect=/dashboard")

	return (
		<div className="flex min-h-screen bg-[var(--color-surface-2)]">
			<Sidebar role={session.role} permissions={session.permissions} />
			<div className="flex flex-1 flex-col">
				<Topbar name={session.email} role={session.role} />
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	)
}
