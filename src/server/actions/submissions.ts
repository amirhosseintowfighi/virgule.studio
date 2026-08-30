"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"

function id(formData: FormData) {
	return String(formData.get("id") ?? "").trim()
}

/** خوانده‌شده / خوانده‌نشده. */
export async function toggleSubmissionRead(formData: FormData) {
	await requirePermission("form:read")
	const sid = id(formData)
	if (!sid) return
	const row = await prisma.formSubmission.findUnique({ where: { id: sid }, select: { read: true } })
	if (!row) return
	await prisma.formSubmission.update({ where: { id: sid }, data: { read: !row.read } })
	revalidatePath("/dashboard/submissions")
	revalidatePath("/dashboard")
}

/** علامت‌زدن به‌عنوان اسپم یا برگرداندن از اسپم. */
export async function toggleSubmissionSpam(formData: FormData) {
	await requirePermission("form:read")
	const sid = id(formData)
	if (!sid) return
	const row = await prisma.formSubmission.findUnique({ where: { id: sid }, select: { isSpam: true } })
	if (!row) return
	await prisma.formSubmission.update({ where: { id: sid }, data: { isSpam: !row.isSpam } })
	revalidatePath("/dashboard/submissions")
	revalidatePath("/dashboard")
}

/** حذف پیام. */
export async function deleteSubmission(formData: FormData) {
	const session = await requirePermission("form:read")
	const sid = id(formData)
	if (!sid) return
	await prisma.formSubmission.delete({ where: { id: sid } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "submission.delete", entity: "FormSubmission", entityId: sid },
	})
	revalidatePath("/dashboard/submissions")
	revalidatePath("/dashboard")
}
