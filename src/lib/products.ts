import jacket from "@/assets/p-jacket.jpg";
import tshirt from "@/assets/p-tshirt.jpg";
import sweater from "@/assets/p-sweater.jpg";
import denim from "@/assets/p-denim.jpg";
import coat from "@/assets/p-coat.jpg";
import bag from "@/assets/p-bag.jpg";
import sneakers from "@/assets/p-sneakers.jpg";

export const BRAND = { name: "YSP", tagline: "Your Shopping Place" };

export type Category = "Pria" | "Wanita" | "Outerwear" | "Aksesoris" | "Sepatu" | "Tas";
export type Slot = "atasan" | "bawahan" | "outerwear" | "aksesoris";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  categories: Category[];
  gender: "Pria" | "Wanita" | "Unisex";
  colors: { name: string; hex: string }[];
  sizes: string[];
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  slot: Slot;
  description: string;
  material: string;
}

const C = {
  black: { name: "Hitam", hex: "#242421" },
  ivory: { name: "Ivory", hex: "#F0EBE0" },
  sand: { name: "Sand", hex: "#D7C8B2" },
  camel: { name: "Camel", hex: "#B08960" },
  denim: { name: "Denim", hex: "#4A6A93" },
  white: { name: "Putih", hex: "#FFFFFF" },
  olive: { name: "Olive", hex: "#6B6A4B" },
};

export const products: Product[] = [
  { id: "oversized-jacket", name: "Oversized Jacket", price: 459000, oldPrice: 699000, image: jacket, categories: ["Pria", "Outerwear"], gender: "Pria", colors: [C.black, C.olive], sizes: ["S", "M", "L", "XL"], rating: 4.8, reviews: 120, stock: 14, isNew: true, slot: "outerwear", description: "Jaket oversized dengan siluet tegas dan kerah tinggi. Dibuat dari nylon-twill ringan yang tahan angin, cocok untuk aktivitas kota sehari-hari.", material: "100% Nylon twill, lapisan polyester" },
  { id: "basic-tshirt", name: "Basic T-Shirt", price: 199000, image: tshirt, categories: ["Pria"], gender: "Unisex", colors: [C.white, C.black, C.sand], sizes: ["S", "M", "L", "XL"], rating: 4.7, reviews: 342, stock: 60, slot: "atasan", description: "Kaos esensial dengan katun combed 24s yang lembut dan jatuh rapi. Potongan regular fit untuk dipakai sendiri atau sebagai layering.", material: "100% Katun combed 24s" },
  { id: "knit-sweater", name: "Knit Sweater", price: 390000, image: sweater, categories: ["Wanita"], gender: "Wanita", colors: [C.sand, C.ivory], sizes: ["XS", "S", "M", "L"], rating: 4.9, reviews: 88, stock: 9, isNew: true, slot: "atasan", description: "Sweater rajut halus dengan tekstur brushed yang hangat namun tetap ringan. Detail rib pada kerah dan manset.", material: "Campuran wol & akrilik" },
  { id: "wide-leg-pants", name: "Wide Leg Pants", price: 299000, oldPrice: 359000, image: sweater, categories: ["Wanita"], gender: "Wanita", colors: [C.ivory, C.black], sizes: ["XS", "S", "M", "L"], rating: 4.6, reviews: 64, stock: 22, slot: "bawahan", description: "Celana wide leg dengan lipit depan dan pinggang tinggi. Memberi kesan jenjang dan elegan.", material: "Polyester-rayon premium" },
  { id: "denim-jacket", name: "Denim Jacket", price: 399000, image: denim, categories: ["Pria", "Outerwear"], gender: "Unisex", colors: [C.denim], sizes: ["S", "M", "L", "XL"], rating: 4.7, reviews: 156, stock: 18, slot: "outerwear", description: "Jaket denim klasik dengan wash medium-blue. Kancing logam dan jahitan kontras untuk karakter yang tahan lama.", material: "100% Katun denim 12oz" },
  { id: "tailored-chino", name: "Tailored Chino", price: 329000, image: denim, categories: ["Pria"], gender: "Pria", colors: [C.sand, C.black], sizes: ["28", "30", "32", "34"], rating: 4.5, reviews: 73, stock: 0, slot: "bawahan", description: "Chino slim-tapered dengan sedikit stretch untuk kenyamanan sepanjang hari.", material: "98% Katun, 2% Elastane" },
  { id: "camel-trench", name: "Camel Trench Coat", price: 1290000, oldPrice: 1590000, image: coat, categories: ["Wanita", "Outerwear"], gender: "Wanita", colors: [C.camel, C.black], sizes: ["XS", "S", "M", "L"], rating: 4.9, reviews: 41, stock: 6, isNew: true, slot: "outerwear", description: "Trench coat panjang double-breasted dengan sabuk dan detail tali bahu. Investasi abadi untuk lemari Anda.", material: "Wool blend 60%" },
  { id: "tailored-trousers", name: "Tailored Trousers", price: 359000, image: coat, categories: ["Wanita"], gender: "Wanita", colors: [C.black], sizes: ["XS", "S", "M", "L"], rating: 4.6, reviews: 52, stock: 25, slot: "bawahan", description: "Celana bahan dengan garis setrika tegas, cocok untuk kantor maupun acara formal.", material: "Polyester-viscose" },
  { id: "leather-tote", name: "Leather Tote", price: 899000, image: bag, categories: ["Tas", "Aksesoris"], gender: "Unisex", colors: [C.black, C.camel], sizes: ["One Size"], rating: 4.8, reviews: 97, stock: 11, slot: "aksesoris", description: "Tote kulit bertekstur dengan ruang luas untuk laptop 14 inci dan perlengkapan harian.", material: "Kulit sapi asli" },
  { id: "court-sneakers", name: "Court Sneakers", price: 599000, image: sneakers, categories: ["Sepatu", "Aksesoris"], gender: "Unisex", colors: [C.white], sizes: ["39", "40", "41", "42", "43"], rating: 4.7, reviews: 210, stock: 30, isNew: true, slot: "aksesoris", description: "Sneakers kulit minimalis dengan sol karet jahit. Bersih, ringan, dan serbaguna.", material: "Kulit nappa, sol karet" },
];

export const categories: { name: Category; image: string }[] = [
  { name: "Pria", image: tshirt },
  { name: "Wanita", image: sweater },
  { name: "Outerwear", image: jacket },
  { name: "Aksesoris", image: bag },
  { name: "Sepatu", image: sneakers },
  { name: "Tas", image: bag },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const SHIPPING_FEE = 25000;
export const FREE_SHIPPING_MIN = 500000;
