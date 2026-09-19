import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "desawisatatuguselatan.desa-wisata-bojongrangkas.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api-wp/:path*",
        destination: "https://desawisatatuguselatan.desa-wisata-bojongrangkas.com/wp-json/:path*",
      },
    ];
  },
};

export default nextConfig;