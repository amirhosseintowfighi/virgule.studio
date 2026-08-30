import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermissionPage } from "@/lib/rbac"
import { formTypeLabel } from "@/lib/labels"
import { DeleteButton } from "@/components/admin/delete-button"
import {
	toggleSubmissionRead,
	toggleSubmissionSpam,
	deleteSubmission,
} from "@/server/actions/submissions"

type Props = { searchParams: Promise<{ filter?: string }> }

const FILTERS = [
	{ key: "all", label: "همه" },
	{ key: "unread", label: "خوانده‌نشده" },
	{ key: "spam", label: "اسپم" },
] as const

/** یک دکمه‌ی کوچک که یک server action را اجرا می‌کند. */
function ActionButton({
	action,
	id,
	label,
	tone = "muted",
}: {
	action: (formData: FormData) => void | Promise<void>
	id: string
	label: string
	tone?: "muted" | "primary"
}) {
	return (
		<form action={action} className="inline">
			<input type="hidden" name="id" value={id} />
			<button
				type="submit"
				className={`text-sm transition-opacity hover:opacity-70 ${
					tone === "primary" ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
				}`}
			>
				{label}
			</button>
		</form>
	)
}

export default async function SubmissionsPage({ searchParams }: Props) {
	await requirePermissionPage("form:read")
	const { filter = "all" } = await searchParams

	const where =
		filter === "unread"
			? { read: false, isSpam: false }
			: filter === "spam"
				? { isSpam: true }
				: {}

	const [submissions, unread] = await Promise.all([
		prisma.formSubmission.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 }),
		prisma.formSubmission.count({ where: { read: false, isSpam: false } }),
	])

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-extrabold">پیام‌های دریافتی</h1>
				<p className="mt-1 text-sm text-[var(--color-muted)]">
					پیام‌های فرم تماس و درخواست پروژه.
					{unread > 0 && (
						<span className="text-[var(--color-primary)]"> {unread} پیام خوانده‌نشده دارید.</span>
					)}
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				{FILTERS.map((f) => (
					<Link
						key={f.key}
						href={`/dashboard/submissions?filter=${f.key}`}
						aria-current={filter === f.key ? "page" : undefined}
						className={`rounded-[var(--radius-full)] border px-4 py-1.5 text-sm transition-colors ${
							filter === f.key
								? "border-[var(--color-primary)] bg-[var(--color-primary-container)] text-[var(--color-primary)]"
								: "border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
						}`}
					>
						{f.label}
					</Link>
				))}
			</div>

			<div className="space-y-3">
				{submissions.map((s) => {
					const p = s.payload as Record<string, string>
					return (
						<article
							key={s.id}
							className={`rounded-[var(--radius-lg)] border p-5 ${
								s.isSpam
									? "border-[var(--color-error)]/40 bg-[var(--color-surface)] opacity-60"
									: s.read
										? "border-[var(--color-border)] bg-[var(--color-surface)]"
										: "border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[var(--elev-1)]"
							}`}
						>
							<div className="mb-3 flex flex-wrap items-center justify-between gap-3">
								<div className="flex flex-wrap items-center gap-2">
									<span className="font-bold">{p.name ?? "—"}</span>
									<span className="rounded-[var(--radius-full)] bg-[var(--color-primary-container)] px-3 py-0.5 text-xs text-[var(--color-primary)]">
										{formTypeLabel(s.type)}
									</span>
									{!s.read && !s.isSpam && (
										<span className="text-xs text-[var(--color-primary)]">جدید</span>
									)}
									{s.isSpam && <span className="text-xs text-[var(--color-error)]">اسپم</span>}
								</div>
								<time
									dateTime={s.createdAt.toISOString()}
									className="font-latin text-xs text-[var(--color-muted)]"
								>
									{new Date(s.createdAt).toLocaleDateString("fa-IR")}
								</time>
							</div>

							{/* راه‌های تماس، قابل کلیک — نه فقط متن */}
							<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
								{p.email && (
									<a href={`mailto:${p.email}`} className="font-latin text-[var(--color-primary)]" dir="ltr">
										{p.email}
									</a>
								)}
								{p.phone && (
									<a href={`tel:${p.phone}`} className="font-latin text-[var(--color-primary)]" dir="ltr">
										{p.phone}
									</a>
								)}
								{p.company && <span className="text-[var(--color-muted)]">{p.company}</span>}
							</div>

							{(p.budget || p.timeline) && (
								<div className="mt-2 flex flex-wrap gap-x-5 text-xs text-[var(--color-muted)]">
									{p.budget && <span>بودجه: {p.budget}</span>}
									{p.timeline && <span>زمان‌بندی: {p.timeline}</span>}
								</div>
							)}

							{(p.message || p.description) && (
								<p className="mt-3 whitespace-pre-line text-sm leading-7">
									{p.message ?? p.description}
								</p>
							)}

							<div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] pt-3">
								<ActionButton
									action={toggleSubmissionRead}
									id={s.id}
									label={s.read ? "علامت‌زدن به‌عنوان خوانده‌نشده" : "خوانده شد"}
									tone="primary"
								/>
								<ActionButton
									action={toggleSubmissionSpam}
									id={s.id}
									label={s.isSpam ? "اسپم نیست" : "اسپم است"}
								/>
								<DeleteButton
									action={deleteSubmission}
									id={s.id}
									confirmText="این پیام برای همیشه حذف می‌شود. مطمئنید؟"
								/>
							</div>
						</article>
					)
				})}

				{submissions.length === 0 && (
					<div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-10 text-center text-[var(--color-muted)]">
						پیامی در این دسته نیست.
					</div>
				)}
			</div>
		</div>
	)
}
