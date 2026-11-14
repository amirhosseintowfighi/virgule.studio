import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Folio } from "@/components/ui/section"
import { Cta } from "@/components/ui/cta"
import { Composition } from "@/components/ui/art"
import { STUDIO } from "@/lib/seo"
import { faNum } from "@/lib/fa"

/**
 * پایانِ هر صفحه: یک دعوتِ روشن، روی نوارِ مرکبی که به پانوشت وصل می‌شود.
 * همه‌ی صفحه‌ها همین‌جا تمام می‌شوند، پس مسیرِ بعدیِ بازدیدکننده همیشه یکی است.
 * راه‌های تماس روی یک کارتِ شیشه‌ای‌اند که روی تصویر نشسته.
 */
export function Closing({
	lines,
	lead,
	cta = "ثبت درخواست پروژه",
	href = "/request-project",
	art = 0,
}: {
	lines: React.ReactNode[]
	lead?: React.ReactNode
	cta?: string
	href?: string
	art?: number
}) {
	return (
		<section className="ink overflow-hidden" aria-label="شروع همکاری">
			<div className="wrap pb-[clamp(56px,7vw,104px)] pt-[var(--sec)]">
				<Folio label="شروع همکاری" aside="جلسه‌ی اول رایگان است" />

				<div className="g12 mt-[clamp(40px,6vw,88px)] items-center">
					<div className="md:col-span-6">
						<h2 className="display">
							<RevealLines lines={lines} step={120} />
						</h2>
						{lead && (
							<Reveal delay={200} className="mt-[clamp(24px,2.8vw,40px)]">
								<p className="lead max-w-[44ch] text-[var(--fg-2)]">{lead}</p>
							</Reveal>
						)}
					</div>

					<div className="relative md:col-span-5 md:col-start-8">
						<Reveal as="art-rv">
							<Composition variant={art} shift={art} />
						</Reveal>
						<Reveal delay={300} className="relative -mt-[18%] w-[min(100%,340px)] md:absolute md:-bottom-[6%] md:start-0 md:mt-0">
							<div className="glass p-[clamp(20px,2.2vw,32px)]">
								<Cta href={href} solid className="w-full">
									{cta}
								</Cta>
								<ul className="mt-5 flex flex-col gap-2 border-t border-[var(--line)] pt-5">
									<li>
										<a href={`mailto:${STUDIO.email}`} className="link-u tap h3" dir="ltr">
											{STUDIO.email}
										</a>
									</li>
									<li>
										<a href={`tel:${STUDIO.phone}`} className="link-u tap h3" dir="ltr">
											{faNum(STUDIO.phoneDisplay)}
										</a>
									</li>
								</ul>
							</div>
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	)
}
