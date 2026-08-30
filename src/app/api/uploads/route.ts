import { NextRequest } from "next/server"
import { requirePermission } from "@/lib/rbac"
import { saveUpload } from "@/lib/uploads"

/**
 * آپلود تصویر از پنل.
 *
 * چرا route handler و نه server action؟ چون این فیلد داخل فرمِ ویرایش رندر
 * می‌شود و اگر آپلود یک server action باشد، React آن اکشن را به همان فرم
 * گره می‌زند و بعد از اولین آپلود، submit خودِ فرم دیگر اجرا نمی‌شود —
 * یعنی کاربر تصویر را آپلود می‌کند ولی ذخیره‌ی پروژه بی‌صدا کار نمی‌کند.
 * یک endpoint مستقل این گره را باز می‌کند.
 */
export async function POST(req: NextRequest) {
	try {
		await requirePermission("project:write")
	} catch {
		return Response.json({ error: "دسترسی ندارید." }, { status: 403 })
	}

	// درخواست باید از خود سایت آمده باشد. کوکی نشست SameSite=lax است، ولی
	// این یک لایه‌ی صریح‌تر است و به هدرِ قابل‌جعلِ کلاینت تکیه نمی‌کند.
	const origin = req.headers.get("origin")
	if (origin && new URL(origin).host !== req.headers.get("host")) {
		return Response.json({ error: "درخواست نامعتبر است." }, { status: 403 })
	}

	const form = await req.formData().catch(() => null)
	const file = form?.get("file")
	if (!(file instanceof File)) {
		return Response.json({ error: "فایلی انتخاب نشده است." }, { status: 400 })
	}

	// نوشتن روی دیسک می‌تواند شکست بخورد (مجوز، فضای پر). بدون این try، خطا
	// به صفحه‌ی خطای HTML تبدیل می‌شد و کلاینت هنگام res.json() فقط
	// «Unexpected end of JSON input» می‌دید — که هیچ چیزی درباره‌ی علت نمی‌گوید.
	try {
		const res = await saveUpload(file)
		return res.ok
			? Response.json({ url: res.url })
			: Response.json({ error: res.error }, { status: 400 })
	} catch (e) {
		console.error("[upload] failed:", e)
		const code = (e as NodeJS.ErrnoException)?.code
		const hint =
			code === "EACCES" || code === "EPERM"
				? "سرور اجازه‌ی نوشتن در پوشه‌ی آپلود را ندارد."
				: code === "ENOSPC"
					? "فضای دیسک سرور پر است."
					: "ذخیره‌ی فایل روی سرور شکست خورد."
		return Response.json({ error: hint }, { status: 500 })
	}
}
