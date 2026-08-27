"use client"

import { useTransition } from "react"
import { deletePost } from "@/server/actions/posts"

export function DeletePostButton({ id }: { id: string }) {
	const [pending, start] = useTransition()

	return (
		<button
			disabled={pending}
			onClick={() => {
				if (confirm("این مقاله حذف شود؟")) start(async () => {
						await deletePost(id)
					})
			}}
			className="text-[var(--color-error)] disabled:opacity-50"
		>
			{pending ? "..." : "حذف"}
		</button>
	)
}
