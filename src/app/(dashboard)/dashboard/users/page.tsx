import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermissionPage, hasPermission } from "@/lib/rbac"
import { roleLabel } from "@/lib/permissions"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteUser } from "@/server/actions/users"

export default async function UsersAdminPage() {
	const session = await requirePermissionPage("user:read")
	const canWrite = hasPermission(session, "user:write")
	const canDelete = hasPermission(session, "user:delete")
	const users = await prisma.user.findMany({
		include: { role: true },
		orderBy: { createdAt: "asc" },
	})

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-extrabold">مدیریت کاربران</h1>
				{canWrite && (
					<Link
						href="/dashboard/users/new"
						className="border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-5 py-2.5 text-sm font-bold text-[var(--color-on-primary)] rounded-[var(--radius-full)] shadow-[var(--elev-1)] transition-colors hover:bg-[var(--color-primary-hover)]"
					>
						+ کاربر جدید
					</Link>
				)}
			</div>

			<div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
				<table className="w-full text-right text-sm">
					<thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)]">
						<tr>
							<th className="p-3 font-medium">نام</th>
							<th className="p-3 font-medium">ایمیل</th>
							<th className="p-3 font-medium">نقش</th>
							<th className="p-3 font-medium">وضعیت</th>
							<th className="p-3 font-medium">عملیات</th>
						</tr>
					</thead>
					<tbody>
						{users.map((u) => (
							<tr key={u.id} className="border-t border-[var(--color-border)]">
								<td className="p-3 font-semibold">{u.name}</td>
								<td className="p-3 font-latin text-[var(--color-muted)]">{u.email}</td>
								<td className="p-3">
									<span className="bg-[var(--color-primary-container)] px-2 py-0.5 text-xs text-[var(--color-primary)]">
										{roleLabel(u.role.name)}
									</span>
								</td>
								<td className="p-3">
									{u.isActive ? (
										<span className="text-xs text-[var(--color-success)]">فعال</span>
									) : (
										<span className="text-xs text-[var(--color-muted)]">غیرفعال</span>
									)}
								</td>
								<td className="p-3">
									<div className="flex items-center gap-3">
										{canWrite && (
											<Link href={`/dashboard/users/${u.id}`} className="text-[var(--color-primary)]">ویرایش</Link>
										)}
										{canDelete && u.id !== session.userId && (
											<DeleteButton action={deleteUser} id={u.id} confirmText="این کاربر حذف شود؟" />
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="text-xs text-[var(--color-muted)]">
				نقش‌ها: مدیر کل (دسترسی کامل)، مدیر (دسترسی کامل جز حذف/ویرایش مدیر کل)، تولید محتوا، پشتیبان.
			</p>
		</div>
	)
}
