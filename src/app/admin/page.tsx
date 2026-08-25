'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Compass, 
  ShoppingBag, 
  MessageSquare, 
  Camera, 
  ClipboardList, 
  FileText, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Menu, 
  X,
  Save,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  // Tanpa 'orders' dan 'pesan' di sidebar, tab aktif hanya fokus ke menu utama
  type ActiveTab = 'overview' | 'cms-beranda' | 'cms-profil' | 'wisata' | 'umkm' | 'gallery';
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Administrator BPH');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('admin_name');
    if (name) setAdminName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // --- STATE DATA LOKAL ---
  const [wisataList, setWisataList] = useState([
    { id: 1, title: "Fun Offroad Adventure", category: "Offroad", price: "Rp 1.000.000", status: "Aktif" },
    { id: 2, title: "Fun Offroad Telaga Saat", category: "Offroad", price: "Rp 1.250.000", status: "Aktif" },
    { id: 3, title: "Trekking / Hiking Pegunungan", category: "Trekking", price: "Rp 125.000", status: "Aktif" },
  ]);

  const [umkmList, setUmkmList] = useState([
    { id: 1, title: "Keripik Singkong Pedas Manis", category: "Kuliner", price: "Rp 15.000", stock: "120 Pcs" },
    { id: 2, title: "Teh Hijau Herbal Organik", category: "Minuman & Herbal", price: "Rp 25.000", stock: "85 Pcs" },
  ]);

  const [galleryList, setGalleryList] = useState([
    { id: 1, title: "Kawasan Perkebunan Teh Puncak", category: "Alam & Wisata" },
    { id: 2, title: "Petualangan Fun Offroad Jeep", category: "Petualangan" },
    { id: 3, title: "Aktivitas Outbound Warga", category: "Ekowisata" },
  ]);

  const [ordersList, setOrdersList] = useState([
    { id: "TRX-005", customer: "Andi Pratama", item: "Tiket Masuk (5 Pax)", total: "Rp 125.000", status: "Selesai", date: "1 Jul 2026" },
    { id: "TRX-004", customer: "Siti Aminah", item: "Madu Hutan (2 Botol)", total: "Rp 190.000", status: "Menunggu Konfirmasi", date: "30 Jun 2026" },
    { id: "TRX-003", customer: "Bambang Irawan", item: "Paket Offroad (4 Pax)", total: "Rp 4.000.000", status: "Sedang Diproses", date: "30 Jun 2026" },
    { id: "TRX-002", customer: "Dewi Lestari", item: "Keripik (10 Pcs)", total: "Rp 150.000", status: "Selesai", date: "29 Jun 2026" },
  ]);

  const [messages, setMessages] = useState([
    { id: 3, name: "Joko Widodo", email: "joko@ri.go.id", message: "Tolong tingkatkan fasilitas parkir di area Telaga Saat.", date: "1 Jul 2026" },
    { id: 2, name: "Siti Rahma", email: "siti@yahoo.com", message: "Bagaimana cara mendaftarkan produk keripik agar masuk katalog?", date: "25 Jun 2026" },
    { id: 1, name: "Budi Santoso", email: "budi@gmail.com", message: "Apakah jadwal offroad weekend besok tersedia?", date: "26 Jun 2026" },
  ]);

  const [berandaContent, setBerandaContent] = useState({
    heroTitle: "Desa Wisata Tugu Selatan",
    heroSubtitle: "Pusat pariwisata alam, petualangan offroad, dan produk UMKM unggulan berbasis masyarakat di kawasan Puncak Cisarua.",
    announcement: "Jadwal Pembersihan Jalur Wisata Telaga Saat dilaksanakan setiap Hari Senin."
  });

  const [profilContent, setProfilContent] = useState({
    history: "Desa Tugu Selatan terletak di dataran tinggi kawasan Puncak, Kecamatan Cisarua, Kabupaten Bogor, yang dikenal dengan panorama kebun teh serta titik nol Sungai Ciliwung.",
    vision: "Terwujudnya Desa Wisata Tugu Selatan yang mandiri, berbudaya, dan menjadi destinasi ekowisata terkemuka di Jawa Barat.",
    mission: "1. Mengembangkan potensi alam dan budaya lokal.\n2. Memberdayakan ekonomi warga melalui UMKM.\n3. Meningkatkan layanan mitigasi bencana dan sapta pesona."
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-emerald-50 text-emerald-700';
      case 'Sedang Diproses': return 'bg-sky-50 text-sky-700';
      case 'Menunggu Konfirmasi': return 'bg-amber-50 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Urutan Menu Sidebar Sesuai Permintaan (Tanpa Status Pesanan & Pesan Warga)
  const navItems = [
    { name: 'Overview', tab: 'overview', icon: LayoutDashboard },
    { name: 'Edit Beranda', tab: 'cms-beranda', icon: Edit3 },
    { name: 'Edit Profil', tab: 'cms-profil', icon: FileText },
    { name: 'Kelola Wisata', tab: 'wisata', icon: Compass },
    { name: 'Kelola UMKM', tab: 'umkm', icon: ShoppingBag },
    { name: 'Kelola Galeri Foto', tab: 'gallery', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-emerald-100 shadow-sm shrink-0">
                <img src="/images/logo tugu selatan.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">Admin Panel</h1>
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Tugu Selatan</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => { setActiveTab(item.tab as ActiveTab); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === item.tab ? 'bg-[#0f172a] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={18} /> {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
              <div className='overflow-hidden'>
                <p className="text-xs font-bold text-slate-800 truncate">{adminName}</p>
                <p className="text-[10px] text-slate-500">Pengelola Desa</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition cursor-pointer border border-rose-100">
            <LogOut size={16} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 md:ml-72 p-6 sm:p-10 space-y-8">
        
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'cms-beranda' && 'Edit Konten Beranda'}
                {activeTab === 'cms-profil' && 'Edit Profil Desa'}
                {activeTab === 'wisata' && 'Manajemen Wisata'}
                {activeTab === 'umkm' && 'Manajemen UMKM'}
                {activeTab === 'gallery' && 'Manajemen Galeri'}
              </h2>
              <p className="text-xs text-slate-500 font-light">Pusat kontrol administratif Desa Wisata Tugu Selatan.</p>
            </div>
          </div>
        </div>

        {/* --- 1. OVERVIEW (DENGAN WIDGET STATUS PESANAN & PESAN WARGA DI DALAMNYA) --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Total Wisata</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{wisataList.length} Paket</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Compass size={20} /></div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Produk UMKM</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{umkmList.length} Produk</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><ShoppingBag size={20} /></div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Galeri Foto</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{galleryList.length} Item</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center"><Camera size={20} /></div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Pesan Masuk</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{messages.length} Pesan</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><MessageSquare size={20} /></div>
              </div>
            </div>

            {/* Grid Dua Kolom: Status Pesanan Terbaru & Pesan Warga Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Widget Status Pesanan */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><ClipboardList size={18} className="text-emerald-600"/> Status Pesanan Terbaru</h3>
                  <span className="text-[11px] text-slate-400 font-medium">Real-time update</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {ordersList.slice(0, 3).map(order => (
                    <div key={order.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{order.customer} <span className="font-mono text-[10px] text-slate-400">({order.id})</span></p>
                        <p className="text-slate-500 font-light">{order.item}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget Pesan Warga */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><MessageSquare size={18} className="text-amber-600"/> Pesan & Aspirasi Warga</h3>
                  <span className="text-[11px] text-slate-400 font-medium">Aspirasi terbaru</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {messages.slice(0, 3).map(msg => (
                    <div key={msg.id} className="py-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">{msg.name}</span>
                        <span className="text-[10px] text-slate-400">{msg.date}</span>
                      </div>
                      <p className="text-slate-600 font-light truncate">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- 2. EDIT BERANDA (CMS) --- */}
        {activeTab === 'cms-beranda' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-900">Penyuntingan Konten Utama Beranda</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">Judul Utama Hero (Hero Title)</label>
                <input type="text" value={berandaContent.heroTitle} onChange={e => setBerandaContent({ ...berandaContent, heroTitle: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-600 font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">Subjudul / Deskripsi Singkat</label>
                <textarea rows={3} value={berandaContent.heroSubtitle} onChange={e => setBerandaContent({ ...berandaContent, heroSubtitle: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-600 font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">Teks Pengumuman / Banner</label>
                <input type="text" value={berandaContent.announcement} onChange={e => setBerandaContent({ ...berandaContent, announcement: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-600 font-medium" />
              </div>
              <button onClick={() => showNotification("Konten Beranda berhasil disimpan!")} className="flex items-center gap-2 bg-[#0f172a] hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
                <Save size={16} /> Simpan Perubahan Beranda
              </button>
            </div>
          </div>
        )}

        {/* --- 3. EDIT PROFIL DESA (CMS) --- */}
        {activeTab === 'cms-profil' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-900">Penyuntingan Informasi Profil Desa</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">Sejarah Singkat</label>
                <textarea rows={3} value={profilContent.history} onChange={e => setProfilContent({ ...profilContent, history: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-600 font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">Visi Desa Wisata</label>
                <input type="text" value={profilContent.vision} onChange={e => setProfilContent({ ...profilContent, vision: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-600 font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">Misi Desa Wisata</label>
                <textarea rows={4} value={profilContent.mission} onChange={e => setProfilContent({ ...profilContent, mission: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-600 font-medium" />
              </div>
              <button onClick={() => showNotification("Profil Desa berhasil disimpan!")} className="flex items-center gap-2 bg-[#0f172a] hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
                <Save size={16} /> Simpan Perubahan Profil
              </button>
            </div>
          </div>
        )}

        {/* --- 4. KELOLA WISATA --- */}
        {activeTab === 'wisata' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Daftar Destinasi & Aktivitas Wisata</h3>
              <button onClick={() => { setWisataList([...wisataList, { id: Date.now(), title: "Destinasi Baru", category: "Ekowisata", price: "Rp 75.000", status: "Aktif" }]); showNotification("Wisata ditambahkan!"); }} className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                <Plus size={15} /> Tambah Wisata
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {wisataList.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-500">{item.category} • <span className="text-emerald-600 font-semibold">{item.price}</span></p>
                  </div>
                  <button onClick={() => { setWisataList(wisataList.filter(w => w.id !== item.id)); showNotification("Wisata dihapus."); }} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 5. KELOLA UMKM --- */}
        {activeTab === 'umkm' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Katalog Produk UMKM Warga</h3>
              <button onClick={() => { setUmkmList([...umkmList, { id: Date.now(), title: "Produk Baru", category: "Kuliner", price: "Rp 20.000", stock: "50 Pcs" }]); showNotification("UMKM ditambahkan!"); }} className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                <Plus size={15} /> Tambah Produk
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {umkmList.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-500">{item.category} • Stok: {item.stock} • <span className="text-emerald-600 font-semibold">{item.price}</span></p>
                  </div>
                  <button onClick={() => { setUmkmList(umkmList.filter(u => u.id !== item.id)); showNotification("Produk dihapus."); }} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 6. KELOLA GALERI FOTO --- */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Manajemen Galeri Dokumentasi</h3>
              <button onClick={() => { setGalleryList([...galleryList, { id: Date.now(), title: "Dokumentasi Baru", category: "Aktivitas" }]); showNotification("Foto galeri ditambahkan!"); }} className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                <Plus size={15} /> Tambah Foto
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleryList.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase">{item.category}</span>
                    <p className="font-bold text-slate-900 mt-1">{item.title}</p>
                  </div>
                  <button onClick={() => { setGalleryList(galleryList.filter(g => g.id !== item.id)); showNotification("Foto dihapus."); }} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}