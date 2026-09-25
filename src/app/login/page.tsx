'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction, registerAction, forgotPasswordAction } from './action';
import { ArrowLeft, Lock, Mail, User as UserIcon, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);

    if (isSignUp) {
      const res = await registerAction(formData);
      if (res.success) {
        setMsg({ type: 'success', text: res.message });
        setIsSignUp(false);
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } else {
      const res = await loginAction(formData);
      if (res.success && res.token) {
        const role = res.role || 'user';

        localStorage.clear();

        if (role === 'admin') {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_name', res.name || 'Administrator BPH');
          localStorage.setItem('user_role', 'admin');
        } else {
          localStorage.setItem('user_token', res.token);
          localStorage.setItem('user_name', res.name || 'Pengunjung');
          localStorage.setItem('user_role', role);
          localStorage.setItem('user_email', res.email || '');
        }

        setMsg({ type: 'success', text: 'Login berhasil! Mengalihkan ke portal...' });
        
        setTimeout(() => {
          window.location.href = res.redirectTo || (role === 'admin' ? '/admin' : '/user/dashboard');
        }, 600);

      } else {
        setMsg({ type: 'error', text: res.message || 'Terjadi kesalahan pada sistem.' });
      }
    }

    setLoading(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await forgotPasswordAction(formData);

    if (res.success) {
      setMsg({ type: 'success', text: res.message });
    } else {
      setMsg({ type: 'error', text: res.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-sky-50/40 to-indigo-50/30 overflow-y-auto font-sans antialiased">
      
      {/* Background Soft Light Glows (Konsisten dengan Admin & Navbar) */}
      <div className="fixed top-10 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-sky-300/20 rounded-full blur-[120px] pointer-events-none animate-pulse z-0" />
      <div className="fixed bottom-10 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Tombol Kembali ke Beranda */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 text-slate-700 hover:text-sky-600 hover:bg-sky-50/80 transition text-xs font-bold shadow-sm cursor-pointer"
        >
          <ArrowLeft size={15} /> Beranda
        </Link>
      </div>

      {/* Card Container (Tema Glassmorphism Tugu Selatan) */}
      <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-2xl border border-slate-200/90 rounded-[2.5rem] shadow-2xl shadow-sky-950/5 p-6 sm:p-8 text-slate-800 my-auto">
        
        {/* Header & Logo Desa */}
        <div className="text-center mb-5 sm:mb-6 space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-600/25 mx-auto flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-white">
              <img 
                src="/images/logo tugu selatan.jpg" 
                alt="Logo Tugu Selatan" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Toggle Tab Sign In / Sign Up */}
          {!isForgotPassword && (
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-3 sm:mb-4 border border-slate-200/80 mt-4">
              <button
                type="button"
                className={`flex-1 py-2 sm:py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 cursor-pointer ${
                  !isSignUp 
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => { setIsSignUp(false); setMsg(null); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 py-2 sm:py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 cursor-pointer ${
                  isSignUp 
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => { setIsSignUp(true); setMsg(null); }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Heading Deskripsi */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Buat Akun Baru' : 'Portal Pengelola'}
          </h2>
          <p className="text-xs text-slate-500 font-normal leading-relaxed px-2">
            {isForgotPassword 
              ? 'Masukkan email terdaftar untuk menerima tautan pemulihan akun' 
              : isSignUp 
              ? 'Daftar akun untuk mengakses layanan Desa Wisata Tugu Selatan' 
              : 'Masuk ke portal resmi Desa Wisata Tugu Selatan'}
          </p>
        </div>

        {/* Alert Notification */}
        {msg && (
          <div className={`p-3.5 rounded-2xl text-xs mb-4 border font-bold flex items-center gap-2 ${
            msg.type === 'error' 
              ? 'bg-rose-50 text-rose-600 border-rose-200/80' 
              : 'bg-sky-50 text-sky-700 border-sky-200/80'
          }`}>
            <Sparkles size={16} className="shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Form Lupa Password vs Form Utama */}
        {isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Email Terdaftar
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-sky-600/25 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}
            </button>

            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setMsg(null); }}
              className="w-full text-center text-xs text-slate-500 hover:text-sky-600 font-bold mt-3 transition cursor-pointer"
            >
              &larr; Kembali ke halaman Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            
            {/* Input Username / Email */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                {isSignUp ? 'Username' : 'Username / Email'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={16} />
                </span>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder={isSignUp ? 'Username baru' : 'Masukkan username atau email'}
                  className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* Input Email (Khusus Registrasi) */}
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Input Password */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-sky-600 transition cursor-pointer"
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Tombol Lupa Password */}
            {!isSignUp && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setMsg(null); }}
                  className="text-xs text-sky-600 hover:text-indigo-600 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <KeyRound size={12} /> Lupa password?
                </button>
              </div>
            )}

            {/* Tombol Submit Utama */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-sky-600/25 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Memproses...' : isSignUp ? 'Daftar Akun Baru' : 'Sign In'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}