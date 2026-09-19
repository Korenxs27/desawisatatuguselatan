'use server';

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://desawisatatuguselatan.desa-wisata-bojongrangkas.com';

// KREDENSIAL KHUSUS ADMINISTRATOR
const ADMIN_EMAIL = 'admindesawisatatuguselatan@gmail.com';
const ADMIN_USERNAME = 'admindesawisatatuguselatan';
const ADMIN_PASS = 'Desawisatatuguselatan2026';

export async function loginAction(formData: FormData) {
  const usernameInput = (formData.get('username') as string || '').trim().toLowerCase();
  const passwordInput = (formData.get('password') as string || '').trim();

  if (!usernameInput || !passwordInput) {
    return { success: false, message: 'Username/Email dan Password wajib diisi.' };
  }

  // Cek Otentikasi Khusus Administrator Utama (Menggunakan Email, Username 'admin', atau 'admindesawisatatuguselatan')
  if (
    (usernameInput === ADMIN_EMAIL || usernameInput === ADMIN_USERNAME || usernameInput === 'admin') && 
    passwordInput === ADMIN_PASS
  ) {
    return {
      success: true,
      token: 'admin-secret-token-' + Date.now(),
      name: 'Administrator Tugu Selatan',
      email: ADMIN_EMAIL,
      role: 'admin',
      redirectTo: '/admin'
    };
  }

  try {
    // Attempt login via WordPress JWT API untuk User/Pengunjung biasa
    const res = await fetch(`${WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message ? data.message.replace(/<[^>]*>?/gm, '') : 'Username atau password salah.' 
      };
    }

    const userRoleArr = data.user_role || [];
    const isAdmin = userRoleArr.includes('administrator') || userRoleArr.includes('admin') || data.user_email === ADMIN_EMAIL;

    return {
      success: true,
      token: data.token,
      name: data.user_display_name || data.user_nicename || usernameInput,
      email: data.user_email || usernameInput,
      role: isAdmin ? 'admin' : 'customer',
      redirectTo: isAdmin ? '/admin' : '/'
    };

  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, message: 'Gagal terhubung ke server. Silakan coba lagi.' };
  }
}

export async function registerAction(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!username || !email || !password) {
    return { success: false, message: 'Semua kolom wajib diisi.' };
  }

  // Mencegah pendaftaran menggunakan email atau username admin
  if (
    email.trim().toLowerCase() === ADMIN_EMAIL || 
    username.trim().toLowerCase() === ADMIN_USERNAME
  ) {
    return { success: false, message: 'Email/Username ini dicadangkan khusus untuk Akses Pengelola/Admin.' };
  }

  try {
    const res = await fetch(`${WP_BASE_URL}/wp-json/tugu-bridge/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { 
        success: false, 
        message: data.message || 'Pendaftaran gagal. Username atau Email mungkin sudah digunakan.' 
      };
    }

    return { 
      success: true, 
      message: 'Pendaftaran berhasil! Silakan Sign In dengan akun baru Anda.' 
    };

  } catch (error) {
    console.error('Register Error:', error);
    return { success: false, message: 'Terjadi kesalahan koneksi saat mendaftar.' };
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, message: 'Email wajib diisi.' };
  }

  try {
    const res = await fetch(`${WP_BASE_URL}/wp-json/bdpwr/v1/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || 'Email tidak ditemukan di sistem kami.' 
      };
    }

    return { 
      success: true, 
      message: 'Tautan pemulihan password telah dikirimkan ke email Anda.' 
    };

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return { success: false, message: 'Gagal mengirim instruksi reset password.' };
  }
}