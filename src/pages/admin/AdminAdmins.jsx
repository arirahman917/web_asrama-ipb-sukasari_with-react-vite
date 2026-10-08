import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, ShieldOff, Search, Loader2, AlertTriangle } from "lucide-react";
import { fetchUsers, setUserAdmin } from "../../utils/users";
import { useAuth } from "../../context/AuthContext";

export default function AdminAdmins() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await fetchUsers());
    } catch (err) {
      console.error(err);
      setError(err?.message || "Gagal memuat data anggota.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const myEmail = (user?.email || "").toLowerCase();
  const myUid = user?.uid || "";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.nim || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const adminCount = users.filter((u) => u.isAdmin).length;

  const toggle = async (u) => {
    const isSelf = u.id === myUid || u.email === myEmail;
    if (isSelf && u.isAdmin) {
      alert("Tidak bisa mencabut akses admin milik akun sendiri.");
      return;
    }
    const next = !u.isAdmin;
    if (!window.confirm(`${next ? "Jadikan" : "Cabut akses"} admin untuk ${u.name || u.email}?`)) return;

    setBusy(u.id);
    // Optimistic update
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isAdmin: next } : x)));
    try {
      await setUserAdmin(u.id, next);
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isAdmin: !next } : x)));
    } finally {
      setBusy("");
    }
  };

  const searchInput =
    "w-full bg-white/5 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400 transition-all";

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Kelola Admin</h2>
          <p className="text-sm text-gray-400">
            Admin web ditandai dengan field <code className="text-orange-300">isAdmin</code> pada collection{" "}
            <code className="text-orange-300">users</code>.
          </p>
        </div>
        <span className="text-xs text-gray-500">
          Admin aktif: <span className="text-orange-400 font-bold">{adminCount}</span>
        </span>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm rounded-xl p-3 mb-4">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error} — pastikan Firestore Rules mengizinkan admin membaca collection <code>users</code>.</span>
        </div>
      )}

      <div className="relative w-full sm:max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, email, atau NIM..." className={searchInput} />
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-400 text-sm">
          Tidak ada anggota yang cocok.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((u) => {
            const isSelf = u.id === myUid || u.email === myEmail;
            const isBusy = busy === u.id;
            return (
              <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {u.photo ? (
                    <img src={u.photo} alt="" className="w-11 h-11 rounded-full object-cover bg-black/20 shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-black/20 flex items-center justify-center text-gray-300 font-bold shrink-0">
                      {(u.name || u.email).charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate flex items-center gap-2 flex-wrap">
                      {u.name || "Tanpa Nama"}
                      {u.isAdmin && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          Admin
                        </span>
                      )}
                      {isSelf && <span className="text-[10px] text-gray-500">(Anda)</span>}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {[u.jabatan, u.angkatan ? `Angkatan ${u.angkatan}` : "", u.prodi, u.nim]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggle(u)}
                  disabled={isBusy || (isSelf && u.isAdmin)}
                  title={isSelf && u.isAdmin ? "Tidak bisa mencabut akun sendiri" : ""}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-end sm:self-auto ${
                    u.isAdmin
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                  }`}
                >
                  {isBusy ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : u.isAdmin ? (
                    <ShieldOff className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {u.isAdmin ? "Cabut Admin" : "Jadikan Admin"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
