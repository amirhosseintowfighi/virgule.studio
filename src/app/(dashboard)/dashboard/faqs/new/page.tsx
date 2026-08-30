import Link from "next/link"
import { requirePermissionPage } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveFaq } from "@/server/actions/faqs"

const fields: FormField[] = [
	{ name: "question", label: "پرسش", required: true, placeholder: "مثلاً هزینه‌ی طراحی سایت چقدر است؟" },
	{ name: "answer", label: "پاسخ", type: "textarea", rows: 5, required: true },
	{ name: "category", label: "دسته", placeholder: "عمومی / فنی / پشتیبانی", full: false },
	{ name: "order", label: "ترتیب نمایش", type: "number", defaultValue: 0, full: false },
]

export default async function NewFaqPage() {
	await requirePermissionPage("setting:manage")
	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/faqs">پرسش‌های متداول</Link> /{" "}
				<span className="text-[var(--color-ink)]">پرسش جدید</span>
			</div>
			<h1 className="text-2xl font-extrabold">پرسش جدید</h1>
			<EntityForm action={saveFaq} fields={fields} cancelHref="/dashboard/faqs" submitLabel="ایجاد پرسش" />
		</div>
	)
}
