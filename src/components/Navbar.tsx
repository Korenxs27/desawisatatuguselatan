"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, LogIn, LogOut, Menu, X, Sparkles } from "lucide-react";
import SearchModal from "./SearchModal";

interface MenuItem {
  name: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State menu navigasi dinamis
  const [availableMenus, setAvailableMenus] = useState<MenuItem[]>([
    { name: "Beranda", href: "/" },
    { name: "Profil Desa", href: "/profil" },
    { name: "Gallery", href: "/gallery" },
    { name: "Mitigasi", href: "/mitigasi" },
    { name: "Kontak", href: "/kontak" },
  ]);

  // State autentikasi pengguna
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Verifikasi ketersediaan modul Wisata & UMKM dari Server
  const checkAvailableModules = async () => {
    const baseMenus: MenuItem[] = [
      { name: "Beranda", href: "/" },
      { name: "Profil Desa", href: "/profil" },
    ];

    const dynamicCandidates = [
      {
        name: "Wisata",
        href: "/wisata",
        endpoints: [
          "/api-wp/tugu-bridge/v1/get-wisata",
          "/api-wp/wp/v2/wisata?per_page=1",
        ],
      },
      {
        name: "UMKM",
        href: "/umkm",
        endpoints: [
          "/api-wp/tugu-bridge/v1/get-umkm",
          "/api-wp/wp/v2/umkm?per_page=1",
          "/api-wp/wp/v2/produk_umkm?per_page=1",
        ],
      },
    ];

    try {
      const checks = await Promise.all(
        dynamicCandidates.map(async (candidate) => {
          for (const url of candidate.endpoints) {
            try {
              const res = await fetch(url, {
                cache: "no-store",
                headers: {
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                  "Pragma": "no-cache",
                },
              });

              if (res.ok) {
                const data = await res.json();

                // 1. Data berupa Array
                if (Array.isArray(data)) {
                  const validItems = data.filter((item: any) => {
                    const name = (item.name || item.title?.rendered || "").toLowerCase();
                    const status = item.status || "publish";
                    return status === "publish" && name.trim().length > 0;
                  });

                  if (validItems.length > 0) {
                    return { name: candidate.name, href: candidate.href };
                  }
                }

                // 2. Data berupa Respons Objek Plugin Tugu Selatan
                if (data && typeof data === "object") {
                  const items = data.data || data.umkm || data.wisata || data.items || data.products;
                  
                  if (Array.isArray(items)) {
                    const validItems = items.filter((item: any) => {
                      const name = (item.nama || item.name || item.title?.rendered || item.post_title || "").toLowerCase();
                      return name.trim().length > 0;
                    });

                    if (validItems.length > 0) {
                      return { name: candidate.name, href: candidate.href };
                    }
                  }
                }
              }
            } catch (e) {
              // Lanjut ke endpoint berikutnya jika gagal
            }
          }
          return null;
        })
      );

      const validDynamicMenus = checks.filter((item): item is MenuItem => item !== null);

      const footerMenus: MenuItem[] = [
        { name: "Gallery", href: "/gallery" },
        { name: "Mitigasi", href: "/mitigasi" },
        { name: "Kontak", href: "/kontak" },
      ];

      setAvailableMenus([
        ...baseMenus,
        ...validDynamicMenus,
        ...footerMenus,
      ]);
    } catch (err) {
      console.error("Gagal verifikasi modul Tugu Selatan:", err);
    }
  };

  useEffect(() => {
    checkAvailableModules();

    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Pengecekan Sesi Login
    const adminToken = localStorage.getItem("admin_token");
    const userToken = localStorage.getItem("user_token");
    const role = localStorage.getItem("user_role");
    const name = localStorage.getItem("user_name");
    const avatar = localStorage.getItem("user_avatar");

    if (adminToken) {
      setIsLoggedIn(true);
      setUserRole("admin");
      setUserName("Administrator BPH");
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

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole("");
    setUserName("");
    setUserAvatar(null);
    setIsMobileMenuOpen(false);

    router.push("/login");
    router.refresh();
  };

  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-[999] mx-auto transition-all duration-500 px-4 sm:px-6 py-3 rounded-[2rem] bg-white/75 backdrop-blur-xl border border-slate-200/90 shadow-lg shadow-sky-950/5 max-w-7xl w-[95%] ${
          isScrolled ? "top-3 border-sky-300/60 shadow-sky-900/10" : "top-5"
        }`}
      >
        <div className="flex items-center justify-between w-full relative">
          
          {/* LOGO DESA WISATA TUGU SELATAN */}
          <Link href="/" className="flex items-center shrink-0 transition-transform duration-300 hover:scale-105 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-0.5 shadow-md shadow-sky-600/25 flex items-center justify-center shrink-0">
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-white">
                <Image
                  src="/images/logo tugu selatan.jpg"
                  alt="Logo Desa Tugu Selatan"
                  fill
                  priority
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="ml-3 flex flex-col">
              <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight leading-none group-hover:text-sky-600 transition">
                Tugu Selatan
              </span>
            </div>
          </Link>

          {/* MENU NAVIGASI DESKTOP */}
          <nav className="hidden lg:flex items-center gap-1.5 lg:gap-2">
            {availableMenus.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-bold tracking-wide px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-600/25"
                      : "text-slate-600 hover:text-sky-600 hover:bg-sky-50/80"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* FITUR PENCARIAN & AKUN */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center justify-between w-36 md:w-44 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl cursor-pointer transition gap-2 text-slate-500 hover:text-sky-600 hover:border-sky-300 group shadow-inner"
            >
              <span className="text-xs font-medium">Cari wisata/UMKM...</span>
              <Search size={14} className="transition text-slate-400 group-hover:text-sky-600" />
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition cursor-pointer"
              title="Cari"
            >
              <Search size={15} />
            </button>

            {/* AUTENTIKASI DESKTOP */}
            <div className="hidden sm:flex items-center gap-2">
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="text-xs font-bold text-white uppercase tracking-wider px-5 py-2.5 rounded-2xl shadow-md hover:shadow-sky-600/25 bg-[#0f172a] hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn size={13} /> Masuk
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={userRole === "admin" ? "/admin" : "/user/dashboard"}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 hover:bg-sky-100/80 transition shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white overflow-hidden flex items-center justify-center text-[10px] shrink-0 shadow-sm">
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
                    className="p-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* HAMBURGER MENU MOBILE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-800 hover:bg-sky-50 hover:text-sky-600 transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* DRAWER MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-20 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[2.5rem] p-6 shadow-2xl space-y-4 z-[998] animate-in fade-in zoom-in-95 duration-200">
          {isLoggedIn ? (
            <div className="flex items-center justify-between p-3.5 bg-sky-50/80 border border-sky-100 rounded-2xl">
              <Link
                href={userRole === "admin" ? "/admin" : "/user/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white overflow-hidden flex items-center justify-center font-bold shadow-md">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-600 block">Akun Aktif</span>
                  <span className="text-xs font-black text-slate-900">{userName}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition"
            >
              <LogIn size={15} /> Masuk Akun
            </Link>
          )}

          <div className="flex flex-col space-y-1.5 pt-2 border-t border-slate-100">
            {availableMenus.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-2xl text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50/80 transition flex items-center justify-between"
              >
                <span>{item.name}</span>
                <span className="text-slate-400 text-xs">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* MODAL SEARCH */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}