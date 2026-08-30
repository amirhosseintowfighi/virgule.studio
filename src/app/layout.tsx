import type { Metadata, Viewport } from "next"
import { iranYekan, inter } from "@/lib/fonts"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { BASE, STUDIO, JsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo"
import "@/styles/globals.css"

export const metadata: Metadata = {
	metadataBase: new URL(BASE),
	title: {
		default: "طراحی سایت اختصاصی و توسعه‌ی وب | استودیو ویرگول",
		template: `%s | ${STUDIO.name}`,
	},
	description:
		"ویرگول استودیوی طراحی و توسعه‌ی وب در تهران است. طراحی سایت شرکتی، فروشگاه اینترنتی و اپلیکیشن وب با Next.js — سریع، امن و سئوشده.",
	applicationName: STUDIO.name,
	authors: [{ name: STUDIO.legalName, url: BASE }],
	creator: STUDIO.legalName,
	publisher: STUDIO.legalName,
	category: "طراحی و توسعه‌ی وب",
	alternates: { canonical: BASE },
	formatDetection: { telephone: true, email: true, address: false },
	openGraph: {
		type: "website",
		locale: "fa_IR",
		siteName: STUDIO.name,
		url: BASE,
	},
	twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
	// کاربر باید بتواند زوم کند — محدودکردنش یک نقض دسترس‌پذیری است
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0c0a10" },
	],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		// اسکریپت زیر پیش از هیدریشن کلاس `js` را اضافه می‌کند، پس سرور و کلاینت
		// عمداً یکی نیستند. همان الگوی استاندارد اسکریپت‌های تم است.
		<html
			lang="fa"
			dir="rtl"
			className={`${iranYekan.variable} ${inter.variable}`}
			suppressHydrationWarning
		>
			<head>
				{/* بدون جاوااسکریپت، محتوا نباید پشت انیمیشن‌های ورود پنهان بماند */}
				<script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
			</head>
			<body>
				{/* هویت سازمان و سایت — یک‌بار در ریشه، بقیه‌ی صفحه‌ها به همین @id ارجاع می‌دهند */}
				<JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
