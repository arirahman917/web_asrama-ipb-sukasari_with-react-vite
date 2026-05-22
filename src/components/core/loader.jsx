import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Loader() {
  const loaderRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);

  // 1. Ambil durasi video secara otomatis
  useEffect(() => {
    const videoElement = videoContainerRef.current?.querySelector('video');
    if (videoElement) {
      videoElement.onloadedmetadata = () => {
        setVideoDuration(videoElement.duration);
      };
    }
  }, []);

  useGSAP(() => {
    // Pastikan video sudah diload dan punya durasi
    if (videoDuration === 0) return;

    const tlLoader = gsap.timeline({
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = 'none';
        }
        if (typeof window.lenis !== 'undefined') window.lenis.start();
      }
    });

    gsap.set(loaderRef.current, { backgroundColor: "#000000" });

    // --- TIMELINE ANIMASI ---

    // 1. Munculkan video (0s)
    tlLoader.to(videoContainerRef.current, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0)

      // 2. Transisi Background (Smooth Hitam ke Putih)
      // Kita atur agar mulai sedikit sebelum video selesai (misal 2 detik sebelum)
      // Durasi transisinya agak lama (misal 1.5 detik) agar terasa smooth
      .to(loaderRef.current, { 
        backgroundColor: "#ffffff", 
        duration: 1.5, 
        ease: "power2.inOut" 
      }, videoDuration - 2.5) // <-- Ini kunci timingnya! Sesuaikan angka 2.5 ini

      // 3. Hilangkan video dan loader (di akhir video)
      .to(videoContainerRef.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, videoDuration - 0.8)
      .to(loaderRef.current, { autoAlpha: 0, duration: 1, ease: "power2.inOut" }, "-=0.4");

  }, { scope: loaderRef, dependencies: [videoDuration] }); // Tambahkan dependensi

  return (
    <div
      ref={loaderRef}
      id="loader"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
    >
      <div
        ref={videoContainerRef}
        id="loader-logo-container"
        className="absolute inset-0 z-10 opacity-0 will-change-transform flex justify-center items-center bg-transparent" // Ubah bg video container jadi transparent
      >
        <video
          src="/motion-logo-ais.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}