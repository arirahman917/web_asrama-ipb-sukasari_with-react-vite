import React, { useState } from 'react';

// Import photos program
import imgUpgrading2025 from '../../assets/img/program/kolam-upgrading.webp';
import imgUpgrading2024 from '../../assets/img/program/nilai.webp';
import imgRenang from '../../assets/img/program/renang.jpeg';
import imgSukasariCup from '../../assets/img/program/sc1.webp';
import imgOlahragaBulanan from '../../assets/img/program/voli.webp';
import imgBentukKabinet from '../../assets/img/program/visi.webp';

export default function ProgramAsrama() {
    // Data Dummy Program
    const programs = [
        {
            id: 1,
            title: "Olahraga Bulanan (Voli)",
            description: "Kegiatan rutin berolahraga voli setiap bulan untuk menjaga kebugaran tubuh serta mempererat tali persaudaraan antar penghuni.",
            image: imgOlahragaBulanan
        },
        {
            id: 2,
            title: "Renang Bersama",
            description: "Program rekreasi dan olahraga air yang diadakan secara berkala sebagai sarana refreshing dari kesibukan akademik.",
            image: imgRenang
        },
        {
            id: 3,
            title: "Sukasari Cup",
            description: "Kompetisi olahraga tahunan antar penghuni Asrama Sukasari untuk menumbuhkan jiwa kompetitif, sportivitas, dan kebersamaan.",
            image: imgSukasariCup,
            imgClass: "object-[center_76%]"
        },
        {
            id: 4,
            title: "Upgrading Pengurus 2024",
            description: "Kegiatan evaluasi dan peningkatan kapasitas diri para pengurus asrama tahun 2024 demi kinerja yang lebih optimal.",
            image: imgUpgrading2024
        },
        {
            id: 5,
            title: "Upgrading Pengurus 2025",
            description: "Pelatihan dan pembekalan pengurus asrama tahun 2025 untuk meningkatkan kemampuan kepemimpinan dan manajerial.",
            image: imgUpgrading2025
        },
        {
            id: 6,
            title: "Pembentukan Kabinet",
            description: "Musyawarah pembentukan kabinet dan penetapan visi misi kepengurusan baru untuk satu periode ke depan.",
            image: imgBentukKabinet
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Handler untuk tombol atas dan bawah
    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % programs.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + programs.length) % programs.length);
    };

    // Fungsi penentu gaya (animasi 3D stacking) berdasarkan posisi index
    const getCardStyle = (index) => {
        const total = programs.length;

        if (index === activeIndex) {
            // Gambar Utama (Tengah)
            return "opacity-100 scale-100 translate-y-0 z-30 blur-none shadow-xl";
        } else if (index === (activeIndex - 1 + total) % total) {
            // Gambar Sebelumnya (Atas)
            return "opacity-60 scale-[0.80] -translate-y-[60px] sm:-translate-y-[65px] md:-translate-y-[70px] z-20 blur-[2px] cursor-pointer";
        } else if (index === (activeIndex + 1) % total) {
            // Gambar Selanjutnya (Bawah)
            return "opacity-60 scale-[0.80] translate-y-[60px] sm:translate-y-[65px] md:translate-y-[70px] z-20 blur-[2px] cursor-pointer";
        } else {
            // Gambar lainnya (Disembunyikan di belakang)
            return "opacity-0 scale-70 translate-y-0 z-10 blur-md pointer-events-none";
        }
    };

    return (
        <section id="program" className="relative w-full bg-[#1e2a3b] py-16 md:py-20 lg:py-16 px-4 sm:px-6 md:px-12 lg:px-24 flex justify-center overflow-hidden">

            {/* Container Utama (Membagi 2 kolom di Desktop, 1 Kolom di Mobile) */}
            <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12 lg:gap-16">

                {/* WADAH KIRI: Carousel Gambar */}
                <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center h-[400px] lg:h-[450px]">

                    {/* Tombol Atas */}
                    <button
                        onClick={handlePrev}
                        className="absolute top-2 md:top-4 z-40 text-white hover:scale-110 transition-transform duration-300 p-2"
                        aria-label="Previous Program"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-10 h-10 md:w-12 md:h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>

                    {/* Area Tumpukan Gambar */}
                    <div className="relative w-[87vw] max-w-[380px] sm:max-w-none sm:w-[400px] lg:w-[400px] h-[52vw] max-h-[220px] sm:max-h-none sm:h-[225px] lg:h-[220px] flex items-center justify-center">
                        {programs.map((program, index) => (
                            <div
                                key={program.id}
                                onClick={() => setActiveIndex(index)} // Bisa diklik langsung fotonya untuk pindah
                                className={`absolute w-full h-full rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 ease-in-out ${getCardStyle(index)}`}
                            >
                                <img
                                    src={program.image}
                                    alt={program.title}
                                    className={`w-full h-full object-cover ${program.imgClass || 'object-center'}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Tombol Bawah */}
                    <button
                        onClick={handleNext}
                        className="absolute bottom-2 md:bottom-4 z-40 text-white hover:scale-110 transition-transform duration-300 p-2"
                        aria-label="Next Program"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-10 h-10 md:w-12 md:h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                </div>

                {/* WADAH KANAN: Teks Informasi */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    {/* Judul Section (Statis) */}
                    <h2 className="text-3xl md:text-4xl font-bold text-[#f2813f] tracking-wide mb-4 lg:mb-6">
                        Program Asrama
                    </h2>

                    {/* Wadah Detail Program (Dinamis dengan animasi fade) */}
                    {/* Menggunakan key={activeIndex} agar div ini me-render ulang animasinya tiap kali index berubah */}
                    <div
                        key={activeIndex}
                        className="flex flex-col items-center lg:items-start gap-3 lg:gap-4 animate-fade-in-up"
                    >
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">
                            {programs[activeIndex].title}
                        </h3>
                        <p className="text-sm md:text-[14px] text-gray-300 leading-relaxed max-w-lg">
                            {programs[activeIndex].description}
                        </p>
                    </div>
                </div>

            </div>

            {/* Tambahan CSS Internal untuk animasi teks memudar & naik sedikit */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
            `}} />

        </section>
    );
}