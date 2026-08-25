"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      {/* Container max-w-[1200px] w-full agar posisinya pas di tengah dan tidak mentok pojok */}
      <div className="w-full max-w-[1200px] h-[70px] flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-900/5 rounded-full">
        
        {/* Logo Berbentuk Gambar */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-emerald-200 shadow-sm shrink-0">
            {/* Pastikan file logonya bernama "logo tugu selatan.jpg" di dalam folder /public/images/ */}
            <img 
              src="/images/logo tugu selatan.jpg" 
              alt="Logo Tugu Selatan" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">Tugu Selatan</span>
        </Link>

        {/* Menu Navigasi */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-emerald-600 transition">Beranda</Link>
          <Link href="/profil" className="hover:text-emerald-600 transition">Profil Desa</Link>
          <Link href="/wisata" className="hover:text-emerald-600 transition">Wisata</Link>
          <Link href="/umkm" className="hover:text-emerald-600 transition">UMKM</Link>
          <Link href="/gallery" className="hover:text-emerald-600 transition">Gallery</Link>
          <Link href="/kontak" className="hover:text-emerald-600 transition">Kontak</Link>
        </nav>

        {/* Search & Login */}
        <div className="flex items-center gap-3">
          {/* Tombol Search yang mengaktifkan modal */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200/80 transition shadow-sm flex items-center justify-center cursor-pointer"
            title="Cari"
          >
            <Search size={16} />
          </button>

          <a href="/login" className="bg-[#0f172a] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm">
            LOGIN
          </a>
        </div>

      </div>

      {/* Komponen Modal Search yang dikontrol via props isOpen & onClose */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}