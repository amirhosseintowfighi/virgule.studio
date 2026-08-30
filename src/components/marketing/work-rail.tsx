"use client"

import { Children, useEffect, useRef, useState } from "react"

/**
 * ریل افقی نمونه‌کارها.
 *
 * بخش به بالای صفحه می‌چسبد و اسکرولِ عمودی به حرکت افقی ترجمه می‌شود؛ وقتی
 * کارها تمام شدند، صفحه به حالت عادی ادامه می‌دهد.
 *
 * پیشرفت را همین‌جا حساب می‌کنیم و در متغیر --p می‌نویسیم — نه با view-timeline
 * بومی. دلیلش دو چیز است: سافاری هنوز scroll-driven animation ندارد، و یک مسیر
 * واحد که همه‌جا یکسان رفتار کند از دو مسیرِ نصفه بهتر است. هزینه‌اش یک نوشتنِ
 * سبک در هر فریم است؛ خودِ جابه‌جایی همچنان transform است و روی compositor می‌ماند.
 *
 * اگر کارت‌ها در یک صفحه جا شوند، یا کاربر حرکت کم خواسته باشد، قفل‌شدن اتفاق
 * نمی‌افتد و همان ریلِ اسکرولیِ ساده با دکمه‌های کناری باقی می‌ماند.
 */
export function WorkRail({ children }: { children: React.ReactNode }) {
	const wrap = useRef<HTMLDivElement>(null)
	const ref = useRef<HTMLDivElement>(null)
	const [atStart, setAtStart] = useState(true)
	const [atEnd, setAtEnd] = useState(false)
	const count = Children.count(children)

	// حالت پایه: دکمه‌ها ریل را اسکرول می‌کنند
	useEffect(() => {
		const el = ref.current
		if (!el) return

		const update = () => {
			// در RTL مقدار scrollLeft منفی است؛ با abs یکدست می‌شود
			const x = Math.abs(el.scrollLeft)
			const max = el.scrollWidth - el.clientWidth
			setAtStart(x < 8)
			setAtEnd(x > max - 8)
		}

		update()
		el.addEventListener("scroll", update, { passive: true })
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => {
			el.removeEventListener("scroll", update)
			ro.disconnect()
		}
	}, [])

	// حالت قفل‌شده: موقعیت عمودی را به پیشرفت افقی (متغیر --p) ترجمه می‌کند
	useEffect(() => {
		const box = wrap.current
		const el = ref.current
		if (!box || !el) return
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		// اگر مرورگر خودش scroll-driven animation دارد، CSS حرکت را می‌سازد و
		// اینجا فقط کلاس را می‌گذاریم — هیچ کاری در هر فریم لازم نیست.
		const native = CSS.supports("animation-timeline: view()")

		let raf = 0
		let running = false

		// موقعیت را هر فریم از خودِ layout می‌خوانیم، نه از رویداد scroll.
		// دو دلیل: Lenis رویداد scroll پنجره را منتشر نمی‌کند، و روی iOS هم
		// در جریان momentum اسکرول، رویدادها با تأخیر و ناقص می‌آیند.
		const frame = () => {
			if (!running) {
				raf = 0
				return
			}
			const r = box.getBoundingClientRect()
			const span = r.height - window.innerHeight
			if (span > 0) {
				const p = Math.min(1, Math.max(0, -r.top / span))
				box.style.setProperty("--p", String(p))
			}
			raf = requestAnimationFrame(frame)
		}

		const start = () => {
			if (running) return
			running = true
			raf = requestAnimationFrame(frame)
		}
		const stop = () => {
			running = false
			if (raf) cancelAnimationFrame(raf)
			raf = 0
		}

		// حلقه فقط وقتی می‌چرخد که بخش روی صفحه باشد
		const io = new IntersectionObserver(
			([e]) => (e.isIntersecting ? start() : stop()),
			{ rootMargin: "100px" }
		)

		// اگر کارت‌ها در یک صفحه جا می‌شوند، قفل‌کردن فقط اسکرولِ بی‌دلیل اضافه می‌کند.
		//
		// عرضِ محتوا را از روی خودِ کارت‌ها جمع می‌زنیم، نه از scrollWidth ریل:
		// وقتی is-pinned اعمال می‌شود ریل به width:max-content و overflow:visible
		// تبدیل می‌شود و آن‌وقت scrollWidth برابر clientWidth می‌شود — یعنی شرط
		// نقض می‌شد، کلاس برداشته می‌شد، دوباره برقرار می‌شد و همین‌طور در حلقه.
		const sync = () => {
			const cards = Array.from(el.children) as HTMLElement[]
			const content = cards.reduce((w, c) => w + c.offsetWidth, 0)
			const overflows = cards.length > 1 && content > box.clientWidth + 40
			box.classList.toggle("is-pinned", overflows)
			if (overflows && !native) {
				io.observe(box)
			} else {
				io.disconnect()
				stop()
				box.style.removeProperty("--p")
			}
		}

		sync()
		const ro = new ResizeObserver(sync)
		ro.observe(el)
		return () => {
			ro.disconnect()
			io.disconnect()
			stop()
			box.classList.remove("is-pinned")
			box.style.removeProperty("--p")
		}
	}, [])

	return (
		<>
			<div ref={wrap} className="hscroll" style={{ "--n": count } as React.CSSProperties}>
				<div className="hscroll__pin">
					<div
						ref={ref}
						className="rail"
						// در حالت پایه با کیبورد هم قابل اسکرول باشد
						tabIndex={0}
						role="region"
						aria-label="نمونه‌کارهای منتخب"
					>
						{children}
					</div>
				</div>
			</div>

			{/* در حالت قفل‌شده: چقدر از کارها را دیده‌اید */}
			<div className="hscroll__bar mt-10" aria-hidden="true">
				<i />
			</div>

			<div className="rail-nav-row mt-10 flex items-center gap-3">
				<button
					type="button"
					onClick={() => step(ref, -1)}
					disabled={atStart}
					className="rail-nav"
					aria-label="نمونه‌کار قبلی"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
				<button
					type="button"
					onClick={() => step(ref, 1)}
					disabled={atEnd}
					className="rail-nav"
					aria-label="نمونه‌کار بعدی"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</div>
		</>
	)
}

/** یک کارت در هر کلیک، نه یک مقدار ثابت. جهت در RTL برعکس است. */
function step(ref: React.RefObject<HTMLDivElement | null>, dir: 1 | -1) {
	const el = ref.current
	if (!el) return
	const card = el.querySelector(".rail__i")
	const amount = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
	el.scrollBy({ left: dir * amount * -1, behavior: "smooth" })
}
