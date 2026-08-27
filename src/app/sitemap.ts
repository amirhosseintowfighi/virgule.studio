export const dynamic = "force-dynamic"

import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"
import { PostStatus } from "@prisma/client"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://virgule.studio"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticRoutes = [
		"",
		"/services",
		"/portfolio",
		"/blog",
		"/pricing",
		"/about",
		"/contact",
		"/faq",
	].map((path) => ({
		url: `${BASE}${path}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: path === "" ? 1 : 0.8,
	}))

	const [posts, services, projects] = await Promise.all([
		prisma.post.findMany({
			where: { status: PostStatus.PUBLISHED },
			select: { slug: true, updatedAt: true },
		}),
		prisma.service.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
		prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
	])

	const dynamicRoutes = [
		...posts.map((p) => ({ url: `${BASE}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
		...services.map((s) => ({ url: `${BASE}/services/${s.slug}`, lastModified: s.updatedAt, priority: 0.7 })),
		...projects.map((p) => ({ url: `${BASE}/portfolio/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
	]

	return [...staticRoutes, ...dynamicRoutes]
}
