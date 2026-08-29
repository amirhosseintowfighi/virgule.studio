import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = { title: "ورود به پنل" }

export default function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-2)] px-4">
			<div className="w-full max-w-sm border-[length:var(--bw-2)] border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--elev-2)]">
				<div className="mb-6 text-center">
					<div className="font-extrabold">
						<span className="font-latin text-[var(--color-primary)]">Virgule</span> پنل مدیریت
					</div>
					<p className="mt-1 text-sm text-[var(--color-muted)]">برای ورود اطلاعات خود را وارد کنید</p>
				</div>
				<LoginForm />
			</div>
		</div>
	)
}
