"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { postSchema } from "@/lib/validators"
import { requirePermission } from "@/lib/rbac"
import { PostStatus } from "@prisma/client"

function readingTimeOf(text: string) {
	return Math.max(1, Math.round(text.length / 900))
}

/** ایجاد یا به‌روزرسانی مقاله (فقط با مجوز). */
export async function upsertPost(input: unknown, id?: string) {
	const session = await requirePermission("post:write")
	const data = postSchema.parse(input)

	const payload = {
		title: data.title,
		slug: data.slug,
		excerpt: data.excerpt,
		content: data.content,
		featuredImage: data.featuredImage || null,
		status: data.status as PostStatus,
		readingTime: readingTimeOf(data.content),
		categoryId: data.categoryId || null,
		publishedAt:
			data.status === "PUBLISHED" ? new Date() : data.publishedAt ? new Date(data.publishedAt) : null,
	}
	const tagIds = data.tagIds?.map((t) => ({ id: t }))

	const post = id
		? await prisma.post.update({ where: { id }, data: { ...payload, tags: tagIds && { set: tagIds } } })
		: await prisma.post.create({ data: { ...payload, authorId: session.userId, tags: tagIds && { connect: tagIds } } })

	await prisma.activityLog.create({
		data: { userId: session.userId, action: id ? "post.update" : "post.create", entity: "Post", entityId: post.id },
	})
	revalidatePath("/blog")
	revalidatePath("/dashboard/posts")
	return post
}

/** حذف مقاله. */
export async function deletePost(id: string) {
	const session = await requirePermission("post:delete")
	await prisma.post.delete({ where: { id } })
	await prisma.activityLog.create({
		data: { userId: session.userId, action: "post.delete", entity: "Post", entityId: id },
	})
	revalidatePath("/dashboard/posts")
	return { success: true }
}

/** ذخیره‌ی مقاله از فرم پنل (هم‌الگو با saveService/saveProject). */
export async function savePost(formData: FormData) {
	const id = String(formData.get("id") ?? "").trim()
	const str = (k: string) => {
		const v = String(formData.get(k) ?? "").trim()
		return v.length ? v : undefined
	}
	await upsertPost(
		{
			title: str("title"),
			slug: str("slug"),
			excerpt: str("excerpt"),
			content: str("content"),
			featuredImage: str("featuredImage"),
			status: str("status") ?? "DRAFT",
			categoryId: str("categoryId"),
		},
		id || undefined
	)
	redirect("/dashboard/posts")
}
