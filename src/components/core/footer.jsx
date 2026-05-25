import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logoAis from '../../assets/img/logo-ais.webp';

gsap.registerPlugin(ScrollTrigger);

// Custom SVGs for Social Icons matching the UI
const WhatsApp = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
);

const Instagram = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Mail = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

export default function Footer() {
  const footerRef = useRef(null);
  const blueBoxRef = useRef(null);
  const whiteBoxRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;

    // Animasi Shrink saat scroll mentok bawah
    // Tanpa menggunakan pin agar tidak menimpa section di atasnya (Alumni)
    gsap.to(blueBoxRef.current, {
      scrollTrigger: {
        trigger: whiteBoxRef.current,
        start: "top bottom", // Animasi dimulai saat kotak putih mulai terlihat dari bawah
        end: "bottom bottom", // Animasi selesai saat kotak putih terlihat sepenuhnya
        scrub: true,
      },
      scaleX: isMobile ? 0.94 : 0.96, // 0.90 untuk HP (lebih mengecil), 0.96 untuk desktop
      scaleY: 1, // Tidak disusutkan secara vertikal agar tidak bergeser ke atas sama sekali
      borderRadius: "0 0 32px 32px",
      transformOrigin: "top center",
      ease: "none"
    });
  }, { scope: footerRef });

  return (
    <footer id="footer" ref={footerRef} className="relative w-full bg-[#FAF9F6] flex flex-col">

      {/* Background Biru Dongker Utama */}
      <div
        ref={blueBoxRef}
        className="w-full bg-[#0a2f4c] pt-16 pb-12 text-white relative z-10 will-change-transform"
      >
        <div className="max-w-6xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">

          {/* Kolom Lokasi */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl mb-6 tracking-wide">Lokasi</h3>
            {/* Embed Map Kecil */}
            <div className="w-[280px] h-[150px] bg-gray-200 rounded-md overflow-hidden mb-4 border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2643714141145!2d106.8062608749938!3d-6.61403959338005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c561607ca6cf%3A0x92c537da16058b0a!2sAsrama%20IPB%20Sukasari%20SV%20IPB!5e0!3m2!1sen!2sid!4v1777201648366!5m2!1sen!2sid"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map Asrama Sukasari"
              ></iframe>
            </div>
            <p className="text-[13px] text-gray-300 w-[280px] leading-relaxed text-left">
              Sekolah Vokasi IPB University, Jl. Siliwangi No.43, RT.01/RW.03, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142
            </p>
          </div>

          {/* Kolom Menu */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl mb-6 tracking-wide">Menu</h3>
            <ul className="grid grid-cols-3 md:flex md:flex-col gap-x-4 gap-y-3 md:gap-2 text-gray-300 text-sm">
              <li><a href="/#hero" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="/#about-section" className="hover:text-white transition-colors">Tentang</a></li>
              <li><a href="/#fasilitas" className="hover:text-white transition-colors">Fasilitas</a></li>
              <li><a href="/#berita" className="hover:text-white transition-colors">Berita</a></li>
              <li><a href="/#galeri" className="hover:text-white transition-colors">Galeri</a></li>
              <li><a href="/#footer" className="hover:text-white transition-colors">Kontak</a></li>
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-xl mb-6 tracking-wide md:pr-4">Kontak</h3>
            <div className="flex gap-5 justify-center md:justify-end">
              <a href="https://wa.me/6285795016378" className="text-white hover:text-orange-400 transition-colors">
                <WhatsApp className="w-7 h-7" />
              </a>
              <a href="https://www.instagram.com/arirahmanrise?igsh=MTd4eGQ4eTZncjNlMQ==#" className="text-white hover:text-orange-400 transition-colors">
                <Instagram className="w-7 h-7" />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=asramasukasari43@gmail.com" className="text-white hover:text-orange-400 transition-colors">
                <Mail className="w-7 h-7" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-6xl mx-auto px-8 md:px-16 mt-16 flex justify-center items-center text-[12px] text-gray-400 text-center">
          <p>© Asrama IPB Sukasari 2026. All Rights Reserved.</p>
        </div>
      </div>

      {/* White Bottom Area: Teks & Logo yang terungkap secara natural */}
      <div
        ref={whiteBoxRef}
        className="w-full h-[160px] bg-[#FAF9F6] flex flex-col items-center justify-end pb-10 relative z-0"
      >
        <p className="text-gray-600 text-[13px] font-medium mb-3">You are always in my heart.</p>
        <div className="flex items-center justify-center">
          <img src={logoAis} alt="Logo Asrama Sukasari" className="h-12 w-auto object-contain opacity-90" />
        </div>
      </div>

    </footer>
  );
}