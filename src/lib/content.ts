import prisma from "@/lib/prisma"
import { safe } from "@/lib/safe"

/**
 * متن‌های صفحه‌های عمومی.
 *
 * هر متن اینجا یک مقدار پیش‌فرض دارد و مدیر می‌تواند از پنل بازنویسی‌اش کند.
 * مقادیر بازنویسی‌شده در جدول Setting با کلید `content:<group>` ذخیره می‌شوند،
 * پس نه مهاجرت لازم است نه جدول تازه.
 *
 * ponytail: فهرست‌ها به‌جای یک ویرایشگر تکرارشونده، به‌صورت متن چندخطی ذخیره
 * می‌شوند (هر خط یک مورد؛ برای جفت‌ها «عنوان | توضیح»). اگر روزی ویرایش
 * فهرست‌ها سنگین شد، همان‌جا می‌شود یک UI تکرارشونده گذاشت.
 */

export type ContentFieldType = "text" | "textarea" | "list" | "pairs"

export type ContentField = {
	name: string
	label: string
	type: ContentFieldType
	def: string
	help?: string
	rows?: number
}

export type ContentGroup = {
	key: string
	title: string
	/** مسیرهایی که بعد از ذخیره باید دوباره ساخته شوند */
	paths: string[]
	fields: ContentField[]
}

const PAIR_HELP = "هر مورد در یک خط، به شکل «عنوان | توضیح»."
const LIST_HELP = "هر مورد را در یک خط جدا بنویسید."

export const CONTENT_GROUPS: ContentGroup[] = [
	{
		key: "home",
		title: "صفحه‌ی اصلی",
		paths: ["/"],
		fields: [
			{ name: "heroLine1", label: "تیتر اصلی — خط اول", type: "text", def: "مکثی که" },
			{ name: "heroLine2", label: "تیتر اصلی — خط دوم", type: "text", def: "دیده" },
			{ name: "heroAccent", label: "تیتر اصلی — واژه‌ی طلایی", type: "text", def: "می‌شود" },
			{
				name: "heroLead",
				label: "جمله‌ی زیر تیتر",
				type: "textarea",
				rows: 2,
				def: "طراحی و توسعه‌ی وب‌سایت اختصاصی — برای برندهایی که نمی‌خواهند شبیه بقیه باشند.",
			},
			{ name: "heroCtaPrimary", label: "دکمه‌ی اصلی", type: "text", def: "دریافت مشاوره‌ی رایگان" },
			{ name: "heroCtaSecondary", label: "دکمه‌ی دوم", type: "text", def: "دیدن نمونه‌کارها" },

			{ name: "servicesLine1", label: "خدمات — تیتر خط اول", type: "text", def: "چه کاری برای" },
			{ name: "servicesLine2", label: "خدمات — تیتر خط دوم", type: "text", def: "شما انجام می‌دهیم" },
			{
				name: "servicesLead",
				label: "خدمات — توضیح",
				type: "textarea",
				rows: 2,
				def: "هر پروژه بر اساس هدف و مخاطب همان کسب‌وکار طراحی می‌شود.",
			},

			{ name: "workLine1", label: "نمونه‌کارها — تیتر خط اول", type: "text", def: "کارهایی که" },
			{ name: "workLine2", label: "نمونه‌کارها — تیتر خط دوم", type: "text", def: "ساخته‌ایم" },
			{
				name: "workLead",
				label: "نمونه‌کارها — توضیح",
				type: "textarea",
				rows: 2,
				def: "بکشید یا از دکمه‌ها استفاده کنید. روی هر کار بزنید تا مسئله و تصمیم‌های طراحی‌اش را ببینید.",
			},
			{ name: "workCta", label: "نمونه‌کارها — دکمه", type: "text", def: "مشاهده‌ی بیشتر" },

			{ name: "processLine1", label: "روش کار — تیتر خط اول", type: "text", def: "چطور کار" },
			{ name: "processLine2", label: "روش کار — تیتر خط دوم", type: "text", def: "می‌کنیم" },
			{
				name: "processLead",
				label: "روش کار — توضیح",
				type: "textarea",
				rows: 2,
				def: "پنج مرحله‌ی روشن، از اولین جلسه تا سه ماه بعد از انتشار. در هر مرحله می‌دانید کجای کار هستید و قدم بعدی چیست.",
			},
			{
				name: "process",
				label: "روش کار — مراحل",
				type: "pairs",
				help: PAIR_HELP,
				rows: 7,
				def: [
					"کشف | کسب‌وکار، رقبا و مخاطب شما را می‌شناسیم و مشخص می‌کنیم سایت باید چه کاری انجام دهد. مهم‌ترین خروجی این مرحله، تصمیم درباره‌ی چیزهایی است که نباید ساخته شوند.",
					"معماری اطلاعات | ساختار صفحات، مسیر حرکت کاربر و کلمات کلیدی هدف اینجا تعیین می‌شود — پیش از طراحی بصری، تا سئو تصمیمِ آخر نباشد.",
					"طراحی | تایپوگرافی، رنگ، فاصله و ریتم بصری روی هویت برند شما بنا می‌شود. طرح را در مرورگر و روی موبایل می‌بینید، نه فقط به‌صورت تصویر ثابت.",
					"پیاده‌سازی | کد تمیز و تایپ‌دار با Next.js و TypeScript. دسترس‌پذیری، سرعت بارگذاری و امنیت فرم‌ها از ابتدا در نظر گرفته می‌شود.",
					"انتشار و پشتیبانی | راه‌اندازی روی زیرساخت شما، اتصال به سرچ کنسول، آموزش پنل مدیریت و پایش سه‌ماهه‌ی سرعت و خطاها.",
				].join("\n"),
			},

			{ name: "assurancesLine1", label: "تعهدها — تیتر خط اول", type: "text", def: "بدون ابهام،" },
			{ name: "assurancesLine2", label: "تعهدها — تیتر خط دوم", type: "text", def: "بدون غافلگیری" },
			{
				name: "assurances",
				label: "تعهدها",
				type: "pairs",
				help: PAIR_HELP,
				rows: 6,
				def: [
					"قیمت و زمان، پیش از شروع | فهرست دقیق کارها، زمان‌بندی مرحله‌به‌مرحله و هزینه‌ی نهایی را مکتوب دریافت می‌کنید. «این خارج از قرارداد بود» در کار ما وجود ندارد.",
					"کد و داده، مال شماست | پروژه روی دامنه و سرور خودتان اجرا می‌شود و مخزن کد را تحویل می‌گیرید. هر توسعه‌دهنده‌ی دیگری می‌تواند کار را ادامه دهد.",
					"سرعت، بخشی از طراحی است | Core Web Vitals از روز اول در معماری صفحه دیده می‌شود، نه به‌عنوان کارِ بعد از تحویل. سایت کند، هم رتبه را از دست می‌دهد هم مشتری را.",
					"پشتیبانی بعد از تحویل | پنل مدیریت را به تیم شما آموزش می‌دهیم و تا سه ماه پس از انتشار، رفع اشکال و راهنمایی فنی بدون هزینه‌ی جداگانه است.",
				].join("\n"),
			},

			{ name: "aboutLine1", label: "درباره — تیتر خط اول", type: "text", def: "اسم ما از یک" },
			{ name: "aboutLine2", label: "درباره — تیتر خط دوم", type: "text", def: "علامت نگارشی می‌آید." },
			{
				name: "aboutPull",
				label: "درباره — نقل‌قول برجسته",
				type: "textarea",
				rows: 3,
				def: "مکث‌ها — فاصله‌ها، ریتم، چیزهایی که حذف می‌شوند — تفاوت یک وب‌سایت معمولی و یک وب‌سایت ماندگار را می‌سازند.",
			},
			{
				name: "aboutP1",
				label: "درباره — بند اول",
				type: "textarea",
				rows: 3,
				def: "ویرگول همان علامت کوچکی است که در میان متن، مکث می‌سازد. باور ما این است که همین مکث‌ها هستند که یک صفحه را خواندنی می‌کنند — و همین منطق را به وب‌سایت هم می‌آوریم: کمتر، ولی درست.",
			},
			{
				name: "aboutP2",
				label: "درباره — بند دوم",
				type: "textarea",
				rows: 3,
				def: "طراحی و مهندسی را از هم جدا نمی‌کنیم. همان کسی که چیدمان را می‌چیند، کدش را هم می‌نویسد؛ پس هیچ‌چیز در فاصله‌ی بین طرح و پیاده‌سازی گم نمی‌شود.",
			},

			{ name: "faqLine1", label: "پرسش‌ها — تیتر خط اول", type: "text", def: "سوال‌های" },
			{ name: "faqLine2", label: "پرسش‌ها — تیتر خط دوم", type: "text", def: "پرتکرار" },
			{
				name: "faqLead",
				label: "پرسش‌ها — توضیح",
				type: "textarea",
				rows: 2,
				def: "اگر جواب سوال شما اینجا نبود، بپرسید — همان روز کاری پاسخ می‌دهیم.",
			},

			{ name: "contactLine1", label: "تماس — تیتر خط اول", type: "text", def: "پروژه‌ای در" },
			{ name: "contactLine2", label: "تماس — تیتر خط دوم", type: "text", def: "ذهن دارید؟" },
			{
				name: "contactLead",
				label: "تماس — توضیح",
				type: "textarea",
				rows: 3,
				def: "جلسه‌ی اول رایگان است و بدون هیچ الزامی: درباره‌ی هدف پروژه حرف می‌زنیم و صادقانه می‌گوییم که آیا ما گزینه‌ی درستی برای آن هستیم یا نه.",
			},
			{ name: "contactCta", label: "تماس — دکمه", type: "text", def: "ثبت درخواست پروژه" },
		],
	},

	{
		key: "about",
		title: "صفحه‌ی درباره‌ی ما",
		paths: ["/about"],
		fields: [
			{ name: "headLine1", label: "تیتر — خط اول", type: "text", def: "ویرگول یک استودیوی" },
			{ name: "headLine2", label: "تیتر — خط دوم", type: "text", def: "طراحی و توسعه‌ی وب است" },
			{
				name: "headLead",
				label: "توضیح زیر تیتر",
				type: "textarea",
				rows: 2,
				def: "مستقر در تهران، از سال ۱۴۰۰. تیم کوچکی که ترجیح می‌دهد پروژه‌های کم ولی درست تحویل بدهد.",
			},
			{
				name: "storyLead",
				label: "داستان — بند برجسته",
				type: "textarea",
				rows: 3,
				def: "اسم ما از همان علامت کوچکی می‌آید که در میان متن، مکث می‌سازد. باور ما این است که همین مکث‌ها — فاصله‌ها، ریتم، چیزهایی که حذف می‌شوند — تفاوت یک وب‌سایت معمولی و یک وب‌سایت ماندگار را می‌سازند.",
			},
			{
				name: "storyP1",
				label: "داستان — بند اول",
				type: "textarea",
				rows: 3,
				def: "بیشتر سایت‌های شرکتی شبیه هم‌اند، چون از ظاهر شروع می‌شوند. ما از جای دیگری شروع می‌کنیم: از اینکه کسب‌وکار شما چه می‌فروشد، به چه کسی، و چه چیزی جلوی تصمیم مشتری را می‌گیرد. طراحی، جوابِ همین سه پرسش است.",
			},
			{
				name: "storyP2",
				label: "داستان — بند دوم",
				type: "textarea",
				rows: 3,
				def: "طراحی و مهندسی را از هم جدا نمی‌کنیم. همان کسی که چیدمان را می‌چیند، کدش را هم می‌نویسد. نتیجه این است که هیچ‌چیز در فاصله‌ی بین طرح و پیاده‌سازی گم نمی‌شود و سایت دقیقاً همان‌طور کار می‌کند که دیده‌اید — با همان سرعت و همان جزئیات.",
			},

			{ name: "valuesLine1", label: "ارزش‌ها — تیتر خط اول", type: "text", def: "به چه چیزی" },
			{ name: "valuesLine2", label: "ارزش‌ها — تیتر خط دوم", type: "text", def: "پایبندیم" },
			{
				name: "values",
				label: "ارزش‌ها",
				type: "pairs",
				help: PAIR_HELP,
				rows: 6,
				def: [
					"تمرکز بر نتیجه | هر تصمیم طراحی و فنی با یک پرسش سنجیده می‌شود: آیا این کار به هدف کسب‌وکار شما کمک می‌کند؟ زیبایی‌ای که فروش، اعتماد یا رتبه نیاورد، تزئین است و ما تزئین نمی‌فروشیم.",
					"جزئیات را به بعد موکول نمی‌کنیم | حالت‌های خطا، صفحه‌ی خالی، اینترنت کند، صفحه‌خوان و موبایل‌های کوچک از همان ابتدا بخشی از طراحی‌اند. چیزی که در یک دموی سریع خوب به نظر می‌رسد، لزوماً در دست کاربر واقعی خوب کار نمی‌کند.",
					"همکاری شفاف | در هر مرحله می‌دانید چه چیزی ساخته شده، چه چیزی مانده و قدم بعدی چیست. خبر بد را هم زود می‌گوییم؛ دیر گفتنش فقط هزینه‌اش را بیشتر می‌کند.",
				].join("\n"),
			},

			{ name: "boundaryLine1", label: "مرز کار — تیتر خط اول", type: "text", def: "هر پروژه‌ای را" },
			{ name: "boundaryLine2", label: "مرز کار — تیتر خط دوم", type: "text", def: "قبول نمی‌کنیم" },
			{
				name: "boundaryLead",
				label: "مرز کار — توضیح",
				type: "textarea",
				rows: 3,
				def: "ترجیح می‌دهیم پیش از قرارداد بگوییم پروژه‌ای به ما نمی‌خورد، تا بعدش هر دو طرف پشیمان شویم. در این حالت شما را به گزینه‌ی مناسب‌تری ارجاع می‌دهیم.",
			},
			{
				name: "notForUs",
				label: "مرز کار — موارد",
				type: "list",
				help: LIST_HELP,
				rows: 5,
				def: [
					"پروژه‌هایی که باید در چند روز تحویل شوند و کیفیت در آن‌ها اولویت دوم است.",
					"سفارش‌هایی که خروجی‌شان کپی یک سایت موجود باشد.",
					"کارهایی که فقط «طراحی گرافیکی بدون پیاده‌سازی» می‌خواهند؛ ما این دو را جدا نمی‌کنیم.",
				].join("\n"),
			},

			{ name: "ctaLine1", label: "پایان — تیتر خط اول", type: "text", def: "با هم کار" },
			{ name: "ctaLine2", label: "پایان — تیتر خط دوم", type: "text", def: "کنیم؟" },
			{
				name: "ctaLead",
				label: "پایان — توضیح",
				type: "textarea",
				rows: 3,
				def: "جلسه‌ی اول رایگان است و هیچ الزامی برای همکاری ندارد. درباره‌ی هدف پروژه حرف می‌زنیم و صادقانه می‌گوییم که آیا ما گزینه‌ی درستی برای آن هستیم یا نه.",
			},
		],
	},

	{
		key: "services",
		title: "صفحه‌ی خدمات",
		paths: ["/services"],
		fields: [
			{ name: "headLine1", label: "تیتر — خط اول", type: "text", def: "چه کاری برای" },
			{ name: "headLine2", label: "تیتر — خط دوم", type: "text", def: "شما انجام می‌دهیم" },
			{
				name: "headLead",
				label: "توضیح زیر تیتر",
				type: "textarea",
				rows: 3,
				def: "فهرست زیر کارهایی است که واقعاً انجام می‌دهیم — اگر کاری اینجا نیست، یعنی سراغش نمی‌رویم. هر پروژه بر اساس هدف و مخاطب همان کسب‌وکار طراحی می‌شود.",
			},
			{ name: "ctaLine1", label: "پایان — تیتر خط اول", type: "text", def: "مطمئن نیستید" },
			{ name: "ctaLine2", label: "پایان — تیتر خط دوم", type: "text", def: "کدام را لازم دارید؟" },
			{
				name: "ctaLead",
				label: "پایان — توضیح",
				type: "textarea",
				rows: 3,
				def: "لازم نیست از قبل بدانید. در جلسه‌ی اول — که رایگان است — هدف کسب‌وکارتان را می‌شنویم و می‌گوییم چه چیزی واقعاً لازم دارید و چه چیزی را نباید بسازید.",
			},
		],
	},

	{
		key: "portfolio",
		title: "صفحه‌ی نمونه‌کارها",
		paths: ["/portfolio"],
		fields: [
			{ name: "headLine1", label: "تیتر — خط اول", type: "text", def: "کارهایی که" },
			{ name: "headLine2", label: "تیتر — خط دوم", type: "text", def: "ساخته‌ایم" },
			{
				name: "headLead",
				label: "توضیح زیر تیتر",
				type: "textarea",
				rows: 3,
				def: "هر پروژه با هدف مشخصی شروع شده و کامل تحویل داده شده است. روی هر کار بزنید تا مسئله، تصمیم‌های طراحی و تکنولوژی‌های به‌کاررفته را ببینید.",
			},
			{ name: "ctaLine1", label: "پایان — تیتر خط اول", type: "text", def: "کار بعدی" },
			{ name: "ctaLine2", label: "پایان — تیتر خط دوم", type: "text", def: "مال شما باشد؟" },
			{
				name: "ctaLead",
				label: "پایان — توضیح",
				type: "textarea",
				rows: 2,
				def: "پروژه‌تان را برایمان تعریف کنید. جلسه‌ی اول رایگان است و اگر کار به ما نخورد، همان‌جا صادقانه می‌گوییم.",
			},
		],
	},

	{
		key: "contact",
		title: "صفحه‌ی تماس",
		paths: ["/contact"],
		fields: [
			{ name: "headLine1", label: "تیتر — خط اول", type: "text", def: "پروژه‌ای در" },
			{ name: "headLine2", label: "تیتر — خط دوم", type: "text", def: "ذهن دارید؟" },
			{
				name: "headLead",
				label: "توضیح زیر تیتر",
				type: "textarea",
				rows: 3,
				def: "فرم را پر کنید یا مستقیم تماس بگیرید — هر کدام راحت‌تر است. معمولاً همان روز کاری پاسخ می‌دهیم و جلسه‌ی اول رایگان و بدون تعهد است.",
			},
			{ name: "formTitle", label: "عنوان فرم", type: "text", def: "پیام‌تان را بنویسید" },
			{ name: "priceLine1", label: "هزینه — تیتر خط اول", type: "text", def: "هزینه‌ی پروژه" },
			{ name: "priceLine2", label: "هزینه — تیتر خط دوم", type: "text", def: "چطور تعیین می‌شود؟" },
			{
				name: "priceBody",
				label: "هزینه — توضیح",
				type: "textarea",
				rows: 4,
				def: "تعرفه‌ی ثابتی اعلام نمی‌کنیم، چون هیچ دو پروژه‌ای مثل هم نیستند. بعد از جلسه‌ی اول و روشن‌شدن دامنه‌ی کار، یک پیشنهاد مکتوب با فهرست دقیق کارها، زمان‌بندی و هزینه‌ی نهایی دریافت می‌کنید — پیش از اینکه چیزی امضا شود.",
			},
			{ name: "priceCta", label: "هزینه — دکمه", type: "text", def: "دریافت پیشنهاد قیمت" },
		],
	},

	{
		key: "request",
		title: "صفحه‌ی ثبت درخواست پروژه",
		paths: ["/request-project"],
		fields: [
			{ name: "headLine1", label: "تیتر — خط اول", type: "text", def: "پروژه‌تان را" },
			{ name: "headLine2", label: "تیتر — خط دوم", type: "text", def: "برایمان تعریف کنید" },
			{
				name: "headLead",
				label: "توضیح زیر تیتر",
				type: "textarea",
				rows: 3,
				def: "هرچه بیشتر بدانیم، پیشنهاد دقیق‌تری می‌دهیم. پر کردن فرم چند دقیقه بیشتر طول نمی‌کشد و هیچ تعهدی ایجاد نمی‌کند.",
			},
			{ name: "sideTitle", label: "عنوان ستون کناری", type: "text", def: "چه انتظاری داشته باشید" },
			{
				name: "assurances",
				label: "تعهدها",
				type: "pairs",
				help: PAIR_HELP,
				rows: 6,
				def: [
					"پاسخ در کمتر از ۲۴ ساعت | درخواست شما همان روز کاری بررسی و پاسخ داده می‌شود.",
					"مشاوره‌ی رایگان | جلسه‌ی اول بدون هزینه و بدون هیچ الزامی برای همکاری است.",
					"پیشنهاد شفاف | فهرست کارها، زمان‌بندی و هزینه‌ی نهایی را مکتوب دریافت می‌کنید.",
					"بدون فروش تحت فشار | اگر پروژه به ما نمی‌خورد، همان جلسه‌ی اول می‌گوییم.",
				].join("\n"),
			},
			{ name: "formTitle", label: "عنوان فرم", type: "text", def: "اطلاعات پروژه" },
		],
	},

	{
		key: "faq",
		title: "صفحه‌ی پرسش‌های متداول",
		paths: ["/faq"],
		fields: [
			{ name: "headLine1", label: "تیتر — خط اول", type: "text", def: "هر چه" },
			{ name: "headLine2", label: "تیتر — خط دوم", type: "text", def: "باید بدانید" },
			{
				name: "headLead",
				label: "توضیح زیر تیتر",
				type: "textarea",
				rows: 3,
				def: "پیش از تماس، احتمالاً یکی از این‌ها را می‌پرسید. پاسخ‌ها کوتاه و بدون حاشیه‌اند؛ اگر سوال شما اینجا نبود، بپرسید.",
			},
			{ name: "sideNote", label: "یادداشت ستون کناری", type: "text", def: "سوال دیگری دارید؟ همان روز کاری پاسخ می‌دهیم." },
			{ name: "ctaLine1", label: "پایان — تیتر خط اول", type: "text", def: "جواب سوالتان" },
			{ name: "ctaLine2", label: "پایان — تیتر خط دوم", type: "text", def: "اینجا نبود؟" },
			{
				name: "ctaLead",
				label: "پایان — توضیح",
				type: "textarea",
				rows: 3,
				def: "بپرسید. جلسه‌ی اول رایگان است و لازم نیست از قبل بدانید دقیقاً چه می‌خواهید — بخشی از کار ما همین است که کمک کنیم مسئله را روشن کنید.",
			},
		],
	},

	{
		key: "blog",
		title: "صفحه‌ی یادداشت‌ها",
		paths: ["/blog"],
		fields: [
			{ name: "headLine1", label: "تیتر", type: "text", def: "یادداشت‌ها" },
			{
				name: "headLead",
				label: "توضیح زیر تیتر",
				type: "textarea",
				rows: 2,
				def: "آنچه در پروژه‌های واقعی یاد گرفته‌ایم: طراحی رابط کاربری، سرعت سایت، سئوی فنی و تصمیم‌های مهندسی — بدون کلی‌گویی.",
			},
		],
	},
]

export type Content = Record<string, string>

const groupByKey = new Map(CONTENT_GROUPS.map((g) => [g.key, g]))

/** مقادیر پیش‌فرض یک گروه. */
export function defaults(key: string): Content {
	const g = groupByKey.get(key)
	if (!g) return {}
	return Object.fromEntries(g.fields.map((f) => [f.name, f.def]))
}

/**
 * متن‌های یک صفحه: پیش‌فرض‌ها، با هر چیزی که مدیر بازنویسی کرده رویشان.
 * مقدار خالی یعنی «بازنویسی نکرده»، پس پیش‌فرض می‌ماند و صفحه هیچ‌وقت خالی نمی‌شود.
 */
export async function getContent(key: string): Promise<Content> {
	const base = defaults(key)
	const row = await safe(prisma.setting.findUnique({ where: { key: `content:${key}` } }), null)
	const saved = row?.value
	if (!saved || typeof saved !== "object" || Array.isArray(saved)) return base

	const out = { ...base }
	for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
		const s = v == null ? "" : String(v).trim()
		if (s) out[k] = s
	}
	return out
}

/** «عنوان | توضیح» در هر خط → آرایه‌ای از جفت‌ها. خطوط بی‌عنوان دور ریخته می‌شوند. */
export function pairs(value: string | undefined): { t: string; d: string }[] {
	return String(value ?? "")
		.split("\n")
		.map((line) => {
			const [t, ...rest] = line.split("|")
			return { t: (t ?? "").trim(), d: rest.join("|").trim() }
		})
		.filter((p) => p.t.length > 0)
}

/** هر خط یک مورد. */
export function lines(value: string | undefined): string[] {
	return String(value ?? "")
		.split("\n")
		.map((s) => s.trim())
		.filter(Boolean)
}
