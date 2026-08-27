import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveCategory } from "@/server/actions/categories"

type Props = { params: Promise<{ id: string }> }

export default async function EditCategoryPage({ params }: Props) {
	await requirePermission("project:write")
	const { id } = await params
	const category = await prisma.category.findUnique({ where: { id } })
	if (!category) notFound()

	const hidden = { id: category.id }
	const fields: FormField[] = [
		{ name: "name", label: "نام دسته", required: true, defaultValue: category.name, full: false },
		{ name: "slug", label: "اسلاگ", required: true, defaultValue: category.slug, full: false },
		{
			name: "type",
			label: "نوع دسته",
			type: "select",
			full: false,
			defaultValue: category.type,
			options: [
				{ value: "PORTFOLIO", label: "نمونه‌کار" },
				{ value: "BLOG", label: "مقاله" },
			],
		},
		{ name: "description", label: "توضیح (اختیاری)", type: "textarea", rows: 3, defaultValue: category.description ?? "" },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/categories">دسته‌بندی‌ها</Link> / <span className="text-[var(--color-ink)]">{category.name}</span>
			</div>
			<h1 className="text-2xl font-extrabold">ویرایش دسته‌بندی</h1>
			<EntityForm action={saveCategory} fields={fields} hidden={hidden} cancelHref="/dashboard/categories" submitLabel="ذخیره‌ی تغییرات" />
		</div>
	)
}
