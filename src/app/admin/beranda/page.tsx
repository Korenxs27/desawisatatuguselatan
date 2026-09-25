"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  LayoutTemplate, 
  Image as ImageIcon, 
  Type, 
  Sparkles,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function AdminBerandaPage() {
  const [hero, setHero] = useState({
    title_line_1: "",
    title_line_2: "",
    description: "",
    button_text: "",
    button_url: "",
    image_url: ""
  });

  // Urutan section lengkap Tugu Selatan (Paket Wisata, Wisata Alam, UMKM, Homestay, Gallery)
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'paket', 'wisata', 'umkm', 'homestay', 'gallery'
  ]);

  // State kustomisasi judul section
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({
    paket: "Paket Wisata & Petualangan",
    wisata: "Destinasi Wisata Puncak",
    umkm: "Produk UMKM Pilihan Warga",
    homestay: "Penginapan & Homestay Asri",
    gallery: "Dokumentasi & Galeri Desa"
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // MENGGUNAKAN PROXY NEXT.JS
  const apiBerandaEndpoint = "/api-wp/tugu-bridge/v1/beranda-settings";
  const apiProfilEndpoint = "/api-wp/tugu-bridge/v1/profil-desa";

  useEffect(() => {
    const fetchBerandaAdmin = async () => {
      try {
        // 1. Fetch Setting Hero dari Beranda Endpoint
        const resBeranda = await fetch(`${apiBerandaEndpoint}?t=${Date.now()}`, { cache: "no-store" });
        const dataBeranda = await resBeranda.json();

        if (dataBeranda.success && dataBeranda.beranda) {
          const b = dataBeranda.beranda;
          setHero({
            title_line_1: b.hero_title_1 || b.hero_title || "",
            title_line_2: b.hero_title_2 || "",
            description: b.hero_subtitle || "",
            button_text: b.button_text || "",
            button_url: b.button_url || "",
            image_url: b.hero_image_url || ""
          });
        }

        // 2. Fetch Urutan Section dari Profil Endpoint
        const resProfil = await fetch(`${apiProfilEndpoint}?t=${Date.now()}`, { cache: "no-store" });
        const dataProfil = await resProfil.json();

        if (dataProfil.success && dataProfil.profil) {
          if (Array.isArray(dataProfil.profil.section_order) && dataProfil.profil.section_order.length > 0) {
            const validSections = ['paket', 'wisata', 'umkm', 'homestay', 'gallery'];
            const filteredOrder = dataProfil.profil.section_order.filter((s: string) => validSections.includes(s));
            setSectionOrder(filteredOrder.length > 0 ? filteredOrder : validSections);
          }
          if (dataProfil.profil.section_titles) {
            setSectionTitles((prev) => ({ ...prev, ...dataProfil.profil.section_titles }));
          }
        }
      } catch (err) {
        console.error("Gagal memuat data beranda admin:", err);
        toast.error("Gagal memuat data beranda.");
      } finally {
        setLoading(false);
      }
    };
    fetchBerandaAdmin();
  }, []);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    
    setSectionOrder(newOrder);
  };

  const handleTitleChange = (key: string, value: string) => {
    setSectionTitles(prev => ({ ...prev, [key]: value }));
  };

  const getDefaultSectionLabel = (key: string) => {
    switch(key) {
      case 'paket': return 'Paket Wisata & Petualangan';
      case 'wisata': return 'Destinasi Wisata Puncak';
      case 'umkm': return 'Produk UMKM Pilihan Warga';
      case 'homestay': return 'Penginapan & Homestay Asri';
      case 'gallery': return 'Dokumentasi & Galeri Desa';
      default: return key;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Menyimpan pengaturan beranda...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });

    try {
      // 1. Buat FormData khusus Hero Section
      const heroFD = new FormData();
      heroFD.append("hero_title_1", hero.title_line_1 || "");
      heroFD.append("hero_title_2", hero.title_line_2 || "");
      heroFD.append("hero_subtitle", hero.description || "");
      heroFD.append("button_text", hero.button_text || "");
      heroFD.append("button_url", hero.button_url || "");
      
      if (imageFile) {
        heroFD.append("hero_image", imageFile);
      }

      // 2. Buat FormData khusus Urutan & Judul Section
      const profilFD = new FormData();
      profilFD.append("section_order", JSON.stringify(sectionOrder));
      profilFD.append("section_titles", JSON.stringify(sectionTitles));

      // Kirim request bersamaan
      const [resHero] = await Promise.all([
        fetch(apiBerandaEndpoint, { 
          method: "POST", 
          body: heroFD 
        }),
        fetch(apiProfilEndpoint, { 
          method: "POST", 
          body: profilFD 
        })
      ]);

      const dataHero = await resHero.json();
      toast.dismiss(loadingToast);

      if (dataHero.success && dataHero.beranda) {
        toast.success("Pengaturan Beranda berhasil disimpan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        const b = dataHero.beranda;
        setHero({
          title_line_1: b.hero_title_1 || "",
          title_line_2: b.hero_title_2 || "",
          description: b.hero_subtitle || "",
          button_text: b.button_text || "",
          button_url: b.button_url || "",
          image_url: b.hero_image_url || ""
        });
        setImageFile(null);
      } else {
        toast.error("Gagal menyimpan Hero Section ke server.");
      }
    } catch (err) {
      console.error("Error submit:", err);
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 text-slate-800 font-sans antialiased selection:bg-sky-500 selection:text-white p-4 sm:p-6 lg:p-8 relative">
      
      {/* BACKGROUND LIGHT GLOW */}
      <div className="fixed top-0 left-1/4 w-[30rem] h-[30rem] bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse z-0"></div>
      <div className="fixed top-1/3 right-10 w-[25rem] h-[25rem] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none z-0"></div>

      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white/75 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-200/90 shadow-lg">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition cursor-pointer">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">Manajemen Beranda Tugu Selatan</h1>
              <p className="text-xs text-slate-500 font-normal">Atur konten Hero Section, judul, dan urutan section untuk halaman depan Tugu Selatan.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Hero Section Pengaturan */}
          <div className="bg-white/75 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-5">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon size={18} className="text-sky-600" /> Konten Hero Section Utama
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Baris 1 (Teks Hitam)</label>
                <input
                  type="text"
                  value={hero.title_line_1 ?? ""}
                  onChange={(e) => setHero({...hero, title_line_1: e.target.value})}
                  className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  placeholder="Contoh: DESA WISATA"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Baris 2 (Warna Biru Gradasi)</label>
                <input
                  type="text"
                  value={hero.title_line_2 ?? ""}
                  onChange={(e) => setHero({...hero, title_line_2: e.target.value})}
                  className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  placeholder="Contoh: TUGU SELATAN"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Singkat</label>
              <textarea 
                rows={3}
                value={hero.description}
                onChange={(e) => setHero({...hero, description: e.target.value})}
                className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-normal leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
                placeholder="Masukkan deskripsi singkat..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teks Tombol</label>
                <input 
                  type="text"
                  value={hero.button_text}
                  onChange={(e) => setHero({...hero, button_text: e.target.value})}
                  className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  placeholder="Contoh: Eksplorasi Destinasi"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Link Tujuan Tombol</label>
                <input 
                  type="text"
                  value={hero.button_url}
                  onChange={(e) => setHero({...hero, button_url: e.target.value})}
                  className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  placeholder="Contoh: #paket-wisata"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Upload Gambar Hero Baru (Opsional)</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50/80 border border-slate-200/80 p-2.5 rounded-2xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer transition"
                />
              </div>

              {/* Pratinjau Gambar Hero */}
              {hero.image_url && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                  <Image src={hero.image_url} alt="Preview Hero" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Pengaturan Urutan Section & Kustomisasi Judul Section */}
          <div className="bg-white/75 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-5">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <LayoutTemplate size={18} className="text-sky-600" /> Atur Urutan & Judul Section Beranda
              </h2>
              <p className="text-xs text-slate-400 font-normal mt-1">Gunakan tombol naik/turun untuk mengatur susunan section yang tampil di Beranda utama.</p>
            </div>

            <div className="space-y-3">
              {sectionOrder.map((sectionKey, idx) => (
                <div key={sectionKey} className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} /> Posisi ke-{idx + 1} ({getDefaultSectionLabel(sectionKey)})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        type="button" 
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-30 transition flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowUp size={12} /> Naik
                      </button>
                      <button 
                        type="button" 
                        disabled={idx === sectionOrder.length - 1}
                        onClick={() => moveSection(idx, 'down')}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-30 transition flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDown size={12} /> Turun
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Judul Section di Beranda</label>
                    <div className="relative flex items-center">
                      <Type size={14} className="absolute left-3.5 text-slate-400" />
                      <input 
                        type="text"
                        value={sectionTitles[sectionKey] || ""}
                        onChange={(e) => handleTitleChange(sectionKey, e.target.value)}
                        className="w-full bg-white border border-slate-200/80 pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                        placeholder="Masukkan judul section..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan & Perbarui Beranda</>}
          </button>

        </form>
      </div>
    </div>
  );
}