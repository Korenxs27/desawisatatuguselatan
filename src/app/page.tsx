"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  Home, 
  ShoppingBag, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Tag, 
  User, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  Film, 
  Bookmark, 
  CheckCircle2, 
  Trash2
} from "lucide-react";

const DEFAULT_PLACEHOLDER = "https://desawisatatuguselatan.desa-wisata-bojongrangkas.com/wp-content/uploads/2026/placeholder.jpg";

function getCleanExcerpt(item: any, fallbackText: string, maxLength = 110) {
  const rawContent = item.description || item.short_description || item.content?.rendered || item.excerpt?.rendered || item.acf?.deskripsi_singkat || "";
  const clean = rawContent.replace(/<[^>]*>?/gm, '').trim();
  if (!clean) return fallbackText;
  return clean.length > maxLength ? clean.substring(0, maxLength) + "..." : clean;
}

function BookmarkButton({ 
  item, 
  onNotify 
}: { 
  item: { id: any; title: string; slug: string; type: string; image: string }, 
  onNotify: (msg: string, type: 'add' | 'remove') => void 
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) return;
    
    const saved = localStorage.getItem(`wishlist_${userEmail}`);
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (list.some((b: any) => b.id == item.id && b.type == item.type)) {
          setIsBookmarked(true);
        }
      } catch (e) {
        console.error("Gagal parsing wishlist lokal:", e);
      }
    }
  }, [item]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
      onNotify("Silakan login terlebih dahulu untuk menyimpan ke favorit.", "remove");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api-wp/tugu-bridge/v1/toggle-bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, item })
      });
      const data = await res.json();

      if (data.success) {
        const newStatus = !isBookmarked;
        setIsBookmarked(newStatus);
        localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(data.bookmarks || []));
        
        if (newStatus) {
          onNotify(`"${item.title}" berhasil ditambahkan ke Favorit.`, "add");
        } else {
          onNotify(`"${item.title}" dihapus dari Favorit.`, "remove");
        }
      }
    } catch (err) {
      console.error("Gagal mengubah bookmark:", err);
      onNotify("Terjadi kesalahan koneksi.", "remove");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleBookmark}
      className={`p-2.5 rounded-full backdrop-blur-md transition shadow-md cursor-pointer transform active:scale-90 duration-200 ${
        isBookmarked ? 'bg-rose-500 text-white' : 'bg-white/80 hover:bg-white text-slate-700'
      }`}
      title={isBookmarked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} fill={isBookmarked ? "white" : "none"} />}
    </button>
  );
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'add' | 'remove' }>({
    show: false,
    message: '',
    type: 'add'
  });

  const triggerNotification = (message: string, type: 'add' | 'remove') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };
  
  const [heroData, setHeroData] = useState({
    title_line_1: "",
    title_line_2: "",
    description: "",
    button_text: "",
    button_url: "",
    image_url: ""
  });

  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'paket', 'wisata', 'umkm', 'homestay', 'gallery'
  ]);

  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({
    paket: "Paket Wisata & Petualangan",
    wisata: "Destinasi Wisata Puncak",
    umkm: "Produk UMKM Pilihan Warga",
    homestay: "Penginapan & Homestay Asri",
    gallery: "Dokumentasi & Galeri Desa"
  });

  const [paketWisataList, setPaketWisataList] = useState<any[]>([]);
  const [homestayList, setHomestayList] = useState<any[]>([]);
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [wisataList, setWisataList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);

  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const paketRef = useRef<HTMLDivElement>(null);
  const homestayRef = useRef<HTMLDivElement>(null);
  const umkmRef = useRef<HTMLDivElement>(null);
  const wisataRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const baseUrl = "/api-wp";
  const ck = "ck_11cb06d9375d3f54f8464420e3e41f4e6a1be250";
  const cs = "cs_1bd856c252221ea40104ed68505f58c3048de027";

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";
      setIsZoomed(false); 
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedMedia]);

  useEffect(() => {
    async function fetchHomePageData() {
      setLoading(true);

      // 1. Fetch Hero Settings
      try {
        const resSettings = await fetch(`${baseUrl}/tugu-bridge/v1/beranda-settings?t=${Date.now()}`, { cache: "no-store" });
        if (resSettings.ok) {
          const settingsData = await resSettings.json();
          if (settingsData && settingsData.success && settingsData.beranda) {
            const b = settingsData.beranda;
            setHeroData({
              title_line_1: b.hero_title_1 || b.hero_title || "",
              title_line_2: b.hero_title_2 || "",
              description: b.hero_subtitle || "",
              image_url: b.hero_image_url || "",
              button_text: b.button_text || "",
              button_url: b.button_url || "",
            });
          }
        }
      } catch (e) {
        console.error("Gagal memuat hero settings:", e);
      }

      // 2. Fetch Profil Desa & Section Titles
      try {
        const resProfil = await fetch(`${baseUrl}/tugu-bridge/v1/profil-desa?t=${Date.now()}`, { cache: "no-store" });
        if (resProfil.ok) {
          const profilData = await resProfil.json();
          if (profilData && profilData.success && profilData.profil) {
            if (Array.isArray(profilData.profil.section_order) && profilData.profil.section_order.length > 0) {
              setSectionOrder(profilData.profil.section_order);
            }
            if (profilData.profil.section_titles) {
              setSectionTitles((prev) => ({ ...prev, ...profilData.profil.section_titles }));
            }
          }
        }
      } catch (e) {
        console.error("Gagal memuat profil desa:", e);
      }

      // 3. Fetch Paket Wisata
      try {
        const resWisata = await fetch(`${baseUrl}/wp/v2/wisata?_embed&per_page=10`, { cache: "no-store" });
        if (resWisata.ok) {
          const wisataData = await resWisata.json();
          if (Array.isArray(wisataData)) setPaketWisataList(wisataData);
        }
      } catch (e) { console.error(e); }

      // 4. Fetch Objek Wisata
      try {
        const resObjek = await fetch(`${baseUrl}/wp/v2/wisata?_embed&per_page=10`, { cache: "no-store" });
        if (resObjek.ok) {
          const objekData = await resObjek.json();
          if (Array.isArray(objekData)) setWisataList(objekData);
        }
      } catch (e) { console.error(e); }

      // =========================================================
      // 5. FETCH PRODUK UMKM (DENGAN FILTER KETAT NON-UMKM)
      // =========================================================
      const combinedList: any[] = [];
      const seenIds = new Set<string>();

      // Filter ketat untuk membuang produk sistem/booking/wisata/offroad
      const isBookingOrSystemProduct = (name: string) => {
        if (!name) return true;
        const uppercaseName = name.toUpperCase().trim();
        return (
          uppercaseName.includes("[TUGU SELATAN]") ||
          uppercaseName.includes("[WISATA]") ||
          uppercaseName.includes("[HOMESTAY]") ||
          uppercaseName.includes("OFFROAD") ||
          uppercaseName.includes("BOOKING") ||
          uppercaseName.startsWith("TUGU SELATAN")
        );
      };

      // 5a. WooCommerce REST API
      try {
        const resWc = await fetch(`${baseUrl}/wc/v3/products?per_page=100&consumer_key=${ck}&consumer_secret=${cs}&t=${Date.now()}`, { cache: "no-store" });
        if (resWc.ok) {
          const dataWc = await resWc.json();
          if (Array.isArray(dataWc)) {
            dataWc.forEach((prod: any) => {
              const productName = prod.name || "";
              if (isBookingOrSystemProduct(productName)) return;

              const uniqueKey = `wc-${prod.id}`;
              if (!seenIds.has(uniqueKey)) {
                seenIds.add(uniqueKey);
                combinedList.push({
                  id: prod.id,
                  slug: prod.slug,
                  name: productName,
                  price: prod.price || prod.regular_price || 0,
                  images: [{ src: prod.images?.[0]?.src || DEFAULT_PLACEHOLDER }]
                });
              }
            });
          }
        }
      } catch (err) {
        console.error("Gagal fetch WooCommerce di Beranda:", err);
      }

      // 5b. Custom Post Type WordPress 'umkm'
      try {
        const resCpt = await fetch(`${baseUrl}/wp/v2/umkm?_embed&per_page=100&t=${Date.now()}`, { cache: "no-store" });
        if (resCpt.ok) {
          const dataCpt = await resCpt.json();
          if (Array.isArray(dataCpt)) {
            dataCpt.forEach((item: any) => {
              const productName = item.title?.rendered || "Produk UMKM";
              if (isBookingOrSystemProduct(productName)) return;

              const uniqueKey = `cpt-${item.id}`;
              if (!seenIds.has(uniqueKey)) {
                seenIds.add(uniqueKey);
                const acf = item.acf || {};
                const itemPrice = acf.harga || acf.harga_minimal || 0;
                const featuredImg = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || DEFAULT_PLACEHOLDER;

                combinedList.push({
                  id: item.id,
                  slug: item.slug,
                  name: productName,
                  price: itemPrice,
                  images: [{ src: featuredImg }]
                });
              }
            });
          }
        }
      } catch (err) {
        console.error("Gagal fetch CPT umkm di Beranda:", err);
      }

      setUmkmList(combinedList);

      // 6. Fetch Homestay
      try {
        const resHomestay = await fetch(`${baseUrl}/wp/v2/homestay?_embed&per_page=10`, { cache: "no-store" });
        if (resHomestay.ok) {
          const homestayData = await resHomestay.json();
          if (Array.isArray(homestayData)) setHomestayList(homestayData);
        }
      } catch (e) { }

      // 7. Fetch Galeri
      try {
        const resGallery = await fetch(`${baseUrl}/tugu-bridge/v1/gallery-items`, { cache: "no-store" });
        if (resGallery.ok) {
          const galleryData = await resGallery.json();
          if (galleryData.success && Array.isArray(galleryData.gallery)) {
            setGalleryList(galleryData.gallery);
          }
        }
      } catch (e) { console.error(e); }

      setLoading(false);
    }

    fetchHomePageData();
  }, []);

  const renderSection = (type: string) => {
    switch (type) {
      case 'paket':
        return (
          <section key="paket" id="paket-wisata" className="max-w-6xl mx-auto px-6 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5"><Compass size={14}/> Jelajahi Paket Pilihan</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{sectionTitles.paket}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel(paketRef, "left")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronLeft size={18} /></button>
                <button onClick={() => scrollCarousel(paketRef, "right")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronRight size={18} /></button>
              </div>
            </div>
            
            <div ref={paketRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
              {paketWisataList.length > 0 ? (
                paketWisataList.map((item: any) => {
                  const imgUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || DEFAULT_PLACEHOLDER;
                  const acf = item.acf || {};
                  const harga = acf.harga_minimal || acf.harga || 0;
                  const shortDesc = getCleanExcerpt(item, "Paket wisata pilihan terbaik di Tugu Selatan Puncak.");

                  return (
                    <div key={item.id} className="w-[85vw] sm:w-[45vw] lg:w-[28vw] shrink-0 snap-start">
                      <div className="group bg-white/75 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full justify-between relative">
                        <div className="absolute top-4 right-4 z-10">
                          <BookmarkButton item={{ id: item.id, title: item.title?.rendered || "Paket", slug: `/wisata/${item.slug}`, type: 'paket', image: imgUrl }} onNotify={triggerNotification} />
                        </div>
                        <Link href={`/wisata/${item.slug}`} className="flex flex-col h-full justify-between">
                          <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                            <Image src={imgUrl} alt={item.title?.rendered || "Wisata"} fill className="object-cover group-hover:scale-105 transition duration-500" />
                          </div>
                          <div className="p-6 space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight line-clamp-1">{item.title?.rendered}</h3>
                            <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">{shortDesc}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                              <span className="text-sky-600 font-bold">
                                {Number(harga) > 0 ? `Mulai Rp. ${Number(harga).toLocaleString("id-ID")}` : "Hubungi Pengelola"}
                              </span>
                              <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:bg-sky-600 transition duration-300">
                                <ArrowUpRight size={14} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic font-light py-6">Belum ada paket wisata terdaftar.</p>
              )}
            </div>
          </section>
        );

      case 'wisata':
        return (
          <section key="wisata" className="max-w-6xl mx-auto px-6 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={14}/> Destinasi Alam Puncak</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{sectionTitles.wisata}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel(wisataRef, "left")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronLeft size={18} /></button>
                <button onClick={() => scrollCarousel(wisataRef, "right")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronRight size={18} /></button>
              </div>
            </div>

            <div ref={wisataRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
              {wisataList.length > 0 ? (
                wisataList.map((item: any) => {
                  const imgUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || DEFAULT_PLACEHOLDER;
                  const acf = item.acf || {};
                  const harga = acf.harga || acf.harga_minimal || 0;
                  const shortDesc = getCleanExcerpt(item, "Destinasi wisata alam yang indah dan menyejukkan.");

                  return (
                    <div key={item.id} className="w-[85vw] sm:w-[45vw] lg:w-[28vw] shrink-0 snap-start">
                      <div className="group bg-white/75 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full justify-between relative">
                        <div className="absolute top-4 right-4 z-10">
                          <BookmarkButton item={{ id: item.id, title: item.title?.rendered || "Destinasi", slug: `/wisata/${item.slug}`, type: 'wisata', image: imgUrl }} onNotify={triggerNotification} />
                        </div>
                        <Link href={`/wisata/${item.slug}`} className="flex flex-col h-full justify-between">
                          <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                            <Image src={imgUrl} alt={item.title?.rendered || "Destinasi"} fill className="object-cover group-hover:scale-105 transition duration-500" />
                          </div>
                          <div className="p-6 space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight line-clamp-1">{item.title?.rendered}</h3>
                            <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">{shortDesc}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                              <span className="text-sky-600 font-bold">
                                {Number(harga) > 0 ? `Rp. ${Number(harga).toLocaleString("id-ID")}` : "Gratis / Terbuka"}
                              </span>
                              <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:bg-sky-600 transition duration-300">
                                <ArrowUpRight size={14} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic font-light py-6">Belum ada objek wisata terdaftar.</p>
              )}
            </div>
          </section>
        );

      case 'umkm':
        return (
          <section key="umkm" className="max-w-6xl mx-auto px-6 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5"><ShoppingBag size={14}/> Oleh-Oleh Khas Desa</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{sectionTitles.umkm}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel(umkmRef, "left")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronLeft size={18} /></button>
                <button onClick={() => scrollCarousel(umkmRef, "right")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronRight size={18} /></button>
              </div>
            </div>

            <div ref={umkmRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
              {umkmList.length > 0 ? (
                umkmList.map((product: any) => {
                  const imgUrl = product.images?.[0]?.src || DEFAULT_PLACEHOLDER;
                  const productName = product.name;
                  const productPrice = product.price || 0;
                  return (
                    <div key={product.id} className="w-[65vw] sm:w-[35vw] lg:w-[22vw] shrink-0 snap-start">
                      <div className="group bg-white/75 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-200/90 p-5 shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between h-full relative">
                        <div className="absolute top-4 right-4 z-10">
                          <BookmarkButton item={{ id: product.id, title: productName, slug: `/umkm/${product.slug}`, type: 'umkm', image: imgUrl }} onNotify={triggerNotification} />
                        </div>
                        <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden mb-4">
                          <Image src={imgUrl} alt={productName || "UMKM"} fill className="object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-slate-900 line-clamp-1 uppercase tracking-tight">{productName}</h3>
                          <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
                            <span className="text-sky-600 font-bold">{productPrice ? `Rp. ${parseInt(productPrice).toLocaleString("id-ID")}` : "Hubungi Penjual"}</span>
                            <Link href={`/umkm/${product.slug}`} className="text-[10px] bg-slate-900 hover:bg-sky-600 text-white font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider transition flex items-center gap-1 shadow-sm">
                              Detail <Tag size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic font-light py-6">Belum ada produk UMKM terdaftar.</p>
              )}
            </div>
          </section>
        );

      case 'homestay':
        return (
          <section key="homestay" className="max-w-6xl mx-auto px-6 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5"><Home size={14}/> Hunian Autentik Warga</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{sectionTitles.homestay}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel(homestayRef, "left")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronLeft size={18} /></button>
                <button onClick={() => scrollCarousel(homestayRef, "right")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronRight size={18} /></button>
              </div>
            </div>

            <div ref={homestayRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
              {homestayList.length > 0 ? (
                homestayList.map((homestay: any) => {
                  const imgUrl = homestay._embedded?.["wp:featuredmedia"]?.[0]?.source_url || DEFAULT_PLACEHOLDER;
                  const acf = homestay.acf || {};
                  const harga = acf.harga_per_malam || acf.harga || 0;
                  const shortDesc = getCleanExcerpt(homestay, "Penginapan asri bernuansa khas pedesaan.");

                  return (
                    <div key={homestay.id} className="w-[85vw] sm:w-[45vw] lg:w-[28vw] shrink-0 snap-start">
                      <div className="group bg-white/75 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full justify-between relative">
                        <div className="absolute top-4 right-4 z-10">
                          <BookmarkButton item={{ id: homestay.id, title: homestay.title?.rendered || "Homestay", slug: `/homestay/${homestay.slug}`, type: 'homestay', image: imgUrl }} onNotify={triggerNotification} />
                        </div>
                        <Link href={`/homestay/${homestay.slug}`} className="flex flex-col h-full justify-between">
                          <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                            <Image src={imgUrl} alt={homestay.title?.rendered || "Homestay"} fill className="object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md border border-white/10 text-white text-[9px] px-3 py-1 rounded-lg flex items-center gap-1">
                              <User size={10} /> Pemilik: {acf.nama_pemilik || "Warga Tugu Selatan"}
                            </div>
                          </div>
                          <div className="p-6 space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight line-clamp-1">{homestay.title?.rendered}</h3>
                            <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">{shortDesc}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[9px] font-light">Tarif / Malam</span>
                                <span className="text-sky-600 font-bold text-sm">
                                  {Number(harga) > 0 ? `Rp. ${Number(harga).toLocaleString("id-ID")}` : "Hubungi Pemilik"}
                                </span>
                              </div>
                              <span className="bg-sky-50 text-sky-700 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider border border-sky-500/20">Sewa</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic font-light py-6">Belum ada homestay terdaftar.</p>
              )}
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key="gallery" className="max-w-6xl mx-auto px-6 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5"><ImageIcon size={14}/> Potret Kegiatan & Suasana</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{sectionTitles.gallery}</h2>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/gallery" className="text-xs font-bold text-sky-600 hover:text-sky-700 hidden sm:inline-block">
                  Lihat Semua Galeri &rarr;
                </Link>
                <div className="flex gap-2">
                  <button onClick={() => scrollCarousel(galleryRef, "left")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronLeft size={18} /></button>
                  <button onClick={() => scrollCarousel(galleryRef, "right")} className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 hover:bg-white shadow-sm transition cursor-pointer"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>

            <div ref={galleryRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
              {galleryList.length > 0 ? (
                galleryList.map((item: any) => {
                  const isVideo = item.image && item.image.match(/\.(mp4|webm|ogg|mov)$/i);
                  return (
                    <div key={item.id} className="w-[85vw] sm:w-[45vw] lg:w-[28vw] shrink-0 snap-start">
                      <div 
                        onClick={() => {
                          setSelectedMedia(item);
                          setIsZoomed(false);
                        }}
                        className="group bg-white/75 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full justify-between cursor-pointer"
                      >
                        <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                          {isVideo ? (
                            <>
                              <video src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80" muted />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-sky-600/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-300">
                                  <Play size={20} fill="white" className="ml-0.5" />
                                </div>
                              </div>
                            </>
                          ) : (
                            item.image && <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                          )}

                          <span className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                            {isVideo ? <Film size={10} /> : <ImageIcon size={10} />} {item.category || "Dokumentasi"}
                          </span>
                        </div>
                        <div className="p-5 space-y-1.5 bg-white/60 backdrop-blur-md">
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-1">{item.title}</h3>
                          {item.date && <p className="text-[10px] text-slate-400 font-light">🕒 {item.date}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic font-light py-6">Belum ada dokumentasi galeri yang diunggah.</p>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={32} />
        <span className="ml-2 text-xs text-slate-500 font-medium">Memuat Beranda Tugu Selatan...</span>
      </div>
    );
  }

  const isSelectedVideo = selectedMedia && selectedMedia.image && selectedMedia.image.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 text-slate-800 antialiased selection:bg-sky-500 selection:text-white pb-24 overflow-x-hidden relative font-sans">
      
      {/* BACKGROUND LIGHT GLOW */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-[25rem] h-[25rem] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 z-[999999] transition-all duration-500 transform ${
        toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border ${
          toast.type === 'add' 
            ? 'bg-slate-900/90 border-sky-500/30 text-white' 
            : 'bg-slate-900/90 border-rose-500/30 text-white'
        }`}>
          {toast.type === 'add' ? (
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 size={16} />
            </div>
          )}
          <div className="text-xs font-medium tracking-tight">
            {toast.message}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full flex items-center justify-center px-6 pt-10 md:pt-14 pb-12 overflow-hidden z-10">
        <div className="max-w-7xl w-full mx-auto flex flex-col-reverse md:flex-row items-center gap-8 md:gap-14">
          
          <div className="w-full md:w-1/2 space-y-5 text-center md:text-left flex flex-col items-center md:items-start">
            
            {(heroData.title_line_1 || heroData.title_line_2) && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                {heroData.title_line_1} <br />
                {heroData.title_line_2 && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">
                    {heroData.title_line_2}
                  </span>
                )}
              </h1>
            )}

            {heroData.description && (
              <p className="max-w-xl text-xs md:text-sm text-slate-600 font-normal leading-relaxed">
                {heroData.description}
              </p>
            )}

            {heroData.button_text && (
              <div className="pt-2">
                <a 
                  href={heroData.button_url || "#paket-wisata"} 
                  className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-sky-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
                >
                  {heroData.button_text} <ArrowUpRight size={16} />
                </a>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] group">
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-300 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative w-full h-full rounded-[2.8rem] bg-white/40 backdrop-blur-2xl border border-white/80 p-3.5 shadow-2xl overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none z-10 rounded-t-[2.5rem]"></div>
                <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-900/5">
                  {heroData.image_url ? (
                    <img 
                      src={heroData.image_url}
                      alt={heroData.title_line_1 || "Hero Image Tugu Selatan"} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      Gambar belum diunggah dari admin
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTIONS LIST */}
      <div className="space-y-20 mt-4 relative z-10">
        {sectionOrder.map((sectionType) => renderSection(sectionType))}
      </div>

      {/* POP-UP MODAL GALERI */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/90 backdrop-blur-2xl p-4 md:p-6 animate-in fade-in duration-300 select-none overflow-hidden">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto text-white z-20">
            <div className="space-y-1">
              <span className="text-[10px] font-bold bg-sky-500/80 backdrop-blur-md text-white px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                {selectedMedia.category || (isSelectedVideo ? "Video Kegiatan" : "Dokumentasi Foto")}
              </span>
              <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight">{selectedMedia.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              {!isSelectedVideo && (
                <button 
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`p-3 rounded-2xl backdrop-blur-xl transition cursor-pointer border shadow-lg flex items-center justify-center ${
                    isZoomed 
                      ? 'bg-sky-600 text-white border-sky-400/30' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                  title={isZoomed ? "Reset Ukuran" : "Perbesar Gambar"}
                >
                  {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                </button>
              )}
              <button 
                onClick={() => {
                  setSelectedMedia(null);
                  setIsZoomed(false);
                }}
                className="p-3 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xl transition cursor-pointer shadow-lg border border-rose-500/30 flex items-center justify-center"
                title="Tutup"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className="relative w-full h-[75vh] mx-auto my-auto flex items-center justify-center overflow-hidden rounded-3xl">
            <div 
              className={`relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out cursor-pointer ${
                isZoomed ? 'scale-125 md:scale-150' : 'scale-100'
              }`}
              onClick={() => !isSelectedVideo && setIsZoomed(!isZoomed)}
            >
              {isSelectedVideo ? (
                <video 
                  src={selectedMedia.image} 
                  controls 
                  autoPlay 
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              ) : (
                <img 
                  src={selectedMedia.image} 
                  alt={selectedMedia.title} 
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
                />
              )}
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto text-center text-[11px] text-slate-400 font-light z-20">
            🕒 Dipublikasikan pada {selectedMedia.date || "Tugu Selatan Puncak"}
          </div>
        </div>
      )}

    </div>
  );
}