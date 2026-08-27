import type { NextConfig } from "next"

// هدرهای امنیتی سراسری
const securityHeaders = [
	{ key: "X-DNS-Prefetch-Control", value: "on" },
	{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
	{ key: "X-Frame-Options", value: "SAMEORIGIN" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
	{
		key: "Content-Security-Policy",
		value: [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' https://fonts.gstatic.com",
			"img-src 'self' data: https: blob:",
			"connect-src 'self'",
			"frame-ancestors 'self'",
		].join("; "),
	},
]

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
	},
	experimental: {
		optimizePackageImports: ["@mui/material", "framer-motion"],
	},
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }]
	},
}

export default nextConfig
