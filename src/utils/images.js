// ============================================================
// Registri gambar website (dipindahkan ke Firebase Storage)
// ------------------------------------------------------------
// Semua gambar yang dibundel di src/assets/img (+ beberapa file
// di /public) didaftarkan di sini. Nilai `default` berasal dari
// aset lokal, dan otomatis ditimpa oleh URL Firebase Storage
// bila tersedia dokumennya di collection "siteImages".
//
// Struktur dokumen Firestore "siteImages":
//   docId  = key   (contoh: "fasilitas/kamar.webp")
//   fields = { url: "<download-url>", path: "site/fasilitas/kamar.webp" }
// ============================================================
import { useEffect, useState } from "react";

export const SITE_IMAGES_COLLECTION = "siteImages";

// Import semua aset gambar secara eager agar URL-nya tersedia sebagai fallback.
const assetModules = import.meta.glob("../assets/img/**/*.{png,jpg,jpeg,webp,svg,gif}", {
  eager: true,
  import: "default",
});

function prettyLabel(key) {
  const file = key.split("/").pop() || key;
  return file
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** @type {Record<string, {default: string, path: string, label: string, type: string}>} */
export const SITE_IMAGES = {};

for (const [rawPath, url] of Object.entries(assetModules)) {
  const key = rawPath.replace("../assets/img/", "");
  SITE_IMAGES[key] = {
    default: url,
    path: `site/images/${key}`,
    label: prettyLabel(key),
    type: "image",
  };
}

const BUCKET = "asrama-ipb-sukasari.firebasestorage.app";

/**
 * Buat URL Firebase Storage default langsung untuk aset agar gambar langsung tampil
 * secara instan tanpa harus menunggu query Firestore selesai (mengurangi CLS dan LCP).
 */
export function getDefaultStorageUrl(key) {
  if (!key) return "";
  const clean = key.trim().replace(/^\//, "");
  if (clean === "logo-ais.webp" || clean === "public/logo-ais.webp") {
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent("site/public/logo-ais.webp")}?alt=media`;
  }
  if (clean.startsWith("public/")) {
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(`site/${clean}`)}?alt=media`;
  }
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(`site/images/${clean}`)}?alt=media`;
}

// Aset di /public (tidak melalui bundler).
const PUBLIC_ASSETS = {
  "public/logo-ais.webp": { label: "Logo AIS (WebP)", type: "image" },
  "public/hero-ori.webm": { label: "Video Hero", type: "video" },
  "public/motion-logo-ais.webm": { label: "Video Motion Logo", type: "video" },
};

for (const [key, meta] of Object.entries(PUBLIC_ASSETS)) {
  SITE_IMAGES[key] = {
    default: getDefaultStorageUrl(key),
    path: `site/${key}`,
    ...meta,
  };
}

// ---- Cache & subscription agar hanya fetch sekali ----
let cache = null;
let loadingPromise = null;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(cache));
}

/** Muat URL gambar dari Firestore (sekali saja, hasilnya di-cache). */
export async function loadSiteImages(force = false) {
  if (cache && !force) return cache;
  if (loadingPromise && !force) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const [{ db }, { collection, getDocs }] = await Promise.all([
        import("../firebase"),
        import("firebase/firestore"),
      ]);
      const snap = await getDocs(collection(db, SITE_IMAGES_COLLECTION));
      const map = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        if (!data?.url) return;
        const key = data.key || decodeURIComponent(d.id);
        map[key] = data.url;
      });
      cache = map;
    } catch (err) {
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        console.warn("Gagal memuat gambar dari Firebase, memakai aset lokal:", err?.message || err);
      }
      cache = {};
    } finally {
      loadingPromise = null;
    }
    notify();
    return cache;
  })();

  return loadingPromise;
}

/** URL final sebuah gambar: override Firebase bila ada, jika tidak pakai CDN Firebase Storage default. */
export function resolveSiteImage(key) {
  if (!key) return "";
  const clean = key.trim().replace(/^\//, "");
  if (cache) {
    if (cache[clean]) return cache[clean];
    if (cache[`public/${clean}`]) return cache[`public/${clean}`];
    if (clean.startsWith("public/") && cache[clean.replace("public/", "")]) {
      return cache[clean.replace("public/", "")];
    }
  }
  return SITE_IMAGES[clean]?.default || getDefaultStorageUrl(clean);
}

/** Hook React: memicu load deferred & mengembalikan fungsi resolve + peta override. */
export function useSiteImages() {
  const [map, setMap] = useState(cache || {});

  useEffect(() => {
    let active = true;
    listeners.add(setMap);

    // Jalankan pemuatan Firestore saat thread idle agar tidak memblokir render pertama dan LCP
    const runDeferred = () => {
      loadSiteImages().then((m) => {
        if (active) setMap(m || {});
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(runDeferred, { timeout: 3000 });
    } else {
      setTimeout(runDeferred, 1500);
    }

    return () => {
      active = false;
      listeners.delete(setMap);
    };
  }, []);

  return {
    overrides: map,
    get: (key) => resolveSiteImage(key),
  };
}
