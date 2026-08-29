"use client"

import { useActionState } from "react"
import { submitProjectRequest, type FormState } from "@/server/actions/forms"

const initial: FormState = {}

const inputCls = "field"
const labelCls = "label"

const budgets = ["تا ۱۰ میلیون تومان", "۱۰ تا ۳۰ میلیون تومان", "۳۰ تا ۸۰ میلیون تومان", "بیش از ۸۰ میلیون تومان"]
const timelines = ["فوری (کمتر از ۱ ماه)", "۱ تا ۳ ماه", "۳ تا ۶ ماه", "انعطاف‌پذیر"]

export function ProjectRequestForm() {
	const [state, action, pending] = useActionState(submitProjectRequest, initial)

	return (
		<form action={action} className="space-y-6">
			{/* Honeypot — ضداسپم */}
			<input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

			<div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
				<div>
					<label className={labelCls}>نام و نام خانوادگی *</label>
					<input name="name" required placeholder="مثلاً علی رضایی" className={inputCls} />
				</div>
				<div>
					<label className={labelCls}>نام شرکت / برند</label>
					<input name="company" placeholder="(اختیاری)" className={inputCls} />
				</div>
				<div>
					<label className={labelCls}>شماره تماس *</label>
					<input name="phone" required inputMode="tel" placeholder="09xxxxxxxxx" className={inputCls} />
				</div>
				<div>
					<label className={labelCls}>ایمیل *</label>
					<input name="email" type="email" required placeholder="you@example.com" className={inputCls} />
				</div>
				<div>
					<label className={labelCls}>بودجه‌ی تقریبی</label>
					<select name="budget" className={inputCls} defaultValue="">
						<option value="" disabled>انتخاب کنید</option>
						{budgets.map((b) => (
							<option key={b} value={b}>{b}</option>
						))}
					</select>
				</div>
				<div>
					<label className={labelCls}>زمان‌بندی دلخواه</label>
					<select name="timeline" className={inputCls} defaultValue="">
						<option value="" disabled>انتخاب کنید</option>
						{timelines.map((t) => (
							<option key={t} value={t}>{t}</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label className={labelCls}>توضیحات پروژه *</label>
				<textarea name="description" required rows={5} placeholder="درباره‌ی کسب‌وکار، هدف پروژه و انتظاراتتان برای‌مان بنویسید..." className={inputCls} />
			</div>

			{state.error && (
				<p role="alert" className="border-[length:var(--bw-2)] border-[var(--color-error)] p-3 text-sm text-[var(--color-error)]">
					{state.error}
				</p>
			)}
			{state.success && (
				<p role="status" className="border-[length:var(--bw-2)] border-[var(--color-success)] p-3 text-sm text-[var(--color-success)]">
					{state.message}
				</p>
			)}

			<button type="submit" disabled={pending} className="btn btn--solid mt-4 w-full disabled:opacity-50">
				{pending ? "در حال ارسال…" : "ثبت درخواست و دریافت مشاوره‌ی رایگان"}
			</button>
		</form>
	)
}
