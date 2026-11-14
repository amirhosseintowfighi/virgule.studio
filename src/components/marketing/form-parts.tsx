import { Arrow } from "@/components/ui/marks"
import type { FormState } from "@/server/actions/forms"

/** پیامِ خطا — بالای دکمه، با نقشِ alert تا صفحه‌خوان همان لحظه بخواندش. */
export function FormError({ state }: { state: FormState }) {
	if (!state.error) return null
	return (
		<p role="alert" className="border-s-2 border-[var(--color-error)] ps-4 text-[.94rem] text-[var(--color-error)]">
			{state.error}
		</p>
	)
}

/**
 * بعد از ارسالِ موفق، فرم جایش را به این می‌دهد. یک پیامِ کوچکِ سبز زیرِ فرمی
 * که خالی شده، بازدیدکننده را مطمئن نمی‌کند که چیزی واقعاً فرستاده شده.
 */
export function FormDone({ title, state, next }: { title: string; state: FormState; next: string }) {
	return (
		<div role="status" className="border-t border-[var(--fg)] pt-8">
			<p className="h2 max-w-[14ch]">{title}</p>
			<p className="lead mt-6 max-w-[44ch]">{state.message}</p>
			<p className="body-t mt-3 max-w-[44ch]">{next}</p>
		</div>
	)
}

export function SubmitButton({ pending, children, className }: { pending: boolean; children: React.ReactNode; className?: string }) {
	return (
		<button type="submit" disabled={pending} className={`btn btn--solid ${className ?? ""}`}>
			{pending ? "در حال ارسال…" : children}
			{!pending && <Arrow />}
		</button>
	)
}
