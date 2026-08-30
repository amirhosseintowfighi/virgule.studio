import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermissionPage, hasPermission } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteService } from "@/server/actions/services"

export default async function ServicesAdminPage() {
	const session = await requirePermissionPage("service:read")
	const canWrite = hasPermission(session, "service:write")
	const canDelete = hasPermission(session, "service:delete")
	const services = await prisma.service.findMany({ orderBy: { order: "asc" } })

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-extrabold">مدیریت خدمات</h1>
				{canWrite && (
					<Link
						href="/dashboard/services/new"
						className="border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-5 py-2.5 text-sm font-bold text-[var(--color-on-primary)] rounded-[var(--radius-full)] shadow-[var(--elev-1)] transition-colors hover:bg-[var(--color-primary-hover)]"
					>
						+ خدمت جدید
					</Link>
				)}
			</div>

			{services.length === 0 ? (
				<div className="border border-dashed border-[var(--color-border)] p-10 text-center text-[var(--color-muted)]">
					هنوز خدمتی ثبت نشده است.
				</div>
			) : (
				<div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
					<table className="w-full text-right text-sm">
						<thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)]">
							<tr>
								<th className="p-3 font-medium">عنوان</th>
								<th className="p-3 font-medium">خلاصه</th>
								<th className="p-3 font-medium">ترتیب</th>
								<th className="p-3 font-medium">وضعیت</th>
								<th className="p-3 font-medium">عملیات</th>
							</tr>
						</thead>
						<tbody>
							{services.map((s) => (
								<tr key={s.id} className="border-t border-[var(--color-border)]">
									<td className="p-3 font-semibold">{s.title}</td>
									<td className="max-w-xs truncate p-3 text-[var(--color-muted)]">{s.summary ?? "—"}</td>
									<td className="p-3 font-latin">{s.order}</td>
									<td className="p-3">
										{s.active ? (
											<span className="bg-[var(--color-primary-container)] px-2 py-0.5 text-xs text-[var(--color-primary)]">فعال</span>
										) : (
											<span className="bg-[var(--color-surface-2)] px-2 py-0.5 text-xs">غیرفعال</span>
										)}
									</td>
									<td className="p-3">
										<div className="flex items-center gap-3">
											<Link href={`/services/${s.slug}`} className="text-[var(--color-muted)]">مشاهده</Link>
											{canWrite && (
												<Link href={`/dashboard/services/${s.id}`} className="text-[var(--color-primary)]">ویرایش</Link>
											)}
											{canDelete && <DeleteButton action={deleteService} id={s.id} />}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
