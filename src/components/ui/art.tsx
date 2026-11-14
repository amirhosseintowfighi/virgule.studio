import { clsx } from "clsx"

/**
 * تصویرهای برداریِ سایت.
 *
 * همه از یک الفبای کوچک ساخته می‌شوند تا مثل یک خانواده دیده شوند:
 * - اجزای نشانِ ویرگول: دایره، خطِ اُریبِ قلم، و خودِ ویرگول؛
 * - زبانِ ابزارِ قلم در نرم‌افزارِ طراحی: منحنی، گره و دستگیره.
 * سه رنگِ تصویر (شنگرف، آبی، اُخرا) به‌اضافه‌ی مرکب، از توکن‌ها می‌آیند؛ پس روی
 * نوارِ مرکبی خودبه‌خود وارونه می‌شوند.
 *
 * همه سرور-رندرند، جاوااسکریپت ندارند و از صفحه‌خوان پنهان‌اند (تزئینی‌اند).
 * کلاس‌های art__draw و art__fade فقط وقتی حرکت می‌کنند که والد «art-rv» باشد.
 */

const RED = "var(--art-red)"
const BLUE = "var(--art-blue)"
const OCHRE = "var(--art-ochre)"
const SAND = "var(--art-sand)"
const INK = "var(--art-ink)"
const PAPER = "var(--art-paper)"

/** ویرگول فارسی در کادر ۱۰۰×۱۵۰ (سر پایین، دُم رو به بالا-راست). */
const COMMA =
	"M50 140C27 140 10 122 10 98C10 58 38 24 80 4C56 26 44 46 44 61C46 60.300 48 60 50 60C73 60 90 77 90 100C90 122 73 140 50 140Z"

const d = (n: number) => ({ "--d": n }) as React.CSSProperties

/** گره و دستگیره‌ی ابزارِ قلم. */
function Handle({ ax, ay, hx, hy }: { ax: number; ay: number; hx: number; hy: number }) {
	return (
		<g className="art__fade" style={d(6)}>
			<line x1={ax} y1={ay} x2={hx} y2={hy} stroke={INK} strokeWidth="1" />
			<circle cx={hx} cy={hy} r="4" fill={INK} />
			<rect x={ax - 6} y={ay - 6} width="12" height="12" fill={PAPER} stroke={INK} strokeWidth="1.5" />
		</g>
	)
}

/** ترکیبِ بخش معرفی: نشانِ ویرگول، بازشده به اجزایش. */
export function HeroArt({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 600 640" fill="none" className={clsx("art", className)} aria-hidden="true">
			<defs>
				<pattern id="art-dots" width="22" height="22" patternUnits="userSpaceOnUse">
					<circle cx="2" cy="2" r="1.3" fill={INK} opacity=".4" />
				</pattern>
			</defs>

			<rect className="art__fade" style={d(0)} x="14" y="36" width="264" height="264" fill="url(#art-dots)" />
			<rect className="art__fade" style={d(1)} x="318" y="20" width="250" height="250" fill={SAND} />
			<circle className="art__fade" style={d(2)} cx="322" cy="356" r="206" fill={BLUE} />
			{/* ربعِ پایین-چپِ همان دایره */}
			<path className="art__fade" style={d(3)} d="M116 356A206 206 0 0 0 322 562V356Z" fill={RED} />
			<circle className="art__fade" style={d(4)} cx="478" cy="132" r="54" fill={OCHRE} />
			{/* transform روی گروه است: transformِ CSSِ حرکتِ ورود، ویژگیِ transform خودِ عنصر را خنثی می‌کند */}
			<g transform="translate(338 196) scale(1.52)">
				<path className="art__fade" style={d(5)} d={COMMA} fill={PAPER} />
			</g>

			<circle className="art__draw" pathLength={1} cx="322" cy="356" r="248" stroke={INK} strokeWidth="1" />
			{/* خطِ قلم — همان خطِ اُریبِ نشان */}
			<line className="art__draw" pathLength={1} x1="586" y1="26" x2="52" y2="560" stroke={INK} strokeWidth="1.5" />
			<path className="art__draw" pathLength={1} d="M36 604C150 486 404 668 566 548" stroke={INK} strokeWidth="1.5" />
			<Handle ax={36} ay={604} hx={110} hy={528} />
			<Handle ax={566} ay={548} hx={470} hy={620} />
		</svg>
	)
}

/* ---------- ترکیب‌های کوچک‌تر: جلدِ پروژه‌ها و سرصفحه‌ها ---------- */

type Trio = [string, string, string]
const PALETTES: Trio[] = [
	[RED, BLUE, OCHRE],
	[BLUE, OCHRE, RED],
	[OCHRE, RED, BLUE],
]

const COMPOSITIONS: ((c: Trio) => React.ReactNode)[] = [
	// نشان: دایره، ربع، خطِ قلم
	([a, b, c]) => (
		<>
			<circle className="art__fade" style={d(0)} cx="226" cy="168" r="112" fill={b} />
			<path className="art__fade" style={d(1)} d="M114 168A112 112 0 0 0 226 280V168Z" fill={a} />
			<circle className="art__fade" style={d(2)} cx="334" cy="62" r="26" fill={c} />
			<line className="art__draw" pathLength={1} x1="386" y1="8" x2="96" y2="298" stroke={INK} strokeWidth="1.5" />
		</>
	),
	// نیم‌دایره‌های روی‌هم
	([a, b, c]) => (
		<>
			<path className="art__fade" style={d(0)} d="M110 130A90 90 0 0 1 290 130Z" fill={a} />
			<path className="art__fade" style={d(1)} d="M110 220A90 90 0 0 1 290 220Z" fill={b} />
			<rect className="art__fade" style={d(2)} x="290" y="220" width="46" height="46" fill={c} />
			<path className="art__draw" pathLength={1} d="M110 266H336M110 130H290" stroke={INK} strokeWidth="1.5" />
		</>
	),
	// شبکه: چهارخانه‌ها، و منحنی‌ای که از میانشان می‌گذرد
	([a, b, c]) => (
		<>
			<rect className="art__fade" style={d(0)} x="86" y="56" width="92" height="92" fill={SAND} />
			<circle className="art__fade" style={d(1)} cx="232" cy="102" r="46" fill={b} />
			<rect className="art__fade" style={d(2)} x="286" y="56" width="92" height="92" fill={a} />
			<path className="art__fade" style={d(3)} d="M86 248A92 92 0 0 1 178 156V248Z" fill={c} />
			<rect className="art__fade" style={d(4)} x="186" y="156" width="92" height="92" fill={SAND} />
			<path className="art__draw" pathLength={1} d="M60 220C150 60 250 300 400 110" stroke={INK} strokeWidth="1.5" />
			<Handle ax={60} ay={220} hx={104} hy={142} />
		</>
	),
	// کمان‌های هم‌مرکز
	([a, b, c]) => (
		<>
			<circle className="art__fade" style={d(0)} cx="300" cy="96" r="50" fill={a} />
			<rect className="art__fade" style={d(1)} x="72" y="176" width="84" height="84" fill={b} />
			<path
				className="art__draw"
				pathLength={1}
				d="M72 120A140 140 0 0 1 212 260M72 64A196 196 0 0 1 268 260M72 8A252 252 0 0 1 324 260"
				stroke={INK}
				strokeWidth="1.5"
			/>
			<circle className="art__fade" style={d(2)} cx="324" cy="260" r="12" fill={c} />
		</>
	),
	// ویرگول
	([a, b, c]) => (
		<>
			<path className="art__fade" style={d(0)} d="M250 260A76 76 0 0 1 402 260Z" fill={c} />
			{/* transform روی گروه است: transformِ CSSِ حرکتِ ورود، ویژگیِ transform خودِ عنصر را خنثی می‌کند */}
			<g transform="translate(120 40) scale(1.5)">
				<path className="art__fade" style={d(1)} d={COMMA} fill={a} />
			</g>
			<circle className="art__draw" pathLength={1} cx="290" cy="130" r="92" stroke={INK} strokeWidth="1.5" />
			<circle className="art__fade" style={d(2)} cx="290" cy="130" r="22" fill={b} />
		</>
	),
]

export const COMPOSITION_COUNT = COMPOSITIONS.length

/** یکی از ترکیب‌های هندسی، در کادر ۴۰۰×۳۰۰. `variant` شکل را و `shift` چرخشِ رنگ‌ها را تعیین می‌کند. */
export function Composition({
	variant = 0,
	shift = 0,
	className,
	cover,
}: {
	variant?: number
	shift?: number
	className?: string
	/** کادر را پر کند (برای جلد) به‌جای اینکه کامل در آن جا شود */
	cover?: boolean
}) {
	const draw = COMPOSITIONS[variant % COMPOSITIONS.length]
	return (
		<svg
			viewBox="40 0 380 300"
			fill="none"
			preserveAspectRatio={cover ? "xMidYMid slice" : "xMidYMid meet"}
			className={clsx("art", className)}
			aria-hidden="true"
		>
			{draw(PALETTES[shift % PALETTES.length])}
		</svg>
	)
}

/* ---------- نشانه‌های کوچک: یکی برای هر ردیفِ خدمات ---------- */

const GLYPHS: React.ReactNode[] = [
	<>
		<circle cx="36" cy="36" r="20" fill={BLUE} />
		<line x1="58" y1="6" x2="8" y2="56" stroke={INK} strokeWidth="1.5" />
	</>,
	<>
		<rect x="8" y="8" width="32" height="32" fill={SAND} />
		<rect x="24" y="24" width="32" height="32" fill={RED} />
	</>,
	<>
		<path d="M8 50C22 8 42 56 56 14" stroke={INK} strokeWidth="1.5" />
		<rect x="4" y="46" width="8" height="8" fill={PAPER} stroke={INK} strokeWidth="1.5" />
		<circle cx="56" cy="14" r="5" fill={OCHRE} />
	</>,
	<>
		<path d="M8 56A48 48 0 0 1 56 8M8 56A30 30 0 0 1 38 26" stroke={INK} strokeWidth="1.5" />
		<circle cx="14" cy="50" r="8" fill={RED} />
	</>,
	<>
		<circle cx="28" cy="28" r="19" stroke={INK} strokeWidth="1.5" />
		<line x1="42" y1="42" x2="58" y2="58" stroke={INK} strokeWidth="1.5" />
		<circle cx="28" cy="28" r="7" fill={BLUE} />
	</>,
	<>
		<path d="M8 54L30 32M22 54L48 28M36 54L58 32" stroke={INK} strokeWidth="1.5" />
		<circle cx="50" cy="14" r="8" fill={OCHRE} />
	</>,
	<>
		<path d="M32 10A22 22 0 0 1 32 54Z" fill={RED} />
		<circle cx="32" cy="32" r="22" stroke={INK} strokeWidth="1.5" />
	</>,
	<>
		<circle cx="24" cy="30" r="17" fill={SAND} />
		<circle cx="40" cy="36" r="17" stroke={INK} strokeWidth="1.5" />
		<circle cx="32" cy="33" r="4" fill={BLUE} />
	</>,
]

export function Glyph({ i, className }: { i: number; className?: string }) {
	return (
		<svg viewBox="0 0 64 64" fill="none" className={clsx("glyph", className)} aria-hidden="true">
			{GLYPHS[i % GLYPHS.length]}
		</svg>
	)
}
