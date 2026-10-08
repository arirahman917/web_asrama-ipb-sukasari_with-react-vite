import React, { useEffect, useState } from "react";
import { Plus, Check, X, Pencil, Trash2, Loader2, Upload } from "lucide-react";
import {
  fetchAlumni, createAlumni, updateAlumni, deleteAlumni, setAlumniApproval,
} from "../../utils/alumni";
import { uploadFile } from "../../utils/storage";

const emptyForm = { id: null, name: "", role: "", quote: "", image: "", order: 0, approved: true };

export default function AdminAlumni() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchAlumni({ approvedOnly: false }));
    } catch (err) {
      alert("Gagal memuat data alumni: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const pending = items.filter((i) => !i.approved);
  const approved = items.filter((i) => i.approved);

  const openCreate = () => { setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item }); setModalOpen(true); };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      set("image", await uploadFile(file, "alumni"));
    } catch (err) {
      alert("Gagal mengunggah: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.quote.trim()) return alert("Nama dan pesan wajib diisi.");
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (form.id) await updateAlumni(form.id, payload);
      else await createAlumni(payload);
      setModalOpen(false);
      await load();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (item) => {
    try {
      await setAlumniApproval(item.id, true);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, approved: true } : i)));
    } catch (err) {
      alert("Gagal menyetujui: " + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus pesan dari "${item.name}"?`)) return;
    try {
      await deleteAlumni(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Kata Alumni</h2>
          <p className="text-sm text-gray-400">Pesan alumni yang tampil di carousel website.</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20">
          <Plus className="w-4 h-4" /> Tambah Alumni
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-orange-300 uppercase tracking-wider mb-3">
                Menunggu Persetujuan ({pending.length})
              </h3>
              <div className="flex flex-col gap-3">
                {pending.map((item) => (
                  <div key={item.id} className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.role}</p>
                      <p className="text-sm text-gray-300 mt-2 italic">"{item.quote}"</p>
                    </div>
                    <div className="flex items-start gap-2 shrink-0 self-end sm:self-auto">
                      <button onClick={() => handleApprove(item)} title="Setujui"
                        className="p-2.5 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item)} title="Tolak"
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Tampil di Website ({approved.length})
          </h3>
          {approved.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
              Belum ada data alumni. Bagian "Kata Alumni" disembunyikan di website sampai ada data.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {approved.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="flex gap-4 items-center flex-1 min-w-0">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover bg-black/20 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/20 shrink-0 flex items-center justify-center text-gray-400 text-lg font-bold">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.role}</p>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2 italic">"{item.quote}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button onClick={() => openEdit(item)} title="Edit"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-blue-300 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item)} title="Hapus"
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C33] border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{form.id ? "Edit Alumni" : "Tambah Alumni"}</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Nama</label>
                <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nama alumni" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Keterangan</label>
                <input className={input} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="cth: AIS'17 - Business Analyst" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Pesan / Kutipan</label>
                <textarea className={`${input} min-h-[100px]`} value={form.quote} onChange={(e) => set("quote", e.target.value)} placeholder="Pesan dan kesan..." />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Foto (opsional)</label>
                <div className="flex items-center gap-3">
                  {form.image && <img src={form.image} alt="" className="w-12 h-12 rounded-full object-cover" />}
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-gray-200 cursor-pointer hover:bg-white/10">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={form.approved} onChange={(e) => set("approved", e.target.checked)} className="w-4 h-4 accent-orange-500" />
                Tampilkan di website
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Simpan
              </button>
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-300 hover:text-white">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
