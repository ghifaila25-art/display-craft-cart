import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Minus, Plus, Search, ShoppingBag, Truck, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BRAND, FREE_SHIPPING_MIN, formatIDR, getProduct } from "@/lib/products";
import { actions, cartTotals, useStore } from "@/lib/store";
import logoAsset from "@/assets/ysp-logo.jpg.asset.json";

const nav = [
  { to: "/", label: "Beranda" },
  { to: "/shop", label: "Shop" },
  { to: "/style-studio", label: "Style Studio" },
  { to: "/lacak", label: "Lacak Pesanan" },
] as const;

export function Logo() {
  return (
    <Link to="/" aria-label={`${BRAND.name} — Beranda`} className="block shrink-0">
      <img src={logoAsset.url} alt={`${BRAND.name} — Your Shopping Place`} width={1445} height={206} className="h-auto w-40 object-contain mix-blend-multiply sm:w-56" />
    </Link>
  );
}

export function SiteHeader() {
  const { cart, wishlist } = useStore();
  const { count } = cartTotals(cart);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="bg-primary py-2 text-center text-[11px] tracking-wide text-primary-foreground">
        Gratis ongkir untuk pembelian di atas {formatIDR(FREE_SHIPPING_MIN)} · Diskon 10% untuk member baru
      </div>
      <div className="container-ysp grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="flex min-w-0 items-center gap-3">
          <Sheet>
            <SheetTrigger aria-label="Menu" className="lg:hidden"><Menu className="h-5 w-5" /></SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetHeader><SheetTitle className="font-serif">{BRAND.name}</SheetTitle></SheetHeader>
              <nav className="mt-6 flex flex-col gap-4 px-4">
                {nav.map((n) => <Link key={n.to} to={n.to} className="font-serif text-2xl">{n.label}</Link>)}
                <Link to="/wishlist" className="font-serif text-2xl">Wishlist</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Logo />
        </div>
        <nav className="hidden justify-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="text-[13px] tracking-wide text-muted-foreground transition hover:text-foreground data-[status=active]:text-foreground data-[status=active]:underline data-[status=active]:underline-offset-8">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-4">
          {searchOpen ? (
            <form className="flex items-center gap-2 border-b border-foreground" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/shop", search: { q } }); setSearchOpen(false); }}>
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk…" className="w-28 bg-transparent py-1 text-sm outline-none sm:w-44" />
              <button type="button" aria-label="Tutup pencarian" onClick={() => setSearchOpen(false)}><X className="h-4 w-4" /></button>
            </form>
          ) : (
            <button aria-label="Cari" onClick={() => setSearchOpen(true)}><Search className="h-5 w-5" /></button>
          )}
          <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </Link>
          <CartSheet count={count} />
        </div>
      </div>
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{n}</span>;
}

function CartSheet({ count }: { count: number }) {
  const { cart } = useStore();
  const t = cartTotals(cart);
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger aria-label="Keranjang" className="relative">
        <ShoppingBag className="h-5 w-5" />
        {count > 0 && <Badge n={count} />}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader><SheetTitle className="font-serif text-2xl">Keranjang ({count})</SheetTitle></SheetHeader>
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Keranjang Anda masih kosong.</p>
            <Link to="/shop" onClick={() => setOpen(false)} className="bg-primary px-6 py-3 text-sm text-primary-foreground">Mulai Belanja</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-4">
              {t.subtotal < FREE_SHIPPING_MIN && (
                <p className="flex items-center gap-2 bg-muted p-3 text-xs"><Truck className="h-4 w-4 shrink-0" />Tambah {formatIDR(FREE_SHIPPING_MIN - t.subtotal)} lagi untuk gratis ongkir.</p>
              )}
              {cart.map((c, i) => {
                const p = getProduct(c.productId);
                if (!p) return null;
                return (
                  <div key={i} className="flex gap-4">
                    <img src={p.image} alt={p.name} className="h-28 w-20 shrink-0 object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <button aria-label="Hapus" onClick={() => actions.remove(i)}><X className="h-4 w-4 text-muted-foreground" /></button>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.color} · {c.size}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border">
                          <button aria-label="Kurangi" className="p-1.5" onClick={() => actions.setQty(i, c.qty - 1)}><Minus className="h-3 w-3" /></button>
                          <span className="w-7 text-center text-sm">{c.qty}</span>
                          <button aria-label="Tambah" className="p-1.5" onClick={() => actions.setQty(i, Math.min(p.stock, c.qty + 1))}><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="text-sm">{formatIDR(p.price * c.qty)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3 border-t p-4">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatIDR(t.subtotal)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>Ongkir</span><span>{t.shipping === 0 ? "Gratis" : formatIDR(t.shipping)}</span></div>
              <Link to="/checkout" onClick={() => setOpen(false)} className="block bg-primary py-3.5 text-center text-sm tracking-wide text-primary-foreground transition hover:opacity-90">Checkout · {formatIDR(t.total)}</Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
