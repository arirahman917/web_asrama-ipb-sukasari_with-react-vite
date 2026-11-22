import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SiteImage from '../core/SiteImage';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function Tentang() {
    const containerRef = useRef();

    useGSAP(() => {
        let mm = gsap.matchMedia();

        // 1. Desktop (Animasi cinematic pin & reveal berbasis transform GPU murni - tanpa layout reflow)
        mm.add("(min-width: 1024px)", () => {
            gsap.set("#blue-panel", { xPercent: 100, yPercent: 0, force3D: true });
            gsap.set(".about-text", { y: 25, opacity: 0, force3D: true });

            let tlDesktop = gsap.timeline({
                scrollTrigger: { 
                    trigger: containerRef.current, 
                    start: "top top", 
                    end: "+=1200", 
                    pin: true, 
                    anticipatePin: 1, 
                    scrub: 1 
                }
            });

            tlDesktop.to("#about-card", { scale: 0.9, ease: "power1.inOut", duration: 2, force3D: true })
                     .to("#blue-panel", { xPercent: 0, ease: "power2.out", duration: 1.5, force3D: true }, "-=1.0")
                     .to(".about-text", { y: 0, opacity: 1, stagger: 0.2, ease: "power3.out", duration: 1 }, "-=0.5");
        });

        // 2. Mobile/Tablet (Transform & opacity murni tanpa forced reflow)
        mm.add("(max-width: 1023px)", () => {
            gsap.set("#blue-panel", { yPercent: 0, xPercent: 0, force3D: true });
            gsap.set(".about-text", { y: 0, opacity: 1, force3D: true });

            gsap.fromTo("#about-card", 
                { opacity: 0.8, y: 20, scale: 0.97 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: 0.6, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        return () => mm.revert();
    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="about-section" className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden transform-gpu">
            <div id="about-card" className="relative w-[92%] h-[88%] lg:w-full lg:h-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-none max-h-[620px] sm:max-h-[680px] lg:max-h-none rounded-3xl overflow-hidden flex items-center justify-center bg-white shadow-2xl will-change-transform">
                
                <div className="absolute inset-0 flex w-full h-full bg-[#1b2a47]">
                    <div id="mobile-img-container" className="w-full h-[42%] block lg:hidden origin-top">
                        <SiteImage id="mobile-img" k="pengurus/kabinet-bahagia.webp" alt="Kabinet Pengurus Asrama Sukasari" width="600" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
                    </div>

                    <div className="hidden lg:flex w-full h-full">
                        <div className="w-full lg:w-1/2 h-full">
                            <SiteImage k="fasilitas/gedung.webp" alt="Gedung Asrama IPB Sukasari" width="600" height="800" loading="lazy" decoding="async" className="w-full h-full object-cover object-[54%_center]" />
                        </div>
                        <div className="hidden lg:flex flex-col w-1/2 h-full bg-gray-200">
                            <div className="w-full h-1/2 relative"><SiteImage k="program/upgrading.webp" alt="Kegiatan Upgrading Pengurus Asrama" width="600" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover object-[center_65%]" /></div>
                            <div className="w-full h-1/2 relative"><SiteImage k="pengurus/kabinet-bahagia.webp" alt="Foto Bersama Kabinet Asrama Sukasari" width="600" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover object-[50%_center]" /></div>
                        </div>
                    </div>
                </div>

                {/* Panel Biru: proporsional dan terpusat di mobile, seimbang di desktop */}
                <div id="blue-panel" className="absolute bottom-0 left-0 w-full h-[58%] sm:h-[55%] md:h-[52%] lg:top-0 lg:bottom-auto lg:right-0 lg:left-auto lg:w-1/2 lg:h-full bg-[#142036] flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 z-20 will-change-transform items-center lg:items-start">
                    
                    <div className="absolute top-0 bottom-0 right-full w-24 lg:w-32 translate-x-[2px] bg-gradient-to-r from-transparent to-[#142036] pointer-events-none hidden lg:block z-30"></div>
                    <div className="absolute bottom-full left-0 w-full h-20 sm:h-28 translate-y-[2px] bg-gradient-to-t from-[#142036] to-transparent pointer-events-none block lg:hidden z-30"></div>

                    <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl flex flex-col relative z-10 text-center lg:text-left">
                        <h2 className="about-text text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[52px] font-bold text-white mb-2 sm:mb-3 lg:mb-5 xl:mb-6 tracking-tight">
                            Tentang Kami
                        </h2>
                        <p className="about-text text-[12px] sm:text-[13.5px] md:text-[15px] lg:text-[15.5px] xl:text-[17px] 2xl:text-[18.5px] leading-relaxed lg:leading-[1.8] xl:leading-[1.85] text-white font-normal text-center sm:text-justify lg:text-justify">
                            Asrama IPB Sukasari merupakan fasilitas hunian mahasiswa Institut Pertanian Bogor yang menyediakan lingkungan tinggal yang aman, tertib, dan nyaman. Asrama ini berperan sebagai ruang tumbuh mahasiswa dalam mendukung kegiatan akademik, pembinaan karakter, dan kebersamaan. Sebagai bagian dari ekosistem pendidikan IPB, asrama juga menjadi wadah pembelajaran nilai kedisiplinan, tanggung jawab, dan kehidupan bermasyarakat.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
