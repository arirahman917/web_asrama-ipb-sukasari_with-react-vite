import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// photo program
import imgUpgrading2025 from '../../assets/img/program/kolam-upgrading.jpg';
import imgUpgrading2024 from '../../assets/img/program/nilai.jpg';
import imgRenang from '../../assets/img/program/renang.jpeg';
import imgSukasariCup from '../../assets/img/program/sc1.jpg';
import imgOlahragaBulanan from '../../assets/img/program/voli.jpg';
import imgBentukKabinet from '../../assets/img/program/visi.jpg';

// photo pengurus
import imgBph from '../../assets/img/pengurus/bph/menteri.jpg';
import imgKepenghunian from '../../assets/img/pengurus/kepenghunian/menteri.jpg';
import imgLingpras from '../../assets/img/pengurus/lingpras/menteri.jpg';
import imgJasroh from '../../assets/img/pengurus/jasroh/menteri.jpg';
import imgMediadigi from '../../assets/img/pengurus/mediadigi/menteri.jpg';
import imgKabinet from '../../assets/img/pengurus/kabinet.jpg';
import imgKabinetBahagia from '../../assets/img/pengurus/kabinet-bahagia.jpg';

// photo fasilitas
import alatMasak from '../../assets/img/fasilitas/alat_masak.jpg';
import dapur from '../../assets/img/fasilitas/dapur.jpg';
import gedung from '../../assets/img/fasilitas/gedung.jpg';
import kompor from '../../assets/img/fasilitas/kompor.jpg';
import kulkas from '../../assets/img/fasilitas/kulkas.jpg';
import ruangTengah from '../../assets/img/fasilitas/ruang_tengah.jpg';
import mejaMakan from '../../assets/img/fasilitas/meja_makan.jpg';
import parkiran from '../../assets/img/fasilitas/parkiran.jpg';
import mushola from '../../assets/img/fasilitas/mushola.jpg';
import perpustakaan from '../../assets/img/fasilitas/non-blok.jpg';
import pekarangan from '../../assets/img/fasilitas/pekarangan.jpg';
import bgFasilitas from '../../assets/img/bg-fasilitas.jpg';

// Daftarkan plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
    imgUpgrading2025, imgUpgrading2024, imgRenang, imgSukasariCup, imgOlahragaBulanan, imgBentukKabinet,
    imgBph, imgKepenghunian, imgLingpras, imgJasroh, imgMediadigi, imgKabinet, imgKabinetBahagia,
    alatMasak, dapur, gedung, kompor, kulkas, ruangTengah, mejaMakan, parkiran, mushola, perpustakaan, pekarangan, bgFasilitas
];

// Helper untuk variasi bentuk gambar
const getShapeClasses = (index) => {
    const shapes = [
        "w-48 h-32 md:w-72 md:h-48", // Landscape
        "w-36 h-48 md:w-56 md:h-72", // Portrait
        "w-64 h-40 md:w-96 md:h-60", // Large Landscape
        "w-40 h-40 md:w-60 md:h-60", // Square
        "w-48 h-64 md:w-64 md:h-80", // Large Portrait
    ];
    return shapes[index % shapes.length];
};

export default function Galeri() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const imagesRef = useRef([]);

    useGSAP(() => {
        // Efek kursor mouse: Frame nengok yang diperbesar
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 60; // Max rotasi 60 derajat
            const yPos = (clientY / window.innerHeight - 0.5) * -60;

            if (containerRef.current) {
                gsap.to(containerRef.current, {
                    rotationY: xPos,
                    rotationX: yPos,
                    ease: "power3.out",
                    duration: 1.5
                });
            }

            if (titleRef.current) {
                // Judul ikut nengok
                gsap.to(titleRef.current, {
                    rotationY: xPos * 0.8,
                    rotationX: yPos * 0.8,
                    ease: "power3.out",
                    duration: 1.5
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // --- ANIMASI SCROLL (Estafet Konstan) ---
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=800%", // Panjang scroll sangat lama agar lambat
                pin: true,
                scrub: 1.5,
            }
        });

        const batchSize = 5; // Jumlah gambar per gelombang (estafet)

        imagesRef.current.forEach((el, index) => {
            if (!el) return;
            const batchIndex = Math.floor(index / batchSize);

            // 1. Kondisi Awal: Transparan, ukuran proporsional (tidak terlalu kecil), dari tengah layar
            gsap.set(el, {
                xPercent: -50, // GSAP centering yang tidak ditimpa oleh transform biasa
                yPercent: -50,
                opacity: 0,
                scale: 0.3, // Tidak mulai dari terlalu kecil
                x: 0,
                y: 0,
                rotationZ: 0 // Tidak ada yang miring
            });

            // Hitung posisi acak estetik di sekitar layar untuk titik akhir (terlempar keluar layar)
            const angle = gsap.utils.random(0, Math.PI * 2);
            const radius = gsap.utils.random(500, window.innerWidth > 768 ? 1200 : 800);
            const flyOutX = Math.cos(angle) * radius;
            const flyOutY = Math.sin(angle) * radius;

            const startTime = batchIndex * 2.5; // Kapan batch ini mulai muncul di timeline
            const delay = gsap.utils.random(0, 1.5); // Stagger acak yang natural

            // Gerakan bergeser dan membesar secara konstan dan terus menerus (tanpa henti)
            tl.to(el, {
                x: flyOutX,
                y: flyOutY,
                scale: 1.5, // Membesarnya tidak terlalu ekstrem
                duration: 7, // Durasi panjang agar lambat dan halus
                ease: "none" // Konstan (linear)
            }, startTime + delay);

            // Muncul secara bertahap di awal
            tl.to(el, {
                opacity: 1,
                duration: 1,
                ease: "power1.inOut"
            }, startTime + delay);

            // Menghilang perlahan sebelum mencapai ujung
            tl.to(el, {
                opacity: 0,
                duration: 1.5,
                ease: "power1.inOut"
            }, startTime + delay + 5.5);
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, { scope: sectionRef });

    return (
        <section
            id="galeri"
            ref={sectionRef}
            className="relative w-full h-screen bg-white text-gray-900 overflow-hidden flex items-center justify-center perspective-[1200px]"
        >
            {/* Judul Section */}
            <h2
                ref={titleRef}
                className="absolute z-10 text-5xl md:text-7xl lg:text-8xl font-black tracking-widest pointer-events-none opacity-5 transform-style-3d will-change-transform"
            >
                GALERI
            </h2>

            {/* Tombol Selengkapnya */}
            <div className="absolute z-[100] mt-[600px] md:mt-80">
                <a 
                    href="#" 
                    className="flex items-center gap-2 px-6 py-3 bg-white/40 backdrop-blur-md border border-white/60 text-gray-800 font-semibold rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:bg-white/70 hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:scale-105 transition-all duration-300"
                >
                    <span className="text-[12px]">Selengkapnya</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                </a>
            </div>

            {/* Container untuk efek Tilt Mouse */}
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center transform-style-3d pointer-events-none"
            >
                {/* Gambar-gambar (awalnya ngumpul di tengah) */}
                {galleryImages.map((src, index) => {
                    const shapeClass = getShapeClasses(index);
                    return (
                        <div
                            key={index}
                            ref={(el) => (imagesRef.current[index] = el)}
                            // top-1/2 left-1/2 dipadukan dengan xPercent -50 dan yPercent -50 dari GSAP
                            className={`absolute top-1/2 left-1/2 ${shapeClass} rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.15)] will-change-transform bg-gray-100`}
                        >
                            <img
                                src={src}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}