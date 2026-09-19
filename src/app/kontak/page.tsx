"use client";

import React, { useState } from "react";
import { 
  Phone, Mail, MapPin, Send, Navigation, 
  Loader2, CheckCircle2, MessageSquare 
} from "lucide-react";

export default function KontakPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Mohon lengkapi semua kolom pesan.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api-wp/tugu-bridge/v1/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: formData.name,
          pesan: `[No. WA: ${formData.phone}] - ${formData.message}`,
          email: formData.email || "pengunjung@tuguselatan.desa"
        })
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Gagal mengirim pesan ke server. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      alert("Terjadi kesalahan koneksi saat mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = "6281234567890";
  const whatsappMessage = encodeURIComponent("Halo BPH Desa Tugu Selatan, saya ingin bertanya mengenai informasi wisata / perizinan.");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 pt-24 sm:pt-15 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      <div className="absolute top-10 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-sky-300/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-indigo-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Hubungi BPH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">
              Desa Tugu Selatan
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Sampaikan pertanyaan, perizinan, atau masukan Anda secara langsung kepada tim BPH Desa Tugu Selatan.
          </p>
        </div>

        {/* SECTION GOOGLE MAPS INTERAKTIF (Presisi Kampung Koboy) */}
        <div className="bg-white/80 backdrop-blur-2xl p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-xl shadow-sky-900/5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
                <Navigation size={14} /> Lokasi Posko Utama
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Peta Kampung Koboy (Tugu Selatan)</h3>
            </div>
          
          </div>

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

        {/* SECTION KONTAK & FORM PENGADUAN INTEGRASI REST API */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Kolom Informasi Sekretariat */}
          <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-xl shadow-sky-900/5 space-y-6 sm:space-y-8 flex flex-col justify-between">
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Kantor Sekretariat</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Badan Pengurus Harian (BPH)</h2>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  Hubungi kami untuk kerja sama instansi, perizinan kegiatan kebudayaan, maupun informasi layanan wisata terpadu.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 bg-slate-50/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
                  <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Alamat Kantor Desa</h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-relaxed">Kawasan Kampung Koboy, Desa Tugu Selatan, Kec. Cisarua, Bogor</p>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 bg-slate-50/90 hover:bg-sky-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70 transition duration-200 group"
                >
                  <div className="w-10 h-10 bg-sky-100 group-hover:bg-sky-600 text-sky-600 group-hover:text-white rounded-xl flex items-center justify-center shrink-0 transition">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition">Telepon & WhatsApp BPH</h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">+62 812-3456-7890 (Klik untuk chat WhatsApp)</p>
                  </div>
                </a>

                <a 
                  href="mailto:admindesawisatatuguselatan@gmail.com"
                  className="flex items-start gap-3.5 bg-slate-50/90 hover:bg-sky-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70 transition duration-200 group"
                >
                  <div className="w-10 h-10 bg-sky-100 group-hover:bg-sky-600 text-sky-600 group-hover:text-white rounded-xl flex items-center justify-center shrink-0 transition">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition">Email Resmi Desa</h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">admindesawisatatuguselatan@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Form Pengaduan Langsung ke Admin Panel WordPress */}
          <div className="bg-white/90 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-2xl flex flex-col justify-between">
            <div className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Layanan Interaktif</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Kirim Pesan / Pengaduan</h3>
              <p className="text-xs text-slate-600 font-normal">Pesan Anda akan terkirim langsung ke Admin Panel BPH Tugu Selatan.</p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nama Lengkap Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-sky-600 font-medium shadow-inner transition" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nomor WhatsApp / Telepon</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="08123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-sky-600 font-medium shadow-inner transition" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Isi Pesan / Laporan</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tuliskan pertanyaan, masukan, atau laporan kondisi darurat..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-sky-600 font-medium shadow-inner resize-none transition"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-sky-600 text-white py-3.5 rounded-2xl text-xs font-bold tracking-wide transition shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Mengirim ke Admin Panel...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Kirim Pesan Sekarang &rarr;
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-sky-50 border border-sky-200 p-6 sm:p-8 rounded-3xl text-center space-y-4 my-auto">
                <div className="w-12 h-12 bg-sky-600 text-white rounded-full flex items-center justify-center mx-auto text-lg shadow">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Pesan Terkirim Berhasil!</h4>
                  <p className="text-xs text-slate-600 font-normal">
                    Terima kasih <strong className="text-slate-800">{formData.name}</strong>. Pesan Anda telah diteruskan ke Admin Panel BPH Tugu Selatan.
                  </p>
                </div>
                <button 
                  onClick={() => { setIsSubmitted(false); setFormData({ name: "", phone: "", message: "", email: "" }); }} 
                  className="bg-slate-900 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                >
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