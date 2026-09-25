"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight, Filter, Loader2 } from "lucide-react";

const DEFAULT_PLACEHOLDER = "https://desawisatatuguselatan.desa-wisata-bojongrangkas.com/wp-content/uploads/2026/placeholder.jpg";

function getCleanExcerpt(item: any, fallbackText: string, maxLength = 110) {
  const rawContent = item.content?.rendered || item.excerpt?.rendered || item.acf?.deskripsi_singkat || "";
  const clean = rawContent.replace(/<[^>]*>?/gm, '').trim();
  if (!clean) return fallbackText;
  return clean.length > maxLength ? clean.substring(0, maxLength) + "..." : clean;
}

export default function WisataPage() {
  const [wisataList, setWisataList] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const baseUrl = "/api-wp";

  useEffect(() => {
    async function fetchWisataData() {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/wp/v2/wisata?_embed&per_page=100&t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setWisataList(data);

            const catSet = new Set<string>();
            data.forEach((item) => {
              const cat = item.acf?.kategori || item.acf?.category;
              if (cat && typeof cat === 'string' && cat.trim() !== '') {
                catSet.add(cat.trim());
              }
            });

            setCategories(["Semua", ...Array.from(catSet)]);
          }
        }
      } catch (err) {
        console.error("Gagal memuat katalog wisata:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWisataData();
  }, []);

  // Filter Utama Kartu
  const filteredWisata = wisataList.filter((item) => {
    const title = item.title?.rendered || "";
    const desc = getCleanExcerpt(item, "");
    const itemCat = item.acf?.kategori || item.acf?.category || "";

    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Semua" || 
                            itemCat.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Rekomendasi Live Search (Muncul jika searchQuery >= 2 karakter)
  const searchRecommendations = searchQuery.trim().length >= 2 
    ? wisataList.filter((item) => {
        const title = item.title?.rendered || "";
        const desc = getCleanExcerpt(item, "");
        return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               desc.toLowerCase().includes(searchQuery.toLowerCase());
      }).slice(0, 5)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={32} />
        <span className="ml-2 text-xs text-slate-500 font-medium tracking-wider">Memuat Katalog Wisata...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 pt-24 sm:pt-15 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative">
      
      {/* BACKGROUND LIGHT GLOW */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        {/* HEADER TITLE */}
        <div className="text-center space-y-3 max-w-xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Destinasi & Paket <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">
              Wisata Puncak
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Temukan berbagai pilihan paket liburan, petualangan offroad, hingga outbound seru di kawasan Desa Wisata Tugu Selatan Puncak.
          </p>
        </div>

        {/* SEARCH & FILTER BAR SECTION (DIUBAH z-index KELUAR MENJADI z-30 DENGAN overflow-visible) */}
        <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-white/80 shadow-xl shadow-sky-900/5 space-y-4 sm:space-y-5 relative z-30 overflow-visible">
          
          {/* Input Search & Recommendations Dropdown */}
          <div className="relative z-40">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama paket wisata atau aktivitas..." 
              value={searchQuery}
              onFocus={() => setShowRecommendations(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowRecommendations(true);
              }}
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-12 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-600 transition shadow-inner font-medium placeholder:text-slate-400"
            />

            {/* Rekomendasi Live Search (Melayang dengan z-50 dan shadow besar) */}
            {showRecommendations && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {searchRecommendations.length > 0 ? (
                  searchRecommendations.map((item) => {
                    const imgUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || DEFAULT_PLACEHOLDER;
                    const shortDesc = getCleanExcerpt(item, "", 70);

                    return (
                      <Link 
                        key={item.id} 
                        href={`/wisata/${item.slug}`}
                        onClick={() => setShowRecommendations(false)}
                        className="flex items-center gap-3.5 p-3 hover:bg-sky-50/80 transition duration-200"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                          <Image src={imgUrl} alt={item.title?.rendered || "Wisata"} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.title?.rendered}</h4>
                          <p className="text-[11px] text-slate-500 font-normal truncate leading-snug">{shortDesc}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-sky-600 shrink-0 mr-2" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 italic">
                    Tidak ada rekomendasi wisata sesuai kata kunci.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter Kategori Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 sm:mr-2 flex items-center gap-1">
              <Filter size={13} /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowRecommendations(false);
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-slate-100/80 hover:bg-slate-200 text-slate-600 border border-slate-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* DAFTAR KARTU DESTINASI / PAKET (Diberi z-10 agar selalu berada di bawah search) */}
        {filteredWisata.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {filteredWisata.map((item) => {
              const imgUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || DEFAULT_PLACEHOLDER;
              const acf = item.acf || {};
              const harga = acf.harga_minimal || acf.harga || 0;
              const satuan = acf.satuan_harga || acf.satuan || "pax";
              const kategori = acf.kategori || acf.category || "Wisata";
              const shortDesc = getCleanExcerpt(item, "Destinasi & paket wisata alam khas Tugu Selatan Puncak.");

              return (
                <div key={item.id} className="h-full">
                  <Link 
                    href={`/wisata/${item.slug}`} 
                    className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                  >
                    <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                      <Image 
                        src={imgUrl} 
                        alt={item.title?.rendered || "Wisata"} 
                        fill
                        className="object-cover group-hover:scale-105 transition duration-700" 
                      />
                      <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider z-10 shadow">
                        {kategori}
                      </span>
                    </div>

                    <div className="p-5 sm:p-7 flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">{item.title?.rendered}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">{shortDesc}</p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100/80 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-light">Tarif / Harga</span>
                          <span className="text-sky-600 font-bold text-xs sm:text-sm">
                            {Number(harga) > 0 ? (
                              <>
                                Rp. {Number(harga).toLocaleString("id-ID")}{" "}
                                <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">/ {satuan}</span>
                              </>
                            ) : (
                              "Hubungi Pengelola"
                            )}
                          </span>
                        </div>
                        <span className="bg-slate-900 group-hover:bg-sky-600 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 shadow-sm shrink-0">
                          Detail <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/75 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] border border-white/80 text-center space-y-3 shadow-xl shadow-sky-900/5 relative z-10">
            <span className="text-3xl sm:text-4xl block">🔍</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Paket Wisata Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
              Maaf, kata kunci atau kategori yang Anda cari belum tersedia di sistem. Coba gunakan kata kunci lain.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}