import { redirect } from "next/navigation"
import { getLiveSession, type SessionPayload } from "./auth"
import { FULL_ACCESS_ROLES, SUPER_ADMIN_ROLE } from "./permissions"

export class AuthError extends Error {
	constructor(
		message: string,
		public status = 401
	) {
		super(message)
		this.name = "AuthError"
	}
}

/** آیا نقش کاربر دسترسی کامل دارد؟ (مدیر کل و مدیر) */
export function isFullAccess(session: SessionPayload): boolean {
	return FULL_ACCESS_ROLES.includes(session.role)
}

export function isSuperAdmin(session: SessionPayload): boolean {
	return session.role === SUPER_ADMIN_ROLE
}

/**
 * کاربر واردشده را برمی‌گرداند یا خطا می‌دهد.
 * از getLiveSession استفاده می‌کند تا نقش و وضعیت فعال‌بودن از دیتابیس بیاید،
 * نه از توکنی که ممکن است چند روز پیش صادر شده باشد.
 */
export async function requireUser(): Promise<SessionPayload> {
	const session = await getLiveSession()
	if (!session) throw new AuthError("ابتدا وارد شوید.", 401)
	return session
}

/** بررسی مجوز مشخص. */
export async function requirePermission(permission: string): Promise<SessionPayload> {
	const session = await requireUser()
	if (isFullAccess(session)) return session
	if (!session.permissions.includes(permission)) {
		throw new AuthError("دسترسی کافی ندارید.", 403)
	}
	return session
}

export function hasPermission(session: SessionPayload, permission: string) {
	return isFullAccess(session) || session.permissions.includes(permission)
}

/**
 * نسخه‌ی مخصوص صفحه‌های پنل.
 *
 * requirePermission برای route handlerها خطا پرتاب می‌کند تا به پاسخ ۴۰۱/۴۰۳
 * تبدیل شود؛ ولی داخل یک صفحه، خطای پرتاب‌شده به صفحه‌ی خطای خام Next می‌رسد.
 * اینجا به‌جای خطا، کاربر به صفحه‌ی «دسترسی ندارید» هدایت می‌شود.
 */
export async function requirePermissionPage(permission: string): Promise<SessionPayload> {
	const session = await requireUser().catch(() => null)
	if (!session) redirect("/login?redirect=/dashboard")
	if (!hasPermission(session, permission)) redirect(`/dashboard/no-access?p=${encodeURIComponent(permission)}`)
	return session
}
