import prisma from "@/lib/prisma"
import { requirePermissionPage } from "@/lib/rbac"
import { CONTENT_GROUPS, defaults } from "@/lib/content"
import { savePageText, resetPageText } from "@/server/actions/content"
import { icons } from "@/components/admin/icons"

type Props = { searchParams: Promise<{ saved?: string; reset?: string }> }

const inputCls =
	"w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-base outline-none transition-colors duration-300 focus:border-[var(--color-primary)]"

export default async function ContentAdminPage({ searchParams }: Props) {
	await requirePermissionPage("setting:manage")
	const { saved, reset } = await searchParams

	const rows = await prisma.setting.findMany({ where: { key: { startsWith: "content:" } } })
	const overrides = new Map(
		rows.map((r) => [
			r.key.replace("content:", ""),
			(r.value && typeof r.value === "object" && !Array.isArray(r.value)
				? (r.value as Record<string, unknown>)
				: {}) as Record<string, unknown>,
		])
	)

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-extrabold">متن صفحات</h1>
				<p className="mt-1 text-sm text-[var(--color-muted)]">
					همه‌ی متن‌های صفحه‌های عمومی. هر فیلدی را خالی بگذارید، متن پیش‌فرض همان جا می‌ماند —
					پس صفحه هیچ‌وقت خالی نمی‌شود.
				</p>
			</div>

			{(saved || reset) && (
				<p
					role="status"
					className="rounded-[var(--radius-md)] border border-[var(--color-success)] bg-[var(--color-surface-2)] p-3 text-sm text-[var(--color-success)]"
				>
					{saved ? "متن‌ها ذخیره شد و روی سایت اعمال شد." : "متن‌ها به حالت پیش‌فرض برگشت."}
				</p>
			)}

			{CONTENT_GROUPS.map((group) => {
				const base = defaults(group.key)
				const saved = overrides.get(group.key) ?? {}
				const isOverridden = overrides.has(group.key)

				return (
					<details
						key={group.key}
						className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--elev-1)]"
					>
						<summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-bold">
							<span className="flex items-center gap-3">
								{icons.settings}
								{group.title}
							</span>
							<span className="text-xs font-normal text-[var(--color-muted)]">
								{isOverridden ? "ویرایش‌شده" : "پیش‌فرض"} · {group.fields.length} فیلد
							</span>
						</summary>

						<form action={savePageText} className="border-t border-[var(--color-border)] p-5">
							<input type="hidden" name="_group" value={group.key} />
							<div className="grid gap-5 sm:grid-cols-2">
								{group.fields.map((f) => {
									const current = String(saved[f.name] ?? "")
									const isLong = f.type !== "text"
									return (
										<div key={f.name} className={isLong ? "sm:col-span-2" : ""}>
											<label
												htmlFor={`${group.key}-${f.name}`}
												className="mb-1.5 block text-sm font-medium"
											>
												{f.label}
											</label>
											{isLong ? (
												<textarea
													id={`${group.key}-${f.name}`}
													name={f.name}
													rows={f.rows ?? 3}
													defaultValue={current}
													placeholder={base[f.name]}
													className={inputCls}
												/>
											) : (
												<input
													id={`${group.key}-${f.name}`}
													name={f.name}
													defaultValue={current}
													placeholder={base[f.name]}
													className={inputCls}
												/>
											)}
											{f.help && (
												<p className="mt-1 text-xs text-[var(--color-muted)]">{f.help}</p>
											)}
										</div>
									)
								})}
							</div>

							<div className="mt-6 flex flex-wrap items-center gap-3">
								<button
									type="submit"
									className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-primary-fill)] px-6 py-2.5 text-sm font-bold text-[var(--color-on-primary)] shadow-[var(--elev-1)] transition-colors hover:bg-[var(--color-primary-hover)]"
								>
									ذخیره‌ی {group.title}
								</button>
								<a
									href={group.paths[0]}
									target="_blank"
									rel="noopener noreferrer"
									className="rounded-[var(--radius-full)] border border-[var(--color-border)] px-5 py-2.5 text-sm transition-colors duration-300 hover:bg-[var(--color-surface-2)]"
								>
									دیدن صفحه ↗
								</a>
							</div>
						</form>

						{isOverridden && (
							<form action={resetPageText} className="border-t border-[var(--color-border)] p-5">
								<input type="hidden" name="_group" value={group.key} />
								<button
									type="submit"
									className="text-sm text-[var(--color-error)] underline underline-offset-4"
								>
									بازگرداندن این صفحه به متن‌های پیش‌فرض
								</button>
							</form>
						)}
					</details>
				)
			})}
		</div>
	)
}
