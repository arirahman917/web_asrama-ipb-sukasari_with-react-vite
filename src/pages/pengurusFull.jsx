import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SiteImage from '../components/core/SiteImage';

gsap.registerPlugin(ScrollTrigger);

export default function PengurusFull() {
    const containerRef = useRef(null);

    const departments = [
        {
            title: "Badan Pengurus Harian",
            rows: [
                [{ name: "M. Febryan Ar-Rifa'i", role: "Presiden", img: "pengurus/bph/individu/febryan.png" }],
                [
                    { name: "Raffi Arrasyid", role: "Sekretaris", img: "pengurus/bph/individu/rasyid.png", imgSize: "w-[98%] h-[98%]"},
                    { name: "Dias Adiyasa", role: "Wakil Presiden", img: "pengurus/bph/individu/dias.png", imgSize: "w-[110%] h-[110%]"},
                    { name: "Nur Hamdan Agustian", role: "Bendahara", img: "pengurus/bph/individu/hamdan.png", imgSize: "w-[110%] h-[110%]"}
                ]
            ]
        },
        {
            title: "Kementerian Kepenghunian",
            rows: [
                [
                    { name: "Raihan Alma Putra", role: "Menteri", img: "pengurus/kepenghunian/individu/raihan61.png" },
                    { name: "Fawaz Devan Putra", role: "Wakil Menteri", img: "pengurus/kepenghunian/individu/devan.png" }
                ],
                [
                    { name: "Raihan Hanief Ramadhan", role: "Staff", img: "pengurus/kepenghunian/individu/raihan62.png" },
                    { name: "Randhika Pratama Putra ", role: "Staff", img: "pengurus/kepenghunian/individu/randhika.png" },
                    { name: "Muhammad Fadhli Ramadhan", role: "Staff", img: "pengurus/kepenghunian/individu/fadli.png" }
                ]
            ]
        },
        {
            title: "Kementerian Lingkungan dan Sarana Prasarana",
            rows: [
                [
                    { name: "Muhammad Al - Faatih", role: "Menteri", img: "pengurus/lingpras/individu/faatih.png" },
                    { name: "Didin Fakhrudin", role: "Wakil Menteri", img: "pengurus/lingpras/individu/didin.png" }
                ],
                [
                    { name: "Rivat Maulana Nur Sidiq", role: "Staff", img: "pengurus/lingpras/individu/rivat.png", imgSize: "w-[120%] h-[120%]" },
                    { name: "Brili Anfus Tsakib H. H.", role: "Staff", img: "pengurus/lingpras/individu/brili.png" },
                    { name: "Abi Dwi Putra", role: "Staff", img: "pengurus/lingpras/individu/abi.png" },
                    { name: "Rizeki Yuhendri ", role: "Staff", img: "pengurus/lingpras/individu/rizeki.png", imgSize: "w-[130%] h-[130%]" }
                ]
            ]
        },
        {
            title: "Kementerian Jasmani dan Rohani",
            rows: [
                [
                    { name: "Rafidani Elfirdaus", role: "Menteri", img: "pengurus/jasroh/individu/rafidani.png" },
                    { name: "Rahmad Aditri Saputra", role: "Wakil Menteri", img: "pengurus/jasroh/individu/rahmad.png" },
                    { name: "Naufal Mochamad Maliq", role: "Staff", img: "pengurus/jasroh/individu/naufal.png" }
                ]
            ]
        },
        {
            title: "Kementerian Media dan Digital",
            rows: [
                [
                    { name: "M. Rafdi Rifansyah S.", role: "Menteri", img: "pengurus/mediadigi/individu/rafdi.png", imgSize: "w-[103%] h-[103%]" },
                    { name: "Nando Ravy Ardyansyah", role: "Wakil Menteri", img: "pengurus/mediadigi/individu/nando.png" }
                ],
                [
                    { name: "Rifqi Adli Hernawan", role: "Staff IT", img: "pengurus/mediadigi/individu/rifqi.png" },
                    { name: "Andi Rafael M. Arumpone L.", role: "Staff", img: "pengurus/mediadigi/individu/rafael.png", imgSize: "w-[105%] h-[105%]" },
                    { name: "Ari Rahman", role: "Staff IT", img: "pengurus/mediadigi/individu/ari.png", imgSize: "w-[105%] h-[105%]" }
                ]
            ]
        }
    ];

    useGSAP(() => {
        // Animasi Main Header saat halaman baru diload
        gsap.from(".main-header", {
            y: -40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.1
        });

        // Animasi untuk setiap departemen (muncul per section saat discroll)
        const sections = gsap.utils.toArray('.dept-section');

        sections.forEach((section, index) => {
            const title = section.querySelector('.dept-title');
            const cards = section.querySelectorAll('.person-card');
            const images = section.querySelectorAll('.person-img');
            const texts = section.querySelectorAll('.person-text');

            // Judul muncul dari kiri atau kanan secara bergantian
            const xOffset = index % 2 === 0 ? -80 : 80;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%", // Mulai saat elemen masuk ke 85% layar
                    toggleActions: "play none none none", // Mainkan sekali saja agar lebih stabil
                }
            });

            // Animasi Judul Departemen
            tl.from(title, {
                x: xOffset,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
                // Animasi Wadah Kartu Personil (Muncul dari bawah)
                .from(cards, {
                    y: 60,
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.15,
                    ease: "back.out(1.2)"
                }, "-=0.5")
                // Animasi spesifik untuk Gambar orangnya (meluncur naik dari bawah ke atas dari dalam card)
                .from(images, {
                    y: 40,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out"
                }, "-=0.7")
                // Animasi Nama & Jabatan fade in dari bawah
                .from(texts, {
                    y: 10,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.15,
                    ease: "power1.out"
                }, "-=0.6");
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-white py-16 overflow-hidden font-sans">

            {/* Main Header */}
            <div className="text-center mb-16 mt-16 md:mt-10"> {/* Margin top ditambahkan agar tidak tertutup Navbar */}
                <h1 className="main-header text-3xl md:text-5xl font-bold text-[#ea580c] tracking-wide">
                    Pengurus Asrama
                </h1>
            </div>

            {/* Pemetaan Data Struktur Organisasi */}
            <div className="flex flex-col gap-20">
                {departments.map((dept, deptIndex) => (
                    <div key={deptIndex} className="dept-section flex flex-col items-center w-full px-4">

                        {/* Judul Departemen */}
                        <h2 className="dept-title text-xl md:text-2xl font-bold text-[#1e3a8a] mb-6 md:mb-6 text-center mt-5">
                            {dept.title}
                        </h2>

                        {/* Baris Struktur */}
                        <div className="flex flex-col gap-6 md:gap-6 w-full items-center">
                            {dept.rows.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12">

                                    {/* Looping Kartu Personil */}
                                    {row.map((person, personIndex) => (
                                        <div key={personIndex} className="person-card card-wrapper">
                                            {/* Container utama dengan aspect-ratio penuh. Bagian atas transparan, bawah memiliki radius. */}
                                            <div
                                                className="group relative w-[130px] sm:w-[150px] md:w-[180px] aspect-[3/4] cursor-pointer rounded-br-[2.5rem] rounded-bl-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 drop-shadow-md hover:drop-shadow-2xl"
                                            >
                                                {/* Layer 1: Orange BG (Tinggi 60% agar turun ke area bahu/leher, lebih proporsional) */}
                                                <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-br from-[#f2813f] to-[#d04b06] rounded-tl-[2.5rem] rounded-tr-lg"></div>

                                                {/* Layer 2: Foto Transparan Personil */}
                                                <div className="person-img absolute bottom-0 left-0 w-full h-[95%] flex justify-center items-end pointer-events-none">
                                                    <SiteImage
                                                        k={person.img}
                                                        alt={person.name}
                                                        className={`${person.imgSize || "w-[95%] h-full"} max-w-none object-contain object-bottom transition-transform duration-500 origin-bottom group-hover:scale-110`}
                                                    />
                                                </div>

                                                {/* Layer 3: Overlay Biru Dongker (Tinggi disesuaikan agar proporsional dengan layer oranye) */}
                                                <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#0f172a] via-[#1e3a8a]/80 to-transparent pointer-events-none opacity-90"></div>

                                                {/* Layer 4: Teks Nama & Jabatan */}
                                                <div className="person-text absolute bottom-3 md:bottom-4 z-20 flex flex-col items-center text-white w-full px-2 text-center pointer-events-none">
                                                    <h3 className="font-bold text-[10px] sm:text-[11px] md:text-[13px] leading-tight mb-[2px] drop-shadow-md">
                                                        {person.name}
                                                    </h3>
                                                    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium opacity-90 tracking-wider text-orange-200 drop-shadow-md">
                                                        {person.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}