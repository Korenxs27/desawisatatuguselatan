// src/lib/woocommerce.ts

const WP_DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://desawisatatuguselatan.desa-wisata-bojongrangkas.com";
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || "";

// Helper untuk fetch ke REST API WooCommerce secara aman
async function fetchWooCommerce(endpoint: string, params: Record<string, string> = {}) {
  try {
    const queryParams = new URLSearchParams({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      ...params,
    });

    // Coba endpoint standard REST API WooCommerce
    let url = `${WP_DOMAIN}/wp-json/wc/v3/${endpoint}?${queryParams.toString()}`;
    let res = await fetch(url, { cache: "no-store" });

    // Jika Permalink WP masih Plain (muncul 404), fallback ke query param index
    if (!res.ok && res.status === 404) {
      url = `${WP_DOMAIN}/index.php?rest_route=/wc/v3/${endpoint}&${queryParams.toString()}`;
      res = await fetch(url, { cache: "no-store" });
    }

    if (!res.ok) {
      console.error(`WooCommerce API Error [${res.status}]:`, await res.text());
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Gagal terhubung ke WooCommerce REST API:", error);
    return null;
  }
}

// HELPER FUNCTIONS
export async function getProducts() {
  const data = await fetchWooCommerce("products", { per_page: "50" });
  return Array.isArray(data) ? data : [];
}

export async function getProductBySlug(slug: string) {
  if (!slug) return null;
  const data = await fetchWooCommerce("products", { slug });
  
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  return null;
}

export async function createProduct(data: { name: string; regular_price: string; description: string }) {
  try {
    const url = `${WP_DOMAIN}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, message: "Gagal menambah produk ke WooCommerce" };
  }
}

export async function deleteProduct(id: number) {
  try {
    const url = `${WP_DOMAIN}/wp-json/wc/v3/products/${id}?force=true&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    const res = await fetch(url, { method: "DELETE" });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, message: "Gagal menghapus produk" };
  }
}