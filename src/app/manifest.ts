import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "ویرگول — استودیوی طراحی و توسعه‌ی وب",
		short_name: "ویرگول",
		description: "استودیوی طراحی و توسعه‌ی وب در تهران — مکثی که دیده می‌شود.",
		start_url: "/",
		display: "standalone",
		background_color: "#0c0a10",
		theme_color: "#0c0a10",
		lang: "fa",
		dir: "rtl",
		icons: [
			{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	}
}
