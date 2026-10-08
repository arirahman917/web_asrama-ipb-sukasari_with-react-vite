import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { fetchBeritaById, createBerita, updateBerita } from "../../utils/berita";
import { uploadFile } from "../../utils/storage";
import { toDateInputValue } from "../../utils/format";
import RichTextEditor from "../../components/admin/RichTextEditor";
import MarkdownView from "../../components/admin/MarkdownView";
import { useAuth } from "../../context/AuthContext";

const KATEGORI = [
  { value: "prestasi", label: "Prestasi" },
  { value: "event", label: "Event" },
  { value: "umum", label: "Umum" },
];

export default function AdminBeritaForm() {
  const { id } = useParams();
  const isEdit = id && id !== "baru";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    kategori: "umum",
    dateInput: toDateInputValue(new Date()),
    content: "",
    imageUrl: "",
    author: "",
    published: true,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const b = await fetchBeritaById(id);
        if (!b) {
          alert("Berita tidak ditemukan.");
          navigate("/admin/berita");
          return;
        }
        setForm({
          title: b.title,
          kategori: b.kategori,
          dateInput: toDateInputValue(b.date),
          content: b.content,
          imageUrl: b.imageUrl,
          author: b.author,
          published: b.published,
        });
      } catch (err) {
        alert("Gagal memuat berita: " + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "berita/cover");
      set("imageUrl", url);
    } catch (err) {
      alert("Gagal mengunggah gambar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Judul berita wajib diisi.");
    setSaving(true);
    try {
      const payload = { ...form, author: form.author || user?.displayName || user?.email || "" };
      if (isEdit) await updateBerita(id, payload);
      else await createBerita(payload);
      navigate("/admin/berita");
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400">Memuat berita...</p>;

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400 transition-all";

  return (
    <div className="max-w-4xl">
      <Link to="/admin/berita" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar berita
      </Link>
      <h2 className="text-2xl font-bold text-white mb-6">{isEdit ? "Edit Berita" : "Tulis Berita Baru"}</h2>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Judul</label>
          <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)}
            placeholder="Judul berita" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
            <select className={input} value={form.kategori} onChange={(e) => set("kategori", e.target.value)}>
              {KATEGORI.map((k) => <option key={k.value} value={k.value} className="text-black">{k.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal</label>
            <input type="date" className={input} value={form.dateInput} onChange={(e) => set("dateInput", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gambar Utama</label>
          <div className="flex flex-wrap items-center gap-4">
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview" className="w-32 h-24 rounded-xl object-cover bg-black/20" />
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-sm text-gray-200 cursor-pointer hover:bg-white/10 transition-all">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Mengunggah..." : "Pilih Gambar"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
            </label>
            {form.imageUrl && (
              <button onClick={() => set("imageUrl", "")} className="text-sm text-red-400 hover:text-red-300">Hapus</button>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Isi Berita (format Markdown)</label>
            <button onClick={() => setShowPreview((v) => !v)} className="text-xs text-orange-400 hover:text-orange-300">
              {showPreview ? "Sembunyikan pratinjau" : "Tampilkan pratinjau"}
            </button>
          </div>
          <RichTextEditor value={form.content} onChange={(md) => set("content", md)} />
          <p className="text-[11px] text-gray-500 mt-2">
            Editor menghasilkan format Markdown secara otomatis. Gunakan toolbar untuk H2/H3, tebal, miring, daftar, kutipan, tautan, dan gambar.
          </p>
        </div>

        {showPreview && (
          <div className="bg-white rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-3">Pratinjau tampilan di halaman berita:</p>
            <MarkdownView>{form.content}</MarkdownView>
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 accent-orange-500" />
            Terbitkan (tampil di website)
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Simpan Perubahan" : "Terbitkan Berita"}
          </button>
          <Link to="/admin/berita" className="px-6 py-3 text-sm text-gray-300 hover:text-white">Batal</Link>
        </div>
      </div>
    </div>
  );
}
