import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/ui/logo"

export function Footer() {
	return (
		<footer className="mt-10 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] py-14">
			<Container className="grid gap-10 md:grid-cols-4">
				<div className="md:col-span-1">
					<Logo className="mb-4" />
					<p className="text-sm leading-7 text-[var(--color-muted)]">
						ویرگول؛ مکثی که دیده می‌شود. استودیوی طراحی و توسعه‌ی وب که برند شما را به تجربه‌ای ماندگار تبدیل می‌کند.
					</p>
				</div>
				<div>
					<h4 className="mb-3 font-semibold">خدمات</h4>
					<ul className="space-y-2 text-sm text-[var(--color-muted)]">
						<li><Link href="/services/corporate-website" className="transition-colors hover:text-[var(--color-primary)]">طراحی سایت شرکتی</Link></li>
						<li><Link href="/services/ecommerce" className="transition-colors hover:text-[var(--color-primary)]">فروشگاه اینترنتی</Link></li>
						<li><Link href="/services/ui-ux" className="transition-colors hover:text-[var(--color-primary)]">طراحی UI/UX</Link></li>
						<li><Link href="/services/seo" className="transition-colors hover:text-[var(--color-primary)]">سئو و دیده‌شدن</Link></li>
					</ul>
				</div>
				<div>
					<h4 className="mb-3 font-semibold">دسترسی سریع</h4>
					<ul className="space-y-2 text-sm text-[var(--color-muted)]">
						<li><Link href="/portfolio" className="transition-colors hover:text-[var(--color-primary)]">نمونه‌کارها</Link></li>
						<li><Link href="/blog" className="transition-colors hover:text-[var(--color-primary)]">وبلاگ</Link></li>
						<li><Link href="/faq" className="transition-colors hover:text-[var(--color-primary)]">سوالات متداول</Link></li>
						<li><Link href="/request-project" className="transition-colors hover:text-[var(--color-primary)]">ثبت سفارش</Link></li>
						<li><Link href="/legal/privacy" className="transition-colors hover:text-[var(--color-primary)]">حریم خصوصی</Link></li>
						<li><Link href="/legal/terms" className="transition-colors hover:text-[var(--color-primary)]">قوانین و مقررات</Link></li>
					</ul>
				</div>
				<div>
					<h4 className="mb-3 font-semibold">تماس با ما</h4>
					<ul className="space-y-2 text-sm text-[var(--color-muted)]">
						<li className="font-latin">info@virgule.studio</li>
						<li className="font-latin">09999571001</li>
						<li className="font-latin">virgule.studio</li>
					</ul>
				</div>
			</Container>
			<Container className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-muted)]">
				© {new Date().getFullYear()} ویرگول — تمامی حقوق محفوظ است.
			</Container>
		</footer>
	)
}
