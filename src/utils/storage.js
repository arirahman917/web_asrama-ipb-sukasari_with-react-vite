// ============================================================
// Helper upload file ke Firebase Storage
// ============================================================
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/** Buat nama file yang aman. */
export function safeFileName(name) {
  return (name || "file")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Upload file ke Storage dan kembalikan download URL.
 * @param {File} file
 * @param {string} folder contoh: "berita", "alumni", "site/images"
 */
export async function uploadFile(file, folder = "uploads") {
  if (!file) return "";
  const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** Upload menggantikan file pada path tetap (untuk gambar situs). */
export async function uploadFileToPath(file, path) {
  if (!file) return "";
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
