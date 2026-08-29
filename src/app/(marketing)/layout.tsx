import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { SiteFx } from "@/components/fx/site-fx"

// ponytail: صفحات از دیتابیس می‌خوانند، پس در زمان بیلد پیش‌رندر نمی‌شوند (بیلد داکر به DB دسترسی ندارد).
// اگر ترافیک بالا رفت، به‌جای این خط روی هر صفحه `export const revalidate = 60` بگذار.
export const dynamic = "force-dynamic"

/**
 * پوسته‌ی سایت عمومی. کلاس `site` محیط تاریک برند را قفل می‌کند —
 * یک محیط واحد برای کل تجربه‌ی عمومی. پنل مدیریت روشن/تاریک خودش را دارد.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="site min-h-screen">
			<a href="#main" className="skip-link">
				رفتن به محتوای اصلی
			</a>
			<SiteFx />
			{/* شبکه‌ی صفحه رسم می‌شود، نه حدس زده — لهجه‌ی ادیتوریال/براتالیستی */}
			<div className="frame" aria-hidden="true">
				<i /><i /><i /><i /><i /><i />
			</div>
			<Navbar />
			<main id="main" className="relative z-[1]">
				{children}
			</main>
			<Footer />
		</div>
	)
}
