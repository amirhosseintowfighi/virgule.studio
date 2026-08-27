import prisma from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import { StatCard } from "@/components/admin/stat-card"

export default async function DashboardPage() {
	const [posts, published, projects, submissions, subscribers, latest] =
		await Promise.all([
			prisma.post.count(),
			prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
			prisma.project.count(),
			prisma.formSubmission.count({ where: { isSpam: false } }),
			prisma.newsletterSubscriber.count(),
			prisma.formSubmission.findMany({
				where: { isSpam: false },
				orderBy: { createdAt: "desc" },
				take: 5,
			}),
		])

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-extrabold">داشبورد</h1>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="کل مقالات" value={posts} icon="📝" hint={`${published} منتشرشده`} />
				<StatCard label="نمونه‌کارها" value={projects} icon="💼" />
				<StatCard label="فرم‌های دریافتی" value={submissions} icon="📩" />
				<StatCard label="مشترکین خبرنامه" value={subscribers} icon="📧" />
			</div>

			<div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
				<h2 className="mb-4 font-bold">آخرین پیام‌ها</h2>
				<div className="space-y-2">
					{latest.length === 0 && (
						<p className="text-sm text-[var(--color-muted)]">پیامی ثبت نشده است.</p>
					)}
					{latest.map((s) => {
						const p = s.payload as Record<string, string>
						return (
							<div key={s.id} className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm">
								<div>
									<span className="font-semibold">{p.name ?? "—"}</span>
									<span className="mr-2 text-[var(--color-muted)]">{p.email}</span>
								</div>
								<span className="rounded-[var(--radius-full)] bg-[var(--color-surface-2)] px-2 py-0.5 text-xs">{s.type}</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
