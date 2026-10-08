import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Plus, X, Loader2, Upload, Check } from 'lucide-react';
import { fetchApprovedAlumni, submitAlumniMessage } from '../../utils/alumni';
import { uploadFile } from '../../utils/storage';

// ============================================================
// Form pengajuan pesan alumni (muncul setelah disetujui pengurus)
// ============================================================
function AlumniFormModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', role: '', quote: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setForm({ name: '', role: '', quote: '', image: '' });
    setDone(false);
    setError('');
    setUploading(false);
    setSubmitting(false);
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      set('image', await uploadFile(file, 'alumni'));
    } catch (err) {
      setError('Gagal mengunggah foto: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.quote.trim()) {
      setError('Nama dan pesan wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await submitAlumniMessage(form);
      setDone(true);
    } catch (err) {
      setError('Gagal mengirim pesan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => { reset(); onClose(); };
  const input =
    'w-full rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Bagikan Pesanmu</h3>
              <button onClick={close} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            {done ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Terima kasih!</h4>
                <p className="text-sm text-gray-500">
                  Pesanmu sudah terkirim dan akan tampil di halaman ini setelah disetujui pengurus.
                </p>
                <button onClick={close} className="mt-6 px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors">
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama</label>
                  <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nama lengkap" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Angkatan / Keterangan</label>
                  <input className={input} value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="cth: AIS'17 - Business Analyst" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pesan & Kesan</label>
                  <textarea className={`${input} min-h-[110px]`} value={form.quote} onChange={(e) => set('quote', e.target.value)} placeholder="Tulis pesan dan kesanmu selama di asrama..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto (opsional)</label>
                  <div className="flex items-center gap-3">
                    {form.image && <img src={form.image} alt="" className="w-11 h-11 rounded-full object-cover" />}
                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Pilih Foto
                      <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                    </label>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button type="submit" disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-60">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Kirim Pesan
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function KataAlumni() {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchApprovedAlumni();
        if (active) setAlumniData(data);
      } catch (err) {
        console.error('Gagal memuat alumni:', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const total = alumniData.length;
  const next = () => setActiveIndex((prev) => (prev + 1) % total);
  const prev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  const getRelativePosition = (index) => {
    if (total <= 1) return 0;
    const diff = index - activeIndex;
    if (diff === 0) return 0;
    if (diff === 1 || (activeIndex === total - 1 && index === 0)) return 1;
    if (diff === -1 || (activeIndex === 0 && index === total - 1)) return -1;
    return 2;
  };

  // Sembunyikan seluruh section bila belum ada data alumni.
  if (loading || total === 0) return null;

  return (
    <section id="alumni" className="bg-[#0A2F4C] min-h-[500px] lg:h-screen lg:min-h-[600px] flex flex-col justify-center py-20 lg:py-0 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative">

        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-2">
          <motion.h2
            initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wider"
          >
            Kata Alumni
          </motion.h2>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 flex justify-center">
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="flex items-center justify-between w-full mt-8 relative">
          <button onClick={prev} aria-label="Geser Kiri"
            className="z-50 w-10 h-10 md:w-12 md:h-12 flex flex-shrink-0 items-center justify-center rounded-full text-white hover:text-orange-400 transition-colors duration-300">
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="relative w-full h-[320px] md:h-[380px] flex justify-center items-center perspective-[1000px]">
            {alumniData.map((alumni, index) => {
              const pos = getRelativePosition(index);
              let classes = 'absolute transition-all duration-500 ease-in-out w-[220px] md:w-[260px] ';
              if (pos === 0) classes += 'z-20 opacity-100 scale-100 translate-x-0';
              else if (pos === -1) classes += 'z-10 opacity-60 scale-75 -translate-x-[30%] md:-translate-x-[96%] blur-[1px]';
              else if (pos === 1) classes += 'z-10 opacity-60 scale-75 translate-x-[30%] md:translate-x-[96%] blur-[1px]';
              else classes += 'z-0 opacity-0 scale-50 translate-x-0 pointer-events-none';

              return (
                <div key={alumni.id} className={classes}>
                  <div className="relative bg-white rounded-3xl p-5 pt-12 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center text-center h-full">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden bg-gray-200 shadow-md flex items-center justify-center">
                      {alumni.image ? (
                        <img src={alumni.image} alt={alumni.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-500">{alumni.name?.charAt(0)?.toUpperCase()}</span>
                      )}
                    </div>

                    <div className="relative w-full flex-grow flex flex-col items-center mt-2">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 w-full px-2 whitespace-nowrap overflow-hidden text-ellipsis">
                        {alumni.name}
                      </h3>
                      {alumni.role && (
                        <p className="text-[10px] md:text-[11px] font-semibold text-gray-500 mb-4">{alumni.role}</p>
                      )}

                      <div className="w-16 h-[2px] bg-orange-400 mb-4"></div>

                      <div className="relative flex-grow flex items-center w-full">
                        <Quote className="absolute -top-2 -left-2 w-5 h-5 text-gray-200 -z-10 rotate-180" />
                        <p className="text-gray-600 leading-relaxed text-[11px] md:text-xs">{alumni.quote}</p>
                        <Quote className="absolute -bottom-2 -right-2 w-5 h-5 text-gray-200 -z-10" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={next} aria-label="Geser Kanan"
            className="z-50 w-10 h-10 md:w-12 md:h-12 flex flex-shrink-0 items-center justify-center rounded-full text-white hover:text-orange-400 transition-colors duration-300">
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>
      </div>

      <AlumniFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}
