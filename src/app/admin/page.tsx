'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Compass, 
  ShoppingBag, 
  Camera, 
  MessageSquare, 
  FileText, 
  LogOut, 
  ExternalLink,
  RefreshCw,
  CreditCard,
  CheckCircle,
  Clock,
  Eye,
  X,
  Menu,
  CheckCheck,
  Search,
  ChevronDown,
  ChevronUp,
  Edit3,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  Tag,
  MapPin
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [adminName, setAdminName] = useState("Administrator BPH");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // State Modal Detail Booking / Order
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // State Filter & Pagination
  const [messageSearch, setMessageSearch] = useState("");
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  
  // State Statistik & Data WordPress
  const [stats, setStats] = useState({
    totalGallery: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Jalur proxy Next.js ke REST API WordPress
  const wpUrl = "/api-wp/tugu-bridge/v1";

  useEffect(() => {
    const name = localStorage.getItem("admin_name");
    if (name) setAdminName(name);
    fetchAllAdminData();
  }, []);

  // Fetch Data Komprehensif dari REST API WordPress Plugin
  const fetchAllAdminData = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      // 1. Fetch Orders
      const resOrders = await fetch(`${wpUrl}/get-orders`, { cache: "no-store" });
      const dataOrders = await resOrders.json();
      let ordersData: any[] = [];
      let realRevenue = 0;
      
      if (dataOrders.success && Array.isArray(dataOrders.orders)) {
        ordersData = dataOrders.orders;
        realRevenue = ordersData
          .filter((o: any) => o.status === 'completed' || o.status === 'processing' || o.status === 'paid')
          .reduce((sum: number, o: any) => sum + Number(o.total || o.total_price || 0), 0);
      }

      // 2. Fetch Messages / Aspirasi
      const resMsg = await fetch(`${wpUrl}/get-messages`, { cache: "no-store" });
      const dataMsg = await resMsg.json();
      let messagesData = dataMsg.success && Array.isArray(dataMsg.messages) ? dataMsg.messages : [];

      // 3. Fetch Gallery
      const resGallery = await fetch(`${wpUrl}/gallery-items`, { cache: "no-store" });
      const dataGallery = await resGallery.json();
      let galleryData = dataGallery.success && Array.isArray(dataGallery.gallery) ? dataGallery.gallery : [];

      setOrders(ordersData);
      setMessages(messagesData);

      setStats({
        totalGallery: galleryData.length,
        totalOrders: ordersData.length,
        revenue: realRevenue,
      });

    } catch (err) {
      console.error("Gagal sinkronisasi data dari WordPress:", err);
      toast.error("Gagal terhubung ke server WordPress Tugu Selatan.");
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  // Handler Konfirmasi Pesanan WooCommerce / Custom CPT (Paid)
  const handleMarkAsPaid = async (orderId: number) => {
    setUpdatingStatus(true);
    const loadingToast = toast.loading("Memperbarui status pembayaran ke server...", {
      style: { borderRadius: '16px', background: '#334155', color: '#fff', fontSize: '12px' }
    });

    try {
      const res = await fetch(`${wpUrl}/update-order-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status: "processing" })
      });
      
      const data = await res.json();
      toast.dismiss(loadingToast);

      if (res.ok && data.success) {
        toast.success(`Pesanan #${orderId} berhasil dikonfirmasi Lunas!`, {
          style: { borderRadius: '16px', background: '#065f46', color: '#fff', fontSize: '12px' },
          iconTheme: { primary: '#34d399', secondary: '#065f46' }
        });
        setSelectedOrder(null);
        fetchAllAdminData();
      } else {
        toast.error(`Gagal memperbarui status pesanan.`, { style: { borderRadius: '16px', fontSize: '12px' } });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan jaringan.", { style: { borderRadius: '16px', fontSize: '12px' } });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const filteredMessages = messages.filter((msg) => {
    const query = messageSearch.toLowerCase();
    return msg.nama?.toLowerCase().includes(query) || msg.pesan?.toLowerCase().includes(query);
  });

  const displayedMessages = showAllMessages ? filteredMessages : filteredMessages.slice(0, 5);
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 5);

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard, active: true },
    { name: 'Edit Beranda', href: '/admin/beranda', icon: Edit3, active: false },
    { name: 'Edit Profil Desa', href: '/admin/profil', icon: FileText, active: false },
    { name: 'Kelola Wisata', href: '/admin/wisata', icon: Compass, active: false },
    { name: 'Kelola UMKM', href: '/admin/umkm', icon: ShoppingBag, active: false },
    { name: 'Kelola Galeri Foto', href: '/admin/gallery', icon: Camera, active: false },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col md:flex-row text-slate-800 font-sans relative ${isMobileSidebarOpen ? 'overflow-hidden h-screen' : ''}`}>
      
      <Toaster position="top-right" reverseOrder={false} />

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 bg-white/85 backdrop-blur-xl border-r border-slate-200/85 flex-col justify-between p-5 fixed h-full z-40 shadow-sm">
        <div>
          <div className="pb-6 mb-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-emerald-500/20">
              TS
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm leading-tight">Admin BPH</h2>
              <p className="text-[11px] text-emerald-600 font-medium">Tugu Selatan</p>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition ${item.active ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
                >
                  <Icon size={16} /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-800 truncate">{adminName}</p>
            <p className="text-[10px] text-emerald-600">WP Connected</p>
          </div>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-semibold transition cursor-pointer"
          >
            <LogOut size={15} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* SIDEBAR MOBILE DRAWER */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <div className="w-72 bg-white fixed inset-y-0 left-0 z-50 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    TS
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm leading-tight">Admin BPH</h2>
                    <p className="text-[11px] text-emerald-600 font-medium">Tugu Selatan</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition">
                  <X size={16} />
                </button>
              </div>

              <nav className="space-y-1.5 text-xs font-semibold">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition ${item.active ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-emerald-50'}`}
                    >
                      <Icon size={16} /> {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleAdminLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-semibold transition"
              >
                <LogOut size={15} /> Keluar (Logout)
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 space-y-6 md:space-y-8 w-full">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">Halo, {adminName}</h1>
              <p className="text-xs text-slate-500 mt-0.5">Pusat kendali pariwisata Desa Wisata Tugu Selatan.</p>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={fetchAllAdminData} 
              className="p-2.5 sm:p-3 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm transition flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin text-emerald-600" : ""} />
              <span className="hidden sm:inline">Sinkronisasi</span>
            </button>
            <a 
              href="https://script.google.com/macros/s/AKfycbyagd9YKHOB9xZ42f3ZgxOLfVMkEYGz06GoQhBqi-ZWp6yQUbIhpElxwevvJ4LJYSCN/exec" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 bg-emerald-700 text-white text-xs font-semibold px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl hover:bg-emerald-800 shadow-md transition"
            >
              Google Sheets <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CreditCard size={18} /></div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">Rp {stats.revenue.toLocaleString("id-ID")}</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pesanan</span>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShoppingBag size={18} /></div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{loading ? "..." : stats.totalOrders} Transaksi</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Galeri Foto</span>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Camera size={18} /></div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{loading ? "..." : stats.totalGallery} Media</div>
          </div>
        </div>

        {/* TABEL PESANAN TERBARU */}
        <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Daftar Pesanan & Status Pembayaran</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Transaksi paket wisata dan produk UMKM terbaru.</p>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
              Total: {orders.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap sm:whitespace-normal">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">ID Order</th>
                  <th className="pb-3 font-bold">Pemesan</th>
                  <th className="pb-3 font-bold">Total Harga</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400 italic">Belum ada pesanan masuk.</td></tr>
                ) : (
                  displayedOrders.map((order, index) => {
                    const orderId = order.id || order.order_id;
                    const name = order.customer_name || order.first_name || order.billing?.first_name || order.nama_pemesan || "Pelanggan";
                    const price = Number(order.total || order.total_price || 0);
                    const isPaid = order.status === "completed" || order.status === "processing" || order.status === "paid";

                    return (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="py-4 font-bold text-slate-900">#{orderId}</td>
                        <td className="py-4 font-semibold text-slate-700">{name}</td>
                        <td className="py-4 font-bold text-slate-900">Rp {price.toLocaleString("id-ID")}</td>
                        <td className="py-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">
                              <CheckCircle size={12} /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-bold text-[10px]">
                              <Clock size={12} /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-xl transition cursor-pointer">
                            <Eye size={13} /> Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {orders.length > 5 && (
            <div className="pt-4 text-center border-t border-slate-100 mt-4">
              <button
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold transition cursor-pointer"
              >
                {showAllOrders ? <>Sembunyikan <ChevronUp size={14} /></> : <>Lihat Semua Pesanan ({orders.length - 5} lainnya) <ChevronDown size={14} /></>}
              </button>
            </div>
          )}
        </div>

        {/* KOTAK MASUK PESAN */}
        <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/60 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl"><MessageSquare size={18} /></div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Kotak Pesan & Aspirasi</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Pesan dari pengunjung.</p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={14} />
              </span>
              <input 
                type="text"
                placeholder="Cari pesan..."
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap sm:whitespace-normal">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Pengirim</th>
                  <th className="pb-3 font-bold">Pesan</th>
                  <th className="pb-3 font-bold">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedMessages.length === 0 ? (
                  <tr><td colSpan={3} className="py-8 text-center text-slate-400 italic">Belum ada pesan masuk.</td></tr>
                ) : (
                  displayedMessages.map((msg, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition">
                      <td className="py-4 font-bold text-slate-900">{msg.nama}</td>
                      <td className="py-4 text-slate-700 font-medium">{msg.pesan}</td>
                      <td className="py-4 text-slate-400 text-[11px]">{msg.tanggal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredMessages.length > 5 && (
            <div className="pt-4 text-center border-t border-slate-100 mt-2">
              <button
                onClick={() => setShowAllMessages(!showAllMessages)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold transition cursor-pointer"
              >
                {showAllMessages ? <>Sembunyikan <ChevronUp size={14} /></> : <>Lihat Semua Pesan ({filteredMessages.length - 5} lainnya) <ChevronDown size={14} /></>}
              </button>
            </div>
          )}
        </div>

      </main>

      {/* MODAL POP-UP DETAIL ORDER LENGKAP DENGAN DETEKSI UMKM / WISATA */}
      {selectedOrder && (() => {
        const orderId = selectedOrder.id || selectedOrder.order_id || "-";
        
        const customerName = 
          selectedOrder.customer_name || 
          selectedOrder.first_name || 
          selectedOrder.billing?.first_name || 
          selectedOrder.nama_pemesan || 
          "-";

        const customerPhone = 
          selectedOrder.customer_phone || 
          selectedOrder.phone || 
          selectedOrder.billing?.phone || 
          selectedOrder.no_hp || 
          selectedOrder.whatsapp || 
          selectedOrder.meta?.customer_phone || 
          selectedOrder.meta?.phone || 
          "-";

        const customerEmail = 
          selectedOrder.customer_email || 
          selectedOrder.email || 
          selectedOrder.billing?.email || 
          "-";

        const category = selectedOrder.jenis_pesanan || selectedOrder.kategori || "Paket Wisata Tugu Selatan";
        const productName = selectedOrder.product_name || selectedOrder.nama_paket || selectedOrder.item_name || "Produk Desa";
        const quantity = Number(selectedOrder.quantity || selectedOrder.jumlah_peserta || 1);
        const totalPrice = Number(selectedOrder.total || selectedOrder.total_price || 0);
        const paymentMethod = selectedOrder.payment_name || selectedOrder.payment_method_title || "Transfer Bank / QRIS";

        // Deteksi apakah jenis pesanan adalah Produk UMKM
        const isUmkm = category.toLowerCase().includes("umkm") || category.toLowerCase().includes("produk");

        // Ambil Alamat Pengiriman (jika UMKM)
        const customerAddress = 
          selectedOrder.customer_address || 
          selectedOrder.address || 
          selectedOrder.billing?.address_1 || 
          selectedOrder.meta?.customer_address || 
          selectedOrder.meta?.address || 
          "-";

        // Ambil Jadwal Kunjungan (jika Paket Wisata)
        const visitDate = 
          selectedOrder.tgl_kunjungan || 
          selectedOrder.tanggal_kunjungan || 
          selectedOrder.visit_date || 
          selectedOrder.meta?.tgl_kunjungan || 
          selectedOrder.meta?.tanggal_kunjungan || 
          selectedOrder.billing?.tgl_kunjungan || 
          "-";

        const buktiUrl = 
          selectedOrder.bukti_url || 
          selectedOrder.bukti_transfer || 
          selectedOrder.meta?.bukti_url || 
          selectedOrder.meta?.bukti_transfer || 
          selectedOrder.billing?.bukti_transfer || 
          null;

        const isPaid = selectedOrder.status === 'paid' || selectedOrder.status === 'completed' || selectedOrder.status === 'processing';

        return (
          <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 relative my-auto max-h-[92vh] overflow-y-auto font-sans text-slate-800">
              
              {/* Header Modal */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                      {isUmkm ? "Detail Rincian Pesanan UMKM" : "Detail Rincian Booking"}
                    </span>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                      isPaid ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isPaid ? 'LUNAS (PAID)' : 'MENUNGGU VERIFIKASI'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">ORDER #{orderId}</h3>
                </div>

                <button onClick={() => setSelectedOrder(null)} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Content Rincian Modal */}
              <div className="space-y-3 text-xs">
                
                {/* Detail Kategori & Nama Produk / Paket */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Tag size={13} className="text-emerald-600" /> Kategori</span>
                    <span className="text-slate-800 font-extrabold">{category}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {isUmkm ? "NAMA PRODUK" : "NAMA PAKET WISATA"}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{productName}</h3>
                  </div>
                </div>

                {/* Grid Informasi Pemesan (Disesuaikan Otomatis Antara UMKM vs Wisata) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User size={12} className="text-emerald-600" /> Nama Pemesan
                    </span>
                    <p className="text-xs font-bold text-slate-800">{customerName}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Phone size={12} className="text-emerald-600" /> No. HP / WhatsApp
                    </span>
                    <p className="text-xs font-bold text-slate-800">{customerPhone}</p>
                  </div>

                  {/* KONDISIONAL: ALAMAT PENGIRIMAN (UMKM) VS JADWAL KUNJUNGAN (WISATA) */}
                  {isUmkm ? (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={12} className="text-emerald-600" /> Alamat Pengiriman
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{customerAddress}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} className="text-emerald-600" /> Jadwal Kunjungan
                      </span>
                      <p className="text-xs font-extrabold text-emerald-700">{visitDate}</p>
                    </div>
                  )}

                  {/* KONDISIONAL: JUMLAH PESANAN (UMKM) VS JUMLAH PESERTA (WISATA) */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Users size={12} className="text-emerald-600" /> {isUmkm ? "Jumlah Pesanan" : "Jumlah Peserta"}
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      {quantity} {isUmkm ? "Pcs / Unit" : "Orang"}
                    </p>
                  </div>
                </div>

                {/* Email & Metode Pembayaran */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Mail size={12} className="text-emerald-600" /> Email Pemesan
                    </span>
                    <p className="text-xs font-medium text-slate-700 truncate">{customerEmail}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <CreditCard size={12} className="text-emerald-600" /> Metode Bayar
                    </span>
                    <p className="text-xs font-bold text-slate-800">{paymentMethod}</p>
                  </div>
                </div>

                {/* Struk / Link Bukti Transfer */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText size={12} className="text-emerald-600" /> Link Bukti Transfer
                  </span>
                  {buktiUrl ? (
                    <div className="space-y-2">
                      <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-slate-200 bg-white p-1">
                        <img 
                          src={buktiUrl} 
                          alt="Bukti Transfer" 
                          className="w-full h-full object-contain rounded-lg max-h-44 mx-auto"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <a href={buktiUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 transition w-full">
                        Buka Bukti Transfer Penuh <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Bukti transfer belum diunggah.</p>
                  )}
                </div>

                {/* Total Tagihan */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 flex justify-between items-center mt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Pembayaran</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Rp {Math.round(totalPrice / (quantity || 1)).toLocaleString("id-ID")} x {quantity} {isUmkm ? "Pcs" : "Orang"}
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-700">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Tombol Konfirmasi Pembayaran */}
                {!isPaid && (
                  <button 
                    onClick={() => handleMarkAsPaid(Number(orderId))}
                    disabled={updatingStatus}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 shadow-lg"
                  >
                    <CheckCheck size={16} /> Konfirmasi Pembayaran (Ubah Jadi Paid)
                  </button>
                )}

              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}