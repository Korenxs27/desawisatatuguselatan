"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight, Compass, ShoppingBag, FileText } from "lucide-react";

interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  type: "wisata" | "umkm" | "halaman";
  image: string | null;
  category?: string;
  price?: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // 🗺️ MASTER DATABASE LOKAL TUGU SELATAN (Wisata, UMKM, & Halaman)
  const masterDatabase: SearchResult[] = [
    // Halaman Statis / Navigasi
    { id: "p-profil", title: "Profil Desa Tugu Selatan", slug: "/profil-desa", type: "halaman", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800" },
    { id: "p-kontak", title: "Kontak & Mitigasi Bencana (Live BMKG)", slug: "/kontak", type: "halaman", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800" },
    { id: "p-umkm", title: "Katalog UMKM & Oleh-Oleh Warga", slug: "/umkm", type: "halaman", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800" },
    
    // Wisata Tugu Selatan
    { id: "w-1", title: "Fun Offroad Adventure", slug: "/wisata/fun-offroad", type: "wisata", category: "Offroad", price: "Rp 1.000.000", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
    { id: "w-2", title: "Fun Offroad Telaga Saat", slug: "/wisata/fun-offroad-telaga-saat", type: "wisata", category: "Offroad", price: "Rp 1.250.000", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1p4C4yIHClbIGSq3QP07O5YZco1Bm73HUcX88rvXChtCliID6VK2LeoA&s=10" },
    { id: "w-3", title: "Trekking / Hiking Pegunungan", slug: "/wisata/trekking", type: "wisata", category: "Trekking", price: "Rp 125.000", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800" },
    { id: "w-4", title: "Outbound Fun Games", slug: "/wisata/outbound", type: "wisata", category: "Outbound", price: "Rp 125.000", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" },
    { id: "w-5", title: "Archery / Latihan Memanah", slug: "/wisata/archery", type: "wisata", category: "Edukasi & Olahraga", price: "Rp 75.000", image: "https://www.banksinarmas.com/id/public/upload/images/67d90ecc06c6f_7-Lokasi-Olahraga-Panahan-di-Jakarta-dan-Sekitarnya-medium.jpg" },
    { id: "w-6", title: "Paintball Simulation Game", slug: "/wisata/paintball", type: "wisata", category: "Outbound", price: "Rp 125.000", image: "https://www.goersapp.com/blog/wp-content/uploads/2025/07/Main-Paintball-di-Jakarta.webp" },

    // UMKM Tugu Selatan
    { id: "u-1", title: "Keripik Singkong Pedas Manis", slug: "/umkm/keripik-singkong", type: "umkm", category: "Kuliner", price: "Rp 15.000", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800" },
    { id: "u-2", title: "Teh Hijau Herbal Organik", slug: "/umkm/teh-herbal", type: "umkm", category: "Minuman & Herbal", price: "Rp 25.000", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800" },
    { id: "u-3", title: "Tas Anyaman Bambu Tradisional", slug: "/umkm/tas-bambu", type: "umkm", category: "Kerajinan Tangan", price: "Rp 75.000", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800" },
    { id: "u-4", title: "Madu Hutan Asli Puncak", slug: "/umkm/madu-hutan", type: "umkm", category: "Minuman & Herbal", price: "Rp 95.000", image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800" },
    { id: "u-5", title: "Wajit Ketan Gula Aren", slug: "/umkm/wajit-ketan", type: "umkm", category: "Kuliner", price: "Rp 20.000", image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&q=80&w=800" },
    { id: "u-6", title: "Bibit Tanaman Hias Pegunungan", slug: "/umkm/bibit-tanaman", type: "umkm", category: "Agrikultur", price: "Rp 35.000", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800" }
  ];

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      try {
        const lowerQuery = query.toLowerCase().trim();

        // Filter dari database lokal secara instan & responsif
        const filtered = masterDatabase.filter(item => 
          item.title.toLowerCase().includes(lowerQuery) || 
          (item.category && item.category.toLowerCase().includes(lowerQuery))
        );

        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-start justify-center pt-[10vh] px-4">
      <div className="bg-white/95 backdrop-blur-xl border border-white/40 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Input Bar */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-100">
          <Search className="text-slate-400 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Cari wisata, produk UMKM, profil, atau kontak..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-light"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-8 gap-2 text-xs text-slate-400 font-light">
              <Loader2 className="animate-spin text-emerald-600" size={16} /> Mencari data...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">Hasil Pencarian</span>
              {results.map((res) => (
                <Link
                  key={`${res.type}-${res.id}`}
                  href={res.slug}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-100 transition group"
                >
                  <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/40">
                    <Image src={res.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa"} alt={res.title} fill className="object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md inline-block mb-1 text-white ${
                      res.type === 'halaman' ? 'bg-indigo-600' : res.type === 'umkm' ? 'bg-slate-900' : 'bg-emerald-600'
                    }`}>
                      {res.type}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-700 transition">{res.title}</h4>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition shrink-0" />
                </Link>
              ))}
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-center py-8 text-xs text-slate-400 font-light italic">Data tidak ditemukan.</p>
          )}

          {query.length < 2 && (
            <p className="text-center py-6 text-xs text-slate-400 font-light">Ketik minimal 2 karakter untuk mulai mencari.</p>
          )}
        </div>
      </div>
    </div>
  );
}