/**
 * جلدِ ساخته‌شده برای پروژه‌هایی که هنوز تصویر واقعی ندارند.
 *
 * به‌جای یک کادر خالی با دو حرف، از داده‌ی واقعی خود پروژه یک ترکیب‌بندی
 * تایپوگرافیک می‌سازد: نام کارفرما، دسته، سال. هندسه از نشانِ برند می‌آید
 * (کمانِ ویرگول و خطِ قلم)، و چیدمانش با hash اسلاگ تغییر می‌کند تا هیچ دو
 * پروژه‌ای شبیه هم نباشد.
 *
 * سرور-رندر و کاملاً قطعی است: همان اسلاگ همیشه همان جلد را می‌دهد، پس
 * hydration mismatch ندارد. به محض اینکه coverImage واقعی اضافه شود، این
 * کامپوننت اصلاً رندر نمی‌شود.
 */

/** hash ساده و پایدار — فقط برای انتخاب یکی از چند حالتِ چیدمان. */
function hash(s: string) {
	let h = 0
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
	return h
}

export function ProjectCover({
	title,
	client,
	category,
	year,
	wide,
}: {
	title: string
	client?: string | null
	category?: string | null
	year?: number | null
	wide?: boolean
}) {
	const h = hash(title)
	// چهار متغیر مستقل: چرخش کمان، جای تابش، اریبی خط، و اندازه‌ی کمان
	const rot = (h % 40) - 20
	const gx = 18 + (h % 5) * 14
	const gy = 22 + ((h >> 3) % 4) * 16
	const lean = ((h >> 5) % 30) - 15
	const arc = 0.52 + ((h >> 7) % 4) * 0.07

	const label = client ?? title

	return (
		<div className="relative h-full w-full overflow-hidden bg-[var(--bg-2)]">
			{/* تابش گرم، جایش با پروژه فرق می‌کند */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background: `radial-gradient(48% 48% at ${gx}% ${gy}%, rgba(201,171,114,.17), transparent 68%),
						radial-gradient(40% 40% at ${100 - gx}% ${100 - gy}%, rgba(120,70,170,.10), transparent 72%)`,
				}}
			/>

			{/* شبکه‌ی مویی — بافتِ کاغذ نقشه، نه تزئین */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[.5]"
				style={{
					backgroundImage:
						"linear-gradient(to right, rgba(242,239,233,.032) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,239,233,.032) 1px, transparent 1px)",
					backgroundSize: "56px 56px",
				}}
			/>

			{/* هندسه‌ی نشان: کمان و خطِ قلم */}
			<svg
				aria-hidden="true"
				viewBox="0 0 400 300"
				preserveAspectRatio="xMidYMid slice"
				className="absolute inset-0 h-full w-full"
				style={{ transform: `rotate(${rot / 6}deg)` }}
			>
				<circle
					cx={200 + lean * 2}
					cy={150}
					r={150 * arc}
					fill="none"
					stroke="var(--accent)"
					strokeOpacity=".22"
					strokeWidth=".7"
				/>
				<circle
					cx={200 + lean * 2}
					cy={150}
					r={150 * arc * 1.55}
					fill="none"
					stroke="var(--accent)"
					strokeOpacity=".1"
					strokeWidth=".7"
				/>
				<line
					x1={340 + lean}
					y1="-20"
					x2={60 + lean}
					y2="320"
					stroke="var(--accent)"
					strokeOpacity=".16"
					strokeWidth=".7"
				/>
			</svg>

			{/* محتوا */}
			<div className="relative flex h-full flex-col justify-between p-[clamp(20px,3.2vw,48px)]">
				<div className="flex items-start justify-between gap-6">
					{category && <span className="meta-fa">{category}</span>}
					{year && <span className="meta">{year}</span>}
				</div>

				<div>
					<span
						className="block font-medium leading-[1.05] text-[var(--fg)]"
						style={{ fontSize: wide ? "clamp(2rem,5vw,4.6rem)" : "clamp(1.7rem,4vw,3.2rem)" }}
					>
						{label}
					</span>
					<span className="meta mt-4 block">Case study</span>
				</div>
			</div>
		</div>
	)
}
