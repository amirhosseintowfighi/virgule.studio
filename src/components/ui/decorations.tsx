import { clsx } from "clsx"

/**
 * بلاب‌های گرادیانی محو و متحرک (وکتوری، مینیمال).
 * در یک والد `relative overflow-hidden` قرار بگیرد و محتوا را `relative z-10` کنید.
 */
export function AuroraBlobs({ className }: { className?: string }) {
	return (
		<div
			aria-hidden="true"
			className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}
		>
			<div className="animate-float absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/40 to-fuchsia-400/25 blur-3xl" />
			<div className="animate-float-slow absolute top-16 left-[-5rem] h-80 w-80 rounded-full bg-gradient-to-tr from-violet-400/30 to-sky-400/25 blur-3xl" />
			<div className="animate-blob absolute bottom-[-7rem] right-1/3 h-64 w-64 bg-gradient-to-tr from-pink-400/20 to-indigo-400/20 blur-3xl" />
		</div>
	)
}

/** الگوی گرید بسیار محو (وکتوری). */
export function GridPattern({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={clsx("pointer-events-none absolute inset-0 h-full w-full text-[var(--color-border)]", className)}
		>
			<defs>
				<pattern id="virgule-grid" width="44" height="44" patternUnits="userSpaceOnUse">
					<path d="M44 0H0V44" fill="none" stroke="currentColor" strokeWidth="1" />
				</pattern>
				<radialGradient id="virgule-fade" cx="50%" cy="0%" r="90%">
					<stop offset="0%" stopColor="white" stopOpacity="1" />
					<stop offset="75%" stopColor="white" stopOpacity="0" />
				</radialGradient>
				<mask id="virgule-grid-mask">
					<rect width="100%" height="100%" fill="url(#virgule-fade)" />
				</mask>
			</defs>
			<rect width="100%" height="100%" fill="url(#virgule-grid)" mask="url(#virgule-grid-mask)" opacity="0.5" />
		</svg>
	)
}

/** شکل‌های وکتوری شناور اطراف هیرو (دایره، جمع، حلقه). */
export function FloatingShapes({ className }: { className?: string }) {
	return (
		<div
			aria-hidden="true"
			className={clsx("pointer-events-none absolute inset-0 overflow-hidden text-[var(--color-primary)]", className)}
		>
			<svg className="animate-float absolute left-[8%] top-[18%] h-10 w-10 opacity-40" viewBox="0 0 40 40" fill="none">
				<circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
			</svg>
			<svg className="animate-float-slow absolute right-[10%] top-[26%] h-8 w-8 opacity-50" viewBox="0 0 40 40" fill="none">
				<path d="M20 6V34M6 20H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			</svg>
			<svg className="animate-float absolute left-[16%] bottom-[16%] h-9 w-9 opacity-30" viewBox="0 0 40 40" fill="currentColor">
				<rect x="6" y="6" width="28" height="28" rx="9" />
			</svg>
			<svg className="animate-spin-slow absolute right-[16%] bottom-[20%] h-12 w-12 opacity-25" viewBox="0 0 40 40" fill="none">
				<path d="M20 3 L24 16 L37 20 L24 24 L20 37 L16 24 L3 20 L16 16 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			</svg>
		</div>
	)
}
