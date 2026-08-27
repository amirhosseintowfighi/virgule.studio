import { NextRequest } from "next/server"
import { authenticate, createSession } from "@/lib/auth"
import { loginSchema } from "@/lib/validators"
import { rateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/security"
import { ok, fail, handleError } from "@/lib/api"

export async function POST(req: NextRequest) {
	try {
		const ip = getClientIp(req.headers)
		const rl = rateLimit(`login:${ip}`, 5, 60_000)
		if (!rl.success) return fail("تلاش‌های زیاد. کمی بعد تلاش کنید.", 429)

		const body = await req.json()
		const { email, password } = loginSchema.parse(body)
		const result = await authenticate(email, password)
		if (!result) return fail("ایمیل یا رمز عبور اشتباه است.", 401)

		await createSession(result.payload)
		return ok({ email: result.payload.email, role: result.payload.role })
	} catch (e) {
		return handleError(e)
	}
}
