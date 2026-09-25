"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Landmark, Users, BarChart2, Eye } from "lucide-react";

export default function AdminProfilPage() {
  const [sejarah, setSejarah] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [struktur, setStruktur] = useState<any[]>([]);
  const [statistik, setStatistik] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Endpoint Proxy Next.js khusus Tugu Selatan
  const apiEndpoint = "/api-wp/tugu-bridge/v1/profil-desa";

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch(`${apiEndpoint}?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.profil) {
          setSejarah(data.profil.sejarah ?? "");
          setVisi(data.profil.visi ?? "");
          setMisi(data.profil.misi ?? "");
          setStruktur(Array.isArray(data.profil.struktur) ? data.profil.struktur : []);
          setStatistik(Array.isArray(data.profil.statistik) ? data.profil.statistik : []);
          setImagePreview(data.profil.image_sejarah_url ?? "");
        }
      } catch (err) {
        console.error("Gagal memuat profil admin:", err);
        toast.error("Gagal memuat profil desa.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Menyimpan profil desa...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });

    const formData = new FormData();
    formData.append("sejarah", sejarah ?? "");
    formData.append("visi", visi ?? "");
    formData.append("misi", misi ?? "");
    formData.append("struktur", JSON.stringify(struktur ?? []));
    formData.append("statistik", JSON.stringify(statistik ?? []));
    
    if (imageFile) {
      formData.append("image_sejarah", imageFile);
    }

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      
      if (data.success) {
        toast.success("Profil desa berhasil disimpan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        if (data.profil) {
          setSejarah(data.profil.sejarah ?? "");
          setVisi(data.profil.visi ?? "");
          setMisi(data.profil.misi ?? "");
          setStruktur(Array.isArray(data.profil.struktur) ? data.profil.struktur : []);
          setStatistik(Array.isArray(data.profil.statistik) ? data.profil.statistik : []);
          setImagePreview(data.profil.image_sejarah_url ?? "");
        }
        setImageFile(null);
      } else {
        toast.error("Gagal menyimpan profil.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const addStruktur = () => setStruktur([...struktur, { nama: "", jabatan: "", deskripsi: "" }]);
  const removeStruktur = (idx: number) => setStruktur(struktur.filter((_, i) => i !== idx));

  const addStatistik = () => setStatistik([...statistik, { label: "", nilai: "" }]);
  const removeStatistik = (idx: number) => setStatistik(statistik.filter((_, i) => i !== idx));

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

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition cursor-pointer">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">Manajemen Profil Desa</h1>
              <p className="text-xs text-slate-500 font-normal">Perbarui sejarah, visi, misi, struktur pokdarwis, & statistik Tugu Selatan.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Sejarah & Foto */}
          <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-5">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Landmark size={18} className="text-sky-600" /> Sejarah Singkat & Upload Foto dari Perangkat
            </h2>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teks Sejarah Desa</label>
              <textarea 
                rows={5}
                value={sejarah}
                onChange={(e) => setSejarah(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-normal leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
                placeholder="Tuliskan sejarah desa di sini..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih File Foto Sejarah (JPG/PNG)</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50/80 border border-slate-200/80 p-2.5 rounded-2xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer transition"
                />
              </div>

              {imagePreview && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                  <Image src={imagePreview} alt="Preview Sejarah" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-5">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Eye size={18} className="text-sky-600" /> Visi & Misi Desa
            </h2>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visi</label>
              <input 
                type="text"
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                placeholder="Masukkan visi desa..."
                className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Misi</label>
              <textarea 
                rows={4}
                value={misi}
                onChange={(e) => setMisi(e.target.value)}
                placeholder="Masukkan poin-poin misi desa..."
                className="w-full bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-normal leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
              />
            </div>
          </div>

          {/* Struktur Organisasi Pokdarwis */}
          <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Users size={18} className="text-sky-600" /> Struktur Organisasi Pokdarwis
              </h2>
              <button type="button" onClick={addStruktur} className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-sky-200/60">
                <Plus size={14} /> Tambah Anggota
              </button>
            </div>

            <div className="space-y-4">
              {struktur.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 relative shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <input 
                      type="text"
                      placeholder="Nama Lengkap"
                      value={item.nama}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStruktur(struktur.map((s, i) => i === idx ? {...s, nama: val} : s));
                      }}
                      className="bg-white border border-slate-200/80 p-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                    <input 
                      type="text"
                      placeholder="Jabatan"
                      value={item.jabatan}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStruktur(struktur.map((s, i) => i === idx ? {...s, jabatan: val} : s));
                      }}
                      className="bg-white border border-slate-200/80 p-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                  <input 
                    type="text"
                    placeholder="Deskripsi Singkat"
                    value={item.deskripsi}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStruktur(struktur.map((s, i) => i === idx ? {...s, deskripsi: val} : s));
                    }}
                    className="w-full bg-white border border-slate-200/80 p-3 rounded-xl text-xs font-normal text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <button type="button" onClick={() => removeStruktur(idx)} className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 p-1.5 bg-rose-50 rounded-xl transition cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Statistik Desa */}
          <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart2 size={18} className="text-sky-600" /> Statistik Desa
              </h2>
              <button type="button" onClick={addStatistik} className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-sky-200/60">
                <Plus size={14} /> Tambah Statistik
              </button>
            </div>

            <div className="space-y-3">
              {statistik.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
                  <input 
                    type="text"
                    placeholder="Label (contoh: Luas Wilayah)"
                    value={stat.label}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStatistik(statistik.map((s, i) => i === idx ? {...s, label: val} : s));
                    }}
                    className="flex-1 bg-white border border-slate-200/80 p-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <input 
                    type="text"
                    placeholder="Nilai (contoh: 12.5 km²)"
                    value={stat.nilai}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStatistik(statistik.map((s, i) => i === idx ? {...s, nilai: val} : s));
                    }}
                    className="flex-1 bg-white border border-slate-200/80 p-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <button type="button" onClick={() => removeStatistik(idx)} className="text-rose-500 hover:text-rose-700 p-2 bg-rose-50 rounded-xl transition cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan & Perbarui Profil Desa</>}
          </button>

        </form>
      </div>
    </div>
  );
}