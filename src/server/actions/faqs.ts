"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"

function str(v: FormDataEntryValue | null): string {
	return String(v ?? "").trim()
}

/** ایجاد یا ویرایش پرسش متداول. */
export async function saveFaq(formData: FormData) {
	// پرسش‌های متداول بخشی از محتوای سایت‌اند، پس همان دسترسی محتوا را می‌خواهند
	const session = await requirePermission("setting:manage")
	const id = str(formData.get("id"))
	const question = str(formData.get("question"))
	const answer = str(formData.get("answer"))
	if (!question || !answer) return

	const data = {
		question,
		answer,
		category: str(formData.get("category")) || null,
		order: Number(formData.get("order") ?? 0) || 0,
	}

	const saved = id
		? await prisma.faq.update({ where: { id }, data })
		: await prisma.faq.create({ data })

	await prisma.activityLog.create({
		data: {
			userId: session.userId,
			action: id ? "faq.update" : "faq.create",
			entity: "Faq",
			entityId: saved.id,
		},
	})

	revalidatePath("/faq")
	revalidatePath("/")
	revalidatePath("/dashboard/faqs")
	redirect("/dashboard/faqs")
}

/** حذف پرسش متداول. */
export async function deleteFaq(formData: FormData) {
	const session = await requirePermission("setting:manage")
	const id = str(formData.get("id"))
	if (!id) return
	await prisma.faq.delete({ where: { id } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "faq.delete", entity: "Faq", entityId: id },
	})
	revalidatePath("/faq")
	revalidatePath("/")
	revalidatePath("/dashboard/faqs")
	redirect("/dashboard/faqs")
}
