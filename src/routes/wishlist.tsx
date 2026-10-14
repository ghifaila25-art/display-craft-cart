import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist | YSP" },
      { name: "description", content: "Produk favorit yang Anda simpan di YSP." },
      { property: "og:title", content: "Wishlist | YSP" },
      { property: "og:description", content: "Produk favorit Anda di YSP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter((p) => !!p);
  return (
    <div className="container-ysp py-12">
      <h1 className="text-4xl md:text-5xl">Wishlist</h1>
      {items.length === 0 ? (
        <div className="py-24 text-center"><p className="text-muted-foreground">Belum ada produk favorit.</p><Link to="/shop" className="mt-6 inline-block bg-primary px-8 py-3.5 text-sm text-primary-foreground">Jelajahi Produk</Link></div>
      ) : <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{items.map((p) => <ProductCard key={p!.id} product={p!} />)}</div>}
    </div>
  );
}
