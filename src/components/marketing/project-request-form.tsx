"use client"

import { useActionState } from "react"
import { submitProjectRequest, type FormState } from "@/server/actions/forms"
import { FormDone, FormError, SubmitButton } from "@/components/marketing/form-parts"

const initial: FormState = {}

const timelines = ["فوری (کمتر از ۱ ماه)", "۱ تا ۳ ماه", "۳ تا ۶ ماه", "انعطاف‌پذیر"]

/** گروهِ فیلدها با عنوانِ شماره‌دار — فرمِ بلند را به سه قدمِ کوتاه می‌شکند. */
function Group({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
	return (
		<fieldset className="m-0 min-w-0 border-0 border-t border-[var(--line-2)] p-0 pt-6">
			<legend className="float-start mb-8 flex w-full items-baseline gap-4 p-0">
				<span className="numeral text-[1.35rem]" aria-hidden="true">{n}</span>
				<span className="t-title">{title}</span>
			</legend>
			<div className="clear-both grid gap-x-10 gap-y-8 md:grid-cols-2">{children}</div>
		</fieldset>
	)
}

/** بازه‌های بودجه از متن‌های قابل‌ویرایشِ صفحه می‌آیند (content.ts ← گروه request). */
export function ProjectRequestForm({ budgets }: { budgets: string[] }) {
	const [state, action, pending] = useActionState(submitProjectRequest, initial)

	const v = state.values ?? {}

	if (state.success) {
		return (
			<FormDone
				title="درخواست‌تان ثبت شد."
				state={state}
				next="همان روز کاری آن را می‌خوانیم و برای هماهنگیِ جلسه‌ی اول با شما تماس می‌گیریم."
			/>
		)
	}

	return (
		<form action={action} className="space-y-12">
			{/* Honeypot — ضداسپم */}
			<input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

			<Group n="۰۱" title="شما">
				<label className="block">
					<span className="label">نام و نام خانوادگی</span>
					<input name="name" defaultValue={v.name} required autoComplete="name" className="field" />
				</label>
				<label className="block">
					<span className="label">نام شرکت یا برند (اختیاری)</span>
					<input name="company" defaultValue={v.company} autoComplete="organization" className="field" />
				</label>
				<label className="block">
					<span className="label">شماره تماس</span>
					<input name="phone" defaultValue={v.phone} type="tel" required inputMode="tel" autoComplete="tel" className="field font-latin" dir="ltr" placeholder="09120000000" />
				</label>
				<label className="block">
					<span className="label">ایمیل</span>
					<input name="email" defaultValue={v.email} type="email" required autoComplete="email" className="field font-latin" dir="ltr" placeholder="you@example.com" />
				</label>
			</Group>

			<Group n="۰۲" title="چارچوب">
				<label className="block">
					<span className="label">بودجه‌ی تقریبی (اختیاری)</span>
					<select name="budget" className="field" defaultValue={v.budget ?? ""}>
						<option value="" disabled>انتخاب کنید</option>
						{budgets.map((b) => (
							<option key={b} value={b}>{b}</option>
						))}
					</select>
				</label>
				<label className="block">
					<span className="label">زمان‌بندی دلخواه (اختیاری)</span>
					<select name="timeline" className="field" defaultValue={v.timeline ?? ""}>
						<option value="" disabled>انتخاب کنید</option>
						{timelines.map((t) => (
							<option key={t} value={t}>{t}</option>
						))}
					</select>
				</label>
			</Group>

			<Group n="۰۳" title="پروژه">
				<label className="block md:col-span-2">
					<span className="label">توضیحات پروژه</span>
					<textarea
						name="description" defaultValue={v.description}
						required
						rows={6}
						className="field"
						placeholder="کسب‌وکارتان چیست، سایت باید چه کاری انجام دهد و چه چیزی برایتان مهم‌تر است؟"
					/>
				</label>
			</Group>

			<FormError state={state} />

			<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
				<SubmitButton pending={pending}>ثبت درخواست</SubmitButton>
				<p className="meta-fa">ثبت درخواست هیچ تعهدی ایجاد نمی‌کند.</p>
			</div>
		</form>
	)
}
