import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { fetchBerita, deleteBerita, updateBerita } from "../../utils/berita";
import { toExcerpt, toDateInputValue } from "../../utils/format";

export default function AdminBerita() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchBerita({ includeDrafts: true }));
    } catch (err) {
      console.error(err);
      alert("Gagal memuat berita: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus berita "${item.title}"?`)) return;
    try {
      await deleteBerita(item.id);
      setItems((prev) => prev.filter((b) => b.id !== item.id));
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const togglePublish = async (item) => {
    try {
      await updateBerita(item.id, {
        title: item.title,
        kategori: item.kategori,
        content: item.content,
        imageUrl: item.imageUrl,
        author: item.author,
        published: !item.published,
        dateInput: toDateInputValue(item.date),
      });
      setItems((prev) => prev.map((b) => (b.id === item.id ? { ...b, published: !b.published } : b)));
    } catch (err) {
      alert("Gagal mengubah status: " + err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Berita</h2>
          <p className="text-sm text-gray-400">Kelola berita & artikel asrama.</p>
        </div>
        <Link to="/admin/berita/baru"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20">
          <Plus className="w-4 h-4" /> Tulis Berita
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
          Belum ada berita. Klik "Tulis Berita" untuk membuat yang pertama.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex gap-4 items-center flex-1 min-w-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-black/20" />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-black/20 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">{item.kategori}</span>
                    {!item.published && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-300">Draf</span>
                    )}
                    <span className="text-[11px] text-gray-500">{item.dateLabel}</span>
                  </div>
                  <h3 className="text-white font-semibold leading-snug line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{toExcerpt(item.content, 120)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button onClick={() => togglePublish(item)} title={item.published ? "Jadikan draf" : "Terbitkan"}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                  {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <Link to={`/admin/berita/${item.id}`} title="Edit"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-blue-300 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(item)} title="Hapus"
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
