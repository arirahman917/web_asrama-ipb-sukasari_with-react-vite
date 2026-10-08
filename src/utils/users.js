// ============================================================
// Users (anggota asrama) — collection "users"
// Dipakai sebagai satu-satunya sumber untuk memilih admin.
// ============================================================
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export const USERS_COLLECTION = "users";

/**
 * Normalisasi dokumen user. Field dibuat fleksibel karena nama field
 * pada collection `users` bisa berbeda-beda.
 */
export function normalizeUser(raw) {
  let email = (
    raw.email || raw.Email || raw.emailAddress || raw.mail || ""
  ).toString().trim().toLowerCase();

  // Jika field email kosong tapi doc ID-nya berupa email, pakai doc ID.
  if (!email && typeof raw.id === "string" && raw.id.includes("@")) {
    email = raw.id.trim().toLowerCase();
  }

  const rawName =
    raw.nama || raw.namaLengkap || raw.name || raw.fullName ||
    raw.displayName || raw.username || "";
  const name = String(rawName).replace(/\s*\(.*\)\s*$/, "").trim();

  return {
    id: raw.id,
    name: name || email,
    email,
    angkatan: raw.angkatan ?? raw.batch ?? raw.tahun ?? "",
    jabatan: raw.jabatan || raw.role || "",
    prodi: raw.prodi || "",
    nim: raw.nim || "",
    photo: raw.fotoProfil || raw.photoURL || "",
    isAdmin: raw.isAdmin === true || raw.isadmin === true,
    raw,
  };
}

export async function fetchUsers() {
  const snap = await getDocs(collection(db, USERS_COLLECTION));
  return snap.docs
    .map((d) => normalizeUser({ id: d.id, ...d.data() }))
    .filter((u) => u.email)
    .sort((a, b) =>
      (a.name || a.email).localeCompare(b.name || b.email)
    );
}

/** Set/lepas status admin web untuk seorang user (field isAdmin). */
export async function setUserAdmin(userId, isAdmin) {
  if (!userId) throw new Error("User ID tidak valid.");
  await updateDoc(doc(db, USERS_COLLECTION, userId), { isAdmin: !!isAdmin });
}
