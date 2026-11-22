import React from "react";
import { SITE_IMAGES, useSiteImages } from "../../utils/images";

/**
 * Gambar yang otomatis memakai URL Firebase Storage bila tersedia,
 * dan jatuh kembali ke aset lokal yang dibundel.
 *
 * Dioptimalkan untuk performa Core Web Vitals:
 * - Default loading="lazy" & decoding="async" (eager hanya untuk hero / above the fold)
 * - Resolusi cerdas untuk logo kecil -> SVG lokal
 * - Dukungan srcSet dan sizes untuk responsive image loading
 */
export default function SiteImage({
  k,
  alt,
  loading = "lazy",
  decoding = "async",
  srcSet,
  sizes,
  width,
  height,
  className,
  ...props
}) {
  const { get } = useSiteImages();
  let src = get(k);
  const meta = SITE_IMAGES[k];

  if (!src) return null;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt || meta?.label || "Gambar Asrama IPB Sukasari"}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
}
