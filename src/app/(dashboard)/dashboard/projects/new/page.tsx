import Link from "next/link"
import prisma from "@/lib/prisma"
import { CategoryType } from "@prisma/client"
import { requirePermissionPage } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveProject } from "@/server/actions/projects"

export default async function NewProjectPage() {
	await requirePermissionPage("project:write")
	const categories = await prisma.category.findMany({
		where: { type: CategoryType.PORTFOLIO },
		orderBy: { name: "asc" },
	})

	const fields: FormField[] = [
		{ name: "title", label: "عنوان پروژه", required: true, full: false },
		{ name: "slug", label: "اسلاگ (آدرس صفحه)", required: true, placeholder: "aria-tech", full: false },
		{ name: "client", label: "کارفرما", full: false },
		{ name: "year", label: "سال", type: "number", placeholder: "2025", full: false },
		{ name: "url", label: "لینک پروژه", type: "url", placeholder: "https://...", full: false },
		{
			name: "categoryId",
			label: "دسته‌بندی",
			type: "select",
			full: false,
			options: [{ value: "", label: "— بدون دسته —" }, ...categories.map((c) => ({ value: c.id, label: c.name }))],
		},
		{ name: "coverImage", label: "تصویر کاور", type: "image", help: "اسکرین‌شات سایتی که ساخته‌اید. JPEG، PNG، WebP یا GIF تا ۵ مگابایت. اگر خالی بماند، یک جلد تایپوگرافیک از روی نام پروژه ساخته می‌شود." },
		{ name: "summary", label: "خلاصه‌ی کوتاه", type: "textarea", rows: 2 },
		{ name: "content", label: "توضیحات کامل", type: "textarea", rows: 10, help: "شرح کامل پروژه. هر پاراگراف در یک خط خالی جدا." },
		{ name: "technologies", label: "تکنولوژی‌ها", type: "list", help: "هر مورد در یک خط." },
		{ name: "features", label: "دستاوردها / ویژگی‌ها", type: "list", help: "هر مورد در یک خط." },
		{ name: "order", label: "ترتیب نمایش", type: "number", defaultValue: 0, full: false },
		{ name: "featured", label: "پروژه‌ی ویژه (نمایش در صفحه‌ی اصلی)", type: "checkbox" },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/projects">نمونه‌کارها</Link> / <span className="text-[var(--color-ink)]">نمونه‌کار جدید</span>
			</div>
			<h1 className="text-2xl font-extrabold">نمونه‌کار جدید</h1>
			<EntityForm action={saveProject} fields={fields} cancelHref="/dashboard/projects" submitLabel="ایجاد نمونه‌کار" />
		</div>
	)
}
