import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { SiteFx } from "@/components/fx/site-fx"

// ponytail: صفحات از دیتابیس می‌خوانند، پس در زمان بیلد پیش‌رندر نمی‌شوند (بیلد داکر به DB دسترسی ندارد).
// اگر ترافیک بالا رفت، به‌جای این خط روی هر صفحه `export const revalidate = 60` بگذار.
export const dynamic = "force-dynamic"

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<SiteFx />
			<Navbar />
			<main>{children}</main>
			<Footer />
		</>
	)
}
