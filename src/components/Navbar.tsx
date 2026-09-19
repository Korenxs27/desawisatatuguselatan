"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ArrowRight, User, LogIn, LogOut } from "lucide-react";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // STATE STATUS LOGIN & AVATAR
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    // PENGECEKAN SESSION & AVATAR DARI LOCALSTORAGE
    const adminToken = localStorage.getItem("admin_token");
    const userToken = localStorage.getItem("user_token");
    const role = localStorage.getItem("user_role");
    const name = localStorage.getItem("user_name");
    const avatar = localStorage.getItem("user_avatar");

    if (adminToken) {
      setIsLoggedIn(true);
      setUserRole("admin");
      setUserName("Administrator");
      setUserAvatar(null);
    } else if (userToken) {
      setIsLoggedIn(true);
      setUserRole(role || "subscriber");
      setUserName(name || "Pengunjung");
      setUserAvatar(avatar || null);
    } else {
      setIsLoggedIn(false);
      setUserRole("");
      setUserName("");
      setUserAvatar(null);
    }
  }, [pathname]);

  // FUNGSI LOGOUT AMAN
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_avatar");

    setIsLoggedIn(false);
    setUserRole("");
    setUserName("");
    setUserAvatar(null);
    setIsMobileMenuOpen(false);
    
    router.push("/login");
    router.refresh();
  };

  // Jangan tampilkan navbar di halaman login atau admin panel
  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  // Daftar menu navigasi utama (Termasuk Menu Mitigasi)
  const menuItems = [
    { name: "Beranda", href: "/" },
    { name: "Profil Desa", href: "/profil" },
    { name: "Wisata", href: "/wisata" },
    { name: "UMKM", href: "/umkm" },
    { name: "Gallery", href: "/gallery" },
    { name: "Mitigasi", href: "/mitigasi" },
    { name: "Kontak", href: "/kontak" },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      {/* Container max-w-[1200px] w-full agar posisinya pas di tengah */}
      <div className="w-full max-w-[1200px] h-[70px] flex items-center justify-between px-6 bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-900/5 rounded-full">
        
        {/* Logo Berbentuk Gambar */}
        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-emerald-200 shadow-sm shrink-0">
            <img 
              src="/images/logo tugu selatan.jpg" 
              alt="Logo Tugu Selatan" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">Tugu Selatan</span>
        </Link>

        {/* Menu Navigasi Desktop (Tampil di Layar XL/Desktop) */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="hover:text-emerald-600 transition">
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search & Login / Profil Desktop */}
        <div className="hidden xl:flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200/80 transition shadow-sm flex items-center justify-center cursor-pointer"
            title="Cari"
          >
            <Search size={16} />
          </button>

          {!isLoggedIn ? (
            <a href="/login" className="bg-[#0f172a] hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-sm flex items-center gap-1.5">
              <LogIn size={13} /> LOGIN
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={userRole === "admin" ? "/admin" : "/user/dashboard"}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 hover:bg-emerald-500/20 transition"
                title={`Dashboard ${userName}`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white overflow-hidden flex items-center justify-center text-[10px] shrink-0 border border-emerald-400">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={12} />
                  )}
                </div>
                <span className="text-xs font-bold max-w-[90px] truncate">
                  {userName}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2 rounded-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Tombol Hamburger Menu & Search Cepat untuk Tampilan Mobile/Tablet */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 transition flex items-center justify-center"
            title="Cari"
          >
            <Search size={16} />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 transition flex items-center justify-center cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DROPDOWN / DRAWER */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[2rem] shadow-2xl p-6 flex flex-col space-y-4 xl:hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Status Akun di Mobile Menu */}
          {isLoggedIn ? (
            <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
              <Link 
                href={userRole === "admin" ? "/admin" : "/user/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white overflow-hidden flex items-center justify-center font-bold shadow-sm border border-emerald-400">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">Akun Aktif</span>
                  <span className="text-xs font-black text-slate-900">{userName}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Keluar"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <a
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-[#0f172a] text-white text-center py-3.5 rounded-2xl text-xs font-bold tracking-wide shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn size={15} /> LOGIN / MASUK AKUN
            </a>
          )}

          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 pt-2 border-t border-slate-100">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center justify-between"
              >
                {item.name} <ArrowRight size={14} className="text-slate-400" />
              </Link>
            ))}
          </div>

        </div>
      )}

      {/* Komponen Modal Search */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}