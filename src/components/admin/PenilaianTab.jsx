import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernDropdown from './ModernDropdown';
import { Toast } from './CustomModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const INDICATORS = {
  1: [
    {
      id: '1_1', name: 'Pengenalan Diri',
      desc: 'Mengukur kemampuan komunikasi awal, rasa percaya diri, dan objektivitas.',
      questions: [
        '1. Ceritakan dirimu secara singkat, boleh tentang kepribadian ataupun pengalaman.',
        '2. Sebutkan kelebihan dan kekurangan pada dirimu. Bagaimana kamu memanfaatkan kelebihan dan mengatasi kekurangan tersebut?'
      ],
      rubrik: {
        kurang: 'Komunikasi terbata-bata/pasif, tidak bisa menyebutkan secara objektif.',
        cukup: 'Lancar, tahu kelebihan/kekurangannya, solusi mengatasi kekurangan masih teoretis.',
        baik: 'Sangat percaya diri, terstruktur, memberikan contoh nyata cara mengelola kekurangan.'
      }
    },
    {
      id: '1_2', name: 'Alasan dan Tujuan',
      desc: 'Menilai motivasi intrinsik kandidat, tingkat ketertarikan, dan keselarasan visi.',
      questions: [
        '3. Dari sekian banyak pilihan tempat tinggal, mengapa kamu secara spesifik memilih asrama ini?'
      ],
      rubrik: {
        kurang: 'Alasan terlalu dangkal/oportunis (hanya karena murah/ikut teman) tanpa riset asrama.',
        cukup: 'Alasan jelas (ingin mandiri), namun belum terlalu paham fasilitas/nilai asrama secara mendalam.',
        baik: 'Motivasi sangat kuat, memahami budaya asrama, menunjukkan visi yang jelas.'
      }
    },
    {
      id: '1_3', name: 'Resiliensi',
      desc: 'Mengukur ketangguhan mental, tingkat loyalitas, dan konsistensi.',
      questions: [
        '4. Bagaimana jika kamu tidak lolos seleksi wawancara ini?',
        '5. Andai kamu lolos, namun ternyata kamu merasa tidak cocok dengan asrama, apa yang akan kamu lakukan?'
      ],
      rubrik: {
        kurang: 'Mudah menyerah, kecewa berat, atau langsung keluar jika merasa tidak cocok.',
        cukup: 'Sikap pasrah positif jika gagal, mau mencoba bertahan jika tidak cocok tapi pasif.',
        baik: 'Kedewasaan mental; ada plan B positif, bersedia adaptasi aktif / komunikasi asertif.'
      }
    }
  ],
  2: [
    {
      id: '2_1', name: 'Kecerdasan Emosional',
      desc: 'Mengevaluasi kemampuan dalam mengelola stres dan rasa marah secara asertif.',
      questions: [
        '1. Ketika kamu melakukan kesalahan, bagaimana cara kamu menyelesaikannya?',
        '2. Ketika kamu marah atau terganggu tindakan orang lain, bagaimana caramu menyampaikannya?'
      ],
      rubrik: {
        kurang: 'Emosional, reaktif, memendam rasa yang berpotensi meledak, atau passive-aggressive.',
        cukup: 'Mampu menahan emosi, namun kurang berani mengomunikasikan akar masalah terbuka.',
        baik: 'Mampu menyampaikan kritik/rasa tidak nyaman dengan tenang, fokus solusi.'
      }
    },
    {
      id: '2_2', name: 'Adaptabilitas dan Toleransi',
      desc: 'Menilai keluwesan menghadapi rutinitas dan keterbukaan latar belakang.',
      questions: [
        '3. Apa tantangan yang dihadapi saat menyesuaikan diri dengan lingkungan baru?',
        '4. Jika teman sekamarmu memiliki budaya bertolak belakang, bagaimana menanganinya?'
      ],
      rubrik: {
        kurang: 'Kaku, memaksakan standar pribadinya, mengeluh terhadap perubahan.',
        cukup: 'Mampu menyesuaikan diri meski butuh waktu lama atau melalui proses canggung.',
        baik: 'Fleksibel, proaktif mencari titik tengah (win-win solution), empati tinggi.'
      }
    },
    {
      id: '2_3', name: 'Integritas dan Tanggung Jawab',
      desc: 'Mengukur kejujuran, komitmen tugas, dan keberanian mengakui kesalahan.',
      questions: [
        '5. Bagaimana kamu bertanggungjawab atas kepercayaan yang diberikan kepadamu?',
        '6. Bagaimana sikapmu jika asrama butuh orang yang berjaga di masa liburan?'
      ],
      rubrik: {
        kurang: 'Mencari alasan, menyalahkan keadaan/orang lain saat berbuat salah.',
        cukup: 'Mau bertanggungjawab, namun sering butuh pengawasan atau dorongan orang lain.',
        baik: 'Inisiatif tinggi, jujur tanpa ditanya, komitmen penuh atas kepercayaan.'
      }
    },
  ]
};

// ============================================================
// POPUP RINCIAN NILAI
// ============================================================
function ScoreDetailModal({ isOpen, onClose, evaluators, sessionName, candidateName }) {
  if (!isOpen) return null;

  const sessionIndicators = INDICATORS[sessionName] || [];
  const indicatorAverages = sessionIndicators.map(ind => {
    let sum = 0;
    let count = 0;
    if (evaluators) {
      evaluators.forEach(ev => {
        if (ev.details && ev.details[ind.id]) {
          sum += parseInt(ev.details[ind.id]);
          count++;
        }
      });
    }
    return {
      id: ind.id,
      name: ind.name,
      average: count > 0 ? Number((sum / count).toFixed(1)) : 0,
      count: count
    };
  });

  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 bg-slate-800 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">✕</button>
          <h3 className="text-lg font-bold text-white mb-1">Rincian Nilai Sesi {sessionName}</h3>
          <p className="text-xs text-blue-400">{candidateName}</p>
        </div>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }} data-lenis-prevent="true">
          {evaluators && evaluators.length > 0 ? (
            <div className="space-y-3">
              {/* 
              {evaluators.map((ev, i) => (
                <div key={i} className="flex flex-col bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm font-bold text-white">{ev.evaluatorName || "Penilai"}</div>
                      <div className="text-[10px] text-slate-400">{ev.evaluatorEmail}</div>
                    </div>
                    <div className="bg-blue-600/20 text-blue-400 font-bold px-3 py-1.5 rounded border border-blue-500/30">
                      {ev.total}
                    </div>
                  </div>
                </div>
              ))}
              */}
              {indicatorAverages.map((ind, i) => (
                <div key={i} className="flex flex-col bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm font-bold text-white">{ind.name}</div>
                      <div className="text-[10px] text-slate-400">Rata-rata dari {ind.count} penilai</div>
                    </div>
                    <div className="bg-emerald-600/20 text-emerald-400 font-bold px-3 py-1.5 rounded border border-emerald-500/30">
                      {ind.average}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Belum ada penilai untuk sesi ini.</p>
          )}
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 shrink-0">
          <button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-xl transition">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// POPUP CATATAN PENILAI
// ============================================================
function CatatanModal({ isOpen, onClose, catatan, candidateName }) {
  if (!isOpen) return null;
  const truncate = (text, maxWords = 30) => {
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };
  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 bg-slate-800 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">✕</button>
          <h3 className="text-lg font-bold text-white mb-1">Catatan Penilai</h3>
          <p className="text-xs text-blue-400">{candidateName}</p>
        </div>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }} data-lenis-prevent="true">
          {catatan && catatan.length > 0 ? (() => {
            const sesi1 = catatan.filter(ct => ct.sesi === 1);
            const sesi2 = catatan.filter(ct => ct.sesi === 2);
            return (
              <div className="space-y-5">
                {/* Sesi 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-600/20 text-blue-400">Sesi 1</span>
                    <span className="text-xs text-slate-500">{sesi1.length} catatan</span>
                  </div>
                  {sesi1.length > 0 ? (
                    <div className="space-y-2">
                      {sesi1.map((ct, i) => (
                        <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                          <div className="text-sm font-bold text-white mb-1">{ct.nama}</div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{truncate(ct.catatan)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic pl-1">Belum ada catatan.</p>
                  )}
                </div>

                {/* Sesi 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-600/20 text-emerald-400">Sesi 2</span>
                    <span className="text-xs text-slate-500">{sesi2.length} catatan</span>
                  </div>
                  {sesi2.length > 0 ? (
                    <div className="space-y-2">
                      {sesi2.map((ct, i) => (
                        <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                          <div className="text-sm font-bold text-white mb-1">{ct.nama}</div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{truncate(ct.catatan)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic pl-1">Belum ada catatan.</p>
                  )}
                </div>
              </div>
            );
          })() : (
            <p className="text-sm text-slate-500 text-center py-4">Belum ada catatan untuk kandidat ini.</p>
          )}
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 shrink-0">
          <button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-xl transition">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function PenilaianTab({ data, penilaiLoggedIn, penilaiUser, onNotLoggedIn, onSaveScore, onDeleteScore }) {
  const [editingCandidateId, setEditingCandidateId] = useState(null);
  const [currentSession, setCurrentSession] = useState(1);
  const [sortState, setSortState] = useState({ column: 'total', asc: false });
  const [formData, setFormData] = useState({});
  const [activeBatch, setActiveBatch] = useState("BATCH 1");

  const BATCHES = ["BATCH 1", "BATCH 2", "BATCH 3"];

  // Info Modal State
  const [detailModal, setDetailModal] = useState({ isOpen: false, evaluators: [], sessionName: '', candidateName: '' });
  const [catatanModal, setCatatanModal] = useState({ isOpen: false, catatan: [], candidateName: '' });
  const [localToast, setLocalToast] = useState({ isOpen: false, type: 'warning', message: '' });
  const showLocalToast = (type, msg) => setLocalToast({ isOpen: true, type, message: msg });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#form' && editingCandidateId !== null) {
        setEditingCandidateId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [editingCandidateId]);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (detailModal.isOpen || catatanModal.isOpen || editingCandidateId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [detailModal.isOpen, catatanModal.isOpen, editingCandidateId]);

  const handleCloseForm = () => {
    setEditingCandidateId(null);
    if (window.location.hash === '#form') {
      window.history.back();
    }
  };

  // Helper function to calculate average
  const getAverage = (sessionArray) => {
    if (!sessionArray || sessionArray.length === 0) return 0;
    const total = sessionArray.reduce((sum, ev) => sum + (ev.total || 0), 0);
    return Math.round(total / sessionArray.length);
  };

  const handleSort = (column) => {
    if (sortState.column === column) {
      setSortState({ ...sortState, asc: !sortState.asc });
    } else {
      setSortState({ column, asc: column === 'namaLengkap' ? true : false });
      setSortState({ column, asc: column === 'nama' ? true : false });
    }
  };

  const filteredBatchData = data.filter(d => d.batch === activeBatch);

  const sortedData = [...filteredBatchData].sort((a, b) => {
    let valA, valB;
    if (sortState.column === 'nama') {
      valA = (a.nama || '').toLowerCase();
      valB = (b.nama || '').toLowerCase();
    } else if (sortState.column === 'sesi1') {
      valA = getAverage(a?.sesi1);
      valB = getAverage(b?.sesi1);
    } else if (sortState.column === 'sesi2') {
      valA = getAverage(a?.sesi2);
      valB = getAverage(b?.sesi2);
    } else if (sortState.column === 'total') {
      valA = getAverage(a?.sesi1) + getAverage(a?.sesi2);
      valB = getAverage(b?.sesi1) + getAverage(b?.sesi2);
    }
    if (valA < valB) return sortState.asc ? -1 : 1;
    if (valA > valB) return sortState.asc ? 1 : -1;
    return 0;
  });

  const getFormDataForUser = (candidate, session) => {
    if (!penilaiUser || !candidate) return {};
    const sessionData = candidate[`sesi${session}`] || [];
    const userEval = sessionData.find(e => e.evaluatorEmail === penilaiUser.email);
    return userEval ? { ...userEval.details, catatan: userEval.catatan || '' } : { catatan: '' };
  };

  const handleOpenForm = (candidateId) => {
    if (!penilaiLoggedIn) {
      onNotLoggedIn();
      return;
    }
    const candidate = data.find(c => c.id === candidateId);
    setFormData(getFormDataForUser(candidate, currentSession));
    setEditingCandidateId(candidateId);
    window.history.pushState({ isForm: true }, '', '#form');
  };

  const handleSessionChange = (val) => {
    const ses = parseInt(val);
    setCurrentSession(ses);
    if (editingCandidateId) {
      const candidate = data.find(c => c.id === editingCandidateId);
      setFormData(getFormDataForUser(candidate, ses));
    }
  };

  const handleSave = async () => {
    const indicators = INDICATORS[currentSession];
    let allFilled = true;
    let total = 0;

    indicators.forEach(ind => {
      if (!formData[ind.id]) {
        allFilled = false;
      } else {
        total += parseInt(formData[ind.id]);
      }
    });

    if (!allFilled) {
      showLocalToast('warning', 'Harap pilih nilai pada seluruh indikator sebelum melakukan simpan!');
      return;
    }

    const result = await onSaveScore(editingCandidateId, currentSession, total, formData, formData.catatan);
    if (result) {
      handleCloseForm();
    }
  };

  const getSortIcon = (column) => {
    if (sortState.column !== column) return <span className="ml-1 text-gray-500">↕</span>;
    return sortState.asc ? <span className="ml-1 text-blue-400">↑</span> : <span className="ml-1 text-blue-400">↓</span>;
  };

  const openDetail = (candidate, sessionName, evaluators) => {
    setDetailModal({
      isOpen: true,
      candidateName: candidate.nama,
      sessionName: sessionName,
      evaluators: evaluators || []
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(16);
    doc.text(`Rekapitulasi Penilaian Calon Penghuni Baru AIS - ${activeBatch}`, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

    const getIndicatorAvg = (evaluators, indId) => {
      let sum = 0;
      let count = 0;
      if (evaluators) {
        evaluators.forEach(ev => {
          if (ev.details && ev.details[indId]) {
            sum += parseInt(ev.details[indId]);
            count++;
          }
        });
      }
      return count > 0 ? Number((sum / count).toFixed(1)) : 0;
    };

    const tableColumn = [
      "No", "Nama Kandidat", "Program Studi", 
      "Pengenalan Diri", "Alasan & Tujuan", "Resiliensi", "Sesi 1 (Sum)",
      "K. Emosional", "Adaptabilitas", "Integritas", "Sesi 2 (Sum)",
      "Total Akhir"
    ];
    
    const tableRows = [];

    sortedData.forEach((c, idx) => {
      const avgS1 = getAverage(c.sesi1 || []);
      const avgS2 = getAverage(c.sesi2 || []);
      const totalScore = avgS1 + avgS2;
      
      const s1_1 = getIndicatorAvg(c.sesi1, '1_1');
      const s1_2 = getIndicatorAvg(c.sesi1, '1_2');
      const s1_3 = getIndicatorAvg(c.sesi1, '1_3');
      
      const s2_1 = getIndicatorAvg(c.sesi2, '2_1');
      const s2_2 = getIndicatorAvg(c.sesi2, '2_2');
      const s2_3 = getIndicatorAvg(c.sesi2, '2_3');

      const candidateData = [
        idx + 1,
        c.nama || "Tanpa Nama",
        c.prodi || "-",
        s1_1, s1_2, s1_3, avgS1,
        s2_1, s2_2, s2_3, avgS2,
        totalScore
      ];
      tableRows.push(candidateData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 7 },
      headStyles: { fillColor: [30, 41, 59], halign: 'center' },
      columnStyles: {
        3: { fillColor: [244, 248, 255] }, 
        4: { fillColor: [244, 248, 255] },
        5: { fillColor: [244, 248, 255] },
        6: { fillColor: [224, 236, 255], fontStyle: 'bold' },
        7: { fillColor: [244, 255, 244] },
        8: { fillColor: [244, 255, 244] },
        9: { fillColor: [244, 255, 244] },
        10: { fillColor: [224, 250, 224], fontStyle: 'bold' },
        11: { fillColor: [255, 245, 230], fontStyle: 'bold' }
      }
    });

    doc.save(`Rekap_Penilaian_${activeBatch.replace(" ", "_")}.pdf`);
    showLocalToast('success', `PDF untuk ${activeBatch} berhasil di-generate!`);
  };

  const dropdownOptions = [
    { value: 60, label: '60 - Kurang Sekali' },
    { value: 65, label: '65 - Kurang' },
    { value: 70, label: '70 - Cukup' },
    { value: 75, label: '75 - Cukup' },
    { value: 80, label: '80 - Baik' },
    { value: 85, label: '85 - Baik' },
    { value: 90, label: '90 - Sangat Baik' },
  ];

  if (editingCandidateId) {
    const candidate = data.find(c => c.id === editingCandidateId);
    const indicators = INDICATORS[currentSession];
    const totalScore = indicators.reduce((sum, ind) => sum + (parseInt(formData[ind.id]) || 0), 0);

    const sessionData = candidate?.[`sesi${currentSession}`] || [];
    const hasRatedCurrentSession = sessionData.some(e => e.evaluatorEmail === penilaiUser?.email);

    return (
      <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-4 gap-6 text-slate-200 font-sans">
        <Toast isOpen={localToast.isOpen} type={localToast.type} message={localToast.message} onClose={() => setLocalToast(prev => ({ ...prev, isOpen: false }))} />
        <aside className="lg:col-span-1 space-y-4 relative z-20">
          <button onClick={handleCloseForm} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-3 px-4 rounded-xl transition border border-slate-700 flex items-center justify-center">
            <span className="mr-2">←</span> Kembali ke Tabel
          </button>

          <div className="bg-[#1f2937] rounded-xl border border-slate-700 sticky top-24 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-[#1f2937] h-16 rounded-t-xl"></div>
            <div className="px-5 pb-5 -mt-8 relative">
              <div className="w-16 h-16 bg-slate-800 rounded-lg border-4 border-[#1f2937] flex items-center justify-center text-2xl mb-3 shadow-md overflow-hidden">
                {candidate.foto ? (
                  <img src={candidate.foto} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400">👤</span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white mb-1 whitespace-pre-wrap leading-tight">{candidate.nama}</h2>
              <p className="text-blue-400 text-xs font-medium mb-4">{candidate.prodi}</p>

              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 mb-4 flex justify-between items-center">
                <span className="text-sm text-slate-400">Target Rubrik:</span>
                <span className={`text-white text-[11px] font-bold px-2 py-1 rounded shadow-sm ${currentSession === 1 ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  SESI {currentSession}
                </span>
              </div>

              <div className="mb-4 text-xs font-bold text-slate-400">
                <span className="block mb-2">Ganti Sesi Penilaian:</span>
                <ModernDropdown
                  value={currentSession}
                  onChange={(val) => handleSessionChange(val)}
                  options={[
                    { value: 1, label: "Sesi 1" },
                    { value: 2, label: "Sesi 2" }
                  ]}
                  placeholder="Pilih Sesi"
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3 bg-[#1f2937] rounded-xl border border-slate-700 shadow-lg flex flex-col z-10">
          <div className="p-6 border-b border-slate-700 bg-slate-800/50">
            <h3 className="text-lg font-bold text-white mb-1">Formulir Penilaian Wawancara</h3>
            <p className="text-sm text-slate-400">Isi nilai sesuai dengan rubrik yang telah disediakan.</p>
          </div>

          <div className="p-6 flex-grow flex flex-col space-y-6">
            {indicators.map((ind, idx) => (
              <div key={ind.id} className="bg-slate-800 rounded-xl p-5 md:p-6 border border-slate-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{idx + 1}. {ind.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{ind.desc}</p>

                    <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg mb-4">
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-2">Referensi Pertanyaan:</span>
                      <ul className="list-disc text-slate-300 font-medium ml-4">
                        {ind.questions.map((q, i) => <li key={i} className="text-blue-300 text-sm mb-1">{q}</li>)}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-red-900/30">
                        <span className="block text-xs font-bold text-red-400 mb-1">Kurang (&lt;70)</span>
                        <p className="text-[13px] text-slate-400 leading-snug">{ind.rubrik.kurang}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-yellow-900/30">
                        <span className="block text-xs font-bold text-yellow-400 mb-1">Cukup (70-80)</span>
                        <p className="text-[13px] text-slate-400 leading-snug">{ind.rubrik.cukup}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-green-900/30">
                        <span className="block text-xs font-bold text-green-400 mb-1">Baik (&gt;80)</span>
                        <p className="text-[13px] text-slate-400 leading-snug">{ind.rubrik.baik}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-64 shrink-0 mt-4 md:mt-0">
                    <label className="block text-sm font-bold text-slate-300 mb-2">Input Nilai</label>
                    <ModernDropdown
                      value={formData[ind.id]}
                      onChange={(val) => setFormData({ ...formData, [ind.id]: val })}
                      options={dropdownOptions}
                      placeholder="-- Pilih Nilai --"
                      direction="down"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-slate-800 rounded-xl p-5 md:p-6 border border-slate-700">
              <label className="block text-lg font-bold text-white mb-2">Catatan Penilaian (Opsional)</label>
              <p className="text-sm text-slate-400 mb-4">Berikan catatan tambahan, masukan, atau kesan khusus terhadap kandidat ini.</p>
              <textarea
                value={formData.catatan || ''}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                rows="4"
                placeholder="Tulis catatan di sini..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
              ></textarea>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 sticky bottom-0 bg-[#1f2937] p-4 -mx-6 -mb-6 rounded-b-xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.3)] z-20">
              <div className="flex items-center gap-4">
                <div className="text-slate-400 text-sm">Akumulasi Nilai Anda (Sesi {currentSession}):</div>
                <div className="text-3xl font-bold text-blue-400">{totalScore}</div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                {hasRatedCurrentSession && (
                  <button onClick={() => {
                    onDeleteScore(editingCandidateId, currentSession);
                  }} className="w-full md:w-auto bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                    🗑️ Hapus Nilai Saya
                  </button>
                )}
                <button onClick={handleSave} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
                  Simpan Penilaian
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full font-sans text-slate-200">

      <ScoreDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
        candidateName={detailModal.candidateName}
        sessionName={detailModal.sessionName}
        evaluators={detailModal.evaluators}
      />

      <CatatanModal
        isOpen={catatanModal.isOpen}
        onClose={() => setCatatanModal({ ...catatanModal, isOpen: false })}
        candidateName={catatanModal.candidateName}
        catatan={catatanModal.catatan}
      />

      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Rekapitulasi Pendaftar</h2>
          <p className="text-slate-400 text-sm">Menampilkan seluruh nilai peserta yang dapat diurutkan berdasarkan batch.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 w-full sm:w-auto overflow-x-auto custom-scrollbar">
            {BATCHES.map(b => (
              <button key={b} onClick={() => setActiveBatch(b)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeBatch === b ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                {b}
              </button>
            ))}
          </div>
          <button onClick={handleExportPDF} className="shrink-0 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 border border-emerald-500/30">
            <span>📄</span> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-[#1f2937] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-800 border-b border-slate-700 text-slate-300 text-sm select-none">
                <th className="p-4 font-medium w-16 text-center">No</th>
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-700/50 transition" onClick={() => handleSort('namaLengkap')}>
                  Kandidat {getSortIcon('namaLengkap')}
                </th>
                <th className="p-4 font-medium text-center cursor-pointer hover:bg-slate-700/50 transition" onClick={() => handleSort('sesi1')}>
                  Sesi 1 {getSortIcon('sesi1')}
                </th>
                <th className="p-4 font-medium text-center cursor-pointer hover:bg-slate-700/50 transition" onClick={() => handleSort('sesi2')}>
                  Sesi 2 {getSortIcon('sesi2')}
                </th>
                <th className="p-4 font-medium text-center border-l border-slate-700 cursor-pointer hover:bg-slate-700/50 transition" onClick={() => handleSort('total')}>
                  Total Akhir {getSortIcon('total')}
                </th>
                <th className="p-4 font-medium text-left">Catatan</th>
                <th className="p-4 font-medium text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {sortedData.map((c, idx) => {
                const arrS1 = c.sesi1 || [];
                const arrS2 = c.sesi2 || [];
                const avgS1 = getAverage(arrS1);
                const avgS2 = getAverage(arrS2);
                const totalScore = avgS1 + avgS2;
                const myRatedS1 = penilaiUser && arrS1.some(e => e.evaluatorEmail === penilaiUser.email);
                const myRatedS2 = penilaiUser && arrS2.some(e => e.evaluatorEmail === penilaiUser.email);

                return (
                  <tr key={c.id} className="hover:bg-slate-800/80 transition border-b border-slate-700/50">
                    <td className="p-4 text-sm text-slate-400 text-center">{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
                          {c.foto && (!c.foto.toLowerCase().includes('.pdf')) ? (
                            <img src={c.foto} alt={c.nama} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{c.nama || 'Tanpa Nama'}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{c.prodi || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-center">
                      {arrS1.length > 0 ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openDetail(c, 1, arrS1)} className="text-slate-400 hover:text-blue-400 p-0.5 rounded-full hover:bg-slate-700 transition" title="Lihat rincian penilai">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                          <span className="bg-slate-700 text-white font-medium py-1 px-3 rounded text-xs border border-slate-600 shadow-sm">
                            {avgS1} <span className={`text-[9px] ml-1 ${myRatedS1 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>({arrS1.length} org)</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-xs">Belum</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-center">
                      {arrS2.length > 0 ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openDetail(c, 2, arrS2)} className="text-slate-400 hover:text-blue-400 p-0.5 rounded-full hover:bg-slate-700 transition" title="Lihat rincian penilai">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                          <span className="bg-slate-700 text-white font-medium py-1 px-3 rounded text-xs border border-slate-600 shadow-sm">
                            {avgS2} <span className={`text-[9px] ml-1 ${myRatedS2 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>({arrS2.length} org)</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-xs">Belum</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-white border-l border-slate-700 bg-slate-800/30 text-lg">
                      {totalScore === 0 ? '-' : totalScore}
                    </td>
                    <td className="p-4 text-center">
                      {(() => {
                        const allCatatan = [
                          ...arrS1.filter(e => e.catatan).map(e => ({ nama: e.evaluatorName, sesi: 1, catatan: e.catatan })),
                          ...arrS2.filter(e => e.catatan).map(e => ({ nama: e.evaluatorName, sesi: 2, catatan: e.catatan }))
                        ];
                        if (allCatatan.length === 0) return <span className="text-slate-500 italic text-xs">-</span>;
                        return (
                          <button
                            onClick={() => setCatatanModal({ isOpen: true, catatan: allCatatan, candidateName: c.nama })}
                            className="text-blue-400 hover:text-blue-300 text-xs font-medium underline underline-offset-2 transition"
                          >
                            Lihat ({allCatatan.length})
                          </button>
                        );
                      })()}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleOpenForm(c.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md w-full flex items-center justify-center">
                        Buka Form
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sortedData.length === 0 && (
            <div className="text-center py-10 text-slate-500 italic">Belum ada data pendaftar.</div>
          )}
        </div>
      </div>
    </div>
  );
}
