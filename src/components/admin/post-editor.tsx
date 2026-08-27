"use client"

import { useFormStatus } from "react-dom"
import { savePost } from "@/server/actions/posts"

type Category = { id: string; name: string }
type Tag = { id: string; name: string }
type Post = {
	id: string
	title: string
	slug: string
	excerpt: string | null
	content: string
	status: string
	categoryId: string | null
} | null

const inputCls =
	"w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"

function SubmitButton() {
	const { pending } = useFormStatus()
	return (
		<button
			type="submit"
			disabled={pending}
			className="rounded-[var(--radius-full)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
		>
			{pending ? "در حال ذخیره..." : "ذخیره"}
		</button>
	)
}

export function PostEditor({
	post,
	categories,
}: {
	post: Post
	categories: Category[]
	tags: Tag[]
}) {
	return (
		<form action={savePost} className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
			{post && <input type="hidden" name="id" value={post.id} />}

			<div>
				<label className="mb-1 block text-sm font-medium">عنوان</label>
				<input name="title" required defaultValue={post?.title} className={inputCls} />
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">نامک (slug)</label>
				<input name="slug" required defaultValue={post?.slug} className={`${inputCls} font-latin`} />
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">دسته</label>
				<select name="categoryId" defaultValue={post?.categoryId ?? ""} className={inputCls}>
					<option value="">— بدون دسته —</option>
					{categories.map((c) => (
						<option key={c.id} value={c.id}>{c.name}</option>
					))}
				</select>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">خلاصه</label>
				<textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={inputCls} />
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">محتوا</label>
				<textarea name="content" rows={10} required defaultValue={post?.content} className={inputCls} />
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">وضعیت</label>
				<select name="status" defaultValue={post?.status ?? "DRAFT"} className={inputCls}>
					<option value="DRAFT">پیش‌نویس</option>
					<option value="PUBLISHED">منتشرشده</option>
					<option value="SCHEDULED">زمان‌بندی‌شده</option>
				</select>
			</div>

			<SubmitButton />
		</form>
	)
}
