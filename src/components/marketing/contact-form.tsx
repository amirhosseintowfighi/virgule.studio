"use client"

import { useActionState } from "react"
import { submitContact, type FormState } from "@/server/actions/forms"

const initial: FormState = {}

export function ContactForm() {
	const [state, action, pending] = useActionState(submitContact, initial)

	return (
		<form action={action} className="max-w-[46rem]">
			{/* Honeypot — ضداسپم */}
			<input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

			<div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
				<label className="block">
					<span className="label">نام و نام خانوادگی</span>
					<input name="name" required className="field" placeholder="نام شما" />
				</label>
				<label className="block">
					<span className="label">ایمیل</span>
					<input name="email" type="email" required className="field font-latin" dir="ltr" placeholder="you@example.com" />
				</label>
				<label className="block">
					<span className="label">شماره تماس (اختیاری)</span>
					<input name="phone" className="field num" dir="ltr" placeholder="0912…" />
				</label>
			</div>

			<label className="mt-6 block">
				<span className="label">پیام شما</span>
				<textarea name="message" required rows={5} className="field resize-none" placeholder="کمی درباره‌ی پروژه بگویید…" />
			</label>

			{state.error && (
				<p role="alert" className="mt-5 text-sm text-[var(--color-error)]">
					{state.error}
				</p>
			)}
			{state.success && (
				<p role="status" className="mt-5 text-sm text-[var(--color-success)]">
					{state.message}
				</p>
			)}

			<button type="submit" disabled={pending} className="btn btn--solid mt-10 disabled:opacity-50">
				{pending ? "در حال ارسال…" : "ارسال پیام"}
			</button>
		</form>
	)
}
