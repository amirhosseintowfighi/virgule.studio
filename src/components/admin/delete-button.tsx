"use client"

type Props = {
	action: (formData: FormData) => void | Promise<void>
	id: string
	label?: string
	confirmText?: string
}

export function DeleteButton({
	action,
	id,
	label = "حذف",
	confirmText = "آیا از حذف این مورد مطمئن هستید؟ این عمل قابل بازگشت نیست.",
}: Props) {
	return (
		<form
			action={action}
			onSubmit={(e) => {
				if (!confirm(confirmText)) e.preventDefault()
			}}
			className="inline"
		>
			<input type="hidden" name="id" value={id} />
			<button
				type="submit"
				className="text-sm text-[var(--color-error)] transition-opacity hover:opacity-70"
			>
				{label}
			</button>
		</form>
	)
}
