import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import alatKebersihan from '../../assets/img/fasilitas/alat_kebersihan.webp';
import alatMasak from '../../assets/img/fasilitas/alat_masak.webp';
import alatP3k from '../../assets/img/fasilitas/alat_p3k.webp';
import cctv from '../../assets/img/fasilitas/cctv.webp';
import dapur from '../../assets/img/fasilitas/dapur.webp';
import gedung from '../../assets/img/fasilitas/gedung.webp';
import kamar from '../../assets/img/fasilitas/kamar.webp';
import kamarMandi from '../../assets/img/fasilitas/kamar_mandi.jpg';
import kipasAngin from '../../assets/img/fasilitas/kipas_angin.webp';
import kompor from '../../assets/img/fasilitas/kompor.webp';
import kulkas from '../../assets/img/fasilitas/kulkas.webp';
import lapangVoli from '../../assets/img/fasilitas/lapang_voli.png';
import mading from '../../assets/img/fasilitas/mading.webp';
import mejaMakan from '../../assets/img/fasilitas/meja_makan.webp';
import mesinCuci from '../../assets/img/fasilitas/mesin_cuci.webp';
import mushola from '../../assets/img/fasilitas/mushola.webp';
import nonBlok from '../../assets/img/fasilitas/non-blok.webp';
import parkiran from '../../assets/img/fasilitas/parkiran.webp';
import pekarangan from '../../assets/img/fasilitas/pekarangan.webp';
import permainan from '../../assets/img/fasilitas/permainan.webp';
import ruangTengah from '../../assets/img/fasilitas/ruang_tengah.webp';
import bgFasilitas from '../../assets/img/bg-fasilitas.webp';

gsap.registerPlugin(ScrollTrigger);

// Data Koordinat Gambar - Formasi 2 1 2 konstan untuk semua frame
// Mobile (757px ke bawah): Menggunakan formasi sama persis (2-1-2) dengan ukuran & jarak proporsional
// Desktop: Formasi 2-1-2 dengan gap vertikal lebih lebar ke bawah
const fasilitasData = [
    { id: 1, title: "Gedung Asrama", img: gedung, deskX: "-32vw", deskY: "-20vh", mobX: "-26vw", mobY: "-15vh" },
    { id: 2, title: "Kamar", img: kamar, deskX: "32vw", deskY: "-20vh", mobX: "26vw", mobY: "-15vh" },
    { id: 3, title: "Ruang Tengah", img: ruangTengah, deskX: "0vw", deskY: "20vh", mobX: "0vw", mobY: "4vh" },
    { id: 4, title: "Kamar Mandi", img: kamarMandi, deskX: "-32vw", deskY: "60vh", mobX: "-26vw", mobY: "24vh" },
    { id: 5, title: "Dapur", img: dapur, deskX: "32vw", deskY: "60vh", mobX: "26vw", mobY: "24vh" },
    { id: 6, title: "Mushola", img: mushola, deskX: "0vw", deskY: "100vh", mobX: "0vw", mobY: "44vh" },
    { id: 7, title: "Lapang Voli", img: lapangVoli, deskX: "-32vw", deskY: "140vh", mobX: "-26vw", mobY: "65vh" },
    { id: 8, title: "Parkiran", img: parkiran, deskX: "32vw", deskY: "140vh", mobX: "26vw", mobY: "65vh" },
    { id: 9, title: "Ruang Non-Blok", img: nonBlok, deskX: "0vw", deskY: "180vh", mobX: "0vw", mobY: "84vh" },
    { id: 10, title: "Pekarangan", img: pekarangan, deskX: "-32vw", deskY: "220vh", mobX: "-26vw", mobY: "105vh" },
    { id: 11, title: "Meja Makan", img: mejaMakan, deskX: "32vw", deskY: "220vh", mobX: "26vw", mobY: "105vh" },
    { id: 12, title: "Kulkas", img: kulkas, deskX: "0vw", deskY: "260vh", mobX: "0vw", mobY: "125vh" },
    { id: 13, title: "Mesin Cuci", img: mesinCuci, deskX: "-32vw", deskY: "300vh", mobX: "-26vw", mobY: "145vh" },
    { id: 14, title: "Kompor", img: kompor, deskX: "32vw", deskY: "300vh", mobX: "26vw", mobY: "145vh" },
    { id: 15, title: "Alat Masak", img: alatMasak, deskX: "0vw", deskY: "340vh", mobX: "0vw", mobY: "165vh" },
    { id: 16, title: "Kipas Angin", img: kipasAngin, deskX: "-32vw", deskY: "380vh", mobX: "-26vw", mobY: "185vh" },
    { id: 17, title: "Alat Kebersihan", img: alatKebersihan, deskX: "32vw", deskY: "380vh", mobX: "26vw", mobY: "185vh" },
    { id: 18, title: "Alat P3K", img: alatP3k, deskX: "0vw", deskY: "420vh", mobX: "0vw", mobY: "205vh" },
    { id: 19, title: "CCTV", img: cctv, deskX: "-32vw", deskY: "460vh", mobX: "-26vw", mobY: "225vh" },
    { id: 20, title: "Permainan", img: permainan, deskX: "32vw", deskY: "460vh", mobX: "26vw", mobY: "225vh" },
    { id: 21, title: "Mading", img: mading, deskX: "0vw", deskY: "500vh", mobX: "0vw", mobY: "245vh" },
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
                    end: "+=5000",
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
                    force3D: true
                }, "scatter+=" + (i * 0.05));
            });

            // 3. Wrapper Naik Ke Atas (Memunculkan fasilitas bawah)
            tl.addLabel("scrollUp", "scatter+=0.4");
            tl.to(wrapperRef.current, {
                y: isDesktop ? "-485vh" : "-225vh",
                ease: "none",
                duration: 6,
                force3D: true
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
                        className="fasilitas-item absolute top-1/2 left-1/2 will-change-transform shadow-[0_2px_8px_rgba(0,0,0,0.2)] rounded-xl overflow-hidden flex flex-col items-center gap-1 md:gap-2 w-[38vw] sm:w-[32vw] md:w-[26vw] lg:w-[24vw] max-w-[160px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px]"
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