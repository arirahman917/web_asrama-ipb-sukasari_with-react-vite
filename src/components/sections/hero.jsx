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
  // Tambahkan batch baru di sini:
  // {
  //   name: "BATCH 2",
  //   start: new Date("2026-06-01T00:00:00+07:00"),
  //   end: new Date("2026-06-05T23:59:59+07:00"),
  // },
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
  // Hitung status awal secara sinkron untuk mencegah Cumulative Layout Shift (CLS)
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
      {/* Label */}

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
              <span className="text-xs text-gray-300 mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Button CTA OPREC (Status: Ditutup) */}
      {/* KODE FORMULIR AKTIF ASLI (Uncomment saat pendaftaran dibuka kembali):
      {oprec.status === "open" ? (
        <Link to="/oprec"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95">
          Daftar Sekarang
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Link>
      ) : oprec.status === "upcoming" ? (
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-300 text-sm font-medium rounded-full border border-white/20 cursor-default">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Menunggu Pembukaan
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-6 py-3 text-red-300 text-sm font-medium cursor-default">
          Pendaftaran Ditutup
        </div>
      )}
      */}
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-400 border border-white/15 text-sm font-medium rounded-full cursor-not-allowed shadow-none"
      >
        <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
        Pendaftaran Ditutup
      </button>
    </div>
  );
}

export default function Hero() {
  const comp = useRef(null); // Ref untuk scope GSAP
  const { get } = useSiteImages();
  const videoRef = useRef(null);
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const titleLinesRef = useRef([]); // Array ref untuk stagger text
  const descRef = useRef(null);
  const [isLoaderDone, setIsLoaderDone] = useState(false);

  const [isFirstVisit] = useState(() => !sessionStorage.getItem("hasLoaderShown"));

  useEffect(() => {
    if (isFirstVisit) {
      sessionStorage.setItem("hasLoaderShown", "true");
    }
  }, [isFirstVisit]);

  useEffect(() => {
    // Pastikan scroll aktif dan loader disembunyikan
    if (loaderRef.current) {
      loaderRef.current.style.display = "none";
    }
    if (window.lenis) window.lenis.start();
    document.body.style.overflow = "auto";

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    // Pada mobile, jangan load GSAP untuk menjaga TBT < 50ms dan LCP sub-detik
    if (isMobile) return;

    let ctx;
    let isCancelled = false;

    import("gsap").then(({ default: gsap }) => {
      if (isCancelled || !comp.current) return;
      ctx = gsap.context(() => {
        const tlHero = gsap.timeline();

        if (videoRef.current) {
          tlHero.fromTo(videoRef.current, { scale: 1.05 }, {
            scale: 1,
            duration: 1.6,
            ease: "power2.out"
          }, 0);
        }

        tlHero
          .fromTo("#navbar",
            { y: -20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
            0.1
          )
          .fromTo(titleLinesRef.current,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power4.out" },
            0.15
          )
          .fromTo(descRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
            0.3
          );
      }, comp);
    });

    return () => {
      isCancelled = true;
      if (ctx) ctx.revert();
      if (window.lenis) window.lenis.start();
    };
  }, []);

  return (
    <div ref={comp} id="hero-section">
      {/* LOADER SCREEN (Nonaktif agar LCP & FCP instan) */}
      <div
        ref={loaderRef}
        id="loader"
        className="hidden pointer-events-none"
        aria-hidden="true"
      />

      {/* HERO SECTION */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image (LCP Element Teroptimasi & Preloaded) */}
        <img
          ref={videoRef}
          src={get("fasilitas/gedung.webp")}
          alt="Gedung Asrama IPB Sukasari"
          width="1920"
          height="1080"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 z-0 w-full h-full object-cover object-[center_40%] will-change-transform"
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/90"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 md:px-8 w-full max-w-4xl mt-9 md:mt-13">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] drop-shadow-xl mb-4 md:mb-6">
            <span className="block overflow-hidden">
              <span
                ref={(el) => (titleLinesRef.current[0] = el)}
                className="title-line block"
              >
                Asrama IPB
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={(el) => (titleLinesRef.current[1] = el)}
                className="title-line block"
              >
                Sukasari
              </span>
            </span>
          </h1>

          <p
            ref={descRef}
            className="text-sm sm:text-base md:text-sm max-w-[280px] xs:max-w-[320px] md:max-w-[420px] font-normal text-white/90"
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