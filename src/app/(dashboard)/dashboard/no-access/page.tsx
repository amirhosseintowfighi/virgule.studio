import Link from "next/link"
import { requireUser } from "@/lib/rbac"

type Props = { searchParams: Promise<{ p?: string }> }

export default async function NoAccessPage({ searchParams }: Props) {
	// حتی این صفحه هم فقط برای کاربر واردشده است
	const session = await requireUser()
	const { p } = await searchParams

	return (
		<div className="mx-auto max-w-lg py-20 text-center">
			<h1 className="text-2xl font-extrabold">دسترسی ندارید</h1>
			<p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
				نقش شما ({session.role}) به این بخش دسترسی ندارد. اگر فکر می‌کنید اشتباهی رخ داده، از
				مدیر کل بخواهید دسترسی لازم را به نقش شما اضافه کند.
			</p>
			{p && (
				<p className="font-latin mt-4 text-xs text-[var(--color-muted)]">مجوز لازم: {p}</p>
			)}
			<Link
				href="/dashboard"
				className="mt-8 inline-block rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-6 py-2.5 text-sm font-bold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
			>
				بازگشت به داشبورد
			</Link>
		</div>
	)
}
