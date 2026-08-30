import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { postSchema } from "@/lib/validators"
import { requirePermission } from "@/lib/rbac"
import { ok, handleError } from "@/lib/api"
import { PostStatus } from "@prisma/client"

// GET /api/posts?page=1&category=slug&q=term  — لیست مقالات منتشرشده
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const page = Math.max(1, Number(searchParams.get("page") ?? 1))
		const take = 9
		const q = searchParams.get("q")?.trim()
		const category = searchParams.get("category")?.trim()

		const where = {
			status: PostStatus.PUBLISHED,
			...(category ? { category: { slug: category } } : {}),
			...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { excerpt: { contains: q, mode: "insensitive" as const } }] } : {}),
		}

		const [items, total] = await Promise.all([
			prisma.post.findMany({
				where,
				include: { author: { select: { name: true } }, category: true, tags: true },
				orderBy: { publishedAt: "desc" },
				skip: (page - 1) * take,
				take,
			}),
			prisma.post.count({ where }),
		])

		return ok({ items, total, page, pages: Math.ceil(total / take) })
	} catch (e) {
		return handleError(e)
	}
}

// POST /api/posts — ایجاد مقاله (نیازمند مجوز)
export async function POST(req: NextRequest) {
	try {
		const session = await requirePermission("post:write")
		const data = postSchema.parse(await req.json())
		const post = await prisma.post.create({
			data: {
				title: data.title,
				slug: data.slug,
				excerpt: data.excerpt,
				content: data.content,
				status: data.status as PostStatus,
				categoryId: data.categoryId || null,
				authorId: session.userId,
				publishedAt: data.status === "PUBLISHED" ? new Date() : null,
			},
		})
		return ok(post, { status: 201 })
	} catch (e) {
		return handleError(e)
	}
}
