import prisma from "@/lib/prisma"
import { requirePermission } from "@/lib/rbac"
import { EntityForm, type FormField } from "@/components/admin/entity-form"
import { saveSettingGroup } from "@/server/actions/settings"

type Dict = Record<string, string>

function groupValue(value: unknown): Dict {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const out: Dict = {}
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			out[k] = v == null ? "" : String(v)
		}
		return out
	}
	return {}
}

export default async function SettingsAdminPage() {
	await requirePermission("setting:manage")
	const settings = await prisma.setting.findMany()
	const map = new Map(settings.map((s) => [s.key, groupValue(s.value)]))
	const general = map.get("general") ?? {}
	const social = map.get("social") ?? {}
	const seo = map.get("seo") ?? {}

	const generalFields: FormField[] = [
		{ name: "siteName", label: "نام سایت", defaultValue: general.siteName ?? "ویرگول · Virgule Studio", full: false },
		{ name: "tagline", label: "شعار", defaultValue: general.tagline ?? "ویرگول؛ مکثی که دیده می‌شود", full: false },
		{ name: "email", label: "ایمیل", defaultValue: general.email ?? "info@virgule.studio", full: false },
		{ name: "phone", label: "تلفن", defaultValue: general.phone ?? "09999571001", full: false },
		{ name: "address", label: "آدرس", defaultValue: general.address ?? "", full: false },
		{ name: "workingHours", label: "ساعات کاری", defaultValue: general.workingHours ?? "شنبه تا پنج‌شنبه ۹ تا ۱۸", full: false },
		{ name: "description", label: "معرفی کوتاه برند", type: "textarea", rows: 3, defaultValue: general.description ?? "" },
	]

	const socialFields: FormField[] = [
		{ name: "instagram", label: "اینستاگرام", defaultValue: social.instagram ?? "", placeholder: "https://instagram.com/...", full: false },
		{ name: "linkedin", label: "لینکدین", defaultValue: social.linkedin ?? "", full: false },
		{ name: "telegram", label: "تلگرام", defaultValue: social.telegram ?? "", full: false },
		{ name: "twitter", label: "ایکس (توییتر)", defaultValue: social.twitter ?? "", full: false },
		{ name: "github", label: "گیت‌هاب", defaultValue: social.github ?? "", full: false },
		{ name: "whatsapp", label: "واتس‌اپ", defaultValue: social.whatsapp ?? "", full: false },
	]

	const seoFields: FormField[] = [
		{ name: "metaTitle", label: "عنوان پیش‌فرض (Meta Title)", defaultValue: seo.metaTitle ?? "", full: false },
		{ name: "keywords", label: "کلمات کلیدی", defaultValue: seo.keywords ?? "", full: false },
		{ name: "metaDescription", label: "توضیحات پیش‌فرض (Meta Description)", type: "textarea", rows: 3, defaultValue: seo.metaDescription ?? "" },
		{ name: "ogImage", label: "تصویر اشتراک‌گذاری (OG Image)", type: "url", defaultValue: seo.ogImage ?? "" },
	]

	const generalHidden = { _key: "general" }
	const socialHidden = { _key: "social" }
	const seoHidden = { _key: "seo" }

	return (
		<div className="space-y-10">
			<div>
				<h1 className="text-2xl font-extrabold">تنظیمات و محتوا</h1>
				<p className="mt-1 text-sm text-[var(--color-muted)]">
					اطلاعات برند، راه‌های ارتباطی و تنظیمات سئوی پیش‌فرض سایت را اینجا ویرایش کنید.
				</p>
			</div>

			<section className="space-y-4">
				<h2 className="text-lg font-bold">⚙️ اطلاعات برند</h2>
				<EntityForm action={saveSettingGroup} fields={generalFields} hidden={generalHidden} submitLabel="ذخیره‌ی اطلاعات برند" />
			</section>

			<section className="space-y-4">
				<h2 className="text-lg font-bold">🔗 شبکه‌های اجتماعی</h2>
				<EntityForm action={saveSettingGroup} fields={socialFields} hidden={socialHidden} submitLabel="ذخیره‌ی شبکه‌ها" />
			</section>

			<section className="space-y-4">
				<h2 className="text-lg font-bold">🔍 سئوی پیش‌فرض</h2>
				<EntityForm action={saveSettingGroup} fields={seoFields} hidden={seoHidden} submitLabel="ذخیره‌ی تنظیمات سئو" />
			</section>

			<section className="border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-6">
				<h2 className="mb-2 text-lg font-bold">🧩 ویرایشگر بصری صفحات (فاز بعدی)</h2>
				<p className="text-sm leading-7 text-[var(--color-muted)]">
					محتوای صفحات خدمات و نمونه‌کارها را هم‌اکنون می‌توانید به‌طور کامل از بخش‌های «خدمات» و «نمونه‌کارها» ویرایش کنید (عنوان، خلاصه، متن کامل چند‌پاراگرافی، ویژگی‌ها و...).
					یک «ویرایشگر بصری کشیدن‌ورهاکردنی» کامل (شبیه المنتور) یک پروژه‌ی بزرگ جداگانه است که در فاز بعدی قابل افزودن است.
				</p>
			</section>
		</div>
	)
}
