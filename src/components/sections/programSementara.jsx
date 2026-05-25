import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const programs = [
    {
        title: "Bhakti Asrama",
        description: "Berjalan secara harian, program ini bertujuan membentuk karakter disiplin melalui kegiatan bersih-bersih konsisten di ruang-ruang yang telah ditentukan.",
        icon: "🧹",
        freq: "Harian",
        color: "from-orange-500 to-amber-500"
    },
    {
        title: "Lesehan Intelektual",
        description: "Kegiatan bulanan yang menghadirkan narasumber kredibel melalui pemaparan materi atau kunjungan lapang untuk membangun lingkungan yang intelektual di asrama.",
        icon: "📖",
        freq: "Bulanan",
        color: "from-blue-500 to-cyan-500"
    },
    {
        title: "Inspeksi Kamar",
        description: "Program pengawasan kerapihan dan kebersihan kamar yang rutin dilakukan setiap bulan dengan melibatkan seluruh penghuni asrama tanpa terkecuali.",
        icon: "🔍",
        freq: "Bulanan",
        color: "from-emerald-500 to-teal-500"
    },
    {
        title: "Olahraga Bulanan Asrama",
        description: "Kegiatan olahraga bulanan yang menyehatkan, dirancang khusus untuk memupuk semangat kekeluargaan antar penghuni.",
        icon: "🏐",
        freq: "Bulanan",
        color: "from-red-500 to-rose-500"
    },
    {
        title: "Jaga Malam",
        description: "Berjalan secara harian, program ini adalah bentuk komitmen asrama untuk menjaga keamanan penghuni serta perlindungan aset dari hal-hal yang tidak diinginkan.",
        icon: "🌙",
        freq: "Harian",
        color: "from-indigo-500 to-violet-500"
    },
    {
        title: "Ketok Shubuh",
        description: "Program kedisiplinan harian di mana penghuni yang sedang bertugas jaga akan membangunkan penghuni lainnya setiap pagi.",
        icon: "⏰",
        freq: "Harian",
        color: "from-yellow-500 to-orange-500"
    },
    {
        title: "Rapat Bulanan Asrama",
        description: "Forum bulanan yang berfungsi sebagai jembatan koordinasi sekaligus wadah penjaringan ide dan argumen antar seluruh unsur asrama.",
        icon: "🤝",
        freq: "Bulanan",
        color: "from-sky-500 to-blue-500"
    },
    {
        title: "Rapat Insidental Asrama",
        description: "Pertemuan sewaktu-waktu yang diadakan saat kondisi mendesak untuk membahas hal penting dan mengambil keputusan cepat bersama seluruh penghuni.",
        icon: "⚡",
        freq: "Insidental",
        color: "from-amber-500 to-yellow-500"
    },
    {
        title: "Ngaji Bareng",
        description: "Kegiatan spiritual bulanan membaca Al-Qur'an bersama, seperti Yasinan atau membaca surat Al-Kahfi, yang dilakukan dengan khidmat oleh seluruh penghuni.",
        icon: "📿",
        freq: "Bulanan",
        color: "from-green-500 to-emerald-500"
    },
    {
        title: "Kerja Bakti",
        description: "Program bulanan untuk membersihkan area asrama bersama demi menjaga kenyamanan dan kepedulian lingkungan.",
        icon: "🪣",
        freq: "Bulanan",
        color: "from-teal-500 to-cyan-500"
    },
    {
        title: "Baca Kitab Riyadusholihin",
        description: "Rutinitas membaca kitab Riyadusholihin sehabis sholat berjamaah, diakhiri dengan doa kafaratul majlis dan ayat kursi.",
        icon: "📗",
        freq: "Harian",
        color: "from-lime-500 to-green-500"
    }
];

const freqColors = {
    "Harian": "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "Bulanan": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Insidental": "bg-amber-500/20 text-amber-300 border-amber-500/30"
};

export default function ProgramSementara() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section id="program" className="relative w-full bg-[#1e2a3b] pt-20 md:pt-28 pb-0 px-4 sm:px-6 md:px-12 overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Gradient Mask for Smooth Transition to Fasilitas */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1e2a3b] to-transparent pointer-events-none z-0" />
            
            {/* Header */}
            <div className="relative max-w-6xl mx-auto mb-16 text-center">
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-orange-400 font-semibold text-sm tracking-[0.2em] uppercase mb-3"
                >
                    Kegiatan & Aktivitas
                </motion.p>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide"
                >
                    Program Asrama
                </motion.h2>
            </div>

            {/* Program Cards Grid */}
            <div className="relative max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-16">
                {programs.map((program, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        className="group relative cursor-pointer"
                    >
                        <div className={`relative bg-white/[0.04] backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-500 ${
                            activeIndex === index 
                                ? "border-orange-500/40 bg-white/[0.08] shadow-[0_0_30px_rgba(242,129,63,0.1)]" 
                                : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]"
                        }`}>

                            {/* Card Content */}
                            <div className="p-5 md:p-6">
                                {/* Icon + Title Row */}
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 ${
                                        activeIndex === index ? "scale-110" : "group-hover:scale-105"
                                    }`}>
                                        {program.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-sm sm:text-[13px] md:text-sm lg:text-base leading-snug mb-1.5">
                                            {program.title}
                                        </h3>
                                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${freqColors[program.freq]}`}>
                                            {program.freq}
                                        </span>
                                    </div>
                                    {/* Toggle Arrow */}
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 flex-shrink-0 mt-1 transition-transform duration-300 ${activeIndex === index ? "rotate-180 text-orange-400" : ""}`} 
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Expandable Description */}
                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-gray-300/90 text-sm leading-relaxed mt-4 pt-4 border-t border-white/10">
                                                {program.description}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Stats */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative max-w-3xl mx-auto mt-14 flex items-center justify-center gap-8 md:gap-16"
            >
                {[
                    { num: "5", label: "Program Harian", color: "text-orange-400" },
                    { num: "7", label: "Program Bulanan", color: "text-blue-400" },
                    { num: "11", label: "Total Program", color: "text-white" }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.num}</p>
                        <p className="text-[11px] md:text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
                    </div>
                ))}
            </motion.div>

        </section>
    );
}
