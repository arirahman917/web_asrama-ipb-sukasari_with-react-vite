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
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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

// Aset di /public (tidak melalui bundler).
const PUBLIC_ASSETS = {
  "public/logo-ais.png": { label: "Logo AIS (PNG)", type: "image" },
  "public/hero-ori.mp4": { label: "Video Hero", type: "video" },
  "public/motion-logo-ais.mp4": { label: "Video Motion Logo", type: "video" },
};

for (const [key, meta] of Object.entries(PUBLIC_ASSETS)) {
  SITE_IMAGES[key] = {
    default: `/${key.replace("public/", "")}`,
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
      console.warn("Gagal memuat gambar dari Firebase, memakai aset lokal:", err?.message || err);
      cache = {};
    } finally {
      loadingPromise = null;
    }
    notify();
    return cache;
  })();

  return loadingPromise;
}

/** URL final sebuah gambar: override Firebase bila ada, jika tidak pakai aset lokal. */
export function resolveSiteImage(key) {
  if (cache && cache[key]) return cache[key];
  return SITE_IMAGES[key]?.default || "";
}

/** Hook React: memicu load & mengembalikan fungsi resolve + peta override. */
export function useSiteImages() {
  const [map, setMap] = useState(cache || {});

  useEffect(() => {
    let active = true;
    listeners.add(setMap);
    loadSiteImages().then((m) => {
      if (active) setMap(m || {});
    });
    return () => {
      active = false;
      listeners.delete(setMap);
    };
  }, []);

  return {
    overrides: map,
    get: (key) => (map && map[key]) || SITE_IMAGES[key]?.default || "",
  };
}
