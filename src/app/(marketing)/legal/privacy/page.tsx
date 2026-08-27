import type { Metadata } from "next"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
	title: "حریم خصوصی",
	description: "سیاست حفظ حریم خصوصی ویرگول.",
}

export default function PrivacyPage() {
	return (
		<section className="py-14 md:py-20">
			<Container className="max-w-3xl">
				<h1 className="text-3xl font-extrabold md:text-4xl">حریم خصوصی</h1>
				<p className="mt-3 text-sm text-[var(--color-muted)]">آخرین به‌روزرسانی: ۱۴۰۴</p>
				<div className="mt-8 space-y-6 leading-8 text-[var(--color-muted)]">
					<p>حفظ حریم خصوصی شما برای ویرگول بسیار مهم است. این صفحه توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌کنیم و چگونه از آن محافظت می‌کنیم.</p>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
						<p>تنها اطلاعاتی که شما از طریق فرم‌های تماس و درخواست پروژه در اختیار ما قرار می‌دهید (نام، ایمیل، شماره تماس و توضیحات پروژه).</p>
					</div>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۲. نحوه‌ی استفاده</h2>
						<p>از این اطلاعات فقط برای پاسخ‌گویی به درخواست شما و ارائه‌ی خدمات استفاده می‌کنیم و آن را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم.</p>
					</div>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۳. امنیت داده‌ها</h2>
						<p>داده‌های شما روی بستری امن نگهداری می‌شود و دسترسی به آن محدود و کنترل‌شده است.</p>
					</div>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۴. تماس با ما</h2>
						<p>برای هر پرسش درباره‌ی حریم خصوصی می‌توانید با <span className="font-latin">info@virgule.studio</span> در تماس باشید.</p>
					</div>
				</div>
			</Container>
		</section>
	)
}
