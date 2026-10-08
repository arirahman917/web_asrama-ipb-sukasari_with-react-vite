// ============================================================
// Helper format tanggal & teks (Bahasa Indonesia)
// ============================================================

export const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * Ubah berbagai bentuk tanggal (Firestore Timestamp, Date, ISO string,
 * "YYYY-MM-DD") menjadi objek Date. Mengembalikan null bila tidak valid.
 */
export function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate(); // Firestore Timestamp
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** "4 Oktober 2026" */
export function formatDateId(value) {
  const d = toDate(value);
  if (!d) return "";
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/** Nama bulan dari sebuah tanggal, mis. "Oktober" (null bila kosong). */
export function getMonthName(value) {
  const d = toDate(value);
  return d ? MONTHS_ID[d.getMonth()] : "";
}

/** Tahun sebagai string, mis. "2026". */
export function getYear(value) {
  const d = toDate(value);
  return d ? String(d.getFullYear()) : "";
}

/** "YYYY-MM-DD" untuk value pada input type="date". */
export function toDateInputValue(value) {
  const d = toDate(value) || new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Ubah markdown/teks menjadi cuplikan teks polos untuk preview kartu. */
export function toExcerpt(markdown, maxLength = 180) {
  if (!markdown) return "";
  const plain = String(markdown)
    .replace(/```[\s\S]*?```/g, " ")       // code block
    .replace(/`([^`]*)`/g, "$1")            // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")  // gambar
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")// tautan
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")     // heading
    .replace(/^\s{0,3}>\s?/gm, "")          // blockquote
    .replace(/^\s{0,3}[-*+]\s+/gm, "")      // list
    .replace(/\*\*([^*]*)\*\*/g, "$1")      // bold
    .replace(/\*([^*]*)\*/g, "$1")          // italic
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength).trimEnd()}…` : plain;
}
