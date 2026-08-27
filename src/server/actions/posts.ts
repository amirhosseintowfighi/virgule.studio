"use server"

import { revalidatePath } from "next/cache"
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
		tags: data.tagIds ? { set: data.tagIds.map((t) => ({ id: t })) } : undefined,
	}

	const post = id
		? await prisma.post.update({ where: { id }, data: payload })
		: await prisma.post.create({ data: { ...payload, authorId: session.userId } })

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
