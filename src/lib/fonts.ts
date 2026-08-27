import localFont from "next/font/local"
import { Inter } from "next/font/google"

/** IRANYekanWeb — همان فونت طرح اصلی، self-hosted از public/fonts. */
export const iranYekan = localFont({
	src: [
		{ path: "../../public/fonts/iranyekanwebregular.woff", weight: "400", style: "normal" },
		{ path: "../../public/fonts/iranyekanwebmedium.woff", weight: "500", style: "normal" },
		{ path: "../../public/fonts/iranyekanwebbold.woff", weight: "700", style: "normal" },
	],
	variable: "--font-iranyekan",
	display: "swap",
})

export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
})
