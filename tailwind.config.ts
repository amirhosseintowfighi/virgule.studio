import type { Config } from "tailwindcss"

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-iranyekan)", "var(--font-inter)", "sans-serif"],
				latin: ["var(--font-inter)", "sans-serif"],
			},
			maxWidth: {
				container: "var(--container)",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
}

export default config
