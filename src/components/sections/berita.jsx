import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBerita } from '../../utils/berita';
import { toExcerpt } from '../../utils/format';

const LATEST_COUNT = 12;

function BeritaSkeleton() {
    return (
        <div className="flex gap-5 md:gap-6 overflow-hidden pb-12 pt-4 lg:pt-0">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[250px] md:w-[280px] flex flex-col gap-4">
                    <div className="w-full h-[180px] md:h-[200px] rounded-[24px] md:rounded-[28px] bg-gray-200 animate-pulse" />
                    <div className="px-2 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Berita() {
    const scrollRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await fetchBerita();
                if (active) setItems(data.slice(0, LATEST_COUNT));
            } catch (err) {
                console.error('Gagal memuat berita:', err);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 340;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Sembunyikan section bila belum ada berita (kecuali sedang memuat).
    if (!loading && items.length === 0) return null;

    return (
        <section id="berita" className="w-full py-16 md:py-24 bg-white overflow-hidden">
            <div className="w-full flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10 pl-6 md:pl-12 lg:pl-12 xl:pl-12">

                {/* 1. CARD HEADER (Warna Orange) */}
                <div className="shrink-0 flex lg:block">
                    <div className="relative w-[94%] md:w-[95%] lg:w-[280px] bg-[#f97316] rounded-[32px] p-6 md:p-8 pb-20 md:pb-24 text-white flex flex-col h-fit">
                        <h2 className="text-4xl font-bold mb-3">Berita</h2>
                        <p className="text-white/90 text-sm font-medium leading-relaxed mb-6">
                            Telusuri kegiatan asrama dan informasi prestasi.
                        </p>
                        <Link
                            to="/berita"
                            className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
                        >
                            Selengkapnya
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mb-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </Link>

                        <div className="absolute bottom-0 right-0 bg-white rounded-tl-[28px] pl-4 pt-4 pb-2 pr-2 flex gap-2">
                            <div className="absolute right-0 -top-[19.5px] w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top left, transparent 20px, #ffffff 20.5px)' }}></div>
                            <div className="absolute -left-[19.5px] bottom-0 w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top left, transparent 20px, #ffffff 20.5px)' }}></div>
                            <button onClick={() => scroll('left')} aria-label="Geser kiri"
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button onClick={() => scroll('right')} aria-label="Geser kanan"
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. SCROLL CONTAINER BERITA */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <BeritaSkeleton />
                    ) : (
                        <div
                            ref={scrollRef}
                            className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-6 md:pr-12 lg:pr-[10vw] pb-12 pt-4 lg:pt-0"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {items.map((item) => (
                                <Link to={`/berita/${item.id}`} key={item.id} className="shrink-0 w-[250px] md:w-[280px] snap-start flex flex-col gap-3 md:gap-4 cursor-pointer group">
                                    <div className="relative w-full h-[180px] md:h-[200px] rounded-[24px] md:rounded-[28px] overflow-hidden bg-gray-100">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200" />
                                        )}

                                        <div className="absolute bottom-0 left-0 bg-white px-5 pt-2 pb-2 rounded-tr-[24px]">
                                            <div className="absolute left-0 -top-[19.5px] w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top right, transparent 20px, #ffffff 20.5px)' }}></div>
                                            <div className="absolute -right-[19.5px] bottom-0 w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top right, transparent 20px, #ffffff 20.5px)' }}></div>
                                            <span className="relative z-10 text-[13px] font-bold text-gray-800">{item.dateLabel}</span>
                                        </div>
                                    </div>

                                    <div className="px-1 md:px-2 relative mt-2">
                                        <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full mb-2">
                                            {item.kategori}
                                        </span>
                                        <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1.5 md:mb-2 leading-snug line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-[13px] md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                                            {toExcerpt(item.content)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
