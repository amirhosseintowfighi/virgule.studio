import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "قوانین و مقررات",
	description: "قوانین و مقررات استفاده از خدمات ویرگول.",
}

export default function TermsPage() {
	return (
		<section className="mx-auto max-w-[72ch] px-[var(--pad)] pb-[var(--sec)] pt-[clamp(110px,15vw,180px)]">
				<h1 className="h1">قوانین و مقررات</h1>
				<p className="meta-fa mt-5">آخرین به‌روزرسانی: ۱۴۰۴</p>
				<div className="mt-14 space-y-8">
					<p className="body-t">با استفاده از وب‌سایت و خدمات ویرگول، شما موافقت خود را با شرایط زیر اعلام می‌کنید.</p>
					<div>
						<h2 className="h3 mb-3">۱. خدمات</h2>
						<p className="body-t">ویرگول خدمات طراحی، توسعه، سئو و پشتیبانی وب را مطابق با قرارداد اختصاصی هر پروژه ارائه می‌دهد.</p>
					</div>
					<div>
						<h2 className="h3 mb-3">۲. مالکیت معنوی</h2>
						<p className="body-t">پس از تسویه‌ی کامل، مالکیت کد و خروجی نهایی پروژه به طور کامل به کارفرما منتقل می‌شود.</p>
					</div>
					<div>
						<h2 className="h3 mb-3">۳. پرداخت و تسویه</h2>
						<p className="body-t">شرایط پرداخت در قرارداد هر پروژه به صورت شفاف مشخص می‌شود و هیچ هزینه‌ی پنهانی وجود ندارد.</p>
					</div>
					<div>
						<h2 className="h3 mb-3">۴. پشتیبانی</h2>
						<p className="body-t">هر پروژه شامل دوره‌ی پشتیبانی مشخص است و ادامه‌ی آن با توافق طرفین ممکن است.</p>
					</div>
				</div>
		</section>
	)
}
