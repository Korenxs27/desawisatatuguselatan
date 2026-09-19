"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, ArrowUpRight, Filter, Loader2 } from "lucide-react";

const DEFAULT_PLACEHOLDER = "https://desawisatatuguselatan.desa-wisata-bojongrangkas.com/wp-content/uploads/2026/placeholder.jpg";

function getCleanExcerpt(item: any, fallbackText: string, maxLength = 110) {
  const rawContent = item.description || item.short_description || item.content?.rendered || item.excerpt?.rendered || "";
  const clean = rawContent.replace(/<[^>]*>?/gm, '').trim();
  if (!clean) return fallbackText;
  return clean.length > maxLength ? clean.substring(0, maxLength) + "..." : clean;
}

export default function UmkmPage() {
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const baseUrl = "/api-wp";
  const ck = "ck_11cb06d9375d3f54f8464420e3e41f4e6a1be250";
  const cs = "cs_1bd856c252221ea40104ed68505f58c3048de027";

  useEffect(() => {
    async function fetchAllUmkmData() {
      setLoading(true);
      const combinedList: any[] = [];
      const seenIds = new Set<string>();

      const isBookingOrSystemProduct = (name: string) => {
        const uppercaseName = name.toUpperCase().trim();
        return (
          uppercaseName.startsWith("[TUGU SELATAN]") ||
          uppercaseName.startsWith("[WISATA]") ||
          uppercaseName.startsWith("[HOMESTAY]") ||
          uppercaseName.includes("BOOKING")
        );
      };

      // 1. Fetch dari WooCommerce REST API
      try {
        const resWc = await fetch(`${baseUrl}/wc/v3/products?per_page=100&consumer_key=${ck}&consumer_secret=${cs}&t=${Date.now()}`, { cache: "no-store" });
        if (resWc.ok) {
          const dataWc = await resWc.json();
          if (Array.isArray(dataWc)) {
            dataWc.forEach((prod: any) => {
              const productName = prod.name || "";
              
              if (isBookingOrSystemProduct(productName)) {
                return;
              }

              const uniqueKey = `wc-${prod.id}`;
              if (!seenIds.has(uniqueKey)) {
                seenIds.add(uniqueKey);

                // Ekstrak nama kategori dari WooCommerce (Abaikan "Uncategorized")
                let catNames: string[] = [];
                if (Array.isArray(prod.categories)) {
                  catNames = prod.categories
                    .map((c: any) => c.name)
                    .filter((cName: string) => cName && cName.toLowerCase() !== "uncategorized" && cName.toLowerCase() !== "tanpa kategori");
                }

                if (catNames.length === 0) {
                  catNames = ["Kuliner"];
                }

                combinedList.push({
                  id: prod.id,
                  slug: prod.slug,
                  name: productName,
                  price: prod.price || prod.regular_price || 0,
                  image: prod.images?.[0]?.src || DEFAULT_PLACEHOLDER,
                  description: prod.description || prod.short_description || "",
                  categories: catNames
                });
              }
            });
          }
        }
      } catch (err) {
        console.error("Gagal memuat WooCommerce Products:", err);
      }

      // 2. Fetch dari Custom Post Type WordPress 'umkm'
      try {
        const resCpt = await fetch(`${baseUrl}/wp/v2/umkm?_embed&per_page=100&t=${Date.now()}`, { cache: "no-store" });
        if (resCpt.ok) {
          const dataCpt = await resCpt.json();
          if (Array.isArray(dataCpt)) {
            dataCpt.forEach((item: any) => {
              const productName = item.title?.rendered || "Produk UMKM";

              if (isBookingOrSystemProduct(productName)) {
                return;
              }

              const uniqueKey = `cpt-${item.id}`;
              if (!seenIds.has(uniqueKey)) {
                seenIds.add(uniqueKey);

                const acf = item.acf || {};
                const catName = acf.kategori || acf.category || "Kuliner";
                const itemPrice = acf.harga || acf.harga_minimal || 0;
                const featuredImg = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || DEFAULT_PLACEHOLDER;

                combinedList.push({
                  id: item.id,
                  slug: item.slug,
                  name: productName,
                  price: itemPrice,
                  image: featuredImg,
                  description: item.content?.rendered || item.excerpt?.rendered || "",
                  categories: [catName]
                });
              }
            });
          }
        }
      } catch (err) {
        console.error("Gagal memuat CPT umkm:", err);
      }

      setUmkmList(combinedList);

      // Ekstrak Kategori Unik Dinamis
      const catSet = new Set<string>();
      combinedList.forEach((prod) => {
        if (Array.isArray(prod.categories)) {
          prod.categories.forEach((cName: string) => {
            if (cName && cName.trim() !== "") {
              catSet.add(cName.trim());
            }
          });
        }
      });

      if (catSet.size > 0) {
        setCategories(["Semua", ...Array.from(catSet)]);
      }

      setLoading(false);
    }

    fetchAllUmkmData();
  }, []);

  const filteredUmkm = umkmList.filter((item) => {
    const title = item.name || "";
    const desc = getCleanExcerpt(item, "");
    const itemCats = Array.isArray(item.categories) ? item.categories.map((c: string) => c.toLowerCase()) : [];

    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Semua" || 
                            itemCats.includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const searchRecommendations = searchQuery.trim().length >= 2 
    ? umkmList.filter((item) => {
        const title = item.name || "";
        const desc = getCleanExcerpt(item, "");
        return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               desc.toLowerCase().includes(searchQuery.toLowerCase());
      }).slice(0, 5)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={32} />
        <span className="ml-2 text-xs text-slate-500 font-medium tracking-wider">Memuat Produk UMKM...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 pt-24 sm:pt-15 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        <div className="text-center space-y-3 max-w-xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Produk UMKM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">
              Desa Tugu Selatan
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Dukung perekonomian warga lokal dengan mengeksplorasi dan memesan produk kuliner, kerajinan tangan, hingga hasil bumi asli Desa Wisata Tugu Selatan.
          </p>
        </div>

        <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-white/80 shadow-xl shadow-sky-900/5 space-y-4 sm:space-y-5 relative">
          
          <div className="relative">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk oleh-oleh atau kerajinan..." 
              value={searchQuery}
              onFocus={() => setShowRecommendations(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowRecommendations(true);
              }}
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-12 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-600 transition shadow-inner font-medium placeholder:text-slate-400"
            />

            {showRecommendations && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {searchRecommendations.length > 0 ? (
                  searchRecommendations.map((item) => {
                    const shortDesc = getCleanExcerpt(item, "", 70);

                    return (
                      <Link 
                        key={item.id} 
                        href={`/umkm/${item.slug}`}
                        onClick={() => setShowRecommendations(false)}
                        className="flex items-center gap-3.5 p-3 hover:bg-sky-50/60 transition duration-200"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                          <Image src={item.image} alt={item.name || "UMKM"} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                          <p className="text-[11px] text-slate-500 font-normal truncate leading-snug">{shortDesc}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-sky-600 shrink-0 mr-2" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 italic">
                    Tidak ada rekomendasi produk UMKM sesuai kata kunci.
                  </div>
                )}
              </div>
            )}
          </div>

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

        {filteredUmkm.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredUmkm.map((product) => {
              const productName = product.name;
              const productPrice = product.price || 0;
              const categoryName = product.categories?.[0] || "Kuliner";
              const shortDesc = getCleanExcerpt(product, "Oleh-oleh dan produk olahan warga khas Tugu Selatan.");

              return (
                <div key={product.id} className="h-full">
                  <div className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group p-5 sm:p-6">
                    
                    <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden mb-4 sm:mb-5">
                      <Image 
                        src={product.image} 
                        alt={productName || "UMKM"} 
                        fill
                        className="object-cover group-hover:scale-105 transition duration-700" 
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider shadow">
                        {categoryName}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-1">{productName}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">{shortDesc}</p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100/80 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-light">Harga</span>
                          <span className="text-sky-600 font-bold text-xs sm:text-sm">
                            {Number(productPrice) > 0 
                              ? `Rp. ${parseInt(productPrice).toLocaleString("id-ID")}`
                              : "Hubungi Penjual"}
                          </span>
                        </div>
                        
                        <Link 
                          href={`/umkm/${product.slug}`} 
                          className="bg-slate-900 group-hover:bg-sky-600 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 shadow-sm shrink-0"
                        >
                          Pesan <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/75 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] border border-white/80 text-center space-y-3 shadow-xl shadow-sky-900/5">
            <span className="text-3xl sm:text-4xl block">🛍️</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Produk UMKM Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
              Maaf, produk atau kategori yang Anda cari belum tersedia di sistem. Silakan gunakan kata kunci lainnya.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}