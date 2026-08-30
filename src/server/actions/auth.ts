"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { authenticate, createSession, destroySession } from "@/lib/auth"
import { loginSchema } from "@/lib/validators"
import { rateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/security"
import prisma from "@/lib/prisma"

export type ActionState = { error?: string; success?: boolean }

/** ورود کاربر (برای استفاده با useActionState). */
export async function loginAction(
	_prev: ActionState,
	formData: FormData
): Promise<ActionState> {
	// مسیر واقعی ورود همین اکشن است؛ بدون سقف تلاش، رمز عبور قابل حدس‌زدن است.
	const ip = getClientIp(await headers())
	if (!rateLimit(`login-action:${ip}`, 8, 5 * 60_000).success) {
		return { error: "تلاش‌های ناموفق زیاد بود. چند دقیقه بعد دوباره امتحان کنید." }
	}

	const parsed = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	})
	if (!parsed.success) {
		return { error: "ایمیل یا رمز عبور نامعتبر است." }
	}
	const result = await authenticate(parsed.data.email, parsed.data.password)
	if (!result) return { error: "ایمیل یا رمز عبور اشتباه است." }

	await createSession(result.payload)
	await prisma.activityLog.create({
		data: { userId: result.user.id, action: "login", entity: "User", entityId: result.user.id },
	})
	redirect("/dashboard")
}

/** خروج کاربر. */
export async function logoutAction() {
	await destroySession()
	redirect("/login")
}
