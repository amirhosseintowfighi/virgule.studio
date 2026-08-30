/**
 * آیکون‌های پنل — SVG خطی، نه ایموجی.
 * ایموجی در پلتفرم‌های مختلف متفاوت رندر می‌شود، رنگ برند نمی‌گیرد و برای
 * صفحه‌خوان نویز است. مسیرها از Lucide (MIT) گرفته شده‌اند؛ به‌جای نصب یک بسته،
 * همان چند مسیری که واقعاً استفاده می‌شود اینجا آمده است.
 */
const base = {
	width: 18,
	height: 18,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.8,
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
	"aria-hidden": true,
}

export const icons = {
	dashboard: (
		<svg {...base}>
			<rect x="3" y="3" width="7" height="9" />
			<rect x="14" y="3" width="7" height="5" />
			<rect x="14" y="12" width="7" height="9" />
			<rect x="3" y="16" width="7" height="5" />
		</svg>
	),
	posts: (
		<svg {...base}>
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
		</svg>
	),
	projects: (
		<svg {...base}>
			<rect x="2" y="7" width="20" height="14" rx="1" />
			<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
		</svg>
	),
	categories: (
		<svg {...base}>
			<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2c0 .5.2 1 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8Z" />
			<circle cx="7.5" cy="7.5" r="1" />
		</svg>
	),
	services: (
		<svg {...base}>
			<path d="M14.7 6.3a4 4 0 0 0 5 5l-8.5 8.5a2.8 2.8 0 0 1-4-4Z" />
			<path d="m18 2 4 4-2.5 2.5" />
		</svg>
	),
	submissions: (
		<svg {...base}>
			<rect x="2" y="4" width="20" height="16" rx="1" />
			<path d="m2 6 10 7 10-7" />
		</svg>
	),
	users: (
		<svg {...base}>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.9" />
		</svg>
	),
	settings: (
		<svg {...base}>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 7 2.6h.1A1.7 1.7 0 0 0 9 1V1a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 2.6a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
		</svg>
	),
	content: (
		<svg {...base}>
			<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
			<path d="M6 8h8M6 12h12M6 16h7" />
		</svg>
	),
	faq: (
		<svg {...base}>
			<circle cx="12" cy="12" r="9" />
			<path d="M9.2 9a2.8 2.8 0 0 1 5.4 1c0 1.9-2.6 2.3-2.6 4" />
			<path d="M12 17.5h.01" />
		</svg>
	),
	newsletter: (
		<svg {...base}>
			<path d="M4 4h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
			<path d="m2 7 10 6 10-6" />
		</svg>
	),
} satisfies Record<string, React.ReactElement>

export type IconName = keyof typeof icons
