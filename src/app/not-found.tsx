import { Composition } from "@/components/ui/art"
import { Cta, More } from "@/components/ui/cta"
import { Folio } from "@/components/ui/section"

export default function NotFound() {
	return (
		<div className="site">
			<main className="wrap relative flex min-h-screen flex-col justify-center py-24">
				<Composition variant={4} className="pointer-events-none absolute left-[var(--pad)] top-[10%] !w-[min(44vw,460px)]" />

				<div className="relative">
					<Folio label="خطای ۴۰۴" aside="ویرگول" />
					<h1 className="display mt-[clamp(40px,6vw,88px)] max-w-[10ch]">این صفحه پیدا نشد</h1>
					<p className="lead mt-10 max-w-[44ch]">
						صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابه‌جا شده است. از یکی از این‌ها ادامه بدهید:
					</p>
					<div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
						<Cta href="/" solid>
							بازگشت به خانه
						</Cta>
						<More href="/portfolio">نمونه‌کارها</More>
						<More href="/contact">تماس با ما</More>
					</div>
				</div>
			</main>
		</div>
	)
}
