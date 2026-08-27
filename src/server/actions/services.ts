"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { serviceSchema } from "@/lib/validators"

function parseList(v: FormDataEntryValue | null): string[] {
	return String(v ?? "")
		.split("\n")
		.map((s) => s.trim())
		.filter(Boolean)
}

function str(v: FormDataEntryValue | null): string | undefined {
	const s = String(v ?? "").trim()
	return s.length ? s : undefined
}

/** ایجاد یا ویرایش خدمت. */
export async function saveService(formData: FormData) {
	const id = String(formData.get("id") ?? "").trim()
	const session = await requirePermission("service:write")

	const data = serviceSchema.parse({
		title: str(formData.get("title")),
		slug: str(formData.get("slug")),
		icon: str(formData.get("icon")),
		summary: str(formData.get("summary")),
		content: str(formData.get("content")),
		features: parseList(formData.get("features")),
		order: Number(formData.get("order") ?? 0) || 0,
		active: formData.get("active") === "on",
	})

	const saved = id
		? await prisma.service.update({ where: { id }, data })
		: await prisma.service.create({ data })

	await prisma.activityLog.create({
		data: {
			userId: session.userId,
			action: id ? "service.update" : "service.create",
			entity: "Service",
			entityId: saved.id,
		},
	})

	revalidatePath("/services")
	revalidatePath(`/services/${saved.slug}`)
	revalidatePath("/dashboard/services")
	redirect("/dashboard/services")
}

/** حذف خدمت. */
export async function deleteService(formData: FormData) {
	const session = await requirePermission("service:delete")
	const id = String(formData.get("id") ?? "").trim()
	if (!id) return
	await prisma.service.delete({ where: { id } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "service.delete", entity: "Service", entityId: id },
	})
	revalidatePath("/services")
	revalidatePath("/dashboard/services")
	redirect("/dashboard/services")
}
