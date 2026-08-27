import { PostStatus, FormType } from "@prisma/client"

export function statusLabel(status: PostStatus): string {
	const map: Record<PostStatus, string> = {
		DRAFT: "پیش‌نویس",
		SCHEDULED: "زمان‌بندی‌شده",
		PUBLISHED: "منتشرشده",
	}
	return map[status] ?? status
}

export function formTypeLabel(type: FormType): string {
	const map: Record<FormType, string> = {
		CONTACT: "تماس",
		PROJECT: "درخواست پروژه",
		NEWSLETTER: "خبرنامه",
	}
	return map[type] ?? type
}
