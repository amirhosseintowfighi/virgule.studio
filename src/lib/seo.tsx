import type { Metadata } from "next"

export const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://virgule.studio"

/** یک منبع واحد برای اطلاعات کسب‌وکار — هم در متادیتا، هم در JSON-LD، هم در llms.txt. */
export const STUDIO = {
	name: "ویرگول",
	legalName: "استودیو ویرگول",
	altName: "Virgule Studio",
	tagline: "مکثی که دیده می‌شود",
	email: "info@virgule.studio",
	phone: "+989999571001",
	phoneDisplay: "0999 957 1001",
	city: "تهران",
	country: "IR",
	founded: "2021",
	language: "fa-IR",
} as const

type SeoInput = {
	title: string
	description: string
	path?: string
	image?: string
	type?: "website" | "article"
	publishedTime?: string
	modifiedTime?: string
	authors?: string[]
	noIndex?: boolean
	/** عنوان کامل است و نباید قالب «%s | ویرگول» به آن اضافه شود */
	absoluteTitle?: boolean
}

// سازنده‌ی متادیتای یکپارچه برای همه‌ی صفحات
export function buildMetadata({
	title,
	description,
	path = "",
	image,
	type = "website",
	publishedTime,
	modifiedTime,
	authors,
	noIndex,
	absoluteTitle,
}: SeoInput): Metadata {
	const url = `${BASE}${path}`
	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		alternates: { canonical: url },
		robots: noIndex
			? { index: false, follow: false }
			: {
					index: true,
					follow: true,
					// به گوگل اجازه‌ی نمایش کامل اسنیپت، تصویر و ویدئو را می‌دهد
					googleBot: {
						index: true,
						follow: true,
						"max-snippet": -1,
						"max-image-preview": "large",
						"max-video-preview": -1,
					},
				},
		openGraph: {
			title,
			description,
			url,
			type,
			locale: "fa_IR",
			siteName: STUDIO.name,
			...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
			...(publishedTime ? { publishedTime } : {}),
			...(modifiedTime ? { modifiedTime } : {}),
			...(authors ? { authors } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(image ? { images: [image] } : {}),
		},
	}
}

/**
 * داده‌ی ساختاریافته‌ی سازمان.
 * ProfessionalService زیرمجموعه‌ی LocalBusiness است و برای استودیوی خدماتی
 * دقیق‌تر از Organization خالی است — گوگل از آن برای نتایج محلی استفاده می‌کند.
 */
export function organizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": `${BASE}/#studio`,
		name: STUDIO.name,
		legalName: STUDIO.legalName,
		alternateName: STUDIO.altName,
		slogan: STUDIO.tagline,
		url: BASE,
		email: STUDIO.email,
		telephone: STUDIO.phone,
		foundingDate: STUDIO.founded,
		image: `${BASE}/opengraph-image`,
		logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png`, width: 512, height: 512 },
		description:
			"استودیوی طراحی و توسعه‌ی وب در تهران. طراحی سایت اختصاصی، فروشگاه اینترنتی و اپلیکیشن وب با Next.js.",
		address: { "@type": "PostalAddress", addressLocality: STUDIO.city, addressCountry: STUDIO.country },
		areaServed: { "@type": "Country", name: "Iran" },
		availableLanguage: ["fa", "en"],
		knowsAbout: [
			"طراحی سایت",
			"طراحی وب‌سایت شرکتی",
			"فروشگاه اینترنتی",
			"طراحی رابط کاربری",
			"سئو",
			"Next.js",
			"React",
			"TypeScript",
		],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "sales",
			email: STUDIO.email,
			telephone: STUDIO.phone,
			availableLanguage: ["Persian", "English"],
		},
	}
}

/** WebSite — به گوگل می‌گوید نام سایت و زبانش چیست. */
export function webSiteJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${BASE}/#website`,
		name: STUDIO.name,
		alternateName: STUDIO.altName,
		url: BASE,
		inLanguage: STUDIO.language,
		publisher: { "@id": `${BASE}/#studio` },
	}
}

/** مسیر راهنما — در نتایج گوگل به‌جای URL خام نمایش داده می‌شود. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [{ name: "خانه", path: "" }, ...trail].map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: `${BASE}${item.path}`,
		})),
	}
}

/** سوالات متداول — واجد شرایط نمایش آکاردئونی در نتایج گوگل. */
export function faqJsonLd(items: { q: string; a: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: { "@type": "Answer", text: f.a },
		})),
	}
}

/** یک خدمت مشخص. */
export function serviceJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name,
		description,
		url: `${BASE}${path}`,
		provider: { "@id": `${BASE}/#studio` },
		areaServed: { "@type": "Country", name: "Iran" },
		serviceType: "طراحی و توسعه‌ی وب",
	}
}

/** مقاله‌ی بلاگ. */
export function articleJsonLd({
	title,
	description,
	path,
	published,
	modified,
	author,
	image,
}: {
	title: string
	description?: string | null
	path: string
	published?: Date | string | null
	modified?: Date | string | null
	author?: string | null
	image?: string | null
}) {
	const url = `${BASE}${path}`
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		...(description ? { description } : {}),
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		url,
		inLanguage: STUDIO.language,
		...(published ? { datePublished: new Date(published).toISOString() } : {}),
		...(modified ? { dateModified: new Date(modified).toISOString() } : {}),
		author: author ? { "@type": "Person", name: author } : { "@id": `${BASE}/#studio` },
		publisher: { "@id": `${BASE}/#studio` },
		...(image ? { image: [image] } : {}),
	}
}

/** یک نمونه‌کار. */
export function projectJsonLd({
	title,
	description,
	path,
	image,
	year,
}: {
	title: string
	description?: string | null
	path: string
	image?: string | null
	year?: number | string | null
}) {
	return {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: title,
		...(description ? { description } : {}),
		url: `${BASE}${path}`,
		inLanguage: STUDIO.language,
		creator: { "@id": `${BASE}/#studio` },
		...(year ? { dateCreated: String(year) } : {}),
		...(image ? { image: [image] } : {}),
	}
}

/** کامپوننت کمکی برای تزریق JSON-LD. */
export function JsonLd({ data }: { data: object | object[] }) {
	return (
		<script
			type="application/ld+json"
			// داده‌ی ما است، نه ورودی کاربر؛ ولی برای جلوگیری از بسته‌شدن زودهنگام تگ، `<` را فرار می‌دهیم.
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
		/>
	)
}
