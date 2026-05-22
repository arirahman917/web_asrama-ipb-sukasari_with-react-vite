import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bgModel from '../assets/img/berita/model.png';
import { dummyBerita } from '../components/sections/berita';

// Komponen Dropdown Kustom beranimasi
const CustomDropdown = ({ options, value, onChange, placeholder, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Menutup dropdown jika klik di luar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-3.5 rounded-full text-gray-700 text-[13px] text-left focus:outline-none shadow-md bg-white cursor-pointer flex justify-between items-center border border-transparent transition-colors hover:bg-gray-50"
            >
                <span className="truncate">{value === 'Semua' ? placeholder : (selectedOption ? selectedOption.label : value)}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            <div 
                className={`absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-y-auto max-h-[260px] overscroll-contain transition-all duration-300 origin-top [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full ${isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}
            >
                {/* 
                    max-h-[240px] membatasi tinggi dropdown. 
                    overflow-y-auto membuat sisanya bisa discroll.
                */}
                <ul className="py-2">
                    {options.map((opt, idx) => (
                        <li 
                            key={idx}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`px-5 py-2.5 text-[13px] cursor-pointer transition-colors ${value === opt.value ? 'text-[#ea580c] bg-orange-50/50 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function BeritaDetail() {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState(location.state?.kategori || 'Semua');
    const [filterYear, setFilterYear] = useState('Semua');
    const [filterMonth, setFilterMonth] = useState('Semua');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 3x3 grid

    // Handle filter & search logic
    const filteredBerita = dummyBerita.filter((item) => {
        // 1. Kategori Filter
        if (filterCategory !== 'Semua' && item.kategori !== filterCategory) return false;

        // 2. Tahun Filter (Tahun didapat dari item.date: "4 Oktober 2026")
        if (filterYear !== 'Semua') {
            const yearStr = item.date.split(' ').pop(); // "2026"
            if (yearStr !== filterYear) return false;
        }

        // 3. Bulan Filter (Bulan didapat dari item.date)
        if (filterMonth !== 'Semua') {
            const monthStr = item.date.split(' ')[1]; // "Oktober"
            if (monthStr.toLowerCase() !== filterMonth.toLowerCase()) return false;
        }

        // 4. Search Filter (dari Judul dan Deskripsi)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const titleMatch = item.title.toLowerCase().includes(query);
            const descMatch = item.desc.toLowerCase().includes(query);
            if (!titleMatch && !descMatch) return false;
        }

        return true;
    });

    // Handle Pagination
    const totalPages = Math.ceil(filteredBerita.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredBerita.slice(startIndex, startIndex + itemsPerPage);

    // Reset page ke 1 kalau filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterCategory, filterYear, filterMonth]);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
        window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll up sedikit setelah ganti halaman
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    // Daftar Tahun & Bulan unik untuk dropdown
    const availableYears = ['Semua', '2026', '2027'];
    const availableMonths = ['Semua', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    // Opsi untuk Custom Dropdown
    const kategoriOptions = [
        { label: 'Kategori Berita', value: 'Semua' },
        { label: 'Prestasi', value: 'prestasi' },
        { label: 'Event', value: 'event' }
    ];

    const yearOptions = [
        { label: 'Tahun', value: 'Semua' },
        ...availableYears.filter(y => y !== 'Semua').map(y => ({ label: y, value: y }))
    ];

    const monthOptions = [
        { label: 'Bulan', value: 'Semua' },
        ...availableMonths.filter(m => m !== 'Semua').map(m => ({ label: m, value: m }))
    ];

    return (
        <main className="w-full min-h-screen bg-[#fafafa] pt-[92px] pb-20 font-sans">
            
            {/* 1. HERO BANNER */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-8">
                <div className="relative w-full bg-[#f97316] rounded-[32px] md:rounded-[40px] flex flex-col md:flex-row items-center pt-8 md:pt-10 pb-[400px] md:pb-24 px-6 md:px-12 lg:px-16 shadow-lg">
                    
                    {/* Teks Kiri */}
                    <div className="flex-1 text-white z-10 w-full mb-6 md:mb-0">
                        <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-2 md:mb-2">
                            Berita Asrama
                        </h1>
                        <p className="text-12 md:text-[14px] lg:text-[14px] text-white/90 max-w-lg md:max-w-md lg:max-w-lg leading-relaxed mb-6 md:mb-24">
                            Jelajahi event dan prestasi mahasiswa Asrama IPB Sukasari, dari rangkaian kegiatan hingga pencapaian yang menginspirasi.
                        </p>
                    </div>

                    {/* Gambar Model Kanan - Khusus Mobile diposisikan di tengah bawah, Desktop di kanan bawah, tidak melewati banner */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:right-6 lg:right-10 md:translate-x-0 w-[320px] md:w-[220px] lg:w-[220px] max-h-[90%] md:max-h-[95%] opacity-90 md:opacity-100 pointer-events-none z-10 flex items-end">
                        <img 
                            src={bgModel} 
                            alt="Model Berita" 
                            className="w-full h-full object-contain object-bottom"
                            // Fallback in case bgModel not loaded
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Filter & Search Bar - Positioning overlap at bottom */}
                    <div className="absolute bottom-6 left-0 w-full px-6 md:px-12 lg:px-16 z-20">
                        {/* Wrapper Grid Khusus Mobile (2 kolom), Flex Row di Desktop */}
                        <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 w-full">
                            
                            {/* Kategori Dropdown (Penuh di Mobile, Lebar 170px di Desktop) */}
                            <CustomDropdown 
                                options={kategoriOptions}
                                value={filterCategory}
                                onChange={setFilterCategory}
                                placeholder="Kategori Berita"
                                className="col-span-2 md:col-auto md:w-[170px] shrink-0"
                            />

                            {/* Tahun Dropdown (Setengah di Mobile, Lebar 110px di Desktop) */}
                            <CustomDropdown 
                                options={yearOptions}
                                value={filterYear}
                                onChange={setFilterYear}
                                placeholder="Tahun"
                                className="col-span-1 md:col-auto md:w-[110px] shrink-0"
                            />

                            {/* Bulan Dropdown (Setengah di Mobile, Lebar 120px di Desktop) */}
                            <CustomDropdown 
                                options={monthOptions}
                                value={filterMonth}
                                onChange={setFilterMonth}
                                placeholder="Bulan"
                                className="col-span-1 md:col-auto md:w-[120px] shrink-0"
                            />

                            {/* Search Input (Penuh di Mobile, Flex-1 merentang bebas di Desktop) */}
                            <div className="relative col-span-2 md:col-auto md:flex-1">
                                <input 
                                    type="text" 
                                    placeholder="Cari berita" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-5 pr-12 py-3.5 rounded-full text-gray-700 text-[13px] focus:outline-none shadow-md bg-white border-none"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. GRID LIST BERITA 3x3 */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 min-h-[500px]">
                {currentItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                        {currentItems.map((item) => (
                            <Link to={`/berita/${item.id}`} key={item.id} className="flex flex-col gap-4 cursor-pointer group transition-transform duration-300">
                                {/* Image Container with Inverted Radius */}
                                <div className="relative w-full aspect-[4/3] rounded-[24px] md:rounded-[28px] overflow-hidden bg-gray-100 transition-shadow duration-300 [transform:translateZ(0)]">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Potongan Tanggal Kiri Bawah */}
                                    <div className="absolute bottom-0 left-0 bg-[#fafafa] px-5 pt-2 pb-2 rounded-tr-[24px]">
                                        {/* Kurva pelicin atas dengan radial-gradient */}
                                        <div className="absolute left-0 -top-[19.5px] w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top right, transparent 20px, #fafafa 20.5px)' }}></div>
                                        {/* Kurva pelicin kanan dengan radial-gradient */}
                                        <div className="absolute -right-[19.5px] bottom-0 w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top right, transparent 20px, #fafafa 20.5px)' }}></div>
                                        <span className="relative z-10 text-[13px] font-bold text-gray-800 whitespace-nowrap">
                                            {item.date}
                                        </span>
                                    </div>
                                    {/* Kategori Badge di Kanan Bawah */}
                                    <div className="absolute bottom-3 right-5 z-10 bg-black/60 backdrop-blur-sm text-white text-[10px] md:text-[9px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                        {item.kategori}
                                    </div>
                                </div>

                                {/* Teks Konten */}
                                <div className="px-2">
                                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2.5 leading-snug group-hover:text-orange-500 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    {/* line-clamp-4 karena grid 3x3 ada cukup space untuk deskripsi */}
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 whitespace-pre-line">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Berita tidak ditemukan</h3>
                        <p className="text-gray-500">Coba sesuaikan kata kunci pencarian atau filter yang digunakan.</p>
                    </div>
                )}
            </div>

            {/* 3. PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-16 mb-8">
                    <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button 
                                key={pageNum}
                                onClick={() => handlePageClick(pageNum)}
                                className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${currentPage === pageNum ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </main>
    );
}
