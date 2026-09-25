"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Upload, Trash2, Loader2, Image as ImageIcon, Play, Film, RefreshCw, X, Eye, Sparkles } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  date?: string;
}

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [previewMedia, setPreviewMedia] = useState<GalleryItem | null>(null);

  // State Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Proxy Next.js ke WordPress REST API Tugu Selatan
  const apiEndpoint = "/api-wp/tugu-bridge/v1/gallery-items";

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.gallery)) {
        setGallery(data.gallery);
      } else {
        setGallery([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat daftar galeri dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Pilih file foto atau video dari perangkat Anda!");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 20MB.");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Mengunggah media ke database Desa Tugu Selatan...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });
    const formData = new FormData();
    formData.append("title", title.trim() || "Dokumentasi Tugu Selatan");
    formData.append("category", category.trim() || "Umum");
    formData.append("image_file", file);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      toast.dismiss(loadingToast);

      if (res.ok && data.success) {
        toast.success("Media galeri berhasil disimpan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        setTitle("");
        setCategory("");
        setFile(null);
        fetchGallery();
      } else {
        toast.error(`Gagal mengunggah: ${data.message || "Kesalahan server"}`);
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-800">Yakin ingin menghapus media galeri ini secara permanen?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Menghapus media...", {
                style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
              });
              try {
                const res = await fetch(`${apiEndpoint}?id=${id}`, {
                  method: "DELETE",
                });
                const data = await res.json();
                toast.dismiss(loadingToast);

                if (res.ok && data.success) {
                  toast.success("Media galeri berhasil dihapus!");
                  setGallery((prev) => prev.filter((item) => item.id !== id));
                  if (previewMedia?.id === id) setPreviewMedia(null);
                } else {
                  toast.error("Gagal menghapus media dari server.");
                }
              } catch (err) {
                console.error(err);
                toast.dismiss(loadingToast);
                toast.error("Gagal terhubung ke server WordPress.");
              }
            }}
            className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-xl hover:bg-rose-700 transition cursor-pointer"
          >
            Ya, Hapus
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-xl cursor-pointer">
            Batal
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // Kategori Unik untuk Filter Tab
  const categories = ["Semua", ...Array.from(new Set(gallery.map((g) => g.category || "Umum")))];

  // Filter List Galeri
  const filteredGallery = selectedCategory === "Semua" 
    ? gallery 
    : gallery.filter((g) => (g.category || "Umum").toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 text-slate-800 font-sans antialiased selection:bg-sky-500 selection:text-white p-4 sm:p-6 lg:p-8 relative">
      
      {/* BACKGROUND LIGHT GLOW */}
      <div className="fixed top-0 left-1/4 w-[30rem] h-[30rem] bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse z-0"></div>
      <div className="fixed top-1/3 right-10 w-[25rem] h-[25rem] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none z-0"></div>

      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition cursor-pointer">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">Manajemen Galeri Desa Tugu Selatan</h1>
              <p className="text-xs text-slate-500 font-normal">Kelola dokumentasi foto & video (MP4/WebM) untuk landing page utama.</p>
            </div>
          </div>

          <button onClick={fetchGallery} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition flex items-center gap-2 text-xs font-bold cursor-pointer">
            <RefreshCw size={16} className={loading ? "animate-spin text-sky-600" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Form Upload */}
        <form onSubmit={handleUpload} className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-5">
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Upload size={18} className="text-sky-600" /> Upload Foto / Video Baru
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul / Keterangan Media</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Telaga Saat / Offroad Tea Mountain"
                className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kategori Media</label>
              <input 
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Alam, Event BPH, Offroad"
                className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">File Media <span className="text-slate-400 font-normal">(Maks. 20MB)</span></label>
              <input 
                type="file"
                accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-50/80 border border-slate-200/80 p-2.5 rounded-2xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer transition"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={uploading}
            className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <><Loader2 size={16} className="animate-spin" /> Mengunggah ke Server...</>
            ) : (
              <><Upload size={16} /> Unggah Media ke Database</>
            )}
          </button>
        </form>

        {/* List & Filter Media */}
        <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon size={18} className="text-sky-600" /> Media Galeri Tersimpan ({filteredGallery.length})
            </h2>

            {/* Filter Kategori Tabs */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                      selectedCategory === cat 
                        ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2 font-medium">
              <Loader2 className="animate-spin text-sky-600" size={18} /> Memuat galeri Tugu Selatan...
            </div>
          ) : filteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredGallery.map((item) => {
                const isVideo = item.image && item.image.match(/\.(mp4|webm|ogg|mov)$/i);
                
                return (
                  <div key={item.id} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-md transition duration-300">
                    <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setPreviewMedia(item)}>
                      {isVideo ? (
                        <>
                          <video src={item.image} className="w-full h-full object-cover opacity-80" muted />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-sky-600/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg">
                              <Play size={18} fill="white" className="ml-0.5" />
                            </div>
                          </div>
                        </>
                      ) : (
                        item.image ? (
                          <Image 
                            src={item.image} 
                            alt={item.title || "Galeri Tugu Selatan"} 
                            fill 
                            unoptimized
                            className="object-cover group-hover:scale-105 transition duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500"><ImageIcon size={24} /></div>
                        )
                      )}
                      
                      <span className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 border border-white/20">
                        {isVideo ? <Film size={10} /> : <ImageIcon size={10} />} {item.category || "Umum"}
                      </span>
                    </div>

                    <div className="p-4 flex items-center justify-between gap-2 bg-white">
                      <div className="truncate space-y-0.5 min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-800 uppercase truncate">{item.title || "Dokumentasi Tugu Selatan"}</h4>
                        {item.date && <p className="text-[10px] text-slate-400 font-medium">🕒 {item.date}</p>}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => setPreviewMedia(item)}
                          className="p-2 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 rounded-xl transition cursor-pointer"
                          title="Lihat Full Pratinjau"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                          title="Hapus Media"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic font-normal text-center py-12">Belum ada media galeri yang diunggah.</p>
          )}
        </div>

      </div>

      {/* Modal Preview Media */}
      {previewMedia && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl relative space-y-4 border border-white/80">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase">{previewMedia.title}</h3>
                <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                  <Sparkles size={11} /> {previewMedia.category}
                </span>
              </div>
              <button onClick={() => setPreviewMedia(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-950 max-h-[60vh] overflow-hidden relative">
              {previewMedia.image.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video src={previewMedia.image} controls autoPlay className="max-h-[55vh] w-auto rounded-2xl shadow-lg" />
              ) : (
                <img src={previewMedia.image} alt={previewMedia.title} className="max-h-[55vh] w-auto object-contain rounded-2xl shadow-lg" />
              )}
            </div>

            <div className="p-5 flex justify-end gap-2 border-t border-slate-100">
              <button onClick={() => handleDelete(previewMedia.id)} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm">
                <Trash2 size={14} /> Hapus Media Ini
              </button>
              <button onClick={() => setPreviewMedia(null)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}