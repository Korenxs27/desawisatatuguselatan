'use server';

// 1. ACTION FOR SIGN IN (LOKAL)
export async function loginAction(formData: FormData) {
  const usernameOrEmail = (formData.get('username') as string || '').trim();
  const password = (formData.get('password') as string || '').trim();

  if (!usernameOrEmail || !password) {
    return { success: false, message: 'Username/Email dan password wajib diisi!' };
  }

  // Cek Akun Admin Khusus dengan Password Baru
  const isAdminAccount = 
    (usernameOrEmail === 'admin' || 
     usernameOrEmail === 'admin@desatuguselatan.id' || 
     usernameOrEmail === 'admindesa') && 
    password === 'desatuguselatan2026';

  if (isAdminAccount) {
    return {
      success: true,
      token: 'admin-token-' + Date.now(),
      email: 'admin@desatuguselatan.id',
      name: 'Administrator BPH',
      role: 'admin',
      redirectTo: '/admin',
    };
  }

  // Jika password salah untuk akun admin, berikan peringatan
  if (usernameOrEmail === 'admin' || usernameOrEmail === 'admin@desatuguselatan.id') {
    return { success: false, message: 'Password admin salah!' };
  }

  // Simulasi Login User Biasa (Untuk akun non-admin lainnya)
  return {
    success: true,
    token: 'user-token-' + Date.now(),
    email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@user.com`,
    name: usernameOrEmail,
    role: 'subscriber',
    redirectTo: '/user/dashboard',
  };
}

// 2. ACTION FOR SIGN UP (LOKAL)
export async function registerAction(formData: FormData) {
  const username = (formData.get('username') as string || '').trim();
  const email = (formData.get('email') as string || '').trim();
  const password = (formData.get('password') as string || '').trim();

  if (!username || !email || !password) {
    return { success: false, message: 'Semua kolom pendaftaran wajib diisi!' };
  }

  return { 
    success: true, 
    message: 'Registrasi berhasil! Silakan Sign In dengan akun baru Anda.' 
  };
}

// 3. ACTION FOR FORGOT PASSWORD (LOKAL)
export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get('email') as string || '').trim();

  if (!email) {
    return { success: false, message: 'Silakan masukkan email akun kamu terlebih dahulu!' };
  }

  return { 
    success: true, 
    message: 'Instruksi pemulihan password telah dikirim ke email Anda (Simulasi).' 
  };
}