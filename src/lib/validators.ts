import { z } from "zod"

// اعتبارسنجی شماره‌ی موبایل ایران
const iranPhone = z
	.string()
	.regex(/^09\d{9}$/, "شماره‌ی موبایل معتبر نیست.")

const slug = z
	.string()
	.min(2, "اسلاگ خیلی کوتاه است.")
	.regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف کوچک انگلیسی، عدد و خط تیره.")

// ---------- Auth ----------
export const loginSchema = z.object({
	email: z.string().email("ایمیل معتبر نیست."),
	password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر است."),
})

export const forgotPasswordSchema = z.object({
	email: z.string().email("ایمیل معتبر نیست."),
})

export const resetPasswordSchema = z.object({
	token: z.string().min(10),
	password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر است."),
})

// ---------- Forms ----------
export const contactSchema = z.object({
	name: z.string().min(2, "نام را وارد کنید."),
	email: z.string().email("ایمیل معتبر نیست."),
	phone: iranPhone.optional(),
	message: z.string().min(10, "پیام حداقل ۱۰ کاراکتر باشد."),
	website: z.string().max(0).optional(),
})

export const projectRequestSchema = z.object({
	name: z.string().min(2, "نام را وارد کنید."),
	company: z.string().optional(),
	phone: iranPhone,
	email: z.string().email("ایمیل معتبر نیست."),
	budget: z.string().optional(),
	timeline: z.string().optional(),
	description: z.string().min(10, "توضیحات پروژه را وارد کنید."),
	fileUrl: z.string().url().optional(),
	website: z.string().max(0).optional(),
})

export const newsletterSchema = z.object({
	email: z.string().email("ایمیل معتبر نیست."),
	website: z.string().max(0).optional(),
})

// ---------- Content (Admin) ----------
export const postSchema = z.object({
	title: z.string().min(3, "عنوان را وارد کنید."),
	slug: z.string().min(3).regex(/^[a-z0-9\u0600-\u06FF-]+$/, "اسلاگ نامعتبر است."),
	excerpt: z.string().optional(),
	content: z.string().min(1, "محتوا را وارد کنید."),
	featuredImage: z.string().url().optional().or(z.literal("")),
	status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).default("DRAFT"),
	categoryId: z.string().optional(),
	tagIds: z.array(z.string()).optional(),
	publishedAt: z.string().datetime().optional(),
})

export const commentSchema = z.object({
	postId: z.string(),
	authorName: z.string().min(2, "نام را وارد کنید."),
	authorEmail: z.string().email("ایمیل معتبر نیست."),
	content: z.string().min(3, "دیدگاه کوتاه است."),
	parentId: z.string().optional(),
	website: z.string().max(0).optional(),
})

// ---------- Services ----------
export const serviceSchema = z.object({
	title: z.string().min(2, "عنوان را وارد کنید."),
	slug,
	icon: z.string().optional(),
	summary: z.string().optional(),
	content: z.string().optional(),
	features: z.array(z.string()).default([]),
	order: z.number().int().default(0),
	active: z.boolean().default(true),
})

// ---------- Projects ----------
export const projectSchema = z.object({
	title: z.string().min(2, "عنوان را وارد کنید."),
	slug,
	client: z.string().optional(),
	year: z.number().int().nullable().optional(),
	url: z.string().url("لینک نامعتبر است.").optional().or(z.literal("")),
	summary: z.string().optional(),
	content: z.string().optional(),
	coverImage: z.string().url("لینک تصویر نامعتبر است.").optional().or(z.literal("")),
	technologies: z.array(z.string()).default([]),
	features: z.array(z.string()).default([]),
	featured: z.boolean().default(false),
	order: z.number().int().default(0),
	categoryId: z.string().optional(),
})

// ---------- Users ----------
export const userCreateSchema = z.object({
	name: z.string().min(2, "نام را وارد کنید."),
	email: z.string().email("ایمیل معتبر نیست."),
	password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر."),
	roleId: z.string().min(1, "نقش را انتخاب کنید."),
	isActive: z.boolean().default(true),
})

export const userUpdateSchema = z.object({
	name: z.string().min(2, "نام را وارد کنید."),
	email: z.string().email("ایمیل معتبر نیست."),
	password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر.").optional().or(z.literal("")),
	roleId: z.string().min(1, "نقش را انتخاب کنید."),
	isActive: z.boolean().default(true),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type ProjectRequestInput = z.infer<typeof projectRequestSchema>
export type PostInput = z.infer<typeof postSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type ProjectInput = z.infer<typeof projectSchema>
