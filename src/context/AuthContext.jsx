import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
/* eslint-disable react-refresh/only-export-components */
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { isAllowedAdmin } from "../utils/admin";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const allowed = await isAllowedAdmin(currentUser);
      if (allowed) {
        setUser(currentUser);
        setIsAdmin(true);
        setError("");
      } else {
        // Bukan anggota asrama -> tolak & keluar otomatis.
        setError(
          `Akun ${currentUser.email} bukan anggota asrama. Hubungi pengurus untuk mendapat akses.`
        );
        try {
          await signOut(auth);
        } catch (e) {
          console.warn(e);
        }
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (forceSelect = true) => {
    setError("");
    try {
      if (forceSelect) googleProvider.setCustomParameters({ prompt: "select_account" });
      else googleProvider.setCustomParameters({});
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") return;
      console.error(err);
      setError("Gagal masuk dengan Google. Silakan coba lagi.");
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = { user, isAdmin, loading, error, login, logout, setError };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
