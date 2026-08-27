import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { formTypeLabel } from "@/lib/labels"

export default async function SubmissionsPage() {
	await requirePermission("form:read")
	const submissions = await prisma.formSubmission.findMany({
		orderBy: { createdAt: "desc" },
		take: 100,
	})

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-extrabold">فرم‌های دریافتی</h1>

			<div className="space-y-3">
				{submissions.map((s) => {
					const p = s.payload as Record<string, string>
					return (
						<div
							key={s.id}
							className={`rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-4 ${
								s.isSpam ? "border-[var(--color-error)]/40 opacity-60" : "border-[var(--color-border)]"
							}`}
						>
							<div className="mb-2 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="font-semibold">{p.name ?? "—"}</span>
									<span className="rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-2 py-0.5 text-xs text-[var(--color-primary)]">
										{formTypeLabel(s.type)}
									</span>
									{s.isSpam && <span className="text-xs text-[var(--color-error)]">اسپم</span>}
								</div>
								<span className="font-latin text-xs text-[var(--color-muted)]">
									{new Date(s.createdAt).toLocaleDateString("fa-IR")}
								</span>
							</div>
							<div className="font-latin text-sm text-[var(--color-muted)]">{p.email} · {p.phone}</div>
							{p.message && <p className="mt-2 text-sm">{p.message}</p>}
						</div>
					)
				})}
				{submissions.length === 0 && (
					<p className="text-sm text-[var(--color-muted)]">هنوز پیامی ثبت نشده است.</p>
				)}
			</div>
		</div>
	)
}
