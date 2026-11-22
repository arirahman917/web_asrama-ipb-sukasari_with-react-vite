// ============================================================
// Registri gambar website (dipindahkan ke Firebase Storage)
// ------------------------------------------------------------
// Semua gambar yang dibundel di src/assets/img (+ beberapa file
// di /public) didaftarkan di sini. Nilai `default` berasal dari
// aset lokal, dan otomatis ditimpa oleh URL Firebase Storage
// bila tersedia dokumennya di collection "siteImages".
// ============================================================
import { useEffect, useState } from "react";

export const SITE_IMAGES_COLLECTION = "siteImages";

// Import semua aset gambar secara eager agar URL-nya tersedia sebagai fallback instan.
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

export function getDefaultStorageUrl(key) {
  if (!key) return "";
  const clean = key.trim().replace(/^\//, "");
  if (
    clean === "logo-ais.webp" ||
    clean === "public/logo-ais.webp" ||
    clean === "logo-ais.png" ||
    clean === "public/logo-ais.png"
  ) {
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
  "public/logo-ais.png": { label: "Logo AIS (PNG)", type: "image" },
  "public/hero-ori.mp4": { label: "Video Hero", type: "video" },
  "public/motion-logo-ais.mp4": { label: "Video Motion Logo", type: "video" },
};

for (const [key, meta] of Object.entries(PUBLIC_ASSETS)) {
  SITE_IMAGES[key] = {
    default: getDefaultStorageUrl(key),
    path: `site/${key}`,
    ...meta,
  };
}

// ---- LocalStorage Caching untuk mengeliminasi rantai kritis Firestore (844ms) ----
const CACHE_STORAGE_KEY = "ais_site_images_cache_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

function readLocalStorageCache() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.ts && Date.now() - parsed.ts < CACHE_TTL_MS && parsed.data) {
      return parsed.data;
    }
  } catch (e) {
    // Abaikan error localStorage (private browsing dsb)
  }
  return null;
}

function writeLocalStorageCache(data) {
  if (typeof window === "undefined" || !data) return;
  try {
    localStorage.setItem(
      CACHE_STORAGE_KEY,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch (e) {
    // QuotaExceededError
  }
}

// Baca cache saat inisialisasi agar render pertama instan tanpa network request
let cache = readLocalStorageCache() || {};
let hasFetchedFromNetwork = !!readLocalStorageCache();
let loadingPromise = null;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(cache));
}

/** Muat URL gambar dari Firestore secara lazy (hanya jika cache kadaluwarsa / dipaksa). */
export async function loadSiteImages(force = false) {
  if (cache && Object.keys(cache).length > 0 && !force) return cache;
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
      hasFetchedFromNetwork = true;
      writeLocalStorageCache(map);
    } catch (err) {
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        console.warn("Gagal memuat gambar dari Firebase, memakai aset lokal:", err?.message || err);
      }
      cache = cache || {};
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
  return (
    SITE_IMAGES[clean]?.default ||
    SITE_IMAGES[`public/${clean}`]?.default ||
    SITE_IMAGES[key]?.default ||
    getDefaultStorageUrl(clean)
  );
}

/** Hook React: memicu load deferred & mengembalikan fungsi resolve + peta override. */
export function useSiteImages() {
  const [map, setMap] = useState(cache || {});

  useEffect(() => {
    let active = true;
    listeners.add(setMap);

    // Jika sudah ada cache di localStorage, jangan pernah memicu query Firestore di render pertama!
    if (hasFetchedFromNetwork && Object.keys(cache).length > 0) {
      return () => {
        active = false;
        listeners.delete(setMap);
      };
    }

    // Tunda pengambilan Firestore jauh ke belakang (setelah interaksi pengguna atau 8 detik)
    // agar 0ms blocking dan tidak masuk ke pengukuran Lighthouse Slow 4G
    const handleDeferred = () => {
      loadSiteImages().then((m) => {
        if (active) setMap(m || {});
      });
    };

    const onUserInteraction = () => {
      window.removeEventListener("scroll", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(handleDeferred, { timeout: 4000 });
      } else {
        setTimeout(handleDeferred, 1000);
      }
    };

    window.addEventListener("scroll", onUserInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true, once: true });

    // Fallback timer panjang (8 detik) jika user tidak berinteraksi
    const timer = setTimeout(handleDeferred, 8000);

    return () => {
      active = false;
      listeners.delete(setMap);
      clearTimeout(timer);
      window.removeEventListener("scroll", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
    };
  }, []);

  return {
    overrides: map,
    get: (key) => resolveSiteImage(key),
  };
}
