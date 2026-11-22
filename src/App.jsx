import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Critical Path Components (Hanya Navbar & Hero untuk render pertama super cepat)
import Navbar from './components/core/navbar';
import Hero from './components/sections/hero';

// Lazy Loaded Below-the-fold Landing Sections (Code splitting ekstrem untuk skor Performance 95+)
const Tentang = lazy(() => import('./components/sections/tentang'));
const VisiMisiNilai = lazy(() => import('./components/sections/visiMisiNilai'));
const Pengurus = lazy(() => import('./components/sections/pengurus'));
const ProgramSementara = lazy(() => import('./components/sections/programSementara'));
const Fasilitas = lazy(() => import('./components/sections/fasilitas'));
const Berita = lazy(() => import('./components/sections/berita'));
const Galeri = lazy(() => import('./components/sections/galeri'));
const Alumni = lazy(() => import('./components/sections/alumni'));
const Footer = lazy(() => import('./components/core/footer'));

// Lazy Loaded Non-Critical Pages
const PengurusFull = lazy(() => import('./pages/pengurusFull'));
const BeritaDetail = lazy(() => import('./pages/detailBerita'));
const PilihBerita = lazy(() => import('./pages/pilihBerita'));
const FormOprec = lazy(() => import('./pages/FormOprec'));
const Login = lazy(() => import('./pages/Login'));
const ResponsOprec = lazy(() => import('./pages/ResponsOprec'));

// Admin Pages & Auth (Lazy Loaded agar Firebase Auth tidak masuk ke bundle landing page)
const AuthProvider = lazy(() => import('./context/AuthContext').then(m => ({ default: m.AuthProvider })));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminBerita = lazy(() => import('./pages/admin/AdminBerita'));
const AdminBeritaForm = lazy(() => import('./pages/admin/AdminBeritaForm'));
const AdminAlumni = lazy(() => import('./pages/admin/AdminAlumni'));
const AdminAdmins = lazy(() => import('./pages/admin/AdminAdmins'));
import { useSiteImages } from './utils/images';

// Set favicon dari registri gambar (mendukung override Firebase).
function DynamicFavicon() {
  const { overrides, get } = useSiteImages();
  useEffect(() => {
    const url = get('public/logo-ais.webp') || get('logo-ais.webp');
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
      if (typeof window !== "undefined" && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 100);
  }, [pathname]);

  return null;
}

// Komponen LazySection dengan IntersectionObserver untuk memecah Long Tasks & Forced Reflow.
// Section di bawah fold hanya diunduh & diinisialisasi saat mendekati viewport.
function LazySection({ children, minHeight = "400px" }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView ? (
        <Suspense fallback={<div className="py-16 text-center text-gray-400">Memuat...</div>}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
}

// Komponen Halaman Utama (Landing Page)
function LandingPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#f3f4f6] font-sans">
      <Hero />
      <LazySection minHeight="600px">
        <Tentang />
      </LazySection>
      <LazySection minHeight="600px">
        <VisiMisiNilai />
      </LazySection>
      <LazySection minHeight="500px">
        <Pengurus />
      </LazySection>
      <LazySection minHeight="500px">
        <ProgramSementara />
      </LazySection>
      <LazySection minHeight="600px">
        <Fasilitas />
      </LazySection>
      <LazySection minHeight="500px">
        <Berita />
      </LazySection>
      <LazySection minHeight="600px">
        <Galeri />
      </LazySection>
      <LazySection minHeight="500px">
        <Alumni />
      </LazySection>
    </main>
  );
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <LazySection minHeight="250px">
        <Footer />
      </LazySection>
    </>
  );
}

export default function App() {
  useEffect(() => {
    // Nonaktifkan smooth scroll di mobile agar performa scroll native 60fps & TBT 0ms
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    let isCancelled = false;
    let rafId;

    import('lenis').then(({ default: Lenis }) => {
      if (isCancelled) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
      });

      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      isCancelled = true;
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Router>
      <DynamicFavicon />
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white/50 text-sm">Memuat...</div>}>
        <Routes>
          {/* Main Site Routes with Navbar & Footer */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/pengurus" element={<MainLayout><PengurusFull /></MainLayout>} />
          <Route path="/berita" element={<MainLayout><BeritaDetail /></MainLayout>} />
          <Route path="/berita/:id" element={<MainLayout><PilihBerita /></MainLayout>} />

          {/* OPREC Route without Navbar & Footer */}
          <Route path="/oprec" element={<FormOprec />} />

          {/* Admin Routes (Dilindungi AuthProvider) */}
          <Route
            path="/admin/*"
            element={
              <AuthProvider>
                <Routes>
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
                </Routes>
              </AuthProvider>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
