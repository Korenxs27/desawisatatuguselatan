"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Tag, ArrowUpRight, Filter, PhoneCall } from "lucide-react";

export default function UmkmPage() {
  // State untuk pencarian dan filter kategori UMKM
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Data katalog UMKM Warga Tugu Selatan
  const [umkmList] = useState([
    {
      id: 1,
      name: "Keripik Singkong Pedas Manis",
      slug: "keripik-singkong",
      category: "Kuliner",
      price: 15000,
      unit: "Per Bungkus (250gr)",
      img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800",
      desc: "Oleh-oleh khas buatan warga lokal Tugu Selatan dengan resep turun-temurun, renyah, dan berasa bumbu rempah pilihan.",
      owner: "Ibu Siti Aminah (Kelompok Tani)"
    },
    {
      id: 2,
      name: "Teh Hijau Herbal Organik",
      slug: "teh-herbal",
      category: "Minuman & Herbal",
      price: 25000,
      unit: "Per Kotak (isi 20 kantong)",
      img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
      desc: "Dipetik langsung dari perkebunan teh pilihan di kawasan Puncak Tugu Selatan, diolah secara higienis dan menyehatkan.",
      owner: "Kelompok Tani Lestari"
    },
    {
      id: 3,
      name: "Tas Anyaman Bambu Tradisional",
      slug: "tas-bambu",
      category: "Kerajinan Tangan",
      price: 75000,
      unit: "Per Unit",
      img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800",
      desc: "Kerajinan tangan ramah lingkungan hasil karya pengrajin lokal desa, kuat, estetik, dan cocok untuk tas belanja atau souvenir.",
      owner: "Bapak Supriyadi (Kreatif Bambu)"
    },
    {
      id: 4,
      name: "Madu Hutan Asli Puncak",
      slug: "madu-hutan",
      category: "Minuman & Herbal",
      price: 95000,
      unit: "Per Botol (350ml)",
      img: "https://smexpo.pertamina.com/data-smexpo/images/products/4323/galleries/IMG-20210619-WA0036_1724480555.jpg",
      desc: "Madu murni hasil panen dari lebah liar di sekitar hutan pegunungan Tugu Selatan, berkhasiat tinggi untuk stamina.",
      owner: "Pak Dadan (Peternak Lebah Mandiri)"
    },
    {
      id: 5,
      name: "Wajit Ketan Gula Aren",
      slug: "wajit-ketan",
      category: "Kuliner",
      price: 20000,
      unit: "Per Pack (isi 10)",
      img: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&q=80&w=800",
      desc: "Jajanan tradisional manis legit berbahan dasar beras ketan pilihan dan gula aren asli warga lokal.",
      owner: "Dapur Bu Hj. Ooy"
    },
    {
      id: 6,
      name: "Bibit Tanaman Hias Pegunungan",
      slug: "bibit-tanaman",
      category: "Agrikultur",
      price: 35000,
      unit: "Per Pot",
      img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800",
      desc: "Berbagai jenis tanaman hias dan bunga segar dataran tinggi yang dibudidayakan langsung oleh petani setempat.",
      owner: "Flora Tugu Asri"
    }
  ]);

  // Daftar kategori untuk tombol filter UMKM
  const categories = ["Semua", "Kuliner", "Minuman & Herbal", "Kerajinan Tangan", "Agrikultur"];

  // Logika Filter & Pencarian UMKM
  const filteredUmkm = umkmList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 pt-16 sm:pt-20 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Background Soft Glow Effects */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            UMKM & Oleh-Oleh Desa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Dukung perekonomian warga lokal dengan mengeksplorasi dan memesan produk kuliner, kerajinan tangan, hingga hasil bumi asli Desa Wisata Tugu Selatan.
          </p>
        </div>

        {/* SEARCH & FILTER BAR SECTION */}
        <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/85 shadow-xl shadow-slate-200/50 space-y-5 sm:space-y-6">
          
          {/* Input Search */}
          <div className="relative">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk oleh-oleh atau kerajinan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl pl-12 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 text-xs sm:text-sm text-slate-800 outline-none focus:border-emerald-600 transition shadow-inner font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Filter Kategori Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-200/60">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 sm:mr-2 flex items-center gap-1">
              <Filter size={13} /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
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

        {/* DAFTAR KARTU PRODUK UMKM */}
        {filteredUmkm.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredUmkm.map((product) => (
              <div key={product.id} className="h-full">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group p-5 sm:p-6">
                  
                  {/* Gambar Produk */}
                  <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden mb-4 sm:mb-5">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider shadow">
                      {product.category}
                    </span>
                  </div>

                  {/* Info Produk */}
                  <div className="flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-600 block">Produksi: {product.owner}</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{product.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">{product.desc}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100/80 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Harga</span>
                        <span className="text-emerald-600 font-bold text-xs sm:text-sm">
                          Rp. {product.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/umkm/${product.slug}`} 
                        className="bg-slate-900 group-hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 shadow-sm shrink-0"
                      >
                        Pesan <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/75 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-white/85 text-center space-y-3 shadow-xl">
            <span className="text-3xl sm:text-4xl block">🛍️</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Produk UMKM Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
              Maaf, produk atau kategori yang Anda cari belum tersedia. Silakan gunakan kata kunci lainnya.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}