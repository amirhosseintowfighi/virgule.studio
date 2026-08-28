import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "حریم خصوصی",
	description: "سیاست حفظ حریم خصوصی ویرگول.",
}

export default function PrivacyPage() {
	return (
		<section className="mx-auto max-w-[72ch] px-[var(--pad)] pb-[var(--sec)] pt-[clamp(110px,15vw,180px)]">
				<h1 className="h1">حریم خصوصی</h1>
				<p className="meta-fa mt-5">آخرین به‌روزرسانی: ۱۴۰۴</p>
				<div className="mt-14 space-y-8">
					<p className="body-t">حفظ حریم خصوصی شما برای ویرگول بسیار مهم است. این صفحه توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌کنیم و چگونه از آن محافظت می‌کنیم.</p>
					<div>
						<h2 className="h3 mb-3">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
						<p className="body-t">تنها اطلاعاتی که شما از طریق فرم‌های تماس و درخواست پروژه در اختیار ما قرار می‌دهید (نام، ایمیل، شماره تماس و توضیحات پروژه).</p>
					</div>
					<div>
						<h2 className="h3 mb-3">۲. نحوه‌ی استفاده</h2>
						<p className="body-t">از این اطلاعات فقط برای پاسخ‌گویی به درخواست شما و ارائه‌ی خدمات استفاده می‌کنیم و آن را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم.</p>
					</div>
					<div>
						<h2 className="h3 mb-3">۳. امنیت داده‌ها</h2>
						<p className="body-t">داده‌های شما روی بستری امن نگهداری می‌شود و دسترسی به آن محدود و کنترل‌شده است.</p>
					</div>
					<div>
						<h2 className="h3 mb-3">۴. تماس با ما</h2>
						<p className="body-t">برای هر پرسش درباره‌ی حریم خصوصی می‌توانید با <span className="font-latin">info@virgule.studio</span> در تماس باشید.</p>
					</div>
				</div>
		</section>
	)
}
