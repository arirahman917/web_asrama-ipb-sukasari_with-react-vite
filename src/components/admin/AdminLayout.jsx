import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Newspaper, Users, ShieldCheck,
  ClipboardList, LogOut, Menu, X,
} from "lucide-react";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/berita", label: "Berita", icon: Newspaper },
  { to: "/admin/alumni", label: "Kata Alumni", icon: Users },
  { to: "/admin/admins", label: "Kelola Admin", icon: ShieldCheck },
  { to: "/admin/respons", label: "Pendaftar OPREC", icon: ClipboardList },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Kunci scroll body saat drawer terbuka (mobile).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] lg:flex">

      {/* Backdrop (mobile) — overlay, tidak menggeser konten */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: off-canvas di mobile, statis di desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-[#0B132B]/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate">Admin Panel</h1>
            <p className="text-[11px] text-gray-400 truncate">Asrama IPB Sukasari</p>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white p-1 shrink-0"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {/* eslint-disable-next-line no-unused-vars */}
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={() => setOpen(false)}>
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="text-[11px] text-gray-400 truncate mb-2">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Konten: lebar penuh di mobile */}
      <div className="w-full min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-[#0B132B]/90 backdrop-blur-xl border-b border-white/10 lg:hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              className="text-white p-1 -ml-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-white font-semibold text-sm">Admin Panel</span>
          </div>
        </header>

        <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
