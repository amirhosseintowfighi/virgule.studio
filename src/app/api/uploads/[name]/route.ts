import { NextRequest } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"
import { UPLOAD_DIR, SAFE_NAME, MIME_BY_EXT } from "@/lib/uploads"

/**
 * سرو کردن فایل‌های آپلودشده.
 *
 * از public/ سرو نمی‌شوند چون آن پوشه داخل ایمیج داکر پخته می‌شود و Next فقط
 * فایل‌هایی را که هنگام بیلد آنجا بوده‌اند می‌شناسد. اینجا از volume خوانده
 * می‌شود، پس آپلودها از بیلد بعدی جان سالم به در می‌برند.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
	const { name } = await params

	// فقط الگوی نامی که خودمان می‌سازیم. این تنها چیزی است که جلوی
	// «..%2F..%2Fetc%2Fpasswd» و هم‌خانواده‌هایش را می‌گیرد.
	if (!SAFE_NAME.test(name)) return new Response("Not found", { status: 404 })

	const file = path.join(UPLOAD_DIR, name)
	try {
		const info = await stat(file)
		if (!info.isFile()) return new Response("Not found", { status: 404 })
		const data = await readFile(file)
		const ext = name.split(".").pop() ?? ""
		return new Response(new Uint8Array(data), {
			headers: {
				"Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
				// نام فایل شامل hash است، پس محتوایش هیچ‌وقت عوض نمی‌شود
				"Cache-Control": "public, max-age=31536000, immutable",
				"Content-Length": String(info.size),
				"X-Content-Type-Options": "nosniff",
			},
		})
	} catch {
		return new Response("Not found", { status: 404 })
	}
}
