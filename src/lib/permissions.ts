// منبع واحد حقیقت برای نقش‌ها و دسترسی‌ها
// هم‌در بخش ادمین و هم در seed استفاده می‌شود.

export const PERMISSIONS: { key: string; label: string; group: string }[] = [
	{ key: "post:read", label: "مشاهده مقالات", group: "مقالات" },
	{ key: "post:write", label: "ایجاد و ویرایش مقاله", group: "مقالات" },
	{ key: "post:publish", label: "انتشار مقاله", group: "مقالات" },
	{ key: "post:delete", label: "حذف مقاله", group: "مقالات" },
	{ key: "project:read", label: "مشاهده نمونه‌کارها", group: "نمونه‌کارها" },
	{ key: "project:write", label: "ایجاد و ویرایش نمونه‌کار", group: "نمونه‌کارها" },
	{ key: "project:delete", label: "حذف نمونه‌کار", group: "نمونه‌کارها" },
	{ key: "service:read", label: "مشاهده خدمات", group: "خدمات" },
	{ key: "service:write", label: "ایجاد و ویرایش خدمت", group: "خدمات" },
	{ key: "service:delete", label: "حذف خدمت", group: "خدمات" },
	{ key: "form:read", label: "مشاهده فرم‌های دریافتی", group: "فرم‌ها" },
	{ key: "user:read", label: "مشاهده کاربران", group: "کاربران" },
	{ key: "user:write", label: "ایجاد و ویرایش کاربر", group: "کاربران" },
	{ key: "user:delete", label: "حذف کاربر", group: "کاربران" },
	{ key: "setting:manage", label: "مدیریت تنظیمات و محتوای صفحات", group: "تنظیمات" },
]

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key)

export type RoleDef = {
	name: string
	label: string
	description: string
	/** "ALL" یعنی همه‌ی دسترسی‌ها */
	permissions: string[] | "ALL"
}

export const ROLES: RoleDef[] = [
	{
		name: "SUPER_ADMIN",
		label: "مدیر کل",
		description: "دسترسی کامل به همه‌ی بخش‌ها و مدیریت مدیران",
		permissions: "ALL",
	},
	{
		name: "ADMIN",
		label: "مدیر",
		description: "دسترسی کامل؛ فقط نمی‌تواند مدیر کل را حذف یا ویرایش کند",
		permissions: "ALL",
	},
	{
		name: "CONTENT",
		label: "تولید محتوا",
		description: "مدیریت مقالات، نمونه‌کارها و خدمات",
		permissions: [
			"post:read",
			"post:write",
			"post:publish",
			"project:read",
			"project:write",
			"service:read",
			"service:write",
		],
	},
	{
		name: "SUPPORT",
		label: "پشتیبان",
		description: "مشاهده‌ی فرم‌های دریافتی و محتوا",
		permissions: ["form:read", "post:read", "project:read", "service:read"],
	},
]

// نقش‌هایی که دسترسی کامل دارند
export const FULL_ACCESS_ROLES = ["SUPER_ADMIN", "ADMIN"]
export const SUPER_ADMIN_ROLE = "SUPER_ADMIN"

export function roleLabel(name: string): string {
	return ROLES.find((r) => r.name === name)?.label ?? name
}

export function permissionsForRole(name: string): string[] {
	const role = ROLES.find((r) => r.name === name)
	if (!role) return []
	return role.permissions === "ALL" ? ALL_PERMISSION_KEYS : role.permissions
}
