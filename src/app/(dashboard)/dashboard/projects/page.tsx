import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermission, hasPermission } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteProject } from "@/server/actions/projects"

export default async function ProjectsAdminPage() {
	const session = await requirePermission("project:read")
	const canWrite = hasPermission(session, "project:write")
	const canDelete = hasPermission(session, "project:delete")
	const projects = await prisma.project.findMany({
		include: { category: true },
		orderBy: [{ featured: "desc" }, { order: "asc" }],
	})

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-extrabold">مدیریت نمونه‌کارها</h1>
				{canWrite && (
					<Link
						href="/dashboard/projects/new"
						className="rounded-[var(--radius-full)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white"
					>
						+ نمونه‌کار جدید
					</Link>
				)}
			</div>

			{projects.length === 0 ? (
				<div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-10 text-center text-[var(--color-muted)]">
					هنوز نمونه‌کاری ثبت نشده است.
				</div>
			) : (
				<div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
					<table className="w-full text-right text-sm">
						<thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)]">
							<tr>
								<th className="p-3 font-medium">عنوان</th>
								<th className="p-3 font-medium">دسته</th>
								<th className="p-3 font-medium">کارفرما</th>
								<th className="p-3 font-medium">سال</th>
								<th className="p-3 font-medium">ویژه</th>
								<th className="p-3 font-medium">عملیات</th>
							</tr>
						</thead>
						<tbody>
							{projects.map((p) => (
								<tr key={p.id} className="border-t border-[var(--color-border)]">
									<td className="p-3 font-semibold">{p.title}</td>
									<td className="p-3 text-[var(--color-muted)]">{p.category?.name ?? "—"}</td>
									<td className="p-3 text-[var(--color-muted)]">{p.client ?? "—"}</td>
									<td className="p-3 font-latin">{p.year ?? "—"}</td>
									<td className="p-3">
										{p.featured ? (
											<span className="rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-2 py-0.5 text-xs text-[var(--color-primary)]">★ ویژه</span>
										) : (
											<span className="text-xs text-[var(--color-muted)]">—</span>
										)}
									</td>
									<td className="p-3">
										<div className="flex items-center gap-3">
											<Link href={`/portfolio/${p.slug}`} className="text-[var(--color-muted)]">مشاهده</Link>
											{canWrite && (
												<Link href={`/dashboard/projects/${p.id}`} className="text-[var(--color-primary)]">ویرایش</Link>
											)}
											{canDelete && <DeleteButton action={deleteProject} id={p.id} />}
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
