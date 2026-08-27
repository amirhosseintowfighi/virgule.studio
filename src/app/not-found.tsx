import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
			<div className="font-latin text-8xl font-extrabold text-[var(--color-primary)]">404</div>
			<h1 className="mt-4 text-2xl font-bold">صفحه پیدا نشد</h1>
			<p className="mt-2 max-w-md text-[var(--color-muted)]">
				صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا حذف شده است.
			</p>
			<div className="mt-6">
				<Button href="/">بازگشت به خانه</Button>
			</div>
		</div>
	)
}
