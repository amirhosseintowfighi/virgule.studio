import type { Metadata } from "next"
import { vazirmatn, inter } from "@/lib/fonts"
import { ThemeProvider } from "@/components/providers/theme-provider"
import "@/styles/globals.css"

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://virgule.studio"),
	title: {
		default: "ویرگول | استودیوی طراحی و توسعه‌ی وب",
		template: "%s | ویرگول",
	},
	description:
		"ویرگول؛ مکثی که دیده می‌شود. طراحی و پیاده‌سازی وب‌سایت‌های حرفه‌ای با بالاترین کیفیت.",
	openGraph: {
		type: "website",
		locale: "fa_IR",
		siteName: "ویرگول",
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable}`}>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
