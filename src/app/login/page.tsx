'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction, registerAction, forgotPasswordAction } from './action';
import { ArrowLeft, Lock, Mail, User as UserIcon, Eye, EyeOff } from 'lucide-react';

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
          localStorage.setItem('admin_name', res.name || 'Administrator');
          localStorage.setItem('user_role', 'admin');
        } else {
          localStorage.setItem('user_token', res.token);
          localStorage.setItem('user_name', res.name || 'Pengunjung');
          localStorage.setItem('user_role', role);
          localStorage.setItem('user_email', res.email || '');
        }

        setMsg({ type: 'success', text: 'Login berhasil! Mengalihkan...' });
        
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
    <div className="min-h-screen w-screen fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 overflow-y-auto font-sans">
      
      {/* Background Soft Clean Glows */}
      <div className="absolute top-10 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-emerald-400/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-teal-400/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Tombol Kembali ke Beranda */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-25">
        <Link 
          href="/" 
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 text-slate-700 hover:text-emerald-700 hover:bg-white transition text-[11px] sm:text-xs font-bold shadow-sm"
        >
          <ArrowLeft size={14} /> Beranda
        </Link>
      </div>

      {/* Card Container (Clean Light Style) */}
      <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-2xl border border-white/90 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-6 sm:p-8 text-slate-800 my-auto">
        
        {/* Logo Desa / Brand di Bagian Atas Card */}
        <div className="text-center mb-5 sm:mb-6 space-y-2.5 sm:space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center bg-white border border-emerald-200 shadow-md mx-auto">
            <img 
              src="/images/logo tugu selatan.jpg" 
              alt="Logo Tugu Selatan" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Toggle Tab */}
          {!isForgotPassword && (
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-3 sm:mb-4 border border-slate-200/60 mt-3 sm:mt-4">
              <button
                type="button"
                className={`flex-1 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${!isSignUp ? 'bg-[#0f172a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => { setIsSignUp(false); setMsg(null); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${isSignUp ? 'bg-[#0f172a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => { setIsSignUp(true); setMsg(null); }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Buat Akun Baru' : 'Portal Pengelola'}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-light leading-relaxed px-2">
            {isForgotPassword 
              ? 'Masukkan email terdaftar untuk pemulihan akun' 
              : isSignUp 
              ? 'Daftar untuk akses eksklusif Desa Wisata Tugu Selatan' 
              : 'Masuk ke panel akun resmi Desa Wisata Tugu Selatan'}
          </p>
        </div>

        {/* Alert Notification */}
        {msg && (
          <div className={`p-3 rounded-xl text-xs mb-4 border font-medium ${msg.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
            {msg.text}
          </div>
        )}

        {/* Form Lupa Password vs Form Utama */}
        {isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Terdaftar</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0f172a] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}
            </button>

            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setMsg(null); }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium mt-3 transition cursor-pointer"
            >
              &larr; Kembali ke halaman Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            
            {/* Input Username / Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {isSignUp ? 'Username' : 'Username / Email'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={15} />
                </span>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder={isSignUp ? 'Username' : 'Masukkan username atau email'}
                  className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-inner"
                />
              </div>
            </div>

            {/* Input Email (Hanya Sign Up) */}
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Input Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={15} />
                </span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold transition cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#0f172a] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Memproses...' : isSignUp ? 'Daftar Akun Baru' : 'Sign In'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}