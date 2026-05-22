import React from 'react';
import { Link } from 'react-router-dom';

// Import gambar sesuai dengan struktur folder kamu
import imgBph from '../../assets/img/pengurus/bph/menteri.jpg';
import imgKepenghunian from '../../assets/img/pengurus/kepenghunian/menteri.jpg';
import imgLingpras from '../../assets/img/pengurus/lingpras/menteri.jpg';
import imgJasroh from '../../assets/img/pengurus/jasroh/menteri.jpg';
import imgMediadigi from '../../assets/img/pengurus/mediadigi/menteri.jpg';

export default function Pengurus() {
    const pengurusData = [
        { id: 1, name: 'BPH', img: imgBph },
        { id: 2, name: 'Kementerian Kepenghunian', img: imgKepenghunian },
        { id: 3, name: 'Kementerian Lingpras', img: imgLingpras },
        { id: 4, name: 'Kementerian Jasroh', img: imgJasroh },
        { id: 5, name: 'Kementerian Mediadigi', img: imgMediadigi },
    ];

    return (
        // Menghapus min-h-screen dan mengurangi padding agar tidak terlalu memakan tempat
        <section id="pengurus" className="relative w-full bg-[#fafafa] py-8 md:py-12">

            {/* Judul Section */}
            <h2
                className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#ea580c] mb-10 md:mb-16 mt-4 md:mt-4 tracking-wide text-center px-4"
            >
                Pengurus Asrama
            </h2>

            {/* Area Scroll Horizontal */}
            <div className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-8">

                {/* Container Flex:
                  Padding kiri (px-4 md:px-8 lg:px-12) dibuat secukupnya agar sejajar dengan layout konten lain 
                */}
                <div className="flex gap-4 md:gap-5 lg:gap-6 px-4 md:px-8 lg:px-12 w-max items-stretch pl-6 md:pl-10 lg:pl-14">

                    {pengurusData.map((item) => (
                        <div
                            key={item.id}
                            // Ukuran Card diperkecil menjadi lebih proporsional (tidak terlalu raksasa)
                            className="group relative flex-none w-[200px] md:w-[220px] lg:w-[250px] h-[280px] md:h-[320px] lg:h-[350px] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Gambar dengan efek zoom pelan saat di-hover */}
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Gradient Overlay: 
                              Tetap dipertahankan transparansinya agar foto terlihat jelas
                            */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ea580c]/80 via-[#ea580c]/10 to-transparent pointer-events-none"></div>

                            {/* Teks Nama Kementerian */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-center h-1/2">
                                <h3 className="text-white text-center font-semibold text-base md:text-lg leading-snug drop-shadow-md transform transition-transform duration-300 group-hover:-translate-y-1">
                                    {item.name}
                                </h3>
                            </div>
                        </div>
                    ))}

                    {/* Tombol Selengkapnya */}
                    <Link
                        to="/pengurus"
                        className="group flex-none flex flex-col items-center justify-center w-[120px] md:w-[150px] cursor-pointer pl-2"
                    >
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-[#ea580c] rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#c2410c]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <span className="mt-3 md:mt-4 text-[#ea580c] font-semibold text-sm md:text-base transition-colors duration-300 group-hover:text-[#c2410c]">
                            Selengkapnya
                        </span>
                    </Link>

                </div>
            </div>

            {/* CSS Internal untuk menyembunyikan scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />

        </section>
    );
}