import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/site/ProductCard";
import { formatIDR, getProduct, products } from "@/lib/products";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produk/$id")({
  loader: ({ params }) => { const p = getProduct(params.id); if (!p) throw notFound(); return { id: p.id, name: p.name, description: p.description }; },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} | YSP` },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: `${loaderData.name} | YSP` },
      { property: "og:description", content: loaderData.description },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ] : [{ title: "Produk tidak tersedia | YSP" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useLoaderData();
  const p = getProduct(id)!;
  const { wishlist } = useStore();
  const navigate = useNavigate();
  const [color, setColor] = useState(p.colors[0]!.name);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0]! : null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desk" | "spek" | "kirim" | "ulasan">("desk");
  const soldOut = p.stock === 0;
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const related = products.filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c))).slice(0, 4);

  const add = (buyNow = false): void => {
    if (!size) { toast.error("Silakan pilih ukuran terlebih dahulu."); return; }
    actions.addToCart({ productId: p.id, size, color, qty });
    if (buyNow) navigate({ to: "/checkout" }); else toast.success(`${p.name} ditambahkan ke keranjang.`);
  };

  return (
    <div className="container-ysp py-10">
      <p className="eyebrow"><Link to="/">Beranda</Link> / <Link to="/shop">Shop</Link> / {p.name}</p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="grid grid-cols-[64px_1fr] gap-3">
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((k) => <div key={k} className={cn("aspect-[3/4] overflow-hidden bg-muted", k === 0 && "ring-1 ring-foreground")}><img src={p.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: ["center", "top", "bottom"][k] }} /></div>)}
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-muted"><img src={p.image} alt={p.name} width={768} height={1024} className="h-full w-full object-cover" /></div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-star text-star" /> {p.rating} · {p.reviews} ulasan
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl">{formatIDR(p.price)}</span>
            {p.oldPrice && <><span className="text-muted-foreground line-through">{formatIDR(p.oldPrice)}</span><span className="bg-secondary px-2 py-0.5 text-xs">{discount}% OFF</span></>}
          </div>
          <div className="mt-8"><p className="eyebrow mb-3">Warna · <span className="normal-case tracking-normal text-foreground">{color}</span></p>
            <div className="flex gap-3">{p.colors.map((c) => <button key={c.name} aria-label={c.name} onClick={() => setColor(c.name)} className={cn("h-8 w-8 rounded-full border-2 border-background ring-1 ring-border", color === c.name && "ring-2 ring-foreground")} style={{ backgroundColor: c.hex }} />)}</div>
          </div>
          <div className="mt-6"><p className="eyebrow mb-3">Ukuran</p>
            <div className="flex flex-wrap gap-2">{p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={cn("min-w-12 border px-3 py-2.5 text-sm transition", size === s ? "border-foreground bg-primary text-primary-foreground" : "hover:border-foreground")}>{s}</button>)}</div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border">
              <button aria-label="Kurangi" className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-3 w-3" /></button>
              <span className="w-8 text-center">{qty}</span>
              <button aria-label="Tambah" className="p-3" onClick={() => setQty(Math.min(p.stock || 1, qty + 1))}><Plus className="h-3 w-3" /></button>
            </div>
            <span className={cn("text-xs", soldOut ? "text-destructive" : "text-muted-foreground")}>{soldOut ? "Stok habis" : p.stock < 10 ? `Tersisa ${p.stock} item` : "Stok tersedia"}</span>
          </div>
          <div className="mt-8 grid grid-cols-[1fr_auto] gap-3">
            <button disabled={soldOut} onClick={() => add()} className="bg-primary py-4 text-sm tracking-wide text-primary-foreground transition hover:opacity-90 disabled:opacity-40">Tambah ke Keranjang</button>
            <button aria-label="Wishlist" onClick={() => actions.toggleWish(p.id)} className="grid w-14 place-items-center border"><Heart className={cn("h-5 w-5", wishlist.includes(p.id) && "fill-foreground")} /></button>
            <button disabled={soldOut} onClick={() => add(true)} className="col-span-2 border border-foreground py-4 text-sm tracking-wide transition hover:bg-primary hover:text-primary-foreground disabled:opacity-40">Beli Sekarang</button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 border-y py-5 text-center text-xs text-muted-foreground">
            <span className="flex flex-col items-center gap-2"><Truck className="h-4 w-4" />Gratis ongkir &gt; 500rb</span>
            <span className="flex flex-col items-center gap-2"><RotateCcw className="h-4 w-4" />Retur 30 hari</span>
            <span className="flex flex-col items-center gap-2"><ShieldCheck className="h-4 w-4" />100% Original</span>
          </div>
          <div className="mt-8">
            <div className="flex gap-6 border-b text-sm">
              {([["desk", "Deskripsi"], ["spek", "Spesifikasi"], ["kirim", "Pengiriman"], ["ulasan", `Ulasan (${p.reviews})`]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className={cn("-mb-px border-b pb-3", tab === k ? "border-foreground" : "border-transparent text-muted-foreground")}>{l}</button>
              ))}
            </div>
            <div className="pt-5 text-sm leading-relaxed text-muted-foreground">
              {tab === "desk" && p.description}
              {tab === "spek" && <ul className="space-y-1"><li>Material: {p.material}</li><li>Gender: {p.gender}</li><li>Ukuran: {p.sizes.join(", ")}</li></ul>}
              {tab === "kirim" && "Pesanan diproses dalam 1×24 jam. Estimasi tiba 1–3 hari kerja untuk Jabodetabek. Lacak status pesanan secara real-time di halaman Lacak Pesanan."}
              {tab === "ulasan" && <div className="space-y-4">{["Bahannya bagus dan jahitannya rapi.", "Ukuran pas, sesuai size chart.", "Pengiriman cepat, recommended!"].map((r, k) => <div key={k} className="border-b pb-3"><div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-star text-star" />)}</div><p className="mt-1 text-foreground">{r}</p></div>)}</div>}
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-24"><h2 className="text-3xl">Anda Mungkin Suka</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  );
}
