import { mkdir, writeFile } from "fs/promises"
import { randomBytes } from "crypto"
import path from "path"

/**
 * آپلود تصویر روی خودِ سرور.
 *
 * چرا نه public/؟ چون در بیلد داکر، public داخل ایمیج پخته می‌شود و هر بار که
 * ایمیج دوباره ساخته شود فایل‌های آپلودشده از بین می‌روند. این پوشه یک volume
 * جداست و از چرخه‌ی بیلد بیرون می‌ماند.
 */
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads")

/** ۵ مگابایت — یک اسکرین‌شات وب هیچ‌وقت به این نمی‌رسد. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

/**
 * نوع فایل را از روی بایت‌های ابتدایی تشخیص می‌دهد، نه از پسوند یا هدر
 * Content-Type — هر دوی آن‌ها را کلاینت می‌نویسد و می‌شود جعلشان کرد.
 */
function sniff(buf: Uint8Array): { ext: string; mime: string } | null {
	const b = (i: number) => buf[i]
	// JPEG: FF D8 FF
	if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return { ext: "jpg", mime: "image/jpeg" }
	// PNG: 89 50 4E 47 0D 0A 1A 0A
	if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return { ext: "png", mime: "image/png" }
	// GIF: "GIF8"
	if (b(0) === 0x47 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x38) return { ext: "gif", mime: "image/gif" }
	// WEBP: "RIFF" .... "WEBP"
	if (
		b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46 &&
		b(8) === 0x57 && b(9) === 0x45 && b(10) === 0x42 && b(11) === 0x50
	) {
		return { ext: "webp", mime: "image/webp" }
	}
	// SVG عمداً پذیرفته نمی‌شود: می‌تواند اسکریپت داشته باشد و از همان دامنه اجرا شود.
	return null
}

export type UploadResult = { ok: true; url: string } | { ok: false; error: string }

/** فایل را ذخیره می‌کند و نشانی عمومی‌اش را برمی‌گرداند. */
export async function saveUpload(file: File): Promise<UploadResult> {
	if (file.size === 0) return { ok: false, error: "فایلی انتخاب نشده است." }
	if (file.size > MAX_UPLOAD_BYTES) {
		return { ok: false, error: `حجم فایل بیشتر از ${MAX_UPLOAD_BYTES / 1024 / 1024} مگابایت است.` }
	}

	const bytes = new Uint8Array(await file.arrayBuffer())
	const kind = sniff(bytes)
	if (!kind) return { ok: false, error: "فقط JPEG، PNG، WebP و GIF پذیرفته می‌شود." }

	// نام فایل کاملاً از سمت ما ساخته می‌شود؛ نام ارسالی کاربر هیچ‌جا استفاده
	// نمی‌شود تا راهی برای پیمایش مسیر یا بازنویسی فایل باقی نماند.
	const name = `${Date.now().toString(36)}-${randomBytes(8).toString("hex")}.${kind.ext}`

	await mkdir(UPLOAD_DIR, { recursive: true })
	await writeFile(path.join(UPLOAD_DIR, name), bytes)

	return { ok: true, url: `/api/uploads/${name}` }
}

/** فقط نام‌هایی که خودمان ساخته‌ایم؛ هر چیز دیگری رد می‌شود. */
export const SAFE_NAME = /^[a-z0-9]+-[a-f0-9]{16}\.(jpg|png|gif|webp)$/

export const MIME_BY_EXT: Record<string, string> = {
	jpg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
	webp: "image/webp",
}
