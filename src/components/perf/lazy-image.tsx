import Image from "next/image"

type Props = {
	src: string
	alt: string
	width: number
	height: number
	priority?: boolean
	className?: string
}

// تصویر بهینه با lazy-loading، blur placeholder و ابعاد پاسخگو
export function LazyImage({ src, alt, width, height, priority, className }: Props) {
	return (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			priority={priority}
			loading={priority ? "eager" : "lazy"}
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			quality={82}
			className={className}
		/>
	)
}
