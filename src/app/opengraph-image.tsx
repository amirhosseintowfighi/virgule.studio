import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "ویرگول — استودیوی طراحی و توسعه‌ی وب"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage() {
	const wrapperStyle: React.CSSProperties = {
		height: "100%",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#4f46e5",
		color: "#ffffff",
	}
	const brandStyle: React.CSSProperties = { fontSize: 96, fontWeight: 800 }
	const sloganStyle: React.CSSProperties = { fontSize: 44, marginTop: 16, opacity: 0.9 }

	return new ImageResponse(
		(
			<div style={wrapperStyle}>
				<div style={brandStyle}>Virgule</div>
				<div style={sloganStyle}>مکثی که دیده می‌شود</div>
			</div>
		),
		{ ...size }
	)
}
