import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatIDR, products, type Product, type Slot } from "@/lib/products";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-studio")({
  head: () => ({
    meta: [
      { title: "Virtual Style Studio | YSP" },
      { name: "description", content: "Padukan outfit favorit Anda, lihat total harga, dan tambahkan ke keranjang sekaligus." },
      { property: "og:title", content: "Virtual Style Studio | YSP" },
      { property: "og:description", content: "Padukan outfit dan belanja sekaligus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

const slots: { key: Slot; label: string }[] = [
  { key: "atasan", label: "Atasan" }, { key: "bawahan", label: "Bawahan" },
  { key: "outerwear", label: "Outerwear" }, { key: "aksesoris", label: "Aksesoris" },
];

function Studio() {
  const [active, setActive] = useState<Slot>("outerwear");
  const [pick, setPick] = useState<Partial<Record<Slot, Product>>>({ outerwear: products[0], atasan: products[1] });
  const chosen = slots.map((s) => pick[s.key]).filter(Boolean) as Product[];
  const total = chosen.reduce((s, p) => s + p.price, 0);
  const preview = pick.outerwear ?? pick.atasan ?? pick.bawahan ?? pick.aksesoris;

  const addAll = () => {
    const available = chosen.filter((p) => p.stock > 0);
    if (available.length === 0) return toast.error("Pilih minimal satu item yang tersedia.");
    available.forEach((p) => actions.addToCart({ productId: p.id, size: p.sizes[Math.min(1, p.sizes.length - 1)], color: p.colors[0].name, qty: 1 }));
    toast.success(`${available.length} item outfit ditambahkan ke keranjang.`);
  };

  return (
    <div className="container-ysp py-12">
      <p className="eyebrow">Fitur Unggulan</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Virtual Style Studio</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Pilih satu item per kategori untuk membangun outfit lengkap Anda.</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative">
          <div className="aspect-[3/4] overflow-hidden bg-muted">
            {preview && <img key={preview.id} src={preview.image} alt={preview.name} className="animate-rise h-full w-full object-cover" />}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            {chosen.map((p) => <img key={p.id} src={p.image} alt={p.name} className="h-16 w-12 border-2 border-card object-cover shadow" />)}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-6 border-b text-sm">
            {slots.map((s) => (
              <button key={s.key} onClick={() => setActive(s.key)} className={cn("-mb-px flex items-center gap-1.5 border-b pb-3", active === s.key ? "border-foreground" : "border-transparent text-muted-foreground")}>
                {s.label}{pick[s.key] && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products.filter((p) => p.slot === active).map((p) => {
              const sel = pick[active]?.id === p.id;
              return (
                <button key={p.id} onClick={() => setPick({ ...pick, [active]: sel ? undefined : p })} className={cn("text-left", p.stock === 0 && "opacity-50")}>
                  <div className={cn("aspect-[3/4] overflow-hidden bg-muted ring-offset-2 ring-offset-background", sel && "ring-2 ring-foreground")}>
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2 text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.stock === 0 ? "Stok habis" : formatIDR(p.price)}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-auto pt-8">
            <div className="border bg-card p-6">
              <div className="space-y-1 text-sm">
                {slots.map((s) => <div key={s.key} className="flex justify-between"><span className="text-muted-foreground">{s.label}</span><span>{pick[s.key]?.name ?? "—"}</span></div>)}
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div><p className="eyebrow">Total Outfit</p><p className="font-serif text-2xl">{formatIDR(total)}</p></div>
                <div className="flex gap-2">
                  <button aria-label="Reset outfit" onClick={() => setPick({})} className="grid w-12 place-items-center border"><RotateCcw className="h-4 w-4" /></button>
                  <button onClick={addAll} className="bg-primary px-6 py-3 text-sm text-primary-foreground">Tambah ke Keranjang</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
