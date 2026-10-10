import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Layout & Components
import Navbar from './components/core/navbar';
import Hero from './components/sections/hero';
import Tentang from './components/sections/tentang';
import VisiMisiNilai from './components/sections/visiMisiNilai';
import Sejarah from './components/sections/sejarah';
import Pengurus from './components/sections/pengurus';
import ProgramSementara from './components/sections/programSementara';
import Fasilitas from './components/sections/fasilitas';
import Berita from './components/sections/berita';
import Galeri from './components/sections/galeri';
import Alumni from './components/sections/alumni';
import Footer from './components/core/footer';
import AiChatWidget from './components/ai/AiChatWidget';

import PengurusFull from './pages/pengurusFull';
import BeritaDetail from './pages/detailBerita';
import PilihBerita from './pages/pilihBerita';
import FormOprec from './pages/FormOprec';
import Login from './pages/Login';
import ResponsOprec from './pages/ResponsOprec';

// Admin
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminBerita from './pages/admin/AdminBerita';
import AdminBeritaForm from './pages/admin/AdminBeritaForm';
import AdminAlumni from './pages/admin/AdminAlumni';
import AdminAdmins from './pages/admin/AdminAdmins';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteImages } from './utils/images';

// Set favicon dari registri gambar (mendukung override Firebase).
function DynamicFavicon() {
  const { overrides, get } = useSiteImages();
  useEffect(() => {
    const url = get('public/logo-ais.png') || get('logo-ais.webp');
    if (!url) return;
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides]);
  return null;
}

// Komponen ScrollToTop untuk mengatasi masalah posisi scroll saat ganti halaman
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname]);

  return null;
}

// Komponen Halaman Utama (Landing Page)
function LandingPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#f3f4f6] font-sans">
      <Hero />
      <Tentang />
      {/* <Sejarah /> */}
      <VisiMisiNilai />
      <Pengurus />
      {/* <Program /> */}
      <ProgramSementara />
      <Fasilitas />
      <Berita />
      <Galeri />
      <Alumni />
    </main>
  );
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <AiChatWidget />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.lenis = null;
    };
  }, []);

  return (
    <AuthProvider>
      <DynamicFavicon />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Main Site Routes with Navbar & Footer */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/pengurus" element={<MainLayout><PengurusFull /></MainLayout>} />
          <Route path="/berita" element={<MainLayout><BeritaDetail /></MainLayout>} />
          <Route path="/berita/:id" element={<MainLayout><PilihBerita /></MainLayout>} />

          {/* OPREC Route without Navbar & Footer */}
          <Route path="/oprec" element={<FormOprec />} />

          {/* Admin Routes */}
          <Route path="/admin">
            <Route index element={<Login />} />
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="berita" element={<AdminBerita />} />
              <Route path="berita/baru" element={<AdminBeritaForm />} />
              <Route path="berita/:id" element={<AdminBeritaForm />} />
              <Route path="alumni" element={<AdminAlumni />} />
              <Route path="respons" element={<ResponsOprec />} />
              <Route path="admins" element={<AdminAdmins />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
