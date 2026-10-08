import React from "react";
import { SITE_IMAGES, useSiteImages } from "../../utils/images";

/**
 * Gambar yang otomatis memakai URL Firebase Storage bila tersedia,
 * dan jatuh kembali ke aset lokal yang dibundel.
 *
 * Pemakaian:
 *   <SiteImage k="fasilitas/kamar.webp" alt="Kamar" className="..." />
 *
 * Semua props lain diteruskan ke elemen <img>.
 */
export default function SiteImage({ k, ...props }) {
  const { get } = useSiteImages();
  const src = get(k);
  const meta = SITE_IMAGES[k];

  if (!src) return null;
  return <img src={src} alt={props.alt || meta?.label || ""} {...props} />;
}
