import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveService } from "@/server/actions/services"

type Props = { params: Promise<{ id: string }> }

export default async function EditServicePage({ params }: Props) {
	await requirePermission("service:write")
	const { id } = await params
	const service = await prisma.service.findUnique({ where: { id } })
	if (!service) notFound()

	const hidden = { id: service.id }
	const fields: FormField[] = [
		{ name: "title", label: "عنوان خدمت", required: true, defaultValue: service.title, full: false },
		{ name: "slug", label: "اسلاگ (آدرس صفحه)", required: true, defaultValue: service.slug, help: "فقط حروف کوچک انگلیسی، عدد و خط تیره", full: false },
		{ name: "icon", label: "آیکن", defaultValue: service.icon ?? "", full: false },
		{ name: "order", label: "ترتیب نمایش", type: "number", defaultValue: service.order, full: false },
		{ name: "summary", label: "خلاصه‌ی کوتاه", type: "textarea", rows: 2, defaultValue: service.summary ?? "" },
		{ name: "content", label: "توضیحات کامل", type: "textarea", rows: 12, defaultValue: service.content ?? "", help: "هر پاراگراف را با یک خط خالی جدا کنید." },
		{ name: "features", label: "ویژگی‌ها", type: "list", defaultValue: service.features.join("\n"), help: "هر ویژگی در یک خط." },
		{ name: "active", label: "فعال باشد", type: "checkbox", defaultChecked: service.active },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/services">خدمات</Link> / <span className="text-[var(--color-ink)]">{service.title}</span>
			</div>
			<h1 className="text-2xl font-extrabold">ویرایش خدمت</h1>
			<EntityForm action={saveService} fields={fields} hidden={hidden} cancelHref="/dashboard/services" submitLabel="ذخیره‌ی تغییرات" />
		</div>
	)
}
