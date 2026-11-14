import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Virgule Studio — web design and development, Tehran"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * تصویر اشتراک‌گذاری. متن لاتین است چون موتورِ این تصویر حروف فارسی را به هم
 * وصل نمی‌کند؛ کنارش خودِ نشان می‌نشیند.
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
				{/* نشانِ ویرگول: ویرگول و مربعِ روی خطِ کرسی */}
				<svg width="400" height="400" viewBox="0 0 64 64">
					<path fill="#141413" d="M26 58C18.09 58 12.24 51.81 12.24 43.55C12.24 29.79 21.87 18.1 36.32 11.22C28.06 18.78 23.94 25.66 23.94 30.82C24.62 30.57 25.31 30.48 26 30.48C33.91 30.48 39.76 36.33 39.76 44.24C39.76 51.81 33.91 58 26 58Z" />
					<rect x="46" y="48" width="10" height="10" fill="#c63d1f" />
				</svg>
			</div>
		),
		{ ...size }
	)
}
