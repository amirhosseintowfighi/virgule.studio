/* eslint-disable no-console */
import { PrismaClient, PostStatus, CategoryType } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const readingTime = (text: string) => Math.max(1, Math.round(text.length / 900))

async function main() {
	console.log("🌱 شروع Seed ویرگول...")

	// ---------------- Permissions (colon-style keys) ----------------
	const permissionDefs: [string, string][] = [
		["post:read", "مشاهده مقالات"],
		["post:write", "ایجاد و ویرایش مقاله"],
		["post:publish", "انتشار مقاله"],
		["post:delete", "حذف مقاله"],
		["project:read", "مشاهده نمونه‌کارها"],
		["project:write", "ایجاد و ویرایش نمونه‌کار"],
		["project:delete", "حذف نمونه‌کار"],
		["service:read", "مشاهده خدمات"],
		["service:write", "ایجاد و ویرایش خدمت"],
		["service:delete", "حذف خدمت"],
		["form:read", "مشاهده فرم‌های دریافتی"],
		["user:read", "مشاهده کاربران"],
		["user:write", "ایجاد و ویرایش کاربر"],
		["user:delete", "حذف کاربر"],
		["setting:manage", "مدیریت تنظیمات و محتوا"],
	]
	const permissions = await Promise.all(
		permissionDefs.map(([key, label]) =>
			prisma.permission.upsert({ where: { key }, update: { label }, create: { key, label } })
		)
	)
	const permKey = (k: string) => permissions.find((p) => p.key === k)!.id
	const allKeys = permissionDefs.map((d) => d[0])

	// ---------------- Roles (4) ----------------
	const roleDefs: { name: string; description: string; keys: string[] }[] = [
		{ name: "SUPER_ADMIN", description: "مدیر کل — دسترسی کامل به همه‌ی بخش‌ها", keys: allKeys },
		{ name: "ADMIN", description: "مدیر — دسترسی کامل؛ فقط نمی‌تواند مدیر کل را حذف/ویرایش کند", keys: allKeys },
		{
			name: "CONTENT",
			description: "تولید محتوا — مقالات، نمونه‌کارها و خدمات",
			keys: ["post:read", "post:write", "post:publish", "project:read", "project:write", "service:read", "service:write"],
		},
		{ name: "SUPPORT", description: "پشتیبان — مشاهده‌ی فرم‌ها و محتوا", keys: ["form:read", "post:read", "project:read", "service:read"] },
	]
	const roleMap = new Map<string, string>()
	for (const r of roleDefs) {
		const role = await prisma.role.upsert({
			where: { name: r.name },
			update: {
				description: r.description,
				permissions: { set: r.keys.map((k) => ({ id: permKey(k) })) },
			},
			create: {
				name: r.name,
				description: r.description,
				permissions: { connect: r.keys.map((k) => ({ id: permKey(k) })) },
			},
		})
		roleMap.set(r.name, role.id)
	}
	const superAdminId = roleMap.get("SUPER_ADMIN")!

	// ---------------- Admin user (مدیر کل) ----------------
	const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "Virgule@1404", 12)
	const admin = await prisma.user.upsert({
		where: { email: process.env.ADMIN_EMAIL ?? "info@virgule.studio" },
		update: { roleId: superAdminId },
		create: {
			name: process.env.ADMIN_NAME ?? "مدیر ویرگول",
			email: process.env.ADMIN_EMAIL ?? "info@virgule.studio",
			passwordHash,
			bio: "بنیانگذار و مدیر استودیوی ویرگول",
			roleId: superAdminId,
		},
	})

	// ---------------- Services (8) with rich content ----------------
	const services = [
		{
			title: "طراحی سایت شرکتی",
			slug: "corporate-website",
			icon: "🏢",
			summary:
				"وب‌سایتی حرفه‌ای که اولین و ماندگارترین تصویر برند شما را در ذهن مخاطب می‌سازد و اعتماد مشتری را جلب می‌کند.",
			content:
				"وب‌سایت شرکتی، ویترین دیجیتال کسب‌وکار شماست؛ جایی که مخاطب در همان چند ثانیه‌ی اول درباره‌ی اعتبار و جدیت شما قضاوت می‌کند. ما در ویرگول وب‌سایتی می‌سازیم که فراتر از یک کاتالوگ ساده باشد و به یک ابزار فروش و اعتمادسازی تبدیل شود.\n\nطراحی هر پروژه از صفر و براساس هویت بصری برند شما انجام می‌شود؛ از انتخاب رنگ و تایپوگرافی گرفته تا چیدمان محتوا و مسیر حرکت کاربر. هدف ما این است که بازدیدکننده به راحتی خدمات شما را بشناسد و به مشتری تبدیل شود.\n\nزیرساخت فنی پروژه بر پایه‌ی جدیدترین تکنولوژی‌ها (Next.js و React) ساخته می‌شود تا سایت شما هم سریع باشد و هم در موتورهای جستجو رتبه‌ی خوبی بگیرد. تمام صفحات برای موبایل، تبلت و دسکتاپ بهینه می‌شوند.\n\nدر نهایت، یک پنل مدیریت ساده در اختیار شما قرار می‌گیرد تا بدون دانش فنی، محتوا، خدمات و نمونه‌کارها را خودتان مدیریت کنید.",
			features: [
				"طراحی کاملاً اختصاصی متناسب با هویت برند",
				"ریسپانسیو کامل برای همه‌ی دستگاه‌ها",
				"پنل مدیریت محتوای اختصاصی",
				"بهینه‌سازی سئوی پایه و سرعت بالا",
				"فرم‌های تماس و جذب سرنخ",
				"اتصال به ابزارهای تحلیلی و گوگل آنالیتیکس",
			],
		},
		{
			title: "طراحی فروشگاه اینترنتی",
			slug: "ecommerce",
			icon: "🛍️",
			summary:
				"فروشگاهی سریع، امن و آماده‌ی فروش که تجربه‌ی خرید را لذت‌بخش و نرخ تبدیل را حداکثر می‌کند.",
			content:
				"فروشگاه اینترنتی قلب تپنده‌ی کسب‌وکار آنلاین شماست. ما فروشگاهی می‌سازیم که مسیر خرید در آن کوتاه، شفاف و بدون اصطکاک باشد تا مشتری بدون سردرگمی خرید خود را نهایی کند.\n\nاز مدیریت محصولات و دسته‌بندی، تا مدیریت موجودی، تخفیف‌ها و کدهای تخفیف، همه چیز در یک پنل یکپارچه و فارسی مدیریت می‌شود. درگاه‌های پرداخت ایرانی به‌صورت امن متصل می‌شوند.\n\nسرعت در فروشگاه یک مزیت رقابتی است؛ صفحات محصول در کمترین زمان بارگذاری می‌شوند تا نرخ رهاسازی سبد خرید کاهش پیدا کند. همچنین زیرساخت فروشگاه برای رشد آینده‌ی شما مقیاس‌پذیر طراحی می‌شود.\n\nگزارش‌های فروش و تحلیل رفتار مشتری به شما کمک می‌کند تصمیم‌های هوشمندتری بگیرید و فروش خود را مداوم افزایش دهید.",
			features: [
				"سبد خرید و فرآیند پرداخت روان",
				"اتصال به درگاه‌های پرداخت ایرانی",
				"مدیریت محصول، موجودی و دسته‌بندی",
				"کدهای تخفیف و کمپین فروش",
				"گزارش فروش و تحلیل مشتری",
				"طراحی بهینه برای افزایش نرخ تبدیل",
			],
		},
		{
			title: "طراحی سایت اختصاصی",
			slug: "custom-website",
			icon: "💻",
			summary:
				"راهکار نرم‌افزاری کاملاً اختصاصی که دقیقاً مطابق فرآیندهای کسب‌وکار شما ساخته می‌شود.",
			content:
				"گاهی راهکارهای آماده جوابگوی نیاز شما نیستند. در این موارد، ما یک نرم‌افزار تحت وب کاملاً اختصاصی طراحی و پیاده‌سازی می‌کنیم که دقیقاً حول فرآیندهای واقعی کسب‌وکار شما می‌چرخد.\n\nاز سامانه‌های رزرواسیون و داشبوردهای مدیریتی تا پنل‌های اختصاصی کاربری و اتوماسیون فرآیندها، هر چیزی که تصور کنید قابل ساخت است. معماری نرم‌افزار طوری طراحی می‌شود که امن، پایدار و قابل توسعه باشد.\n\nتیم ما پیش از کدنویسی، زمان کافی را صرف تحلیل نیازمندی‌ها و طراحی معماری می‌کند تا محصول نهایی هم کارامد باشد و هم در آینده به‌راحتی توسعه پیدا کند.\n\nدر طول پروژه، ارتباط شفاف و تحویل مرحله‌ای باعث می‌شود همیشه در جریان پیشرفت کار باشید.",
			features: [
				"تحلیل دقیق نیازمندی‌ها و معماری اختصاصی",
				"توسعه‌ی API اختصاصی",
				"داشبورد و پنل مدیریتی سفارشی",
				"یکپارچگی با سرویس‌های خارجی",
				"مقیاس‌پذیری و امنیت بالا",
				"تحویل مرحله‌ای و مستندات کامل",
			],
		},
		{
			title: "طراحی UI/UX",
			slug: "ui-ux",
			icon: "🎨",
			summary:
				"تجربه‌ی کاربری که دیده‌شدن را به ماندگاری تبدیل می‌کند و کاربر را به اقدام ترغیب می‌کند.",
			content:
				"طراحی تجربه‌ی کاربری خوب، تفاوت بین یک محصول موفق و یک محصول رهاشده است. ما در ویرگول فرآیند طراحی را از تحقیق و شناخت کاربر آغاز می‌کنیم، نه از سلیقه‌ی شخصی.\n\nبا ساخت وایرفریم و پروتوتایپ، مسیر حرکت کاربر پیش از توسعه بررسی و بهینه می‌شود. این کار باعث می‌شود پیش از صرف هزینه‌ی توسعه، از درستی طراحی مطمئن شوید.\n\nخروجی کار یک دیزاین‌سیستم منسجم است که تمام اجزای محصول را یکدست و حرفه‌ای نگه می‌دارد و توسعه‌ی آینده را سریع‌تر می‌کند.\n\nدر نهایت با تست کاربری، طراحی را با داده‌ی واقعی محک می‌زنیم تا مطمئن شویم محصول واقعاً برای کاربر روان است.",
			features: [
				"تحقیق کاربر و تحلیل رقبا",
				"وایرفریم و پروتوتایپ تعاملی",
				"طراحی دیزاین‌سیستم منسجم",
				"رعایت اصول دسترس‌پذیری (Accessibility)",
				"تست کاربری و بهینه‌سازی مستمر",
				"تحویل فایل‌های طراحی آماده‌ی توسعه",
			],
		},
		{
			title: "بهینه‌سازی برای موتورهای جستجو (SEO)",
			slug: "seo",
			icon: "📈",
			summary:
				"دیده‌شدن در گوگل و جذب ترافیک ارگانیک پایدار؛ مشتری‌هایی که خودشان دنبال شما می‌گردند.",
			content:
				"سئو یک سرمایه‌گذاری بلندمدت است که ترافیک رایگان و دائمی برای کسب‌وکار شما می‌سازد. ما با رویکردی داده‌محور، وضعیت فعلی سایت شما را ممیزی کرده و نقشه‌ی راه دقیقی برای رشد ارائه می‌دهیم.\n\nکار ما از سئوی فنی شروع می‌شود؛ ساختار فنی سایت، سرعت، داده‌ی ساختاریافته و نقشه‌ی سایت برای ربات‌های گوگل بهینه می‌شود. سپس با تحقیق کلمات کلیدی، محتوای هدفمند تولید می‌کنیم.\n\nبهینه‌سازی محتوای موجود و ساخت محتوای جدید، هر دو بخشی از استراتژی هستند تا رتبه‌ی کلمات هدف به‌تدریج بهبود پیدا کند.\n\nدر پایان هر دوره، گزارش شفافی از تغییرات رتبه و ترافیک دریافت می‌کنید تا اثر کار را با عدد و رقم ببینید.",
			features: [
				"ممیزی و سئوی فنی کامل",
				"تحقیق و خوشه‌بندی کلمات کلیدی",
				"بهینه‌سازی محتوا و ساختار صفحات",
				"بهینه‌سازی Core Web Vitals",
				"لینک‌سازی داخلی و خارجی",
				"گزارش دوره‌ای رتبه و ترافیک",
			],
		},
		{
			title: "بهینه‌سازی سرعت",
			slug: "performance",
			icon: "⚡",
			summary:
				"نمره‌ی Lighthouse بالا و بارگذاری فوق‌سریع که هم تجربه‌ی کاربر و هم رتبه‌ی سئوی شما را بالا می‌برد.",
			content:
				"سرعت سایت مستقیماً بر نرخ تبدیل، رتبه‌ی گوگل و رضایت کاربر اثر می‌گذارد. حتی یک ثانیه تاخیر در بارگذاری می‌تواند بخش قابل توجهی از بازدیدکنندگان را فراری دهد.\n\nما با بررسی دقیق شاخص‌های Core Web Vitals، گلوگاه‌های عملکردی را شناسایی و برطرف می‌کنیم. بهینه‌سازی تصاویر، بارگذاری تنبل و تقسیم کد از جمله راهکارهای ما هستند.\n\nکشینگ هوشمند در لایه‌های مختلف باعث می‌شود بارگذاری‌های بعدی تقریباً آنی باشد؛ و با مانیتورینگ مداوم، افت عملکرد پیش از آنکه به مشکل تبدیل شود شناسایی می‌شود.",
			features: [
				"تحلیل و بهینه‌سازی Core Web Vitals",
				"بارگذاری تنبل و تقسیم کد",
				"بهینه‌سازی و فشرده‌سازی تصاویر",
				"کشینگ چندلایه و CDN",
				"کاهش حجم جاوااسکریپت و CSS",
				"مانیتورینگ مستمر عملکرد",
			],
		},
		{
			title: "پشتیبانی و نگهداری",
			slug: "support",
			icon: "🛡️",
			summary:
				"پشتیبانی مستمر و نگهداری حرفه‌ای تا وب‌سایت شما همیشه پایدار، امن و به‌روز باقی بماند.",
			content:
				"راه‌اندازی سایت پایان کار نیست؛ یک وب‌سایت برای اینکه امن و پایدار بماند به نگهداری منظم نیاز دارد. ما با بسته‌های پشتیبانی، خیال شما را از بابت فنی راحت می‌کنیم.\n\nبه‌روزرسانی منظم زیرساخت، وصله‌های امنیتی و پشتیبان‌گیری خودکار، از داده‌ها و اعتبار شما محافظت می‌کند. در صورت بروز هر مشکل، تیم ما در کوتاه‌ترین زمان پاسخگوست.\n\nمانیتورینگ دائمی سرور و آپ‌تایم باعث می‌شود مشکلات پیش از آنکه کاربران متوجه شوند برطرف شوند. گزارش‌های دوره‌ای وضعیت سایت را شفاف نگه می‌دارد.",
			features: [
				"به‌روزرسانی منظم زیرساخت و پکیج‌ها",
				"پشتیبان‌گیری خودکار و دوره‌ای",
				"رفع مشکل و پاسخ‌گویی سریع",
				"مانیتورینگ آپ‌تایم و امنیت",
				"وصله‌های امنیتی دوره‌ای",
				"گزارش وضعیت دوره‌ای",
			],
		},
		{
			title: "مشاوره‌ی دیجیتال",
			slug: "consulting",
			icon: "💡",
			summary:
				"مشاوره‌ی تخصصی برای حضور دیجیتال درست؛ پیش از آنکه هزینه کنید، مسیر درست را بشناسید.",
			content:
				"بسیاری از پروژه‌های دیجیتال نه به دلیل ضعف اجرا، بلکه به دلیل انتخاب مسیر اشتباه شکست می‌خورند. مشاوره‌ی دیجیتال ویرگول به شما کمک می‌کند پیش از صرف هزینه، تصمیم‌های درست بگیرید.\n\nما وضعیت فعلی شما را بررسی می‌کنیم، رقبا را تحلیل می‌کنیم و یک استراتژی حضور دیجیتال روشن با گام‌های عملی ارائه می‌دهیم. انتخاب تکنولوژی مناسب هم بخش مهمی از این مشاوره است.\n\nخروجی مشاوره یک نقشه‌ی راه مشخص است که می‌توانید خودتان یا با همراهی ما اجرایش کنید. هدف ما رشد واقعی کسب‌وکار شماست، نه فروش خدمات غیرضروری.",
			features: [
				"بررسی وضعیت فعلی و تحلیل رقبا",
				"تدوین استراتژی حضور دیجیتال",
				"ممیزی فنی و امنیتی",
				"مشاوره در انتخاب تکنولوژی",
				"تدوین نقشه‌ی راه عملیاتی",
				"جلسات مشاوره‌ی دوره‌ای",
			],
		},
	]
	for (const [i, s] of services.entries()) {
		await prisma.service.upsert({
			where: { slug: s.slug },
			update: {
				title: s.title,
				icon: s.icon,
				summary: s.summary,
				content: s.content,
				features: s.features,
				order: i,
				active: true,
			},
			create: { ...s, order: i, active: true },
		})
	}

	// ---------------- Categories & Tags ----------------
	const blogCat = await prisma.category.upsert({
		where: { slug: "web-design" },
		update: {},
		create: { name: "طراحی وب", slug: "web-design", type: CategoryType.BLOG },
	})
	const seoCat = await prisma.category.upsert({
		where: { slug: "seo-marketing" },
		update: {},
		create: { name: "سئو و بازاریابی", slug: "seo-marketing", type: CategoryType.BLOG },
	})
	const portfolioCat = await prisma.category.upsert({
		where: { slug: "corporate" },
		update: {},
		create: { name: "شرکتی", slug: "corporate", type: CategoryType.PORTFOLIO },
	})
	await prisma.category.upsert({ where: { slug: "service-based" }, update: {}, create: { name: "خدماتی", slug: "service-based", type: CategoryType.PORTFOLIO } })
	await prisma.category.upsert({ where: { slug: "ecommerce" }, update: {}, create: { name: "فروشگاهی", slug: "ecommerce", type: CategoryType.PORTFOLIO } })
	await prisma.category.upsert({ where: { slug: "landing" }, update: {}, create: { name: "لندینگ / کمپین", slug: "landing", type: CategoryType.PORTFOLIO } })
	await prisma.category.upsert({ where: { slug: "web-app" }, update: {}, create: { name: "اپلیکیشن وب", slug: "web-app", type: CategoryType.PORTFOLIO } })

	const tagNames = [
		["Next.js", "nextjs"], ["طراحی UI", "ui-design"],
		["سئو", "seo"], ["عملکرد", "performance"],
	]
	const tags = await Promise.all(
		tagNames.map(([name, slug]) =>
			prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } })
		)
	)

	// ---------------- Posts (3) ----------------
	const posts = [
		{
			title: "چرا Material Design 3 آینده‌ی طراحی وب است؟",
			slug: "why-material-design-3",
			excerpt: "نگاهی به اصول Material You، Dynamic Color و دلایل محبوبیت این زبان طراحی.",
			content: "# Material Design 3\n\nمتریال دیزاین ۳ با معرفی Dynamic Color و Material You تحولی در تجربه‌ی کاربری ایجاد کرده است. در این مقاله به اصول پایه می‌پردازیم.\n\n## Elevation و Surface\n\nسطوح و سایه‌ها عمق را به رابط اضافه می‌کنند.",
			categoryId: blogCat.id,
		},
		{
			title: "۷ اصل طلایی سئوی فنی در ۲۰۲۵",
			slug: "technical-seo-2025",
			excerpt: "چک‌لیست کامل سئوی فنی برای رتبه‌ی برتر در گوگل.",
			content: "# سئوی فنی\n\nسرعت، ساختار داده، Sitemap و Core Web Vitals ارکان اصلی سئوی فنی هستند.",
			categoryId: seoCat.id,
		},
		{
			title: "راهنمای سرعت وب‌سایت: از ۰ تا Lighthouse 100",
			slug: "web-performance-guide",
			excerpt: "تکنیک‌های عملی برای رسیدن به نمره‌ی کامل عملکرد.",
			content: "# عملکرد وب\n\nبا بهینه‌سازی تصاویر، code splitting و کشینگ می‌توان به Lighthouse 100 رسید.",
			categoryId: blogCat.id,
		},
	]
	for (const p of posts) {
		await prisma.post.upsert({
			where: { slug: p.slug },
			update: {},
			create: {
				...p,
				status: PostStatus.PUBLISHED,
				publishedAt: new Date(),
				readingTime: readingTime(p.content),
				authorId: admin.id,
				tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }] },
			},
		})
	}

	// ---------------- Projects (2) ----------------
	const projects = [
		{
			title: "وب‌سایت شرکت آریا تک", slug: "aria-tech", client: "آریا تک",
			year: 2024, technologies: ["Next.js", "TypeScript", "Tailwind"],
			features: ["طراحی ریسپانسیو", "پنل مدیریت", "سئوی پیشرفته"],
			summary: "طراحی کامل وب‌سایت شرکتی با پنل مدیریت اختصاصی.",
			content: "شرکت آریا تک به دنبال یک حضور دیجیتال حرفه‌ای بود که اعتبار برند را منعکس کند.\n\nما یک وب‌سایت شرکتی کامل با پنل مدیریت اختصاصی طراحی کردیم که تیم آریا تک بتواند محتوا را به‌راحتی مدیریت کند.",
			featured: true, categoryId: portfolioCat.id,
		},
		{
			title: "فروشگاه آنلاین مانا", slug: "mana-shop", client: "مانا",
			year: 2025, technologies: ["Next.js", "Prisma", "PostgreSQL"],
			features: ["سبد خرید", "درگاه پرداخت", "مدیریت محصولات"],
			summary: "پیاده‌سازی فروشگاه اینترنتی سریع و امن.",
			content: "فروشگاه مانا با هدف ارائه‌ی تجربه‌ی خرید سریع و امن طراحی شد.\n\nبا اتصال به درگاه پرداخت امن و پنل مدیریت محصولات، مانا توانست فروش آنلاین خود را آغاز کند.",
			featured: true, categoryId: portfolioCat.id,
		},
	]
	for (const [i, pr] of projects.entries()) {
		await prisma.project.upsert({
			where: { slug: pr.slug },
			update: { content: pr.content, summary: pr.summary },
			create: { ...pr, order: i },
		})
	}

	// ---------------- Plans (3) ----------------
	const plans = [
		{ name: "پایه", slug: "basic", price: 15000000, description: "مناسب کسب‌وکارهای نوپا", features: ["تا ۵ صفحه", "طراحی ریسپانسیو", "سئوی پایه", "۳ ماه پشتیبانی"], order: 0 },
		{ name: "حرفه‌ای", slug: "pro", price: 35000000, description: "محبوب‌ترین پلن", features: ["تا ۱۵ صفحه", "پنل مدیریت", "وبلاگ", "سئوی پیشرفته", "۶ ماه پشتیبانی"], highlighted: true, order: 1 },
		{ name: "سازمانی", slug: "enterprise", price: 0, period: "سفارشی", description: "راهکار اختصاصی", features: ["صفحات نامحدود", "توسعه‌ی اختصاصی", "یکپارچگی API", "پشتیبانی ۱۲ ماهه"], order: 2 },
	]
	for (const pl of plans) {
		await prisma.plan.upsert({ where: { slug: pl.slug }, update: pl, create: pl })
	}

	// ---------------- FAQs ----------------
	const faqs = [
		{ question: "طراحی وب‌سایت چقدر طول می‌کشد؟", answer: "بسته به پیچیدگی پروژه، معمولاً بین ۲ تا ۸ هفته.", category: "عمومی", order: 0 },
		{ question: "آیا پشتیبانی ارائه می‌دهید؟", answer: "بله، همه‌ی پروژه‌ها شامل دوره‌ی پشتیبانی هستند.", category: "پشتیبانی", order: 1 },
		{ question: "آیا سایت ریسپانسیو است؟", answer: "بله، تمام پروژه‌ها برای همه‌ی دستگاه‌ها بهینه می‌شوند.", category: "فنی", order: 2 },
	]
	await prisma.faq.deleteMany()
	await prisma.faq.createMany({ data: faqs })

	// ---------------- Settings ----------------
	const settings = [
		{ key: "general", value: { siteName: "ویرگول · Virgule Studio", tagline: "ویرگول؛ مکثی که دیده می‌شود", email: "info@virgule.studio", phone: "09999571001", address: "", workingHours: "شنبه تا پنج‌شنبه ۹ تا ۱۸", description: "استودیوی طراحی و توسعه‌ی وب ویرگول" } },
		{ key: "social", value: { instagram: "", linkedin: "", twitter: "", telegram: "", github: "", whatsapp: "" } },
		{ key: "seo", value: { metaTitle: "ویرگول | استودیوی طراحی و توسعه‌ی وب", metaDescription: "طراحی و پیاده‌سازی وب‌سایت‌های حرفه‌ای.", keywords: "طراحی سایت، طراحی فروشگاه، سئو", ogImage: "" } },
	]
	for (const st of settings) {
		await prisma.setting.upsert({ where: { key: st.key }, update: { value: st.value }, create: st })
	}

	console.log("✅ Seed کامل شد.")
	console.log(`👤 ادمین (مدیر کل): ${admin.email}`)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
