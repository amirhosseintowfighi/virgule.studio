import { Inter, Vazirmatn } from "next/font/google"

export const vazirmatn = Vazirmatn({
	subsets: ["arabic", "latin"],
	variable: "--font-vazirmatn",
	display: "swap",
})

export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
})
