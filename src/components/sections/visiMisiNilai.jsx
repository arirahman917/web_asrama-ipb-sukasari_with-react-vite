import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import gambar
import imgVisi from '../../assets/img/program/visi.webp';
import imgMisi from '../../assets/img/program/upgrading.webp'; // Dulu di Laravel pakai upgrading.jpg
import imgNilai from '../../assets/img/program/nilai.webp';

gsap.registerPlugin(ScrollTrigger);

export default function VisiMisiNilai() {
    const containerRef = useRef();

    useGSAP(() => {
        // --- LOGIKA ANIMASI DARI animations.js ---
        // Catatan: Karena '.absolute' itu bawaan tailwind dan sangat banyak di komponen ini,
        // lebih aman kita set transform origin pada container utamanya atau via CSS.
        // Di sini kita abaikan gsap.set(".absolute", { transformOrigin... }) karena
        // kurang spesifik.

        gsap.set("#card-visi", { top: "50%", yPercent: -50, opacity: 1 });
        gsap.set("#card-misi", { top: "50%", yPercent: 200, opacity: 0 });
        gsap.set("#card-nilai", { top: "50%", yPercent: 200, opacity: 0 });

        const tlVisiMisi = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%",
                pin: true,
                scrub: 1
            }
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

    }, { scope: containerRef, dependencies: [] });

    return (
        <section ref={containerRef} id="pin-section visiMisiNilai" className="w-full h-screen flex items-center justify-center bg-white relative z-10">
            <div className="relative w-[89%] max-w-[1450px] h-[90vh]">

                <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl pointer-events-none">
                    <div id="bg-visi" className="absolute inset-0 bg-cover bg-center md:bg-bottom" style={{ backgroundImage: `url(${imgVisi})` }}></div>
                    <div id="bg-misi" className="absolute inset-0 bg-cover bg-center md:bg-bottom opacity-0" style={{ backgroundImage: `url(${imgMisi})` }}></div>
                    <div id="bg-nilai" className="absolute inset-0 bg-cover bg-[center_60%] md:bg-[center_60%] opacity-0" style={{ backgroundImage: `url(${imgNilai})` }}></div>

                    {/* Pastikan grad-navy dan grad-orange sudah ada di index.css kamu */}
                    <div id="overlay-visi" className="absolute inset-0 grad-navy opacity-100"></div>
                    <div id="overlay-misi" className="absolute inset-0 grad-orange opacity-0"></div>
                    <div id="overlay-nilai" className="absolute inset-0 grad-navy opacity-0"></div>
                </div>

                <div className="absolute inset-0 z-20 w-full h-full flex flex-col md:flex-row px-4 md:px-10 lg:px-20 pt-8 md:pt-0">

                    <div className="w-full md:w-1/2 flex items-start md:items-center relative h-[25%] md:h-full justify-center md:justify-start">
                        <div className="absolute left-0 flex-col gap-2 z-30 hidden md:flex">
                            <div id="dot-visi" className="w-2 h-2 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]" style={{ opacity: 1 }}></div>
                            <div id="dot-misi" className="w-2 h-2 bg-white rounded-full opacity-30"></div>
                            <div id="dot-nilai" className="w-2 h-2 bg-white rounded-full opacity-30"></div>
                        </div>

                        <div className="relative w-full md:ml-10 h-[60px] md:h-[100px]">
                            <div id="title-visi" className="absolute inset-0 flex items-center justify-center md:justify-start" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                <h2 className="text-4xl md:text-6xl lg:text-6xl font-bold text-white tracking-wide">VISI</h2>
                            </div>
                            <div id="title-misi" className="absolute inset-0 flex items-center justify-center md:justify-start" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                                <h2 className="text-4xl md:text-6xl lg:text-6xl font-bold text-white tracking-wide">MISI</h2>
                            </div>
                            <div id="title-nilai" className="absolute inset-0 flex items-center justify-center md:justify-start" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                                <h2 className="text-4xl md:text-6xl lg:text-6xl font-bold text-white tracking-wide">NILAI</h2>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 h-[75%] md:h-full relative z-30">
                        <div id="card-visi" className="absolute left-0 right-0 mx-auto w-[90%] md:w-full max-w-xs md:max-w-sm bg-[#0f172a]/50 backdrop-blur-xl rounded-xl md:rounded-2xl p-7 md:p-7 shadow-2xl">
                            <p className="text-white text-[14px] md:text-[12px] lg:text-[14px] leading-relaxed font-light text-center md:text-left">
                                Menjadi asrama yang mendukung terciptanya lingkungan hunian yang aman, nyaman, dan kondusif bagi pengembangan akademik serta karakter mahasiswa.
                            </p>
                        </div>
                        <div id="card-misi" className="absolute left-0 right-0 mx-auto w-[90%] md:w-full max-w-xs md:max-w-sm bg-[#ea580c]/50 backdrop-blur-xl rounded-xl md:rounded-2xl p-7 md:p-7 shadow-2xl">
                            <ul className="text-white text-[14px] md:text-[12px] lg:text-[14px] leading-relaxed font-light list-disc pl-4 space-y-2 md:space-y-3 marker:text-white/70">
                                <li>Menyediakan lingkungan hunian yang aman, tertib, dan nyaman bagi mahasiswa.</li>
                                <li>Mendukung proses pembelajaran dan pengembangan karakter mahasiswa.</li>
                                <li>Mendorong terciptanya kehidupan asrama yang disiplin, inklusif, dan berbudaya.</li>
                            </ul>
                        </div>
                        <div id="card-nilai" className="absolute left-0 right-0 mx-auto w-[90%] md:w-full max-w-xs md:max-w-sm bg-[#0f172a]/50 backdrop-blur-xl rounded-xl md:rounded-2xl px-7 md:px-7 py-8 md:py-8 shadow-2xl">
                            <div className="grid grid-cols-2 gap-8 md:gap-6">
                                {/* Card Nilai 1 */}
                                <div className="flex flex-col items-center text-center space-y-1.5 md:space-y-2">
                                    <div className="w-10 h-10 md:w-10 md:h-10 mb-1 md:mb-0 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-5 md:h-5" viewBox="0 0 24 24">
                                            <path fill="#fff" d="M6 16q-.825 0-1.412-.587T4 14t.588-1.412T6 12t1.413.588T8 14t-.587 1.413T6 16m12 0q-.825 0-1.412-.587T16 14t.588-1.412T18 12t1.413.588T20 14t-.587 1.413T18 16m-6-1q-1.05 0-1.775-.725T9.5 12.5t.725-1.775T12 10t1.775.725t.725 1.775t-.725 1.775T12 15m-4.9 6q.175-.875.625-1.588t1.1-1.262t1.463-.85T12 17t1.713.3t1.462.85t1.1 1.263T16.9 21zm-3.825 0q-.525 0-.9-.35T2 19.85q0-.975 1.188-1.913T5.925 17q.425 0 .825.075t.775.225q-.75.725-1.25 1.663T5.6 21zM18.4 21q-.175-1.1-.675-2.037t-1.25-1.663q.375-.15.763-.225T18.05 17q1.55 0 2.75.938T22 19.85q0 .475-.375.813T20.7 21zM1.6 11.2q-.25-.35-.2-.75t.4-.65l8.975-6.875Q11.325 2.5 12 2.5t1.225.425L16 5.05V4.5q0-.625.438-1.062T17.5 3t1.063.438T19 4.5v2.85l3.2 2.45q.325.25.388.65t-.188.75t-.65.4t-.75-.2l-9-6.875L3 11.4q-.35.25-.75.2t-.65-.4" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[14px] md:text-[12px] lg:text-[14px] md:text-xs">Kekeluargaan</span>
                                </div>
                                {/* Card Nilai 2 */}
                                <div className="flex flex-col items-center text-center space-y-1.5 md:space-y-2">
                                    <div className="w-10 h-10  md:w-10 md:h-10 mb-1 md:mb-0 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-5 md:h-5" viewBox="0 0 24 24">
                                            <path fill="#fff" d="M24 6.84V5.39a2.2 2.2 0 0 0-2.2-2.2h-2.69l-.27-1.64A1.85 1.85 0 0 0 17 0h-3.63a1.85 1.85 0 0 0-1.83 1.55l-.27 1.64H8.58a2.2 2.2 0 0 0-2.2 2.2v1.45Zm-11-5a.35.35 0 0 1 .35-.29H17a.35.35 0 0 1 .35.29l.23 1.4h-4.8Zm2.94 6.5V9.8a.75.75 0 0 1-1.5 0V8.34H6.38v4.76a2.2 2.2 0 0 0 2.2 2.2H21.8a2.2 2.2 0 0 0 2.2-2.2V8.34Zm1.25 10.55l-3 1A.2.2 0 0 0 14 20a1.72 1.72 0 0 1-1.57 1H9a.43.43 0 0 1 0-.86h3.44a.86.86 0 0 0 0-1.72h-3A6.1 6.1 0 0 0 6 17.17H4.25a3.46 3.46 0 0 0-1.54.37L.12 18.83A.23.23 0 0 0 0 19v4.63a.21.21 0 0 0 .11.19a.22.22 0 0 0 .22 0l2.76-1.72a.88.88 0 0 1 .74-.1c8.56 2.89 5.7 2.9 15.35-2a.44.44 0 0 0 .08-.74a2.17 2.17 0 0 0-2.07-.37" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[14px] md:text-[12px] lg:text-[14px] md:text-xs">Tanggung Jawab</span>
                                </div>
                                {/* Card Nilai 3 */}
                                <div className="flex flex-col items-center text-center space-y-1.5 md:space-y-2">
                                    <div className="w-10 h-10  md:w-10 md:h-10 mb-1 md:mb-0 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-5 md:h-5" viewBox="0 0 640 640">
                                            <path fill="#fff" d="M300.9 149.2L184.3 278.8c-4.6 5.1-4.4 13 .5 17.9c30.5 30.5 80 30.5 110.5 0l31.8-31.8c4.2-4.2 9.5-6.5 14.9-6.9c6.8-.6 13.8 1.7 19 6.9L537.6 440l70.4-56V96l-112 64l-23.8-15.9a96.2 96.2 0 0 0-53.3-16.1h-70.4c-1.1 0-2.3 0-3.4.1c-16.9.9-32.8 8.5-44.2 21.1m-152.3 97.5L255.4 128h-39.6c-25.5 0-49.9 10.1-67.9 28.1L144 160L32 96v288l156.4 130.3c23 19.2 52 29.7 81.9 29.7H286l-7-7c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l41 41h9c19.1 0 37.8-4.3 54.8-12.3L391 505c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l32 32l17.5-17.5c8.9-8.9 11.5-21.8 7.6-33.1L344.1 315.7l-14.9 14.9c-49.3 49.3-129.1 49.3-178.4 0c-23-23-23.9-59.9-2.2-84z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[14px] md:text-[12px] lg:text-[14px] md:text-xs">Integritas</span>
                                </div>
                                {/* Card Nilai 4 */}
                                <div className="flex flex-col items-center text-center space-y-1.5 md:space-y-2">
                                    <div className="w-10 h-10  md:w-10 md:h-10 mb-1 md:mb-0 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-5 md:h-5" viewBox="0 0 48 48">
                                            <path fill="#fff" fillRule="evenodd" d="M7.565 4.857C10.071 4.675 13.826 4.5 19 4.5s8.93.175 11.435.357c1.491.109 2.6 1.217 2.708 2.708c.182 2.506.357 6.261.357 11.435s-.175 8.93-.357 11.435c-.109 1.491-1.217 2.6-2.709 2.708c-2.505.182-6.26.357-11.434.357s-8.93-.175-11.435-.357c-1.491-.109-2.6-1.217-2.708-2.709C4.675 27.93 4.5 24.175 4.5 19s.175-8.93.357-11.435c.109-1.491 1.217-2.6 2.708-2.708M19 .5C13.736.5 9.884.678 7.275.868C3.803 1.12 1.12 3.803.868 7.275C.678 9.884.5 13.736.5 19s.178 9.116.368 11.725c.252 3.472 2.935 6.155 6.407 6.407c2.609.19 6.461.368 11.725.368s9.116-.178 11.725-.368c3.472-.252 6.155-2.935 6.407-6.407c.19-2.609.368-6.461.368-11.725s-.178-9.116-.368-11.725C36.88 3.803 34.197 1.12 30.725.868C28.116.678 24.264.5 19 .5m10 10q.936 0 1.814.007c.056 1.165.105 2.496.138 4.002A219 219 0 0 0 29 14.5c-5.174 0-8.93.175-11.434.358c-1.492.108-2.6 1.216-2.708 2.707c-.183 2.506-.358 6.261-.358 11.435q0 1.012.009 1.952a155 155 0 0 1-4.002-.138Q10.5 29.936 10.5 29c0-5.264.178-9.116.368-11.725c.252-3.472 2.935-6.155 6.407-6.407c2.609-.19 6.461-.368 11.725-.368M10.868 40.725l-.06-.888a171 171 0 0 0 4.394.13a216 216 0 0 0 7.591 0c3.583-.06 6.367-.202 8.427-.352c4.538-.33 8.066-3.858 8.396-8.395c.199-2.738.384-6.754.384-12.22q-.001-2.248-.038-4.176h-.001q-.045-2.221-.124-4.017q.465.03.888.061c3.472.252 6.155 2.935 6.407 6.407c.19 2.609.368 6.461.368 11.725s-.178 9.116-.368 11.725c-.252 3.472-2.935 6.155-6.407 6.407c-2.609.19-6.461.368-11.725.368s-9.116-.178-11.725-.368c-3.472-.252-6.155-2.935-6.407-6.407" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[14px] md:text-[12px] lg:text-[14px] md:text-xs">Transparan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}