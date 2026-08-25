"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Sparkles, Filter, X, ArrowUpRight } from "lucide-react";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState<{ title: string; img: string; desc: string; category: string } | null>(null);

  // Mencegah background agar tidak bisa di-scroll saat modal aktif
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Master Data Gallery & Dokumentasi Desa Wisata Tugu Selatan
  const galleryItems = [
    {
      id: 1,
      title: "Kawasan Perkebunan Teh Puncak",
      category: "Alam & Wisata",
      img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      desc: "Hamparan hijau kebun teh di dataran tinggi Tugu Selatan yang menyejukkan mata."
    },
    {
      id: 2,
      title: "Petualangan Seru Fun Offroad Jeep",
      category: "Petualangan",
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
      desc: "Wisatawan melintasi jalur offroad menantang di tengah rimbunnya area pegunungan."
    },
    {
      id: 3,
      title: "Keindahan Sumber Air Telaga Saat",
      category: "Alam & Wisata",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1p4C4yIHClbIGSq3QP07O5YZco1Bm73HUcX88rvXChtCliID6VK2LeoA&s=10",
      desc: "Titik nol kilometer Sungai Ciliwung yang dikelilingi perbukitan asri."
    },
    {
      id: 4,
      title: "Produk Unggulan Teh Herbal Lokal",
      category: "UMKM",
      img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1200",
      desc: "Hasil olahan daun teh pilihan berkualitas tinggi dari petani warga desa."
    },
    {
      id: 5,
      title: "Aktivitas Outbound & Team Building",
      category: "Aktivitas",
      img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
      desc: "Keseruan kegiatan kelompok di alam terbuka kawasan Puncak Cisarua."
    },
    {
      id: 6,
      title: "Kerajinan Tas Anyaman Bambu",
      category: "UMKM",
      img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200",
      desc: "Produk kriya estetik ramah lingkungan hasil karya pengrajin lokal."
    },
    {
      id: 7,
      title: "Suasana Kabut Pagi Pegunungan",
      category: "Alam & Wisata",
      img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1200",
      desc: "Pemandangan magis saat kabut tipis menyelimuti permukiman dan area wisata."
    },
    {
      id: 8,
      title: "Simulasi Game Paintball & Archery",
      category: "Petualangan",
      img: "https://www.goersapp.com/blog/wp-content/uploads/2025/07/Main-Paintball-di-Jakarta.webp",
      desc: "Sarana olahraga ketangkasan dan rekreasi seru untuk keluarga maupun instansi."
    },
    {
      id: 9,
      title: "Oleh-Oleh Kripik & Kuliner Desa",
      category: "UMKM",
      img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=1200",
      desc: "Jajanan tradisional renyah buatan rumah dengan resep turun-temurun."
    }
  ];

  const categories = ["Semua", "Alam & Wisata", "Petualangan", "UMKM", "Aktivitas"];

  const filteredGallery = activeCategory === "Semua" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 pt-15 sm:pt-15 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-emerald-400/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-teal-400/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Galeri Foto & Aktivitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Jelajahi keindahan alam pegunungan, keseruan petualangan offroad, serta produk-produk unggulan UMKM di Desa Tugu Selatan Puncak. Klik untuk melihat detail.
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 font-medium">
            <Filter size={14} /> Filter:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#0f172a] text-white shadow-md shadow-slate-900/10"
                  : "bg-white/80 hover:bg-slate-200 text-slate-600 border border-slate-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Galeri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                <Image 
                  src={item.img} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider shadow">
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-white/90 text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                    Perbesar <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow space-y-2">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL POP-UP / LIGHTBOX DENGAN ZOOM & HOVER TEXT */}
      {selectedImage && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop Gelap Blur */}
          <div 
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          ></div>

          {/* Konten Kotak Modal */}
          <div className="relative w-full max-w-4xl bg-black rounded-[2.5rem] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 group/modal">
            
            {/* Tombol Tutup */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition shadow-lg cursor-pointer backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* Area Gambar dengan Efek Zoom & Teks Hover di Atas Gambar */}
            <div className="relative w-full h-[75vh] sm:h-[80vh] overflow-hidden bg-slate-950 flex items-center justify-center">
              
              {/* Gambar dengan efek zoom saat hover modal */}
              <Image 
                src={selectedImage.img} 
                alt={selectedImage.title} 
                fill 
                className="object-cover transition-transform duration-700 ease-out group-hover/modal:scale-110" 
              />

              {/* Gradient Fade Gelap di Bawah Gambar */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>

              {/* Badge Kategori */}
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider shadow">
                  {selectedImage.category}
                </span>
              </div>

              {/* Teks Deskripsi yang Muncul (Fade In) saat di-Hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 text-white transform translate-y-4 opacity-0 group-hover/modal:translate-y-0 group-hover/modal:opacity-100 transition-all duration-300 ease-out space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {selectedImage.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed max-w-2xl">
                  {selectedImage.desc}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}