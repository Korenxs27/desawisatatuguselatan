"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { 
  ArrowLeft, Plus, Trash2, RefreshCw, PackageCheck, 
  Edit3, X, Upload, Image as ImageIcon, Box, Scale, Hash, Truck, Ruler, CreditCard, QrCode, AlertTriangle, Eye, EyeOff, MessageSquare, Loader2, Sparkles 
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  description: string;
  status: string; // 'publish' atau 'draft'
  sku?: string;
  manage_stock?: boolean;
  stock_quantity?: number;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  images?: Array<{ id: number; src: string }>;
}

interface PaymentMethod {
  id: number;
  nama_metode: string;
  nomor_rekening: string;
  atas_nama: string;
  instruksi: string;
  qr_image: string | null;
}

export default function AdminUMKMTuguPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isSavingWa, setIsSavingWa] = useState(false);

  // State Nomor WhatsApp Konfirmasi Admin
  const [adminWhatsApp, setAdminWhatsApp] = useState("6281234567890");

  // Edit State Produk
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  // Form State Produk
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); 
  const [sku, setSku] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number | "">(10);
  const [manageStock, setManageStock] = useState(true);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State Galeri Foto Pendukung (Multi-File)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<Array<{ id: number; src: string }>>([]);

  // Form State Metode Pembayaran
  const [namaMetode, setNamaMetode] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [atasNama, setAtasNama] = useState("");
  const [instruksi, setInstruksi] = useState("");
  const [qrFile, setQrFile] = useState<File | null>(null);

  const ck = "ck_11cb06d9375d3f54f8464420e3e41f4e6a1be250";
  const cs = "cs_1bd856c252221ea40104ed68505f58c3048de027";

  // Menggunakan jalur proxy Next.js (/api-wp) untuk menghindari blokir CORS
  const baseUrl = "/api-wp";

  const fetchData = async () => {
    setLoading(true);
    try {
      const resProd = await fetch(
        `${baseUrl}/wc/v3/products?per_page=100&consumer_key=${ck}&consumer_secret=${cs}`,
        { cache: "no-store" }
      );
      const dataProd = await resProd.json();
      
      if (Array.isArray(dataProd)) {
        const umkmOnly = dataProd.filter((item: any) => {
          const itemName = (item.name || "").toUpperCase();
          const categories = item.categories || [];
          const isBookingPrefix = 
            itemName.startsWith("[WISATA]") || 
            itemName.startsWith("[HOMESTAY]") || 
            itemName.startsWith("[PAKET]") ||
            itemName.startsWith("[BOOKING]") ||
            itemName.startsWith("[TUGU SELATAN]");
          const isBookingCategory = categories.some(
            (cat: any) => cat.name.toLowerCase() === "booking engine"
          );
          return !isBookingPrefix && !isBookingCategory;
        });
        setProducts(umkmOnly);
      }

      const resPay = await fetch(
        `${baseUrl}/tugu-bridge/v1/metode-pembayaran`,
        { cache: "no-store" }
      );
      const dataPay = await resPay.json();
      if (dataPay.success && Array.isArray(dataPay.metode_pembayaran)) {
        setPaymentMethods(dataPay.metode_pembayaran);
      }

      // Ambil nomor WhatsApp admin langsung dari Database WordPress Tugu Selatan
      const resWa = await fetch(`${baseUrl}/tugu-bridge/v1/admin-whatsapp`, {
        cache: "no-store"
      });
      const dataWa = await resWa.json();
      if (dataWa.success && dataWa.whatsapp_number) {
        setAdminWhatsApp(dataWa.whatsapp_number);
      }
    } catch (err) {
      console.error("Gagal load data:", err);
      toast.error("Gagal memuat data dari server Tugu Selatan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWa(true);
    const loadingToast = toast.loading("Menyimpan nomor WhatsApp ke server...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });

    try {
      const res = await fetch(`${baseUrl}/tugu-bridge/v1/admin-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          whatsapp_number: adminWhatsApp,
          phone: adminWhatsApp 
        }),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);

      if (res.ok && data.success) {
        toast.success("Nomor WhatsApp konfirmasi berhasil disimpan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
      } else {
        toast.error(`Gagal menyimpan: ${data.message || "Kesalahan server"}`);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan saat menyimpan nomor.");
    } finally {
      setIsSavingWa(false);
    }
  };

  const handleStartEdit = (item: Product) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.regular_price || item.price || "");
    setSku(item.sku || "");
    setStockQuantity(item.stock_quantity ?? 10);
    setManageStock(item.manage_stock ?? true);
    setWeight(item.weight || "");
    setLength(item.dimensions?.length || "");
    setWidth(item.dimensions?.width || "");
    setHeight(item.dimensions?.height || "");
    setDesc(item.description ? item.description.replace(/<[^>]+>/g, '') : "");
    setImageFile(null);
    setGalleryFiles([]);
    
    if (item.images && item.images.length > 1) {
      setExistingGallery(item.images.slice(1));
    } else {
      setExistingGallery([]);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setName("");
    setPrice("");
    setSku("");
    setStockQuantity(10);
    setManageStock(true);
    setWeight("");
    setLength("");
    setWidth("");
    setHeight("");
    setDesc("");
    setImageFile(null);
    setGalleryFiles([]);
    setExistingGallery([]);
  };

  const handleImageValidation = (file: File | null) => {
    if (!file) {
      setImageFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 10MB.");
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  const handleToggleStatus = async (item: Product) => {
    const newStatus = item.status === "publish" ? "draft" : "publish";
    const loadingToast = toast.loading(newStatus === "draft" ? "Menonaktifkan produk..." : "Mengaktifkan produk...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });
    
    try {
      const res = await fetch(`${baseUrl}/wc/v3/products/${item.id}?consumer_key=${ck}&consumer_secret=${cs}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.dismiss(loadingToast);
      if (res.ok) {
        toast.success(newStatus === "publish" ? "Produk kini AKTIF (Ditampilkan)" : "Produk dinonaktifkan (Disembunyikan)", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        setProducts((prev) => prev.map((p) => p.id === item.id ? { ...p, status: newStatus } : p));
      } else {
        toast.error("Gagal mengubah status produk.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Kesalahan jaringan.");
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(editingItem ? "Memperbarui produk UMKM..." : "Menambahkan produk UMKM...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });

    try {
      let mediaId = 0;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image_file", imageFile);

        const uploadRes = await fetch(`${baseUrl}/tugu-bridge/v1/upload-image`, {
          method: "POST",
          body: formData,
        });

        const rawText = await uploadRes.text();
        let mediaData;
        try {
          mediaData = JSON.parse(rawText);
        } catch (e) {
          toast.dismiss(loadingToast);
          toast.error("Gagal upload: Format server tidak valid.");
          setIsSubmitting(false);
          return;
        }

        if (uploadRes.ok && mediaData.success && (mediaData.id || mediaData.source_url)) {
          mediaId = mediaData.id || 0;
        } else {
          toast.dismiss(loadingToast);
          toast.error(`Gagal unggah foto: ${mediaData.message || "Kesalahan server"}`);
          setIsSubmitting(false);
          return;
        }
      }

      const uploadedGalleryIds: Array<{ id: number }> = [];
      for (const file of galleryFiles) {
        const gForm = new FormData();
        gForm.append("image_file", file);
        const gRes = await fetch(`${baseUrl}/tugu-bridge/v1/upload-image`, {
          method: "POST",
          body: gForm,
        });
        const gData = await gRes.json();
        if (gRes.ok && gData.success && gData.id) {
          uploadedGalleryIds.push({ id: gData.id });
        }
      }

      const isEdit = !!editingItem;
      const url = isEdit
        ? `${baseUrl}/wc/v3/products/${editingItem.id}?consumer_key=${ck}&consumer_secret=${cs}`
        : `${baseUrl}/wc/v3/products?consumer_key=${ck}&consumer_secret=${cs}`;

      const payload: any = {
        name: name,
        regular_price: price,
        sku: sku,
        manage_stock: manageStock,
        stock_quantity: manageStock ? Number(stockQuantity) : null,
        weight: weight,
        dimensions: { length, width, height },
        description: desc,
      };

      const imagesArray = [];
      if (mediaId > 0) {
        imagesArray.push({ id: mediaId });
      } else if (isEdit && editingItem?.images && editingItem.images.length > 0) {
        imagesArray.push({ id: editingItem.images[0].id });
      }

      existingGallery.forEach((img: any) => imagesArray.push({ id: img.id }));
      uploadedGalleryIds.forEach((g) => imagesArray.push(g));

      if (imagesArray.length > 0) {
        payload.images = imagesArray;
      }

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.dismiss(loadingToast);

      if (res.ok) {
        toast.success(isEdit ? "Produk UMKM Berhasil Diperbarui!" : "Produk UMKM Berhasil Ditambahkan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        resetForm();
        fetchData();
      } else {
        const errData = await res.json();
        toast.error(`Gagal menyimpan: ${errData.message || "Periksa kembali data"}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-800">Yakin ingin menghapus produk UMKM ini secara permanen?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Menghapus produk...", {
                style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
              });
              try {
                const res = await fetch(`${baseUrl}/wc/v3/products/${id}?force=true&consumer_key=${ck}&consumer_secret=${cs}`, {
                  method: "DELETE",
                });
                toast.dismiss(loadingToast);
                if (res.ok) {
                  toast.success("Produk berhasil dihapus!");
                  setProducts((prev) => prev.filter((item) => item.id !== id));
                } else {
                  toast.error("Gagal menghapus produk.");
                }
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Terjadi kesalahan jaringan.");
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

  const handleSubmitPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayment(true);
    const loadingToast = toast.loading("Menyimpan metode pembayaran...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });

    try {
      const formData = new FormData();
      formData.append("nama_metode", namaMetode);
      formData.append("nomor_rekening", nomorRekening);
      formData.append("atas_nama", atasNama);
      formData.append("instruksi", instruksi);
      if (qrFile) {
        if (qrFile.size > 10 * 1024 * 1024) {
          toast.dismiss(loadingToast);
          toast.error("Ukuran file QR maksimal 10MB!");
          setIsSubmittingPayment(false);
          return;
        }
        formData.append("image_file", qrFile);
      }

      const res = await fetch(`${baseUrl}/tugu-bridge/v1/metode-pembayaran`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Metode pembayaran berhasil ditambahkan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        setNamaMetode("");
        setNomorRekening("");
        setAtasNama("");
        setInstruksi("");
        setQrFile(null);
        fetchData();
      } else {
        toast.error(`Gagal: ${data.message || "Kesalahan server"}`);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleDeletePaymentMethod = async (id: number) => {
    const loadingToast = toast.loading("Menghapus metode pembayaran...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });
    try {
      const res = await fetch(`${baseUrl}/tugu-bridge/v1/metode-pembayaran?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Metode pembayaran dihapus!");
        setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast.error("Gagal menghapus.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Kesalahan jaringan.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 text-slate-800 font-sans antialiased selection:bg-sky-500 selection:text-white p-4 sm:p-6 lg:p-8 relative">
      
      {/* BACKGROUND LIGHT GLOW */}
      <div className="fixed top-0 left-1/4 w-[30rem] h-[30rem] bg-sky-300/20 rounded-full blur-3xl pointer-events-none animate-pulse z-0"></div>
      <div className="fixed top-1/3 right-10 w-[25rem] h-[25rem] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none z-0"></div>

      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/admin" className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition cursor-pointer shrink-0">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">Kelola Produk UMKM & Pembayaran Tugu Selatan</h1>
              <p className="text-xs text-slate-500 font-normal">Stok UMKM, Galeri Produk, Rekening Desa & WhatsApp Konfirmasi</p>
            </div>
          </div>

          <button onClick={fetchData} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition shrink-0 flex items-center gap-2 text-xs font-bold cursor-pointer">
            <RefreshCw size={16} className={loading ? "animate-spin text-sky-600" : ""} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* KOLOM KIRI: FORM PRODUK, WHATSAPP, & PEMBAYARAN */}
          <div className="space-y-6">
            
            {/* FORM NOMOR WHATSAPP KONFIRMASI */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-3">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-sky-600" /> WhatsApp Konfirmasi BPH
              </h2>
              <p className="text-[11px] text-slate-500 font-normal">Nomor tujuan user untuk mengirimkan konfirmasi pembayaran & detail pesanan.</p>
              
              <form onSubmit={handleSaveWhatsApp} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nomor WhatsApp Admin (Format Internasional)</label>
                  <input
                    type="text" required value={adminWhatsApp} onChange={(e) => setAdminWhatsApp(e.target.value)}
                    placeholder="Contoh: 6281234567890"
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
                <button
                  type="submit" disabled={isSavingWa}
                  className="w-full py-3 font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-sky-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingWa ? "Menyimpan..." : "Simpan Nomor WhatsApp"}
                </button>
              </form>
            </div>

            {/* FORM PRODUK */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  {editingItem ? <Edit3 size={18} className="text-amber-600" /> : <Plus size={18} className="text-sky-600" />}
                  {editingItem ? "Edit Produk UMKM" : "Tambah Produk UMKM"}
                </h2>
                {editingItem && (
                  <button onClick={resetForm} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer">
                    <X size={16} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Produk UMKM</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Keripik Singkong Tugu"
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Foto Utama Produk <span className="text-slate-400 font-normal">(Maks. 10MB)</span></label>
                  <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-3.5 text-center cursor-pointer hover:bg-sky-50/50 transition relative bg-slate-50/50">
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => handleImageValidation(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <Upload size={18} className="text-sky-600" />
                      <span className="text-[11px] font-bold truncate max-w-[200px] text-slate-700">
                        {imageFile ? imageFile.name : "Klik untuk unggah foto utama"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Galeri Foto Pendukung (Multi-Foto)</label>
                  <input
                    type="file" accept="image/*" multiple
                    onChange={(e) => { if (e.target.files) setGalleryFiles(Array.from(e.target.files)); }}
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-2 rounded-2xl text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer transition"
                  />
                  {existingGallery.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {existingGallery.map((img: any, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                          <img src={img.src} alt="Gallery" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setExistingGallery(existingGallery.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Harga (Rp)</label>
                    <input
                      type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                      placeholder="15000"
                      className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Hash size={12} className="text-sky-600"/> SKU Produk
                    </label>
                    <input
                      type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                      placeholder="KRP-TGU-01"
                      className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Box size={14} className="text-sky-600"/> Kelola Stok
                    </label>
                    <input
                      type="checkbox" checked={manageStock}
                      onChange={(e) => setManageStock(e.target.checked)}
                      className="w-4 h-4 accent-sky-600 cursor-pointer rounded"
                    />
                  </div>
                  {manageStock && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah Stok Available</label>
                      <input
                        type="number" required value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))}
                        className="w-full p-2.5 text-xs bg-white border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Truck size={14} className="text-sky-600"/> Pengiriman (Shipping)
                  </label>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Scale size={11}/> Berat (kg)
                    </label>
                    <input
                      type="text" value={weight} onChange={(e) => setWeight(e.target.value)}
                      placeholder="0.25"
                      className="w-full p-2.5 text-xs bg-white border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Ruler size={11}/> Dimensi (P x L x T cm)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" value={length} onChange={(e) => setLength(e.target.value)} placeholder="P" className="w-full p-2 text-xs bg-white border border-slate-200/80 rounded-xl text-center font-bold" />
                      <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="L" className="w-full p-2 text-xs bg-white border border-slate-200/80 rounded-xl text-center font-bold" />
                      <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="T" className="w-full p-2 text-xs bg-white border border-slate-200/80 rounded-xl text-center font-bold" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Produk</label>
                  <textarea
                    rows={3} value={desc} onChange={(e) => setDesc(e.target.value)}
                    placeholder="Deskripsi produk..."
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-normal text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className={`w-full py-3.5 font-bold text-xs text-white rounded-2xl shadow-lg transition cursor-pointer disabled:opacity-50 ${
                    editingItem ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20" : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-sky-600/25"
                  }`}
                >
                  {isSubmitting ? "Menyimpan..." : editingItem ? "Update Produk UMKM" : "+ Simpan Produk"}
                </button>
              </form>
            </div>

            {/* FORM TAMBAH METODE PEMBAYARAN */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" /> Tambah Metode Pembayaran
              </h2>
              <form onSubmit={handleSubmitPaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Metode / Bank / E-Wallet</label>
                  <input
                    type="text" required value={namaMetode} onChange={(e) => setNamaMetode(e.target.value)}
                    placeholder="Contoh: QRIS Tugu Selatan / Bank Mandiri"
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nomor Rekening / No HP</label>
                    <input
                      type="text" value={nomorRekening} onChange={(e) => setNomorRekening(e.target.value)}
                      placeholder="1234567890"
                      className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Atas Nama</label>
                    <input
                      type="text" value={atasNama} onChange={(e) => setAtasNama(e.target.value)}
                      placeholder="BUMDes Tugu Selatan"
                      className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Upload QR / Logo <span className="text-slate-400 font-normal">(Maks. 10MB)</span></label>
                  <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-3.5 text-center cursor-pointer hover:bg-sky-50/50 transition relative bg-slate-50/50">
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => setQrFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <QrCode size={18} className="text-indigo-600" />
                      <span className="text-[11px] font-bold truncate max-w-[200px] text-slate-700">
                        {qrFile ? qrFile.name : "Pilih gambar QR / Logo"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instruksi Pembayaran</label>
                  <textarea
                    rows={2} value={instruksi} onChange={(e) => setInstruksi(e.target.value)}
                    placeholder="Scan QRIS atau transfer..."
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-normal text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={isSubmittingPayment}
                  className="w-full py-3.5 font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPayment ? "Menyimpan..." : "+ Tambah Metode Pembayaran"}
                </button>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: LIST PRODUK & LIST PEMBAYARAN */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
                <PackageCheck size={18} className="text-sky-600" /> Daftar Produk UMKM Aktif ({products.length})
              </h2>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="animate-spin text-sky-600" size={18} /> Memuat data produk UMKM...
                </div>
              ) : products.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-normal italic">Belum ada produk UMKM Tugu Selatan.</div>
              ) : (
                <div className="space-y-3">
                  {products.map((item) => {
                    const isLowStock = item.manage_stock && (item.stock_quantity ?? 0) <= 5;
                    const isPublished = item.status === "publish";

                    return (
                      <div key={item.id} className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full ${isPublished ? 'bg-white/80 border-slate-200/80 shadow-sm' : 'bg-slate-100/60 border-slate-200/60 opacity-60'}`}>
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 overflow-hidden relative shrink-0">
                            {item.images && item.images.length > 0 ? (
                              <img src={item.images[0].src} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={16} /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate uppercase">{item.name}</h3>
                              {!isPublished && <span className="px-2 py-0.5 bg-slate-500 text-white text-[9px] font-bold rounded-md uppercase">Draft</span>}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                              <span className="font-black text-sky-600">Rp {parseInt(item.price || item.regular_price || "0").toLocaleString("id-ID")}</span>
                              <span>•</span>
                              
                              <span className={`flex items-center gap-1 font-bold ${isLowStock ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200' : ''}`}>
                                {isLowStock && <AlertTriangle size={12} />}
                                Stok: {item.manage_stock ? item.stock_quantity ?? "0" : "Tersedia"}
                                {isLowStock && " (Menipis!)"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`p-2 rounded-xl transition text-xs font-bold px-3 flex items-center gap-1 cursor-pointer ${isPublished ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                          >
                            {isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span className="text-[11px]">{isPublished ? "Tutup" : "Buka"}</span>
                          </button>
                          <button onClick={() => handleStartEdit(item)} className="p-2 bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition text-xs font-bold px-3 flex items-center gap-1 cursor-pointer">
                            <Edit3 size={14} /> Edit
                          </button>
                          <button onClick={() => handleDeleteProduct(item.id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition text-xs font-bold px-2.5 cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
                <CreditCard size={18} className="text-indigo-600" /> Metode Pembayaran Aktif ({paymentMethods.length})
              </h2>

              {paymentMethods.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-normal italic">Belum ada metode pembayaran ditambahkan.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-4 rounded-2xl border border-slate-200/80 bg-white/80 flex flex-col justify-between gap-3 shadow-sm">
                      <div className="flex items-start gap-3">
                        {method.qr_image && (
                          <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden">
                            <img src={method.qr_image} alt={method.nama_metode} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate uppercase">{method.nama_metode}</h3>
                          {method.nomor_rekening && <p className="text-xs font-bold text-sky-600 mt-0.5">No: {method.nomor_rekening}</p>}
                          {method.atas_nama && <p className="text-[11px] text-slate-500 font-medium">A/N: {method.atas_nama}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 truncate max-w-[180px] font-medium">{method.instruksi}</span>
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}