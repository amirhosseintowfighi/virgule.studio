"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"

export type FormField = {
	name: string
	label: string
	type?: "text" | "textarea" | "number" | "url" | "password" | "email" | "checkbox" | "select" | "list"
	placeholder?: string
	required?: boolean
	help?: string
	defaultValue?: string | number
	defaultChecked?: boolean
	options?: { value: string; label: string }[]
	rows?: number
	full?: boolean
}

const inputCls =
	"w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-base outline-none transition-colors duration-300 focus:border-[var(--color-primary)]"

function SubmitButton({ label }: { label: string }) {
	const { pending } = useFormStatus()
	return (
		<button
			type="submit"
			disabled={pending}
			className="border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-6 py-2.5 text-sm font-bold text-[var(--color-on-primary)] rounded-[var(--radius-full)] shadow-[var(--elev-1)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
		>
			{pending ? "در حال ذخیره..." : label}
		</button>
	)
}

function Field({ field }: { field: FormField }) {
	const { type = "text" } = field

	if (type === "checkbox") {
		return (
			<label className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm">
				<input
					type="checkbox"
					name={field.name}
					defaultChecked={field.defaultChecked}
					className="h-4 w-4 accent-[var(--color-primary)]"
				/>
				<span className="font-medium">{field.label}</span>
				{field.help && <span className="text-xs text-[var(--color-muted)]">{field.help}</span>}
			</label>
		)
	}

	return (
		<div className={field.full === false ? "" : "sm:col-span-2"}>
			<label className="mb-1.5 block text-sm font-medium">
				{field.label}
				{field.required && <span className="text-[var(--color-error)]"> *</span>}
			</label>
			{type === "textarea" || type === "list" ? (
				<textarea
					name={field.name}
					rows={field.rows ?? (type === "list" ? 5 : 8)}
					placeholder={field.placeholder}
					required={field.required}
					defaultValue={field.defaultValue as string}
					className={inputCls}
				/>
			) : type === "select" ? (
				<select
					name={field.name}
					defaultValue={field.defaultValue as string}
					required={field.required}
					className={inputCls}
				>
					{field.options?.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
			) : (
				<input
					type={type}
					name={field.name}
					placeholder={field.placeholder}
					required={field.required}
					defaultValue={field.defaultValue as string}
					className={inputCls}
				/>
			)}
			{field.help && <p className="mt-1 text-xs text-[var(--color-muted)]">{field.help}</p>}
		</div>
	)
}

export function EntityForm({
	action,
	fields,
	hidden,
	submitLabel = "ذخیره",
	cancelHref,
}: {
	action: (formData: FormData) => void | Promise<void>
	fields: FormField[]
	hidden?: Record<string, string>
	submitLabel?: string
	cancelHref?: string
}) {
	return (
		<form
			action={action}
			className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--elev-1)]"
		>
			{hidden &&
				Object.entries(hidden).map(([k, v]) => (
					<input key={k} type="hidden" name={k} value={v} />
				))}
			<div className="grid gap-5 sm:grid-cols-2">
				{fields.map((f) => (
					<Field key={f.name} field={f} />
				))}
			</div>
			<div className="mt-6 flex items-center gap-3">
				<SubmitButton label={submitLabel} />
				{cancelHref && (
					<Link
						href={cancelHref}
						className="rounded-[var(--radius-full)] border border-[var(--color-border)] px-6 py-2.5 text-sm transition-colors duration-300 hover:bg-[var(--color-surface-2)]"
					>
						انصراف
					</Link>
				)}
			</div>
		</form>
	)
}
