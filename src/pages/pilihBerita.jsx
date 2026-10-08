import React, { useEffect, useState } from 'react';
import { Home, ChevronRight, Share2, ArrowLeft } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBerita, fetchBeritaById } from '../utils/berita';
import MarkdownView from '../components/admin/MarkdownView';

const PilihBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [berita, setBerita] = useState(null);
  const [terkini, setTerkini] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const [detail, all] = await Promise.all([
          fetchBeritaById(id),
          fetchBerita(),
        ]);
        if (!active) return;
        setBerita(detail);
        setTerkini(all.filter((b) => b.id !== id).slice(0, 3));
      } catch (err) {
        console.error('Gagal memuat berita:', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#fafafa] pt-[120px] pb-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-[320px] w-full bg-gray-200 rounded-[24px] animate-pulse mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Berita tidak ditemukan</h2>
        <p className="text-gray-500 mb-8">Maaf, berita yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <button
          onClick={() => navigate('/berita')}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Daftar Berita
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: berita.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Tautan berita disalin ke clipboard!');
      }
    } catch {
      /* dibatalkan pengguna */
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] pt-[120px] pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 space-x-2">
          <Link to="/" className="cursor-pointer hover:text-gray-900 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/berita" className="cursor-pointer hover:text-gray-900 transition-colors">
            Berita
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-orange-500 font-medium bg-orange-50 px-3 py-1 rounded-md max-w-[200px] md:max-w-md truncate">
            {berita.title}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          {/* Kolom Kiri: Konten Utama Berita */}
          <article className="w-full md:w-2/3 lg:w-[70%]">
            <span className="inline-block text-[11px] uppercase tracking-wider font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-4">
              {berita.kategori}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-snug">
              {berita.title}
            </h1>

            <div className="flex justify-between items-center text-gray-500 text-sm mb-6 pb-4 border-b border-gray-200">
              <span>Diposting pada: {berita.dateLabel}{berita.author ? ` · ${berita.author}` : ''}</span>
              <button className="hover:text-gray-900 transition-colors" aria-label="Share" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {berita.imageUrl && (
              <div className="relative mb-8 overflow-hidden rounded-[24px] shadow-sm bg-gray-100">
                <img src={berita.imageUrl} alt={berita.title} className="w-full h-auto object-cover" />
              </div>
            )}

            <MarkdownView className="text-base md:text-lg">{berita.content}</MarkdownView>
          </article>

          {/* Kolom Kanan: Sidebar */}
          <aside className="w-full md:w-1/3 lg:w-[30%] space-y-10">
            <div className="bg-transparent">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Lainnya</h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/berita" state={{ kategori: 'prestasi' }} className="px-5 py-2 bg-[#FAF5F0] text-gray-700 text-sm font-medium rounded-md hover:bg-orange-100 hover:text-orange-600 transition-all">
                  Prestasi
                </Link>
                <Link to="/berita" state={{ kategori: 'event' }} className="px-5 py-2 bg-[#FAF5F0] text-gray-700 text-sm font-medium rounded-md hover:bg-orange-100 hover:text-orange-600 transition-all">
                  Event
                </Link>
                <Link to="/berita" state={{ kategori: 'umum' }} className="px-5 py-2 bg-[#FAF5F0] text-gray-700 text-sm font-medium rounded-md hover:bg-orange-100 hover:text-orange-600 transition-all">
                  Umum
                </Link>
              </div>
            </div>

            {terkini.length > 0 && (
              <div className="bg-transparent">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Berita Terkini</h3>
                <div className="flex flex-col">
                  {terkini.map((item) => (
                    <Link
                      key={item.id}
                      to={`/berita/${item.id}`}
                      className="py-4 border-b border-gray-200 text-sm md:text-base text-gray-700 hover:text-orange-500 transition-colors font-medium leading-snug"
                    >
                      <span className="line-clamp-2">{item.title}</span>
                      <span className="block mt-2 text-xs text-gray-400">{item.dateLabel}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PilihBerita;
