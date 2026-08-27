import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermission, hasPermission } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteCategory } from "@/server/actions/categories"

const typeLabel: Record<string, string> = {
	PORTFOLIO: "نمونه‌کار",
	BLOG: "مقاله",
}

export default async function CategoriesAdminPage() {
	const session = await requirePermission("project:read")
	const canWrite = hasPermission(session, "project:write")
	const categories = await prisma.category.findMany({
		orderBy: [{ type: "asc" }, { name: "asc" }],
		include: { _count: { select: { posts: true, projects: true } } },
	})

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-extrabold">دسته‌بندی‌ها</h1>
					<p className="mt-1 text-sm text-[var(--color-muted)]">دسته‌بندی‌های نمونه‌کارها و مقالات را اینجا بسازید و مدیریت کنید.</p>
				</div>
				{canWrite && (
					<Link
						href="/dashboard/categories/new"
						className="rounded-[var(--radius-full)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white"
					>
						+ دسته‌بندی جدید
					</Link>
				)}
			</div>

			{categories.length === 0 ? (
				<div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-10 text-center text-[var(--color-muted)]">
					هنوز دسته‌بندی‌ای ثبت نشده است.
				</div>
			) : (
				<div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
					<table className="w-full text-right text-sm">
						<thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)]">
							<tr>
								<th className="p-3 font-medium">نام</th>
								<th className="p-3 font-medium">اسلاگ</th>
								<th className="p-3 font-medium">نوع</th>
								<th className="p-3 font-medium">موارد</th>
								<th className="p-3 font-medium">عملیات</th>
							</tr>
						</thead>
						<tbody>
							{categories.map((c) => (
								<tr key={c.id} className="border-t border-[var(--color-border)]">
									<td className="p-3 font-semibold">{c.name}</td>
									<td className="p-3 font-latin text-[var(--color-muted)]">{c.slug}</td>
									<td className="p-3">
										<span className="rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-2 py-0.5 text-xs text-[var(--color-primary)]">
											{typeLabel[c.type] ?? c.type}
										</span>
									</td>
									<td className="p-3 font-latin text-[var(--color-muted)]">{c._count.projects + c._count.posts}</td>
									<td className="p-3">
										<div className="flex items-center gap-3">
											{canWrite && (
												<Link href={`/dashboard/categories/${c.id}`} className="text-[var(--color-primary)]">ویرایش</Link>
											)}
											{canWrite && <DeleteButton action={deleteCategory} id={c.id} />}
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
