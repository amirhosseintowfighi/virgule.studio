import { describe, it, expect } from "vitest"
import { hashPassword, verifyPassword } from "@/lib/auth"

describe("password hashing", () => {
	it("رمز هش‌شده با متن اصلی مطابقت دارد", async () => {
		const hash = await hashPassword("Virgule@1404")
		expect(hash).not.toBe("Virgule@1404")
		expect(await verifyPassword("Virgule@1404", hash)).toBe(true)
	})

	it("رمز اشتباه را رد می‌کند", async () => {
		const hash = await hashPassword("correct-password")
		expect(await verifyPassword("wrong-password", hash)).toBe(false)
	})
})
