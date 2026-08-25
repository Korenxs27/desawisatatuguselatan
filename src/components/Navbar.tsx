"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      {/* Container max-w-[1200px] w-full agar posisinya pas di tengah dan tidak mentok pojok */}
      <div className="w-full max-w-[1200px] h-[70px] flex items-center justify-between px-6 bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-900/5 rounded-full">
        
        {/* Logo Berbentuk Gambar */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-emerald-200 shadow-sm shrink-0">
            <img 
              src="/images/logo tugu selatan.jpg" 
              alt="Logo Tugu Selatan" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">Tugu Selatan</span>
        </Link>

        {/* Menu Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-emerald-600 transition">Beranda</Link>
          <Link href="/profil" className="hover:text-emerald-600 transition">Profil Desa</Link>
          <Link href="/wisata" className="hover:text-emerald-600 transition">Wisata</Link>
          <Link href="/umkm" className="hover:text-emerald-600 transition">UMKM</Link>
          <Link href="/gallery" className="hover:text-emerald-600 transition">Gallery</Link>
          <Link href="/kontak" className="hover:text-emerald-600 transition">Kontak</Link>
        </nav>

        {/* Search & Login Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200/80 transition shadow-sm flex items-center justify-center cursor-pointer"
            title="Cari"
          >
            <Search size={16} />
          </button>

          <a href="/login" className="bg-[#0f172a] hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-sm">
            LOGIN
          </a>
        </div>

        {/* Tombol Hamburger Menu Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {/* Tombol Search Cepat di Mobile */}
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
        <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[2rem] shadow-2xl p-6 flex flex-col space-y-4 md:hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center justify-between"
            >
              Beranda <ArrowRight size={14} className="text-slate-400" />
            </Link>
            <Link 
              href="/profil" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center justify-between"
            >
              Profil Desa <ArrowRight size={14} className="text-slate-400" />
            </Link>
            <Link 
              href="/wisata" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center justify-between"
            >
              Wisata <ArrowRight size={14} className="text-slate-400" />
            </Link>
            <Link 
              href="/umkm" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center justify-between"
            >
              UMKM <ArrowRight size={14} className="text-slate-400" />
            </Link>
            <Link 
              href="/gallery" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center justify-between"
            >
              Gallery <ArrowRight size={14} className="text-slate-400" />
            </Link>
            <Link 
              href="/kontak" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center justify-between"
            >
              Kontak <ArrowRight size={14} className="text-slate-400" />
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <a 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-[#0f172a] text-white text-center py-3.5 rounded-2xl text-xs font-bold tracking-wide shadow-md transition"
            >
              LOGIN
            </a>
          </div>

        </div>
      )}

      {/* Komponen Modal Search yang dikontrol via props isOpen & onClose */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}