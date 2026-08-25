export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20 pt-12 pb-8 px-4 sm:px-6 border-t border-blue-950 font-sans">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 pb-10 border-b border-slate-800 text-center sm:text-left">
        
        {/* Kolom 1: Info Desa */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold tracking-tight text-white uppercase tracking-wider">Desa Tugu Selatan</h4>
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm mx-auto sm:mx-0">
            Kecamatan Cisarua / Megamendung, Kabupaten Bogor. Pusat pariwisata alam dan budaya berbasis masyarakat.
          </p>
        </div>

        {/* Kolom 2: Tautan Cepat */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Tautan Cepat</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-light">
            <li><a href="/profil" className="hover:text-emerald-400 transition">Profil & BPH</a></li>
            <li><a href="/wisata" className="hover:text-emerald-400 transition">Daftar Wisata</a></li>
            <li><a href="/kontak" className="hover:text-emerald-400 transition">Kontak Pengelola</a></li>
          </ul>
        </div>

        {/* Kolom 3: Kontak */}
        <div className="space-y-3 sm:col-span-2 md:col-span-1">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Kontak Pengelola</h4>
          <p className="text-xs text-slate-400 font-light">Badan Pengurus Harian (BPH)</p>
          <p className="text-xs text-slate-400 font-light">Email: info@desatuguselatan.id</p>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-[1200px] mx-auto pt-6 text-center text-[11px] text-slate-500 font-light">
        &copy; {new Date().getFullYear()} Desa Tugu Selatan. All rights reserved.
      </div>
    </footer>
  );
}