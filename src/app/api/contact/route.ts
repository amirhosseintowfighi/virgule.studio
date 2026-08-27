import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { contactSchema } from "@/lib/validators"
import { rateLimit } from "@/lib/rate-limit"
import { getClientIp, looksLikeSpam, sanitizeText } from "@/lib/security"
import { ok, fail, handleError } from "@/lib/api"
import { FormType } from "@prisma/client"

// POST /api/contact — ثبت فرم تماس (عمومی + ضداسپم)
export async function POST(req: NextRequest) {
	try {
		const ip = getClientIp(req.headers)
		const rl = rateLimit(`contact:${ip}`, 5, 60_000)
		if (!rl.success) return fail("تعداد درخواست‌ها زیاد است.", 429)

		const data = contactSchema.parse(await req.json())
		await prisma.formSubmission.create({
			data: {
				type: FormType.CONTACT,
				payload: {
					name: sanitizeText(data.name),
					email: data.email,
					phone: data.phone ?? "",
					message: sanitizeText(data.message),
				},
				ip,
				userAgent: req.headers.get("user-agent") ?? "",
				isSpam: looksLikeSpam(data),
			},
		})
		return ok({ received: true }, { status: 201 })
	} catch (e) {
		return handleError(e)
	}
}
