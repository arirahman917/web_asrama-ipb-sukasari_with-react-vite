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
import { createCachedQuery } from "./cache";

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
async function rawFetchAlumni({ approvedOnly = true } = {}) {
  const q = query(collection(db, ALUMNI_COLLECTION), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => normalizeAlumni({ id: d.id, ...d.data() }))
    .filter((a) => (approvedOnly ? a.approved : true));
}

/** Alumni yang tampil di frontend (approved). Query dibatasi agar lolos rules. */
async function rawFetchApprovedAlumni() {
  const q = query(collection(db, ALUMNI_COLLECTION), where("approved", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => normalizeAlumni({ id: d.id, ...d.data() }))
    .sort((a, b) => a.order - b.order);
}

// Cache per-sesi agar carousel & halaman admin tidak membaca ulang Firestore.
const alumniListQuery = createCachedQuery(rawFetchAlumni);
const approvedAlumniQuery = createCachedQuery(rawFetchApprovedAlumni);

/**
 * Ambil daftar alumni dari cache bila ada, jika tidak baru baca Firestore.
 * @param {{ approvedOnly?: boolean }} [opts]
 */
export function fetchAlumni(opts) {
  return alumniListQuery.fetch(opts);
}

/** Alumni approved (di-cache). */
export function fetchApprovedAlumni() {
  return approvedAlumniQuery.fetch();
}

/** Bersihkan cache alumni (dipanggil setelah create/update/delete/approve). */
export function invalidateAlumniCache() {
  alumniListQuery.invalidate();
  approvedAlumniQuery.invalidate();
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
  invalidateAlumniCache();
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
  invalidateAlumniCache();
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
  invalidateAlumniCache();
}

export async function setAlumniApproval(id, approved) {
  await updateDoc(doc(db, ALUMNI_COLLECTION, id), { approved });
  invalidateAlumniCache();
}

export async function deleteAlumni(id) {
  await deleteDoc(doc(db, ALUMNI_COLLECTION, id));
  invalidateAlumniCache();
}
