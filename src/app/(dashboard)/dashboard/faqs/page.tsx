import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermissionPage } from "@/lib/rbac"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteFaq } from "@/server/actions/faqs"

export default async function FaqsAdminPage() {
	await requirePermissionPage("setting:manage")
	const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } })

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-extrabold">پرسش‌های متداول</h1>
					<p className="mt-1 text-sm text-[var(--color-muted)]">
						روی صفحه‌ی «پرسش‌های متداول» و در پایین صفحه‌ی اصلی نمایش داده می‌شوند.
					</p>
				</div>
				<Link
					href="/dashboard/faqs/new"
					className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-5 py-2.5 text-sm font-bold text-[var(--color-on-primary)] shadow-[var(--elev-1)] transition-colors hover:bg-[var(--color-primary-hover)]"
				>
					+ پرسش جدید
				</Link>
			</div>

			{faqs.length === 0 ? (
				<div className="border border-dashed border-[var(--color-border)] p-10 text-center text-[var(--color-muted)]">
					هنوز پرسشی ثبت نشده است.
				</div>
			) : (
				<div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
					<table className="w-full text-right text-sm">
						<thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)]">
							<tr>
								<th className="p-3 font-medium">پرسش</th>
								<th className="p-3 font-medium">دسته</th>
								<th className="p-3 font-medium">ترتیب</th>
								<th className="p-3 font-medium">عملیات</th>
							</tr>
						</thead>
						<tbody>
							{faqs.map((f) => (
								<tr key={f.id} className="border-t border-[var(--color-border)]">
									<td className="max-w-md p-3 font-semibold">{f.question}</td>
									<td className="p-3 text-[var(--color-muted)]">{f.category ?? "—"}</td>
									<td className="font-latin p-3">{f.order}</td>
									<td className="p-3">
										<div className="flex items-center gap-3">
											<Link href={`/dashboard/faqs/${f.id}`} className="text-[var(--color-primary)]">
												ویرایش
											</Link>
											<DeleteButton action={deleteFaq} id={f.id} />
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
