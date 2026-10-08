import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Users, Clock } from "lucide-react";
import { fetchBerita } from "../../utils/berita";
import { fetchAlumni } from "../../utils/alumni";

// eslint-disable-next-line no-unused-vars
function StatCard({ icon: Icon, label, value, to }) {
  const inner = (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <Icon className="w-5 h-5 text-orange-400" />
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ berita: 0, alumni: 0, pending: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [berita, alumni] = await Promise.all([fetchBerita({ includeDrafts: true }), fetchAlumni({ approvedOnly: false })]);
        setStats((s) => ({
          ...s,
          berita: berita.length,
          alumni: alumni.filter((a) => a.approved).length,
          pending: alumni.filter((a) => !a.approved).length,
        }));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
      <p className="text-sm text-gray-400 mb-6">Ringkasan konten website Asrama IPB Sukasari.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Newspaper} label="Total Berita" value={stats.berita} to="/admin/berita" />
        <StatCard icon={Users} label="Kata Alumni" value={stats.alumni} to="/admin/alumni" />
        <StatCard icon={Clock} label="Menunggu Moderasi" value={stats.pending} to="/admin/alumni" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/berita/baru" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:from-orange-600 hover:to-orange-700 transition-all">
          <Newspaper className="w-7 h-7 mb-3" />
          <h3 className="font-bold text-lg">Tulis Berita Baru</h3>
          <p className="text-sm text-white/90 mt-1">Buat berita dengan editor, tersimpan dalam format Markdown.</p>
        </Link>
        <Link to="/admin/alumni" className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white hover:bg-white/10 transition-all">
          <Users className="w-7 h-7 mb-3 text-orange-400" />
          <h3 className="font-bold text-lg">Kelola Kata Alumni</h3>
          <p className="text-sm text-gray-400 mt-1">Tanggal, setujui, atau hapus pesan dari alumni.</p>
        </Link>
      </div>
    </div>
  );
}
