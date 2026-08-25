"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, ShoppingBag, ArrowUpRight, Tag, Calendar, ImageIcon } from "lucide-react";

export default function HomePage() {
  const [paketList] = useState([
    { id: 1, title: "Fun Offroad Adventure", slug: "fun-offroad", price: 1000000, img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600", desc: "Jelajahi jalur ekstrem pegunungan Tugu Selatan dengan armada Jeep tangguh." },
    { id: 2, title: "Trekking / Hiking Pegunungan", slug: "trekking", price: 125000, img: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=600", desc: "Nikmati udara sejuk kebun teh dengan pemandu lokal berpengalaman." },
    { id: 3, title: "Outbound Fun Games", slug: "outbound", price: 125000, img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600", desc: "Aktivitas kelompok seru di alam terbuka untuk instansi maupun keluarga." },
  ]);

  const [umkmList] = useState([
    { id: 1, name: "Keripik Singkong Pedas Manis", slug: "keripik-singkong", price: 15000, img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600" },
    { id: 2, name: "Teh Hijau Herbal Organik", slug: "teh-herbal", price: 25000, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600" },
    { id: 3, name: "Tas Anyaman Bambu Tradisional", slug: "tas-bambu", price: 75000, img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600" },
  ]);

  const [galleryList] = useState([
    { id: 1, title: "Gotong Royong Bersih Kebun Teh", category: "Aktivitas Warga", date: "10 Juni 2026", image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "Festival Budaya & Kesenian Lokal", category: "Budaya", date: "02 Juni 2026", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600" },
    { id: 3, title: "Panorama Pagi Hari Tugu Selatan", category: "Keindahan Alam", date: "28 Mei 2026", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600" },
  ]);

  return (
    <div className="relative pb-24 sm:pb-36 pt-4 overflow-x-hidden font-sans text-slate-800">
      
      {/* Background Soft Glow Lights */}
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-400/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-4 sm:right-10 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-teal-300/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none"></div>

      {/* 1. HERO SECTION */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-12 pb-16 sm:pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <div className="space-y-5 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0f172a] leading-[1.15]">
              Eksplorasi Keindahan <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Tugu Selatan Puncak</span>
            </h1>
            <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-lg mx-auto md:mx-0">
              Nikmati pengalaman wisata petualangan pegunungan terbaik, jelajahi destinasi pilihan melalui halaman detail, dan dukung produk asli UMKM warga lokal.
            </p>
            
            <div className="pt-2 flex flex-row items-center gap-4 justify-center md:justify-start">
              <a 
                href="#paket-unggulan" 
                className="bg-[#0f172a] hover:bg-emerald-900 text-white px-6 sm:px-7 py-3.5 rounded-full shadow-xl shadow-slate-900/10 inline-flex flex-row items-center gap-2.5 font-medium whitespace-nowrap text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Calendar size={16} className="shrink-0 text-emerald-400" /> 
                <span>Jelajahi Destinasi & Paket</span>
              </a>
            </div>
          </div>

          {/* Hero Bagian Kanan (Gambar) */}
          <div className="relative p-2.5 sm:p-3 rounded-[2rem] sm:rounded-[2.5rem] bg-white/50 backdrop-blur-2xl border border-white/80 shadow-xl sm:shadow-2xl shadow-emerald-900/5">
            <div className="relative aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800" 
                alt="Keindahan Tugu Selatan Puncak" 
                className="w-full h-full object-cover hover:scale-105 transition duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4 sm:p-6">
                <div className="text-white space-y-1">
                  <span className="text-[9px] sm:text-[10px] bg-emerald-600 font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">Kawasan Wisata Terpadu</span>
                  <h4 className="text-xs sm:text-sm font-bold pt-1">Desa Wisata Asri & Sejuk Puncak</h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PAKET WISATA UNGGULAN */}
      <section id="paket-unggulan" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-200/80 pb-4 sm:pb-5 mb-8 sm:mb-12">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 mb-1"><Compass size={14}/> Sorotan Petualangan</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">Paket Wisata Unggulan</h2>
          </div>
          <Link href="/wisata" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition flex items-center gap-1">
            Jelajahi Semua Paket &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {paketList.map((item) => (
            <div key={item.id} className="h-full">
              <Link href={`/wisata/${item.slug}`} className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-5 sm:p-7 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100/80 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tarif Mulai</span>
                      <span className="text-emerald-600 font-bold text-xs sm:text-sm">Rp. {item.price.toLocaleString("id-ID")}</span>
                    </div>
                    <span className="bg-slate-900 group-hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 shadow-sm shrink-0">
                      Booking <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PRODUK UMKM LOKAL */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-200/80 pb-4 sm:pb-5 mb-8 sm:mb-12">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 mb-1"><ShoppingBag size={14}/> Oleh-Oleh Khas Desa</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">Produk UMKM Pilihan Warga</h2>
          </div>
          <Link href="/umkm" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition flex items-center gap-1">
            Jelajahi Semua Produk &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {umkmList.map((product) => (
            <div key={product.id} className="h-full">
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between h-full group">
                <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden mb-4 sm:mb-5">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100/80">
                    <span className="text-emerald-600 font-bold text-xs sm:text-sm">Rp. {product.price.toLocaleString("id-ID")}</span>
                    <Link href={`/umkm/${product.slug}`} className="bg-slate-900 group-hover:bg-emerald-600 text-white font-bold px-3 sm:px-3.5 py-2 rounded-xl transition flex items-center gap-1 text-[11px] shadow-sm">
                      Detail <Tag size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GALERI DESA TUGU SELATAN */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-200/80 pb-4 sm:pb-5 mb-8 sm:mb-12">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 mb-1"><ImageIcon size={14}/> Potret Kegiatan & Suasana</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">Galeri Desa Tugu Selatan</h2>
          </div>
          <Link href="/gallery" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition flex items-center gap-1">
            Jelajahi Semua Galeri &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {galleryList.map((item) => (
            <div key={item.id} className="h-full">
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider z-10 shadow">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 sm:p-6 space-y-1.5 sm:space-y-2 bg-white/40 flex-grow">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-light">🕒 {item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}