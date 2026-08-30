import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { LogoMark } from "@/components/ui/logo"
import { STUDIO } from "@/lib/seo"

const studioLinks = [
	{ href: "/portfolio", label: "نمونه‌کارها" },
	{ href: "/about", label: "درباره‌ی ما" },
	{ href: "/blog", label: "یادداشت‌ها" },
	{ href: "/faq", label: "پرسش‌های متداول" },
	{ href: "/contact", label: "تماس" },
]

const legalLinks = [
	{ href: "/legal/privacy", label: "حریم خصوصی" },
	{ href: "/legal/terms", label: "قوانین و مقررات" },
]

export async function Footer() {
	// ستون خدمات از دیتابیس می‌آید؛ اسلاگِ ثابت در کد یعنی لینک شکسته به‌محض
	// اینکه مدیر خدمتی را غیرفعال کند یا اسلاگش را عوض کند.
	const services = await safe(
		prisma.service.findMany({
			where: { active: true },
			orderBy: { order: "asc" },
			take: 5,
			select: { slug: true, title: true },
		}),
		[]
	)

	return (
		<footer className="relative z-[1] border-t border-[var(--line)] px-[var(--pad)] pb-12 pt-[clamp(72px,10vw,140px)]">
			<div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] md:gap-10">
				<div>
					<LogoMark className="h-10 w-10 text-[var(--fg)]" />
					{/* در یک عبارت، وگرنه شکستن خطِ JSX قبل از «؛» و «.» فاصله می‌گذارد */}
					<p className="body-t mt-6 max-w-[34ch] text-[15px]">
						{`${STUDIO.tagline}؛ استودیوی طراحی و توسعه‌ی وب در ${STUDIO.city}.`}
					</p>
					<div className="mt-8 flex flex-col gap-2">
						<a href={`mailto:${STUDIO.email}`} className="link-u font-latin w-fit text-sm" dir="ltr">
							{STUDIO.email}
						</a>
						<a href={`tel:${STUDIO.phone}`} className="link-u num w-fit text-sm" dir="ltr">
							{STUDIO.phoneDisplay}
						</a>
					</div>
				</div>

				{services.length > 0 && (
					<nav aria-label="خدمات">
						<h4 className="meta-fa mb-6">خدمات</h4>
						<ul className="flex flex-col gap-3">
							{services.map((s) => (
								<li key={s.slug}>
									<Link href={`/services/${s.slug}`} className="link-u text-sm">
										{s.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				)}

				<nav aria-label="استودیو">
					<h4 className="meta-fa mb-6">استودیو</h4>
					<ul className="flex flex-col gap-3">
						{studioLinks.map((l) => (
							<li key={l.href}>
								<Link href={l.href} className="link-u text-sm">
									{l.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<nav aria-label="قانونی">
					<h4 className="meta-fa mb-6">قانونی</h4>
					<ul className="flex flex-col gap-3">
						{legalLinks.map((l) => (
							<li key={l.href}>
								<Link href={l.href} className="link-u text-sm">
									{l.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
				<span className="meta-fa">
					© {new Date().getFullYear()} {STUDIO.name} — تمامی حقوق محفوظ است.
				</span>
				<span className="meta font-latin">{STUDIO.altName}</span>
			</div>
		</footer>
	)
}
