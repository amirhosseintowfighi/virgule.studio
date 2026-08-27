"use server"

import { redirect } from "next/navigation"
import { authenticate, createSession, destroySession } from "@/lib/auth"
import { loginSchema } from "@/lib/validators"
import prisma from "@/lib/prisma"

export type ActionState = { error?: string; success?: boolean }

/** ورود کاربر (برای استفاده با useActionState). */
export async function loginAction(
	_prev: ActionState,
	formData: FormData
): Promise<ActionState> {
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
