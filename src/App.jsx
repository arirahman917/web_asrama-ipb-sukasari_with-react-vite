import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Layout & Components
// Sesuaikan path ini dengan letak folder komponenmu
import Navbar from './components/core/navbar';
import Hero from './components/sections/hero'; // Asumsi Loader menyatu di dalam Hero sesuai konversi sebelumnya
import Tentang from './components/sections/tentang';
import VisiMisiNilai from './components/sections/visiMisiNilai';
import Sejarah from './components/sections/sejarah';
import Pengurus from './components/sections/pengurus';
import Program from './components/sections/program';
import Fasilitas from './components/sections/fasilitas';
import Berita from './components/sections/berita';
import Galeri from './components/sections/galeri';
import Alumni from './components/sections/alumni';
import Footer from './components/core/footer';  

import PengurusFull from './pages/pengurusFull';
import BeritaDetail from './pages/detailBerita';
import PilihBerita from './pages/pilihBerita';

// Komponen ScrollToTop untuk mengatasi masalah posisi scroll saat ganti halaman
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jika lenis sudah diinisialisasi, gunakan lenis.scrollTo
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

// Komponen Halaman Utama (Landing Page)
function LandingPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#f3f4f6] font-sans">
      <Hero />
      <Tentang />
      <Sejarah />
      <VisiMisiNilai />
      <Pengurus />
      <Program />
      <Fasilitas />
      <Berita />
      <Galeri />
      <Alumni />
    </main>
  );
}

export default function App() {
  // Konfigurasi Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
    });

    // Ekspos lenis ke global window agar bisa diakses oleh animasi GSAP di komponen lain
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pengurus" element={<PengurusFull />} />
        <Route path="/berita" element={<BeritaDetail />} />
        <Route path="/berita/:id" element={<PilihBerita />} />
      </Routes>
      <Footer />
    </Router>
  );
}