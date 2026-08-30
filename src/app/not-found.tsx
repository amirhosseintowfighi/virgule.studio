import Link from "next/link"
import { MarkBackdrop } from "@/components/fx/mark-backdrop"

export default function NotFound() {
	return (
		<div className="site stage stage--l relative flex min-h-screen flex-col justify-center px-[var(--pad)]">
			<MarkBackdrop className="pointer-events-none absolute left-[-14%] top-1/2 hidden h-[min(70vh,640px)] w-[min(70vh,640px)] -translate-y-1/2 opacity-70 md:block" />

			<div className="relative z-10">
				<span className="meta font-latin mb-8 block">Error 404</span>
				<h1 className="display sheen in max-w-[12ch]">صفحه پیدا نشد</h1>
				<p className="lead mt-10 max-w-[44ch]">
					صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا جابه‌جا شده است. شاید از اینجا شروع کنید:
				</p>
				<div className="mt-12 flex flex-wrap gap-4">
					<Link href="/" className="btn btn--solid">
						بازگشت به خانه
					</Link>
					<Link href="/portfolio" className="btn">
						دیدن نمونه‌کارها
					</Link>
					<Link href="/contact" className="btn">
						تماس با ما
					</Link>
				</div>
			</div>
		</div>
	)
}
