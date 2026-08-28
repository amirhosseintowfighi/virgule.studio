import Link from "next/link"

export default function NotFound() {
	return (
		<div className="site flex min-h-screen flex-col justify-center px-[var(--pad)]">
			<span className="meta font-latin mb-8">Error 404</span>
			<h1 className="display max-w-[12ch]">صفحه پیدا نشد</h1>
			<p className="body-t mt-8 max-w-[46ch]">
				صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا جابه‌جا شده است.
			</p>
			<div className="mt-12 flex flex-wrap gap-4">
				<Link href="/" className="btn btn--solid">
					بازگشت به خانه
				</Link>
				<Link href="/portfolio" className="btn">
					دیدن نمونه‌کارها
				</Link>
			</div>
		</div>
	)
}
