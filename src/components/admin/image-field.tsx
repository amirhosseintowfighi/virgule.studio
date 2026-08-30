"use client"

import { useRef, useState } from "react"

/**
 * انتخاب تصویر: یا فایل از کامپیوتر آپلود می‌شود، یا نشانی یک تصویر بیرونی
 * چسبانده می‌شود. مقدار نهایی در یک input مخفی می‌نشیند تا فرمِ اصلی — که
 * server action خودش را دارد — بدون تغییر همان فیلد را دریافت کند.
 *
 * آپلود با fetch به یک endpoint مستقل انجام می‌شود، نه با server action:
 * این کامپوننت داخل فرمِ ویرایش رندر می‌شود و یک server action در آن فرم
 * باعث می‌شد React بعد از اولین آپلود، submit خودِ فرم را نادیده بگیرد.
 */
export function ImageField({
	name,
	label,
	defaultValue = "",
	help,
}: {
	name: string
	label: string
	defaultValue?: string
	help?: string
}) {
	const [url, setUrl] = useState(defaultValue)
	const [pending, setPending] = useState(false)
	const [error, setError] = useState("")
	const fileRef = useRef<HTMLInputElement>(null)

	async function upload(file: File) {
		setPending(true)
		setError("")
		try {
			const fd = new FormData()
			fd.append("file", file)
			const res = await fetch("/api/uploads", { method: "POST", body: fd })
			const json = (await res.json()) as { url?: string; error?: string }
			if (!res.ok || !json.url) throw new Error(json.error ?? "آپلود ناموفق بود.")
			setUrl(json.url)
		} catch (e) {
			setError(e instanceof Error ? e.message : "آپلود ناموفق بود.")
		} finally {
			setPending(false)
		}
	}

	return (
		<div className="sm:col-span-2">
			<label className="mb-1.5 block text-sm font-medium">{label}</label>

			{/* مقداری که واقعاً ذخیره می‌شود */}
			<input type="hidden" name={name} value={url} />

			<div className="flex flex-wrap items-start gap-4">
				<div className="grid h-28 w-40 shrink-0 place-items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)]">
					{url ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={url} alt="پیش‌نمایش تصویر" className="h-full w-full object-cover" />
					) : (
						<span className="text-xs text-[var(--color-muted)]">بدون تصویر</span>
					)}
				</div>

				<div className="min-w-[16rem] flex-1 space-y-3">
					<input
						ref={fileRef}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						disabled={pending}
						onChange={(e) => {
							const file = e.target.files?.[0]
							if (file) void upload(file)
						}}
						className="block w-full text-sm file:me-3 file:rounded-[var(--radius-full)] file:border file:border-[var(--color-border)] file:bg-[var(--color-surface-2)] file:px-4 file:py-2 file:text-sm"
					/>

					{/* عمداً type="text" و نه "url": مسیرِ آپلودِ داخلی («/api/uploads/…»)
					    از نظر HTML یک URL معتبر نیست، پس با type="url" اعتبارسنجیِ
					    خودِ مرورگر جلوی submit شدنِ کل فرم را می‌گرفت — بی‌صدا، چون
					    فیلد از دید کاربر درست به نظر می‌رسید. */}
					<input
						type="text"
						inputMode="url"
						dir="ltr"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="یا نشانی تصویر را اینجا بچسبانید"
						className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-base outline-none transition-colors duration-300 focus:border-[var(--color-primary)]"
					/>

					<div className="flex items-center gap-3 text-xs">
						{pending && <span className="text-[var(--color-muted)]">در حال آپلود…</span>}
						{error && (
							<span role="alert" className="text-[var(--color-error)]">
								{error}
							</span>
						)}
						{url && !pending && (
							<button
								type="button"
								onClick={() => {
									setUrl("")
									if (fileRef.current) fileRef.current.value = ""
								}}
								className="text-[var(--color-error)] underline underline-offset-4"
							>
								حذف تصویر
							</button>
						)}
					</div>

					{help && <p className="text-xs text-[var(--color-muted)]">{help}</p>}
				</div>
			</div>
		</div>
	)
}
