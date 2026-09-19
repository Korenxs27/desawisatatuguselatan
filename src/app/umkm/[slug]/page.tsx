import { getProductBySlug, getProducts } from "@/lib/woocommerce";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ShieldCheck, Layers, Scale, Maximize2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import ClientOrderForm from "../ClientOrderForm";

interface WooCommerceImage {
  id: number;
  src: string;
  name: string;
}

interface ProductCategory {
  id: number;
  name: string;
}

interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}

interface ProdukDesa {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  slug: string;
  images: WooCommerceImage[];
  categories: ProductCategory[];
  weight: string;
  dimensions: ProductDimensions;
  stock_status: "instock" | "outofstock" | "onbackorder";
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UMKMDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) return notFound();

  // 1. Cari data berdasarkan exact slug di WooCommerce API
  let product: ProdukDesa | null = await getProductBySlug(slug);

  // 2. Fallback WooCommerce: Cari dari seluruh daftar produk jika exact slug ter-encode beda
  if (!product) {
    const allProducts = await getProducts();
    if (Array.isArray(allProducts) && allProducts.length > 0) {
      const cleanSlug = decodeURIComponent(slug).toLowerCase();
      product = (allProducts.find((p: any) => {
        const pSlug = p.slug?.toLowerCase() || "";
        return pSlug === cleanSlug || pSlug.includes(cleanSlug) || cleanSlug.includes(pSlug);
      }) as ProdukDesa) || null;
    }
  }

  // 3. Fallback WordPress REST API: Mengambil langsung dari Post Type WooCommerce Product (/wp/v2/product)
  if (!product) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://desawisatatuguselatan.vercel.app";
      const resWp = await fetch(`${baseUrl}/api-wp/wp/v2/product?slug=${slug}&_embed`, { cache: 'no-store' }).catch(() => null);
      
      if (resWp && resWp.ok) {
        const wpData = await resWp.json();
        if (Array.isArray(wpData) && wpData.length > 0) {
          const item = wpData[0];
          const imgUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";

          product = {
            id: item.id,
            name: item.title?.rendered || "Produk UMKM",
            price: item.meta?._price || "0",
            regular_price: item.meta?._regular_price || "0",
            sale_price: item.meta?._sale_price || "",
            description: item.content?.rendered || "",
            short_description: item.excerpt?.rendered || "",
            slug: item.slug,
            images: imgUrl ? [{ id: 1, src: imgUrl, name: item.title?.rendered || "" }] : [],
            categories: [{ id: 1, name: "Produk UMKM" }],
            weight: item.meta?._weight || "",
            dimensions: { 
              length: item.meta?._length || "", 
              width: item.meta?._width || "", 
              height: item.meta?._height || "" 
            },
            stock_status: item.meta?._stock_status === "outofstock" ? "outofstock" : "instock"
          };
        }
      }
    } catch (err) {
      console.error("Gagal melakukan fallback fetch WooCommerce Product:", err);
    }
  }

  if (!product) return notFound();

  const isSale = Boolean(product.sale_price && product.regular_price);
  const hasDimensions = Boolean(
    product.dimensions?.length || product.dimensions?.width || product.dimensions?.height
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-800 antialiased pb-20 selection:bg-emerald-100 pt-28 font-sans">
      
      <Script 
        src="https://app.midtrans.com/snap/snap.js" 
        data-client-key="Mid-client-q343rAbCQUljWRLn" 
        strategy="lazyOnload"
      />

      <div className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* KOLOM KIRI: FOTO UTAMA, KATEGORI & DESKRIPSI */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex justify-start">
            <Link 
              href="/umkm"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 bg-white border border-neutral-200 px-4 py-2.5 rounded-full hover:bg-neutral-100 transition shadow-sm"
            >
              <ArrowLeft size={14} /> Kembali ke Katalog UMKM
            </Link>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] border border-white bg-white shadow-sm relative h-[450px] flex items-center justify-center font-bold text-neutral-300">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0].src} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs italic">
                  Tidak ada gambar produk
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((img) => (
                  <div key={img.id} className="relative h-24 overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-sm">
                    <img 
                      src={img.src} 
                      alt={img.name || product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50/60 px-3 py-1 rounded-full border border-emerald-100/50">
              <Layers size={10}/> {product.categories && product.categories.length > 0 ? product.categories[0].name : "Produk UMKM"}
            </span>
            <h1 className="text-4xl font-light font-serif tracking-tight text-neutral-900 pt-1">{product.name}</h1>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[28px] border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.005)]">
            <h2 className="text-lg font-medium tracking-tight text-neutral-900 mb-4">Informasi Produk</h2>
            <div 
              className="text-neutral-500 text-sm leading-relaxed font-light prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "Tidak ada deskripsi rinci." }} 
            />
          </div>
        </div>

        {/* KOLOM KANAN: HARGA & CLIENT ORDER FORM */}
        <div className="lg:col-span-1 lg:sticky lg:top-28">
          <div className="bg-white/70 backdrop-blur-xl border border-neutral-200/60 p-8 rounded-[32px] shadow-xl shadow-neutral-100/30 space-y-6">
            
            <div className="border-b border-neutral-100 pb-4 flex justify-between items-end">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Harga Resmi</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-light tracking-tight text-neutral-900">
                    Rp {product.price ? parseInt(product.price).toLocaleString("id-ID") : "0"}
                  </h3>
                  {isSale && (
                    <span className="text-xs text-neutral-400 line-through font-light">
                      Rp {parseInt(product.regular_price).toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {product.stock_status === "instock" ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-xl text-[10px] font-bold">
                    <CheckCircle size={10}/> READY STOK
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-500 border border-neutral-200 px-3 py-1 rounded-xl text-[10px] font-bold">
                    <AlertCircle size={10}/> HABIS
                  </span>
                )}
              </div>
            </div>

            {(product.weight || hasDimensions) && (
              <div className="space-y-3 bg-neutral-50/60 p-4 rounded-2xl border border-neutral-100/80 text-xs font-light text-neutral-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Spesifikasi Logistik</span>
                {product.weight && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Scale size={13} className="text-neutral-400"/> Berat Barang</span>
                    <span className="font-medium text-neutral-800">{product.weight} kg</span>
                  </div>
                )}
                {hasDimensions && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Maximize2 size={13} className="text-neutral-400"/> Ukuran Paket</span>
                    <span className="font-medium text-neutral-800">
                      {product.dimensions.length || 0}x{product.dimensions.width || 0}x{product.dimensions.height || 0} cm
                    </span>
                  </div>
                )}
              </div>
            )}

            <ClientOrderForm 
              product={{
                id: product.id,
                name: product.name,
                price: parseInt(product.price || "0")
              }}
              stockStatus={product.stock_status}
            />

            <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 text-center border-t border-neutral-100 pt-4 font-light">
              <ShieldCheck size={12} className="text-emerald-500 shrink-0"/> Gateway Otomatis WooCommerce & Midtrans Live
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}