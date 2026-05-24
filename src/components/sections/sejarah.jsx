import React, { useState } from 'react';

// Import Assets
import imgGedung from '../../assets/img/fasilitas/gedung.webp';
import imgKabinet from '../../assets/img/pengurus/kabinet.webp';
import imgUpgrading from '../../assets/img/program/upgrading.webp';

const historyData = [
    { 
        year: "1951", 
        title: "Tahun 1951", 
        text: "Pada tahun 1951, Asrama IPB Sukasari resmi didirikan. Kehadirannya menjadi bagian penting dalam mendukung kehidupan mahasiswa di lingkungan kampus. Sejak awal, asrama ini dirancang sebagai tempat tinggal sekaligus ruang pembinaan karakter.", 
        images: [imgGedung, imgKabinet, imgUpgrading] 
    },
    { 
        year: "1970", 
        title: "Renovasi (1970)", 
        text: "Seiring bertambahnya jumlah mahasiswa, dilakukan berbagai renovasi untuk meningkatkan kapasitas dan kenyamanan hunian. Perubahan ini juga menyesuaikan kebutuhan fasilitas yang semakin berkembang.", 
        images: [imgUpgrading, imgGedung] 
    },
    { 
        year: "1998", 
        title: "Era Reformasi", 
        text: "Asrama ini menjadi saksi bisu pergerakan mahasiswa. Banyak diskusi dan dinamika intelektual terjadi di dalamnya pada masa tersebut. Nilai-nilai kritis dan semangat perubahan tumbuh kuat di lingkungan asrama.", 
        images: [imgKabinet, imgUpgrading, imgGedung] 
    },
    { 
        year: "Sekarang", 
        title: "Sukasari Kini", 
        text: "Hingga hari ini, Asrama IPB Sukasari tetap berdiri kokoh. Asrama ini terus beradaptasi dengan perkembangan zaman dan kebutuhan mahasiswa modern. Lingkungannya tetap menjadi tempat tumbuhnya kebersamaan dan pengembangan diri.", 
        images: [imgUpgrading, imgGedung, imgKabinet] 
    }
];

export default function Sejarah() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    // Dua state transitioning terpisah: satu untuk konten kiri+gambar, satu untuk gambar saja
    const [isContentTransitioning, setIsContentTransitioning] = useState(false);
    const [isImageTransitioning, setIsImageTransitioning] = useState(false);

    const activeData = historyData[activeIndex];

    // Handler pindah tahun (timeline) — transisi teks kiri + gambar
    const handleYearChange = (index) => {
        if (index === activeIndex) return;
        setIsContentTransitioning(true);
        setIsImageTransitioning(true);
        setTimeout(() => {
            setActiveIndex(index);
            setActivePhotoIndex(0);
            setIsContentTransitioning(false);
            setIsImageTransitioning(false);
        }, 280);
    };

    // Handler ganti foto (thumbnail) — hanya gambar yang transisi
    const handlePhotoChange = (idx) => {
        if (idx === activePhotoIndex) return;
        setIsImageTransitioning(true);
        setTimeout(() => {
            setActivePhotoIndex(idx);
            setIsImageTransitioning(false);
        }, 200);
    };

    return (
        <section
            id="sejarah-section sejarah"
            className="w-full h-auto py-6 lg:min-h-screen lg:py-10 flex flex-col justify-center px-5 md:px-12 lg:px-20 bg-white text-gray-900 font-sans overflow-x-hidden"
        >
            {/* Konten Utama: Teks Kiri + Gambar Kanan */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center max-w-[1300px] mx-auto w-full">

                {/* Teks Kiri */}
                <div className="w-full lg:w-2/5 flex flex-col justify-center shrink-0 text-center lg:text-left">
                    <h2 className="text-4xl md:text-4xl lg:text-4xl font-extrabold text-[#f97316] mb-5 md:mb-5 leading-tight">
                        Sejarah Asrama<br className="hidden md:block" /> IPB Sukasari
                    </h2>
                    <p className="text-gray-500 mb-8 md:mb-6 text-[16px] lg:text-[14px] leading-relaxed max-w-[360px] md:max-w-2xl mx-auto lg:mx-0">
                        Sejak berdiri, Asrama IPB Sukasari berkomitmen menyediakan hunian yang mendukung pembelajaran dan pengembangan karakter mahasiswa.
                    </p>

                    {/* Card Deskripsi — hanya berubah saat klik timeline */}
                    <div className="bg-gradient-to-r from-gray-100 to-transparent rounded-2xl p-4 md:p-5 lg:p-6 text-left mb-1 md:mb-0">
                        <h3
                            className="text-xl md:text-lg font-bold text-[#f97316] mb-2 md:mb-1.5 transition-opacity duration-280"
                            style={{ opacity: isContentTransitioning ? 0 : 1 }}
                        >
                            {activeData.title}
                        </h3>
                        <p
                            className="text-gray-600 text-sm md:text-[12px] leading-relaxed text-justify transition-opacity duration-280"
                            style={{ opacity: isContentTransitioning ? 0 : 1 }}
                        >
                            {activeData.text}
                        </p>
                    </div>
                </div>

                {/* Gambar Kanan */}
                <div className="w-full lg:w-3/5 relative">
                    <div className="relative w-full h-80 md:h-[42vh] lg:h-[70vh] rounded-2xl lg:rounded-[1.5rem] overflow-hidden bg-gray-200 shadow-lg mb-10 md:mb-0">
                        <img
                            src={activeData.images[activePhotoIndex]}
                            alt="Sejarah Asrama"
                            className="w-full h-full object-cover transition-opacity duration-200"
                            style={{ opacity: isImageTransitioning ? 0 : 1 }}
                        />

                        {/* Thumbnail Overlay — klik hanya ganti gambar */}
                        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex -space-x-2 z-30">
                            {activeData.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handlePhotoChange(idx)}
                                    className="relative shrink-0 cursor-pointer transition-all duration-200"
                                    style={{
                                        zIndex: activeData.images.length - idx,
                                        transform: idx === activePhotoIndex ? 'scale(1.12) translateY(-3px)' : 'scale(1)',
                                        opacity: idx === activePhotoIndex ? 1 : 0.75,
                                    }}
                                >
                                    <img
                                        src={img}
                                        className="w-9 h-9 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover aspect-square shadow-md"
                                        alt="thumbnail"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline (Bawah) — tidak bisa scroll, fixed width */}
            <div className="mt-6 md:mt-10 relative w-full max-w-2xl mx-auto px-4">
                <div className="relative flex w-full items-start justify-between">
                    {historyData.map((item, index) => {
                        const isLast = index === historyData.length - 1;
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={index}
                                className="flex-1 relative flex flex-col items-center group"
                            >
                                {/* Garis Penghubung */}
                                {!isLast && (
                                    <div className="absolute top-[10px] md:top-[12px] left-1/2 w-full h-[2px] bg-gray-300 z-0" />
                                )}
                                {isLast && (
                                    <div className="absolute top-[10px] md:top-[12px] left-0 flex items-center z-0" style={{ width: '50%' }}>
                                        <div className="flex-1 h-[2px] bg-gray-300" />
                                    </div>
                                )}

                                {/* Panah di ujung kanan terakhir */}
                                {isLast && (
                                    <div className="absolute top-[4px] md:top-[6px] right-0 z-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </div>
                                )}

                                {/* Titik & Tahun */}
                                <div
                                    className="relative z-10 flex flex-col items-center cursor-pointer"
                                    onClick={() => handleYearChange(index)}
                                >
                                    <div
                                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm transition-all duration-300 mb-1.5 shrink-0 aspect-square ${
                                            isActive
                                                ? 'bg-[#f97316] scale-110'
                                                : 'bg-gray-300 group-hover:bg-orange-300'
                                        }`}
                                    />
                                    <span
                                        className={`text-[10px] md:text-xs font-semibold transition-colors duration-300 text-center whitespace-nowrap ${
                                            isActive ? 'text-[#f97316]' : 'text-gray-400 group-hover:text-orange-400'
                                        }`}
                                    >
                                        {item.year}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}