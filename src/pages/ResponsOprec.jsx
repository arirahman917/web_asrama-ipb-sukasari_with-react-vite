import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, doc, updateDoc, runTransaction, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import PendaftarTab from "../components/admin/PendaftarTab";
import PenilaianTab from "../components/admin/PenilaianTab";
import ModernDropdown from "../components/admin/ModernDropdown";
import { Toast, ConfirmModal } from "../components/admin/CustomModal";

const ALLOWED_EMAILS = [
  "raihanalma@apps.ipb.ac.id",
  "muhammadalfaatih@apps.ipb.ac.id",
  "fawazdevan@apps.ipb.ac.id",
  "ipb_rifqi@apps.ipb.ac.id",
  "122705dias.dias@apps.ipb.ac.id",
  "rafdirifansyah@apps.ipb.ac.id",
  "febryanarrifai@apps.ipb.ac.id",
  "muhammadfadhli@apps.ipb.ac.id",
  "nandoravy@apps.ipb.ac.id",
  "randhikapratama@apps.ipb.ac.id",
  "bee2putra@apps.ipb.ac.id",
  "arirahman@apps.ipb.ac.id",
  "raihanhanief1220raihan@apps.ipb.ac.id"
];

// ============================================================
// MODAL NOT LOGGED IN
// ============================================================
function ErrorModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-red-500/30">
          🔒
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Akses Ditolak</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Sebagai penilai Anda harus login terlebih dahulu. Penilai yang dapat memberikan nilai hanya 10 orang yang telah ditetapkan panitia, tidak bisa semuanya.
        </p>
        <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition w-full">
          Mengerti
        </button>
      </motion.div>
    </div>
  );
}

// ============================================================
// MODAL LOGIN PENILAI
// ============================================================
function LoginPenilaiModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (ALLOWED_EMAILS.includes(cleanEmail) && password === 'penilai6162') {
      const name = cleanEmail.split('@')[0];
      onLogin({ email: cleanEmail, name: name });
      setEmail('');
      setPassword('');
      setError('');
    } else {
      setError('Email belum terdaftar atau password salah!');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">✕</button>
        <h3 className="text-xl font-bold text-white mb-1">Login Penilai</h3>
        <p className="text-xs text-slate-400 mb-6">Silakan masuk dengan akun evaluator Anda.</p>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-blue-500" placeholder="Masukkan email..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-blue-500" placeholder="Masukkan password..." />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition mt-2">
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ResponsOprec() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [penilaianData, setPenilaianData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("oprecActiveTab") || "pendaftar";
  });
  
  useEffect(() => {
    sessionStorage.setItem("oprecActiveTab", activeTab);
  }, [activeTab]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States for Penilai Login
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [penilaiUser, setPenilaiUser] = useState(null);

  // Toast & Confirm states
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, variant: 'danger' });

  const showToast = (type, message) => setToast({ isOpen: true, type, message });
  const closeToast = () => setToast(prev => ({ ...prev, isOpen: false }));

  // Check Master Admin Auth
  useEffect(() => {
    if (sessionStorage.getItem("aisAdminLoggedIn") !== "true") {
      navigate("/admin");
    }
    const savedPenilai = sessionStorage.getItem("penilaiUser");
    if (savedPenilai) {
      setPenilaiUser(JSON.parse(savedPenilai));
    }
  }, [navigate]);

  // Fetch data
  const handleMigrateData = async () => {
    try {
      const q = query(collection(db, "bakalCalonPenghuni"));
      const snap = await getDocs(q);
      let count = 0;
      for (const docSnap of snap.docs) {
        const d = docSnap.data();
        const docRef = doc(db, "penilaianBakalCalonPenghuni", docSnap.id);
        const dataToSave = {
          nama: d.namaLengkap || "",
          prodi: d.programStudi || "",
          foto: d.fotoFormalUrl || "",
        };
        // Jika belum ada dokumen, atau untuk menimpa dengan data dasar
        await setDoc(docRef, dataToSave, { merge: true });
        count++;
      }
      showToast('success', `Migrasi Berhasil! ${count} data dipindahkan.`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal migrasi: ' + err.message);
    }
  };

  const handleTestConcurrency = async () => {
    if (!penilaianData || penilaianData.length === 0) return showToast('error', 'Tidak ada data kandidat');
    const targets = penilaianData.slice(0, 10);
    showToast('warning', `Memulai test 10 input serentak ke ${targets.length} kandidat teratas...`);
    
    const fakeUsersS1 = Array.from({length: 5}).map((_,i) => ({ email: `test.s1.${i}@apps.ipb.ac.id`, name: `Tester Sesi 1 - ${i+1}`, session: 1 }));
    const fakeUsersS2 = Array.from({length: 5}).map((_,i) => ({ email: `test.s2.${i}@apps.ipb.ac.id`, name: `Tester Sesi 2 - ${i+1}`, session: 2 }));
    const allTesters = [...fakeUsersS1, ...fakeUsersS2];

    const promises = [];
    
    for (const target of targets) {
      for (const tester of allTesters) {
        const candidateRef = doc(db, "penilaianBakalCalonPenghuni", target.id);
        const p = runTransaction(db, async (transaction) => {
          const candidateDoc = await transaction.get(candidateRef);
          const candidateData = candidateDoc.data() || {};
          const sessionKey = `sesi${tester.session}`;
          const currentSessionData = candidateData[sessionKey] || [];
          
          const details = {};
          const newRating = {
            evaluatorEmail: tester.email,
            evaluatorName: tester.name,
            total: Math.floor(Math.random() * 50) + 200,
            details: details,
            catatan: "Ini catatan otomatis test concurrency",
            updatedAt: new Date().toISOString()
          };
          
          currentSessionData.push(newRating);
          transaction.update(candidateRef, { [sessionKey]: currentSessionData });
        });
        promises.push(p);
      }
    }

    try {
      await Promise.all(promises);
      showToast('success', 'Test Concurrency Selesai! Cek apakah 10 nilai tersimpan.');
      // Refetch
      const pq = query(collection(db, "penilaianBakalCalonPenghuni"));
      const psnap = await getDocs(pq);
      setPenilaianData(psnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Concurrency error:", e);
      showToast('error', 'Terjadi error saat concurrency: ' + e.message);
    }
  };

  const handleClearTest = async () => {
    if (!penilaianData || penilaianData.length === 0) return;
    const targets = penilaianData.slice(0, 10);
    try {
      const promises = targets.map(async (target) => {
        const candidateRef = doc(db, "penilaianBakalCalonPenghuni", target.id);
        return runTransaction(db, async (transaction) => {
          const candidateDoc = await transaction.get(candidateRef);
          const candidateData = candidateDoc.data() || {};
          const filterTest = (arr) => (arr||[]).filter(x => !x.email?.includes('test.') && !x.evaluatorEmail?.includes('test.'));
          transaction.update(candidateRef, {
            sesi1: filterTest(candidateData.sesi1),
            sesi2: filterTest(candidateData.sesi2)
          });
        });
      });
      await Promise.all(promises);
      showToast('success', 'Data test berhasil dihapus!');
      const pq = query(collection(db, "penilaianBakalCalonPenghuni"));
      const psnap = await getDocs(pq);
      setPenilaianData(psnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
      showToast('error', 'Gagal hapus data test');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "bakalCalonPenghuni"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const fetchedData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(fetchedData);

        const pq = query(collection(db, "penilaianBakalCalonPenghuni"));
        const psnap = await getDocs(pq);
        setPenilaianData(psnap.docs.map((doc) => {
          const match = fetchedData.find((d) => d.id === doc.id);
          return { id: doc.id, batch: match?.batch || "UNKNOWN", ...doc.data() };
        }));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleWaStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, "bakalCalonPenghuni", id), {
        waGroupJoined: newStatus
      });
      setData(prev => prev.map(d => d.id === id ? { ...d, waGroupJoined: newStatus } : d));
    } catch (err) {
      console.error("Failed to update WA status:", err);
      showToast('error', 'Gagal mengupdate status WA');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("aisAdminLoggedIn");
    navigate("/admin");
  };

  const handleLoginPenilai = (user) => {
    setPenilaiUser(user);
    sessionStorage.setItem("penilaiUser", JSON.stringify(user));
    setShowLoginModal(false);
  };

  const handleLogoutPenilai = () => {
    setPenilaiUser(null);
    sessionStorage.removeItem("penilaiUser");
  };

  const handleSaveScore = async (candidateId, session, totalScore, details, catatan) => {
    try {
      const candidateRef = doc(db, "penilaianBakalCalonPenghuni", candidateId);

      const updatedPenilaian = await runTransaction(db, async (transaction) => {
        const candidateDoc = await transaction.get(candidateRef);
        if (!candidateDoc.exists()) {
          throw new Error("Kandidat tidak ditemukan di database!");
        }

        const candidateData = candidateDoc.data();

        const sessionKey = `sesi${session}`;
        const otherSessionKey = session === 1 ? 'sesi2' : 'sesi1';

        const currentSessionData = candidateData[sessionKey] || [];
        const otherSessionData = candidateData[otherSessionKey] || [];

        // Check if user already rated in the OTHER session
        const ratedInOther = otherSessionData.some(p => p.evaluatorEmail === penilaiUser.email);
        if (ratedInOther) {
          throw new Error(`Anda sudah menilai kandidat ini di ${session === 1 ? 'Sesi 2' : 'Sesi 1'}. Silakan hapus nilai Anda di sesi sebelumnya terlebih dahulu.`);
        }

        // Check if user already rated in CURRENT session
        const existingIndex = currentSessionData.findIndex(p => p.evaluatorEmail === penilaiUser.email);
        let newSessionData = [...currentSessionData];

        const newRating = {
          evaluatorEmail: penilaiUser.email,
          evaluatorName: penilaiUser.name,
          total: totalScore,
          details: details,
          catatan: catatan || "",
          updatedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          newSessionData[existingIndex] = newRating;
        } else {
          if (newSessionData.length >= 5) {
            throw new Error('Sesi ini sudah dinilai oleh maksimal 5 orang penilai.');
          }
          newSessionData.push(newRating);
        }

        const updates = {
          [sessionKey]: newSessionData
        };

        transaction.update(candidateRef, updates);
        return updates;
      });

      // Update local state automatically after successful transaction
      setPenilaianData(prev => prev.map(d => d.id === candidateId ? { ...d, ...updatedPenilaian } : d));
      showToast('success', 'Nilai berhasil disimpan!');
      return true;
    } catch (err) {
      console.error("Failed to save score:", err);
      showToast('error', err.message || 'Terjadi kesalahan saat menyimpan nilai.');
      return false;
    }
  };

  const handleDeleteScore = async (candidateId, session) => {
    try {
      const candidateRef = doc(db, "penilaianBakalCalonPenghuni", candidateId);

      const updatedPenilaian = await runTransaction(db, async (transaction) => {
        const candidateDoc = await transaction.get(candidateRef);
        if (!candidateDoc.exists()) {
          throw new Error("Kandidat tidak ditemukan di database!");
        }

        const candidateData = candidateDoc.data();
        const sessionKey = `sesi${session}`;
        const currentSessionData = candidateData[sessionKey] || [];

        const newSessionData = currentSessionData.filter(p => p.evaluatorEmail !== penilaiUser.email);

        const updates = {
          [sessionKey]: newSessionData
        };

        transaction.update(candidateRef, updates);
        return updates;
      });

      // Update local state
      setPenilaianData(prev => prev.map(d => d.id === candidateId ? { ...d, ...updatedPenilaian } : d));
      showToast('success', 'Nilai berhasil dihapus!');
    } catch (err) {
      console.error("Failed to delete score:", err);
      showToast('error', err.message || 'Terjadi kesalahan saat menghapus nilai.');
    }
  };

  const requestDeleteScore = (candidateId, session) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Nilai Anda?',
      message: `Apakah Anda yakin ingin menghapus nilai yang telah Anda berikan di Sesi ${session} untuk kandidat ini? Tindakan ini tidak dapat dibatalkan.`,
      variant: 'danger',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        handleDeleteScore(candidateId, session);
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">

      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} />
      <LoginPenilaiModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLoginPenilai} />
      <Toast isOpen={toast.isOpen} type={toast.type} message={toast.message} onClose={closeToast} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />

      {/* SIDEBAR */}
      <aside className={`bg-slate-900 border-r border-slate-700 hidden md:flex flex-col fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 border-b border-slate-700 flex items-center h-[73px]">
          <div className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
            <h1 className="text-xl font-bold text-white leading-tight">Admin OPREC</h1>
            <p className="text-xs text-orange-400 font-medium">Asrama IPB Sukasari</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <button
            onClick={() => setActiveTab("pendaftar")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "pendaftar" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            title="Daftar Pendaftar"
          >
            <span className="text-xl flex-shrink-0 flex items-center justify-center w-6 h-6">📋</span>
            <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 ml-1' : 'opacity-0 w-0 overflow-hidden'}`}>Daftar Pendaftar</span>
          </button>
          <button
            onClick={() => setActiveTab("penilaian")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "penilaian" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            title="Penilaian Wawancara"
          >
            <span className="text-xl flex-shrink-0 flex items-center justify-center w-6 h-6">📊</span>
            <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 ml-1' : 'opacity-0 w-0 overflow-hidden'}`}>Penilaian Wawancara</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-700">
          {/* <button onClick={handleMigrateData} className="w-full mb-2 flex items-center justify-center gap-2 p-2 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/20 transition-all font-medium" title="Migrate DB">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Migrate Data</span>
          </button>
          <button onClick={handleTestConcurrency} className="w-full mb-2 flex items-center justify-center gap-2 p-2 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-all font-medium" title="Test Concurrency">
            <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Test 10 User</span>
          </button>
          <button onClick={handleClearTest} className="w-full mb-2 flex items-center justify-center gap-2 p-2 text-xs bg-slate-500/10 text-slate-400 border border-slate-500/30 rounded-xl hover:bg-slate-500/20 transition-all font-medium" title="Clear Test">
            <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Hapus Test</span>
          </button> */}
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-2 text-xs bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-medium" title="Logout Admin">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>

        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-slate-700">
          <div className="px-4 py-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Toggle Sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="md:hidden w-40 sm:w-56">
                <ModernDropdown
                  value={activeTab}
                  onChange={(val) => setActiveTab(val)}
                  options={[
                    { value: "pendaftar", label: "Daftar Pendaftar" },
                    { value: "penilaian", label: "Penilaian Wawancara" }
                  ]}
                  placeholder="Pilih Menu"
                  className="w-full text-sm"
                />
              </div>
              <h2 className="hidden md:block text-lg font-bold text-white">
                {activeTab === 'pendaftar' ? 'Daftar Pendaftar' : 'Dashboard Penilaian'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === 'penilaian' && (
                <>
                  {!penilaiUser ? (
                    <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition text-xs shadow-md">
                      👤 Login Penilai
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 hidden sm:flex">
                        <div className="text-left">
                          <div className="text-xs font-bold text-white leading-tight">{penilaiUser.name}</div>
                          <div className="text-[9px] text-slate-400 leading-none mt-0.5">{penilaiUser.email}</div>
                        </div>
                      </div>
                      <button onClick={handleLogoutPenilai} className="text-slate-400 hover:text-red-400 p-1 transition bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs" title="Logout Penilai">
                        Logout Penilai
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="p-4 md:p-6 flex-1">
          {activeTab === "pendaftar" ? (
            <PendaftarTab data={data} loading={loading} onToggleWaStatus={handleToggleWaStatus} />
          ) : (
            <PenilaianTab
              data={penilaianData}
              penilaiLoggedIn={!!penilaiUser}
              penilaiUser={penilaiUser}
              onNotLoggedIn={() => setShowErrorModal(true)}
              onSaveScore={handleSaveScore}
              onDeleteScore={requestDeleteScore}
            />
          )}
        </main>

      </div>
    </div>
  );
}
