import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { CategoryType } from "@prisma/client"
import { requirePermission } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveProject } from "@/server/actions/projects"

type Props = { params: Promise<{ id: string }> }

export default async function EditProjectPage({ params }: Props) {
	await requirePermission("project:write")
	const { id } = await params
	const [project, categories] = await Promise.all([
		prisma.project.findUnique({ where: { id } }),
		prisma.category.findMany({ where: { type: CategoryType.PORTFOLIO }, orderBy: { name: "asc" } }),
	])
	if (!project) notFound()

	const hidden = { id: project.id }
	const fields: FormField[] = [
		{ name: "title", label: "عنوان پروژه", required: true, defaultValue: project.title, full: false },
		{ name: "slug", label: "اسلاگ (آدرس صفحه)", required: true, defaultValue: project.slug, full: false },
		{ name: "client", label: "کارفرما", defaultValue: project.client ?? "", full: false },
		{ name: "year", label: "سال", type: "number", defaultValue: project.year ?? undefined, full: false },
		{ name: "url", label: "لینک پروژه", type: "url", defaultValue: project.url ?? "", full: false },
		{
			name: "categoryId",
			label: "دسته‌بندی",
			type: "select",
			full: false,
			defaultValue: project.categoryId ?? "",
			options: [{ value: "", label: "— بدون دسته —" }, ...categories.map((c) => ({ value: c.id, label: c.name }))],
		},
		{ name: "coverImage", label: "آدرس تصویر کاور", type: "url", defaultValue: project.coverImage ?? "", help: "اختیاری" },
		{ name: "summary", label: "خلاصه‌ی کوتاه", type: "textarea", rows: 2, defaultValue: project.summary ?? "" },
		{ name: "content", label: "توضیحات کامل", type: "textarea", rows: 10, defaultValue: project.content ?? "", help: "هر پاراگراف در یک خط خالی جدا." },
		{ name: "technologies", label: "تکنولوژی‌ها", type: "list", defaultValue: project.technologies.join("\n") },
		{ name: "features", label: "دستاوردها / ویژگی‌ها", type: "list", defaultValue: project.features.join("\n") },
		{ name: "order", label: "ترتیب نمایش", type: "number", defaultValue: project.order, full: false },
		{ name: "featured", label: "پروژه‌ی ویژه", type: "checkbox", defaultChecked: project.featured },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/projects">نمونه‌کارها</Link> / <span className="text-[var(--color-ink)]">{project.title}</span>
			</div>
			<h1 className="text-2xl font-extrabold">ویرایش نمونه‌کار</h1>
			<EntityForm action={saveProject} fields={fields} hidden={hidden} cancelHref="/dashboard/projects" submitLabel="ذخیره‌ی تغییرات" />
		</div>
	)
}
