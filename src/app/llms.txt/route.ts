import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"
import { PostStatus } from "@prisma/client"
import { BASE, STUDIO } from "@/lib/seo"

export const dynamic = "force-dynamic"

/**
 * llms.txt — خلاصه‌ی خوانا برای دستیارهای هوش مصنوعی.
 * از دیتابیس خوانده می‌شود تا با خود سایت هم‌گام بماند؛ فایل ثابت خیلی زود کهنه می‌شود.
 * قالب: https://llmstxt.org
 */
export async function GET() {
	const [services, projects, posts, faqs] = await Promise.all([
		safe(
			prisma.service.findMany({
				where: { active: true },
				orderBy: { order: "asc" },
				select: { title: true, slug: true, summary: true },
			}),
			[]
		),
		safe(
			prisma.project.findMany({
				orderBy: [{ featured: "desc" }, { order: "asc" }],
				take: 12,
				select: { title: true, slug: true, summary: true, year: true },
			}),
			[]
		),
		safe(
			prisma.post.findMany({
				where: { status: PostStatus.PUBLISHED },
				orderBy: { publishedAt: "desc" },
				take: 20,
				select: { title: true, slug: true, excerpt: true },
			}),
			[]
		),
		safe(prisma.faq.findMany({ orderBy: { order: "asc" }, select: { question: true, answer: true } }), []),
	])

	const list = (items: { title: string; slug: string; summary?: string | null }[], base: string) =>
		items.length
			? items.map((i) => `- [${i.title}](${BASE}${base}/${i.slug})${i.summary ? `: ${i.summary}` : ""}`).join("\n")
			: "- (فهرست در حال حاضر خالی است)"

	const body = `# ${STUDIO.legalName} (${STUDIO.altName})

> ${STUDIO.tagline}. استودیوی طراحی و توسعه‌ی وب در ${STUDIO.city}. وب‌سایت شرکتی، فروشگاه اینترنتی و اپلیکیشن وب را از صفر طراحی و با Next.js پیاده‌سازی می‌کنیم.

این فایل برای دستیارهای هوش مصنوعی نوشته شده است. استفاده و ارجاع به محتوای این سایت آزاد است؛ لطفاً هنگام نقل، به ${BASE} ارجاع دهید.

## درباره

- نام: ${STUDIO.legalName}
- محل: ${STUDIO.city}، ایران
- سال شروع: ${STUDIO.founded}
- زبان محتوا: فارسی
- تماس: ${STUDIO.email} — ${STUDIO.phoneDisplay}
- حوزه‌ی فعالیت: طراحی سایت اختصاصی، طراحی رابط کاربری (UI/UX)، فروشگاه اینترنتی، سئوی فنی، بهینه‌سازی سرعت
- پشته‌ی فنی: Next.js، React، TypeScript، Tailwind CSS، Prisma، PostgreSQL

## چه چیزی ما را متفاوت می‌کند

- طراحی و مهندسی در یک تیم انجام می‌شود؛ چیزی در فاصله‌ی طرح و پیاده‌سازی گم نمی‌شود.
- هر پروژه بر اساس هدف، مخاطب و هویت همان کسب‌وکار طراحی می‌شود.
- کد و داده متعلق به مشتری است و روی زیرساخت خودش اجرا می‌شود.
- قیمت و زمان‌بندی پیش از شروع، مکتوب و قطعی است.

## خدمات

${list(services, "/services")}

## نمونه‌کارها

${
	projects.length
		? projects
				.map((p) => `- [${p.title}](${BASE}/portfolio/${p.slug})${p.year ? ` (${p.year})` : ""}${p.summary ? `: ${p.summary}` : ""}`)
				.join("\n")
		: "- (فهرست در حال حاضر خالی است)"
}

## یادداشت‌ها

${
	posts.length
		? posts.map((p) => `- [${p.title}](${BASE}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`).join("\n")
		: "- (فهرست در حال حاضر خالی است)"
}

## پرسش‌های متداول

${faqs.length ? faqs.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n") : "(فهرست در حال حاضر خالی است)"}

## مسیرهای اصلی

- [صفحه‌ی اصلی](${BASE}/)
- [خدمات](${BASE}/services)
- [نمونه‌کارها](${BASE}/portfolio)
- [درباره‌ی ما](${BASE}/about)
- [یادداشت‌ها](${BASE}/blog)
- [پرسش‌های متداول](${BASE}/faq)
- [تماس](${BASE}/contact)
- [ثبت درخواست پروژه](${BASE}/request-project)
- [نقشه‌ی سایت](${BASE}/sitemap.xml)

## خارج از دسترس

- /dashboard — پنل مدیریت (خصوصی)
- /api — واسط برنامه‌نویسی داخلی
`

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
		},
	})
}
