import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { roleLabel } from "@/lib/permissions"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveUser } from "@/server/actions/users"

type Props = { params: Promise<{ id: string }> }

export default async function EditUserPage({ params }: Props) {
	await requirePermission("user:write")
	const { id } = await params
	const [user, roles] = await Promise.all([
		prisma.user.findUnique({ where: { id }, include: { role: true } }),
		prisma.role.findMany({ orderBy: { name: "asc" } }),
	])
	if (!user) notFound()

	const hidden = { id: user.id }
	const fields: FormField[] = [
		{ name: "name", label: "نام کامل", required: true, defaultValue: user.name, full: false },
		{ name: "email", label: "ایمیل", type: "email", required: true, defaultValue: user.email, full: false },
		{ name: "password", label: "رمز عبور جدید", type: "password", help: "خالی بگذارید تا تغییر نکند", full: false },
		{
			name: "roleId",
			label: "نقش دسترسی",
			type: "select",
			required: true,
			full: false,
			defaultValue: user.roleId,
			options: roles.map((r) => ({ value: r.id, label: roleLabel(r.name) })),
		},
		{ name: "isActive", label: "حساب فعال باشد", type: "checkbox", defaultChecked: user.isActive },
	]

	return (
		<div className="space-y-6">
			<div className="text-sm text-[var(--color-muted)]">
				<Link href="/dashboard/users">کاربران</Link> / <span className="text-[var(--color-ink)]">{user.name}</span>
			</div>
			<h1 className="text-2xl font-extrabold">ویرایش کاربر</h1>
			<p className="text-sm text-[var(--color-muted)]">نقش فعلی: {roleLabel(user.role.name)}</p>
			<EntityForm action={saveUser} fields={fields} hidden={hidden} cancelHref="/dashboard/users" submitLabel="ذخیره‌ی تغییرات" />
		</div>
	)
}
