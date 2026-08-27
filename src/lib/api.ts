import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { AuthError } from "./rbac"

// پاسخ‌های استاندارد API
export const ok = <T>(data: T, init?: ResponseInit) =>
	NextResponse.json({ success: true, data }, init)

export const fail = (message: string, status = 400, extra?: unknown) =>
	NextResponse.json({ success: false, error: message, extra }, { status })

/** تبدیل خطاها به پاسخ HTTP مناسب. */
export function handleError(e: unknown): NextResponse {
	if (e instanceof ZodError) {
		return fail("داده‌ی ورودی نامعتبر است.", 422, e.flatten().fieldErrors)
	}
	if (e instanceof AuthError) {
		return fail(e.message, e.status)
	}
	console.error(e)
	return fail("خطای داخلی سرور.", 500)
}
