"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Users, Compass, Award, Building2 } from "lucide-react";

export default function ProfilDesaPage() {
  const [profil, setProfil] = useState({
    sejarah: "",
    visi: "",
    misi: "",
    struktur: [],
    statistik: [],
    image_sejarah_url: ""
  });
  const [loading, setLoading] = useState(true);

  // Endpoint API WordPress Tugu Selatan
  const apiEndpoint = "/api-wp/tugu-bridge/v1/profil-desa";

 useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch(`${apiEndpoint}?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        
        if (data && data.success && data.profil) {
          setProfil({
            sejarah: data.profil.sejarah || "",
            visi: data.profil.visi || "",
            misi: data.profil.misi || "",
            struktur: Array.isArray(data.profil.struktur) ? data.profil.struktur : [],
            statistik: Array.isArray(data.profil.statistik) ? data.profil.statistik : [],
            image_sejarah_url: data.profil.image_sejarah_url || ""
          });
        }
      } catch (err) {
        console.error("Gagal memuat profil desa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={32} />
        <span className="ml-2 text-xs text-slate-500 font-medium tracking-wider">Memuat Profil Tugu Selatan...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 pt-20 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* BACKGROUND LIGHT GLOW (Sesuai Konsep Beranda) */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-[25rem] h-[25rem] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        
        {/* HEADER TITLE */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Profil & Sejarah <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">
              Desa Tugu Selatan
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Mengenal lebih dekat lembar sejarah, visi strategis, serta jajaran pengelola Kelompok Sadar Wisata (Pokdarwis) Desa Wisata Tugu Selatan Puncak.
          </p>
        </div>

        {/* SEJARAH SINGKAT (Fluid Glass Container) */}
        {profil.sejarah && (
          <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-white/80 shadow-xl shadow-sky-900/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {profil.image_sejarah_url && (
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner group">
                <Image 
                  src={profil.image_sejarah_url} 
                  alt="Sejarah Desa" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition duration-700" 
                />
              </div>
            )}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Jejak Langkah</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Sejarah Singkat Desa</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
                {profil.sejarah}
              </p>
            </div>
          </div>
        )}

        {/* VISI & MISI */}
        {(profil.visi || profil.misi) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profil.visi && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 backdrop-blur-xl border border-slate-700/50 text-white p-8 sm:p-10 rounded-[2.5rem] space-y-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4 z-10">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1">
                    <Compass size={12} /> Arah Strategis
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Visi Utama Desa</h3>
                  <blockquote className="text-sm text-slate-200 italic leading-relaxed border-l-2 border-sky-400 pl-4 font-light">
                    &ldquo;{profil.visi}&rdquo;
                  </blockquote>
                </div>
                <p className="text-[10px] text-sky-400/80 uppercase tracking-widest font-semibold z-10 pt-4 border-t border-white/10">
                  Target Pembangunan Jangka Panjang
                </p>
              </div>
            )}

            {profil.misi && (
              <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-white/80 space-y-6 shadow-xl shadow-sky-900/5 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1">
                    <Award size={12} /> Langkah Kerja
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Misi Kerja Desa</h3>
                  <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-2 font-normal">
                    {profil.misi}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STRUKTUR ORGANISASI POKDARWIS */}
        {Array.isArray(profil.struktur) && profil.struktur.length > 0 && (
          <div className="space-y-10 text-center">
            <div className="space-y-2">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Jajaran Pengelola Utama</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Struktur Organisasi Pokdarwis</h2>
            </div>

            <div className="flex flex-wrap justify-center items-stretch gap-6">
              {profil.struktur.map((item: any, idx: number) => (
                <div key={idx} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-sm bg-white/75 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-lg hover:shadow-2xl hover:border-sky-500/30 transition duration-300 flex flex-col justify-between text-center">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-sky-50 border border-sky-500/20 text-sky-600 rounded-2xl mx-auto flex items-center justify-center font-bold shadow-sm">
                      <Users size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">{item.jabatan}</span>
                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide">{item.nama}</h4>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">{item.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATISTIK DESA */}
        {Array.isArray(profil.statistik) && profil.statistik.length > 0 && (
          <div className="bg-white/75 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-white/80 shadow-xl shadow-sky-900/5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center justify-center items-center">
              {profil.statistik.map((stat: any, idx: number) => (
                <div key={idx} className="space-y-2 p-4 border-b sm:border-b-0 sm:border-r border-slate-200/80 last:border-none">
                  <h4 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">{stat.nilai}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}