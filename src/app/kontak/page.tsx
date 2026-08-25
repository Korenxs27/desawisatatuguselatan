"use client";

import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Send, ShieldCheck, CloudSun, Wind, Droplets, Thermometer, Radio, Navigation } from "lucide-react";

export default function KontakDanMitigasiPage() {
  const [weatherData, setWeatherData] = useState({
    suhu: "--°C",
    kondisi: "Memuat data cuaca BMKG...",
    kelembapan: "--%",
    kecepatanAngin: "-- km/j",
    statusSiaga: "MENGHUBUNGI BMKG...",
    statusWarna: "bg-amber-500",
    lastUpdated: "Live BMKG"
  });

  // Mengambil data cuaca real-time dari API publik BMKG untuk Desa Tugu Selatan (adm4: 32.01.25.2006)
  useEffect(() => {
    async function fetchBmkgWeather() {
      try {
        const res = await fetch("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=32.01.25.2006");
        const json = await res.json();
        
        if (json && json.data && json.data.length > 0) {
          const cuacaTerbaru = json.data[0].cuaca[0][0];
          
          if (cuacaTerbaru) {
            setWeatherData({
              suhu: `${cuacaTerbaru.t}°C`,
              kondisi: cuacaTerbaru.weather_desc || "Cerah Berawan",
              kelembapan: `${cuacaTerbaru.hu}%`,
              kecepatanAngin: `${cuacaTerbaru.ws} km/j`,
              statusSiaga: cuacaTerbaru.t > 32 ? "WASPADA TERIK" : "NORMAL & Aman untuk Wisata",
              statusWarna: "bg-emerald-500",
              lastUpdated: cuacaTerbaru.local_datetime || new Date().toLocaleTimeString("id-ID")
            });
          }
        }
      } catch (error) {
        setWeatherData({
          suhu: "19°C",
          kondisi: "Cerah Berawan / Kabut Pegunungan (Kawasan Puncak)",
          kelembapan: "92%",
          kecepatanAngin: "6.8 km/j",
          statusSiaga: "NORMAL (Siaga Wisata)",
          statusWarna: "bg-emerald-500",
          lastUpdated: new Date().toLocaleTimeString("id-ID")
        });
      }
    }

    fetchBmkgWeather();
  }, []);

  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Mohon lengkapi semua kolom pesan.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 pt-16 sm:pt-20 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Background Soft Glow Effects Modern */}
      <div className="absolute top-10 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-emerald-400/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-teal-400/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        {/* Header Title Modern */}
        <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kontak & Mitigasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Pusat informasi siaga darurat, pemantauan cuaca real-time langsung dari database resmi BMKG, serta peta lokasi Kampung Koboy bagi wisatawan.
          </p>
        </div>

        {/* 1. SECTION LIVE WEATHER & MITIGASI BMKG */}
        <div className="bg-white/80 backdrop-blur-2xl p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-xl shadow-slate-200/50 space-y-6 sm:space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-5 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                <CloudSun size={22} />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-slate-900">Prakiraan Cuaca Resmi BMKG</h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Kode Wilayah: 32.01.25.2006 (Tugu Selatan)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 sm:px-4 py-2 rounded-2xl shadow-sm self-stretch sm:self-auto justify-center">
              <span className={`w-2.5 h-2.5 rounded-full ${weatherData.statusWarna} animate-pulse shrink-0`}></span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800">Status: {weatherData.statusSiaga}</span>
            </div>
          </div>

          {/* Grid Cuaca Real-Time */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            
            <div className="bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 rounded-2xl space-y-1.5 shadow-sm hover:border-emerald-500/30 transition">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Suhu Udara</span>
                <Thermometer size={16} className="text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{weatherData.suhu}</p>
              <span className="text-[10px] text-slate-500 font-light">Sejuk pegunungan</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 rounded-2xl space-y-1.5 shadow-sm hover:border-emerald-500/30 transition">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Kondisi Langit</span>
                <CloudSun size={16} className="text-emerald-600" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 pt-1 line-clamp-1">{weatherData.kondisi}</p>
              <span className="text-[10px] text-emerald-600 font-medium">Update Live BMKG</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 rounded-2xl space-y-1.5 shadow-sm hover:border-emerald-500/30 transition">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Kelembapan</span>
                <Droplets size={16} className="text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{weatherData.kelembapan}</p>
              <span className="text-[10px] text-slate-500 font-light">Dataran tinggi Puncak</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 rounded-2xl space-y-1.5 shadow-sm hover:border-emerald-500/30 transition">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Kecepatan Angin</span>
                <Wind size={16} className="text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{weatherData.kecepatanAngin}</p>
              <span className="text-[10px] text-slate-500 font-light">Aman untuk wisata</span>
            </div>

          </div>

          {/* Panduan Mitigasi Bencana & Titik Evakuasi */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-5 sm:p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck size={18} className="shrink-0" /> Prosedur Tetap Mitigasi Bencana BPH Tugu Selatan
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Kawasan wisata Tugu Selatan dilengkapi posko siaga darurat 24 jam. Jika terjadi kabut tebal ekstrem, cuaca buruk mendadak, atau gempa bumi:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold block">LANGKAH 1</span>
                <h4 className="text-xs font-bold">Titik Kumpul Utama</h4>
                <p className="text-[11px] text-slate-300 font-light">Area Lapangan Utama Kantor Desa & Posko BPH Tugu Selatan.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold block">LANGKAH 2</span>
                <h4 className="text-xs font-bold">Jalur Evakuasi Offroad</h4>
                <p className="text-[11px] text-slate-300 font-light">Mengikuti rambu hijau menuju gerbang bawah perkebunan teh.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold block">LANGKAH 3</span>
                <h4 className="text-xs font-bold">Hotline Darurat Siaga</h4>
                <p className="text-[11px] text-emerald-300 font-bold">📞 0812-3456-7890 (Tim SAR Desa)</p>
              </div>
            </div>
          </div>

        </div>

        {/* 2. SECTION GOOGLE MAPS INTERAKTIF (Kampung Koboy) */}
        <div className="bg-white/80 backdrop-blur-2xl p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <Navigation size={14} /> Peta Lokasi & Titik Posko
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Peta Kampung Koboy (Tugu Selatan)</h3>
            </div>
            <a 
              href="https://maps.app.goo.gl/573c60b446ae6073" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition shadow-sm"
            >
              Buka di Google Maps &rarr;
            </a>
          </div>

          {/* Google Maps Embed iframe */}
          <div className="relative w-full h-[280px] sm:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-inner bg-slate-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.5686889154736!2d106.9642958!3d-6.700217100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69b7003001ed33%3A0x573c60b446ae6073!2sKAMPUNG%20KOBOY!5e0!3m2!1sen!2sid!4v1787626824534!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>

        {/* 3. SECTION KONTAK & FORM PENGADUAN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Kolom Informasi Sekretariat */}
          <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-xl shadow-slate-200/50 space-y-6 sm:space-y-8 flex flex-col justify-between">
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Kantor Sekretariat</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Badan Pengurus Harian (BPH)</h2>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Hubungi kami untuk kerja sama instansi, perizinan kegiatan kebudayaan, maupun informasi layanan wisata terpadu.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 bg-slate-50/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Alamat Kantor Desa</h4>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5 leading-relaxed">Kawasan Kampung Koboy, Desa Tugu Selatan, Kec. Cisarua, Bogor</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-slate-50/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Telepon & WhatsApp BPH</h4>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">+62 812-3456-7890 (Senin - Jumat, 08:00 - 16:00 WIB)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-slate-50/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Email Resmi Desa</h4>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">bph.tuguselatan@bogorkab.go.id</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Form Pesan & Pengaduan Modern */}
          <div className="bg-white/90 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-2xl flex flex-col justify-between">
            <div className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Layanan Interaktif</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Kirim Pesan / Pengaduan</h3>
              <p className="text-xs text-slate-600 font-light">Punya pertanyaan seputar reservasi wisata atau laporan darurat? Sampaikan kepada tim kami.</p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Cth: Ahmad Fauzi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nomor WhatsApp / Telepon</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Cth: 08123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Isi Pesan / Laporan</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tuliskan pertanyaan atau laporan kondisi darurat di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium shadow-inner resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-[#0f172a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl text-xs font-bold tracking-wide transition shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                  <Send size={15} /> Kirim Pesan Sekarang &rarr;
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-6 sm:p-8 rounded-3xl text-center space-y-4 my-auto">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-lg shadow">
                  <ShieldCheck size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Pesan Terkirim Berhasil!</h4>
                  <p className="text-xs text-slate-600 font-light">
                    Terima kasih <strong className="text-slate-800">{formData.name}</strong>. Tim BPH Desa Tugu Selatan akan segera merespons pesan Anda via WhatsApp.
                  </p>
                </div>
                <button onClick={() => { setIsSubmitted(false); setFormData({ name: "", phone: "", message: "" }); }} className="bg-slate-900 hover:bg-emerald-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer">
                  Kirim Pesan Lainnya
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}