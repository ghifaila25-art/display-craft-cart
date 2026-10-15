import { ClientOnly, createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CheckCircle2, Package } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { formatIDR } from "@/lib/products";
import { DELIVERY_MS, STAGES, useStore } from "@/lib/store";
import { ROUTE_DISTANCE_KM } from "@/lib/delivery-route";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lacak")({
  validateSearch: (s: Record<string, any>): { id?: string | undefined } => ({ id: typeof s["id"] === "string" ? s["id"] : undefined }),
  head: () => ({
    meta: [
      { title: "Lacak Pesanan | YSP" },
      { name: "description", content: "Pantau status dan posisi kurir pesanan YSP Anda secara langsung." },
      { property: "og:title", content: "Lacak Pesanan | YSP" },
      { property: "og:description", content: "Pantau pesanan YSP Anda secara langsung." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Track,
});

const DeliveryMap = lazy(() => import("@/components/site/DeliveryMap"));
const mapFallback = <div className="delivery-map grid place-items-center border bg-map text-sm text-muted-foreground">Memuat peta jalan…</div>;

function Track() {
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: "/lacak" });
  const { orders } = useStore();
  const [input, setInput] = useState(id ?? "");
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const order = orders.find((o) => o.id.toLowerCase() === (id ?? "").toLowerCase());

  const progress = order ? Math.min(1, (now - order.createdAt) / DELIVERY_MS) : 0;
  const move = Math.max(0, Math.min(1, (progress - 0.35) / 0.65));
  const remainingMin = Math.max(0, Math.ceil(((1 - progress) * DELIVERY_MS) / 60000));
  const delivered = progress >= 1;

  return (
    <div className="container-ysp py-12">
      <h1 className="text-4xl md:text-5xl">Lacak Pesanan</h1>
      <form className="mt-6 flex max-w-lg" onSubmit={(e) => { e.preventDefault(); navigate({ search: { id: input.trim() || undefined } }); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Masukkan nomor pesanan, mis. YSP-1234567" className="min-w-0 flex-1 border bg-card px-4 py-3 text-sm outline-none focus:border-foreground" />
        <Button type="submit" className="h-auto rounded-none px-6">Lacak</Button>
      </form>

      {!order && (
        <div className="mt-10">
          {id && <p className="mb-6 text-sm text-destructive">Pesanan “{id}” tidak ditemukan.</p>}
          {orders.length > 0 ? (
            <div><p className="eyebrow mb-3">Pesanan Anda</p>
              <div className="grid gap-3 md:grid-cols-2">{orders.map((o) => (
                <Link key={o.id} to="/lacak" search={{ id: o.id }} className="flex items-center justify-between border bg-card p-4 text-sm hover:border-foreground">
                  <span><span className="font-medium">#{o.id}</span><br /><span className="text-muted-foreground">{new Date(o.createdAt).toLocaleString("id-ID")}</span></span>
                  <span>{formatIDR(o.total)}</span>
                </Link>
              ))}</div>
            </div>
          ) : <p className="text-sm text-muted-foreground">Belum ada pesanan. <Link to="/shop" className="underline">Mulai belanja</Link>.</p>}
        </div>
      )}

      {order && (
        <>
          {delivered && (
            <div className="animate-rise mt-8 flex items-center gap-4 border bg-card p-6">
              <CheckCircle2 className="h-10 w-10 shrink-0 text-success" />
              <div className="flex-1"><h2 className="text-2xl">Paket Berhasil Diterima!</h2><p className="text-sm text-muted-foreground">Yeay! Pesanan Anda telah sampai di tujuan. Terima kasih telah berbelanja di YSP.</p></div>
              <Link to="/" className="hidden border px-5 py-2.5 text-sm sm:block">Kembali ke Beranda</Link>
            </div>
          )}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <ClientOnly fallback={mapFallback}>
              <Suspense fallback={mapFallback}><DeliveryMap progress={move} delivered={delivered} /></Suspense>
            </ClientOnly>
            <div className="border bg-card p-6">
              <p className="eyebrow">No. Pesanan</p><p className="font-serif text-2xl">#{order.id}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-y py-4 text-sm">
                <div><p className="eyebrow">Kurir</p><p>Budi Santoso</p></div>
                <div><p className="eyebrow">Estimasi</p><p>{delivered ? "Tiba" : `± ${remainingMin} menit`}</p></div>
                <div><p className="eyebrow">Sisa Jarak Demo</p><p>{(ROUTE_DISTANCE_KM * (1 - move)).toFixed(1)} km</p></div>
                <div><p className="eyebrow">Total</p><p>{formatIDR(order.total)}</p></div>
              </div>
              <ol className="mt-6 space-y-5">
                {STAGES.map((s, i) => { const done = progress >= s.at; const current = done && (STAGES[i + 1]?.at ?? 2) > progress; return (
                  <li key={s.label} className="flex gap-3 text-sm">
                    <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border", done && "border-foreground bg-primary text-primary-foreground")}>{done ? <Check className="h-3 w-3" /> : <Package className="h-3 w-3 text-muted-foreground" />}</span>
                    <div><p className={cn(!done && "text-muted-foreground", current && "font-medium")}>{s.label}</p>
                      {done && <p className="text-xs text-muted-foreground">{new Date(order.createdAt + s.at * DELIVERY_MS).toLocaleTimeString("id-ID")}</p>}</div>
                  </li>
                ); })}
              </ol>
            </div>
          </div>
          <div className="mt-8 border bg-card p-6">
            <p className="eyebrow mb-4">Detail Pesanan · {order.payment} · {order.shippingMethod}</p>
            <div className="space-y-3">{order.items.map((it, k) => (
              <div key={k} className="flex items-center gap-4 text-sm"><img src={it.image} alt={it.name} className="h-16 w-12 object-cover" /><span className="flex-1">{it.name} <span className="text-muted-foreground">· {it.color} · {it.size} · ×{it.qty}</span></span><span>{formatIDR(it.price * it.qty)}</span></div>
            ))}</div>
            <p className="mt-4 text-sm text-muted-foreground">Dikirim ke: {order.customer.name}, {order.customer.address}, {order.customer.city} {order.customer.postal}</p>
          </div>
        </>
      )}
    </div>
  );
}
