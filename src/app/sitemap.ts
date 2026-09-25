import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Domain Frontend Utama Desa Wisata Tugu Selatan
  const baseUrl = 'https://www.desawisatatuguselatan.com';

  // Domain Backend WordPress Tugu Selatan
  const wpBaseUrl = 'https://desawisatatuguselatan.desa-wisata-bojongrangkas.com/wp-json';

  // 1. Halaman Statis Utama Tugu Selatan
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/profil',
    '/wisata',
    '/umkm',
    '/gallery',
    '/mitigasi',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch Data Dinamis dari Backend WordPress Tugu Selatan
  let wisataRoutes: MetadataRoute.Sitemap = [];
  let umkmRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch Data Wisata dari Backend WordPress
    const resWisata = await fetch(`${wpBaseUrl}/wp/v2/wisata?per_page=100`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    });

    if (resWisata.ok) {
      const wisatas = await resWisata.json();
      if (Array.isArray(wisatas)) {
        wisataRoutes = wisatas.map((item: any) => ({
          url: `${baseUrl}/wisata/${item.slug || item.id}`,
          lastModified: new Date(item.modified || Date.now()),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      }
    }

    // Fetch Data UMKM dari Backend WordPress
    const resUmkm = await fetch(`${wpBaseUrl}/wp/v2/umkm?per_page=100`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    });

    if (resUmkm.ok) {
      const umkms = await resUmkm.json();
      if (Array.isArray(umkms)) {
        umkmRoutes = umkms.map((item: any) => ({
          url: `${baseUrl}/umkm/${item.slug || item.id}`,
          lastModified: new Date(item.modified || Date.now()),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      }
    }

  } catch (e) {
    console.error('Error fetching data for Tugu Selatan sitemap:', e);
  }

  return [...staticRoutes, ...wisataRoutes, ...umkmRoutes];
}