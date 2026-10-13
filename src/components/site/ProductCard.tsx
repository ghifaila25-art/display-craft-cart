import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { formatIDR, type Product } from "@/lib/products";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { wishlist } = useStore();
  const liked = wishlist.includes(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  return (
    <div className={cn("group relative", className)}>
      <Link to="/produk/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} loading="lazy" width={768} height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.isNew && <span className="bg-card px-2 py-1 text-[10px] uppercase tracking-widest">Baru</span>}
            {discount > 0 && <span className="bg-primary px-2 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">-{discount}%</span>}
            {product.stock === 0 && <span className="bg-muted-foreground px-2 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">Habis</span>}
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-sans text-sm font-medium">{product.name}</h3>
          <div className="flex items-baseline gap-2 text-sm">
            <span>{formatIDR(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatIDR(product.oldPrice)}</span>}
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1">
              {product.colors.map((c) => (
                <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border" style={{ backgroundColor: c.hex }} />
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-star text-star" /> {product.rating}
            </span>
          </div>
        </div>
      </Link>
      <button
        aria-label={liked ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        onClick={() => actions.toggleWish(product.id)}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-card/90 transition hover:bg-card"
      >
        <Heart className={cn("h-4 w-4", liked && "fill-foreground")} />
      </button>
    </div>
  );
}
