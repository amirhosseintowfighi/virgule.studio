"use server"

import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { contactSchema, projectRequestSchema, newsletterSchema } from "@/lib/validators"
import { rateLimit } from "@/lib/rate-limit"
import { getClientIp, looksLikeSpam, sanitizeText } from "@/lib/security"
import { FormType } from "@prisma/client"

export type FormState = { error?: string; success?: boolean; message?: string }

async function guard(scope: string) {
	const h = await headers()
	const ip = getClientIp(h)
	const rl = rateLimit(`${scope}:${ip}`, 5, 60_000)
	if (!rl.success) throw new Error("تعداد درخواست‌ها زیاد است. کمی بعد تلاش کنید.")
	return { ip, userAgent: h.get("user-agent") ?? "" }
}

/** فرم تماس. */
export async function submitContact(_p: FormState, fd: FormData): Promise<FormState> {
	try {
		const { ip, userAgent } = await guard("contact")
		const raw = Object.fromEntries(fd) as Record<string, string>
		const parsed = contactSchema.safeParse(raw)
		if (!parsed.success) return { error: "لطفاً فیلدها را به درستی پر کنید." }

		const isSpam = looksLikeSpam(parsed.data)
		await prisma.formSubmission.create({
			data: {
				type: FormType.CONTACT,
				payload: {
					name: sanitizeText(parsed.data.name),
					email: parsed.data.email,
					phone: parsed.data.phone ?? "",
					message: sanitizeText(parsed.data.message),
				},
				ip, userAgent, isSpam,
			},
		})
		return { success: true, message: "پیام شما دریافت شد. به‌زودی تماس می‌گیریم." }
	} catch (e) {
		return { error: e instanceof Error ? e.message : "خطا در ثبت فرم." }
	}
}

/** فرم درخواست پروژه. */
export async function submitProjectRequest(_p: FormState, fd: FormData): Promise<FormState> {
	try {
		const { ip, userAgent } = await guard("project")
		const raw = Object.fromEntries(fd) as Record<string, string>
		const parsed = projectRequestSchema.safeParse(raw)
		if (!parsed.success) return { error: "لطفاً فیلدها را به درستی پر کنید." }

		await prisma.formSubmission.create({
			data: {
				type: FormType.PROJECT,
				payload: { ...parsed.data, name: sanitizeText(parsed.data.name), description: sanitizeText(parsed.data.description) },
				ip, userAgent, isSpam: looksLikeSpam(parsed.data),
			},
		})
		return { success: true, message: "درخواست پروژه‌ی شما ثبت شد." }
	} catch (e) {
		return { error: e instanceof Error ? e.message : "خطا در ثبت درخواست." }
	}
}

/** عضویت در خبرنامه. */
export async function subscribeNewsletter(_p: FormState, fd: FormData): Promise<FormState> {
	try {
		await guard("newsletter")
		const parsed = newsletterSchema.safeParse(Object.fromEntries(fd))
		if (!parsed.success) return { error: "ایمیل معتبر نیست." }
		if (parsed.data.website) return { success: true, message: "عضویت ثبت شد." } // honeypot

		await prisma.newsletterSubscriber.upsert({
			where: { email: parsed.data.email },
			update: {},
			create: { email: parsed.data.email, token: crypto.randomUUID() },
		})
		return { success: true, message: "عضویت شما در خبرنامه ثبت شد." }
	} catch (e) {
		return { error: e instanceof Error ? e.message : "خطا در عضویت." }
	}
}
