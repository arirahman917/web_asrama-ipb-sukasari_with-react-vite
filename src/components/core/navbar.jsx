import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoAis from '../../assets/img/logo-ais.webp';

export default function Navbar() {
    // --- STATE ---
    const [isVisible, setIsVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(false);
    const [navTransform, setNavTransform] = useState('-150px');

    const desktopDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // --- EFFECT: Initial Slide In ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setNavTransform('0px');
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // --- EFFECT: Scroll Logic ---
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Tutup dropdown desktop jika scroll
            if (isDesktopDropdownOpen) setIsDesktopDropdownOpen(false);

            if (currentScrollY < 50) {
                setNavTransform('0px');
            } else if (currentScrollY > lastScrollY) {
                // Scroll kebawah: Sembunyikan
                const hideOffset = window.innerWidth >= 1010 ? '-100px' : '-70px';
                setNavTransform(hideOffset);
            } else {
                // Scroll keatas: Munculkan
                setNavTransform('0px');
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isDesktopDropdownOpen]);

    // --- EFFECT: Outside Click Logic ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close desktop dropdown
            if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) {
                setIsDesktopDropdownOpen(false);
            }
            // Close mobile menu
            if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('#btn-hamburger')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    return (
        <nav 
            id="navbar" 
            className="fixed top-4 md:top-5 left-0 right-0 mx-auto z-[90] w-[90%] max-w-2xl rounded-full bg-white/70 md:bg-white/60 backdrop-blur-md px-5 py-1.5 md:px-6 md:py-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex justify-between items-center text-gray-900 border border-white/30 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(${navTransform})` }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3">
                <a href="/">
                    <img src={logoAis} alt="Logo Asrama" className="z-10 w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 object-contain" />
                </a>
            </div>

            {/* Desktop Menu & Button */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                <div className="flex items-center gap-5 xl:gap-6 text-[11px] lg:text-[9px] font-semibold">
                    <a href="/#hero" className="hover:text-orange-500 transition-colors py-2">Beranda</a>
                    
                    {/* Dropdown Desktop */}
                    <div className="relative" ref={desktopDropdownRef}>
                        <button 
                            onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                            className="flex items-center justify-between w-full text-left py-2 focus:outline-none group cursor-pointer"
                        >
                            <span className="group-hover:text-orange-500 transition-colors py-2">Identitas</span>
                            <svg className={`ml-1 w-2 h-2 transition-transform duration-300 ${isDesktopDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <div className={`absolute top-[110%] left-0 w-28 bg-white/95 backdrop-blur-xl rounded-md shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 p-2 flex flex-col gap-1 transition-all duration-300 z-[100] ${isDesktopDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                            <div className="overflow-hidden m-0.5">
                                <div className="flex flex-col gap-3 border-l-2 border-gray-200 ml-1 pl-3 mt-2 mb-2">
                                    <a href="/#about-section" className="text-[11px] lg:text-[9px] font-medium text-gray-600 hover:text-orange-500 transition-colors">Tentang</a>
                                    <a href="/#sejarah-section" className="text-[11px] lg:text-[9px] font-medium text-gray-600 hover:text-orange-500 transition-colors">Sejarah</a>
                                    <a href="/#pin-section" className="text-[11px] lg:text-[9px] font-medium text-gray-600 hover:text-orange-500 transition-colors">Visi Misi</a>
                                    <a href="/#pengurus" className="text-[11px] lg:text-[9px] font-medium text-gray-600 hover:text-orange-500 transition-colors">Pengurus</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <a href="/#program" className="hover:text-orange-500 transition-colors py-2">Program</a>
                    <a href="/#fasilitas" className="hover:text-orange-500 transition-colors py-2">Fasilitas</a>
                    <a href="/#berita" className="hover:text-orange-500 transition-colors py-2">Berita</a>
                    <a href="/#galeri" className="hover:text-orange-500 transition-colors py-2">Galeri</a>
                    <a href="/#alumni" className="hover:text-orange-500 transition-colors py-2">Kata Alumni</a>
                    <a href="/#footer" className="hover:text-orange-500 transition-colors py-2">Kontak</a>
                </div>
                <Link to="/oprec" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] lg:text-[10px] font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-md shadow-orange-500/20">
                    Daftar
                </Link>
            </div>
            
            {/* Mobile Actions: Daftar Button + Hamburger */}
            <div className="flex lg:hidden items-center gap-3">
                <Link to="/oprec" className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[12px] font-semibold rounded-full shadow-md shadow-orange-500/20 active:scale-95 transition-all">
                    Daftar
                </Link>
                {/* Hamburger Button */}
                <button 
                    id="btn-hamburger"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="cursor-pointer p-1.5 -mr-1 rounded-full hover:bg-gray-200 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Content */}
            <div 
                ref={mobileMenuRef}
                className={`absolute top-[120%] left-0 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 p-4 flex-col gap-1 z-[100] transition-all ${isMobileMenuOpen ? 'flex' : 'hidden'}`}
            >
                <a href="/#hero" className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-semibold text-gray-800">Beranda</a>
                
                <button 
                    onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-semibold text-gray-800 text-left"
                >
                    <span>Identitas</span>
                    <div className="bg-gray-100 text-gray-500 p-1.5 rounded-full flex items-center justify-center transition-colors">
                        <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileAccordionOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </button>

                {/* Mobile Accordion Content */}
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out overflow-hidden ${isMobileAccordionOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="min-h-0">
                        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-2 mx-2 mb-2 flex flex-col gap-1 shadow-inner">
                            <a href="/#about-section" className="px-4 py-2.5 hover:bg-white hover:text-orange-600 hover:shadow-sm rounded-lg transition-all font-medium text-gray-600 text-sm">Tentang</a>
                            <a href="/#sejarah-section" className="px-4 py-2.5 hover:bg-white hover:text-orange-600 hover:shadow-sm rounded-lg transition-all font-medium text-gray-600 text-sm">Sejarah</a>
                            <a href="/#pin-section" className="px-4 py-2.5 hover:bg-white hover:text-orange-600 hover:shadow-sm rounded-lg transition-all font-medium text-gray-600 text-sm">Visi Misi</a>
                            <a href="/#pengurus" className="px-4 py-2.5 hover:bg-white hover:text-orange-600 hover:shadow-sm rounded-lg transition-all font-medium text-gray-600 text-sm">Pengurus</a>
                        </div>
                    </div>
                </div>
                
                <a href="/#program" className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-semibold text-gray-800">Program</a>
                <a href="/#fasilitas" className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-semibold text-gray-800">Fasilitas</a>
                <a href="/#berita" className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-semibold text-gray-800">Berita</a>
                <a href="/#galeri" className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-semibold text-gray-800">Galeri</a>
                <a href="/#footer" className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-semibold text-gray-800">Kontak</a>
            </div>
        </nav>
    );
}