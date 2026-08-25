"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, CheckCircle2, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";

export default function DetailUmkmPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const router = useRouter();

  // Database detail produk UMKM Tugu Selatan
  const umkmDataMap: Record<string, any> = {
    "keripik-singkong": {
      name: "Keripik Singkong Pedas Manis",
      category: "Kuliner",
      price: 15000,
      unit: "Per Bungkus (250gr)",
      img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=1000",
      desc: "Oleh-oleh khas buatan warga lokal Tugu Selatan dengan resep turun-temurun, renyah, dan berasa bumbu rempah pilihan.",
      owner: "Ibu Siti Aminah (Kelompok Tani)",
      bahan: ["Singkong Pilihan Segar", "Gula Aren Asli", "Cabai Merah Segar", "Bawang Putih & Garam"]
    },
    "teh-herbal": {
      name: "Teh Hijau Herbal Organik",
      category: "Minuman & Herbal",
      price: 25000,
      unit: "Per Kotak (isi 20 kantong)",
      img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1000",
      desc: "Dipetik langsung dari perkebunan teh pilihan di kawasan Puncak Tugu Selatan, diolah secara higienis dan menyehatkan.",
      owner: "Kelompok Tani Lestari",
      bahan: ["Daun Teh Hijau Pilihan", "Rempah Alami Puncak"]
    },
    "tas-bambu": {
      name: "Tas Anyaman Bambu Tradisional",
      category: "Kerajinan Tangan",
      price: 75000,
      unit: "Per Unit",
      img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000",
      desc: "Kerajinan tangan ramah lingkungan hasil karya pengrajin lokal desa, kuat, estetik, dan cocok untuk tas belanja atau souvenir.",
      owner: "Bapak Supriyadi (Kreatif Bambu)",
      bahan: ["Bambu Hitam / Apus Pilihan", "Tali Pengikat Alami", "Finishing Anti Rayap Ramah Lingkungan"]
    },
    "madu-hutan": {
      name: "Madu Hutan Asli Puncak",
      category: "Minuman & Herbal",
      price: 95000,
      unit: "Per Botol (350ml)",
      img: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=1000",
      desc: "Madu murni hasil panen dari lebah liar di sekitar hutan pegunungan Tugu Selatan, berkhasiat tinggi untuk stamina.",
      owner: "Pak Dadan (Peternak Lebah Mandiri)",
      bahan: ["100% Nektar Bunga Liar Pegunungan Puncak"]
    },
    "wajit-ketan": {
      name: "Wajit Ketan Gula Aren",
      category: "Kuliner",
      price: 20000,
      unit: "Per Pack (isi 10)",
      img: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&q=80&w=1000",
      desc: "Jajanan tradisional manis legit berbahan dasar beras ketan pilihan dan gula aren asli warga lokal.",
      owner: "Dapur Bu Hj. Ooy",
      bahan: ["Beras Ketan Putih", "Gula Aren Asli", "Santan Kelapa Segar"]
    },
    "bibit-tanaman": {
      name: "Bibit Tanaman Hias Pegunungan",
      category: "Agrikultur",
      price: 35000,
      unit: "Per Pot",
      img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1000",
      desc: "Berbagai jenis tanaman hias dan bunga segar dataran tinggi yang dibudidayakan langsung oleh petani setempat.",
      owner: "Flora Tugu Asri",
      bahan: ["Media Tanam Humus Subur", "Bibit Tanaman Unggul Dataran Tinggi"]
    }
  };

  const product = umkmDataMap[slug] || {
    name: "Produk UMKM Tugu Selatan",
    category: "Oleh-Oleh",
    price: 20000,
    unit: "Per Unit",
    img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=1000",
    desc: "Produk unggulan hasil karya warga lokal Desa Wisata Tugu Selatan Puncak.",
    owner: "UMKM Warga Setempat",
    bahan: ["Bahan Alami Pilihan Berkualitas"]
  };

  // State untuk Alur Pemesanan & Pembayaran UMKM
  const [quantity, setQuantity] = useState(1);
  const [orderStep, setOrderStep] = useState<"form" | "payment" | "success">("form");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");

  const totalPrice = product.price * quantity;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !shippingAddress) {
      alert("Mohon lengkapi Nama, No WhatsApp, dan Alamat Pengiriman.");
      return;
    }
    setOrderStep("payment");
  };

  const handleCompletePayment = (method: string) => {
    setSelectedPayment(method);
    setOrderStep("success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 pt-16 sm:pt-20 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Background Soft Glow Effects */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 relative z-10">
        
        {/* Tombol Kembali */}
        <div>
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-100 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft size={14} /> Kembali ke Katalog UMKM
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          
          {/* KOLOM KIRI & TENGAH: INFORMASI DETAIL PRODUK */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="relative aspect-[16/10] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl uppercase tracking-wider z-10 shadow">
                {product.category}
              </span>
            </div>

            <div className="bg-white/75 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/85 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Produksi: {product.owner}</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light pt-2">{product.desc}</p>
              </div>

              <div className="border-t border-slate-200/85 pt-6 space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">Komposisi / Bahan Unggulan:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {product.bahan.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60 font-medium">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: MODUL CHECKOUT & PEMBAYARAN UMKM */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl lg:sticky lg:top-28 space-y-6">
              
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Harga Satuan</span>
                <div className="flex items-baseline gap-1 mt-1 flex-wrap">
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">Rp. {product.price.toLocaleString("id-ID")}</span>
                  <span className="text-xs text-slate-500 font-medium">{product.unit}</span>
                </div>
              </div>

              {/* STEP 1: FORMULIR PEMESANAN */}
              {orderStep === "form" && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Pemesan</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Cth: Siti Rahma"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Cth: 08123456789"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jumlah Pesanan</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none font-medium shadow-inner" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alamat Pengiriman</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="Cth: Villa Puncak Indah Blok A / Ambil di Pos BPH"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner resize-none"
                    />
                  </div>

                  <div className="bg-[#0f172a] text-white p-4 rounded-2xl space-y-1.5 shadow-md">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Total Item ({quantity}x):</span>
                      <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                      <span>Total Tagihan:</span>
                      <span className="text-emerald-400">Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#0f172a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl text-xs font-bold tracking-wide transition shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                    <CreditCard size={16} /> Lanjut ke Pembayaran &rarr;
                  </button>
                </form>
              )}

              {/* STEP 2: PEMILIHAN METODE PEMBAYARAN */}
              {orderStep === "payment" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">Ringkasan Pesanan</h3>
                    <p className="text-[11px] text-slate-600">Pemesan: <strong className="text-slate-900">{buyerName}</strong></p>
                    <p className="text-[11px] text-slate-600">WhatsApp: <strong className="text-slate-900">{buyerPhone}</strong></p>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold">
                      <span>Total Pembayaran:</span>
                      <span className="text-emerald-600">Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Pilih Metode Pembayaran</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={() => handleCompletePayment("QRIS Instant")} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white font-bold text-xs text-slate-800 text-left transition shadow-sm flex items-center justify-between cursor-pointer">
                        <span>📱 QRIS Instant</span> <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Bebas Biaya</span>
                      </button>
                      <button onClick={() => handleCompletePayment("Transfer Bank BCA/BRI")} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white font-bold text-xs text-slate-800 text-left transition shadow-sm flex items-center justify-between cursor-pointer">
                        <span>🏦 Transfer Bank (BCA / BRI)</span>
                      </button>
                      <button onClick={() => handleCompletePayment("E-Wallet GoPay/OVO")} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white font-bold text-xs text-slate-800 text-left transition shadow-sm flex items-center justify-between cursor-pointer">
                        <span>💳 E-Wallet (GoPay / OVO)</span>
                      </button>
                    </div>
                  </div>

                  <button onClick={() => setOrderStep("form")} className="w-full py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer">
                    &larr; Ubah Data Pesanan
                  </button>
                </div>
              )}

              {/* STEP 3: SUKSES (INVOICE / BUKTI PEMESANAN) */}
              {orderStep === "success" && (
                <div className="space-y-4 text-center animate-in fade-in py-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl shadow-inner">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Pembayaran Lunas!</h3>
                    <p className="text-[11px] text-slate-500">
                      Pesanan Anda diteruskan ke produsen <strong className="text-slate-800">{product.owner}</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-2xl text-left space-y-1 text-[11px] shadow-lg">
                    <p className="text-emerald-400 font-bold border-b border-slate-800 pb-1.5">📦 INVOICE: #UMKM-TS-2026</p>
                    <p>Produk: <strong>{product.name}</strong></p>
                    <p>Pemesan: <strong>{buyerName}</strong> ({quantity}x)</p>
                    <p>Metode: <strong>{selectedPayment}</strong></p>
                    <p>Total Lunas: <strong className="text-emerald-400">Rp {totalPrice.toLocaleString("id-ID")}</strong></p>
                  </div>

                  <button onClick={() => setOrderStep("form")} className="w-full bg-[#0f172a] hover:bg-emerald-900 text-white py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer">
                    Pesan Produk Lainnya
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}