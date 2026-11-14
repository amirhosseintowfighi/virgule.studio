import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Virgule Studio — web design and development, Tehran"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * تصویر اشتراک‌گذاری. متن لاتین است چون موتورِ این تصویر حروف فارسی را به هم
 * وصل نمی‌کند؛ خودِ ترکیب همان زبانِ برداریِ سایت است (دایره، ربع، خطِ قلم).
 */
export default async function OgImage() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 90px",
					backgroundColor: "#f3f1ec",
					color: "#141413",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>Virgule</div>
					<div style={{ fontSize: 34, marginTop: 22, color: "#55524c" }}>Web design &amp; development studio</div>
					<div style={{ fontSize: 26, marginTop: 10, color: "#c63d1f" }}>virgule.studio</div>
				</div>
				<svg width="420" height="420" viewBox="0 0 420 420">
					<rect x="230" y="20" width="170" height="170" fill="#dad6cb" />
					<circle cx="200" cy="240" r="150" fill="#2f48b8" />
					<path d="M50 240A150 150 0 0 0 200 390V240Z" fill="#dc4a2a" />
					<circle cx="330" cy="90" r="40" fill="#e2a93a" />
					<line x1="410" y1="10" x2="20" y2="400" stroke="#141413" strokeWidth="3" />
				</svg>
			</div>
		),
		{ ...size }
	)
}
