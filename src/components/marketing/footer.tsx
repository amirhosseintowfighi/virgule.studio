import Link from "next/link"
import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { LogoMark } from "@/components/ui/marks"
import { STUDIO } from "@/lib/seo"
import { faNum } from "@/lib/fa"

const studioLinks = [
	{ href: "/portfolio", label: "نمونه‌کارها" },
	{ href: "/services", label: "خدمات" },
	{ href: "/about", label: "درباره‌ی ما" },
	{ href: "/blog", label: "یادداشت‌ها" },
	{ href: "/faq", label: "پرسش‌های متداول" },
	{ href: "/contact", label: "تماس" },
]

const legalLinks = [
	{ href: "/legal/privacy", label: "حریم خصوصی" },
	{ href: "/legal/terms", label: "قوانین و مقررات" },
]

/** پانوشتِ سایت — ادامه‌ی همان نوارِ مرکبیِ پایانِ صفحه. */
export async function Footer() {
	// ستون خدمات از دیتابیس می‌آید؛ اسلاگِ ثابت در کد یعنی لینک شکسته به‌محض
	// اینکه مدیر خدمتی را غیرفعال کند یا اسلاگش را عوض کند.
	const services = await safe(
		prisma.service.findMany({
			where: { active: true },
			orderBy: { order: "asc" },
			take: 6,
			select: { slug: true, title: true },
		}),
		[]
	)

	const year = new Intl.DateTimeFormat("fa-IR-u-nu-latn", { year: "numeric" }).format(new Date())

	return (
		<footer className="ink relative">
			<div className="wrap pb-10 pt-[clamp(56px,7vw,104px)]">
				<div className="g12 border-t border-[var(--line-2)] pt-10">
					<div className="md:col-span-4">
						<div className="flex items-center gap-3">
							<LogoMark className="h-9 w-9" />
							<span className="serif text-[1.9rem] leading-none">ویرگول</span>
						</div>
						<p className="h3 mt-6 max-w-[18ch]">{`${STUDIO.tagline}.`}</p>
						<p className="body-t mt-4 max-w-[34ch] text-[.94rem]">
							{`استودیوی طراحی و توسعه‌ی وب در ${STUDIO.city}، از سال ${STUDIO.foundedFa}.`}
						</p>
					</div>

					{services.length > 0 && (
						<nav aria-label="خدمات" className="md:col-span-3 md:col-start-6">
							<h2 className="meta-fa mb-5">خدمات</h2>
							<ul className="flex flex-col gap-2.5">
								{services.map((s) => (
									<li key={s.slug}>
										<Link href={`/services/${s.slug}`} className="link-u tap text-[.94rem]">
											{s.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					)}

					<nav aria-label="استودیو" className="md:col-span-2">
						<h2 className="meta-fa mb-5">استودیو</h2>
						<ul className="flex flex-col gap-2.5">
							{studioLinks.map((l) => (
								<li key={l.href}>
									<Link href={l.href} className="link-u tap text-[.94rem]">
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="md:col-span-2">
						<h2 className="meta-fa mb-5">تماس</h2>
						<ul className="flex flex-col gap-2.5 text-[.94rem]">
							<li>
								<a href={`mailto:${STUDIO.email}`} className="link-u tap font-latin" dir="ltr">
									{STUDIO.email}
								</a>
							</li>
							<li>
								<a href={`tel:${STUDIO.phone}`} className="link-u tap num" dir="ltr">
									{faNum(STUDIO.phoneDisplay)}
								</a>
							</li>
							<li className="text-[var(--fg-2)]">{`${STUDIO.city}، ایران`}</li>
						</ul>
					</div>

					{/* گره محصولِ خودِ استودیوست — یک سطر، نه یک بنر */}
					<p className="meta-fa md:col-span-12 md:mt-10">
						زیرساخت ابری، سرور و دامنه:{" "}
						<a href="https://gereh.net" target="_blank" rel="noopener noreferrer" className="link-u tap text-[var(--fg)]">
							گره (gereh.net)
						</a>
						{" "}— محصول و زیرمجموعه‌ی استودیو ویرگول.
					</p>
				</div>

				<div className="mt-[clamp(48px,6vw,88px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-3 border-t border-[var(--line)] pt-6">
					<span className="meta-fa">
						{`© ${faNum(year)} ${STUDIO.legalName}. تمامی حقوق محفوظ است.`}
					</span>
					<ul className="flex gap-8">
						{legalLinks.map((l) => (
							<li key={l.href}>
								<Link href={l.href} className="link-u tap meta-fa">
									{l.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	)
}
