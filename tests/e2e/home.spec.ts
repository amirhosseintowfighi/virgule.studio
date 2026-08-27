import { test, expect } from "@playwright/test"

// تست‌های E2E صفحات عمومی
test("صفحه‌ی خانه بارگذاری می‌شود و شعار را نشان می‌دهد", async ({ page }) => {
	await page.goto("/")
	await expect(page.getByRole("heading", { level: 1 })).toContainText("ویرگول")
})

test("ناوبری به صفحه‌ی تماس کار می‌کند", async ({ page }) => {
	await page.goto("/")
	await page.getByRole("link", { name: "تماس" }).first().click()
	await expect(page).toHaveURL(/.*contact/)
})

test("صفحه‌ی ناموجود ۴۰۴ نشان می‌دهد", async ({ page }) => {
	const res = await page.goto("/this-page-does-not-exist")
	expect(res?.status()).toBe(404)
})
