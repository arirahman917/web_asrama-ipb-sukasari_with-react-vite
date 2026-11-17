import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI7DAqPqKvIDTSJi60mzrB3N6atygMpBw",
  authDomain: "asrama-ipb-sukasari.firebaseapp.com",
  projectId: "asrama-ipb-sukasari",
  storageBucket: "asrama-ipb-sukasari.firebasestorage.app",
  messagingSenderId: "573037156718",
  appId: "1:573037156718:web:dbf1355ea6e8c6da83c97f",
  measurementId: "G-SXPXGKMWF9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log("Starting migration to 'penilaianBakalCalonPenghuni'...");
  try {
    const bakalCalonSnapshot = await getDocs(collection(db, "bakalCalonPenghuni"));
    let count = 0;
    
    for (const docSnap of bakalCalonSnapshot.docs) {
      const data = docSnap.data();
      const id = docSnap.id;
      
      const newDocData = {
        nama: data.namaLengkap || "Tanpa Nama",
        prodi: data.programStudi || "-",
        foto: data.fotoFormalUrl || "",
        sesi1: data.penilaian?.sesi1 || [],
        sesi2: data.penilaian?.sesi2 || []
      };
      
      await setDoc(doc(db, "penilaianBakalCalonPenghuni", id), newDocData);
      console.log(`Migrated doc ID: ${id}`);
      count++;
    }
    
    console.log(`Migration complete! Successfully migrated ${count} documents.`);
    process.exit(0);
  } catch (err) {
    console.error("Error during migration:", err);
    process.exit(1);
  }
}

migrate();
