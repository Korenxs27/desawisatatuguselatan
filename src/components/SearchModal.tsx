"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  type: "wisata" | "umkm" | "halaman";
  image: string | null;
  category?: string;
  price?: string;
  description?: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const stripHtml = (htmlString: string) => {
    if (!htmlString) return "";
    return htmlString.replace(/<[^>]*>?/gm, "").trim();
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const lowerQuery = query.toLowerCase().trim();
        let combinedResults: SearchResult[] = [];

        // 1. Halaman Statis Navigasi
        const staticPages: SearchResult[] = [
          { 
            id: "p-profil", 
            title: "Profil Desa Tugu Selatan", 
            slug: "/profil-desa", 
            type: "halaman", 
            image: null, 
            description: "Informasi sejarah, visi misi, dan struktur BPH Desa Wisata Tugu Selatan."
          },
          { 
            id: "p-kontak", 
            title: "Kontak & Mitigasi Bencana", 
            slug: "/kontak", 
            type: "halaman", 
            image: null, 
            description: "Pusat informasi kontak darurat, pengaduan warga, dan cuaca BMKG."
          },
          { 
            id: "p-umkm", 
            title: "Katalog UMKM & Oleh-Oleh Warga", 
            slug: "/umkm", 
            type: "halaman", 
            image: null, 
            description: "Daftar produk kerajinan, kuliner khas, dan herbal lokal Tugu Selatan."
          },
        ];

        const matchedPages = staticPages.filter(p => 
          p.title.toLowerCase().includes(lowerQuery) || 
          p.description?.toLowerCase().includes(lowerQuery)
        );
        combinedResults = [...combinedResults, ...matchedPages];

        // 2. Fetch Multi-Endpoint (CPT Wisata, CPT UMKM, CPT Posts Biasa, & Products)
        const [resWisata, resUmkm, resPosts] = await Promise.all([
          fetch(`/api-wp/wp/v2/wisata?per_page=100&_embed`).catch(() => null),
          fetch(`/api-wp/wp/v2/umkm?per_page=100&_embed`).catch(() => null),
          fetch(`/api-wp/wp/v2/posts?per_page=100&_embed`).catch(() => null),
        ]);

        // Helper untuk memproses array data dari WP
        const processWpItems = (data: any[], defaultType: "wisata" | "umkm") => {
          if (!Array.isArray(data)) return [];

          return data
            .filter((item: any) => {
              const title = item.title?.rendered?.toLowerCase() || "";
              const content = item.content?.rendered?.toLowerCase() || "";
              const excerpt = item.excerpt?.rendered?.toLowerCase() || "";
              return title.includes(lowerQuery) || content.includes(lowerQuery) || excerpt.includes(lowerQuery);
            })
            .map((item: any) => ({
              id: `${defaultType}-${item.id}`,
              title: item.title?.rendered || "Produk",
              slug: `/${defaultType}/${item.slug || item.id}`,
              type: defaultType,
              image: item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || item.acf?.gallery_images?.[0] || null,
              category: item.acf?.kategori || (defaultType === "umkm" ? "Produk UMKM" : "Wisata"),
              price: item.acf?.harga ? `Rp ${Number(item.acf.harga).toLocaleString("id-ID")}` : undefined,
              description: stripHtml(item.excerpt?.rendered || item.content?.rendered || "Deskripsi tidak tersedia."),
            }));
        };

        if (resWisata && resWisata.ok) {
          const data = await resWisata.json();
          combinedResults = [...combinedResults, ...processWpItems(data, "wisata")];
        }

        if (resUmkm && resUmkm.ok) {
          const data = await resUmkm.json();
          combinedResults = [...combinedResults, ...processWpItems(data, "umkm")];
        }

        // Jika UMKM dimasukkan via Post Biasa di WP
        if (resPosts && resPosts.ok) {
          const data = await resPosts.json();
          combinedResults = [...combinedResults, ...processWpItems(data, "umkm")];
        }

        setResults(combinedResults);
      } catch (err) {
        console.error("Error pencarian:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-white/40 w-full max-w-2xl rounded-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 flex items-center gap-3 border-b border-slate-100">
          <Search className="text-slate-400 shrink-0" size={18} />
          <input
            type="text"
            placeholder="Cari keripik, UMKM, wisata, profil..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 outline-none placeholder:text-slate-400 font-light"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[55vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-8 gap-2 text-xs text-slate-400 font-light">
              <Loader2 className="animate-spin text-emerald-600" size={16} /> Mencari data...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                Rekomendasi Hasil Pencarian ({results.length})
              </span>
              {results.map((res) => (
                <Link
                  key={`${res.type}-${res.id}`}
                  href={res.slug}
                  onClick={onClose}
                  className="flex items-start gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-100 transition group"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50 mt-0.5 flex items-center justify-center font-bold text-slate-400 text-xs">
                    {res.image ? (
                      <img 
                        src={res.image} 
                        alt={res.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    ) : (
                      <span>TS</span>
                    )}
                  </div>

                  <div className="flex-grow min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md inline-block text-white ${
                        res.type === 'halaman' ? 'bg-indigo-600' : res.type === 'umkm' ? 'bg-slate-900' : 'bg-emerald-600'
                      }`}>
                        {res.type}
                      </span>
                      {res.category && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          • {res.category}
                        </span>
                      )}
                      {res.price && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-md">
                          {res.price}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700 transition">
                      {res.title}
                    </h4>

                    {res.description && (
                      <p className="text-[11px] text-slate-500 font-light line-clamp-2 leading-snug">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition shrink-0 self-center" />
                </Link>
              ))}
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="text-center py-10 space-y-1">
              <p className="text-xs font-semibold text-slate-600">Data tidak ditemukan</p>
              <p className="text-[11px] text-slate-400 font-light italic">
                Coba pastikan judul produk di WordPress sudah di-publish.
              </p>
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="text-center py-8 space-y-1">
              <p className="text-xs text-slate-500 font-medium">Pencarian Data Tugu Selatan</p>
              <p className="text-[11px] text-slate-400 font-light">Ketik minimal 2 karakter untuk melihat rekomendasi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}