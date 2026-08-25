import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.banksinarmas.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // untuk unsplash jika dipakai juga
      },
      {
        protocol: 'https',
        hostname: 'www.goersapp.com', 
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'smexpo.pertamina.com',
      }
    ],
  },
};

export default nextConfig;
