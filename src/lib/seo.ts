import type { Metadata } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://virgule.studio"

type SeoInput = {
	title: string
	description: string
	path?: string
	image?: string
	type?: "website" | "article"
	publishedTime?: string
	noIndex?: boolean
}

// سازنده‌ی متادیتای یکپارچه برای همه‌ی صفحات
export function buildMetadata({
	title,
	description,
	path = "",
	image,
	type = "website",
	publishedTime,
	noIndex,
}: SeoInput): Metadata {
	const url = `${BASE}${path}`
	return {
		title,
		description,
		alternates: { canonical: url },
		robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
		openGraph: {
			title,
			description,
			url,
			type,
			locale: "fa_IR",
			siteName: "ویرگول",
			...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
			...(publishedTime ? { publishedTime } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(image ? { images: [image] } : {}),
		},
	}
}

// داده‌ی ساختاریافته‌ی سازمان (JSON-LD)
export function organizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "ویرگول",
		url: BASE,
		email: "info@virgule.studio",
		telephone: "09999571001",
		logo: `${BASE}/icon-512.png`,
	}
}
