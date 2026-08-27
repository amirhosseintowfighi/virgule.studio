"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { projectSchema } from "@/lib/validators"

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

/** ایجاد یا ویرایش نمونه‌کار. */
export async function saveProject(formData: FormData) {
	const id = String(formData.get("id") ?? "").trim()
	const session = await requirePermission("project:write")

	const yearRaw = str(formData.get("year"))
	const data = projectSchema.parse({
		title: str(formData.get("title")),
		slug: str(formData.get("slug")),
		client: str(formData.get("client")),
		year: yearRaw ? Number(yearRaw) : null,
		url: str(formData.get("url")) ?? "",
		summary: str(formData.get("summary")),
		content: str(formData.get("content")),
		coverImage: str(formData.get("coverImage")) ?? "",
		technologies: parseList(formData.get("technologies")),
		features: parseList(formData.get("features")),
		featured: formData.get("featured") === "on",
		order: Number(formData.get("order") ?? 0) || 0,
		categoryId: str(formData.get("categoryId")),
	})

	const payload = {
		title: data.title,
		slug: data.slug,
		client: data.client ?? null,
		year: data.year ?? null,
		url: data.url ? data.url : null,
		summary: data.summary ?? null,
		content: data.content ?? null,
		coverImage: data.coverImage ? data.coverImage : null,
		technologies: data.technologies,
		features: data.features,
		featured: data.featured,
		order: data.order,
		categoryId: data.categoryId ?? null,
	}

	const saved = id
		? await prisma.project.update({ where: { id }, data: payload })
		: await prisma.project.create({ data: payload })

	await prisma.activityLog.create({
		data: {
			userId: session.userId,
			action: id ? "project.update" : "project.create",
			entity: "Project",
			entityId: saved.id,
		},
	})

	revalidatePath("/portfolio")
	revalidatePath(`/portfolio/${saved.slug}`)
	revalidatePath("/dashboard/projects")
	redirect("/dashboard/projects")
}

/** حذف نمونه‌کار. */
export async function deleteProject(formData: FormData) {
	const session = await requirePermission("project:delete")
	const id = String(formData.get("id") ?? "").trim()
	if (!id) return
	await prisma.project.delete({ where: { id } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "project.delete", entity: "Project", entityId: id },
	})
	revalidatePath("/portfolio")
	revalidatePath("/dashboard/projects")
	redirect("/dashboard/projects")
}
