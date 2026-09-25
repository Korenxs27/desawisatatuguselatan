"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight, Compass, ShoppingBag, FileText, Sparkles } from "lucide-react";

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

        // 1. Halaman Statis Navigasi Tugu Selatan
        const staticPages: SearchResult[] = [
          { 
            id: "p-profil", 
            title: "Profil Desa Tugu Selatan", 
            slug: "/profil", 
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
            description: "Pusat informasi kontak darurat, pengaduan warga, dan cuaca BMKG Tugu Selatan."
          },
          { 
            id: "p-umkm", 
            title: "Katalog UMKM & Oleh-Oleh Warga", 
            slug: "/umkm", 
            type: "halaman", 
            image: null, 
            description: "Daftar produk kerajinan, kuliner khas, dan herbal lokal Tugu Selatan."
          },
          { 
            id: "p-gallery", 
            title: "Galeri Foto & Dokumentasi", 
            slug: "/gallery", 
            type: "halaman", 
            image: null, 
            description: "Dokumentasi keindahan alam, kebudayaan, dan kegiatan Desa Tugu Selatan."
          },
        ];

        const matchedPages = staticPages.filter(p => 
          p.title.toLowerCase().includes(lowerQuery) || 
          p.description?.toLowerCase().includes(lowerQuery)
        );
        combinedResults = [...combinedResults, ...matchedPages];

        // 2. Fetch Multi-Endpoint (CPT Wisata, CPT UMKM, & Custom Bridge Endpoint)
        const [resWisata, resUmkm, resBridgeUmkm] = await Promise.all([
          fetch(`/api-wp/wp/v2/wisata?per_page=100&_embed`, { cache: "no-store" }).catch(() => null),
          fetch(`/api-wp/wp/v2/umkm?per_page=100&_embed`, { cache: "no-store" }).catch(() => null),
          fetch(`/api-wp/tugu-bridge/v1/get-umkm`, { cache: "no-store" }).catch(() => null),
        ]);

        // Helper untuk memproses array data dari WP
        const processWpItems = (data: any[], defaultType: "wisata" | "umkm") => {
          if (!Array.isArray(data)) return [];

          return data
            .filter((item: any) => {
              const title = (item.title?.rendered || item.nama || item.name || "").toLowerCase();
              const content = (item.content?.rendered || item.deskripsi || "").toLowerCase();
              const excerpt = (item.excerpt?.rendered || "").toLowerCase();
              return title.includes(lowerQuery) || content.includes(lowerQuery) || excerpt.includes(lowerQuery);
            })
            .map((item: any) => ({
              id: `${defaultType}-${item.id}`,
              title: item.title?.rendered || item.nama || item.name || "Produk Tugu Selatan",
              slug: `/${defaultType}/${item.slug || item.id}`,
              type: defaultType,
              image: item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || item.gambar || item.foto || item.acf?.gallery_images?.[0] || null,
              category: item.acf?.kategori || item.kategori || (defaultType === "umkm" ? "Produk UMKM" : "Wisata Alam"),
              price: item.acf?.harga || item.harga ? `Rp ${Number(item.acf?.harga || item.harga).toLocaleString("id-ID")}` : undefined,
              description: stripHtml(item.excerpt?.rendered || item.content?.rendered || item.deskripsi || "Informasi produk atau tempat wisata Desa Tugu Selatan."),
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

        if (resBridgeUmkm && resBridgeUmkm.ok) {
          const data = await resBridgeUmkm.json();
          const bridgeItems = data.data || data.umkm || data.items || [];
          combinedResults = [...combinedResults, ...processWpItems(bridgeItems, "umkm")];
        }

        // Filter duplikat berdasarkan ID
        const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());
        setResults(uniqueResults);

      } catch (err) {
        console.error("Error pencarian Tugu Selatan:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      {/* Light Glow Elements */}
      <div className="fixed top-1/4 left-1/3 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 relative z-10">
        
        {/* Input Bar */}
        <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-slate-100 bg-white/50">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100 shrink-0">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Cari wisata, teh sangrai, UMKM, profil desa..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button 
            onClick={onClose} 
            className="p-2.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200/80 hover:text-slate-800 transition cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[55vh] sm:max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-xs text-slate-400 font-medium">
              <Loader2 className="animate-spin text-sky-600" size={24} />
              <span>Mencari data Desa Tugu Selatan...</span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} /> Hasil Pencarian ({results.length})
                </span>
              </div>

              {results.map((res) => (
                <Link
                  key={`${res.type}-${res.id}`}
                  href={res.slug}
                  onClick={onClose}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-200 transition duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/70 mt-0.5 flex items-center justify-center font-black text-sky-600 text-xs shadow-inner">
                    {res.image ? (
                      <img 
                        src={res.image} 
                        alt={res.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs">
                        TS
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-xl inline-flex items-center gap-1 text-white shadow-sm ${
                        res.type === 'halaman' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                          : res.type === 'umkm' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                          : 'bg-gradient-to-r from-sky-600 to-indigo-600'
                      }`}>
                        {res.type === 'halaman' && <FileText size={10} />}
                        {res.type === 'umkm' && <ShoppingBag size={10} />}
                        {res.type === 'wisata' && <Compass size={10} />}
                        {res.type}
                      </span>

                      {res.category && (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          • {res.category}
                        </span>
                      )}

                      {res.price && (
                        <span className="text-[10px] font-black text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-lg">
                          {res.price}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate group-hover:text-sky-600 transition">
                      {res.title}
                    </h4>

                    {res.description && (
                      <p className="text-[11px] text-slate-500 font-normal line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-sky-600 group-hover:text-white text-slate-400 transition shrink-0 self-center border border-slate-200/60 group-hover:border-sky-600">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                <Search size={20} />
              </div>
              <p className="text-xs font-bold text-slate-800">Data Tidak Ditemukan</p>
              <p className="text-[11px] text-slate-400 font-normal max-w-xs mx-auto">
                Tidak ada hasil yang cocok dengan kata kunci "{query}". Pastikan postingan telah dipublikasikan di WordPress.
              </p>
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="text-center py-10 space-y-2">
              <p className="text-xs font-bold text-slate-800">Pusat Pencarian Tugu Selatan</p>
              <p className="text-[11px] text-slate-400 font-normal">Ketik minimal 2 karakter untuk menelusuri layanan, produk, dan tempat wisata.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}