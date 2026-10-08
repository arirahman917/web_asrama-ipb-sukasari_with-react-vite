// ============================================================
// Alumni — operasi Firestore (collection "alumni")
// Setiap dokumen = satu "pesan/kesan" alumni yang tampil di carousel.
// ============================================================
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export const ALUMNI_COLLECTION = "alumni";

export function normalizeAlumni(raw) {
  return {
    id: raw.id,
    name: raw.name || "",
    role: raw.role || raw.angkatan || "",
    image: raw.image || raw.imageUrl || "",
    quote: raw.quote || raw.message || "",
    order: typeof raw.order === "number" ? raw.order : 0,
    approved: raw.approved === true,
    source: raw.source || "admin",
    createdAt: raw.createdAt ?? null,
  };
}

/**
 * Ambil daftar alumni.
 * @param {{ approvedOnly?: boolean }} opts
 */
export async function fetchAlumni({ approvedOnly = true } = {}) {
  const q = query(collection(db, ALUMNI_COLLECTION), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => normalizeAlumni({ id: d.id, ...d.data() }))
    .filter((a) => (approvedOnly ? a.approved : true));
}

/** Alumni yang tampil di frontend (approved). Query dibatasi agar lolos rules. */
export async function fetchApprovedAlumni() {
  const q = query(collection(db, ALUMNI_COLLECTION), where("approved", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => normalizeAlumni({ id: d.id, ...d.data() }))
    .sort((a, b) => a.order - b.order);
}

/** Pengajuan pesan dari alumni (butuh moderasi admin -> approved: false). */
export async function submitAlumniMessage(data) {
  await addDoc(collection(db, ALUMNI_COLLECTION), {
    name: data.name?.trim() || "",
    role: data.role?.trim() || "",
    quote: data.quote?.trim() || "",
    image: data.image || "",
    order: Date.now(),
    approved: false,
    source: "submission",
    createdAt: serverTimestamp(),
  });
}

/** Admin menambah alumni langsung (langsung tampil). */
export async function createAlumni(data) {
  await addDoc(collection(db, ALUMNI_COLLECTION), {
    name: data.name?.trim() || "",
    role: data.role?.trim() || "",
    quote: data.quote?.trim() || "",
    image: data.image || "",
    order: typeof data.order === "number" ? data.order : Date.now(),
    approved: data.approved !== false,
    source: "admin",
    createdAt: serverTimestamp(),
  });
}

export async function updateAlumni(id, data) {
  await updateDoc(doc(db, ALUMNI_COLLECTION, id), {
    name: data.name?.trim() || "",
    role: data.role?.trim() || "",
    quote: data.quote?.trim() || "",
    image: data.image || "",
    order: typeof data.order === "number" ? data.order : 0,
    approved: data.approved !== false,
  });
}

export async function setAlumniApproval(id, approved) {
  await updateDoc(doc(db, ALUMNI_COLLECTION, id), { approved });
}

export async function deleteAlumni(id) {
  await deleteDoc(doc(db, ALUMNI_COLLECTION, id));
}
