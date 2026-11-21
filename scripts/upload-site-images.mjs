// ============================================================
// Unggah semua gambar website ke Firebase Storage + daftarkan di Firestore.
// ------------------------------------------------------------
// Menjalankan sekali untuk "memindahkan" aset lokal ke Firebase.
//
// Prasyarat (pilih salah satu):
//   1) gcloud auth application-default login
//   2) set env GOOGLE_APPLICATION_CREDENTIALS ke path service account JSON
//
// Jalankan:
//   npm run upload:images
// ============================================================
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BUCKET = "asrama-ipb-sukasari.firebasestorage.app";
const PROJECT_ID = "asrama-ipb-sukasari";
const SITE_IMAGES_COLLECTION = "siteImages";

// File /public yang dipakai website (harus sesuai kunci di src/utils/images.js).
const PUBLIC_ASSETS = ["logo-ais.png", "hero-ori.mp4", "motion-logo-ais.mp4"];

const app = initializeApp({
  credential: applicationDefault(),
  projectId: PROJECT_ID,
  storageBucket: BUCKET,
});

const bucket = getStorage(app).bucket();
const db = getFirestore(app);

/** URL publik (mengandalkan Storage rules: allow read: if true). */
function publicUrl(storagePath) {
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(storagePath)}?alt=media`;
}

async function uploadOne(localPath, storagePath) {
  const [file] = await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { cacheControl: "public, max-age=31536000" },
  });
  return file;
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

async function main() {
  const assetDir = path.join(ROOT, "src/assets/img");
  const files = walk(assetDir).filter((f) => /\.(png|jpe?g|webp|svg|gif)$/i.test(f));

  console.log(`Mengunggah ${files.length} gambar dari src/assets/img ...`);
  let count = 0;
  for (const full of files) {
    const key = path.relative(assetDir, full).split(path.sep).join("/");
    const storagePath = `site/images/${key}`;
    await uploadOne(full, storagePath);
    await db.collection(SITE_IMAGES_COLLECTION).doc(encodeURIComponent(key)).set(
      { url: publicUrl(storagePath), key, path: storagePath, updatedAt: new Date() },
      { merge: true }
    );
    count++;
    console.log(`  ✓ ${key}`);
  }

  console.log(`Mengunggah ${PUBLIC_ASSETS.length} aset dari public/ ...`);
  for (const name of PUBLIC_ASSETS) {
    const full = path.join(ROOT, "public", name);
    if (!fs.existsSync(full)) {
      console.warn(`  ! dilewati (tidak ada): public/${name}`);
      continue;
    }
    const key = `public/${name}`;
    const storagePath = `site/${key}`;
    await uploadOne(full, storagePath);
    await db.collection(SITE_IMAGES_COLLECTION).doc(encodeURIComponent(key)).set(
      { url: publicUrl(storagePath), key, path: storagePath, updatedAt: new Date() },
      { merge: true }
    );
    count++;
    console.log(`  ✓ ${key}`);
  }

  console.log(`\nSelesai. ${count} file diunggah & didaftarkan ke collection "${SITE_IMAGES_COLLECTION}".`);
}

main().catch((err) => {
  console.error("\nGagal:", err?.message || err);
  process.exit(1);
});
