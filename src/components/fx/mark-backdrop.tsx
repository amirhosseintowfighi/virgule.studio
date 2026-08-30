/**
 * پس‌زمینه‌ی بخش معرفی: خودِ نشان ویرگول، بزرگ و کم‌نور.
 *
 * قبلاً اینجا یک میدان ذرات روی canvas بود. حذف شد چون یک حلقه‌ی فیزیک با
 * requestAnimationFrame برای چیزی که در عمل دیده نمی‌شد هزینه می‌داد و شکل نشان
 * را قابل‌اتکا نمی‌ساخت. این نسخه سرور-رندر است، صفر جاوااسکریپت دارد و همه‌جا
 * یکسان دیده می‌شود.
 */
export function MarkBackdrop({ className }: { className?: string }) {
	return (
		<div className={className} aria-hidden="true">
			<svg
				viewBox="0 0 366 404"
				fill="none"
				className="mark-bd h-full w-full"
				preserveAspectRatio="xMidYMid meet"
			>
				<defs>
					{/* از بالا-راست روشن به پایین-چپ محو — نور از یک سمت می‌تابد، نه از همه‌جا */}
					<linearGradient id="mk" x1="1" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--accent)" stopOpacity=".55" />
						<stop offset="55%" stopColor="var(--accent)" stopOpacity=".16" />
						<stop offset="100%" stopColor="var(--accent)" stopOpacity=".02" />
					</linearGradient>
				</defs>
				<circle cx="218.1" cy="256.5" r="139.6" stroke="url(#mk)" strokeWidth="1.4" />
				<line x1="329" y1="6" x2="6" y2="329" stroke="url(#mk)" strokeWidth="1.4" strokeLinecap="round" />
				{/* نوکِ قلم عمداً حذف شده: در این اندازه و شفافیت به یک لکه‌ی خاکستریِ
				    مات تبدیل می‌شد. فقط دو خطِ نشان می‌مانند — همان چیزی که خوانده می‌شود. */}
			</svg>
		</div>
	)
}
