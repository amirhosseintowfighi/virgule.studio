import Link from "next/link"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { roleLabel } from "@/lib/permissions"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveUser } from "@/server/actions/users"

export default async function NewUserPage() {
	await requirePermission("user:write")
	const roles = await prisma.role.findMany({ orderBy: { name: "asc" } })

	const fields: FormField[] = [
		{ name: "name", label: "نام کامل", required: true, full: false },
		{ name: "email", label: "ایمیل", type: "email", required: true, full: false },
		{ name: "password", label: "رمز عبور", type: "password", required: true, help: "حداقل ۸ کاراکتر", full: false },
		{
			name: "roleId",
			label: "نقش دسترسی",
			type: "select",
			required: true,
			full: false,
			options: roles.map((r) => ({ value: r.id, label: roleLabel(r.name) })),
		},
		{ name: "isActive", label: "حساب فعال باشد", type: "checkbox", defaultChecked: true },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/users">کاربران</Link> / <span className="text-[var(--color-ink)]">کاربر جدید</span>
			</div>
			<h1 className="text-2xl font-extrabold">کاربر جدید</h1>
			<EntityForm action={saveUser} fields={fields} cancelHref="/dashboard/users" submitLabel="ایجاد کاربر" />
		</div>
	)
}
