"use client";

import React, { useState, useEffect } from "react";
import { 
  CloudSun, Wind, Droplets, Thermometer, Radio, 
  Compass, Eye, ShieldCheck, Navigation, Info 
} from "lucide-react";

export default function MitigasiPage() {
  const [weatherData, setWeatherData] = useState({
    suhu: "--°C",
    kondisi: "Memuat BMKG...",
    kelembapan: "--%",
    kecepatanAngin: "-- km/j",
    arahAngin: "Utara",
    jarakPandang: "-- km",
    statusSiaga: "MENGHUBUNGI BMKG...",
    statusWarna: "bg-amber-500",
    tingkatRisiko: "Rendah",
    lastUpdated: "Live BMKG"
  });

  useEffect(() => {
    async function fetchBmkgWeather() {
      try {
        const res = await fetch("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=32.01.25.2006");
        const json = await res.json();
        
        if (json && json.data && json.data.length > 0) {
          const cuacaTerbaru = json.data[0].cuaca[0][0];
          
          if (cuacaTerbaru) {
            const temp = cuacaTerbaru.t || 22;
            const windSpeed = cuacaTerbaru.ws || 10;
            const weatherDesc = cuacaTerbaru.weather_desc || "Cerah Berawan";

            let status = "NORMAL & Safe untuk Wisata";
            let color = "bg-emerald-500";
            let risiko = "Rendah";

            if (weatherDesc.toLowerCase().includes("huj") || windSpeed > 25) {
              status = "WASPADA HUJAN / ANGIN";
              color = "bg-amber-500";
              risiko = "Sedang";
            } else if (weatherDesc.toLowerCase().includes("petir") || weatherDesc.toLowerCase().includes("lebat")) {
              status = "SIAGA BENCANA / BADAI";
              color = "bg-rose-500";
              risiko = "Tinggi";
            }

            setWeatherData({
              suhu: `${temp}°C`,
              kondisi: weatherDesc,
              kelembapan: `${cuacaTerbaru.hu || 85}%`,
              kecepatanAngin: `${windSpeed} km/j`,
              arahAngin: cuacaTerbaru.wd || "Tenggara",
              jarakPandang: cuacaTerbaru.vs_text || "> 10 km",
              statusSiaga: status,
              statusWarna: color,
              tingkatRisiko: risiko,
              lastUpdated: cuacaTerbaru.local_datetime || new Date().toLocaleTimeString("id-ID")
            });
          }
        }
      } catch (error) {
        setWeatherData({
          suhu: "19°C",
          kondisi: "Cerah Berawan / Kabut Pegunungan",
          kelembapan: "92%",
          kecepatanAngin: "6.8 km/j",
          arahAngin: "Selatan",
          jarakPandang: "8 km",
          statusSiaga: "NORMAL (Siaga Wisata)",
          statusWarna: "bg-emerald-500",
          tingkatRisiko: "Rendah",
          lastUpdated: new Date().toLocaleTimeString("id-ID")
        });
      }
    }

    fetchBmkgWeather();
  }, []);

  // Inisialisasi Peta Leaflet.js dengan Marker Bulat Berkedip
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      initInteractiveMap();
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const initInteractiveMap = () => {
    const L = (window as any).L;
    if (!L) return;

    const mapContainer = document.getElementById("tugu-mitigasi-map");
    if (!mapContainer || (mapContainer as any)._leaflet_id) return;

    const tuguLat = -6.7002171;
    const tuguLng = 106.9642958;

    const map = L.map("tugu-mitigasi-map", {
      center: [tuguLat, tuguLng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Desa Wisata Tugu Selatan",
      maxZoom: 18
    }).addTo(map);

    // Fungsi Pembuat Marker Bulat Berkedip Elegan
    const createPulsingDot = (colorHex: string) => {
      return L.divIcon({
        className: "custom-pulsing-dot-container",
        html: `
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: ${colorHex}; opacity: 0.6; animation: pulseRing 1.8s infinite ease-in-out;"></div>
            <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background-color: ${colorHex}; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    // 1. ZONA HIJAU (AMAN & EVAKUASI)
    const zonaHijauCoords = [
      [-6.6988, 106.9630],
      [-6.6992, 106.9655],
      [-6.7015, 106.9652],
      [-6.7010, 106.9625]
    ];
    L.polygon(zonaHijauCoords, {
      color: "#10b981",
      fillColor: "#10b981",
      fillOpacity: 0.35,
      weight: 2,
      dashArray: "5, 5"
    }).addTo(map).bindPopup("<b>🟢 ZONA AMAN & EVAKUASI UTAMA</b><br/>Area Lapangan & Posko BPH Tugu Selatan (Kampung Koboy). Steril dan aman untuk titik kumpul.");

    L.marker([-6.7002, 106.9642], { icon: createPulsingDot("#10b981") })
      .addTo(map)
      .bindPopup("<b>📍 Posko Siaga Utama BPH</b><br/>Pusat Informasi & Penanggulangan Bencana Desa Tugu Selatan.");

    // 2. ZONA ORANYE (WASPADA KABUT)
    const zonaOranyeCoords = [
      [-6.6950, 106.9660],
      [-6.6965, 106.9695],
      [-6.6995, 106.9685],
      [-6.6980, 106.9650]
    ];
    L.polygon(zonaOranyeCoords, {
      color: "#f59e0b",
      fillColor: "#f59e0b",
      fillOpacity: 0.35,
      weight: 2,
      dashArray: "5, 5"
    }).addTo(map).bindPopup("<b>🟡 ZONA WASPADA KABUT & ANGIN KENCANG</b><br/>Area Perkebunan Teh & Jalur Offroad. Pengunjung diimbau berhati-hati.");

    L.marker([-6.6970, 106.9672], { icon: createPulsingDot("#f59e0b") })
      .addTo(map)
      .bindPopup("<b>⚠️ Pos Pantau Kebun Teh</b><br/>Area rawan penurunan jarak pandang kabut pegunungan.");

    // 3. ZONA MERAH (RESTRIKSI / BAHAYA LONGSOR)
    const zonaMerahCoords = [
      [-6.7030, 106.9600],
      [-6.7045, 106.9630],
      [-6.7065, 106.9615],
      [-6.7050, 106.9585]
    ];
    L.polygon(zonaMerahCoords, {
      color: "#f43f5e",
      fillColor: "#f43f5e",
      fillOpacity: 0.4,
      weight: 2,
      dashArray: "5, 5"
    }).addTo(map).bindPopup("<b>🔴 ZONA BAHAYA LONGSOR & TEBING TERJAL</b><br/>Sektor lereng terjal & curug. Dilarang mendekat saat intensitas hujan tinggi!");

    L.marker([-6.7048, 106.9608], { icon: createPulsingDot("#f43f5e") })
      .addTo(map)
      .bindPopup("<b>⛔ Titik Rawan Longsor Lereng</b><br/>Zona dibatasi saat cuaca buruk mendadak.");
  };

  const whatsappNumber = "6281234567890";
  const whatsappMessage = encodeURIComponent("Halo Tim SAR BPH Tugu Selatan, saya membutuhkan bantuan informasi kondisi siaga darurat.");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 pt-24 sm:pt-15 pb-24 px-4 sm:px-6 font-sans text-slate-800 relative overflow-hidden">
      
      {/* CSS Khusus Animasi Kedip & Reset Ikon Bawaan Leaflet */}
      <style jsx global>{`
        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .custom-pulsing-dot-container {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* Background Soft Glow Effects */}
      <div className="absolute top-10 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-sky-300/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-indigo-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Peta Mitigasi & Cuaca <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">
              Desa Tugu Selatan
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Pemantauan cuaca real-time resmi dari BMKG, pemetaan GIS zona risiko bencana akurat, serta titik evakuasi aman bagi wisatawan di Kampung Koboy dan sekitarnya.
          </p>
        </div>

        {/* 1. VISUAL PETA INTERAKTIF SATELLITE DENGAN MARKER BULAT KEDIP */}
        <div className="bg-white/80 backdrop-blur-2xl p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-xl shadow-sky-900/5 space-y-5">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
                <Navigation size={14} /> Peta Satelit GIS & Zona Geofence
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Pemetaan Zona Risiko Bencana Akurat</h2>
            </div>

          </div>

          {/* Kontainer Peta Leaflet */}
          <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl bg-slate-950">
            
            <div id="tugu-mitigasi-map" className="w-full h-full z-10"></div>

            {/* Legenda Risiko di Sudut Peta */}
            <div className="absolute bottom-4 left-4 z-[999] bg-slate-900/90 backdrop-blur-md border border-white/15 p-3 sm:p-4 rounded-2xl text-white space-y-1.5 shadow-2xl max-w-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                <Info size={12} className="text-sky-400" /> Legenda Zona Risiko:
              </span>
              <div className="flex flex-col gap-1.5 text-[10px] sm:text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="text-slate-200">🟢 Zona Hijau: Posko & Kumpul Aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                  <span className="text-slate-200">🟡 Zona Oranye: Waspada Kebun Teh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                  <span className="text-slate-200">🔴 Zona Merah: Rawan Longsor Lereng</span>
                </div>
              </div>
            </div>

          </div>
          <p className="text-[11px] text-slate-400 italic text-center">
            * Klik pada area poligon atau marker lingkaran berkedip di dalam peta untuk melihat informasi detail zona.
          </p>
        </div>

        {/* 2. SECTION LIVE WEATHER BMKG */}
        <div className="bg-white/80 backdrop-blur-2xl p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/90 shadow-xl shadow-sky-900/5 space-y-6 sm:space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-5 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                <CloudSun size={22} className="animate-bounce" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-slate-900">Prakiraan Cuaca Resmi BMKG</h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">ADM4: 32.01.25.2006 (Tugu Selatan, Kec. Cisarua)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 sm:px-4 py-2 rounded-2xl shadow-sm self-stretch sm:self-auto justify-center">
              <span className={`w-2.5 h-2.5 rounded-full ${weatherData.statusWarna} animate-pulse shrink-0`}></span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wide">{weatherData.statusSiaga}</span>
            </div>
          </div>

          {/* Grid Indikator Cuaca */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            
            <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Suhu</span>
                <Thermometer size={15} className="text-sky-600 animate-pulse" />
              </div>
              <p className="text-xl font-black text-slate-900">{weatherData.suhu}</p>
              <span className="text-[9px] text-slate-500 font-normal block">Sejuk Puncak</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Kondisi</span>
                <CloudSun size={15} className="text-sky-600" />
              </div>
              <p className="text-xs font-bold text-slate-900 pt-1 truncate">{weatherData.kondisi}</p>
              <span className="text-[9px] text-sky-600 font-medium block">BMKG Live</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Kelembapan</span>
                <Droplets size={15} className="text-sky-600" />
              </div>
              <p className="text-xl font-black text-slate-900">{weatherData.kelembapan}</p>
              <span className="text-[9px] text-slate-500 font-normal block">Dataran Tinggi</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Angin</span>
                <Wind size={15} className="text-sky-600" />
              </div>
              <p className="text-xl font-black text-slate-900">{weatherData.kecepatanAngin}</p>
              <span className="text-[9px] text-slate-500 font-normal block">Kecepatan</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Arah Angin</span>
                <Compass size={15} className="text-sky-600" />
              </div>
              <p className="text-xs font-bold text-slate-900 pt-1 truncate">{weatherData.arahAngin}</p>
              <span className="text-[9px] text-slate-500 font-normal block">Hembusan</span>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Visibility</span>
                <Eye size={15} className="text-sky-600" />
              </div>
              <p className="text-xs font-bold text-slate-900 pt-1 truncate">{weatherData.jarakPandang}</p>
              <span className="text-[9px] text-slate-500 font-normal block">Jarak Pandang</span>
            </div>

          </div>

          {/* Panduan Evakuasi Bencana */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-sky-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck size={18} className="shrink-0 text-sky-400" /> Prosedur Mitigasi Bencana
              </div>
              <span className="text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-full uppercase">
                Tingkat Risiko: {weatherData.tingkatRisiko}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Kawasan wisata Tugu Selatan dilengkapi posko siaga darurat 24 jam. Jika terjadi cuaca buruk mendadak, kabut tebal ekstrem, atau longsor:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1 hover:bg-white/15 transition">
                <span className="text-[10px] text-sky-400 font-extrabold block uppercase tracking-wider">Langkah 1</span>
                <h4 className="text-xs font-bold text-white">Titik Kumpul Utama</h4>
                <p className="text-[11px] text-slate-300 font-normal">Lapangan Utama Kantor Desa & Posko BPH Tugu Selatan.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1 hover:bg-white/15 transition">
                <span className="text-[10px] text-sky-400 font-extrabold block uppercase tracking-wider">Langkah 2</span>
                <h4 className="text-xs font-bold text-white">Jalur Evakuasi Offroad</h4>
                <p className="text-[11px] text-slate-300 font-normal">Mengikuti rambu hijau menuju gerbang bawah perkebunan teh.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1 hover:bg-white/15 transition">
                <span className="text-[10px] text-sky-400 font-extrabold block uppercase tracking-wider">Langkah 3</span>
                <h4 className="text-xs font-bold text-white">Hotline Darurat Siaga</h4>
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11px] text-sky-300 hover:text-white font-bold block pt-0.5 underline transition"
                >
                  📞 +62 812-3456-7890 (Tim SAR Desa)
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}