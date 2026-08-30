"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { CONTENT_GROUPS } from "@/lib/content"

/**
 * ذخیره‌ی متن‌های یک صفحه.
 * فقط فیلدهایی که در تعریف همان گروه آمده‌اند پذیرفته می‌شوند — فرم دستکاری‌شده
 * نمی‌تواند کلید دلخواه به Setting اضافه کند.
 */
export async function savePageText(formData: FormData) {
	const session = await requirePermission("setting:manage")
	const key = String(formData.get("_group") ?? "").trim()
	const group = CONTENT_GROUPS.find((g) => g.key === key)
	if (!group) return

	const value: Record<string, string> = {}
	for (const f of group.fields) {
		value[f.name] = String(formData.get(f.name) ?? "").trim()
	}

	await prisma.setting.upsert({
		where: { key: `content:${key}` },
		update: { value },
		create: { key: `content:${key}`, value },
	})

	await prisma.activityLog.create({
		data: { userId: session.userId, action: "content.update", entity: "Setting", entityId: key },
	})

	for (const p of group.paths) revalidatePath(p)
	revalidatePath("/dashboard/content")
	redirect(`/dashboard/content?saved=${key}`)
}

/** بازگرداندن یک گروه به متن‌های پیش‌فرض. */
export async function resetPageText(formData: FormData) {
	const session = await requirePermission("setting:manage")
	const key = String(formData.get("_group") ?? "").trim()
	const group = CONTENT_GROUPS.find((g) => g.key === key)
	if (!group) return

	await prisma.setting.deleteMany({ where: { key: `content:${key}` } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "content.reset", entity: "Setting", entityId: key },
	})

	for (const p of group.paths) revalidatePath(p)
	revalidatePath("/dashboard/content")
	redirect(`/dashboard/content?reset=${key}`)
}
