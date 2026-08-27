import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { PostEditor } from "@/components/admin/post-editor"

type Props = { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
	await requirePermission("post:write")
	const { id } = await params
	const isNew = id === "new"

	const [post, categories, tags] = await Promise.all([
		isNew ? null : prisma.post.findUnique({ where: { id }, include: { tags: true } }),
		prisma.category.findMany({ orderBy: { name: "asc" } }),
		prisma.tag.findMany({ orderBy: { name: "asc" } }),
	])

	if (!isNew && !post) notFound()

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<h1 className="text-2xl font-extrabold">
				{isNew ? "مقاله‌ی جدید" : "ویرایش مقاله"}
			</h1>
			<PostEditor post={post} categories={categories} tags={tags} />
		</div>
	)
}
