import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { SiteFx } from "@/components/fx/site-fx"

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
