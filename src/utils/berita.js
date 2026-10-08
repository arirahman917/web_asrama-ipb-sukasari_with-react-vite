// ============================================================
// Berita — operasi Firestore (collection "berita")
// ============================================================
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { formatDateId, getYear, getMonthName, toDate } from "./format";

export const BERITA_COLLECTION = "berita";

/**
 * Normalisasi dokumen Firestore menjadi bentuk yang dipakai UI.
 */
export function normalizeBerita(raw) {
  const rawDate = raw.date ?? raw.createdAt ?? null;
  const d = toDate(rawDate);
  return {
    id: raw.id,
    title: raw.title || "",
    kategori: (raw.kategori || raw.category || "umum").toLowerCase(),
    content: raw.content ?? raw.desc ?? "",
    imageUrl: raw.imageUrl || raw.img || "",
    author: raw.author || "",
    published: raw.published !== false,
    createdAt: raw.createdAt ?? null,
    date: rawDate,
    dateLabel: formatDateId(rawDate),
    year: getYear(rawDate),
    month: getMonthName(rawDate),
    _ts: d ? d.getTime() : 0,
  };
}

/** Ambil semua berita (terbaru lebih dulu). Hanya yang published. */
export async function fetchBerita({ includeDrafts = false } = {}) {
  const q = query(collection(db, BERITA_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => normalizeBerita({ id: d.id, ...d.data() }))
    .filter((b) => includeDrafts || b.published)
    .sort((a, b) => b._ts - a._ts);
}

/** Ambil satu berita berdasarkan ID. */
export async function fetchBeritaById(id) {
  if (!id) return null;
  const snap = await getDoc(doc(db, BERITA_COLLECTION, id));
  if (!snap.exists()) return null;
  return normalizeBerita({ id: snap.id, ...snap.data() });
}

/**
 * Simpan berita. `dateInput` format "YYYY-MM-DD".
 */
function buildPayload(data) {
  return {
    title: data.title?.trim() || "",
    kategori: (data.kategori || "umum").toLowerCase(),
    content: data.content || "",
    imageUrl: data.imageUrl || "",
    author: data.author || "",
    published: data.published !== false,
    date: data.dateInput ? Timestamp.fromDate(new Date(`${data.dateInput}T00:00:00`)) : Timestamp.now(),
  };
}

export async function createBerita(data) {
  const payload = buildPayload(data);
  const ref = await addDoc(collection(db, BERITA_COLLECTION), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBerita(id, data) {
  const payload = buildPayload(data);
  await updateDoc(doc(db, BERITA_COLLECTION, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBerita(id) {
  await deleteDoc(doc(db, BERITA_COLLECTION, id));
}
