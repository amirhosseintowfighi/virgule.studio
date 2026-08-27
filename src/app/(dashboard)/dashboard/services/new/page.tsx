import Link from "next/link"
import { requirePermission } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveService } from "@/server/actions/services"

const fields: FormField[] = [
	{ name: "title", label: "عنوان خدمت", required: true, placeholder: "مثلاً طراحی سایت شرکتی", full: false },
	{ name: "slug", label: "اسلاگ (آدرس صفحه)", required: true, placeholder: "corporate-website", help: "فقط حروف کوچک انگلیسی، عدد و خط تیره", full: false },
	{ name: "icon", label: "آیکن", placeholder: "🌐 یا نام آیکن", help: "یک ایموجی یا نام آیکن", full: false },
	{ name: "order", label: "ترتیب نمایش", type: "number", defaultValue: 0, full: false },
	{ name: "summary", label: "خلاصه‌ی کوتاه", type: "textarea", rows: 2, placeholder: "یک جمله‌ی جذاب درباره‌ی این خدمت" },
	{ name: "content", label: "توضیحات کامل", type: "textarea", rows: 12, help: "متن کامل صفحه‌ی خدمت. هر پاراگراف را با یک خط خالی جدا کنید." },
	{ name: "features", label: "ویژگی‌ها", type: "list", help: "هر ویژگی را در یک خط جدا بنویسید." },
	{ name: "active", label: "فعال باشد (در سایت نمایش داده شود)", type: "checkbox", defaultChecked: true },
]

export default async function NewServicePage() {
	await requirePermission("service:write")
	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/services">خدمات</Link> / <span className="text-[var(--color-ink)]">خدمت جدید</span>
			</div>
			<h1 className="text-2xl font-extrabold">خدمت جدید</h1>
			<EntityForm action={saveService} fields={fields} cancelHref="/dashboard/services" submitLabel="ایجاد خدمت" />
		</div>
	)
}
