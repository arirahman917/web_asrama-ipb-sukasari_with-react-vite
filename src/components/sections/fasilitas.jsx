import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

gsap.registerPlugin(ScrollTrigger);

// Data Koordinat Gambar - Formasi 2 1 2 konstan untuk semua frame
// Mobile (757px ke bawah): Menggunakan formasi sama persis (2-1-2) dengan ukuran & jarak proporsional
// Desktop: Formasi 2-1-2 dengan gap vertikal lebih lebar ke bawah
const fasilitasData = [
    { id: 1, title: "Gedung Asrama", img: gedung, deskX: "-32vw", deskY: "-20vh", mobX: "-26vw", mobY: "-15vh" },
    { id: 2, title: "Ruang Tengah", img: ruangTengah, deskX: "32vw", deskY: "-20vh", mobX: "26vw", mobY: "-15vh" },
    { id: 3, title: "Mushola", img: mushola, deskX: "0vw", deskY: "20vh", mobX: "0vw", mobY: "4vh" },
    { id: 4, title: "Parkiran", img: parkiran, deskX: "-32vw", deskY: "60vh", mobX: "-26vw", mobY: "24vh" },
    { id: 5, title: "Non-Blok", img: perpustakaan, deskX: "32vw", deskY: "60vh", mobX: "26vw", mobY: "24vh" },
    { id: 6, title: "Dapur Bersama", img: dapur, deskX: "0vw", deskY: "100vh", mobX: "0vw", mobY: "44vh" },
    { id: 7, title: "Pekarangan", img: pekarangan, deskX: "-32vw", deskY: "140vh", mobX: "-26vw", mobY: "65vh" },
    { id: 8, title: "Alat Masak", img: alatMasak, deskX: "32vw", deskY: "140vh", mobX: "26vw", mobY: "65vh" },
    { id: 9, title: "Meja Makan", img: mejaMakan, deskX: "0vw", deskY: "180vh", mobX: "0vw", mobY: "84vh" },
    { id: 10, title: "Kulkas", img: kulkas, deskX: "-32vw", deskY: "220vh", mobX: "-26vw", mobY: "105vh" },
    { id: 11, title: "Kompor", img: kompor, deskX: "32vw", deskY: "220vh", mobX: "26vw", mobY: "105vh" },
];

export default function Fasilitas() {
    const sectionRef = useRef(null);
    const wrapperRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 758px)", // Sesuai permintaan: 757px ke bawah adalah mobile
            isMobile: "(max-width: 757px)"
        }, (context) => {
            const { isDesktop } = context.conditions;
            const items = gsap.utils.toArray('.fasilitas-item');

            // Posisi awal disembunyikan di tengah
            gsap.set(items, {
                xPercent: -50, // GSAP Centering
                yPercent: -50,
                x: 0, y: 0, scale: 0, opacity: 0,
                rotation: () => gsap.utils.random(-15, 15)
            });

            // Optimasi performa scroll:
            // 1. Durasi scrub proporsional.
            // 2. Panjang scroll disesuaikan agar tidak terlalu lama.
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=2800",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            // 1. Munculkan Judul
            tl.fromTo('.fasilitas-title',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
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
                }, "scatter+=" + (i * 0.05));
            });

            // 3. Wrapper Naik Ke Atas (Memunculkan fasilitas bawah)
            tl.addLabel("scrollUp", "scatter+=0.4");
            tl.to(wrapperRef.current, {
                y: isDesktop ? "-205vh" : "-80vh",
                ease: "none",
                duration: 3,
            }, "scrollUp");

        });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section
            id="fasilitas"
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden bg-[#0d1520] flex items-center justify-center"
        >
            {/* Background tanpa CSS Blur yang berat. Hanya menggunakan opacity kecil.
                Ini adalah kunci untuk memperbaiki lag parah pada scroll! */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${bgFasilitas})` }}
            />
            {/* Overlay gradasi HANYA DI ATAS agar nyambung transisi, bawahnya 100% plong/transparan */}
            <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-[#1e2a3b] via-[#1e2a3b]/50 to-transparent z-10 pointer-events-none" />

            {/* Overlay gradasi bawah SAYA HAPUS agar layarnya tidak tertutup warna gelap */}
            {/* Judul Fasilitas (Fixed Center) */}
            <h2 className="fasilitas-title absolute top-[8%] md:top-[10%] left-1/2 -translate-x-1/2 z-10 text-[36px] md:text-[48px] font-extrabold text-white tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap">
                FASILITAS
            </h2>

            {/* Wadah Kanvas Gambar */}
            <div
                ref={wrapperRef}
                className="absolute inset-0 w-full h-full z-20"
                style={{ willChange: 'transform' }} // Memaksa browser menggunakan GPU layer untuk keseluruhan bungkus
            >
                {fasilitasData.map((item) => (
                    <div
                        key={item.id}
                        // Hapus -translate-x-1/2 -translate-y-1/2 karena bentrok dengan GSAP. Kita gunakan top-1/2 left-1/2 + xPercent -50 yPercent -50
                        className="fasilitas-item absolute top-1/2 left-1/2 flex flex-col items-center gap-1 md:gap-2 w-[38vw] sm:w-[32vw] md:w-[26vw] lg:w-[24vw] max-w-[160px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px]"
                        style={{ willChange: 'transform, opacity' }} // Optimasi tinggi per-item agar di-render oleh VRAM GPU langsung
                    >
                        <img
                            src={item.img}
                            alt={item.title}
                            // loading="lazy" & decoding="async" dihapus agar browser langsung memuat gambar (tidak telat muncul saat di-scroll)
                            // Shadow dihapus untuk mengoptimalkan FPS saat animasi GSAP berjalan
                            className="w-full aspect-[4/3] object-cover rounded-xl md:rounded-2xl border border-white/20 bg-[#0d1520]/80"
                        />
                        <p className="text-white font-semibold text-[11px] sm:text-[13px] md:text-[16px] text-center bg-[#0d1520]/80 px-2 py-1 md:px-3 rounded-full mt-1">
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}