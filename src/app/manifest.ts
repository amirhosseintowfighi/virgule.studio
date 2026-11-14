import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "ویرگول — استودیوی طراحی و توسعه‌ی وب",
		short_name: "ویرگول",
		description: "استودیوی طراحی و توسعه‌ی وب در تهران — مکثی که دیده می‌شود.",
		start_url: "/",
		display: "standalone",
		background_color: "#f3f1ec",
		theme_color: "#f3f1ec",
		lang: "fa",
		dir: "rtl",
		// فقط همان آیکنی که واقعاً وجود دارد (src/app/icon.svg)؛ مسیرهای PNG قبلی ۴۰۴ می‌دادند
		icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],

	}
}
