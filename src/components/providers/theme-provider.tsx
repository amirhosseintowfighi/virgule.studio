"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "light" | "dark"
type Ctx = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<Ctx | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light")

	useEffect(() => {
		const saved = (localStorage.getItem("theme") as Theme | null) ?? null
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
		const initial = saved ?? (prefersDark ? "dark" : "light")
		setTheme(initial)
		document.documentElement.setAttribute("data-theme", initial)
	}, [])

	const toggle = useCallback(() => {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark"
			document.documentElement.setAttribute("data-theme", next)
			localStorage.setItem("theme", next)
			return next
		})
	}, [])

	const value: Ctx = { theme, toggle }
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
	return ctx
}
