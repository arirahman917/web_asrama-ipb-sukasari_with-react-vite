import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// SECTION CONFIG — Mengelompokkan field per section
// ============================================================
const SECTIONS = [
  {
    title: "Identitas Diri",
    icon: "👤",
    fields: [
      { key: "email", label: "Email" },
      { key: "namaLengkap", label: "Nama Lengkap" },
      { key: "tanggalLahir", label: "Tanggal Lahir" },
      { key: "programStudi", label: "Program Studi" },
      { key: "agama", label: "Agama" },
      { key: "jalurMasuk", label: "Jalur Masuk" },
      { key: "anakKeDari", label: "Anak ke ... dari ..." },
      { key: "asalDaerah", label: "Asal Daerah" },
      { key: "asalSekolah", label: "Asal Sekolah" },
      { key: "nomorWhatsapp", label: "Nomor WhatsApp" },
      { key: "riwayatPenyakit", label: "Riwayat Penyakit" },
    ],
    files: [
      { key: "fotoKtpUrl", label: "Foto KTP" },
      { key: "buktiDiterimaUrl", label: "Bukti Diterima SV IPB" },
    ],
  },
  {
    title: "Data Orang Tua / Wali",
    icon: "👨‍👩‍👦",
    fields: [
      { key: "namaAyah", label: "Nama Ayah" },
      { key: "nomorTeleponAyah", label: "No. Telp Ayah" },
      { key: "pekerjaanAyah", label: "Pekerjaan Ayah" },
      { key: "penghasilanAyahPerBulan", label: "Penghasilan Ayah/Bulan" },
      { key: "namaIbu", label: "Nama Ibu" },
      { key: "nomorTeleponIbu", label: "No. Telp Ibu" },
      { key: "pekerjaanIbu", label: "Pekerjaan Ibu" },
      { key: "penghasilanIbuPerBulan", label: "Penghasilan Ibu/Bulan" },
      { key: "namaWali", label: "Nama Wali" },
      { key: "nomorTeleponWali", label: "No. Telp Wali" },
    ],
    files: [
      { key: "slipGajiOrtuUrl", label: "Slip Gaji Orang Tua" },
    ],
  },
  {
    title: "Data Keuangan",
    icon: "💰",
    fields: [
      { key: "penerimaKipK", label: "Penerima KIP-K" },
      { key: "ukt", label: "UKT" },
      { key: "rencanaUangKirimanBulanan", label: "Rencana Uang Kiriman" },
      { key: "sumberUangBulanan", label: "Sumber Uang Bulanan" },
      { key: "rencanaPengeluaranBulanan", label: "Rencana Pengeluaran" },
      { key: "statusTempatTinggal", label: "Status Tempat Tinggal" },
      { key: "rencanaTransportasi", label: "Rencana Transportasi" },
      { key: "bersediaUangPangkal", label: "Bersedia Uang Pangkal" },
      { key: "bersediaIuranBulanan", label: "Bersedia Iuran Bulanan" },
    ],
    files: [
      { key: "buktiTagihanListrikUrl", label: "Bukti Tagihan Listrik" },
    ],
  },
  {
    title: "Pengalaman Pribadi",
    icon: "🏆",
    fields: [
      { key: "ceritaDiri", label: "Cerita Diri" },
      { key: "portofolio", label: "Portofolio" },
    ],
    files: [],
  },
  {
    title: "Media & Bukti Syarat",
    icon: "📸",
    fields: [
      { key: "usernameInstagram", label: "Username Instagram" }
    ],
    files: [
      { key: "buktiUploadTwibbonUrl", label: "Bukti Upload Twibbon" },
      { key: "buktiSharePosterUrl", label: "Bukti Share Poster" },
      { key: "buktiFollowInstagramUrl", label: "Bukti Follow Instagram" },
    ],
  },
];

// ============================================================
// IMAGE MODAL
// ============================================================
function ImageModal({ src, alt, onClose }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-3xl max-h-[85vh] w-full">
        <img src={src} alt={alt} className="w-full h-full object-contain rounded-2xl" />
        <button onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors text-lg">
          ✕
        </button>
      </motion.div>
    </div>
  );
}

// ============================================================
// PERSON CARD COMPONENT
// ============================================================
function PersonCard({ data, index, onImageClick, onToggleWaStatus }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (val) => {
    if (!val) return "-";
    if (val.toDate) return val.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    return val;
  };

  const formatCurrency = (val) => {
    if (!val || val === "-") return val;
    const num = parseInt(val);
    if (isNaN(num)) return val;
    return `Rp${num.toLocaleString("id-ID")}`;
  };

  const isCurrency = (key) => ["penghasilanAyahPerBulan", "penghasilanIbuPerBulan", "rencanaUangKirimanBulanan", "rencanaPengeluaranBulanan", "ukt"].includes(key);

  const handleFileClick = (url, label) => {
    if (!url) return;
    if (url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('.pdf?')) {
      window.open(url, '_blank');
    } else {
      onImageClick(url, label);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300"
    >
      {/* Header - Foto + Nama + Prodi */}
      <div className="bg-gradient-to-r from-[#182C4A] to-[#1E3A5F] p-5">
        <div className="flex items-center gap-4">
          {/* Foto 3x4 */}
          <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0 border-2 border-white/20 shadow-lg cursor-pointer"
            onClick={() => data.fotoFormalUrl && handleFileClick(data.fotoFormalUrl, data.namaLengkap)}>
            {data.fotoFormalUrl ? (
              data.fotoFormalUrl.toLowerCase().includes('.pdf') || data.fotoFormalUrl.toLowerCase().includes('.pdf?') ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-red-500">
                   <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.001 16h-1.636v-6.993h2.385c1.439 0 2.227.674 2.227 1.942 0 1.258-.809 1.94-2.227 1.94h-.749v3.111zm4.12 0h-1.638v-6.993h2.613c1.332 0 2.257.771 2.257 2.052 0 .822-.441 1.488-1.121 1.834.723.36 1.139 1.054 1.139 1.921 0 1.298-.949 2.155-2.585 2.155h-2.296v-6.993h1.631zm3.899-3.882h-1.603v3.882h-1.637v-6.993h3.24c.001 0 2.502.046 2.502 1.556 0 1.551-2.502 1.555-2.502 1.555zm-6.236-1.503h.718c.594 0 .886-.246.886-.689 0-.462-.294-.688-.887-.688h-.717v1.377zm4.12.01h.749c.582 0 .861-.253.861-.7 0-.435-.295-.69-.877-.69h-.733v1.39zm0 2.13h.769c.642 0 .963-.284.963-.787 0-.528-.328-.806-.975-.806h-.757v1.593z" /></svg>
                   <span className="text-[10px] font-bold text-white">PDF</span>
                </div>
              ) : (
                <img src={data.fotoFormalUrl} alt={data.namaLengkap} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">👤</div>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{data.namaLengkap || "Tanpa Nama"}</h3>
            <p className="text-sm text-orange-300 font-medium">{data.programStudi || "-"}</p>
            <p className="text-xs text-gray-400 mt-1">{data.asalDaerah || "-"} • {data.asalSekolah || "-"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">{data.batch || "-"}</span>
              <span className="text-[10px] text-gray-500">{formatDate(data.createdAt)}</span>
            </div>
          </div>
          {/* Nomor Urut */}
          <div className="text-3xl font-black text-white/10">#{index + 1}</div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="grid grid-cols-4 divide-x divide-white/10 bg-white/3">
        <div className="p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase">WhatsApp</p>
          <p className="text-xs text-white font-medium truncate">{data.nomorWhatsapp || "-"}</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase">KIP-K</p>
          <p className={`text-xs font-semibold ${data.penerimaKipK === "Ya" ? "text-green-400" : "text-gray-400"}`}>{data.penerimaKipK || "-"}</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase">Tanda Tangan</p>
          <p className={`text-xs font-semibold ${data.signatureUrl ? "text-green-400" : "text-red-400"}`}>{data.signatureUrl ? "Ada" : "Tidak Ada"}</p>
        </div>
        <div className="p-3 text-center flex flex-col items-center justify-center">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Grup WA</p>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWaStatus(data.id, data.waGroupJoined); }}
            className={`text-[9px] px-2 py-0.5 rounded-md border transition-all ${data.waGroupJoined ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"}`}
          >
            {data.waGroupJoined ? "Sudah Masuk" : "Belum Masuk"}
          </button>
        </div>
      </div>

      {/* Toggle Details */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full py-3 text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 bg-white/3 hover:bg-white/5">
        {expanded ? "Sembunyikan Detail ▲" : "Lihat Detail ▼"}
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="p-5 space-y-6">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h4 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2">
                    <span>{section.icon}</span> {section.title}
                  </h4>
                  {/* Text Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {section.fields.map(({ key, label }) => (
                      <div key={key} className="bg-white/3 rounded-lg px-3 py-2">
                        <p className="text-[10px] text-gray-500 uppercase">{label}</p>
                        <p className="text-xs text-white font-medium break-words">
                          {key === "ceritaDiri" || key === "portofolio" ? (data[key] || "-") : (isCurrency(key) ? formatCurrency(data[key]) : ((key === "namaAyah" || key === "namaIbu") && data[key] === "-" ? "Meninggal" : (data[key] || "-")))}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Arrays (Pengalaman Pribadi) */}
                  {section.title === "Pengalaman Pribadi" && (
                    <div className="space-y-4 mb-3">
                      {['prestasiArray', 'organisasiArray', 'komunitasArray'].map(arrKey => {
                        const arr = data[arrKey] || [];
                        const title = arrKey === 'prestasiArray' ? 'Prestasi' : arrKey === 'organisasiArray' ? 'Organisasi' : 'Komunitas';
                        if(arr.length === 0) return null;
                        return (
                          <div key={arrKey} className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <h5 className="text-xs font-semibold text-orange-300 mb-2">{title}</h5>
                            <div className="flex flex-col gap-2">
                              {arr.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                                  <p className="text-xs text-white truncate max-w-[200px]" title={item.nama}>{item.nama}</p>
                                  {item.url && (
                                    <button onClick={() => handleFileClick(item.url, item.nama)} className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">Lihat Bukti</button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* File Fields */}
                  {section.files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {section.files.map(({ key, label }) => (
                        data[key] && data[key] !== "" ? (
                          <div key={key} className="cursor-pointer group" onClick={() => handleFileClick(data[key], label)}>
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 border border-white/10 group-hover:border-orange-400/50 transition-all flex items-center justify-center">
                              {data[key].toLowerCase().includes('.pdf') || data[key].toLowerCase().includes('.pdf?') ? (
                                <div className="flex flex-col items-center justify-center text-red-500">
                                   <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.001 16h-1.636v-6.993h2.385c1.439 0 2.227.674 2.227 1.942 0 1.258-.809 1.94-2.227 1.94h-.749v3.111zm4.12 0h-1.638v-6.993h2.613c1.332 0 2.257.771 2.257 2.052 0 .822-.441 1.488-1.121 1.834.723.36 1.139 1.054 1.139 1.921 0 1.298-.949 2.155-2.585 2.155h-2.296v-6.993h1.631zm3.899-3.882h-1.603v3.882h-1.637v-6.993h3.24c.001 0 2.502.046 2.502 1.556 0 1.551-2.502 1.555-2.502 1.555zm-6.236-1.503h.718c.594 0 .886-.246.886-.689 0-.462-.294-.688-.887-.688h-.717v1.377zm4.12.01h.749c.582 0 .861-.253.861-.7 0-.435-.295-.69-.877-.69h-.733v1.39zm0 2.13h.769c.642 0 .963-.284.963-.787 0-.528-.328-.806-.975-.806h-.757v1.593z" /></svg>
                                   <span className="text-[10px] font-bold text-white">PDF</span>
                                </div>
                              ) : (
                                <img src={data[key]} alt={label} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <p className="text-[9px] text-gray-500 mt-1 text-center truncate w-20">{label}</p>
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Tanda Tangan */}
              <div>
                 <h4 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2"><span>✅</span> Pakta Integritas</h4>
                 {data.signatureUrl ? (
                    <div className="bg-white/80 rounded-xl p-2 w-fit border border-white/20 cursor-pointer" onClick={() => handleFileClick(data.signatureUrl, "Tanda Tangan")}>
                      <img src={data.signatureUrl} alt="Tanda Tangan" className="h-20 w-auto object-contain" />
                    </div>
                 ) : (
                    <p className="text-xs text-red-400">Belum ada tanda tangan</p>
                 )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ResponsOprec() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalImage, setModalImage] = useState(null);

  // Auth check
  useEffect(() => {
    if (sessionStorage.getItem("aisAdminLoggedIn") !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "bakalCalonPenghuni"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setData(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((d) => {
    const s = search.toLowerCase();
    return (
      (d.namaLengkap || "").toLowerCase().includes(s) ||
      (d.programStudi || "").toLowerCase().includes(s) ||
      (d.asalDaerah || "").toLowerCase().includes(s) ||
      (d.email || "").toLowerCase().includes(s)
    );
  });

  const handleToggleWaStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, "bakalCalonPenghuni", id), {
        waGroupJoined: newStatus
      });
      setData(prev => prev.map(d => d.id === id ? { ...d, waGroupJoined: newStatus } : d));
    } catch (err) {
      console.error("Failed to update WA status:", err);
      alert("Gagal mengupdate status WA");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("aisAdminLoggedIn");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      {/* Modal */}
      {modalImage && <ImageModal src={modalImage.src} alt={modalImage.alt} onClose={() => setModalImage(null)} />}

      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">📋 Data Pendaftar OPREC</h1>
            <p className="text-xs text-gray-400">Asrama IPB Sukasari 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">Total: <span className="text-orange-400 font-bold">{data.length}</span> pendaftar</span>
            <button onClick={handleLogout}
              className="px-4 py-2 text-xs bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, prodi, asal daerah, atau email..."
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400 transition-all" />
          </div>
          <p className="text-sm text-gray-400">
            Menampilkan <span className="text-white font-semibold">{filteredData.length}</span> dari <span className="text-white font-semibold">{data.length}</span>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-10 h-10 text-orange-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400">Memuat data pendaftar...</p>
            </div>
          </div>
        )}

        {/* No Data */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400">{search ? "Tidak ditemukan pendaftar dengan pencarian tersebut." : "Belum ada data pendaftar."}</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && filteredData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredData.map((d, i) => (
                <PersonCard key={d.id} data={d} index={i} onImageClick={(src, alt) => setModalImage({ src, alt })} onToggleWaStatus={handleToggleWaStatus} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
}
