import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, formatIDR, products, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

type Search = { q?: string | undefined; category?: Category | undefined; sale?: boolean | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    category: typeof s.category === "string" ? (s.category as Category) : undefined,
    sale: s.sale === true || s.sale === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Semua Produk | YSP" },
      { name: "description", content: "Jelajahi seluruh koleksi YSP. Filter berdasarkan kategori, ukuran, warna, dan harga." },
      { property: "og:title", content: "Shop — Semua Produk | YSP" },
      { property: "og:description", content: "Koleksi fashion premium YSP dengan filter lengkap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
const allColors = Array.from(new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values());
const MAX = 1600000;

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("terbaru");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    let r = products.filter((p) =>
      (!search.category || p.categories.includes(search.category)) &&
      (!search.q || p.name.toLowerCase().includes(search.q.toLowerCase())) &&
      (!search.sale || !!p.oldPrice) &&
      (sizes.length === 0 || p.sizes.some((s) => sizes.includes(s))) &&
      (colors.length === 0 || p.colors.some((c) => colors.includes(c.name))) &&
      p.price <= maxPrice && (!inStock || p.stock > 0));
    if (sort === "termurah") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "termahal") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "terbaru") r = [...r].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return r;
  }, [search, sizes, colors, maxPrice, inStock, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setSizes([]); setColors([]); setMaxPrice(MAX); setInStock(false); navigate({ search: {} }); };

  const Filters = (
    <div className="space-y-8 text-sm">
      <Group title="Kategori">
        <div className="flex flex-col gap-2">
          <button onClick={() => navigate({ search: (p) => ({ ...p, category: undefined }) })} className={cn("text-left", !search.category ? "font-medium" : "text-muted-foreground")}>Semua</button>
          {categories.map((c) => (
            <button key={c.name} onClick={() => navigate({ search: (p) => ({ ...p, category: c.name }) })} className={cn("text-left", search.category === c.name ? "font-medium" : "text-muted-foreground")}>{c.name}</button>
          ))}
        </div>
      </Group>
      <Group title="Ukuran">
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => <button key={s} onClick={() => toggle(sizes, setSizes, s)} className={cn("min-w-10 border px-2 py-1.5 text-xs", sizes.includes(s) && "border-foreground bg-primary text-primary-foreground")}>{s}</button>)}
        </div>
      </Group>
      <Group title="Warna">
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => <button key={c.name} title={c.name} aria-label={c.name} onClick={() => toggle(colors, setColors, c.name)} className={cn("h-7 w-7 rounded-full border-2 border-background ring-1 ring-border", colors.includes(c.name) && "ring-2 ring-foreground")} style={{ backgroundColor: c.hex }} />)}
        </div>
      </Group>
      <Group title="Harga Maksimum">
        <input type="range" min={100000} max={MAX} step={50000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-[var(--color-foreground)]" />
        <p className="mt-1 text-xs text-muted-foreground">Hingga {formatIDR(maxPrice)}</p>
      </Group>
      <label className="flex items-center gap-2"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-[var(--color-foreground)]" /> Hanya yang tersedia</label>
      <button onClick={reset} className="text-xs underline underline-offset-4">Reset filter</button>
    </div>
  );

  return (
    <div className="container-ysp py-12">
      <p className="eyebrow"><Link to="/">Beranda</Link> / Shop</p>
      <h1 className="mt-3 text-4xl md:text-5xl">{search.category ?? (search.sale ? "Promo" : "Semua Produk")}</h1>
      {search.q && <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">Hasil pencarian “{search.q}” <button aria-label="Hapus pencarian" onClick={() => navigate({ search: (p) => ({ ...p, q: undefined }) })}><X className="h-3 w-3" /></button></p>}
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>
        <div>
          <div className="mb-6 flex items-center justify-between gap-4 border-b pb-4">
            <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 text-sm lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filter</button>
            <span className="hidden text-sm text-muted-foreground lg:block">{list.length} produk</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan" className="border bg-card px-3 py-2 text-sm">
              <option value="terbaru">Terbaru</option><option value="termurah">Harga terendah</option>
              <option value="termahal">Harga tertinggi</option><option value="rating">Rating tertinggi</option>
            </select>
          </div>
          {list.length === 0 ? (
            <div className="py-24 text-center"><p className="font-serif text-2xl">Tidak ada produk yang cocok.</p><button onClick={reset} className="mt-4 text-sm underline">Reset filter</button></div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex justify-between"><h2 className="text-2xl">Filter</h2><button aria-label="Tutup" onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button></div>
            {Filters}
            <button onClick={() => setFiltersOpen(false)} className="mt-8 w-full bg-primary py-3 text-sm text-primary-foreground">Tampilkan {list.length} produk</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><p className="eyebrow mb-3">{title}</p>{children}</div>;
}
