import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermissionPage } from "@/lib/rbac"
import { DeletePostButton } from "@/components/admin/delete-post-button"
import { statusLabel } from "@/lib/labels"

export default async function PostsAdminPage() {
	await requirePermissionPage("post:read")
	const posts = await prisma.post.findMany({
		include: { author: true, category: true },
		orderBy: { updatedAt: "desc" },
	})

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-extrabold">مدیریت مقالات</h1>
				<Link
					href="/dashboard/posts/new"
					className="border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-5 py-2.5 text-sm font-bold text-[var(--color-on-primary)] rounded-[var(--radius-full)] shadow-[var(--elev-1)] transition-colors hover:bg-[var(--color-primary-hover)]"
				>
					+ مقاله‌ی جدید
				</Link>
			</div>

			<div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
				<table className="w-full text-right text-sm">
					<thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)]">
						<tr>
							<th className="p-3 font-medium">عنوان</th>
							<th className="p-3 font-medium">دسته</th>
							<th className="p-3 font-medium">وضعیت</th>
							<th className="p-3 font-medium">بازدید</th>
							<th className="p-3 font-medium">عملیات</th>
						</tr>
					</thead>
					<tbody>
						{posts.map((p) => (
							<tr key={p.id} className="border-t border-[var(--color-border)]">
								<td className="p-3 font-semibold">{p.title}</td>
								<td className="p-3 text-[var(--color-muted)]">{p.category?.name ?? "—"}</td>
								<td className="p-3">
									<span className="bg-[var(--color-surface-2)] px-2 py-0.5 text-xs">
										{statusLabel(p.status)}
									</span>
								</td>
								<td className="p-3 font-latin">{p.views}</td>
								<td className="p-3">
									<div className="flex gap-2">
										<Link href={`/dashboard/posts/${p.id}`} className="text-[var(--color-primary)]">ویرایش</Link>
										<DeletePostButton id={p.id} />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
