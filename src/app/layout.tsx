"use client"; // Wajib agar bisa mendeteksi URL path aktif

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Cek apakah user sedang berada di halaman login atau admin
  const isLoginPage = pathname === "/login";
  const isAdminPage = pathname?.startsWith("/admin"); // Mencakup /admin dan sub-halamannya jika ada

  // Halaman khusus yang tidak butuh Navbar & Footer publik
  const hideLayout = isLoginPage || isAdminPage;

  return (
    <html lang="id">
      <body>
        {/* Navbar hanya dirender jika BUKAN di halaman login atau admin */}
        {!hideLayout && <Navbar />}

        {/* Konten Utama */}
        <main style={{ paddingTop: hideLayout ? '0px' : '100px' }}>
          {children}
        </main>

        {/* Footer hanya dirender jika BUKAN di halaman login atau admin */}
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}