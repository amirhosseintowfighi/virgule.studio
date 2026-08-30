import Link from "next/link"
import { requirePermissionPage } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveCategory } from "@/server/actions/categories"

export default async function NewCategoryPage() {
	await requirePermissionPage("project:write")

	const fields: FormField[] = [
		{ name: "name", label: "نام دسته", required: true, placeholder: "خدماتی", full: false },
		{ name: "slug", label: "اسلاگ", required: true, placeholder: "service-based", help: "حروف کوچک انگلیسی، عدد و خط تیره", full: false },
		{
			name: "type",
			label: "نوع دسته",
			type: "select",
			full: false,
			defaultValue: "PORTFOLIO",
			options: [
				{ value: "PORTFOLIO", label: "نمونه‌کار" },
				{ value: "BLOG", label: "مقاله" },
			],
		},
		{ name: "description", label: "توضیح (اختیاری)", type: "textarea", rows: 3 },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/categories">دسته‌بندی‌ها</Link> / <span className="text-[var(--color-ink)]">دسته‌بندی جدید</span>
			</div>
			<h1 className="text-2xl font-extrabold">دسته‌بندی جدید</h1>
			<EntityForm action={saveCategory} fields={fields} cancelHref="/dashboard/categories" submitLabel="ایجاد دسته‌بندی" />
		</div>
	)
}
