import { describe, it, expect } from "vitest"
import { contactSchema, projectRequestSchema } from "@/lib/validators"

describe("contactSchema", () => {
	it("ورودی معتبر را می‌پذیرد", () => {
		const result = contactSchema.safeParse({
			name: "علی رضایی",
			email: "ali@example.com",
			phone: "09123456789",
			message: "سلام، درخواست همکاری دارم.",
			website: "",
		})
		expect(result.success).toBe(true)
	})

	it("ایمیل نامعتبر را رد می‌کند", () => {
		const result = contactSchema.safeParse({
			name: "علی",
			email: "not-an-email",
			message: "متن پیام طولانی‌تر از حد مجاز.",
		})
		expect(result.success).toBe(false)
	})

	it("پر‌شدن honeypot را رد می‌کند", () => {
		const result = contactSchema.safeParse({
			name: "ربات",
			email: "bot@spam.com",
			message: "پیام اسپم",
			website: "http://spam.link",
		})
		expect(result.success).toBe(false)
	})
})

describe("projectRequestSchema", () => {
	it("شماره تماس ایرانی معتبر را می‌پذیرد", () => {
		const result = projectRequestSchema.safeParse({
			name: "شرکت نمونه",
			email: "info@company.com",
			phone: "09999571001",
			projectType: "corporate-website",
			budget: "50-100",
			description: "نیاز به یک وب‌سایت شرکتی حرفه‌ای داریم.",
			website: "",
		})
		expect(result.success).toBe(true)
	})

	it("شماره تماس نامعتبر را رد می‌کند", () => {
		const result = projectRequestSchema.safeParse({
			name: "تست",
			email: "info@company.com",
			phone: "12345",
			projectType: "corporate-website",
			description: "توضیحات کافی برای پروژه.",
		})
		expect(result.success).toBe(false)
	})
})
