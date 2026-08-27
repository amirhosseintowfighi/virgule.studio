"use client"

import { useActionState } from "react"
import { submitContact, type FormState } from "@/server/actions/forms"
import { Button } from "@/components/ui/button"

const initial: FormState = {}

const inputCls =
	"w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"

export function ContactForm() {
	const [state, action, pending] = useActionState(submitContact, initial)

	return (
		<form action={action} className="space-y-4">
			{/* Honeypot — ضداسپم */}
			<input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

			<input name="name" required placeholder="نام و نام خانوادگی" className={inputCls} />
			<input name="email" type="email" required placeholder="ایمیل" className={inputCls} />
			<input name="phone" placeholder="شماره تماس (اختیاری)" className={inputCls} />
			<textarea name="message" required rows={5} placeholder="پیام شما" className={inputCls} />

			{state.error && <p className="text-sm text-[var(--color-error)]">{state.error}</p>}
			{state.success && <p className="text-sm text-[var(--color-success)]">{state.message}</p>}

			<Button type="submit" disabled={pending} className="w-full">
				{pending ? "در حال ارسال..." : "ارسال پیام"}
			</Button>
		</form>
	)
}
