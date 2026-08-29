import Link from "next/link"
import { LogoMark } from "@/components/ui/logo"

const cols = [
	{
		head: "خدمات",
		links: [
			{ href: "/services/corporate-website", label: "طراحی سایت شرکتی" },
			{ href: "/services/ecommerce", label: "فروشگاه اینترنتی" },
			{ href: "/services/ui-ux", label: "طراحی UI/UX" },
			{ href: "/services/seo", label: "سئو و دیده‌شدن" },
		],
	},
	{
		head: "استودیو",
		links: [
			{ href: "/portfolio", label: "نمونه‌کارها" },
			{ href: "/about", label: "درباره‌ی ما" },
			{ href: "/blog", label: "یادداشت‌ها" },
			{ href: "/pricing", label: "تعرفه" },
			{ href: "/faq", label: "سوالات متداول" },
		],
	},
	{
		head: "قانونی",
		links: [
			{ href: "/legal/privacy", label: "حریم خصوصی" },
			{ href: "/legal/terms", label: "قوانین و مقررات" },
		],
	},
]

export function Footer() {
	return (
		<footer className="relative z-[1] border-t-[length:var(--bw-2)] border-[var(--fg)] bg-[var(--bg)] px-[var(--pad)] pb-10 pt-[clamp(56px,8vw,110px)]">
			<div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] md:gap-10">
				<div>
					<LogoMark className="h-10 w-10 text-[var(--fg)]" />
					<p className="body-t mt-6 max-w-[34ch] text-[15px]">ویرگول؛ مکثی که دیده می‌شود.</p>
					<div className="mt-8 flex flex-col gap-2">
						<a href="mailto:info@virgule.studio" className="link-u font-latin w-fit text-sm" dir="ltr">
							info@virgule.studio
						</a>
						<a href="tel:09999571001" className="link-u num w-fit text-sm" dir="ltr">
							0999 957 1001
						</a>
					</div>
				</div>

				{cols.map((c) => (
					<nav key={c.head} aria-label={c.head}>
						<h4 className="mb-5 border-b-[length:var(--bw-2)] border-[var(--fg)] pb-2 text-sm font-bold">
							{c.head}
						</h4>
						<ul className="flex flex-col gap-3">
							{c.links.map((l) => (
								<li key={l.href}>
									<Link href={l.href} className="link-u text-sm">
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>

			<div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-[length:var(--bw-2)] border-[var(--fg)] pt-7">
				<span className="meta-fa">© {new Date().getFullYear()} ویرگول — تمامی حقوق محفوظ است.</span>
				<span className="meta font-latin">Virgule Studio</span>
			</div>
		</footer>
	)
}
