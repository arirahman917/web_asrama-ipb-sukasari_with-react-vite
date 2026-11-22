import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SiteImage from '../core/SiteImage';

// Daftarkan plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
    "program/kolam-upgrading.webp", "program/nilai.webp", "program/renang.webp", "program/sc1.webp", "program/voli.webp", "program/visi.webp",
    "pengurus/bph/menteri.webp", "pengurus/kepenghunian/menteri.webp", "pengurus/lingpras/menteri.webp", "pengurus/jasroh/menteri.webp", "pengurus/mediadigi/menteri.webp", "pengurus/kabinet.webp", "pengurus/kabinet-bahagia.webp",
    "fasilitas/alat_masak.webp", "fasilitas/dapur.webp", "fasilitas/gedung.webp", "fasilitas/kompor.webp", "fasilitas/kulkas.webp", "fasilitas/ruang_tengah.webp", "fasilitas/meja_makan.webp", "fasilitas/parkiran.webp", "fasilitas/mushola.webp", "fasilitas/non-blok.webp", "fasilitas/pekarangan.webp", "bg-fasilitas.webp"
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
        const mm = gsap.matchMedia();

        // Efek kursor mouse halus hanya untuk desktop (dibatasi agar tidak tabrakan dengan scroll)
        mm.add("(min-width: 768px)", () => {
            let lastMove = 0;
            const handleMouseMove = (e) => {
                const now = performance.now();
                if (now - lastMove < 30) return; // Throttle 30ms
                lastMove = now;

                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 25;
                const yPos = (clientY / window.innerHeight - 0.5) * -25;

                if (containerRef.current) {
                    gsap.to(containerRef.current, {
                        rotationY: xPos,
                        rotationX: yPos,
                        ease: "power1.out",
                        duration: 1.2,
                        force3D: true,
                        overwrite: "auto"
                    });
                }

                if (titleRef.current) {
                    gsap.to(titleRef.current, {
                        rotationY: xPos * 0.5,
                        rotationX: yPos * 0.5,
                        ease: "power1.out",
                        duration: 1.2,
                        force3D: true,
                        overwrite: "auto"
                    });
                }
            };

            window.addEventListener('mousemove', handleMouseMove, { passive: true });
            return () => window.removeEventListener('mousemove', handleMouseMove);
        });

        // --- ANIMASI SCROLL OPTIMASI TINGGI ---
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => (window.innerWidth < 768 ? "+=1800" : "+=2600"),
                pin: true,
                anticipatePin: 1,
                scrub: 0.6,
                fastScrollEnd: true,
                preventOverlaps: true
            }
        });

        const batchSize = 5;

        imagesRef.current.forEach((el, index) => {
            if (!el) return;
            const batchIndex = Math.floor(index / batchSize);

            // Kondisi Awal: Terpusat di tengah dengan hardware acceleration
            gsap.set(el, {
                xPercent: -50,
                yPercent: -50,
                opacity: 0,
                scale: 0.35,
                x: 0,
                y: 0,
                rotationZ: 0,
                force3D: true
            });

            const angle = gsap.utils.random(0, Math.PI * 2);
            const radius = gsap.utils.random(450, window.innerWidth > 768 ? 1000 : 700);
            const flyOutX = Math.cos(angle) * radius;
            const flyOutY = Math.sin(angle) * radius;

            const startTime = batchIndex * 1.8;
            const delay = gsap.utils.random(0, 0.8);

            // Gerakan bergeser dan membesar
            tl.to(el, {
                x: flyOutX,
                y: flyOutY,
                scale: 1.35,
                duration: 5,
                ease: "none",
                force3D: true
            }, startTime + delay);

            // Muncul secara bertahap
            tl.to(el, {
                opacity: 1,
                duration: 0.8,
                ease: "power1.inOut"
            }, startTime + delay);

            // Menghilang perlahan sebelum keluar layar
            tl.to(el, {
                opacity: 0,
                duration: 1.2,
                ease: "power1.inOut"
            }, startTime + delay + 3.8);
        });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section
            id="galeri"
            ref={sectionRef}
            className="relative w-full h-screen bg-white text-gray-900 overflow-hidden flex items-center justify-center perspective-[1000px] transform-gpu"
        >
            {/* Judul Section dengan kontras memenuhi rasio WCAG 4.5:1+ */}
            <h2
                ref={titleRef}
                className="absolute z-10 text-5xl md:text-7xl lg:text-8xl font-black tracking-widest pointer-events-none text-gray-700 opacity-80 transform-style-3d will-change-transform"
            >
                GALERI
            </h2>

            {/* Container untuk efek Tilt Mouse */}
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center transform-style-3d pointer-events-none transform-gpu"
            >
                {galleryImages.map((src, index) => {
                    const shapeClass = getShapeClasses(index);
                    return (
                        <div
                            key={index}
                            ref={(el) => (imagesRef.current[index] = el)}
                            className={`absolute top-1/2 left-1/2 ${shapeClass} rounded-2xl md:rounded-3xl overflow-hidden shadow-md will-change-transform bg-gray-100 transform-gpu`}
                        >
                            <SiteImage
                                k={src}
                                alt={`Dokumentasi kegiatan galeri Asrama Sukasari ${index + 1}`}
                                width="384"
                                height="240"
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
