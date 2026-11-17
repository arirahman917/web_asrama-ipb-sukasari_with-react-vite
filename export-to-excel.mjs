/**
 * Export Data Bakal Calon Penghuni ke Excel
 * Jalankan: node export-to-excel.mjs
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import XLSX from "xlsx";

// Firebase config (sama dengan src/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyAI7DAqPqKvIDTSJi60mzrB2N6atygMpBw",
  authDomain: "asrama-ipb-sukasari.firebaseapp.com",
  projectId: "asrama-ipb-sukasari",
  storageBucket: "asrama-ipb-sukasari.firebasestorage.app",
  messagingSenderId: "573037156718",
  appId: "1:573037156718:web:dbf1355ea6e8c6da83c97f",
  measurementId: "G-SXPXGKMWF9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportToExcel() {
  console.log("📥 Mengambil data dari Firestore...");

  const q = query(collection(db, "bakalCalonPenghuni"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log("❌ Tidak ada data ditemukan!");
    process.exit(1);
  }

  console.log(`✅ Ditemukan ${snapshot.size} data pendaftar`);

  // Group by batch
  const allData = [];
  const batchGroups = {};

  snapshot.docs.forEach((doc, index) => {
    const d = doc.data();
    const batch = d.batch || "UNKNOWN";

    if (!batchGroups[batch]) batchGroups[batch] = [];

    // Format timestamp
    let createdAt = "";
    if (d.createdAt) {
      const date = d.createdAt.toDate ? d.createdAt.toDate() : new Date(d.createdAt);
      createdAt = date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    }

    // Format prestasi, organisasi, komunitas arrays
    const formatArray = (arr) => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return "-";
      return arr.map((item, i) => `${i + 1}. ${item.nama || "-"}`).join("\n");
    };

    const formatArrayUrls = (arr) => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return "-";
      return arr.map((item, i) => item.url || "-").join("\n");
    };

    const row = {
      "No": 0, // akan diisi per batch
      "Batch": batch,
      "Waktu Daftar": createdAt,
      "Email": d.email || "-",

      // === IDENTITAS DIRI ===
      "Nama Lengkap": d.namaLengkap || "-",
      "Tanggal Lahir": d.tanggalLahir || "-",
      "Program Studi": d.programStudi || "-",
      "Agama": d.agama || "-",
      "Jalur Masuk": d.jalurMasuk || "-",
      "Anak Ke / Dari": d.anakKeDari || "-",
      "Asal Daerah": d.asalDaerah || "-",
      "Asal Sekolah": d.asalSekolah || "-",
      "Nomor WhatsApp": d.nomorWhatsapp || "-",
      "Riwayat Penyakit": d.riwayatPenyakit || "-",
      "URL Foto Formal": d.fotoFormalUrl || "-",
      "URL Foto KTP": d.fotoKtpUrl || "-",
      "URL Bukti Diterima": d.buktiDiterimaUrl || "-",

      // === DATA ORANG TUA ===
      "Nama Ayah": d.namaAyah || "-",
      "No. Telepon Ayah": d.nomorTeleponAyah || "-",
      "Pekerjaan Ayah": d.pekerjaanAyah || "-",
      "Penghasilan Ayah/Bulan": d.penghasilanAyahPerBulan || "-",
      "Nama Ibu": d.namaIbu || "-",
      "No. Telepon Ibu": d.nomorTeleponIbu || "-",
      "Pekerjaan Ibu": d.pekerjaanIbu || "-",
      "Penghasilan Ibu/Bulan": d.penghasilanIbuPerBulan || "-",
      "URL Slip Gaji Ortu": d.slipGajiOrtuUrl || "-",
      "Nama Wali": d.namaWali || "-",
      "Hubungan Wali": d.hubunganWali || "-",
      "No. Telepon Wali": d.nomorTeleponWali || "-",

      // === DATA KEUANGAN ===
      "Penerima KIP-K": d.penerimaKipK || "-",
      "UKT": d.ukt || "-",
      "Rencana Uang Kiriman/Bulan": d.rencanaUangKirimanBulanan || "-",
      "Sumber Uang Bulanan": d.sumberUangBulanan || "-",
      "Rencana Pengeluaran/Bulan": d.rencanaPengeluaranBulanan || "-",
      "Status Tempat Tinggal": d.statusTempatTinggal || "-",
      "URL Bukti Tagihan Listrik": d.buktiTagihanListrikUrl || "-",
      "Rencana Transportasi": d.rencanaTransportasi || "-",
      "Bersedia Uang Pangkal": d.bersediaUangPangkal || "-",
      "Bersedia Iuran Bulanan": d.bersediaIuranBulanan || "-",

      // === PENGALAMAN PRIBADI ===
      "Prestasi": formatArray(d.prestasiArray),
      "URL Bukti Prestasi": formatArrayUrls(d.prestasiArray),
      "Organisasi": formatArray(d.organisasiArray),
      "URL Bukti Organisasi": formatArrayUrls(d.organisasiArray),
      "Komunitas": formatArray(d.komunitasArray),
      "URL Bukti Komunitas": formatArrayUrls(d.komunitasArray),
      "Cerita Diri": d.ceritaDiri || "-",
      "Portofolio": d.portofolio || "-",

      // === MEDIA & BUKTI ===
      "Username Instagram": d.usernameInstagram || "-",
      "URL Bukti Upload Twibbon": d.buktiUploadTwibbonUrl || "-",
      "URL Bukti Share Poster": d.buktiSharePosterUrl || "-",
      "URL Bukti Follow Instagram": d.buktiFollowInstagramUrl || "-",

      // === PAKTA INTEGRITAS ===
      "Tanda Tangan": d.signatureUrl ? "Ada" : "Tidak Ada",

      // === STATUS ===
      "Sudah Masuk Grup WA": d.waGroupJoined ? "Sudah" : "Belum",
    };

    batchGroups[batch].push(row);
    allData.push(row);
  });

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sort batch keys
  const sortedBatches = Object.keys(batchGroups).sort();

  // Sheet "SEMUA DATA" — all batches combined
  let globalNo = 1;
  allData.forEach(row => { row["No"] = globalNo++; });
  const wsAll = XLSX.utils.json_to_sheet(allData);
  autoFitColumns(wsAll, allData);
  XLSX.utils.book_append_sheet(wb, wsAll, "SEMUA DATA");

  // Sheet per batch
  for (const batch of sortedBatches) {
    const batchData = batchGroups[batch];
    let no = 1;
    batchData.forEach(row => { row["No"] = no++; });

    const ws = XLSX.utils.json_to_sheet(batchData);
    autoFitColumns(ws, batchData);

    // Sanitize sheet name (max 31 chars, no special chars)
    const sheetName = batch.replace(/[\/\\?*\[\]]/g, "").substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    console.log(`📊 ${batch}: ${batchData.length} pendaftar`);
  }

  // Write file
  const filename = `Data_Bakal_Calon_Penghuni_${new Date().toISOString().slice(0, 10)}.xlsx`;
  const outputPath = `./${filename}`;
  XLSX.writeFile(wb, outputPath);

  console.log(`\n✅ Excel berhasil dibuat: ${outputPath}`);
  console.log(`📁 Total: ${allData.length} pendaftar dari ${sortedBatches.length} batch`);
  console.log(`📋 Sheets: SEMUA DATA, ${sortedBatches.join(", ")}`);

  process.exit(0);
}

function autoFitColumns(ws, data) {
  if (!data.length) return;
  const cols = Object.keys(data[0]).map(key => {
    const maxLen = Math.max(
      key.length,
      ...data.map(row => {
        const val = String(row[key] || "");
        // For multiline, take the longest line
        const lines = val.split("\n");
        return Math.max(...lines.map(l => l.length));
      })
    );
    return { wch: Math.min(maxLen + 2, 50) };
  });
  ws["!cols"] = cols;
}

exportToExcel().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
