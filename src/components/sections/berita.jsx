import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import nandoImg from '../../assets/img/berita/prestasi/nando.jpeg';

// Data dummy (12 data dengan kategori, deskripsi multi-paragraf)
export const dummyBerita = [
    {
        id: 1,
        title: "Juara 1 Lomba Video Challenge Universitas Airlangga dalam Acara Ulang Tahun Ke-79",
        date: "4 Oktober 2026",
        kategori: "prestasi",
        desc: "Salah satu penghuni Asrama IPB Sukasari, Nando Ravy Ardyansyah, meraih Juara 1 Lomba Video Challenge tingkat nasional yang diselenggarakan oleh Universitas Airlangga. Prestasi ini menjadi bukti nyata kemampuan mahasiswa dalam bidang kreativitas digital, sekaligus menunjukkan daya saing yang tinggi di tingkat nasional.\n\nKompetisi tersebut diikuti oleh lebih dari 250 peserta dari 70 perguruan tinggi di seluruh Indonesia. Dalam prosesnya, peserta ditantang untuk membuat video berdurasi 3–5 menit dengan tema komunikasi kreatif dan dampak sosial. Karya Nando berhasil menonjol melalui konsep yang kuat, alur cerita yang jelas, serta kualitas visual yang menarik, sehingga memperoleh skor akhir 92,5 dari dewan juri.\n\nSelama kurang lebih dua minggu proses produksi, Nando melakukan riset, penulisan naskah, hingga proses editing secara mandiri dengan memanfaatkan berbagai tools digital. Dedikasi tersebut menghasilkan karya yang tidak hanya informatif, tetapi juga mampu menyampaikan pesan secara persuasif kepada audiens.\n\nKeberhasilan ini turut mengharumkan nama Asrama IPB Sukasari, sekaligus menjadi representasi lingkungan yang mendukung pengembangan potensi mahasiswa. Prestasi ini diharapkan dapat memotivasi penghuni asrama lainnya untuk terus berkarya, meningkatkan kompetensi, serta berpartisipasi aktif dalam berbagai ajang kompetisi di tingkat nasional maupun internasional.",
        img: nandoImg
    },
    {
        id: 2,
        title: "Pelaksanaan Program Asrama Mengajar di SDN 1 Sukasari Meningkatkan Literasi Siswa",
        date: "12 November 2026",
        kategori: "event",
        desc: "Kegiatan Asrama Mengajar kembali dilaksanakan sebagai wujud pengabdian mahasiswa Asrama IPB Sukasari kepada masyarakat sekitar. Kali ini, program difokuskan pada peningkatan literasi dasar dan numerasi bagi siswa-siswi SDN 1 Sukasari yang berada di sekitar lingkungan asrama.\n\nLebih dari 30 relawan mahasiswa terlibat aktif dalam kegiatan yang berlangsung selama satu bulan penuh ini. Mereka menyusun materi pembelajaran interaktif yang tidak hanya berfokus pada kemampuan membaca dan berhitung, tetapi juga menyelipkan nilai-nilai pendidikan karakter, lingkungan, dan teknologi sederhana.\n\nAntusiasme siswa sangat terlihat dari partisipasi mereka dalam berbagai games edukatif dan diskusi kelompok yang diselenggarakan di setiap akhir sesi kelas. Kepala SDN 1 Sukasari menyambut baik inisiatif ini dan berharap kerja sama dapat terus berlanjut di semester berikutnya.\n\nMelalui program ini, diharapkan mahasiswa tidak hanya mengasah empati dan keterampilan sosial mereka, tetapi juga memberikan dampak positif yang nyata dalam membantu meningkatkan kualitas pendidikan anak-anak di sekitar lingkungan kampus.",
        img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600"
    },
    {
        id: 3,
        title: "Sukasari Cup 1.0 Berhasil Menyaring Atlet Berbakat untuk Persiapan Olimpiade Kampus",
        date: "25 Desember 2026",
        kategori: "event",
        desc: "Ajang kompetisi olahraga antarlorong, Sukasari Cup 1.0, telah selesai digelar dengan meriah. Ratusan penghuni asrama berpartisipasi dalam berbagai cabang olahraga, mulai dari futsal, bulu tangkis, tenis meja, hingga e-sports seperti Mobile Legends dan PUBG Mobile.\n\nSelain menjadi sarana hiburan dan pelepas penat setelah ujian tengah semester, kompetisi ini juga bertujuan untuk mencari dan menyaring bibit-bibit atlet berbakat yang akan mewakili asrama di ajang Olimpiade Kampus tahun depan. Pertandingan berlangsung sengit dengan dukungan suporter yang tak henti-hentinya bersorak dari pinggir lapangan.\n\nKepanitiaan yang terdiri dari perwakilan setiap lorong sukses menyelenggarakan acara ini secara profesional. Penutupan acara dimeriahkan dengan malam keakraban, pembagian piala, dan penampilan seni dari band asrama yang semakin menambah suasana hangat kekeluargaan.\n\nKesuksesan Sukasari Cup 1.0 membuktikan bahwa solidaritas dan sportivitas selalu menjadi nilai utama yang dijunjung tinggi oleh seluruh penghuni Asrama IPB Sukasari dalam setiap kegiatannya.",
        img: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=600"
    },
    {
        id: 4,
        title: "Mahasiswa Asrama Sukasari Lolos Pendanaan Program Kreativitas Mahasiswa (PKM) 2026",
        date: "5 Januari 2027",
        kategori: "prestasi",
        desc: "Kabar gembira datang dari tim peneliti muda Asrama IPB Sukasari yang berhasil lolos pendanaan Program Kreativitas Mahasiswa (PKM) tahun 2026 yang diselenggarakan oleh Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Tim yang beranggotakan lima mahasiswa lintas jurusan ini mengajukan proposal di bidang riset eksakta.\n\nPenelitian mereka berfokus pada inovasi pengelolaan limbah organik rumah tangga menggunakan teknologi dekomposisi berbasis mikroba lokal yang efisien dan ramah lingkungan. Ide cemerlang ini bermula dari pengamatan mereka terhadap kebiasaan pembuangan sampah di lingkungan asrama dan sekitarnya.\n\nProses bimbingan intensif dengan dosen pembimbing serta dedikasi tim dalam menyusun proposal berbuah manis. Saat ini, tim sedang mempersiapkan tahap implementasi dan eksperimen skala laboratorium untuk membuktikan efektivitas inovasi yang mereka tawarkan.\n\nKeberhasilan menembus ajang kompetitif ini diharapkan dapat menjadi inspirasi bagi penghuni asrama lainnya untuk turut serta menyumbangkan ide-ide kreatif dan solutif yang berdampak luas bagi masyarakat maupun perkembangan ilmu pengetahuan.",
        img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600"
    },
    {
        id: 5,
        title: "Kerja Bakti Massal dan Penanaman Pohon Rindang di Lingkungan Asrama Sukasari",
        date: "10 Februari 2027",
        kategori: "event",
        desc: "Dalam rangka memperingati Hari Peduli Sampah Nasional, seluruh pengurus dan penghuni Asrama IPB Sukasari menyelenggarakan kegiatan kerja bakti massal. Kegiatan ini diwajibkan bagi seluruh mahasiswa sebagai wujud nyata menjaga kebersihan dan kenyamanan tempat tinggal bersama.\n\nKegiatan dimulai sejak pagi hari dengan membagi peserta ke dalam beberapa zona kebersihan, meliputi area lorong, kamar mandi bersama, dapur, halaman depan, hingga area parkir. Selain membersihkan sampah dan menyapu, dilakukan pula pengecatan ulang pada beberapa fasilitas umum yang sudah mulai kusam.\n\nPuncak acara ditandai dengan aksi penanaman puluhan bibit pohon rindang dan tanaman hias di sepanjang pekarangan asrama. Langkah ini diambil untuk menambah ruang hijau, menyejukkan lingkungan, dan memperbaiki kualitas udara di sekitar asrama yang semakin padat.\n\nKerja bakti ini ditutup dengan makan siang bersama yang disediakan oleh panitia. Solidaritas dan semangat gotong royong yang tercermin dalam kegiatan ini diharapkan dapat terus terjaga dan menjadi budaya positif di lingkungan Asrama IPB Sukasari.",
        img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600"
    },
    {
        id: 6,
        title: "Tim Paduan Suara Asrama Meraih Medali Perak di Kompetisi Kesenian Mahasiswa Tingkat Provinsi",
        date: "22 Maret 2027",
        kategori: "prestasi",
        desc: "Prestasi membanggakan kembali diraih oleh mahasiswa Asrama IPB Sukasari, kali ini di bidang seni vokal. Tim Paduan Suara Asrama berhasil membawa pulang medali perak dalam Kompetisi Kesenian Mahasiswa Tingkat Provinsi yang diselenggarakan di gedung kesenian kota.\n\nKompetisi bergengsi ini diikuti oleh belasan tim paduan suara dari berbagai universitas terkemuka di provinsi. Tim Asrama Sukasari membawakan dua lagu pilihan, yaitu sebuah lagu daerah yang diaransemen ulang dengan nuansa modern dan satu lagu pop kontemporer yang sukses memukau dewan juri.\n\nLatihan keras yang dilakukan selama tiga bulan terakhir, seringkali hingga larut malam setelah jadwal kuliah yang padat, akhirnya terbayar lunas. Kedisiplinan, kekompakan suara, serta penjiwaan yang mendalam menjadi faktor utama di balik kesuksesan penampilan mereka di atas panggung.\n\nPencapaian ini membuktikan bahwa mahasiswa Asrama IPB Sukasari tidak hanya unggul di bidang akademik dan olahraga, tetapi juga memiliki bakat seni yang luar biasa. Medali perak ini menjadi motivasi bagi tim untuk terus berlatih dan menargetkan posisi puncak di kompetisi nasional mendatang.",
        img: "https://images.unsplash.com/photo-1516280440502-62f32f3be23f?q=80&w=600"
    },
    {
        id: 7,
        title: "Seminar Persiapan Karir: Menyambut Dunia Kerja dengan Kepercayaan Diri Tinggi",
        date: "15 April 2027",
        kategori: "event",
        desc: "Kementerian Jasroh dan Mediadigi Asrama IPB Sukasari berkolaborasi mengadakan Seminar Persiapan Karir yang ditujukan khusus bagi mahasiswa tingkat akhir. Acara ini mendatangkan pembicara profesional dari berbagai perusahaan multinasional dan praktisi HR ternama.\n\nTopik yang dibahas mencakup strategi menyusun Curriculum Vitae (CV) yang ATS-friendly, tips lolos wawancara kerja, hingga pentingnya membangun personal branding di platform LinkedIn. Ratusan peserta antusias menyimak materi dan aktif berdiskusi dalam sesi tanya jawab interaktif.\n\nSelain sesi pemaparan materi, panitia juga menyediakan layanan review CV gratis bagi peserta yang beruntung. Kesempatan ini dimanfaatkan dengan baik oleh mahasiswa untuk mendapatkan umpan balik langsung dari para ahli mengenai kelebihan dan kekurangan profil profesional mereka.\n\nKegiatan edukatif ini merupakan bentuk dukungan nyata asrama terhadap pengembangan soft skill mahasiswa. Diharapkan, ilmu yang didapatkan dari seminar ini dapat membekali mahasiswa Asrama Sukasari untuk lebih siap dan percaya diri dalam menghadapi ketatnya persaingan di dunia kerja pasca kelulusan.",
        img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600"
    },
    {
        id: 8,
        title: "Perwakilan Asrama Terpilih Menjadi Delegasi Pemuda dalam Konferensi Perubahan Iklim Internasional",
        date: "28 Mei 2027",
        kategori: "prestasi",
        desc: "Satu lagi prestasi berskala internasional berhasil diukir oleh mahasiswa Asrama IPB Sukasari. Andi Setiawan, mahasiswa Fakultas Kehutanan yang juga aktif di Kementerian Lingpras asrama, terpilih menjadi salah satu delegasi pemuda Indonesia dalam Konferensi Perubahan Iklim Internasional di Kyoto, Jepang.\n\nAndi terpilih setelah melalui serangkaian proses seleksi ketat yang melibatkan ribuan pendaftar dari seluruh dunia. Esai yang ia tulis mengenai urgensi pengelolaan hutan berkelanjutan berbasis komunitas berhasil menarik perhatian komite seleksi dan membawanya terbang ke Negeri Sakura.\n\nSelama konferensi berlangsung, Andi berkesempatan berdiskusi dengan para pemimpin muda dari berbagai negara, bertukar pikiran mengenai solusi inovatif untuk mengatasi krisis iklim, dan mempresentasikan hasil risetnya mengenai pelestarian lingkungan di hadapan panel ahli.\n\nPengalaman berharga ini tidak hanya memperluas wawasan dan jaringan internasional Andi, tetapi juga membawa nama harum almamater dan asrama. Sekembalinya ke tanah air, Andi berkomitmen untuk menginisiasi gerakan ramah lingkungan yang lebih masif di lingkungan kampus dan asrama.",
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600"
    },
    {
        id: 9,
        title: "Malam Puncak Dies Natalis Asrama IPB Sukasari Ke-10 Berlangsung Spektakuler",
        date: "12 Juni 2027",
        kategori: "event",
        desc: "Asrama IPB Sukasari merayakan hari jadinya yang ke-10 dengan menyelenggarakan Malam Puncak Dies Natalis yang spektakuler. Acara ini dihadiri oleh ratusan penghuni, alumni, jajaran pengurus rektorat, serta tokoh masyarakat sekitar yang selama ini mendukung eksistensi asrama.\n\nPerayaan yang digelar di lapangan utama ini dimeriahkan dengan berbagai pertunjukan seni, mulai dari tari tradisional, teater musikal, hingga penampilan memukau dari guest star lokal yang berhasil membuat seluruh penonton bernyanyi bersama di bawah gemerlap tata cahaya panggung yang megah.\n\nSelain hiburan, acara ini juga menjadi momen refleksi perjalanan asrama selama satu dekade terakhir. Penayangan video dokumenter mengenai sejarah, pencapaian, dan cerita-cerita inspiratif dari para alumni berhasil membangkitkan rasa haru dan bangga di hati seluruh hadirin.\n\nMalam Puncak Dies Natalis ke-10 ini bukan sekadar perayaan, melainkan juga penegasan komitmen Asrama IPB Sukasari untuk terus menjadi rumah kedua yang nyaman, aman, dan mencetak generasi muda berprestasi di masa depan.",
        img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600"
    },
    {
        id: 10,
        title: "Penghargaan Juara Umum Cerdas Cermat Mahasiswa Tingkat Universitas Berhasil Diraih",
        date: "5 Juli 2027",
        kategori: "prestasi",
        desc: "Kecerdasan intelektual mahasiswa Asrama IPB Sukasari kembali terbukti dengan diraihnya gelar Juara Umum dalam ajang Lomba Cerdas Cermat Mahasiswa tingkat universitas. Tim yang terdiri dari tiga mahasiswa cerdas ini berhasil mengungguli puluhan tim lain dari berbagai fakultas.\n\nPertandingan berjalan sangat menegangkan, terutama pada babak final yang menguji wawasan peserta di berbagai bidang, mulai dari sains, sejarah, pengetahuan umum, hingga isu-isu global terkini. Ketangkasan dan ketepatan tim asrama dalam menjawab setiap pertanyaan sukses membuahkan poin sempurna.\n\nKemenangan ini merupakan hasil dari rutinitas kelompok belajar dan diskusi rutin yang kerap diadakan di ruang baca asrama. Lingkungan asrama yang kondusif dan saling mendukung antarpenghuni terbukti memberikan dampak signifikan terhadap prestasi akademik mahasiswa.\n\nPiala bergilir Juara Umum kini terpajang dengan bangga di lobi utama asrama. Prestasi ini diharapkan dapat memacu semangat belajar penghuni lainnya untuk terus mengeksplorasi ilmu pengetahuan dan berani berkompetisi di berbagai ajang bergengsi.",
        img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600"
    },
    {
        id: 11,
        title: "Lokakarya Kewirausahaan Digital: Membangun Startup dari Kamar Asrama",
        date: "20 Agustus 2027",
        kategori: "event",
        desc: "Dalam upaya menumbuhkan jiwa entrepreneurship di kalangan mahasiswa, Asrama IPB Sukasari mengadakan Lokakarya Kewirausahaan Digital yang bertajuk 'Membangun Startup dari Kamar Asrama'. Acara ini menarik minat puluhan mahasiswa yang memiliki mimpi merintis bisnis sendiri.\n\nLokakarya ini menghadirkan alumni asrama yang kini sukses mengelola perusahaan rintisan di bidang teknologi pendidikan. Pemateri membagikan pengalaman jatuh bangunnya membangun bisnis dari nol, mulai dari pencarian ide, validasi pasar, hingga strategi mencari pendanaan awal (seed funding).\n\nPeserta tidak hanya mendapatkan materi teoretis, tetapi juga diajak untuk melakukan simulasi pitching ide bisnis di hadapan mentor. Sesi ini memacu kreativitas mahasiswa dalam mengidentifikasi masalah di sekitar mereka dan menawarkan solusi bisnis yang inovatif dan berkelanjutan.\n\nInisiatif ini sejalan dengan visi universitas untuk mencetak lulusan yang tidak hanya siap mencari kerja, tetapi juga mampu menciptakan lapangan kerja. Beberapa ide bisnis yang dipresentasikan dalam lokakarya ini bahkan mendapat perhatian dari inkubator bisnis kampus untuk dibina lebih lanjut.",
        img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600"
    },
    {
        id: 12,
        title: "Tim Futsal Asrama Berhasil Menjuarai Turnamen Liga Mahasiswa Regional",
        date: "10 September 2027",
        kategori: "prestasi",
        desc: "Kabar gembira bagi para pencinta olahraga, Tim Futsal Asrama IPB Sukasari sukses meraih gelar Juara Pertama dalam turnamen Liga Mahasiswa Regional yang berlangsung di stadion olahraga kota. Kemenangan ini merupakan buah dari kerja keras dan kedisiplinan tim selama berbulan-bulan.\n\nPerjalanan menuju final tidaklah mudah. Tim asrama harus menghadapi lawan-lawan tangguh dari universitas lain yang memiliki jam terbang kompetisi lebih tinggi. Namun, dengan strategi permainan yang solid, kerja sama tim yang apik, dan pertahanan yang kuat, mereka berhasil menyapu bersih kemenangan di setiap babak.\n\nPertandingan final berlangsung dramatis dan menegangkan, diwarnai dengan aksi saling serang dan penyelamatan gemilang dari penjaga gawang asrama. Gol penentu kemenangan yang dicetak di menit-menit akhir pertandingan sontak membuat gemuruh sorak-sorai dari ratusan pendukung yang memadati tribun.\n\nKemenangan ini tidak hanya menambah koleksi trofi di lemari prestasi asrama, tetapi juga mempererat ikatan persaudaraan antarpenghuni. Keberhasilan tim futsal ini diharapkan dapat menginspirasi bidang-bidang olahraga lain di asrama untuk turut menorehkan prestasi gemilang di tingkat regional maupun nasional.",
        img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600"
    }
];

export default function Berita() {
    const scrollRef = useRef(null);

    // Fungsi untuk menggeser slider ke kiri atau kanan
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 340; // Kurang lebih selebar 1 card
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="berita" className="w-full py-16 md:py-24 bg-white overflow-hidden">
            {/* Menggunakan flex-col di mobile, flex-row di desktop untuk memisahkan Header dan List */}
            <div className="w-full flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10 pl-6 md:pl-12 lg:pl-12 xl:pl-12">

                {/* 1. CARD HEADER (Warna Orange) - Sebelah Kiri */}
                <div className="shrink-0 flex lg:block">
                    <div className="relative w-[94%] md:w-[95%] lg:w-[280px] bg-[#f97316] rounded-[32px] p-6 md:p-8 pb-20 md:pb-24 text-white flex flex-col h-fit">
                        <h2 className="text-4xl font-bold mb-3">Berita</h2>
                        <p className="text-white/90 text-sm font-medium leading-relaxed mb-6">
                            Telusuri kegiatan asrama dan informasi prestasi.
                        </p>
                        <a
                            href="/berita"
                            className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
                        >
                            Selengkapnya
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mb-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </a>

                        {/* Potongan Navigasi Kanan Bawah (Inverted Radius Effect) */}
                        <div className="absolute bottom-0 right-0 bg-white rounded-tl-[28px] pl-4 pt-4 pb-2 pr-2 flex gap-2">
                            {/* Kurva pelicin atas menggunakan radial-gradient agar solid dan tidak ada gap */}
                            <div className="absolute right-0 -top-[19.5px] w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top left, transparent 20px, #ffffff 20.5px)' }}></div>
                            {/* Kurva pelicin kiri menggunakan radial-gradient */}
                            <div className="absolute -left-[19.5px] bottom-0 w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top left, transparent 20px, #ffffff 20.5px)' }}></div>

                            <button
                                onClick={() => scroll('left')}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. SCROLL CONTAINER BERITA - Sebelah Kanan */}
                <div className="flex-1 min-w-0">
                    <div
                        ref={scrollRef}
                        className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-6 md:pr-12 lg:pr-[10vw] pb-12 pt-4 lg:pt-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* 2. BERITA CARDS - Lebar dikecilkan */}
                        {dummyBerita.map((item) => (
                            <Link to={`/berita/${item.id}`} key={item.id} className="shrink-0 w-[250px] md:w-[280px] snap-start flex flex-col gap-3 md:gap-4 cursor-pointer group">

                                {/* Image Container with Inverted Radius */}
                                <div className="relative w-full h-[180px] md:h-[200px] rounded-[24px] md:rounded-[28px] overflow-hidden bg-gray-100">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Potongan Tanggal Kiri Bawah (Inverted Radius Effect) */}
                                    {/* px-5 ditambahkan agar tanggal tidak terpotong di kiri */}
                                    <div className="absolute bottom-0 left-0 bg-white px-5 pt-2 pb-2 rounded-tr-[24px]">
                                        {/* Kurva pelicin atas dengan radial-gradient */}
                                        <div className="absolute left-0 -top-[19.5px] w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top right, transparent 20px, #ffffff 20.5px)' }}></div>
                                        {/* Kurva pelicin kanan dengan radial-gradient */}
                                        <div className="absolute -right-[19.5px] bottom-0 w-[20px] h-[20px]" style={{ background: 'radial-gradient(circle at top right, transparent 20px, #ffffff 20.5px)' }}></div>

                                        <span className="relative z-10 text-[13px] font-bold text-gray-800">
                                            {item.date}
                                        </span>
                                    </div>
                                </div>

                                {/* Teks Konten */}
                                <div className="px-1 md:px-2">
                                    <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1.5 md:mb-2 leading-snug group-hover:text-orange-500 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    {/* line-clamp-3 akan otomatis memotong teks dan memberikan '...' di baris ketiga */}
                                    <p className="text-[13px] md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}