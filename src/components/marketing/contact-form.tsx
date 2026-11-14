"use client"

import { useActionState } from "react"
import { submitContact, type FormState } from "@/server/actions/forms"
import { FormDone, FormError, SubmitButton } from "@/components/marketing/form-parts"

const initial: FormState = {}

export function ContactForm() {
	const [state, action, pending] = useActionState(submitContact, initial)

	const v = state.values ?? {}

	if (state.success) {
		return (
			<FormDone
				title="پیام‌تان رسید."
				state={state}
				next="معمولاً همان روز کاری پاسخ می‌دهیم. اگر عجله دارید، تماس تلفنی سریع‌تر است."
			/>
		)
	}

	return (
		<form action={action} className="space-y-8">
			{/* Honeypot — ضداسپم */}
			<input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

			<div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
				<label className="block sm:col-span-2">
					<span className="label">نام و نام خانوادگی</span>
					<input name="name" defaultValue={v.name} required autoComplete="name" className="field" />
				</label>
				<label className="block">
					<span className="label">ایمیل</span>
					<input name="email" defaultValue={v.email} type="email" required autoComplete="email" className="field font-latin" dir="ltr" placeholder="you@example.com" />
				</label>
				<label className="block">
					<span className="label">شماره تماس (اختیاری)</span>
					<input name="phone" defaultValue={v.phone} type="tel" inputMode="tel" autoComplete="tel" className="field font-latin" dir="ltr" placeholder="09120000000" />
				</label>
			</div>

			<label className="block">
				<span className="label">پیام شما</span>
				<textarea name="message" defaultValue={v.message} required rows={5} className="field" placeholder="کمی درباره‌ی پروژه یا سوال‌تان بنویسید" />
			</label>

			<FormError state={state} />

			<SubmitButton pending={pending}>ارسال پیام</SubmitButton>
		</form>
	)
}
