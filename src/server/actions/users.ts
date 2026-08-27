"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission, isSuperAdmin, AuthError } from "@/lib/rbac"
import { hashPassword } from "@/lib/auth"
import { userCreateSchema, userUpdateSchema } from "@/lib/validators"
import { SUPER_ADMIN_ROLE } from "@/lib/permissions"

function str(v: FormDataEntryValue | null): string {
	return String(v ?? "").trim()
}

/** ایجاد یا ویرایش کاربر. */
export async function saveUser(formData: FormData) {
	const id = str(formData.get("id"))
	const session = await requirePermission("user:write")

	const targetRole = await prisma.role.findUnique({
		where: { id: str(formData.get("roleId")) },
	})

	// فقط مدیر کل می‌تواند نقش «مدیر کل» را به کسی بدهد
	if (targetRole?.name === SUPER_ADMIN_ROLE && !isSuperAdmin(session)) {
		throw new AuthError("فقط مدیر کل می‌تواند نقش مدیر کل را اختصاص دهد.", 403)
	}

	if (id) {
		// در صورت ویرایش کاربری که مدیر کل است، فقط مدیر کل مجاز است
		const existing = await prisma.user.findUnique({
			where: { id },
			include: { role: true },
		})
		if (existing?.role.name === SUPER_ADMIN_ROLE && !isSuperAdmin(session)) {
			throw new AuthError("ویرایش مدیر کل فقط توسط مدیر کل ممکن است.", 403)
		}

		const data = userUpdateSchema.parse({
			name: str(formData.get("name")),
			email: str(formData.get("email")),
			password: str(formData.get("password")),
			roleId: str(formData.get("roleId")),
			isActive: formData.get("isActive") === "on",
		})

		await prisma.user.update({
			where: { id },
			data: {
				name: data.name,
				email: data.email,
				roleId: data.roleId,
				isActive: data.isActive,
				...(data.password ? { passwordHash: await hashPassword(data.password) } : {}),
			},
		})
	} else {
		const data = userCreateSchema.parse({
			name: str(formData.get("name")),
			email: str(formData.get("email")),
			password: str(formData.get("password")),
			roleId: str(formData.get("roleId")),
			isActive: formData.get("isActive") === "on",
		})

		await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				passwordHash: await hashPassword(data.password),
				roleId: data.roleId,
				isActive: data.isActive,
			},
		})
	}

	await prisma.activityLog.create({
		data: {
			userId: session.userId,
			action: id ? "user.update" : "user.create",
			entity: "User",
			entityId: id || undefined,
		},
	})

	revalidatePath("/dashboard/users")
	redirect("/dashboard/users")
}

/** حذف کاربر — مدیر کل قابل حذف توسط غیرمدیرکل نیست. */
export async function deleteUser(formData: FormData) {
	const session = await requirePermission("user:delete")
	const id = str(formData.get("id"))
	if (!id) return

	if (id === session.userId) {
		throw new AuthError("نمی‌توانید حساب خودتان را حذف کنید.", 400)
	}

	const target = await prisma.user.findUnique({
		where: { id },
		include: { role: true },
	})
	if (target?.role.name === SUPER_ADMIN_ROLE && !isSuperAdmin(session)) {
		throw new AuthError("مدیر کل فقط توسط مدیر کل دیگر قابل حذف است.", 403)
	}

	await prisma.user.delete({ where: { id } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "user.delete", entity: "User", entityId: id },
	})
	revalidatePath("/dashboard/users")
	redirect("/dashboard/users")
}
