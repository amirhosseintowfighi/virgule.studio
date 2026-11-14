import { clsx } from "clsx"
import { Reveal, RevealLines } from "@/components/ui/reveal"
import { Composition } from "@/components/ui/art"
import { faIndex } from "@/lib/fa"

/**
 * سرصفحه‌ی بخش — مثل سرصفحه‌ی کتاب: یک خطِ مرکبی، شماره‌ی شنگرفی و نام بخش.
 * تنها عنصرِ تکرارشونده‌ی صفحه؛ چیدمانِ زیرش در هر بخش فرق می‌کند.
 */
export function Folio({
	n,
	label,
	aside,
	className,
}: {
	n?: number
	label: string
	aside?: React.ReactNode
	className?: string
}) {
	return (
		<div className={clsx("folio", className)}>
			<span className="flex items-baseline">
				{n != null && <span className="numeral folio__n">{faIndex(n)}</span>}
				<span>{label}</span>
			</span>
			{aside && <span className="text-[var(--fg-3)]">{aside}</span>}
		</div>
	)
}

/**
 * سرصفحه‌ی صفحه‌های داخلی. یک الگو برای همه‌ی مسیرها تا ورود به هر صفحه
 * هم‌ریتم بماند: نام صفحه، تیترِ بزرگ در راست، توضیح در ستونِ چپ.
 */
export function PageHead({
	label,
	lines,
	lead,
	art,
	children,
}: {
	/** نام کوتاهِ صفحه در سرصفحه */
	label: string
	/** خطوط عنوان — شکستن سطر عمدی است */
	lines: React.ReactNode[]
	lead?: React.ReactNode
	/** کدام ترکیبِ برداری کنار عنوان بنشیند — هر صفحه یکی، تا صفحه‌ها از هم بازشناخته شوند */
	art?: number
	children?: React.ReactNode
}) {
	return (
		<header className="wrap pb-[clamp(56px,7vw,112px)] pt-[clamp(120px,13vw,190px)]">
			<Folio label={label} aside="ویرگول" />
			<div className="g12 mt-[clamp(40px,6vw,96px)] items-end">
				<h1 className="h1 md:col-span-8">
					<RevealLines lines={lines} />
				</h1>
				<div className="md:col-span-4 md:col-start-9 md:pb-3">
					{art != null && (
						<Reveal as="art-rv" className="mb-[clamp(20px,2.4vw,36px)] hidden md:block">
							<Composition variant={art} shift={art} className="max-w-[240px]" />
						</Reveal>
					)}
					{(lead || children) && (
						<Reveal delay={260}>
							{lead && <p className="lead">{lead}</p>}
							{children}
						</Reveal>
					)}
				</div>
			</div>
		</header>
	)
}
