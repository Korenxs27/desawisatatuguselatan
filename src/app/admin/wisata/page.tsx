"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { 
  ArrowLeft, Plus, Package, RefreshCw, Clock, Tag, 
  Users, Edit3, Trash2, X, Upload, Image as ImageIcon, Percent, MessageSquare, CreditCard, QrCode, CheckCircle2, Loader2, Compass 
} from "lucide-react";

interface PaketWisata {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
  acf?: any;
}

interface PaymentMethod {
  id: number;
  nama_metode: string;
  nomor_rekening: string;
  atas_nama: string;
  instruksi: string;
  qr_image: string | null;
}

export default function AdminWisataPage() {
  const [paketList, setPaketList] = useState<PaketWisata[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isSavingWa, setIsSavingWa] = useState(false);

  // State Nomor WhatsApp Konfirmasi Admin
  const [adminWhatsApp, setAdminWhatsApp] = useState("6285781826063");

  const [editingItem, setEditingItem] = useState<PaketWisata | null>(null);

  // Form State Paket Wisata
  const [title, setTitle] = useState("");
  const [hargaMinimal, setHargaMinimal] = useState("");
  const [durasiPaket, setDurasiPaket] = useState("2 Hari 1 Malam");
  const [minimalPeserta, setMinimalPeserta] = useState(5);
  const [diskonMinimalPeserta, setDiskonMinimalPeserta] = useState("");
  const [diskonNominal, setDiskonNominal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State Multi Galeri Foto Pendukung untuk Paket Wisata
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  // State Dinamis Repeater Fasilitas Paket Wisata
  const [fasilitasList, setFasilitasList] = useState<string[]>([
    "Pemandu Wisata Profesional", 
    "Konsumsi / Makan Sesuai Jadwal", 
    "Tiket Masuk Destinasi"
  ]);

  // Form State Metode Pembayaran
  const [namaMetode, setNamaMetode] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [atasNama, setAtasNama] = useState("");
  const [instruksi, setInstruksi] = useState("");
  const [qrFile, setQrFile] = useState<File | null>(null);

  // USE RELATIVE PROXY ROUTE TO PREVENT CORS BLOCKS
  const baseUrl = "/api-wp";

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Paket Wisata
      const res = await fetch(`${baseUrl}/wp/v2/wisata?_embed`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setPaketList(data);

      // 2. Fetch Metode Pembayaran
      const resPay = await fetch(`${baseUrl}/tugu-bridge/v1/metode-pembayaran`, { cache: "no-store" });
      const dataPay = await resPay.json();
      if (dataPay.success && Array.isArray(dataPay.metode_pembayaran)) {
        setPaymentMethods(dataPay.metode_pembayaran);
      }

      // 3. Fetch Nomor WhatsApp Admin
      const resWa = await fetch(`${baseUrl}/tugu-bridge/v1/admin-whatsapp`, { cache: "no-store" });
      const dataWa = await resWa.json();
      if (dataWa.success) {
        const fetchedNumber = dataWa.whatsapp_number || dataWa.phone || dataWa.whatsapp || dataWa.data?.whatsapp_number;
        if (fetchedNumber) {
          setAdminWhatsApp(fetchedNumber);
        }
      }
    } catch (err) {
      console.error("Gagal load data:", err);
      toast.error("Gagal memuat data dari server.");
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
    const loadingToast = toast.loading("Menyimpan nomor WhatsApp...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });

    try {
      const res = await fetch(`${baseUrl}/tugu-bridge/v1/admin-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          whatsapp_number: adminWhatsApp,
          phone: adminWhatsApp,
          whatsapp: adminWhatsApp,
          nomor_whatsapp: adminWhatsApp
        }),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);

      if (res.ok && data.success) {
        toast.success("Nomor WhatsApp berhasil disimpan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        fetchData();
      } else {
        toast.error(`Gagal menyimpan: ${data.message || "Kesalahan server"}`);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSavingWa(false);
    }
  };

  const handleStartEdit = (item: PaketWisata) => {
    setEditingItem(item);
    setTitle(item.title?.rendered || "");
    
    const acf = (item.acf || {}) as any;
    setHargaMinimal(String(acf.harga_minimal ?? acf.harga ?? ""));
    setDurasiPaket(acf.durasi_paket ?? acf.jam_operasional ?? "2 Hari 1 Malam");
    setMinimalPeserta(acf.minimal_peserta ?? 5);
    setDiskonMinimalPeserta(String(acf.diskon_minimal_peserta ?? ""));
    setDiskonNominal(String(acf.diskon_nominal ?? ""));
    setDeskripsi(item.content?.rendered?.replace(/<[^>]+>/g, '') || "");
    
    const gallery = acf.gallery_images || acf.gallery_paket || [];
    setExistingGallery(Array.isArray(gallery) ? gallery : []);
    setGalleryFiles([]);

    const rawFasilitas = acf.fasilitas_paket || acf.fasilitas || [];
    if (Array.isArray(rawFasilitas) && rawFasilitas.length > 0) {
      setFasilitasList(rawFasilitas);
    } else {
      setFasilitasList(["Pemandu Wisata Profesional", "Konsumsi / Makan Sesuai Jadwal", "Tiket Masuk Destinasi"]);
    }

    setImageFile(null);
  };

  const resetForm = () => {
    setEditingItem(null);
    setTitle("");
    setHargaMinimal("");
    setDurasiPaket("2 Hari 1 Malam");
    setMinimalPeserta(5);
    setDiskonMinimalPeserta("");
    setDiskonNominal("");
    setDeskripsi("");
    setFasilitasList(["Pemandu Wisata Profesional", "Konsumsi / Makan Sesuai Jadwal", "Tiket Masuk Destinasi"]);
    setImageFile(null);
    setGalleryFiles([]);
    setExistingGallery([]);
  };

  const handleAddFasilitasRow = () => {
    setFasilitasList([...fasilitasList, ""]);
  };

  const handleRemoveFasilitasRow = (index: number) => {
    const list = [...fasilitasList];
    list.splice(index, 1);
    setFasilitasList(list);
  };

  const handleFasilitasChange = (value: string, index: number) => {
    const list = [...fasilitasList];
    list[index] = value;
    setFasilitasList(list);
  };

  const handleSubmitPaket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(editingItem ? "Memperbarui paket..." : "Menambahkan paket...", {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });

    try {
      let uploadedImageUrl = "";
      
      if (imageFile) {
        if (imageFile.size > 10 * 1024 * 1024) {
          toast.dismiss(loadingToast);
          toast.error("Ukuran file terlalu besar! Maksimal 10MB.");
          setIsSubmitting(false);
          return;
        }
        const imgFormData = new FormData();
        imgFormData.append("image_file", imageFile);
        const imgRes = await fetch(`${baseUrl}/tugu-bridge/v1/upload-image`, {
          method: "POST",
          body: imgFormData,
        });
        const imgData = await imgRes.json();
        if (imgData.success) {
          uploadedImageUrl = imgData.source_url;
        }
      }

      let allGalleryUrls = [...existingGallery];
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const galFormData = new FormData();
          galFormData.append("image_file", file);
          const galRes = await fetch(`${baseUrl}/tugu-bridge/v1/upload-image`, {
            method: "POST",
            body: galFormData,
          });
          const galData = await galRes.json();
          if (galData.success && galData.source_url) {
            allGalleryUrls.push(galData.source_url);
          }
        }
      }

      const formData = new FormData();
      if (editingItem) formData.append("item_id", String(editingItem.id));
      
      formData.append("post_type", "wisata");
      formData.append("title", title);
      formData.append("harga", hargaMinimal);
      formData.append("durasi_paket", durasiPaket);
      formData.append("minimal_peserta", String(minimalPeserta));
      formData.append("diskon_minimal_peserta", diskonMinimalPeserta);
      formData.append("diskon_nominal", diskonNominal);
      
      if (uploadedImageUrl) {
        formData.append("image_url", uploadedImageUrl);
      }

      const filteredFasilitas = fasilitasList.map(f => f.trim()).filter(f => f !== "");
      formData.append("fasilitas", JSON.stringify(filteredFasilitas));
      formData.append("gallery_urls", JSON.stringify(allGalleryUrls));
      formData.append("content", deskripsi);

      const res = await fetch(`${baseUrl}/tugu-bridge/v1/upsert-item`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (res.ok && data.success) {
        toast.success(editingItem ? "Paket Wisata Berhasil Diperbarui!" : "Paket Wisata Berhasil Ditambahkan!", {
          style: { borderRadius: '16px', background: '#0284c7', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#38bdf8', secondary: '#0369a1' }
        });
        resetForm();
        fetchData();
      } else {
        toast.error(`Gagal menyimpan: ${data.message || "Kesalahan server"}`);
      }
    } catch (error) {
      console.error("Submit Paket Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePaket = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-800">Apakah Anda yakin ingin menghapus Paket Wisata ini?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Menghapus paket...", {
                style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
              });
              try {
                const res = await fetch(`${baseUrl}/tugu-bridge/v1/delete-item`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: id }),
                });
                const data = await res.json();
                toast.dismiss(loadingToast);
                if (res.ok && data.success) {
                  toast.success("Paket berhasil dihapus!");
                  setPaketList((prev) => prev.filter((item) => item.id !== id));
                  if (editingItem?.id === id) resetForm();
                } else {
                  toast.error("Gagal menghapus paket.");
                }
              } catch (err) {
                toast.dismiss(loadingToast);
                toast.error("Kesalahan jaringan.");
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
      if (qrFile) formData.append("image_file", qrFile);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition shrink-0 cursor-pointer">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">Kelola Paket Wisata & Pembayaran</h1>
              <p className="text-xs text-slate-500 font-normal">CRUD Paket Wisata, Fasilitas, Galeri Foto & Rekening Tugu Selatan</p>
            </div>
          </div>

          <button onClick={fetchData} className="self-start sm:self-auto p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition flex items-center gap-2 text-xs font-bold cursor-pointer">
            <RefreshCw size={16} className={loading ? "animate-spin text-sky-600" : ""} />
            <span>Refresh Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* KOLOM KIRI: WHATSAPP, FORM PAKET, & FORM PEMBAYARAN */}
          <div className="space-y-6">
            
            {/* Form WhatsApp Konfirmasi */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-3">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-sky-600" /> WhatsApp Konfirmasi BPH
              </h2>
              <p className="text-[11px] text-slate-500 font-normal">Nomor tujuan user untuk konfirmasi pembayaran wisata Tugu Selatan.</p>
              <form onSubmit={handleSaveWhatsApp} className="space-y-3">
                <input
                  type="text" required value={adminWhatsApp} onChange={(e) => setAdminWhatsApp(e.target.value)}
                  placeholder="6285781826063"
                  className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
                <button
                  type="submit" disabled={isSavingWa}
                  className="w-full py-3 font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-sky-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSavingWa ? "Menyimpan..." : "Simpan Nomor WhatsApp"}
                </button>
              </form>
            </div>

            {/* Form Input Paket Wisata */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  {editingItem ? <Edit3 size={18} className="text-amber-600" /> : <Plus size={18} className="text-sky-600" />}
                  {editingItem ? "Edit Paket Wisata" : "Tambah Paket Wisata"}
                </h2>
                {editingItem && (
                  <button onClick={resetForm} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"><X size={16} /></button>
                )}
              </div>

              <form onSubmit={handleSubmitPaket} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Paket Wisata</label>
                  <input
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Offroad & Camping Puncak"
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Foto Utama <span className="text-slate-400 font-normal">(Maks. 10MB)</span></label>
                  <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-3.5 text-center cursor-pointer hover:bg-sky-50/50 transition relative bg-slate-50/50">
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <Upload size={18} className="text-sky-600" />
                      <span className="text-[11px] font-bold truncate max-w-[200px] text-slate-700">
                        {imageFile ? imageFile.name : (editingItem ? "Ganti foto (Opsional)" : "Pilih foto utama")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi Galeri Foto Pendukung */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Galeri Foto Pendukung</label>
                  <input
                    type="file" accept="image/*" multiple
                    onChange={(e) => { if (e.target.files) setGalleryFiles(Array.from(e.target.files)); }}
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-2 rounded-2xl text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer transition"
                  />
                  {existingGallery.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {existingGallery.map((url, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                          <Image src={url} alt="Gallery" fill sizes="48px" className="object-cover" />
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
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Harga / Orang (Rp)</label>
                    <input
                      type="number" required value={hargaMinimal} onChange={(e) => setHargaMinimal(e.target.value)}
                      placeholder="350000"
                      className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Min. Peserta</label>
                    <input
                      type="number" required value={minimalPeserta} onChange={(e) => setMinimalPeserta(Number(e.target.value))}
                      placeholder="5"
                      className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                </div>

                <div className="bg-sky-50/80 border border-sky-200/80 p-3.5 rounded-2xl space-y-3">
                  <label className="text-xs font-black text-sky-800 flex items-center gap-1.5">
                    <Percent size={14} className="text-sky-600" /> Pengaturan Diskon Rombongan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min. Orang Diskon</label>
                      <input
                        type="number" value={diskonMinimalPeserta} onChange={(e) => setDiskonMinimalPeserta(e.target.value)}
                        placeholder="10"
                        className="w-full p-2.5 text-xs bg-white border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Potongan / Orang (Rp)</label>
                      <input
                        type="number" value={diskonNominal} onChange={(e) => setDiskonNominal(e.target.value)}
                        placeholder="25000"
                        className="w-full p-2.5 text-xs bg-white border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Fasilitas Paket Khusus dengan Icon Ceklis */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-sky-600" /> Fasilitas Paket Wisata
                    </label>
                    <button
                      type="button" onClick={handleAddFasilitasRow}
                      className="px-3 py-1 bg-sky-600 text-white rounded-xl text-[10px] font-extrabold hover:bg-sky-700 transition cursor-pointer shadow-sm"
                    >
                      + Tambah
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {fasilitasList.map((fasilitas, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-sky-600 shrink-0" />
                        <input
                          type="text" value={fasilitas}
                          onChange={(e) => handleFasilitasChange(e.target.value, index)}
                          placeholder="Contoh: Pemandu Wisata"
                          className="w-full bg-white border border-slate-200/80 p-2 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <button type="button" onClick={() => handleRemoveFasilitasRow(index)} className="text-rose-500 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-xl shrink-0 cursor-pointer transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Durasi Paket</label>
                  <input
                    type="text" required value={durasiPaket} onChange={(e) => setDurasiPaket(e.target.value)}
                    placeholder="2 Hari 1 Malam"
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Paket</label>
                  <textarea
                    rows={3} required value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Detail informasi paket wisata..."
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-normal text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className={`w-full py-3.5 font-bold text-xs text-white rounded-2xl shadow-lg transition cursor-pointer disabled:opacity-50 ${
                    editingItem ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20" : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-sky-600/25"
                  }`}
                >
                  {isSubmitting ? "Menyimpan..." : editingItem ? "Update Paket Wisata" : "+ Simpan Paket Wisata"}
                </button>
              </form>
            </div>

            {/* Form Tambah Metode Pembayaran */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" /> Tambah Metode Pembayaran
              </h2>
              <form onSubmit={handleSubmitPaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Metode / Bank</label>
                  <input
                    type="text" required value={namaMetode} onChange={(e) => setNamaMetode(e.target.value)}
                    placeholder="Contoh: Bank BJB / QRIS"
                    className="w-full bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">No. Rekening / HP</label>
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
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Upload QR / Logo (Opsional)</label>
                  <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-3.5 text-center cursor-pointer hover:bg-sky-50/50 transition relative bg-slate-50/50">
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => setQrFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <QrCode size={18} className="text-indigo-600" />
                      <span className="text-[11px] font-bold truncate max-w-[200px] text-slate-700">{qrFile ? qrFile.name : "Pilih gambar QR"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instruksi Pembayaran</label>
                  <textarea
                    rows={2} value={instruksi} onChange={(e) => setInstruksi(e.target.value)}
                    placeholder="Instruksi transfer..."
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

          {/* KOLOM KANAN: DAFTAR PAKET WISATA & METODE PEMBAYARAN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daftar Paket Wisata */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
                <Compass size={18} className="text-sky-600" /> Daftar Paket Wisata & Petualangan ({paketList.length})
              </h2>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="animate-spin text-sky-600" size={18} /> Memuat data paket wisata...
                </div>
              ) : paketList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-normal italic">Belum ada Paket Wisata tersimpan.</div>
              ) : (
                <div className="space-y-3">
                  {paketList.map((item) => {
                    const acf = (item.acf || {}) as any;
                    const thumbUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
                    return (
                      <div key={item.id} className="p-4 rounded-2xl border border-slate-200/80 bg-white/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3.5 w-full sm:w-auto overflow-hidden">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/60 overflow-hidden relative shrink-0">
                            {thumbUrl ? (
                              <Image src={thumbUrl} alt="Thumb" fill sizes="56px" className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={18} /></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate uppercase">{item.title?.rendered}</h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                              <span className="flex items-center gap-1 font-black text-sky-600">
                                <Tag size={12} /> Rp {parseInt(String(acf.harga_minimal || acf.harga || "0")).toLocaleString("id-ID")}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {acf.durasi_paket || acf.jam_operasional || "1 Hari"}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Users size={12} /> Min {acf.minimal_peserta || 1} Orang</span>
                              {acf.diskon_nominal && Number(acf.diskon_nominal) > 0 && (
                                <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg font-extrabold text-[10px] border border-sky-100">
                                  Diskon Rp {parseInt(acf.diskon_nominal).toLocaleString("id-ID")} (&ge; {acf.diskon_minimal_peserta || 0} org)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto justify-end">
                          <button onClick={() => handleStartEdit(item)} className="p-2 bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition text-xs font-bold px-3 flex items-center gap-1 cursor-pointer">
                            <Edit3 size={14} /> Edit
                          </button>
                          <button onClick={() => handleDeletePaket(item.id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition text-xs font-bold px-3 flex items-center gap-1 cursor-pointer">
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Daftar Metode Pembayaran Aktif */}
            <div className="bg-white/75 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/90 shadow-lg space-y-4">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
                <CreditCard size={18} className="text-indigo-600" /> Metode Pembayaran Aktif ({paymentMethods.length})
              </h2>

              {paymentMethods.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-normal italic">Belum ada metode pembayaran tersimpan.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-4 rounded-2xl border border-slate-200/80 bg-white/80 flex flex-col justify-between gap-3 shadow-sm">
                      <div className="flex items-start gap-3">
                        {method.qr_image && (
                          <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden relative">
                            <Image src={method.qr_image} alt="QR" fill sizes="64px" className="object-contain" />
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