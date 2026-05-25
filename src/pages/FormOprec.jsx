import React, { useState, useRef, useEffect } from "react";
import { db, storage, auth, googleProvider } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { OPREC_BATCHES } from "../components/sections/hero";

function getActiveBatch() {
  const now = new Date();
  for (const batch of OPREC_BATCHES) {
    if (now >= batch.start && now <= batch.end) return batch;
  }
  return null;
}

// ============================================================
// DAFTAR PROGRAM STUDI & AGAMA
// ============================================================
const PRODI_LIST = [
  "Teknologi Rekayasa Perangkat Lunak",
  "Teknologi Rekayasa Komputer",
  "Akuntansi",
  "Analisis Kimia",
  "Komunikasi Digital dan Media",
  "Manajemen Agribisnis",
  "Manajemen Industri",
  "Manajemen Industri Jasa Makanan dan Gizi",
  "Paramedik Veteriner",
  "Supervisor Jaminan Mutu Pangan",
  "Teknik dan Manajemen Lingkungan",
  "Teknologi dan Manajemen Produksi Perkebunan",
  "Teknologi dan Manajemen Ternak",
  "Teknologi Produksi dan Manajemen Perikanan Budidaya",
  "Ekowisata",
  "Teknologi Produksi dan Pengembangan Masyarakat Pertanian",
  "Pemuliaan Tanaman dan Teknologi Benih"
];

const AGAMA_LIST = ["Islam", "Kristen Protestan", "Kristen Katolik", "Hindu", "Budha", "Konghucu"];
const JALUR_MASUK_LIST = ["SNBP", "SNBT", "Mandiri"];

// ============================================================
// FORM STEPS DEFINITION
// ============================================================
const STEPS = [
  { id: 1, title: "Identitas Diri", icon: "👤" },
  { id: 2, title: "Data Orang Tua / Wali", icon: "👨‍👩‍👦" },
  { id: 3, title: "Data Keuangan", icon: "💰" },
  { id: 4, title: "Pengalaman Pribadi", icon: "🏆" },
  { id: 5, title: "Media & Bukti Syarat", icon: "📸" },
  { id: 6, title: "Pakta Integritas", icon: "✅" },
];

// ============================================================
// INITIAL FORM STATE
// ============================================================
const initialFormData = {
  namaLengkap: "", tanggalLahir: "", programStudi: "",
  agama: "", agamaLainnya: "", jalurMasuk: "", anakKeDari: "", asalDaerah: "",
  asalSekolah: "", nomorWhatsapp: "", riwayatPenyakit: "",
  namaAyah: "", nomorTeleponAyah: "", pekerjaanAyah: "", penghasilanAyahPerBulan: "",
  namaIbu: "", nomorTeleponIbu: "", pekerjaanIbu: "", penghasilanIbuPerBulan: "",
  namaWali: "", nomorTeleponWali: "", hubunganWali: "", hubunganWaliLainnya: "",
  penerimaKipK: "", ukt: "",
  rencanaUangKirimanBulanan: "", sumberUangBulanan: "", sumberUangLainnya: "",
  rencanaPengeluaranBulanan: "", statusTempatTinggal: "",
  statusTempatTinggalLainnya: "", rencanaTransportasi: "", rencanaTransportasiLainnya: "",
  bersediaUangPangkal: "", bersediaIuranBulanan: "",
  ceritaDiri: "", portofolio: "",
  usernameInstagram: "",
  signature: "",
};

// ============================================================
// INDEXEDDB HELPER FOR FILES PERSISTENCE
// ============================================================
const DB_NAME = "OprecFilesDB";
const STORE_NAME = "filesStore";

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      if (!e.target.result.objectStoreNames.contains(STORE_NAME)) {
        e.target.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveFileToDB = async (key, file) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const removeFileFromDB = async (key) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const getAllFilesFromDB = async (uid) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    const files = {};
    
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.key.startsWith(`${uid}_`)) {
          const fileKey = cursor.key.replace(`${uid}_`, "");
          files[fileKey] = cursor.value;
        }
        cursor.continue();
      } else {
        resolve(files);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

const clearFilesFromDB = async (uid) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.key.startsWith(`${uid}_`)) {
           store.delete(cursor.key);
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
};

// ============================================================
// FILE UPLOAD COMPONENT
// ============================================================
function FileUpload({ label, hint, accept, maxSizeMB, fileKey, files, onFileUpdate, required, error: externalError }) {
  const inputRef = useRef(null);
  const file = files[fileKey];
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    setError("");
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMB} MB`);
      return;
    }
    onFileUpdate(fileKey, f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="mb-5">
      <label className={`block text-sm font-semibold mb-1 ${externalError && !file ? "text-red-400" : "text-white"}`}>
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
          dragOver ? "border-orange-400 bg-orange-400/10" :
          file ? "border-green-500/50 bg-green-500/5" :
          externalError && !file ? "border-red-500 bg-red-500/5" :
          "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
        {file ? (
          <div className="flex items-center gap-3 justify-center">
            {file.type.startsWith("image/") && (
              <img src={URL.createObjectURL(file)} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
            )}
            <div className="text-left">
              <p className="text-sm text-green-400 font-medium truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button type="button" onClick={(e) => { 
                e.stopPropagation(); 
                onFileUpdate(fileKey, null); 
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="ml-2 text-red-400 hover:text-red-300 text-lg">✕</button>
          </div>
        ) : (
          <div>
            <svg className={`w-8 h-8 mx-auto mb-2 ${externalError && !file ? "text-red-400" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className={`text-sm ${externalError && !file ? "text-red-400" : "text-gray-400"}`}>Klik atau drag & drop file di sini</p>
            <p className="text-xs text-gray-500 mt-1">Maks {maxSizeMB} MB • {accept}</p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {externalError && !file && !error && <p className="text-xs text-red-400 mt-1">File wajib diunggah</p>}
    </div>
  );
}

// ============================================================
// COMPONENT HELPERS
// ============================================================
function RadioGroup({ label, name, options, value, onChange, required, hasOther, otherValue, onOtherChange, error }) {
  return (
    <div className="mb-5">
      <label className={`block text-sm font-semibold mb-3 ${error ? "text-red-400" : "text-white"}`}>
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} onClick={() => onChange(opt)} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
            value === opt ? "bg-orange-500/20 border border-orange-500/50" : "bg-white/5 border border-white/10 hover:bg-white/10"
          } ${error && !value ? "border-red-500 bg-red-500/5" : ""}`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              value === opt ? "border-orange-400" : error && !value ? "border-red-500" : "border-gray-500"
            }`}>
              {value === opt && <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />}
            </div>
            <span className={`text-sm ${error && !value ? "text-red-300" : "text-gray-200"}`}>{opt}</span>
          </label>
        ))}
        {hasOther && (
          <label onClick={() => onChange("Lainnya")} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
            value === "Lainnya" ? "bg-orange-500/20 border border-orange-500/50" : "bg-white/5 border border-white/10 hover:bg-white/10"
          } ${error && !value ? "border-red-500 bg-red-500/5" : ""}`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              value === "Lainnya" ? "border-orange-400" : error && !value ? "border-red-500" : "border-gray-500"
            }`}>
              {value === "Lainnya" && <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />}
            </div>
            <span className={`text-sm mr-2 ${error && !value ? "text-red-300" : "text-gray-200"}`}>Lainnya:</span>
            <input type="text" value={otherValue || ""} placeholder="Tuliskan..."
              className={`flex-1 bg-transparent border-b text-sm text-white outline-none focus:border-orange-400 py-0.5 ${
                error && value === "Lainnya" && !otherValue ? "border-red-500 placeholder-red-400" : "border-gray-500"
              }`}
              onClick={(e) => { e.stopPropagation(); onChange("Lainnya"); }}
              onChange={(e) => { onChange("Lainnya"); onOtherChange?.(e.target.value); }} />
          </label>
        )}
      </div>
      {error && !value && <p className="text-xs text-red-400 mt-2">Pilihan ini wajib diisi</p>}
      {error && value === "Lainnya" && !otherValue && <p className="text-xs text-red-400 mt-2">Mohon tuliskan penjelasan lainnya</p>}
    </div>
  );
}

function TextInput({ label, name, value, onChange, placeholder, required, type = "text", hint, error }) {
  return (
    <div className="mb-5">
      <label className={`block text-sm font-semibold mb-1 ${error ? "text-red-400" : "text-white"}`}>
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2" dangerouslySetInnerHTML={{ __html: hint }}></p>}
      <input type={type} value={value} onChange={(e) => onChange(name, e.target.value)} placeholder={placeholder}
        style={{ colorScheme: "dark" }}
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:bg-white/10 transition-all duration-200 ${
          error ? "border-red-500 focus:border-red-400 bg-red-500/5" : "border-white/15 focus:border-orange-400"
        }`} />
      {error && <p className="text-xs text-red-400 mt-1">Field ini wajib diisi</p>}
    </div>
  );
}

function SelectDropdown({ value, onChange, options, placeholder, error, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = (opt) => (typeof opt === 'object' ? opt.label : opt);
  const getValue = (opt) => (typeof opt === 'object' ? opt.value : opt);

  const filteredOptions = options.filter(opt => 
    String(getLabel(opt)).toLowerCase().includes(search.toLowerCase())
  );
  
  const showSearch = options.length > 10;
  
  const selectedOpt = options.find(opt => getValue(opt) === value);
  const selectedLabel = value ? (selectedOpt ? getLabel(selectedOpt) : value) : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm flex items-center justify-between outline-none transition-all duration-200 cursor-pointer ${
          error ? "border-red-500 bg-red-500/5 text-red-200" : "border-white/15 hover:border-orange-400 text-white"
        } ${isOpen ? "ring-2 ring-orange-500/50 border-orange-400 bg-white/10" : ""}`}
      >
        <span className={value ? "text-white truncate" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <svg className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-orange-400" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
          >
            {showSearch && (
              <div className="p-2 border-b border-white/10 bg-gray-800">
                <input 
                  type="text" 
                  placeholder="Cari opsi..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-400 transition-colors"
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto custom-scrollbar" data-lenis-prevent>
              {filteredOptions.length === 0 ? (
                <p className="text-gray-400 text-sm p-4 text-center">Tidak ditemukan</p>
              ) : (
                filteredOptions.map((opt, i) => {
                  const val = getValue(opt);
                  const lbl = getLabel(opt);
                  return (
                    <div 
                      key={i} 
                      onClick={() => { onChange(val); setIsOpen(false); setSearch(""); }}
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                        value === val ? "bg-orange-500/20 text-orange-400 font-semibold" : "text-gray-200 hover:bg-white/10"
                      }`}
                    >
                      {lbl}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectInput({ label, name, value, onChange, options, placeholder, required, error }) {
  return (
    <div className="mb-5">
      <label className={`block text-sm font-semibold mb-1 ${error ? "text-red-400" : "text-white"}`}>
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <SelectDropdown value={value} onChange={(val) => onChange(name, val)} options={options} placeholder={placeholder || "Pilih..."} error={error} className="w-full" />
      {error && <p className="text-xs text-red-400 mt-1">Pilihan ini wajib diisi</p>}
    </div>
  );
}

function DateInput({ label, name, value, onChange, required, error }) {
  const [y, m, d] = value ? value.split("-") : ["", "", ""];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = [
    { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Agu' }, { value: '09', label: 'Sep' },
    { value: '10', label: 'Okt' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Des' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => String(currentYear - i));

  const handleDay = (newDay) => onChange(name, `${y || years[10]}-${m || "01"}-${newDay}`);
  const handleMonth = (newMonth) => onChange(name, `${y || years[10]}-${newMonth}-${d || "01"}`);
  const handleYear = (newYear) => onChange(name, `${newYear}-${m || "01"}-${d || "01"}`);

  return (
    <div className="mb-5">
      <label className={`block text-sm font-semibold mb-1 ${error ? "text-red-400" : "text-white"}`}>
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-3">
        <SelectDropdown value={d} onChange={handleDay} options={days} placeholder="Tanggal" error={error} />
        <SelectDropdown value={m} onChange={handleMonth} options={months} placeholder="Bulan" error={error} />
        <SelectDropdown value={y} onChange={handleYear} options={years} placeholder="Tahun" error={error} />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">Field ini wajib diisi lengkap</p>}
    </div>
  );
}

// ============================================================
// MAIN FORM COMPONENT
// ============================================================
export default function FormOprec() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [prestasiList, setPrestasiList] = useState([{ id: Date.now(), nama: "", fileKey: `prestasi_${Date.now()}` }]);
  const [organisasiList, setOrganisasiList] = useState([{ id: Date.now() + 1, nama: "", fileKey: `organisasi_${Date.now() + 1}` }]);
  const [komunitasList, setKomunitasList] = useState([{ id: Date.now() + 2, nama: "", fileKey: `komunitas_${Date.now() + 2}` }]);
  
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const formRef = useRef(null);
  const sigCanvas = useRef({});

  const activeBatch = getActiveBatch();

  // Handle Google Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Load Draft
        const draftStr = localStorage.getItem(`oprec_draft_${currentUser.uid}`);
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            setFormData(draft.formData || initialFormData);
            setCurrentStep(draft.currentStep || 1);
            if (draft.prestasiList) setPrestasiList(draft.prestasiList);
            if (draft.organisasiList) setOrganisasiList(draft.organisasiList);
            if (draft.komunitasList) setKomunitasList(draft.komunitasList);
          } catch (e) {
            console.error("Failed to parse draft", e);
          }
        }
        
        // Load files from IDB
        getAllFilesFromDB(currentUser.uid)
          .then(loadedFiles => setFiles(loadedFiles))
          .catch(err => console.error("Failed to load files from IDB", err));
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Save Draft
  useEffect(() => {
    if (user && !submitSuccess) {
      try {
        const formDataToSave = { ...formData, signature: "" }; // Hilangkan signature dari draft
        const draft = { formData: formDataToSave, currentStep, prestasiList, organisasiList, komunitasList };
        localStorage.setItem(`oprec_draft_${user.uid}`, JSON.stringify(draft));
      } catch (err) {
        console.warn("Draft localStorage penuh atau gagal disimpan:", err);
      }
    }
  }, [formData, currentStep, prestasiList, organisasiList, komunitasList, user, submitSuccess]);

  // Restore Signature from Draft when Step 6 is mounted
  useEffect(() => {
    if (currentStep === 6 && sigCanvas.current && formData.signature) {
      // Small timeout to ensure canvas is fully rendered before drawing
      setTimeout(() => {
        if (sigCanvas.current && sigCanvas.current.isEmpty()) {
          sigCanvas.current.fromDataURL(formData.signature);
        }
      }, 50);
    }
  }, [currentStep, formData.signature]);

  const handleGoogleLogin = async (forceSelect = false) => {
    try {
      if (forceSelect) {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
      } else {
        googleProvider.setCustomParameters({});
      }
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      alert("Gagal login dengan Google: " + err.message);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Dynamic Lists Handlers
  const handleDynamicChange = (listType, id, val) => {
    const setList = listType === 'prestasi' ? setPrestasiList : listType === 'organisasi' ? setOrganisasiList : setKomunitasList;
    setList(prev => prev.map(item => item.id === id ? { ...item, nama: val } : item));
  };
  const addDynamicItem = (listType) => {
    const setList = listType === 'prestasi' ? setPrestasiList : listType === 'organisasi' ? setOrganisasiList : setKomunitasList;
    setList(prev => [...prev, { id: Date.now(), nama: "", fileKey: `${listType}_${Date.now()}` }]);
  };
  const removeDynamicItem = (listType, id) => {
    const setList = listType === 'prestasi' ? setPrestasiList : listType === 'organisasi' ? setOrganisasiList : setKomunitasList;
    const list = listType === 'prestasi' ? prestasiList : listType === 'organisasi' ? organisasiList : komunitasList;
    const itemToRemove = list.find(item => item.id === id);
    setList(prev => prev.filter(item => item.id !== id));
    
    if (itemToRemove && itemToRemove.fileKey) {
       handleFileUpdate(itemToRemove.fileKey, null);
    }
  };

  const handleFileUpdate = async (fileKey, file) => {
    if (file) {
      setFiles(prev => ({ ...prev, [fileKey]: file }));
      if (user?.uid) await saveFileToDB(`${user.uid}_${fileKey}`, file);
    } else {
      setFiles(prev => {
        const next = { ...prev };
        delete next[fileKey];
        return next;
      });
      if (user?.uid) await removeFileFromDB(`${user.uid}_${fileKey}`);
    }
  };

  // ============================================================
  // VALIDATION PER STEP
  // ============================================================
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.namaLengkap) newErrors.namaLengkap = true;
      if (!formData.tanggalLahir) newErrors.tanggalLahir = true;
      if (!formData.programStudi) newErrors.programStudi = true;
      if (!formData.agama) newErrors.agama = true;
      if (formData.agama === "Lainnya" && !formData.agamaLainnya) newErrors.agama = true;
      if (!formData.jalurMasuk) newErrors.jalurMasuk = true;
      if (!formData.anakKeDari) newErrors.anakKeDari = true;
      if (!formData.asalDaerah) newErrors.asalDaerah = true;
      if (!formData.asalSekolah) newErrors.asalSekolah = true;
      if (!formData.nomorWhatsapp) newErrors.nomorWhatsapp = true;
      if (!files.fotoFormal) newErrors.fotoFormal = true;
      if (!files.fotoKtp) newErrors.fotoKtp = true;
      if (!files.buktiDiterima) newErrors.buktiDiterima = true;
    } else if (step === 2) {
      if (!formData.namaAyah) newErrors.namaAyah = true;
      if (!formData.nomorTeleponAyah) newErrors.nomorTeleponAyah = true;
      if (!formData.pekerjaanAyah) newErrors.pekerjaanAyah = true;
      if (!formData.penghasilanAyahPerBulan) newErrors.penghasilanAyahPerBulan = true;
      if (!formData.namaIbu) newErrors.namaIbu = true;
      if (!formData.nomorTeleponIbu) newErrors.nomorTeleponIbu = true;
      if (!formData.pekerjaanIbu) newErrors.pekerjaanIbu = true;
      if (!formData.penghasilanIbuPerBulan) newErrors.penghasilanIbuPerBulan = true;
      if (!files.slipGajiOrtu) newErrors.slipGajiOrtu = true;
      if (!formData.namaWali) newErrors.namaWali = true;
      if (!formData.hubunganWali) newErrors.hubunganWali = true;
      if (formData.hubunganWali === "Lainnya" && !formData.hubunganWaliLainnya) newErrors.hubunganWali = true;
      if (!formData.nomorTeleponWali) newErrors.nomorTeleponWali = true;
    } else if (step === 3) {
      if (!formData.penerimaKipK) newErrors.penerimaKipK = true;
      if (formData.penerimaKipK === "Tidak" && formData.jalurMasuk === "SNBP" && !formData.ukt) newErrors.ukt = true;
      if (!formData.rencanaUangKirimanBulanan) newErrors.rencanaUangKirimanBulanan = true;
      if (!formData.sumberUangBulanan) newErrors.sumberUangBulanan = true;
      if (formData.sumberUangBulanan === "Lainnya" && !formData.sumberUangLainnya) newErrors.sumberUangBulanan = true;
      if (!formData.rencanaPengeluaranBulanan) newErrors.rencanaPengeluaranBulanan = true;
      if (!formData.statusTempatTinggal) newErrors.statusTempatTinggal = true;
      if (formData.statusTempatTinggal === "Lainnya" && !formData.statusTempatTinggalLainnya) newErrors.statusTempatTinggal = true;
      if (!files.buktiTagihanListrik) newErrors.buktiTagihanListrik = true;
      if (!formData.rencanaTransportasi) newErrors.rencanaTransportasi = true;
      if (formData.rencanaTransportasi === "Lainnya" && !formData.rencanaTransportasiLainnya) newErrors.rencanaTransportasi = true;
      if (!formData.bersediaUangPangkal) newErrors.bersediaUangPangkal = true;
      if (!formData.bersediaIuranBulanan) newErrors.bersediaIuranBulanan = true;
    } else if (step === 4) {
      if (!formData.ceritaDiri) newErrors.ceritaDiri = true;
    } else if (step === 5) {
      if (!formData.usernameInstagram) newErrors.usernameInstagram = true;
      if (!files.buktiUploadTwibbon) newErrors.buktiUploadTwibbon = true;
      if (!files.buktiSharePoster) newErrors.buktiSharePoster = true;
      if (!files.buktiFollowInstagram) newErrors.buktiFollowInstagram = true;
    } else if (step === 6) {
      if (!formData.signature) newErrors.signature = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 6));
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowValidationModal(true);
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================
  // UPLOAD FILE TO FIREBASE STORAGE
  // ============================================================
  const uploadFile = async (file, path) => {
    if (!file) return "";
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  // ============================================================
  // SUBMIT FORM
  // ============================================================
  const handleSubmit = async () => {
    if (!validateStep(6)) {
      setShowValidationModal(true);
      return;
    }
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();
      const safeName = formData.namaLengkap.replace(/[^a-zA-Z0-9]/g, "_");

      const fileUploads = {};
      const fileKeys = [
        "fotoFormal", "fotoKtp", "buktiDiterima", "slipGajiOrtu",
        "buktiTagihanListrik", "buktiUploadTwibbon", "buktiSharePoster", "buktiFollowInstagram"
      ];
      
      // Collect dynamic file keys
      [...prestasiList, ...organisasiList, ...komunitasList].forEach(item => {
         if(item.nama) fileKeys.push(item.fileKey);
      });

      for (const key of fileKeys) {
        if (files[key]) {
          const ext = files[key].name.split(".").pop();
          fileUploads[`${key}Url`] = await uploadFile(files[key], `oprec/${safeName}_${timestamp}/${key}.${ext}`);
        } else {
          fileUploads[`${key}Url`] = "";
        }
      }

      // Format dynamic lists for DB
      const formatList = (list) => list.filter(l => l.nama).map(l => ({ nama: l.nama, url: fileUploads[`${l.fileKey}Url`] || "" }));

      const docData = {
        createdAt: Timestamp.now(),
        batch: activeBatch?.name || "UNKNOWN",
        email: user.email,

        // Identitas Diri
        namaLengkap: formData.namaLengkap,
        tanggalLahir: formData.tanggalLahir,
        programStudi: formData.programStudi,
        agama: formData.agama === "Lainnya" ? formData.agamaLainnya : formData.agama,
        jalurMasuk: formData.jalurMasuk,
        anakKeDari: formData.anakKeDari,
        asalDaerah: formData.asalDaerah,
        asalSekolah: formData.asalSekolah,
        nomorWhatsapp: formData.nomorWhatsapp,
        riwayatPenyakit: formData.riwayatPenyakit || "-",
        ...{ fotoFormalUrl: fileUploads.fotoFormalUrl, fotoKtpUrl: fileUploads.fotoKtpUrl, buktiDiterimaUrl: fileUploads.buktiDiterimaUrl },

        // Data Orang Tua/Wali
        namaAyah: formData.namaAyah,
        nomorTeleponAyah: formData.nomorTeleponAyah,
        pekerjaanAyah: formData.pekerjaanAyah,
        penghasilanAyahPerBulan: formData.penghasilanAyahPerBulan,
        namaIbu: formData.namaIbu,
        nomorTeleponIbu: formData.nomorTeleponIbu,
        pekerjaanIbu: formData.pekerjaanIbu,
        penghasilanIbuPerBulan: formData.penghasilanIbuPerBulan,
        slipGajiOrtuUrl: fileUploads.slipGajiOrtuUrl,
        namaWali: formData.namaWali,
        hubunganWali: formData.hubunganWali === "Lainnya" ? formData.hubunganWaliLainnya : formData.hubunganWali,
        nomorTeleponWali: formData.nomorTeleponWali,

        // Data Keuangan
        penerimaKipK: formData.penerimaKipK,
        ukt: formData.ukt || "-",
        rencanaUangKirimanBulanan: formData.rencanaUangKirimanBulanan,
        sumberUangBulanan: formData.sumberUangBulanan === "Lainnya" ? formData.sumberUangLainnya : formData.sumberUangBulanan,
        rencanaPengeluaranBulanan: formData.rencanaPengeluaranBulanan,
        statusTempatTinggal: formData.statusTempatTinggal === "Lainnya" ? formData.statusTempatTinggalLainnya : formData.statusTempatTinggal,
        buktiTagihanListrikUrl: fileUploads.buktiTagihanListrikUrl,
        rencanaTransportasi: formData.rencanaTransportasi === "Lainnya" ? formData.rencanaTransportasiLainnya : formData.rencanaTransportasi,
        bersediaUangPangkal: formData.bersediaUangPangkal,
        bersediaIuranBulanan: formData.bersediaIuranBulanan,

        // Data Pengalaman Pribadi
        prestasiArray: formatList(prestasiList),
        organisasiArray: formatList(organisasiList),
        komunitasArray: formatList(komunitasList),
        ceritaDiri: formData.ceritaDiri,
        portofolio: formData.portofolio || "-",

        // Media
        usernameInstagram: formData.usernameInstagram,
        buktiUploadTwibbonUrl: fileUploads.buktiUploadTwibbonUrl,
        buktiSharePosterUrl: fileUploads.buktiSharePosterUrl,
        buktiFollowInstagramUrl: fileUploads.buktiFollowInstagramUrl,

        // Pakta Integritas
        signatureUrl: formData.signature,
      };

      await addDoc(collection(db, "bakalCalonPenghuni"), docData);
      localStorage.removeItem(`oprec_draft_${user.uid}`);
      await clearFilesFromDB(user.uid);
      setFiles({});
      setSubmitSuccess(true);
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submit error:", err);
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.\n\n" + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // RENDER BLOCKS
  // ============================================================
  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] mix-blend-screen" />

        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center max-w-md w-full shadow-2xl relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <svg className="w-10 h-10 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Autentikasi Diperlukan</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            The name, email, and photo associated with your Google account will be recorded when you upload files and submit this form. Progress Anda akan otomatis disimpan.
          </p>
          <button onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Pendaftaran Berhasil! 🎉</h2>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Data pendaftaran Anda telah kami terima. Langkah selanjutnya adalah <b>wajib bergabung dengan Grup WhatsApp</b> peserta rekrutmen.
          </p>
          <a href="https://chat.whatsapp.com/GFZITLcvYXpLqBSgpwrHdo" target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-center gap-3 w-full mb-4 px-6 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1DA851] transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transform hover:-translate-y-1">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.888-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
             Gabung Grup WhatsApp
          </a>
          <button onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/10">
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    const slideVariant = { enter: { x: 30, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -30, opacity: 0 } };

    switch (currentStep) {
      case 1:
        return (
          <motion.div key="step1" variants={slideVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">👤 Identitas Diri</h3>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl mb-6 relative z-10">
               <div className="flex items-center gap-4">
                 {user.photoURL ? (
                   <img src={user.photoURL} alt="profile" className="w-12 h-12 rounded-full object-cover bg-white/10" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || "User") + "&background=random"; }} />
                 ) : (
                   <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl font-bold">
                     {(user.displayName || user.email || "U")[0].toUpperCase()}
                   </div>
                 )}
                 <div>
                   <p className="text-white font-medium text-sm">{user.displayName || "Pengguna OPREC"}</p>
                   <p className="text-gray-400 text-xs">{user.email}</p>
                 </div>
               </div>
               <button 
                 type="button"
                 onClick={() => handleGoogleLogin(true)} 
                 className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors border border-red-500/20 cursor-pointer relative z-20">
                 Ganti Akun
               </button>
            </div>
            <TextInput label="Nama Lengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} placeholder="Nama lengkap sesuai KTP" required error={errors.namaLengkap} />
            <DateInput label="Tanggal Lahir" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required error={errors.tanggalLahir} />
            <SelectInput label="Program Studi" name="programStudi" value={formData.programStudi} onChange={handleChange} options={PRODI_LIST} placeholder="Pilih Program Studi" required error={errors.programStudi} />
            <SelectInput label="Agama" name="agama" value={formData.agama} onChange={handleChange} options={AGAMA_LIST} placeholder="Pilih Agama" required error={errors.agama} />
            <TextInput label="Anak ke ... dari ..." name="anakKeDari" value={formData.anakKeDari} onChange={handleChange} placeholder="Contoh: 2 dari 4" required hint="Contoh: 2 dari 4" error={errors.anakKeDari} />
            <TextInput label="Asal Daerah" name="asalDaerah" value={formData.asalDaerah} onChange={handleChange} placeholder="Contoh: Kota Bogor" required hint="Contoh: Kota Bogor" error={errors.asalDaerah} />
            <TextInput label="Asal Sekolah" name="asalSekolah" value={formData.asalSekolah} onChange={handleChange} placeholder="Contoh: SMAN 1 Bogor" required hint="Contoh: SMAN 1 Bogor" error={errors.asalSekolah} />
            <TextInput label="Nomor WhatsApp" name="nomorWhatsapp" value={formData.nomorWhatsapp} onChange={handleChange} placeholder="Contoh: 08123456789" required hint="Contoh: 08123456789" error={errors.nomorWhatsapp} />
            <TextInput label="Riwayat Penyakit" name="riwayatPenyakit" value={formData.riwayatPenyakit} onChange={handleChange} placeholder="Isi jika ada, kosongkan jika tidak" error={errors.riwayatPenyakit} />
            <SelectInput label="Jalur Masuk" name="jalurMasuk" value={formData.jalurMasuk} onChange={handleChange} options={JALUR_MASUK_LIST} placeholder="Pilih Jalur Masuk" required error={errors.jalurMasuk} />
            <FileUpload label="Foto Formal" hint="Ukuran 3x4 background biru" accept="image/*" maxSizeMB={10} fileKey="fotoFormal" files={files} onFileUpdate={handleFileUpdate} required error={errors.fotoFormal} />
            <FileUpload label="Foto KTP" accept="image/*" maxSizeMB={10} fileKey="fotoKtp" files={files} onFileUpdate={handleFileUpdate} required error={errors.fotoKtp} />
            <FileUpload label="Bukti Diterima di Sekolah Vokasi IPB University" accept="image/*" maxSizeMB={10} fileKey="buktiDiterima" files={files} onFileUpdate={handleFileUpdate} required error={errors.buktiDiterima} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" variants={slideVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">👨‍👩‍👦 Data Orang Tua / Wali</h3>
            <TextInput label="Nama Ayah" name="namaAyah" value={formData.namaAyah} onChange={handleChange} placeholder="Nama lengkap ayah" hint="(Jika sudah meninggal kasih - saja)" required error={errors.namaAyah} />
            <TextInput label="Nomor Telepon Ayah" name="nomorTeleponAyah" value={formData.nomorTeleponAyah} onChange={handleChange} placeholder="Contoh: 08123456789" required hint="Contoh: 08123456789" error={errors.nomorTeleponAyah} />
            <TextInput label="Pekerjaan Ayah" name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleChange} placeholder="Pekerjaan ayah" required error={errors.pekerjaanAyah} />
            <TextInput label="Penghasilan Ayah per Bulan" name="penghasilanAyahPerBulan" value={formData.penghasilanAyahPerBulan} onChange={handleChange} placeholder="Contoh: 2500000" required hint="Contoh: 2500000" error={errors.penghasilanAyahPerBulan} />
            <TextInput label="Nama Ibu" name="namaIbu" value={formData.namaIbu} onChange={handleChange} placeholder="Nama lengkap ibu" hint="(Jika sudah meninggal kasih - saja)" required error={errors.namaIbu} />
            <TextInput label="Nomor Telepon Ibu" name="nomorTeleponIbu" value={formData.nomorTeleponIbu} onChange={handleChange} placeholder="Contoh: 08123456789" required hint="Contoh: 08123456789" error={errors.nomorTeleponIbu} />
            <TextInput label="Pekerjaan Ibu" name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleChange} placeholder="Pekerjaan ibu" required error={errors.pekerjaanIbu} />
            <TextInput label="Penghasilan Ibu per Bulan" name="penghasilanIbuPerBulan" value={formData.penghasilanIbuPerBulan} onChange={handleChange} placeholder="Contoh: 2500000" required hint="Contoh: 2500000" error={errors.penghasilanIbuPerBulan} />
            <FileUpload label="Slip Gaji Orang Tua" hint="Jika Ayah dan Ibu bekerja, slip gaji jadikan satu dalam bentuk PDF" accept="application/pdf,image/*" maxSizeMB={10} fileKey="slipGajiOrtu" files={files} onFileUpdate={handleFileUpdate} required error={errors.slipGajiOrtu} />
            <TextInput label="Nama Wali" name="namaWali" value={formData.namaWali} onChange={handleChange} placeholder="Nama Wali" required hint="Sebagai <b>kontak darurat atau pengganti orang tua</b>" error={errors.namaWali} />
            <RadioGroup label="Wali Sebagai Siapa dari Pendaftar" name="hubunganWali" options={["Kakak", "Adik", "Paman", "Bibi", "Bude", "Pakde"]}
              value={formData.hubunganWali} onChange={(v) => handleChange("hubunganWali", v)} required error={errors.hubunganWali}
              hasOther otherValue={formData.hubunganWaliLainnya} onOtherChange={(v) => handleChange("hubunganWaliLainnya", v)} />
            <TextInput label="Nomor Telepon Wali" name="nomorTeleponWali" value={formData.nomorTeleponWali} onChange={handleChange} placeholder="Contoh: 08123456789" required hint="Contoh: 08123456789" error={errors.nomorTeleponWali} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" variants={slideVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">💰 Data Keuangan</h3>
            <RadioGroup label="Apakah Anda Penerima KIP-K?" name="penerimaKipK" options={["Ya", "Tidak"]}
              value={formData.penerimaKipK} onChange={(v) => handleChange("penerimaKipK", v)} required error={errors.penerimaKipK} />
            
            {formData.penerimaKipK === "Tidak" && formData.jalurMasuk === "SNBP" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-5 overflow-hidden">
                <TextInput label="Berapa UKT Anda" name="ukt" value={formData.ukt} onChange={handleChange} placeholder="Contoh: 4000000" required error={errors.ukt} />
              </motion.div>
            )}

            <TextInput label="Rencana Uang Kiriman Bulanan" name="rencanaUangKirimanBulanan" value={formData.rencanaUangKirimanBulanan} onChange={handleChange} placeholder="Contoh: 750000" required hint="Contoh: 750000" error={errors.rencanaUangKirimanBulanan} />
            <RadioGroup label="Sumber Uang Bulanan" name="sumberUangBulanan" options={["Orang Tua/Wali", "KIP-K", "Pekerjaan Sampingan", "Tabungan"]}
              value={formData.sumberUangBulanan} onChange={(v) => handleChange("sumberUangBulanan", v)} required error={errors.sumberUangBulanan}
              hasOther otherValue={formData.sumberUangLainnya} onOtherChange={(v) => handleChange("sumberUangLainnya", v)} />
            <TextInput label="Rencana Pengeluaran Bulanan" name="rencanaPengeluaranBulanan" value={formData.rencanaPengeluaranBulanan} onChange={handleChange} placeholder="Contoh: 600000" required hint="Contoh: 600000" error={errors.rencanaPengeluaranBulanan} />
            <RadioGroup label="Status Tempat Tinggal" name="statusTempatTinggal" options={["Rumah Tetap", "Kontrak/Sewa", "Tinggal bersama wali"]}
              value={formData.statusTempatTinggal} onChange={(v) => handleChange("statusTempatTinggal", v)} required error={errors.statusTempatTinggal}
              hasOther otherValue={formData.statusTempatTinggalLainnya} onOtherChange={(v) => handleChange("statusTempatTinggalLainnya", v)} />
            <FileUpload label="Bukti Tagihan Listrik 3 Bulan Terakhir" hint="Tagihan 3 bulan terakhir kumpulkan dalam 1 PDF" accept="application/pdf" maxSizeMB={10} fileKey="buktiTagihanListrik" files={files} onFileUpdate={handleFileUpdate} required error={errors.buktiTagihanListrik} />
            <RadioGroup label="Rencana Moda Transportasi ke Kampus" name="rencanaTransportasi"
              options={["Sepeda", "Motor Pribadi", "Mobil Pribadi", "Ojek Online", "Angkutan Umum", "Jalan Kaki"]}
              value={formData.rencanaTransportasi} onChange={(v) => handleChange("rencanaTransportasi", v)} required error={errors.rencanaTransportasi}
              hasOther otherValue={formData.rencanaTransportasiLainnya} onOtherChange={(v) => handleChange("rencanaTransportasiLainnya", v)} />
            <div className={`bg-orange-500/10 border rounded-xl p-4 mb-5 ${errors.bersediaUangPangkal ? "border-red-500" : "border-orange-500/30"}`}>
              <p className="text-sm text-orange-200 font-medium mb-1">Uang Pangkal Asrama</p>
              <p className="text-xs text-gray-300 mb-3">Uang Pangkal Asrama merupakan kewajiban bagi setiap penghuni baru yang akan mulai menetap di asrama.</p>
              <RadioGroup label="Apakah Anda Siap dan Bersedia Membayar Uang Pangkal Asrama sebesar Rp400.000/bulan selama 3 bulan pertama?"
                name="bersediaUangPangkal" options={["Ya", "Tidak"]}
                value={formData.bersediaUangPangkal} onChange={(v) => handleChange("bersediaUangPangkal", v)} required error={errors.bersediaUangPangkal} />
            </div>
            <RadioGroup label="Apakah Anda Siap dan Bersedia Membayar Iuran Bulanan Asrama sebesar Rp70.000?"
              name="bersediaIuranBulanan" options={["Ya", "Tidak"]}
              value={formData.bersediaIuranBulanan} onChange={(v) => handleChange("bersediaIuranBulanan", v)} required error={errors.bersediaIuranBulanan} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" variants={slideVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">🏆 Data Pengalaman Pribadi</h3>
            
            {/* PRESTASI */}
            <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/10">
              <h4 className="font-semibold text-orange-400 mb-3">Prestasi</h4>
              {prestasiList.map((item, idx) => (
                <div key={item.id} className="mb-4 pb-4 border-b border-white/10 last:border-0 last:pb-0 relative group">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-white">Nama Prestasi {idx + 1}</label>
                      {prestasiList.length > 1 && (
                        <button onClick={() => removeDynamicItem('prestasi', item.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                          Hapus
                        </button>
                      )}
                    </div>
                    <input type="text" value={item.nama} onChange={(e) => handleDynamicChange('prestasi', item.id, e.target.value)} placeholder="Contoh: Juara 2 OSN Matematika Provinsi"
                      className="w-full bg-white/5 border border-white/15 focus:border-orange-400 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all" />
                  </div>
                  <FileUpload label={`Bukti Prestasi ${idx + 1}`} hint="Sertifikat" accept="application/pdf,image/*" maxSizeMB={5} fileKey={item.fileKey} files={files} onFileUpdate={handleFileUpdate} />
                </div>
              ))}
              <button onClick={() => addDynamicItem('prestasi')} className="text-sm text-orange-400 hover:text-orange-300 font-medium">+ Tambah Prestasi Lainnya</button>
            </div>

            {/* ORGANISASI */}
            <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/10">
              <h4 className="font-semibold text-orange-400 mb-3">Organisasi</h4>
              {organisasiList.map((item, idx) => (
                <div key={item.id} className="mb-4 pb-4 border-b border-white/10 last:border-0 last:pb-0 relative group">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-white">Nama Organisasi {idx + 1}</label>
                      {organisasiList.length > 1 && (
                        <button onClick={() => removeDynamicItem('organisasi', item.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                          Hapus
                        </button>
                      )}
                    </div>
                    <input type="text" value={item.nama} onChange={(e) => handleDynamicChange('organisasi', item.id, e.target.value)} placeholder="Contoh: Wakil Ketua PMR SMAN 1 Bogor"
                      className="w-full bg-white/5 border border-white/15 focus:border-orange-400 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all" />
                  </div>
                  <FileUpload label={`Bukti Organisasi ${idx + 1}`} hint="Sertifikat" accept="application/pdf,image/*" maxSizeMB={5} fileKey={item.fileKey} files={files} onFileUpdate={handleFileUpdate} />
                </div>
              ))}
              <button onClick={() => addDynamicItem('organisasi')} className="text-sm text-orange-400 hover:text-orange-300 font-medium">+ Tambah Organisasi Lainnya</button>
            </div>

            {/* KOMUNITAS */}
            <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/10">
              <h4 className="font-semibold text-orange-400 mb-3">Komunitas</h4>
              {komunitasList.map((item, idx) => (
                <div key={item.id} className="mb-4 pb-4 border-b border-white/10 last:border-0 last:pb-0 relative group">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-white">Nama Komunitas {idx + 1}</label>
                      {komunitasList.length > 1 && (
                        <button onClick={() => removeDynamicItem('komunitas', item.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                          Hapus
                        </button>
                      )}
                    </div>
                    <input type="text" value={item.nama} onChange={(e) => handleDynamicChange('komunitas', item.id, e.target.value)} placeholder="Contoh: Anggota Bogor Berlari"
                      className="w-full bg-white/5 border border-white/15 focus:border-orange-400 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all" />
                  </div>
                  <FileUpload label={`Bukti Komunitas ${idx + 1}`} hint="Sertifikat atau foto kegiatan" accept="application/pdf,image/*" maxSizeMB={5} fileKey={item.fileKey} files={files} onFileUpdate={handleFileUpdate} />
                </div>
              ))}
              <button onClick={() => addDynamicItem('komunitas')} className="text-sm text-orange-400 hover:text-orange-300 font-medium">+ Tambah Komunitas Lainnya</button>
            </div>

            <TextInput label="Portofolio IT/Seni/Kreatif lainnya" name="portofolio" value={formData.portofolio} onChange={handleChange} placeholder="Masukkan link portofolio (Gdrive/Behance/Github) opsional" hint="Opsional, masukkan link URL" />

            <div className="mb-5">
              <label className={`block text-sm font-semibold mb-1 ${errors.ceritaDiri ? "text-red-400" : "text-white"}`}>
                Ceritakan Apapun tentang Diri Anda <span className="text-orange-400">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">Maksimal 100 kata</p>
              <textarea value={formData.ceritaDiri} onChange={(e) => handleChange("ceritaDiri", e.target.value)}
                placeholder="Tuliskan cerita singkat tentang diri Anda..."
                rows={5} maxLength={700}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:bg-white/10 transition-all duration-200 resize-none ${errors.ceritaDiri ? "border-red-500 focus:border-red-400 bg-red-500/5" : "border-white/15 focus:border-orange-400"}`} />
              {errors.ceritaDiri && <p className="text-xs text-red-400 mt-1">Field ini wajib diisi</p>}
              <p className="text-xs text-gray-500 mt-1 text-right">{formData.ceritaDiri.split(/\s+/).filter(Boolean).length} / 100 kata</p>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" variants={slideVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">📸 Media & Bukti Syarat</h3>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-200 mb-2">📌 Pastikan Anda sudah:</p>
              <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                <li>Follow Instagram <a href="https://instagram.com/asramaipbsukasari" target="_blank" rel="noopener noreferrer" className="text-orange-400 font-semibold">@asramaipbsukasari</a></li>
                <li>Upload twibbon dengan foto terbaikmu ke akun Instagram kamu</li>
                <li>Share poster open recruitment ke story Instagram</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">Seluruh konten yang diperlukan dapat diakses di:
                <a href="https://drive.google.com/drive/folders/1Df5g_BB7jt1GRcCHfN_HyPtLg-C8iuzm" target="_blank" rel="noopener noreferrer" className="text-blue-400 ml-1 underline">Google Drive</a>
              </p>
            </div>
            
            <TextInput label="Username Instagram" name="usernameInstagram" value={formData.usernameInstagram} onChange={handleChange} placeholder="@username" required error={errors.usernameInstagram} />

            <FileUpload label="Screenshot Bukti Upload Twibbon" hint="Upload twibbon dengan foto terbaikmu ke akun Instagram kamu" accept="image/*" maxSizeMB={1} fileKey="buktiUploadTwibbon" files={files} onFileUpdate={handleFileUpdate} required error={errors.buktiUploadTwibbon} />
            <FileUpload label="Screenshot Bukti Share Poster" hint="Share poster rekrutmen ke story Instagram kamu" accept="image/*" maxSizeMB={1} fileKey="buktiSharePoster" files={files} onFileUpdate={handleFileUpdate} required error={errors.buktiSharePoster} />
            <FileUpload label="Screenshot Bukti Follow Instagram @asramaipbsukasari" accept="image/*" maxSizeMB={1} fileKey="buktiFollowInstagram" files={files} onFileUpdate={handleFileUpdate} required error={errors.buktiFollowInstagram} />
          </motion.div>
        );
      case 6:
        return (
          <motion.div key="step6" variants={slideVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">✅ Pakta Integritas</h3>
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-200 leading-relaxed mb-4">
                Saya menyatakan bahwa seluruh pertanyaan dan dokumen dalam pendaftaran penghuni Asrama IPB Sukasari saya isi dengan benar dan jujur.
              </p>
              <p className="text-sm text-gray-200 leading-relaxed">
                Apabila saya berbohong atau memanipulasi data maka saya siap untuk ditindak melalui proses hukum yang berlaku.
              </p>
            </div>
            
            <div className="mb-6">
               <label className={`block text-sm font-semibold mb-2 ${errors.signature ? "text-red-400" : "text-white"}`}>Tanda Tangan Elektronik <span className="text-orange-400">*</span></label>
               <p className="text-xs text-gray-400 mb-3">Silakan gambar tanda tangan Anda di dalam kotak putih di bawah ini. Gunakan mouse atau sentuhan jari. Anda dapat menggoreskan pena berkali-kali. Jika sudah selesai, wajib tekan tombol <b>Simpan Tanda Tangan</b>.</p>
               <div className={`bg-white rounded-xl overflow-hidden border-2 ${errors.signature && !formData.signature ? "border-red-500" : "border-gray-300"} h-48 w-full relative`}>
                 <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "w-full h-full" }} backgroundColor="white" />
                 {formData.signature && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Tersimpan
                    </div>
                 )}
               </div>
               <div className="flex justify-between items-center mt-3">
                 <button onClick={() => { 
                    if(!sigCanvas.current.isEmpty()) {
                      setFormData(prev => ({ ...prev, signature: sigCanvas.current.getCanvas().toDataURL('image/png') }));
                      if(errors.signature) setErrors(prev => ({ ...prev, signature: null }));
                    }
                 }} className="text-xs sm:text-sm text-white font-semibold bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors">
                    Simpan Tanda Tangan
                 </button>
                 <button onClick={() => { sigCanvas.current.clear(); setFormData(prev => ({ ...prev, signature: "" })); }} className="text-xs text-red-400 hover:text-red-300 font-medium bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors">
                    Hapus Ulang
                 </button>
               </div>
               {errors.signature && !formData.signature && <p className="text-xs text-red-400 mt-2">Tanda tangan wajib diisi dan disimpan</p>}
            </div>

          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex flex-col">
      <div className="w-full bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <h1 className="text-base sm:text-lg font-bold text-white text-center leading-snug">
            Formulir Pendaftaran Bakal Calon Penghuni Baru 2026
          </h1>
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Kembali
          </button>
        </div>
      </div>

      <div className="w-full bg-black/10 px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, i) => (
              <React.Fragment key={step.id}>
                <button onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    currentStep === step.id ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30" :
                    currentStep > step.id ? "bg-green-500 text-white" : "bg-white/10 text-gray-500"
                  }`}>
                  {currentStep > step.id ? "✓" : step.id}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${currentStep > step.id ? "bg-green-500" : "bg-white/10"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">{STEPS[currentStep - 1].title}</p>
        </div>
      </div>

      <div ref={formRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full bg-black/20 backdrop-blur-md border-t border-white/10 px-4 py-4 sticky bottom-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          {currentStep > 1 ? (
            <button onClick={prevStep}
              className="px-6 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-all border border-white/10">
              ← Kembali
            </button>
          ) : <div />}

          {currentStep < 6 ? (
            <button onClick={nextStep}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20">
              Lanjut →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting}
              className={`px-8 py-2.5 text-white text-sm font-semibold rounded-xl transition-all shadow-lg ${
                isSubmitting ? "bg-gray-600 cursor-wait" : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/20"
              }`}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Mengirim...
                </span>
              ) : "Submit Pendaftaran ✓"}
            </button>
          )}
        </div>

        {/* Contact Person */}
        <div className="max-w-2xl mx-auto mt-8 pt-3 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-[11px] md:text-xs text-gray-400">
          <span className="font-medium text-gray-300">Contact Person (WA):</span>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-center">
            <a href="https://wa.me/6282249943990" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.888-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              <span>+62 822-4994-3990 (M. Febryan)</span>
            </a>
            <a href="https://wa.me/6281287094218" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.888-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              <span>+62 812-8709-4218 (Raihan Alma)</span>
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showValidationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E293B] border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Data Belum Lengkap</h3>
              <p className="text-sm text-gray-300 mb-6">Mohon lengkapi semua isian wajib (bertanda bintang <span className="text-orange-400">*</span>) sebelum melanjutkan ke tahap berikutnya.</p>
              <button onClick={() => setShowValidationModal(false)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10">
                Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
