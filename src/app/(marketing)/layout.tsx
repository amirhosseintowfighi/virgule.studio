import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"

// ponytail: صفحات از دیتابیس می‌خوانند، پس در زمان بیلد پیش‌رندر نمی‌شوند (بیلد داکر به DB دسترسی ندارد).
// اگر ترافیک بالا رفت، به‌جای این خط روی هر صفحه `export const revalidate = 60` بگذار.
export const dynamic = "force-dynamic"

/**
 * پوسته‌ی سایت عمومی. کلاس `site` محیطِ «کاغذ، مرکب، شنگرف» را قفل می‌کند —
 * یک محیط واحد برای کل تجربه‌ی عمومی. پنل مدیریت روشن/تاریک خودش را دارد.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="site min-h-screen">
			<a href="#main" className="skip-link">
				رفتن به محتوای اصلی
			</a>
			<Navbar />
			<main id="main">{children}</main>
			<Footer />
		</div>
	)
}
