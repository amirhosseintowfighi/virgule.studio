"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"

/**
 * ذخیره‌ی یک گروه تنظیمات (مثلاً general، social، seo).
 * کلید گروه در فیلد _key و بقیه‌ی فیلدها به‌عنوان مقادیر JSON ذخیره می‌شوند.
 */
export async function saveSettingGroup(formData: FormData) {
	const session = await requirePermission("setting:manage")
	const key = String(formData.get("_key") ?? "").trim()
	if (!key) return

	const value: Record<string, string> = {}
	for (const [k, v] of formData.entries()) {
		if (k === "_key") continue
		value[k] = String(v)
	}

	await prisma.setting.upsert({
		where: { key },
		update: { value },
		create: { key, value },
	})

	await prisma.activityLog.create({
		data: { userId: session.userId, action: "setting.update", entity: "Setting", entityId: key },
	})

	revalidatePath("/dashboard/settings")
	revalidatePath("/")
	redirect("/dashboard/settings")
}

/** ذخیره‌ی محتوای یک صفحه‌ی CMS. */
export async function savePageContent(formData: FormData) {
	const session = await requirePermission("setting:manage")
	const id = String(formData.get("id") ?? "").trim()
	const title = String(formData.get("title") ?? "").trim()
	const slug = String(formData.get("slug") ?? "").trim()
	const content = String(formData.get("content") ?? "")
	const published = formData.get("published") === "on"
	if (!title || !slug) return

	if (id) {
		await prisma.page.update({ where: { id }, data: { title, slug, content, published } })
	} else {
		await prisma.page.create({ data: { title, slug, content, published } })
	}

	await prisma.activityLog.create({
		data: { userId: session.userId, action: id ? "page.update" : "page.create", entity: "Page", entityId: id || slug },
	})

	revalidatePath("/dashboard/settings")
	redirect("/dashboard/settings")
}
