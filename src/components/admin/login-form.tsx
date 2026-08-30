"use client"

import { useActionState } from "react"
import { loginAction, type ActionState } from "@/server/actions/auth"

const initial: ActionState = {}

const inputCls =
	"w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base outline-none transition-colors duration-300 focus:border-[var(--color-primary)]"

export function LoginForm() {
	const [state, action, pending] = useActionState(loginAction, initial)

	return (
		<form action={action} className="space-y-4">
			{/* برچسب دیده‌شونده، نه فقط placeholder — placeholder با شروع تایپ ناپدید می‌شود. */}
			<label className="block">
				<span className="mb-1.5 block text-sm font-bold">ایمیل</span>
				<input name="email" type="email" required autoComplete="username" className={inputCls} dir="ltr" />
			</label>
			<label className="block">
				<span className="mb-1.5 block text-sm font-bold">رمز عبور</span>
				<input
					name="password"
					type="password"
					required
					autoComplete="current-password"
					className={inputCls}
					dir="ltr"
				/>
			</label>

			{state.error && (
				<p role="alert" className="border border-[var(--color-error)] p-3 text-sm text-[var(--color-error)]">
					{state.error}
				</p>
			)}

			<button
				type="submit"
				disabled={pending}
				className="w-full border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-6 py-3 text-sm font-bold text-[var(--color-on-primary)] rounded-[var(--radius-full)] shadow-[var(--elev-1)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
			>
				{pending ? "در حال ورود..." : "ورود"}
			</button>
		</form>
	)
}
