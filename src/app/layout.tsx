"use client";

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
  const isAdminPage = pathname?.startsWith("/admin");

  // Halaman khusus yang tidak butuh Navbar & Footer publik
  const hideLayout = isLoginPage || isAdminPage;

  return (
    <html lang="id">
      <head>
        {/* Tag Verifikasi Google Search Console Tugu Selatan */}
        <meta
          name="google-site-verification"
          content="bmDxc68tvrBCQeNJec0i52yHODWz1-uXAM7B98t5qeQ"
        />
      </head>
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