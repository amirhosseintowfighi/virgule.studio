"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { CategoryType } from "@prisma/client"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"

const schema = z.object({
	name: z.string().min(1, "نام دسته الزامی است"),
	slug: z
		.string()
		.min(1, "اسلاگ الزامی است")
		.regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف کوچک انگلیسی، عدد و خط تیره"),
	description: z.string().optional(),
	type: z.enum(["BLOG", "PORTFOLIO"]),
})

/** ایجاد یا ویرایش دسته‌بندی. */
export async function saveCategory(formData: FormData) {
	const session = await requirePermission("project:write")
	const id = String(formData.get("id") ?? "").trim()
	const data = schema.parse({
		name: String(formData.get("name") ?? "").trim(),
		slug: String(formData.get("slug") ?? "").trim(),
		description: String(formData.get("description") ?? "").trim() || undefined,
		type: String(formData.get("type") ?? "PORTFOLIO"),
	})

	const payload = {
		name: data.name,
		slug: data.slug,
		description: data.description ?? null,
		type: data.type as CategoryType,
	}

	const saved = id
		? await prisma.category.update({ where: { id }, data: payload })
		: await prisma.category.create({ data: payload })

	await prisma.activityLog.create({
		data: {
			userId: session.userId,
			action: id ? "category.update" : "category.create",
			entity: "Category",
			entityId: saved.id,
		},
	})

	revalidatePath("/dashboard/categories")
	revalidatePath("/portfolio")
	revalidatePath("/blog")
	redirect("/dashboard/categories")
}

/** حذف دسته‌بندی (ارجاع نمونه‌کارها/مقالات خالی می‌شود). */
export async function deleteCategory(formData: FormData) {
	const session = await requirePermission("project:write")
	const id = String(formData.get("id") ?? "").trim()
	if (!id) return
	await prisma.project.updateMany({ where: { categoryId: id }, data: { categoryId: null } })
	await prisma.post.updateMany({ where: { categoryId: id }, data: { categoryId: null } })
	await prisma.category.delete({ where: { id } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "category.delete", entity: "Category", entityId: id },
	})
	revalidatePath("/dashboard/categories")
	revalidatePath("/portfolio")
	revalidatePath("/blog")
	redirect("/dashboard/categories")
}
