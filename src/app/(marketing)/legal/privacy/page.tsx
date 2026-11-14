import { LegalPage } from "@/components/marketing/legal-page"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
	title: "حریم خصوصی",
	description: "سیاست حفظ حریم خصوصی ویرگول.",
	path: "/legal/privacy",
})

export default function PrivacyPage() {
	return (
		<LegalPage
			title="حریم خصوصی"
			updated="۱۴۰۴"
			intro="حفظ حریم خصوصی شما برای ویرگول بسیار مهم است. این صفحه توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌کنیم و چگونه از آن محافظت می‌کنیم."
			sections={[
				{
					t: "۱. اطلاعاتی که جمع‌آوری می‌کنیم",
					d: "تنها اطلاعاتی که شما از طریق فرم‌های تماس و درخواست پروژه در اختیار ما قرار می‌دهید (نام، ایمیل، شماره تماس و توضیحات پروژه).",
				},
				{
					t: "۲. نحوه‌ی استفاده",
					d: "از این اطلاعات فقط برای پاسخ‌گویی به درخواست شما و ارائه‌ی خدمات استفاده می‌کنیم و آن را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم.",
				},
				{
					t: "۳. امنیت داده‌ها",
					d: "داده‌های شما روی بستری امن نگهداری می‌شود و دسترسی به آن محدود و کنترل‌شده است.",
				},
				{
					t: "۴. تماس با ما",
					d: (
						<>
							برای هر پرسش درباره‌ی حریم خصوصی می‌توانید با{" "}
							<a href="mailto:info@virgule.studio" className="link-a tap-inline font-latin" dir="ltr">
								info@virgule.studio
							</a>{" "}
							در تماس باشید.
						</>
					),
				},
			]}
		/>
	)
}
