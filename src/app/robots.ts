import type { MetadataRoute } from "next"
import { BASE } from "@/lib/seo"

/**
 * مسیرهای خصوصی برای همه بسته‌اند؛ بقیه‌ی سایت برای همه باز است — از جمله
 * خزنده‌های هوش مصنوعی. محتوای ما عمومی است و می‌خواهیم در پاسخ دستیارها
 * به‌عنوان منبع دیده شود، پس GPTBot و امثال آن عمداً مجازند.
 */
const PRIVATE = ["/dashboard", "/dashboard/", "/api/", "/login"]

/** خزنده‌های هوش مصنوعی که صریحاً اجازه داده‌ایم. */
const AI_BOTS = [
	"GPTBot", // OpenAI — آموزش
	"OAI-SearchBot", // OpenAI — نتایج جستجو در ChatGPT
	"ChatGPT-User", // OpenAI — مرور زنده به‌درخواست کاربر
	"ClaudeBot", // Anthropic
	"Claude-User",
	"Claude-SearchBot",
	"anthropic-ai",
	"PerplexityBot",
	"Perplexity-User",
	"Google-Extended", // Gemini / Vertex AI
	"Applebot-Extended",
	"Bingbot",
	"CCBot", // Common Crawl
	"Meta-ExternalAgent",
	"Amazonbot",
	"cohere-ai",
	"YouBot",
	"DuckAssistBot",
]

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: "*", allow: "/", disallow: PRIVATE },
			...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
		],
		sitemap: `${BASE}/sitemap.xml`,
		host: BASE,
	}
}
