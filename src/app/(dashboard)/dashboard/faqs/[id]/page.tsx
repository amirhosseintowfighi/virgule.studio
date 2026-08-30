import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermissionPage } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveFaq } from "@/server/actions/faqs"

type Props = { params: Promise<{ id: string }> }

export default async function EditFaqPage({ params }: Props) {
	await requirePermissionPage("setting:manage")
	const { id } = await params
	const faq = await prisma.faq.findUnique({ where: { id } })
	if (!faq) notFound()

	const fields: FormField[] = [
		{ name: "question", label: "پرسش", required: true, defaultValue: faq.question },
		{ name: "answer", label: "پاسخ", type: "textarea", rows: 5, required: true, defaultValue: faq.answer },
		{ name: "category", label: "دسته", defaultValue: faq.category ?? "", full: false },
		{ name: "order", label: "ترتیب نمایش", type: "number", defaultValue: faq.order, full: false },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/faqs">پرسش‌های متداول</Link> /{" "}
				<span className="text-[var(--color-ink)]">ویرایش</span>
			</div>
			<h1 className="text-2xl font-extrabold">ویرایش پرسش</h1>
			<EntityForm
				action={saveFaq}
				fields={fields}
				hidden={{ id: faq.id }}
				cancelHref="/dashboard/faqs"
				submitLabel="ذخیره‌ی تغییرات"
			/>
		</div>
	)
}
