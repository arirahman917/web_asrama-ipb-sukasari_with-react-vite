import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// Data Dummy (10 Data)
const alumniData = [
  {
    id: 1,
    name: "Aris Risianto, S.Si",
    role: "AIS'12 - Data Scientist di Gojek",
    image: "https://i.pravatar.cc/150?img=11",
    quote: '"Sukasari bukan sekadar asrama, melainkan sekolah kehidupan. Di sinilah kepemimpinan saya ditempa dan persaudaraan sejati terjalin, menjadi bekal tak ternilai untuk melangkah dalam karier maupun kehidupan bermasyarakat."'
  },
  {
    id: 2,
    name: "M. Nabil Dhiyaulhaq, S.Si",
    role: "AIS'17 - Business Analyst di Telkom Indonesia",
    image: "https://i.pravatar.cc/150?img=12",
    quote: '"Tinggal di Sukasari adalah titik balik yang mendewasakan saya. Nilai-nilai kedisiplinan dan solidaritas yang ditanamkan di asrama ini telah membentuk karakter kuat yang terus saya pegang hingga saat ini."'
  },
  {
    id: 3,
    name: "H. Dedy, S.H.",
    role: "AIS'18 - Legal Officer di Pertamina",
    image: "https://i.pravatar.cc/150?img=13",
    quote: '"Keluarga Sukasari adalah rumah kedua yang selalu saya rindukan. Diskusi malam, kebersamaan, dan semangat untuk saling mendukung telah menjadi fondasi penting dalam perjalanan profesional dan personal saya."'
  },
  {
    id: 4,
    name: "Ahmad Fauzi, S.T.",
    role: "AIS'15 - Site Engineer di PT Wijaya Karya",
    image: "https://i.pravatar.cc/150?img=14",
    quote: '"Pengalaman berorganisasi di asrama sangat membantu saya dalam dunia kerja. Saya belajar bagaimana memanajemen waktu antara kuliah dan kehidupan sosial dengan sangat seimbang."'
  },
  {
    id: 5,
    name: "Budi Santoso, S.E.",
    role: "AIS'19 - Finance Staff di Bank BCA",
    image: "https://i.pravatar.cc/150?img=15",
    quote: '"Asrama ini memfasilitasi minat dan bakat saya. Berkat lingkungan yang suportif, saya bisa mengembangkan potensi diri dengan maksimal hingga lulus dengan predikat terbaik."'
  },
  {
    id: 6,
    name: "Candra Wijaya, S.Kom",
    role: "AIS'20 - Frontend Dev di Tokopedia",
    image: "https://i.pravatar.cc/150?img=16",
    quote: '"Solidaritas adalah kata yang tepat untuk Sukasari. Di saat saya merasa kesulitan beradaptasi di awal perkuliahan, teman-teman asrama adalah keluarga yang merangkul saya."'
  },
  {
    id: 7,
    name: "Dimas Anggara, S.P.",
    role: "AIS'21 - Agronomist di PT BISI International",
    image: "https://i.pravatar.cc/150?img=17",
    quote: '"Belajar eksekusi program dan acara dari skala kecil hingga besar saya dapatkan di sini. Asrama adalah miniatur masyarakat yang mendewasakan pemikiran saya."'
  },
  {
    id: 8,
    name: "Eko Prasetyo, S.Hutan",
    role: "AIS'16 - Forest Planner di Perhutani",
    image: "https://i.pravatar.cc/150?img=18",
    quote: '"Rasa kekeluargaan yang erat membuat saya tidak pernah merasa jauh dari rumah. Sukasari memberikan cerita masa kuliah yang paling indah dan berkesan."'
  },
  {
    id: 9,
    name: "Fajar Nugraha, S.Pt.",
    role: "AIS'22 - Quality Control di Japfa",
    image: "https://i.pravatar.cc/150?img=53",
    quote: '"Lesehan intelektual dan diskusi rutin di asrama membuka wawasan saya. Tidak hanya cerdas secara akademis, tapi asrama ini mencetak generasi yang peka sosial."'
  },
  {
    id: 10,
    name: "Gilang Ramadhan, S.Pi.",
    role: "AIS'14 - Fishery Staff di KKP",
    image: "https://i.pravatar.cc/150?img=60",
    quote: '"Koneksi dan jaringan alumni dari Sukasari sangat luar biasa. Hingga saat ini di dunia profesional, ikatan persaudaraan itu masih sangat terasa dan saling membantu."'
  }
];

export default function KataAlumni() {
  const [activeIndex, setActiveIndex] = React.useState(1);

  const next = () => setActiveIndex((prev) => (prev + 1) % alumniData.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + alumniData.length) % alumniData.length);

  const getRelativePosition = (index) => {
    const diff = index - activeIndex;
    if (diff === 0) return 0; // Center
    if (diff === 1 || (activeIndex === alumniData.length - 1 && index === 0)) return 1; // Right
    if (diff === -1 || (activeIndex === 0 && index === alumniData.length - 1)) return -1; // Left
    return 2; // Hidden
  };

  return (
    <section id="alumni" className="bg-[#0A2F4C] min-h-[500px] lg:h-screen lg:min-h-[600px] flex flex-col justify-center py-20 lg:py-0 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative">
        
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-2">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wider"
          >
            Kata Alumni
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="flex items-center justify-between w-full mt-8 relative">
          
          {/* Tombol Kiri */}
          <button 
            onClick={prev} 
            className="z-50 w-10 h-10 md:w-12 md:h-12 flex flex-shrink-0 items-center justify-center rounded-full text-white hover:text-orange-400 transition-colors duration-300"
            aria-label="Geser Kiri"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Cards Area */}
          <div className="relative w-full h-[320px] md:h-[380px] flex justify-center items-center perspective-[1000px]">
            {alumniData.map((alumni, index) => {
              const pos = getRelativePosition(index);
              
              // Tentukan gaya berdasarkan posisi
              let classes = "absolute transition-all duration-500 ease-in-out w-[220px] md:w-[260px] ";
              if (pos === 0) {
                classes += "z-20 opacity-100 scale-100 translate-x-0";
              } else if (pos === -1) {
                classes += "z-10 opacity-60 scale-75 -translate-x-[30%] md:-translate-x-[96%] blur-[1px]";
              } else if (pos === 1) {
                classes += "z-10 opacity-60 scale-75 translate-x-[30%] md:translate-x-[96%] blur-[1px]";
              } else {
                classes += "z-0 opacity-0 scale-50 translate-x-0 pointer-events-none";
              }

              return (
                <div key={alumni.id} className={classes}>
                  {/* Kartu Testimoni */}
                  <div className="relative bg-white rounded-3xl p-5 pt-12 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center text-center h-full">
                    
                    {/* Foto Profil Avatar */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden bg-gray-200 shadow-md">
                      <img 
                        src={alumni.image} 
                        alt={alumni.name} 
                        className="w-full h-full object-cover blur-[2px]"
                      />
                      {/* Coming Soon Overlay Avatar */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold tracking-widest bg-black/20 px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-sm">SOON</span>
                      </div>
                    </div>

                    {/* Teks Konten (Buram) */}
                    <div className="relative w-full flex-grow flex flex-col items-center mt-2">
                        <div className="w-full flex-grow flex flex-col items-center blur-[4px] select-none opacity-40 pointer-events-none">
                            {/* Teks Nama & Posisi */}
                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 w-full px-2 whitespace-nowrap overflow-hidden text-ellipsis">
                              {alumni.name}
                            </h3>
                            <p className="text-[10px] md:text-[11px] font-semibold text-gray-500 mb-4">
                              {alumni.role}
                            </p>

                            <div className="w-16 h-[2px] bg-orange-400 mb-4"></div>

                            {/* Quote Testimoni */}
                            <div className="relative flex-grow flex items-center w-full">
                              <Quote className="absolute -top-2 -left-2 w-5 h-5 text-gray-200 -z-10 rotate-180" />
                              <p className="text-gray-600 leading-relaxed text-[11px] md:text-xs">
                                {alumni.quote}
                              </p>
                              <Quote className="absolute -bottom-2 -right-2 w-5 h-5 text-gray-200 -z-10" />
                            </div>
                        </div>
                        
                        {/* Overlay Coming Soon Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                            <span className="bg-white/40 backdrop-blur-md border border-gray-200 text-gray-800 text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full tracking-widest shadow-sm">COMING SOON</span>
                        </div>
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Kanan */}
          <button 
            onClick={next} 
            className="z-50 w-10 h-10 md:w-12 md:h-12 flex flex-shrink-0 items-center justify-center rounded-full text-white hover:text-orange-400 transition-colors duration-300"
            aria-label="Geser Kanan"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

        </div>
      </div>
    </section>
  );
}