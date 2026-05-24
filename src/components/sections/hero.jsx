import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

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

function useOprecCountdown() {
  const [state, setState] = useState({ status: "loading", countdown: {}, label: "", batchName: "" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Check active batch
      for (const batch of OPREC_BATCHES) {
        if (now >= batch.start && now <= batch.end) {
          const diff = batch.end - now;
          setState({
            status: "open",
            batchName: batch.name,
            label: `${batch.name} ditutup dalam`,
            countdown: msToCountdown(diff),
          });
          return;
        }
      }
      // Check next upcoming batch
      const upcoming = OPREC_BATCHES.filter((b) => now < b.start).sort((a, b) => a.start - b.start);
      if (upcoming.length > 0) {
        const next = upcoming[0];
        const diff = next.start - now;
        setState({
          status: "upcoming",
          batchName: next.name,
          label: `${next.name} dibuka dalam`,
          countdown: msToCountdown(diff),
        });
        return;
      }
      // All batches have passed
      setState({ status: "closed", countdown: {}, label: "Pendaftaran Telah Ditutup", batchName: "" });
    };

    const msToCountdown = (ms) => {
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      return { days: d, hours: h, minutes: m, seconds: s };
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
}

// Import Assets (Sesuaikan path folder assets kamu)
import gedungPoster from "../../assets/img/fasilitas/gedung.webp";
import logoAis from "../../assets/img/logo-ais.webp";

// ============================================================
// COUNTDOWN DISPLAY COMPONENT
// ============================================================
function CountdownDisplay() {
  const oprec = useOprecCountdown();
  if (oprec.status === "loading") return null;

  const { countdown } = oprec;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="mt-6 flex flex-col items-center">
      {/* Label */}
      <p className="text-xs uppercase tracking-[0.2em] text-orange-300 font-semibold mb-3">
        {oprec.status === "closed" ? "🔒 Pendaftaran Telah Ditutup" : `🔥 OPEN RECRUITMENT — ${oprec.label}`}
      </p>

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
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-300 text-sm font-medium rounded-full border border-red-500/20 cursor-default">
          🔒 Pendaftaran Ditutup
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const comp = useRef(null); // Ref untuk scope GSAP
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

  useLayoutEffect(() => {
    const titleLines = titleLinesRef.current;

    let ctx = gsap.context(() => {
      const tlHero = gsap.timeline({
        onComplete: () => {
          if (window.lenis) window.lenis.start();
          document.body.style.overflow = "auto";
        },
      });

      if (isFirstVisit) {
        // Hentikan scroll saat loader aktif
        if (window.lenis) window.lenis.stop();
        gsap.set(loaderRef.current, { backgroundColor: "#000000" });

        tlHero
          .to(logoRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0)
          .to(loaderRef.current, { backgroundColor: "#ffffff", duration: 0.4 }, 4.25)
          .to(logoRef.current, { y: -30, opacity: 0, duration: 0.8, ease: "power2.inOut" }, 6.0)
          .to(loaderRef.current, { autoAlpha: 0, duration: 1, ease: "power2.inOut" }, "-=0.4")
          
          .fromTo(videoRef.current, { scale: 1.1 }, {
            scale: 1,
            duration: 2.5,
            ease: "power2.out"
          }, "-=1.0");
      } else {
        // Jika bukan visit pertama, hilangkan loader dan jangan tahan scroll
        gsap.set(loaderRef.current, { display: "none" });
        if (window.lenis) window.lenis.start();
        
        tlHero.fromTo(videoRef.current, { scale: 1.1 }, {
          scale: 1,
          duration: 2.5,
          ease: "power2.out"
        }, 0);
      }

      tlHero
        .fromTo("#navbar",
          { y: -20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" },
          isFirstVisit ? "-=1.5" : 0.2
        )
        .fromTo(titleLines,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" },
          isFirstVisit ? "-=1.2" : 0.4
        )
        .fromTo(descRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          isFirstVisit ? "-=0.8" : 0.8
        );
    }, comp);

    return () => {
      ctx.revert();
      if (window.lenis) window.lenis.start();
    };
  }, []);

  return (
    <div ref={comp} id="hero">
      {/* LOADER SCREEN */}
      <div
        ref={loaderRef}
        id="loader"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      >
        <div 
          ref={logoRef} 
          className="relative z-10 w-full max-w-xl md:max-w-3xl lg:max-w-4xl opacity-0 scale-95 will-change-transform flex justify-center items-center"
        >
          <video 
            src="/motion-logo-ais.mp4"
            autoPlay 
            muted 
            playsInline
            className="w-full h-auto object-contain pointer-events-none" 
          />
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 w-full h-full object-cover object-[center_40%] will-change-transform"
          autoPlay
          loop
          muted
          playsInline
          poster={gedungPoster}
        >
          <source src="/hero-ori.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/90"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 md:px-8 w-full max-w-4xl mt-9 md:mt-13">
          <h1 className="text-5xl xs:text-5xl md:text-6xl lg:text-5xl font-bold text-white leading-[1.1] drop-shadow-xl mb-5 md:mb-6">
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
            className="text-[14px] xs:text-[16px] md:text-[14px] max-w-[290px] xs:max-w-[320px] md:max-w-[420px] font-normal"
          >
            Lebih dari hunian, Asrama IPB Sukasari adalah rumah untuk belajar, bertumbuh,
            dan meraih prestasi bersama.
          </p>

          {/* Countdown Timer OPREC */}
          <CountdownDisplay />
        </div>
      </section>
    </div>
  );
}