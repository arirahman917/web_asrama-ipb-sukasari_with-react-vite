import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// Import Assets (Sesuaikan path folder assets kamu)
import gedungPoster from "../../assets/img/fasilitas/gedung.jpg";
import logoAis from "../../assets/img/logo-ais.png";

export default function Hero() {
  const comp = useRef(null); // Ref untuk scope GSAP
  const videoRef = useRef(null);
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const titleLinesRef = useRef([]); // Array ref untuk stagger text
  const descRef = useRef(null);

  useLayoutEffect(() => {
    // Memasukkan array ref untuk title lines
    const titleLines = titleLinesRef.current;

    let ctx = gsap.context(() => {
      const tlHero = gsap.timeline({
        onComplete: () => {
          // Jika kamu pakai Lenis, aktifkan di sini
          if (window.lenis) window.lenis.start();
        },
      });

      // Pastikan background mulai dari hitam sempurna
      gsap.set(loaderRef.current, { backgroundColor: "#000000" });

      tlHero
        // 1. Animasi Loader
        // Munculkan video dengan cepat di awal (0s)
        .to(logoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        }, 0)
        // Ubah background loader jadi putih persis saat animasi video meledak jadi putih
        .to(loaderRef.current, { backgroundColor: "#ffffff", duration: 0.4 }, 4.25)
        // Setelah video selesai (durasi total ~6 detik), hilangkan logo dan loader
        .to(logoRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut"
        }, 6.0)
        .to(loaderRef.current, {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut"
        }, "-=0.4")

        // 2. Animasi Hero (Mulai saat loader menghilang)
        .to(videoRef.current, {
          scale: 1,
          duration: 2.5,
          ease: "power2.out"
        }, "-=1.0")

        // Target #navbar (Global selector karena biasanya navbar di luar file ini)
        .fromTo("#navbar",
          { y: -20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" },
          "-=1.5"
        )

        // Animasi Teks (Masking effect)
        .fromTo(titleLines,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" },
          "-=1.2"
        )
        .fromTo(descRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.8"
        );
    }, comp); // Scope ke kontainer ini saja

    return () => ctx.revert(); // Cleanup saat komponen unmount
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
        </div>
      </section>
    </div>
  );
}