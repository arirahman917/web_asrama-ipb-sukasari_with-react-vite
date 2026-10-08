// ============================================================
// Pengecekan hak akses admin
// ------------------------------------------------------------
// Sumber utama: field `isAdmin: true` pada dokumen di collection `users`.
// Fallback: collection `admins` (doc ID = email) untuk kompatibilitas.
//
// Pengecekan ini hanya gerbang UI; penegakan sebenarnya ada di
// firestore.rules & storage.rules (fungsi isAdmin()).
// ============================================================
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ADMIN_COLLECTION = "admins";
const USERS_COLLECTION = "users";

/** Baca dokumen & cek field isAdmin === true. */
async function hasAdminFlag(collectionName, id) {
  if (!id) return false;
  try {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() && snap.data().isAdmin === true;
  } catch {
    // Rules menolak baca (mis. bukan dokumen sendiri) -> anggap bukan admin.
    return false;
  }
}

/**
 * Cek apakah seorang user Firebase adalah admin web.
 * @param {{ uid?: string, email?: string } | null} user
 */
export async function isAllowedAdmin(user) {
  if (!user) return false;
  const { uid, email } = user;

  // 1. users/<uid>.isAdmin
  if (uid && (await hasAdminFlag(USERS_COLLECTION, uid))) return true;

  // 2. users/<email>.isAdmin (bila doc ID memakai email)
  if (email && (await hasAdminFlag(USERS_COLLECTION, email.toLowerCase()))) return true;

  // 3. Fallback: admins/<email>
  if (email) {
    try {
      const snap = await getDoc(doc(db, ADMIN_COLLECTION, email.toLowerCase()));
      if (snap.exists() && snap.data().active !== false) return true;
    } catch {
      /* abaikan */
    }
  }

  return false;
}
