"use client"

import { useActionState } from "react"
import { loginAction, type LoginState } from "@/server/actions/auth"

const initial: LoginState = {}

const inputCls =
	"w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"

export function LoginForm() {
	const [state, action, pending] = useActionState(loginAction, initial)

	return (
		<form action={action} className="space-y-4">
			<input name="email" type="email" required placeholder="ایمیل" className={inputCls} />
			<input name="password" type="password" required placeholder="رمز عبور" className={inputCls} />

			{state.error && <p className="text-sm text-[var(--color-error)]">{state.error}</p>}

			<button
				type="submit"
				disabled={pending}
				className="w-full rounded-[var(--radius-full)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)] active:scale-[.98] disabled:opacity-50"
			>
				{pending ? "در حال ورود..." : "ورود"}
			</button>
		</form>
	)
}
