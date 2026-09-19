"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import ClientBookingForm from "../ClientBookingForm";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Info, 
  Images, 
  ZoomIn, 
  X, 
  MapPin 
} from "lucide-react";

export default function DetailWisataPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const identifier = resolvedParams?.slug;
  const router = useRouter();

  const [wisata, setWisata] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const baseUrl = "/api-wp";

  // Lock scroll saat lightbox modal aktif
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeImage]);

  // Fetch data wisata dari WordPress API Tugu Selatan
  useEffect(() => {
    async function fetchWisataDetail() {
      if (!identifier) return;
      setLoading(true);

      try {
        const isId = /^\d+$/.test(identifier);
        const apiUrl = isId 
          ? `${baseUrl}/wp/v2/wisata/${identifier}?_embed&t=${Date.now()}`
          : `${baseUrl}/wp/v2/wisata?slug=${identifier}&_embed&t=${Date.now()}`;

        const res = await fetch(apiUrl, { cache: "no-store" });
        if (res.ok) {
          const rawData = await res.json();
          const foundItem = isId 
            ? (rawData?.id ? rawData : null) 
            : (Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : null);

          setWisata(foundItem);
        } else {
          setWisata(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail wisata WordPress:", err);
        setWisata(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWisataDetail();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          Memuat detail wisata Tugu Selatan...
        </div>
      </div>
    );
  }

  if (!wisata) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center space-y-4">
        <span className="text-4xl">🏔️</span>
        <h2 className="text-lg font-bold text-slate-800">Wisata Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Maaf, destinasi atau paket wisata yang Anda cari tidak tersedia di sistem Tugu Selatan.
        </p>
        <button 
          onClick={() => router.back()} 
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition hover:bg-emerald-800"
        >
          &larr; Kembali
        </button>
      </div>
    );
  }

  // =========================================================
  // LOGIKA AMAN EXTRACTION DATA WORDPRESS & ACF
  // =========================================================
  const title = wisata.title?.rendered || "Paket Wisata";
  
  // 1. DESKRIPSI (Ambil dari Content, Excerpt, atau ACF Deskripsi)
  const acf = wisata.acf || {};
  const contentHtml = wisata.content?.rendered || wisata.excerpt?.rendered || acf.deskripsi_singkat || acf.deskripsi || "";

  // 2. GAMBAR UTAMA (Ambil dari Featured Image WP, ACF 'foto_utama', atau Placeholder)
  const mediaEmbed = wisata._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const acfMainImg = typeof acf.foto_utama === 'string' ? acf.foto_utama : acf.foto_utama?.url;
  const mainImage = mediaEmbed || acfMainImg || acf.gambar_utama || "https://desawisatatuguselatan.desa-wisata-bojongrangkas.com/wp-content/uploads/2026/placeholder.jpg";

  // 3. HARGA, DURASI, MIN PESERTA & KATEGORI
  const price = Number(acf.harga || acf.harga_minimal || acf.tarif || 0);
  const durasi = acf.durasi || acf.durasi_paket || acf.lama_kunjungan || "1 Hari";
  const minPeserta = Number(acf.minimal_peserta || acf.min_peserta || 1);
  const category = acf.kategori || acf.category || "Destinasi Alam";
  const productId = Number(acf.produk_woocommerce_terkait || wisata.id || 0);

  // 4. PARSING FASILITAS (Bisa berupa Array of Strings, Array of Objects, atau Text Terpisah Koma)
  let fasilitasList: string[] = [];
  const rawFasilitas = acf.fasilitas || acf.fasilitas_paket || acf.fasilitas_wisata;

  if (Array.isArray(rawFasilitas)) {
    fasilitasList = rawFasilitas.map((item: any) => typeof item === "string" ? item : item.nama_fasilitas || item.fasilitas || item.label || "");
  } else if (typeof rawFasilitas === "string" && rawFasilitas.trim().length > 0) {
    fasilitasList = rawFasilitas.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  }

  // 5. PARSING GALERI FOTO (Bisa Array of Image URLs, Array of Objects ACF Gallery)
  let galleryList: string[] = [];
  const rawGallery = acf.gallery_images || acf.gallery_paket || acf.galeri_foto || acf.galeri;

  if (Array.isArray(rawGallery)) {
    galleryList = rawGallery.map((item: any) => {
      if (typeof item === "string") return item;
      return item.url || item.source_url || item.sizes?.large || "";
    }).filter(Boolean);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 pt-16 sm:pt-20 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Midtrans Snap Client SDK */}
      <Script 
        src="https://app.midtrans.com/snap/snap.js" 
        data-client-key="Mid-client-q343rAbCQUljWRLn" 
        strategy="afterInteractive" 
      />

      {/* POPUP LIGHTBOX FOTO MODAL */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <button 
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
          >
            <X size={20} />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image 
              src={activeImage} 
              alt="Preview Penuh" 
              fill 
              className="object-contain rounded-2xl" 
            />
          </div>
        </div>
      )}

      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* Tombol Kembali */}
        <div>
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/90 backdrop-blur-md border border-slate-200/80 px-4 py-2 rounded-full hover:bg-slate-100 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
          
          {/* KOLOM KIRI: DOKUMENTASI & DESKRIPSI LENGKAP */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Banner Utama */}
            <div 
              className="relative aspect-[16/10] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-xl cursor-pointer group"
              onClick={() => setActiveImage(mainImage)}
            >
              <Image 
                src={mainImage} 
                alt={title} 
                fill 
                priority 
                className="object-cover group-hover:scale-105 transition duration-700" 
              />
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl uppercase tracking-wider z-10 shadow flex items-center gap-1.5">
                <MapPin size={12} className="text-emerald-400" /> {category}
              </span>
            </div>

            {/* Informasi Detail */}
            <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/85 shadow-xl space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-100">
                    <Calendar size={14} className="text-emerald-600" /> Durasi: {durasi}
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-100">
                    <Users size={14} className="text-emerald-600" /> Min. Rombongan: {minPeserta} Orang
                  </span>
                </div>
              </div>

              {/* Deskripsi dari WordPress */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Info size={14} className="text-emerald-600" /> Detail Pengalaman & Informasi
                </h3>

                {contentHtml ? (
                  <div 
                    className="prose prose-slate text-xs text-slate-600 leading-relaxed max-w-none prose-p:mb-3 prose-strong:text-slate-900 prose-ul:list-disc prose-ul:pl-4"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                ) : (
                  <p className="text-xs text-slate-400 italic">Informasi detail mengenai destinasi ini belum ditambahkan.</p>
                )}
              </div>

              {/* Fasilitas */}
              {fasilitasList.length > 0 && (
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Fasilitas Termasuk
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {fasilitasList.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-medium">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Galeri Foto Tambahan */}
              {galleryList.length > 0 && (
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Images size={14} className="text-emerald-600" /> Galeri Foto ({galleryList.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryList.map((imgUrl: string, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => setActiveImage(imgUrl)}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition"
                      >
                        <Image src={imgUrl} alt={`Galeri ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <ZoomIn size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* KOLOM KANAN: FORM RESERVASI / E-TICKETING */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-[2rem] p-6 shadow-2xl space-y-5">
              
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tarif Kunjungan</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-emerald-600">
                    {price > 0 ? `Rp ${price.toLocaleString("id-ID")}` : "Gratis / Terbuka"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ Orang</span>
                </div>
              </div>

              {/* Client Booking Form */}
              <ClientBookingForm 
                productId={productId} 
                productName={title} 
                productPrice={price} 
                minPeserta={minPeserta}
                diskonMinimalPeserta={Number(acf.diskon_minimal_peserta || 0)}
                diskonNominal={Number(acf.diskon_nominal || 0)}
              />

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}