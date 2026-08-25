"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Compass, Tag, ArrowUpRight, Filter, MapPin } from "lucide-react";

export default function WisataPage() {
  // State untuk pencarian dan filter kategori
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Data katalog paket wisata Tugu Selatan (sesuai dengan katalog BPH Anda)
  const [wisataList] = useState([
    {
      id: 1,
      title: "Fun Offroad Adventure",
      slug: "fun-offroad",
      category: "Offroad",
      price: 1000000,
      unit: "/ Jeep",
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      desc: "Jelajahi jalur ekstrem pegunungan Tugu Selatan dengan armada Jeep tangguh melintasi area perkebunan teh."
    },
    {
      id: 2,
      title: "Fun Offroad Telaga Saat",
      slug: "fun-offroad-telaga-saat",
      category: "Offroad",
      price: 1250000,
      unit: "/ Jeep",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1p4C4yIHClbIGSq3QP07O5YZco1Bm73HUcX88rvXChtCliID6VK2LeoA&s=10",
      desc: "Petualangan seru offroad menuju titik nol kilometer sumber Ciliwung di Telaga Saat Puncak."
    },
    {
      id: 3,
      title: "Trekking / Hiking Pegunungan",
      slug: "trekking",
      category: "Trekking",
      price: 125000,
      unit: "/ pax",
      img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800",
      desc: "Nikmati udara sejuk kebun teh dengan pemandu lokal berpengalaman menyusuri alam asri."
    },
    {
      id: 4,
      title: "Outbound Fun Games",
      slug: "outbound",
      category: "Outbound",
      price: 125000,
      unit: "/ pax",
      img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
      desc: "Aktivitas kelompok seru di alam terbuka untuk team building instansi, perusahaan, maupun keluarga."
    },
    {
      id: 5,
      title: "Archery / Latihan Memanah",
      slug: "archery",
      category: "Edukasi & Olahraga",
      price: 75000,
      unit: "/ 10 pax",
      img: "https://www.banksinarmas.com/id/public/upload/images/67d90ecc06c6f_7-Lokasi-Olahraga-Panahan-di-Jakarta-dan-Sekitarnya-medium.jpg",
      desc: "Uji fokus dan ketepatan memanah di area terbuka pegunungan yang dikelilingi pemandangan indah."
    },
    {
      id: 6,
      title: "Paintball Simulation Game",
      slug: "paintball",
      category: "Outbound",
      price: 125000,
      unit: "/ pax",
      img: "https://www.goersapp.com/blog/wp-content/uploads/2025/07/Main-Paintball-di-Jakarta.webp",
      desc: "Simulasi tempur seru dan taktis di tengah rimbunnya area hutan pinus Tugu Selatan."
    }
  ]);

  // Daftar kategori untuk tombol filter
  const categories = ["Semua", "Offroad", "Trekking", "Outbound", "Edukasi & Olahraga"];

  // Logika Filter & Pencarian
  const filteredWisata = wisataList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 pt-16 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Background Soft Glow Effects (Disesuaikan jadi nuansa hijau) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Destinasi & Paket Wisata
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Temukan berbagai pilihan paket liburan, petualangan offroad, hingga outbound seru di kawasan Desa Wisata Tugu Selatan Puncak.
          </p>
        </div>

        {/* SEARCH & FILTER BAR SECTION */}
        <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-white/85 shadow-xl shadow-slate-200/50 space-y-6">
          
          {/* Input Search */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama paket wisata atau aktivitas (Cth: Offroad, Trekking)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm text-slate-800 outline-none focus:border-emerald-600 transition shadow-inner font-medium"
            />
          </div>

          {/* Filter Kategori Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Filter size={14} /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-[#0f172a] text-white shadow-md shadow-slate-900/10"
                    : "bg-slate-100/80 hover:bg-slate-200 text-slate-600 border border-slate-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* DAFTAR KARTU DESTINASI / PAKET */}
        {filteredWisata.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredWisata.map((item) => (
              <div key={item.id}>
                <Link 
                  href={`/wisata/${item.slug}`} 
                  className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    />
                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-xl uppercase tracking-wider z-10 shadow">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-7 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">{item.desc}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100/80">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Tarif / Harga</span>
                        <span className="text-emerald-600 font-bold text-sm">
                          Rp. {item.price.toLocaleString("id-ID")} <span className="text-[11px] text-slate-400 font-normal">{item.unit}</span>
                        </span>
                      </div>
                      <span className="bg-slate-900 group-hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1 shadow-sm">
                        Detail & Booking <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white/85 text-center space-y-3 shadow-xl">
            <span className="text-4xl block">🔍</span>
            <h3 className="text-lg font-bold text-slate-900">Paket Wisata Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
              Maaf, kata kunci atau kategori yang Anda cari belum tersedia. Coba gunakan kata kunci lain.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}