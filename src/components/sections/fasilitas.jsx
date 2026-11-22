import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SiteImage from '../core/SiteImage';
import { useSiteImages } from '../../utils/images';

gsap.registerPlugin(ScrollTrigger);

// Data Koordinat Gambar - Formasi 2 1 2 konstan untuk semua frame
// Mobile (757px ke bawah): Menggunakan formasi sama persis (2-1-2) dengan ukuran & jarak proporsional
// Desktop: Formasi 2-1-2 dengan gap vertikal lebih lebar ke bawah
const fasilitasData = [
    { id: 1, title: "Gedung Asrama", img: "fasilitas/gedung.webp", deskX: "-32vw", deskY: "-20vh", mobX: "-26vw", mobY: "-15vh" },
    { id: 2, title: "Kamar", img: "fasilitas/kamar.webp", deskX: "32vw", deskY: "-20vh", mobX: "26vw", mobY: "-15vh" },
    { id: 3, title: "Ruang Tengah", img: "fasilitas/ruang_tengah.webp", deskX: "0vw", deskY: "20vh", mobX: "0vw", mobY: "4vh" },
    { id: 4, title: "Kamar Mandi", img: "fasilitas/kamar_mandi.webp", deskX: "-32vw", deskY: "60vh", mobX: "-26vw", mobY: "24vh" },
    { id: 5, title: "Dapur", img: "fasilitas/dapur.webp", deskX: "32vw", deskY: "60vh", mobX: "26vw", mobY: "24vh" },
    { id: 6, title: "Mushola", img: "fasilitas/mushola.webp", deskX: "0vw", deskY: "100vh", mobX: "0vw", mobY: "44vh" },
    { id: 7, title: "Lapang Voli", img: "fasilitas/lapang_voli.webp", deskX: "-32vw", deskY: "140vh", mobX: "-26vw", mobY: "65vh" },
    { id: 8, title: "Parkiran", img: "fasilitas/parkiran.webp", deskX: "32vw", deskY: "140vh", mobX: "26vw", mobY: "65vh" },
    { id: 9, title: "Ruang Non-Blok", img: "fasilitas/non-blok.webp", deskX: "0vw", deskY: "180vh", mobX: "0vw", mobY: "84vh" },
    { id: 10, title: "Pekarangan", img: "fasilitas/pekarangan.webp", deskX: "-32vw", deskY: "220vh", mobX: "-26vw", mobY: "105vh" },
    { id: 11, title: "Meja Makan", img: "fasilitas/meja_makan.webp", deskX: "32vw", deskY: "220vh", mobX: "26vw", mobY: "105vh" },
    { id: 12, title: "Kulkas", img: "fasilitas/kulkas.webp", deskX: "0vw", deskY: "260vh", mobX: "0vw", mobY: "125vh" },
    { id: 13, title: "Mesin Cuci", img: "fasilitas/mesin_cuci.webp", deskX: "-32vw", deskY: "300vh", mobX: "-26vw", mobY: "145vh" },
    { id: 14, title: "Kompor", img: "fasilitas/kompor.webp", deskX: "32vw", deskY: "300vh", mobX: "26vw", mobY: "145vh" },
    { id: 15, title: "Alat Masak", img: "fasilitas/alat_masak.webp", deskX: "0vw", deskY: "340vh", mobX: "0vw", mobY: "165vh" },
    { id: 16, title: "Kipas Angin", img: "fasilitas/kipas_angin.webp", deskX: "-32vw", deskY: "380vh", mobX: "-26vw", mobY: "185vh" },
    { id: 17, title: "Alat Kebersihan", img: "fasilitas/alat_kebersihan.webp", deskX: "32vw", deskY: "380vh", mobX: "26vw", mobY: "185vh" },
    { id: 18, title: "Alat P3K", img: "fasilitas/alat_p3k.webp", deskX: "0vw", deskY: "420vh", mobX: "0vw", mobY: "205vh" },
    { id: 19, title: "CCTV", img: "fasilitas/cctv.webp", deskX: "-32vw", deskY: "460vh", mobX: "-26vw", mobY: "225vh" },
    { id: 20, title: "Permainan", img: "fasilitas/permainan.webp", deskX: "32vw", deskY: "460vh", mobX: "26vw", mobY: "225vh" },
    { id: 21, title: "Mading", img: "fasilitas/mading.webp", deskX: "0vw", deskY: "500vh", mobX: "0vw", mobY: "245vh" },
];

export default function Fasilitas() {
    const sectionRef = useRef(null);
    const wrapperRef = useRef(null);
    const { get } = useSiteImages();
    const [showBg, setShowBg] = useState(false);

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowBg(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "400px" }
        );
        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 758px)", // 757px ke bawah adalah mobile
            isMobile: "(max-width: 757px)"
        }, (context) => {
            const { isDesktop } = context.conditions;
            const items = gsap.utils.toArray('.fasilitas-item');

            // Posisi awal disembunyikan di tengah dengan hardware acceleration
            gsap.set(items, {
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
                rotation: () => gsap.utils.random(-15, 15),
                force3D: true
            });

            // Optimasi performa scroll:
            // 1. Scrub halus dengan damping yang optimal
            // 2. Panjang scroll proporsional agar scroll terasa enteng dan tidak ngelag
            // 3. fastScrollEnd & preventOverlaps untuk mencegah penumpukan frame saat scroll cepat
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: isDesktop ? "+=2600" : "+=1700",
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    fastScrollEnd: true,
                    preventOverlaps: true
                }
            });

            // 1. Munculkan Judul
            tl.fromTo('.fasilitas-title',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", force3D: true }
            );

            // 2. Animasi Menyebar (Smooth & Serentak)
            tl.addLabel("scatter");
            items.forEach((item, i) => {
                tl.to(item, {
                    x: isDesktop ? fasilitasData[i].deskX : fasilitasData[i].mobX,
                    y: isDesktop ? fasilitasData[i].deskY : fasilitasData[i].mobY,
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    ease: "power2.out",
                    duration: 1,
                    force3D: true
                }, "scatter+=" + (i * 0.04));
            });

            // 3. Wrapper Naik Ke Atas (Memunculkan fasilitas bawah)
            tl.addLabel("scrollUp", "scatter+=1.2");
            tl.to(wrapperRef.current, {
                y: isDesktop ? "-485vh" : "-225vh",
                ease: "none",
                duration: 5,
                force3D: true
            }, "scrollUp");

        });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section
            id="fasilitas"
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden bg-[#0d1520] flex items-center justify-center transform-gpu"
        >
            {/* Background tanpa CSS Blur yang berat - dimuat hanya saat mendekati viewport */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none transition-opacity duration-700"
                style={showBg ? { backgroundImage: `url(${get('bg-fasilitas.webp')})` } : {}}
            />
            {/* Overlay gradasi HANYA DI ATAS agar transisi seamless */}
            <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-[#1e2a3b] via-[#1e2a3b]/50 to-transparent z-10 pointer-events-none" />

            {/* Judul Fasilitas (Fixed Center) */}
            <h2 className="fasilitas-title absolute top-[8%] md:top-[10%] left-1/2 -translate-x-1/2 z-10 text-[36px] md:text-[48px] font-extrabold text-white tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap will-change-transform">
                FASILITAS
            </h2>

            {/* Wadah Kanvas Gambar */}
            <div
                ref={wrapperRef}
                className="absolute inset-0 w-full h-full z-20 transform-gpu"
            >
                {fasilitasData.map((item) => (
                    <div
                        key={item.id}
                        className="fasilitas-item absolute top-1/2 left-1/2 rounded-xl overflow-hidden flex flex-col items-center gap-1 md:gap-2 w-[38vw] sm:w-[32vw] md:w-[26vw] lg:w-[24vw] max-w-[160px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px] transform-gpu will-change-transform"
                    >
                        <SiteImage
                            k={item.img}
                            alt={`Fasilitas Asrama: ${item.title}`}
                            width="340"
                            height="255"
                            loading="lazy"
                            decoding="async"
                            className="w-full aspect-[4/3] object-cover rounded-xl md:rounded-2xl border border-white/20 bg-[#0d1520]"
                        />
                        <p className="text-white font-semibold text-xs sm:text-sm md:text-base text-center bg-[#0d1520]/80 px-2.5 py-1 md:px-3 rounded-full mt-1">
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
