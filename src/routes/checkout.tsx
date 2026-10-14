import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Landmark, Truck, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FREE_SHIPPING_MIN, formatIDR, getProduct } from "@/lib/products";
import { actions, cartTotals, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | YSP" },
      { name: "description", content: "Selesaikan pesanan Anda di YSP dengan aman." },
      { property: "og:title", content: "Checkout | YSP" },
      { property: "og:description", content: "Selesaikan pesanan Anda di YSP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

const steps = ["Data Diri", "Pengiriman", "Pembayaran", "Konfirmasi"];
const shipMethods = [
  { id: "reguler", label: "Reguler (2–3 hari)", fee: 25000 },
  { id: "express", label: "Express (Same Day)", fee: 45000 },
];
const payMethods = [
  { id: "GoPay", icon: Wallet }, { id: "DANA", icon: Wallet },
  { id: "Transfer Bank", icon: Landmark }, { id: "Kartu Kredit", icon: CreditCard }, { id: "COD (Bayar di Tempat)", icon: Truck },
];

function Checkout() {
  const { cart } = useStore();
  const navigate = useNavigate();
  const t = cartTotals(cart);
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "" });
  const [ship, setShip] = useState("reguler");
  const [pay, setPay] = useState("GoPay");
  const [errors, setErrors] = useState<Partial<Record<keyof typeof f, string>>>({});
  const shipFee = t.subtotal >= FREE_SHIPPING_MIN && ship === "reguler" ? 0 : shipMethods.find((s) => s.id === ship)!.fee;

  if (cart.length === 0) return (
    <div className="container-ysp py-32 text-center">
      <h1 className="text-4xl">Keranjang kosong</h1>
      <p className="mt-3 text-muted-foreground">Tambahkan produk untuk melanjutkan checkout.</p>
      <Link to="/shop" className="mt-8 inline-block bg-primary px-8 py-3.5 text-sm text-primary-foreground">Mulai Belanja</Link>
    </div>
  );

  const validate = () => {
    const e: Partial<Record<keyof typeof f, string>> = {};
    if (f.name.trim().length < 3) e.name = "Nama minimal 3 karakter";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email tidak valid";
    if (!/^(\+62|0)8\d{7,11}$/.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Nomor HP tidak valid (contoh: 08123456789)";
    if (step >= 1) {
      if (f.address.trim().length < 10) e.address = "Alamat terlalu pendek";
      if (!f.city.trim()) e.city = "Kota wajib diisi";
      if (!/^\d{5}$/.test(f.postal)) e.postal = "Kode pos 5 digit";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => { if (step < 2 && !validate()) return; setStep(step + 1); };
  const place = () => {
    const order = actions.placeOrder({ customer: f, shipping: shipFee, shippingMethod: shipMethods.find((s) => s.id === ship)!.label, payment: pay });
    toast.success("Pembayaran berhasil! Pesanan Anda sedang diproses.");
    navigate({ to: "/lacak", search: { id: order.id } });
  };

  const field = (k: keyof typeof f, label: string, type = "text", full = false) => (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="eyebrow">{label}</span>
      <input type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}
        className={cn("mt-2 w-full border bg-card px-4 py-3 text-sm outline-none focus:border-foreground", errors[k] && "border-destructive")} />
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="container-ysp py-12">
      <h1 className="text-4xl md:text-5xl">Checkout</h1>
      <ol className="mt-8 grid grid-cols-4 gap-2 text-xs">
        {steps.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2 border-t-2 pt-3", i <= step ? "border-foreground" : "border-border text-muted-foreground")}>
            <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]", i < step && "bg-primary text-primary-foreground")}>{i < step ? <Check className="h-3 w-3" /> : i + 1}</span>
            <span className="hidden sm:inline">{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="border bg-card p-6 md:p-8">
          {step === 0 && <div className="grid gap-5 sm:grid-cols-2">{field("name", "Nama Lengkap", "text", true)}{field("email", "Email", "email")}{field("phone", "Nomor HP", "tel")}</div>}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">{field("address", "Alamat Lengkap", "text", true)}{field("city", "Kota")}{field("postal", "Kode Pos")}</div>
              <div className="space-y-3"><p className="eyebrow">Metode Pengiriman</p>
                {shipMethods.map((s) => (
                  <button key={s.id} onClick={() => setShip(s.id)} className={cn("flex w-full justify-between border px-4 py-4 text-sm", ship === s.id && "border-foreground")}>
                    <span>{s.label}</span><span>{s.id === "reguler" && t.subtotal >= FREE_SHIPPING_MIN ? "Gratis" : formatIDR(s.fee)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3"><p className="eyebrow mb-1">Metode Pembayaran</p>
              {payMethods.map((m) => (
                <button key={m.id} onClick={() => setPay(m.id)} className={cn("flex w-full items-center gap-3 border px-4 py-4 text-sm", pay === m.id && "border-foreground")}>
                  <m.icon className="h-4 w-4" /> {m.id}
                  <span className={cn("ml-auto h-4 w-4 rounded-full border", pay === m.id && "border-4 border-foreground")} />
                </button>
              ))}
              <p className="pt-2 text-xs text-muted-foreground">Mode demo — tidak ada pembayaran sungguhan yang diproses.</p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4 text-sm">
              <h2 className="text-2xl">Konfirmasi Pesanan</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-muted p-4"><p className="eyebrow mb-2">Penerima</p><p>{f.name}</p><p className="text-muted-foreground">{f.phone} · {f.email}</p></div>
                <div className="bg-muted p-4"><p className="eyebrow mb-2">Alamat</p><p>{f.address}</p><p className="text-muted-foreground">{f.city} {f.postal}</p></div>
                <div className="bg-muted p-4"><p className="eyebrow mb-2">Pengiriman</p><p>{shipMethods.find((s) => s.id === ship)!.label}</p></div>
                <div className="bg-muted p-4"><p className="eyebrow mb-2">Pembayaran</p><p>{pay}</p></div>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-between gap-3">
            {step > 0 ? <button onClick={() => setStep(step - 1)} className="border px-6 py-3 text-sm">Kembali</button> : <span />}
            {step < 3 ? <button onClick={next} className="bg-primary px-8 py-3 text-sm text-primary-foreground">Lanjutkan</button>
              : <button onClick={place} className="bg-primary px-8 py-3 text-sm text-primary-foreground">Bayar Sekarang · {formatIDR(t.subtotal + shipFee)}</button>}
          </div>
        </div>
        <aside className="h-fit border bg-card p-6">
          <h2 className="text-xl">Ringkasan Pesanan</h2>
          <div className="mt-5 space-y-4">
            {cart.map((c, i) => { const p = getProduct(c.productId)!; return (
              <div key={i} className="flex gap-3 text-sm">
                <img src={p.image} alt={p.name} className="h-20 w-16 object-cover" />
                <div className="min-w-0 flex-1"><p className="truncate">{p.name}</p><p className="text-xs text-muted-foreground">{c.color} · {c.size} · ×{c.qty}</p></div>
                <span>{formatIDR(p.price * c.qty)}</span>
              </div>
            ); })}
          </div>
          <div className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatIDR(t.subtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Ongkir</span><span>{shipFee === 0 ? "Gratis" : formatIDR(shipFee)}</span></div>
            <div className="flex justify-between border-t pt-3 text-base font-medium"><span>Total</span><span>{formatIDR(t.subtotal + shipFee)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
