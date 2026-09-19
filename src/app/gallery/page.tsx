"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Loader2, Image as ImageIcon, Play, Film, X, ZoomIn, ZoomOut, SlidersHorizontal, Check, RotateCcw } from "lucide-react";

export default function UserGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [tempType, setTempType] = useState<"Semua" | "foto" | "video">("Semua");
  const [tempCategory, setTempCategory] = useState("Semua");
  const [appliedType, setAppliedType] = useState<"Semua" | "foto" | "video">("Semua");
  const [appliedCategory, setAppliedCategory] = useState("Semua");
  const [categories, setCategories] = useState<string[]>([]);
  
  // Modal State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  // Advanced Zoom & Pan State (Scroll Wheel & Touch Pinch)
  const [zoomScale, setZoomScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const touchDistRef = useRef<number | null>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const apiEndpoint = "/api-wp/tugu-bridge/v1/gallery-items";

  // Reset zoom saat modal dibuka/ditutup
  useEffect(() => {
    if (selectedMedia) {
      setZoomScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedMedia]);

  // Hide global navbar saat modal aktif
  useEffect(() => {
    const navbars = document.querySelectorAll('nav, header, [role="navigation"]');
    if (selectedMedia || isFilterOpen) {
      document.body.style.overflow = "hidden";
      navbars.forEach((nav) => (nav as HTMLElement).style.setProperty('display', 'none', 'important'));
    } else {
      document.body.style.overflow = "auto";
      navbars.forEach((nav) => (nav as HTMLElement).style.removeProperty('display'));
    }
    return () => {
      document.body.style.overflow = "auto";
      navbars.forEach((nav) => (nav as HTMLElement).style.removeProperty('display'));
    };
  }, [selectedMedia, isFilterOpen]);

 useEffect(() => {
  const fetchGallery = async () => {
    try {
      const res = await fetch(`${apiEndpoint}?t=${Date.now()}`, { cache: "no-store" });

      // 1. Cek apakah HTTP Status OK (200)
      if (!res.ok) {
        console.warn(`Server merespons dengan status: ${res.status}`);
        setGallery([]);
        return;
      }

      // 2. Ambil response sebagai teks terlebih dahulu untuk menghindari crash SyntaxError
      const text = await res.text();
      
      // 3. Pastikan teks diawali dengan '{' atau '[' khas JSON
      if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
        const data = JSON.parse(text);
        if (data.success && Array.isArray(data.gallery)) {
          setGallery(data.gallery);
          const uniqueCategories = ["Semua", ...Array.from(new Set(data.gallery.map((item: any) => item.category)))];
          setCategories(uniqueCategories as string[]);
        }
      } else {
        console.warn("Response dari server bukan format JSON valid:", text);
        setGallery([]);
      }
    } catch (err) {
      console.error("Gagal memuat galeri:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchGallery();
}, []);

  const isItemVideo = (item: any) => {
    return item.type === "video" || 
           (item.media_type && item.media_type.includes("video")) || 
           (item.image && item.image.match(/\.(mp4|webm|ogg|mov)$/i));
  };

  const filteredGallery = gallery.filter((item) => {
    const isVideo = isItemVideo(item);
    if (appliedType === "foto" && isVideo) return false;
    if (appliedType === "video" && !isVideo) return false;
    if (appliedCategory !== "Semua" && item.category !== appliedCategory) return false;
    return true;
  });

  const handleApplyFilter = () => {
    setAppliedType(tempType);
    setAppliedCategory(tempCategory);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setTempType("Semua");
    setTempCategory("Semua");
    setAppliedType("Semua");
    setAppliedCategory("Semua");
    setIsFilterOpen(false);
  };

  // --- HANDLER ZOOM (Mouse Wheel + Mobile Touch Pinch + Drag) ---
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.25 : -0.25;
    setZoomScale((prev) => {
      const nextScale = Math.min(Math.max(1, prev + zoomFactor), 4);
      if (nextScale === 1) setPosition({ x: 0, y: 0 });
      return nextScale;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistRef.current = dist;
    } else if (e.touches.length === 1 && zoomScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - touchDistRef.current) * 0.01;
      setZoomScale((prev) => {
        const nextScale = Math.min(Math.max(1, prev + delta), 4);
        if (nextScale === 1) setPosition({ x: 0, y: 0 });
        return nextScale;
      });
      touchDistRef.current = dist;
    } else if (e.touches.length === 1 && isDragging && zoomScale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
    setIsDragging(false);
  };

  const isSelectedVideo = selectedMedia && isItemVideo(selectedMedia);
  const isFiltered = appliedType !== "Semua" || appliedCategory !== "Semua";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600 mr-2" size={24} />
        <span className="text-xs text-slate-500 font-medium tracking-wider">Memuat galeri desa...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 pt-24 sm:pt-28 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Background Soft Glow Effects */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Title & Tombol Buka Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/75 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-white/80 shadow-xl shadow-sky-900/5">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
              <ImageIcon size={14} /> Dokumentasi & Momen Kegiatan
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Galeri Tugu Selatan
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-xl leading-relaxed">
              Jelajahi berbagai potret keindahan alam, aktivitas warga, wisata, homestay, serta ragam UMKM di Desa Wisata Tugu Selatan.
            </p>
          </div>

          <button
            onClick={() => {
              setTempType(appliedType);
              setTempCategory(appliedCategory);
              setIsFilterOpen(true);
            }}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-lg shrink-0 ${
              isFiltered 
                ? "bg-sky-600 text-white shadow-sky-600/20" 
                : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10"
            }`}
          >
            <SlidersHorizontal size={16} />
            {isFiltered ? "Filter Aktif (Diterapkan)" : "Filter Media & Kategori"}
          </button>
        </div>

        {/* Gallery Content Grid */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item) => {
              const isVideo = isItemVideo(item);
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedMedia(item)}
                  className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                    {isVideo ? (
                      <>
                        <video src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80" muted />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-sky-600/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-300">
                            <Play size={18} fill="white" className="ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <Image 
                        src={item.image} 
                        alt={item.title || "Galeri"} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-110 transition duration-700" 
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider shadow flex items-center gap-1">
                      {isVideo ? <Film size={10} /> : <ImageIcon size={10} />} {item.category}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-1.5 bg-white/40 backdrop-blur-md">
                    <h3 className="text-xs font-bold text-slate-900 tracking-wide truncate">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-light">
                      🕒 {item.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/75 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-xl shadow-sky-900/5 max-w-md mx-auto space-y-4">
            <ImageIcon className="mx-auto text-slate-300" size={40} />
            <p className="text-xs text-slate-500 font-normal">Tidak ada media yang cocok dengan filter yang dipilih.</p>
            <button 
              onClick={handleResetFilter}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-sky-600 transition cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>

      {/* MODAL FILTER */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-sky-600" /> Filter Galeri & Kegiatan
              </h3>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Tipe Media</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Semua", value: "Semua" },
                    { label: "📸 Foto", value: "foto" },
                    { label: "🎥 Video", value: "video" }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTempType(type.value as any)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border text-center ${
                        tempType === type.value
                          ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Kategori Kegiatan</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTempCategory(cat)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        tempCategory === cat
                          ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleResetFilter}
                className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-2 py-3.5 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={16} /> Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP FULLSCREEN (RAPI PRESISI PRESISI BINGKAI FOTO) */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200">
          
          {/* Tombol Tutup Kanan Atas */}
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-5 right-5 z-50 p-3 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white transition cursor-pointer shadow-xl flex items-center justify-center"
            title="Tutup"
          >
            <X size={18} />
          </button>

          {/* Container Media: Ukuran Pas Mengikuti Bingkai Gambar Tanpa Latar Lebar */}
          <div 
            ref={mediaContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative max-w-[90vw] max-h-[85vh] w-fit h-fit rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl group flex items-center justify-center bg-black select-none cursor-grab active:cursor-grabbing"
          >
            {isSelectedVideo ? (
              <video 
                src={selectedMedia.image || selectedMedia.video_url} 
                controls 
                autoPlay 
                className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-[2rem]"
              />
            ) : (
              <div 
                style={{
                  transform: `scale(${zoomScale}) translate(${position.x / zoomScale}px, ${position.y / zoomScale}px)`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
                className="relative max-h-[85vh] max-w-[90vw] w-fit h-fit flex items-center justify-center"
              >
                <img 
                  src={selectedMedia.image} 
                  alt={selectedMedia.title} 
                  className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-[2rem] pointer-events-none"
                />
              </div>
            )}

            {/* OVERLAY JUDUL, KATEGORI, DAN TANGGAL (TEPAT DI DALAM BINGKAI GAMBAR) */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none flex flex-col justify-end space-y-1.5 rounded-b-[2rem]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-sky-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  {selectedMedia.category || (isSelectedVideo ? "Video Kegiatan" : "Dokumentasi Foto")}
                </span>
                <span className="text-[11px] text-slate-300 font-light">
                  🕒 {selectedMedia.date}
                </span>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-white tracking-wide leading-snug drop-shadow-md">
                {selectedMedia.title}
              </h3>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}