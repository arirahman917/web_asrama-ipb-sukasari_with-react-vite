// Firebase Configuration (Lazy Initialized untuk performa Core Web Vitals)
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAI7DAqPqKvIDTSJi60mzrB3N6atygMpBw",
  authDomain: "asrama-ipb-sukasari.firebaseapp.com",
  projectId: "asrama-ipb-sukasari",
  storageBucket: "asrama-ipb-sukasari.firebasestorage.app",
  messagingSenderId: "573037156718",
  appId: "1:573037156718:web:dbf1355ea6e8c6da83c97f",
  measurementId: "G-SXPXGKMWF9"
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Lazy Proxy untuk Auth agar iframe auth dan identitytoolkit tidak dieksekusi di landing page
let _auth = null;
export const auth = new Proxy({}, {
  get(target, prop) {
    if (!_auth) _auth = getAuth(app);
    const val = _auth[prop];
    return typeof val === "function" ? val.bind(_auth) : val;
  }
});

let _googleProvider = null;
export const googleProvider = new Proxy({}, {
  get(target, prop) {
    if (!_googleProvider) _googleProvider = new GoogleAuthProvider();
    const val = _googleProvider[prop];
    return typeof val === "function" ? val.bind(_googleProvider) : val;
  }
});

let _storage = null;
export const storage = new Proxy({}, {
  get(target, prop) {
    if (!_storage) _storage = getStorage(app);
    const val = _storage[prop];
    return typeof val === "function" ? val.bind(_storage) : val;
  }
});

let _functions = null;
export const functions = new Proxy({}, {
  get(target, prop) {
    if (!_functions) _functions = getFunctions(app);
    const val = _functions[prop];
    return typeof val === "function" ? val.bind(_functions) : val;
  }
});

export default app;
