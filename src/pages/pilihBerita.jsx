import React, { useEffect } from 'react';
import { Home, ChevronRight, Share2, ArrowLeft } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dummyBerita } from '../components/sections/berita';

const PilihBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Cari berita berdasarkan ID dari URL
  const berita = dummyBerita.find((b) => b.id === parseInt(id));

  // Ambil berita terbaru untuk sidebar (kecuali yang sedang dibaca)
  const beritaTerkini = dummyBerita
    .filter((b) => b.id !== parseInt(id))
    .slice(0, 3);

  // Scroll ke atas saat ID berubah (halaman baru dimuat)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* Kolom Kiri: Konten Utama Berita */}
          <article className="w-full md:w-2/3 lg:w-[70%]">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-snug">
              {berita.title}
            </h1>

            <div className="flex justify-between items-center text-gray-500 text-sm mb-6 pb-4 border-b border-gray-200">
              <span>Diposting pada: {berita.date}</span>
              <button 
                className="hover:text-gray-900 transition-colors" 
                aria-label="Share"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Tautan berita disalin ke clipboard!");
                }}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-8 overflow-hidden rounded-[24px] shadow-sm bg-gray-100">
              <img
                src={berita.img} 
                alt={berita.title}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-5 text-gray-700 leading-relaxed text-justify text-base md:text-lg">
              {/* Jika desc berupa text biasa dengan baris baru \n, kita pisahkan jadi <p> terpisah */}
              {berita.desc.split('\n').map((paragraph, idx) => (
                paragraph.trim() !== '' && (
                  <p key={idx}>
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </article>

          {/* Kolom Kanan: Sidebar Kategori & Berita Terkini */}
          <aside className="w-full md:w-1/3 lg:w-[30%] space-y-10">
            
            {/* Section Kategori Lainnya */}
            <div className="bg-transparent">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Lainnya</h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/berita" state={{ kategori: 'prestasi' }} className="px-5 py-2 bg-[#FAF5F0] text-gray-700 text-sm font-medium rounded-md cursor-pointer hover:bg-orange-100 hover:text-orange-600 transition-all">
                  Prestasi
                </Link>
                <Link to="/berita" state={{ kategori: 'event' }} className="px-5 py-2 bg-[#FAF5F0] text-gray-700 text-sm font-medium rounded-md cursor-pointer hover:bg-orange-100 hover:text-orange-600 transition-all">
                  Event
                </Link>
              </div>
            </div>

            {/* Section Berita Terkini */}
            <div className="bg-transparent">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Berita Terkini</h3>
              <div className="flex flex-col">
                {beritaTerkini.map((item) => (
                  <Link 
                    key={item.id}
                    to={`/berita/${item.id}`} 
                    className="py-4 border-b border-gray-200 text-sm md:text-base text-gray-700 hover:text-orange-500 transition-colors font-medium leading-snug group"
                  >
                    <span className="line-clamp-2">{item.title}</span>
                    <span className="block mt-2 text-xs text-gray-400 group-hover:text-orange-400">{item.date}</span>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default PilihBerita;