import { getSession, type SessionPayload } from "./auth"
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

/** کاربر واردشده را برمی‌گرداند یا خطا می‌دهد. */
export async function requireUser(): Promise<SessionPayload> {
	const session = await getSession()
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
