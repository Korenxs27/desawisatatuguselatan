const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://desa-wisata-bojongrangkas.com/wp-json';

// ========================================================
// 1. INTERFACES (Tipe Data ACF & CPT Tugu Selatan)
// ========================================================
export interface ACFFields {
  harga?: string;
  durasi?: string;
  lokasi?: string;
  id_produk_woocommerce?: string | number;
}

export interface WisataCPT {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  acf?: ACFFields;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

export interface UmkmCPT {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  acf?: ACFFields;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

// ========================================================
// 2. FETCH FUNCTIONS (NO-STORE CACHE / ALWAYS FRESH)
// ========================================================

// A. Get Objek Wisata & Petualangan
export async function getWisataList(): Promise<WisataCPT[]> {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/wisata?_embed`, { 
      cache: 'no-store' // Agar perubahan langsung ter-update di halaman user
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching wisata CPT:", error);
    return [];
  }
}

// B. Get Produk UMKM Warga
export async function getUmkmList(): Promise<UmkmCPT[]> {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/umkm?_embed`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching umkm CPT:", error);
    return [];
  }
}

// ========================================================
// 3. MUTATION HELPERS (Create & Delete untuk Admin BPH)
// ========================================================

const getAuthHeaders = () => {
  const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || 'ck_a291eafaf1c0e3dc9b1ce17f08deb2649f995acb';
  const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || 'cs_9c61e3491e0ed34fc00122ac655e729fd6c9d676';
  return {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64'),
  };
};

// A. Tambah Wisata CPT
export async function createWisataCPT(title: string, content: string, acfData: ACFFields) {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/wisata`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: title,
        content: content,
        status: 'publish',
        fields: acfData,
      }),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, message: 'Gagal menambah data wisata CPT' };
  }
}

// B. Tambah UMKM CPT
export async function createUmkmCPT(title: string, content: string, acfData: ACFFields) {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/umkm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: title,
        content: content,
        status: 'publish',
        fields: acfData,
      }),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, message: 'Gagal menambah data UMKM CPT' };
  }
}

// C. Hapus Post CPT (Bisa untuk Wisata atau UMKM dengan mencantumkan postType)
export async function deleteCPTItem(id: number, postType: 'wisata' | 'umkm') {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/${postType}/${id}?force=true`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus item CPT' };
  }
}