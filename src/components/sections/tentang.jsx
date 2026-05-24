import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import gambar
import imgKabinet from '../../assets/img/pengurus/kabinet.webp';
import imgGedung from '../../assets/img/fasilitas/gedung.webp';
import imgUpgrading from '../../assets/img/program/upgrading.webp';

gsap.registerPlugin(ScrollTrigger);

export default function Tentang() {
    const containerRef = useRef();

    useGSAP(() => {
        // --- LOGIKA ANIMASI DARI animations.js ---
        gsap.set("#about-card", { width: "100%", height: "100%", borderRadius: "0px" });
        gsap.set(".about-text", { y: 30, opacity: 0 });

        let mm = gsap.matchMedia();

        // 1. Desktop
        mm.add("(min-width: 1024px)", () => {
            gsap.set("#blue-panel", { xPercent: 100, yPercent: 0 });

            let tlDesktop = gsap.timeline({
                scrollTrigger: { 
                    trigger: containerRef.current, 
                    start: "top top", 
                    end: "+=1200", 
                    pin: true, 
                    scrub: 1 
                }
            });

            tlDesktop.to("#about-card", { width: "85%", height: "80%", borderRadius: "32px", ease: "power1.inOut", duration: 2 })
                     .to("#blue-panel", { xPercent: 0, ease: "power2.out", duration: 1.5 }, "-=1.0")
                     .to(".about-text", { y: 0, opacity: 1, stagger: 0.2, ease: "power3.out", duration: 1 }, "-=0.5");
        });

        // 2. Mobile/Tablet
        mm.add("(max-width: 1023px)", () => {
            gsap.set("#blue-panel", { yPercent: 100, xPercent: 0 });
            gsap.set("#mobile-img-container", { height: "100%" }); 

            let tlMobile = gsap.timeline({
                scrollTrigger: { 
                    trigger: containerRef.current, 
                    start: "top top", 
                    end: "+=1200", 
                    pin: true, 
                    scrub: 1 
                }
            });

            tlMobile.to("#about-card", { width: "95%", height: "92%", borderRadius: "28px", ease: "power1.inOut", duration: 2 })
                    .to("#blue-panel", { yPercent: 0, ease: "power2.out", duration: 1.5 }, "-=1.0")
                    .to("#mobile-img-container", { height: "45%", ease: "power2.out", duration: 1.5 }, "-=1.5")
                    .to("#mobile-img", { objectPosition: "55% 100%", ease: "power2.out", duration: 1.5 }, "-=1.5")
                    .to(".about-text", { y: 0, opacity: 1, stagger: 0.2, ease: "power3.out", duration: 1 }, "-=0.5");
        });

        return () => mm.revert(); // Bersihkan matchMedia saat komponen di-unmount
    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="about-section tentang" className="relative w-full h-[100svh] md:h-screen flex items-center justify-center bg-white overflow-hidden">
            <div id="about-card" className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white shadow-2xl will-change-transform">
                
                <div className="absolute inset-0 flex w-full h-full bg-[#1b2a47]">
                    <div id="mobile-img-container" className="w-full h-full block lg:hidden origin-top">
                        <img id="mobile-img" src={imgKabinet} alt="Kabinet Asrama" className="w-full h-full object-cover" style={{ objectPosition: '50% 0%' }} />
                    </div>

                    <div className="hidden lg:flex w-full h-full">
                        <div className="w-full lg:w-1/2 h-full">
                            <img src={imgGedung} alt="Gedung Asrama" className="w-full h-full object-cover object-[54%_center]" />
                        </div>
                        <div className="hidden lg:flex flex-col w-1/2 h-full bg-gray-200">
                            <div className="w-full h-1/2 relative"><img src={imgUpgrading} alt="Foto Atas" className="w-full h-full object-cover object-[center_65%]" /></div>
                            <div className="w-full h-1/2 relative"><img src={imgGedung} alt="Foto Bawah" className="w-full h-full object-cover object-[50%_center]" /></div>
                        </div>
                    </div>
                </div>

                <div id="blue-panel" className="absolute bottom-0 left-0 w-full h-[55%] md:h-[50%] lg:top-0 lg:bottom-auto lg:right-0 lg:left-auto lg:w-1/2 lg:h-full bg-[#1b2a47] flex flex-col justify-end md:justify-start lg:justify-center px-6 pb-8 md:pb-16 md:pt-4 lg:px-14 z-20 will-change-transform items-center lg:items-start">
                    
                    <div className="absolute top-0 bottom-0 right-full w-28 translate-x-[2px] bg-gradient-to-r from-transparent to-[#1b2a47] pointer-events-none hidden lg:block z-30"></div>
                    <div className="absolute bottom-full left-0 w-full h-40 md:h-72 translate-y-[2px] bg-gradient-to-t from-[#1b2a47] to-transparent pointer-events-none block lg:hidden z-30"></div>

                    <div className="w-full md:max-w-2xl lg:max-w-none flex flex-col relative z-10 mb-4 sm:mb-6 md:mb-24 lg:mt-32">
                        <h2 className="about-text text-[22px] md:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-5 tracking-tight text-center lg:text-left">Tentang Kami</h2>
                        <p className="about-text px-2 md:px-0 text-white text-[13px] sm:text-[14px] md:text-[16px] lg:text-[12px] leading-[1.6] text-justify md:text-center lg:text-justify">
                            Asrama IPB Sukasari merupakan fasilitas hunian mahasiswa Institut Pertanian Bogor yang menyediakan lingkungan tinggal yang aman, tertib, dan nyaman. Asrama ini berperan sebagai ruang tumbuh mahasiswa dalam mendukung kegiatan akademik, pembinaan karakter, dan kebersamaan. Sebagai bagian dari ekosistem pendidikan IPB, asrama juga menjadi wadah pembelajaran nilai kedisiplinan, tanggung jawab, dan kehidupan bermasyarakat.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}