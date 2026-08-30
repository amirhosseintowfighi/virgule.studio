import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { buildSecurityHeaders } from "@/lib/security"

const PROTECTED = "/dashboard"
const AUTH_PAGES = ["/login", "/forgot-password", "/reset-password"]

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl
	const token = req.cookies.get("virgule_session")?.value
	const session = token ? await verifyToken(token) : null

	// محافظت از پنل مدیریت
	if (pathname.startsWith(PROTECTED) && !session) {
		const url = req.nextUrl.clone()
		url.pathname = "/login"
		url.searchParams.set("redirect", pathname)
		return NextResponse.redirect(url)
	}

	// کاربر واردشده نباید صفحه‌ی ورود را ببیند
	if (AUTH_PAGES.includes(pathname) && session) {
		const url = req.nextUrl.clone()
		url.pathname = "/dashboard"
		return NextResponse.redirect(url)
	}

	// اعمال هدرهای امنیتی.
	// پروتکل را از هدر پراکسی می‌خوانیم؛ پشت nginx، خودِ درخواستِ داخلی http است.
	const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "")
	const secure = proto === "https"

	const res = NextResponse.next()
	for (const [k, v] of Object.entries(buildSecurityHeaders(secure))) res.headers.set(k, v)
	return res
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
}
