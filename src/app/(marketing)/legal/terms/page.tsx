import type { Metadata } from "next"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
	title: "قوانین و مقررات",
	description: "قوانین و مقررات استفاده از خدمات ویرگول.",
}

export default function TermsPage() {
	return (
		<section className="py-14 md:py-20">
			<Container className="max-w-3xl">
				<h1 className="text-3xl font-extrabold md:text-4xl">قوانین و مقررات</h1>
				<p className="mt-3 text-sm text-[var(--color-muted)]">آخرین به‌روزرسانی: ۱۴۰۴</p>
				<div className="mt-8 space-y-6 leading-8 text-[var(--color-muted)]">
					<p>با استفاده از وب‌سایت و خدمات ویرگول، شما موافقت خود را با شرایط زیر اعلام می‌کنید.</p>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۱. خدمات</h2>
						<p>ویرگول خدمات طراحی، توسعه، سئو و پشتیبانی وب را مطابق با قرارداد اختصاصی هر پروژه ارائه می‌دهد.</p>
					</div>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۲. مالکیت معنوی</h2>
						<p>پس از تسویه‌ی کامل، مالکیت کد و خروجی نهایی پروژه به طور کامل به کارفرما منتقل می‌شود.</p>
					</div>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۳. پرداخت و تسویه</h2>
						<p>شرایط پرداخت در قرارداد هر پروژه به صورت شفاف مشخص می‌شود و هیچ هزینه‌ی پنهانی وجود ندارد.</p>
					</div>
					<div>
						<h2 className="mb-2 text-xl font-bold text-[var(--color-ink)]">۴. پشتیبانی</h2>
						<p>هر پروژه شامل دوره‌ی پشتیبانی مشخص است و ادامه‌ی آن با توافق طرفین ممکن است.</p>
					</div>
				</div>
			</Container>
		</section>
	)
}
