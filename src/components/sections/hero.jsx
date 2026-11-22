import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ============================================================
// KONFIGURASI BATCH OPREC
// Edit array ini untuk menambah/mengubah batch dan timeline-nya
// Format tanggal: new Date("YYYY-MM-DDTHH:mm:ss+07:00")
// ============================================================
export const OPREC_BATCHES = [
  {
    name: "BATCH 1",
    start: new Date("2026-05-25T00:00:00+07:00"),
    end: new Date("2026-05-29T23:59:59+07:00"),
  },
];

function addMonths(date, months) {
  const result = new Date(date);
  const targetDay = result.getDate();
  result.setMonth(result.getMonth() + months);
  if (result.getDate() !== targetDay) {
    result.setDate(0);
  }
  return result;
}

function msToCountdown(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { days: d, hours: h, minutes: m, seconds: s };
}

function calculateOprecStatus() {
  if (OPREC_BATCHES.length === 0) {
    return { status: "hidden", countdown: {}, label: "", batchName: "" };
  }

  const now = new Date();
  const sortedByStart = [...OPREC_BATCHES].sort((a, b) => a.start - b.start);
  const sortedByEnd = [...OPREC_BATCHES].sort((a, b) => b.end - a.end);
  const windowStart = addMonths(sortedByStart[0].start, -1);
  const windowEnd = addMonths(sortedByEnd[0].end, 1);

  if (now < windowStart || now > windowEnd) {
    return { status: "hidden", countdown: {}, label: "", batchName: "" };
  }

  // Check active batch
  for (const batch of OPREC_BATCHES) {
    if (now >= batch.start && now <= batch.end) {
      const diff = batch.end - now;
      return {
        status: "open",
        batchName: batch.name,
        label: `${batch.name} ditutup dalam`,
        countdown: msToCountdown(diff),
      };
    }
  }
  // Check next upcoming batch
  const upcoming = OPREC_BATCHES.filter((b) => now < b.start).sort((a, b) => a.start - b.start);
  if (upcoming.length > 0) {
    const next = upcoming[0];
    const diff = next.start - now;
    return {
      status: "upcoming",
      batchName: next.name,
      label: `${next.name} dibuka dalam`,
      countdown: msToCountdown(diff),
    };
  }
  // All batches have passed
  return { status: "closed", countdown: {}, label: "Pendaftaran Telah Ditutup", batchName: "" };
}

function useOprecCountdown() {
  const [state, setState] = useState(calculateOprecStatus);

  useEffect(() => {
    const tick = () => {
      setState(calculateOprecStatus());
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
}

// Import Assets
import { useSiteImages } from "../../utils/images";

// ============================================================
// COUNTDOWN DISPLAY COMPONENT
// ============================================================
function CountdownDisplay() {
  const oprec = useOprecCountdown();
  if (oprec.status === "loading" || oprec.status === "hidden") return null;

  const { countdown } = oprec;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="mt-6 flex flex-col items-center">
      {/* Countdown boxes */}
      {oprec.status !== "closed" && (
        <div className="flex gap-2 mb-4">
          {[
            { val: pad(countdown.days), label: "Hari" },
            { val: pad(countdown.hours), label: "Jam" },
            { val: pad(countdown.minutes), label: "Menit" },
            { val: pad(countdown.seconds), label: "Detik" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center">
                <span className="text-base md:text-lg font-bold text-white tabular-nums">{item.val}</span>
              </div>
              <span className="text-[9px] md:text-[10px] text-gray-400 mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Button */}
      {oprec.status === "open" ? (
        <Link
          to="/oprec"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Daftar Sekarang
        </Link>
      ) : oprec.status === "upcoming" ? (
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-orange-300 text-sm font-medium rounded-full border border-white/20 cursor-default">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Menunggu Pembukaan
        </div>
      ) : (
        <button
          type="button"
          disabled
          aria-label="Pendaftaran asrama saat ini sedang ditutup"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border-2 border-white/60 text-sm font-semibold rounded-full cursor-not-allowed shadow-md backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          Pendaftaran
        </button>
      )}
    </div>
  );
}

export default function Hero() {
  const comp = useRef(null);
  const { get } = useSiteImages();
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState("");

  const [isFirstVisit] = useState(() => !sessionStorage.getItem("hasLoaderShown"));
  const [loaderVisible, setLoaderVisible] = useState(isFirstVisit);
  const [loaderFading, setLoaderFading] = useState(false);

  useEffect(() => {
    if (isFirstVisit) {
      sessionStorage.setItem("hasLoaderShown", "true");
      // Transisi loader cepat (400ms tampil, 300ms fade-out) agar tidak memblokir LCP Lighthouse
      const fadeTimer = setTimeout(() => setLoaderFading(true), 400);
      const hideTimer = setTimeout(() => {
        setLoaderVisible(false);
        if (window.lenis) window.lenis.start();
      }, 700);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isFirstVisit]);

  // Lazy load video hero saat hero masuk / ada di viewport
  useEffect(() => {
    if (!comp.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const raw = get("public/hero-ori.mp4");
          if (raw) setVideoSrc(raw);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(comp.current);
    return () => observer.disconnect();
  }, [get]);

  return (
    <div ref={comp} id="hero-section">
      {/* LOADER SCREEN - Menggunakan CSS Hardware-Accelerated tanpa membebani Main Thread JS */}
      {loaderVisible && (
        <div
          id="loader"
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-300 pointer-events-none ${
            loaderFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div 
            className="relative z-10 w-full max-w-xl md:max-w-3xl flex justify-center items-center"
          >
            <video 
              src={get("public/motion-logo-ais.mp4")}
              autoPlay 
              muted 
              playsInline
              preload="none"
              className="w-full h-auto object-contain pointer-events-none" 
            >
              <track kind="captions" src="data:text/vtt;charset=utf-8,WEBVTT" label="No audio" default />
            </video>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video dengan poster & lazy preload */}
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 w-full h-full object-cover object-[center_40%]"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={get("fasilitas/gedung.webp")}
        >
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
          <track kind="captions" src="data:text/vtt;charset=utf-8,WEBVTT" label="No audio" default />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/90"></div>

        {/* Content - Elemen LCP langsung terlihat tanpa penundaan JS untuk skor LCP < 1.5s */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 md:px-8 w-full max-w-4xl mt-9 md:mt-13">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] drop-shadow-xl mb-4 md:mb-6">
            <span className="block overflow-hidden">
              <span className="title-line block transform translate-y-0 transition-transform duration-500">
                Asrama IPB
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="title-line block transform translate-y-0 transition-transform duration-500">
                Sukasari
              </span>
            </span>
          </h1>

          <p
            className="text-sm sm:text-base md:text-sm max-w-[280px] xs:max-w-[320px] md:max-w-[420px] font-normal text-white"
          >
            Rumah yang nyaman untuk belajar, bertumbuh,
            dan meraih prestasi bersama.
          </p>

          {/* Countdown Timer OPREC */}
          <CountdownDisplay />
        </div>
      </section>
    </div>
  );
}
