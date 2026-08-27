import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import prisma from "./prisma"

const SESSION_COOKIE = "virgule_session"
const encoder = new TextEncoder()
const secret = () => encoder.encode(process.env.JWT_SECRET ?? "dev-secret-change-me")
const MAX_AGE = Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24 * 7) // 7d

export type SessionPayload = {
	userId: string
	email: string
	role: string
	permissions: string[]
}

// ---------- Passwords ----------
export const hashPassword = (plain: string) => bcrypt.hash(plain, 12)
export const verifyPassword = (plain: string, hash: string) =>
	bcrypt.compare(plain, hash)

// ---------- JWT ----------
export async function signToken(payload: SessionPayload): Promise<string> {
	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${MAX_AGE}s`)
		.sign(secret())
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
	try {
		const { payload } = await jwtVerify(token, secret())
		return payload as unknown as SessionPayload
	} catch {
		return null
	}
}

// ---------- Session cookie helpers ----------
export async function createSession(payload: SessionPayload) {
	const token = await signToken(payload)
	const store = await cookies()
	store.set(SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: MAX_AGE,
	})
}

export async function destroySession() {
	const store = await cookies()
	store.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<SessionPayload | null> {
	const store = await cookies()
	const token = store.get(SESSION_COOKIE)?.value
	if (!token) return null
	return verifyToken(token)
}

// ---------- Authenticate credentials ----------
export async function authenticate(email: string, password: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		include: { role: { include: { permissions: true } } },
	})
	if (!user || !user.isActive) return null
	const ok = await verifyPassword(password, user.passwordHash)
	if (!ok) return null
	const payload: SessionPayload = {
		userId: user.id,
		email: user.email,
		role: user.role.name,
		permissions: user.role.permissions.map((p) => p.key),
	}
	return { user, payload }
}
