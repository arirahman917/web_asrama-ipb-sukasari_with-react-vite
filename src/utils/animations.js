export function initAnimations() {
    // Pastikan elemen loader ada sebelum menjalankan animasi hero
    if (document.getElementById("loader")) {
        // ==========================================
        // LOADER & HERO TIMELINE
        // ==========================================
        const tlHero = gsap.timeline({ onComplete: () => { if(typeof lenis !== 'undefined') lenis.start(); } });
        tlHero.to("#loader-logo", { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" })
            .to({}, { duration: 0.6 })
            .to("#loader-logo", { y: -30, opacity: 0, duration: 0.8, ease: "power2.inOut" })
            .to("#loader", { autoAlpha: 0, duration: 1, ease: "power2.inOut" }, "-=0.4")
            .to("#hero-bg", { scale: 1, duration: 2.5, ease: "power2.out" }, "-=1.0")
            .fromTo("#navbar", { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=1.5")
            .fromTo(".title-line", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }, "-=1.2")
            .fromTo("#hero-desc", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.8")
            .to("#hero-btn", { opacity: 1, y: -10, duration: 0.8, ease: "power3.out" }, "-=0.4");
    }

    if (document.getElementById("about-section")) {
        // ==========================================
        // ABOUT SECTION TIMELINE (RESPONSIVE)
        // ==========================================
        
        // Teks dan Kartu disiapkan (berlaku umum)
        gsap.set("#about-card", { width: "100%", height: "100%", borderRadius: "0px" });
        gsap.set(".about-text", { y: 30, opacity: 0 });

        // Gunakan MatchMedia agar responsif saat browser di-resize
        let mm = gsap.matchMedia();

        // --------------------------------------------------
        // 1. ANIMASI KHUSUS DESKTOP (Layar >= 1024px)
        // --------------------------------------------------
        mm.add("(min-width: 1024px)", () => {
            // Panel biru sembunyi di KANAN
            gsap.set("#blue-panel", { xPercent: 100, yPercent: 0 });

            let tlDesktop = gsap.timeline({
                scrollTrigger: { trigger: "#about-section", start: "top top", end: "+=1200", pin: true, scrub: 1 }
            });

            tlDesktop.to("#about-card", { width: "85%", height: "80%", borderRadius: "32px", ease: "power1.inOut", duration: 2 })
                    // Panel meluncur ke KIRI
                    .to("#blue-panel", { xPercent: 0, ease: "power2.out", duration: 1.5 }, "-=1.0")
                    .to(".about-text", { y: 0, opacity: 1, stagger: 0.2, ease: "power3.out", duration: 1 }, "-=0.5");
        });

        // --------------------------------------------------
        // 2. ANIMASI KHUSUS MOBILE & TABLET (Layar < 1024px)
        // --------------------------------------------------
        mm.add("(max-width: 1023px)", () => {
            // Panel biru sembunyi di BAWAH, dan gambar di-set full
            gsap.set("#blue-panel", { yPercent: 100, xPercent: 0 });
            gsap.set("#mobile-img-container", { height: "100%" }); 

            let tlMobile = gsap.timeline({
                scrollTrigger: { trigger: "#about-section", start: "top top", end: "+=1200", pin: true, scrub: 1 }
            });

            tlMobile.to("#about-card", { width: "90%", height: "85%", borderRadius: "28px", ease: "power1.inOut", duration: 2 })
                    // Panel meluncur ke ATAS
                    .to("#blue-panel", { yPercent: 0, ease: "power2.out", duration: 1.5 }, "-=1.0")
                    
                    // Wadah gambar mengecil
                    .to("#mobile-img-container", { height: "40%", ease: "power2.out", duration: 1.5 }, "-=1.5")
                    
                    // TAMBAHAN: Geser titik fokus gambar ke atas (efek kamera naik)
                    // Angka 25% adalah sumbu Y. Semakin besar angkanya (misal 30% atau 40%), gambar akan semakin ditarik ke atas.
                    .to("#mobile-img", { objectPosition: "55% 100%", ease: "power2.out", duration: 1.5 }, "-=1.5")
                    
                    .to(".about-text", { y: 0, opacity: 1, stagger: 0.2, ease: "power3.out", duration: 1 }, "-=0.5");
        });
    }

    if (document.getElementById("pin-section")) {
        // ==========================================
        // VISI MISI TIMELINE
        // ==========================================
        gsap.set(".absolute", { transformOrigin: "center center" });
        gsap.set("#card-visi", { top: "50%", yPercent: -50, opacity: 1 });
        gsap.set("#card-misi", { top: "50%", yPercent: 200, opacity: 0 }); 
        gsap.set("#card-nilai", { top: "50%", yPercent: 200, opacity: 0 }); 

        const tlVisiMisi = gsap.timeline({
            scrollTrigger: { trigger: "#pin-section", start: "top top", end: "+=300%", pin: true, scrub: 1 }
        });

        tlVisiMisi.to("#card-visi", { yPercent: -250, opacity: 0, duration: 1 }, 0)
            .to("#title-visi", { y: -40, opacity: 0, duration: 1 }, 0)
            .to("#title-misi", { y: 0, opacity: 1, duration: 1 }, 0.2)
            .to("#dot-visi", { opacity: 0.3, boxShadow: "none", duration: 1 }, 0)
            .to("#dot-misi", { opacity: 1, boxShadow: "0 0 8px rgba(255,255,255,0.8)", duration: 1 }, 0.2)
            .to("#bg-misi", { opacity: 1, duration: 1 }, 0)
            .to("#overlay-visi", { opacity: 0, duration: 1 }, 0) 
            .to("#overlay-misi", { opacity: 1, duration: 1 }, 0)
            .to("#card-misi", { yPercent: -50, opacity: 1, duration: 1 }, 0.2)
            .to({}, { duration: 0.6 }); 

        tlVisiMisi.to("#card-misi", { yPercent: -250, opacity: 0, duration: 1 })
            .to("#title-misi", { y: -40, opacity: 0, duration: 1 }, "<")
            .to("#title-nilai", { y: 0, opacity: 1, duration: 1 }, "<0.2")
            .to("#dot-misi", { opacity: 0.3, boxShadow: "none", duration: 1 }, "<")
            .to("#dot-nilai", { opacity: 1, boxShadow: "0 0 8px rgba(255,255,255,0.8)", duration: 1 }, "<0.2")
            .to("#bg-nilai", { opacity: 1, duration: 1 }, "<")
            .to("#overlay-misi", { opacity: 0, duration: 1 }, "<") 
            .to("#overlay-nilai", { opacity: 1, duration: 1 }, "<")
            .to("#card-nilai", { yPercent: -50, opacity: 1, duration: 1 }, "<0.2")
            .to({}, { duration: 0.6 });
    }
}