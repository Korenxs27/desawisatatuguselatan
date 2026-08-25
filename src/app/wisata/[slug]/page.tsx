"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Compass, CheckCircle2, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";

export default function DetailWisataPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const router = useRouter();

  // Database paket wisata Tugu Selatan dengan URL gambar yang sinkron dengan halaman list
  const wisataDataMap: Record<string, any> = {
    "fun-offroad": {
      title: "Fun Offroad Adventure",
      category: "Offroad",
      price: 1000000,
      unit: "Per Jeep (Maks 4 Orang)",
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
      desc: "Jelajahi jalur ekstrem pegunungan Tugu Selatan dengan armada Jeep tangguh melintasi area perkebunan teh.",
      fasilitas: ["Unit Jeep Land Rover / Jimny", "Driver Profesional Berpengalaman", "P3K Standar Keamanan", "Trek Jalur Ekstrem Pilihan", "Air Mineral Gelas"]
    },
    "fun-offroad-telaga-saat": {
      title: "Fun Offroad Telaga Saat",
      category: "Offroad",
      price: 1250000,
      unit: "Per Jeep (Maks 4 Orang)",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1p4C4yIHClbIGSq3QP07O5YZco1Bm73HUcX88rvXChtCliID6VK2LeoA&s=10",
      desc: "Petualangan seru offroad menuju titik nol kilometer sumber Ciliwung di Telaga Saat Puncak.",
      fasilitas: ["Unit Jeep Tangguh", "Driver Sekaligus Guide", "Tiket Masuk & Parkir Telaga Saat", "P3K Standar", "Air Mineral"]
    },
    "trekking": {
      title: "Trekking / Hiking Pegunungan",
      category: "Trekking",
      price: 125000,
      unit: "Per Pax (Minimal 10 Orang)",
      img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1000",
      desc: "Nikmati udara sejuk kebun teh dengan pemandu lokal berpengalaman menyusuri alam asri.",
      fasilitas: ["Tiket Masuk Kawasan (HTM)", "Tiket Lintas Jalur Kebun Teh", "1 Orang Guide Profesional", "Tracking Pole & Air Mineral"]
    },
    "outbound": {
      title: "Outbound Fun Games",
      category: "Outbound",
      price: 125000,
      unit: "Per Pax (Minimal 20 Orang)",
      img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000",
      desc: "Aktivitas kelompok seru di alam terbuka untuk team building instansi, perusahaan, maupun keluarga.",
      fasilitas: ["Master Game / Fasilitator Profesional", "Peralatan Games & Properti", "Sound System Standar", "Air Mineral & P3K"]
    },
    "archery": {
      title: "Archery / Latihan Memanah",
      category: "Edukasi & Olahraga",
      price: 75000,
      unit: "Per 10 Pax",
      img: "https://www.banksinarmas.com/id/public/upload/images/67d90ecc06c6f_7-Lokasi-Olahraga-Panahan-di-Jakarta-dan-Sekitarnya-medium.jpg",
      desc: "Uji fokus dan ketepatan memanah di area terbuka pegunungan yang dikelilingi pemandangan indah.",
      fasilitas: ["Peralatan Memanah Standar", "Instruktur Profesional", "Target Papan Panahan", "Air Mineral"]
    },
    "paintball": {
      title: "Paintball Simulation Game",
      category: "Outbound",
      price: 125000,
      unit: "Per Pax",
      img: "https://www.goersapp.com/blog/wp-content/uploads/2025/07/Main-Paintball-di-Jakarta.webp",
      desc: "Simulasi tempur seru dan taktis di tengah rimbunnya area hutan pinus Tugu Selatan.",
      fasilitas: ["Semi-Automatic Marker Gun", "40 Peluru Paintball", "Body Protector & Goggles", "Wasit & Fasilitator Game"]
    }
  };

  const wisata = wisataDataMap[slug] || {
    title: "Paket Wisata Tugu Selatan",
    category: "Petualangan",
    price: 100000,
    unit: "Per Pax",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
    desc: "Nikmati pengalaman liburan menarik di kawasan Desa Wisata Tugu Selatan Puncak.",
    fasilitas: ["Pemandu Lokal", "P3K Standar", "Air Mineral"]
  };

  // State untuk E-Ticketing & Booking Form
  const [ticketCount, setTicketCount] = useState(1);
  const [includeGuide, setIncludeGuide] = useState(false);
  const guideFee = 50000;

  const [bookingStep, setBookingStep] = useState<"form" | "payment" | "success">("form");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [visitDate, setVisitDate] = useState("2026-06-15");

  const subtotal = wisata.price * ticketCount;
  const totalPayment = subtotal + (includeGuide ? guideFee : 0);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Mohon isi Nama Lengkap dan Nomor WhatsApp terlebih dahulu.");
      return;
    }
    setBookingStep("payment");
  };

  const handleCompletePayment = (method: string) => {
    setBookingStep("success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 pt-16 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Background Soft Glow Effects (Disesuaikan jadi nuansa hijau) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Tombol Kembali */}
        <div>
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-100 transition shadow-sm"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* KOLOM KIRI & TENGAH: INFORMASI DETAIL WISATA */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
              <img 
                src={wisata.img} 
                alt={wisata.title} 
                className="w-full h-full object-cover" 
              />
              <span className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider z-10 shadow">
                {wisata.category}
              </span>
            </div>

            <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-white/85 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{wisata.title}</h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">{wisata.desc}</p>
              </div>

              <div className="border-t border-slate-200/80 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Fasilitas Termasuk:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wisata.fasilitas.map((fasilitas: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60 font-medium">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>{fasilitas}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: MODUL E-TICKETING & BOOKING INTERAKTIF */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl sticky top-28 space-y-6">
              
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Tarif Resmi</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-600">Rp. {wisata.price.toLocaleString("id-ID")}</span>
                  <span className="text-xs text-slate-500 font-medium">{wisata.unit}</span>
                </div>
              </div>

              {/* STEP 1: FORM BOOKING */}
              {bookingStep === "form" && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap Pemesan</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Cth: Budi Santoso"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Cth: 08123456789"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tanggal</label>
                      <input 
                        type="date" 
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs text-slate-800 outline-none font-medium shadow-inner" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jumlah Unit</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={ticketCount} 
                        onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs text-slate-800 outline-none font-medium shadow-inner" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Pemandu Lokal</h4>
                      <p className="text-[10px] text-slate-500 font-light">+Rp 50.000</p>
                    </div>
                    <input type="checkbox" checked={includeGuide} onChange={(e) => setIncludeGuide(e.target.checked)} className="w-4 h-4 accent-emerald-600 cursor-pointer rounded" />
                  </div>

                  <div className="bg-[#0f172a] text-white p-4 rounded-2xl space-y-1.5 shadow-md">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Subtotal:</span>
                      <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    {includeGuide && (
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Pemandu:</span>
                        <span>Rp {guideFee.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                      <span>Total Tagihan:</span>
                      <span className="text-emerald-400">Rp {totalPayment.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#0f172a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl text-xs font-bold tracking-wide transition shadow-xl flex items-center justify-center gap-2">
                    <CreditCard size={16} /> Lanjut ke Pembayaran &rarr;
                  </button>
                </form>
              )}

              {/* STEP 2: PEMBAYARAN */}
              {bookingStep === "payment" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">Konfirmasi Pemesan</h3>
                    <p className="text-[11px] text-slate-600">Nama: <strong className="text-slate-900">{customerName}</strong></p>
                    <p className="text-[11px] text-slate-600">WhatsApp: <strong className="text-slate-900">{customerPhone}</strong></p>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold">
                      <span>Total Tagihan:</span>
                      <span className="text-emerald-600">Rp {totalPayment.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Metode Pembayaran</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={() => handleCompletePayment("QRIS")} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white font-bold text-xs text-slate-800 text-left transition shadow-sm flex items-center justify-between">
                        <span>📱 QRIS Instant Payment</span> <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Bebas Biaya</span>
                      </button>
                      <button onClick={() => handleCompletePayment("Transfer Bank")} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white font-bold text-xs text-slate-800 text-left transition shadow-sm flex items-center justify-between">
                        <span>🏦 Transfer Bank (BCA/BRI)</span>
                      </button>
                      <button onClick={() => handleCompletePayment("E-Wallet")} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white font-bold text-xs text-slate-800 text-left transition shadow-sm flex items-center justify-between">
                        <span>💳 E-Wallet (OVO / GoPay)</span>
                      </button>
                    </div>
                  </div>

                  <button onClick={() => setBookingStep("form")} className="w-full py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                    &larr; Ubah Data Pesanan
                  </button>
                </div>
              )}

              {/* STEP 3: SUKSES (E-TICKET CETAK) */}
              {bookingStep === "success" && (
                <div className="space-y-4 text-center animate-fadeIn py-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl shadow-inner">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Pembayaran Lunas!</h3>
                    <p className="text-[11px] text-slate-500">
                      E-Ticket resmi telah dikirim ke WhatsApp <strong className="text-slate-800">{customerPhone}</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-2xl text-left space-y-1 text-[11px] shadow-lg">
                    <p className="text-emerald-400 font-bold border-b border-slate-800 pb-1.5">🎟️ KODE: #TS-2026-99X</p>
                    <p>Wisata: <strong>{wisata.title}</strong></p>
                    <p>Pemesan: <strong>{customerName}</strong></p>
                    <p>Tanggal: <strong>{visitDate}</strong></p>
                    <p>Total Lunas: <strong className="text-emerald-400">Rp {totalPayment.toLocaleString("id-ID")}</strong></p>
                  </div>

                  <button onClick={() => setBookingStep("form")} className="w-full bg-[#0f172a] hover:bg-emerald-900 text-white py-3 rounded-xl text-xs font-bold shadow-md">
                    Pesan Tiket Lainnya
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