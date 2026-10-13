import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="container-ysp grid gap-8 border-b py-12 md:grid-cols-2 md:items-center">
        <div>
          <h3 className="font-serif text-2xl">Berlangganan Newsletter</h3>
          <p className="mt-2 text-sm text-muted-foreground">Dapatkan info terbaru, promo spesial, dan koleksi terbaru langsung ke email Anda.</p>
        </div>
        <form className="flex" onSubmit={(e) => {
          e.preventDefault();
          if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Masukkan alamat email yang valid.");
          toast.success("Terima kasih! Anda telah berlangganan."); setEmail("");
        }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Masukkan email Anda" aria-label="Email"
            className="min-w-0 flex-1 border bg-background px-4 py-3 text-sm outline-none focus:border-foreground" />
          <button className="bg-primary px-6 text-sm text-primary-foreground">Daftar</button>
        </form>
      </div>
      <div className="container-ysp grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3"><Logo /><p className="max-w-xs text-sm text-muted-foreground">Fashion premium untuk setiap momen berharga.</p></div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Belanja</p>
          <Link to="/shop" className="block text-muted-foreground hover:text-foreground">Semua Produk</Link>
          <Link to="/style-studio" className="block text-muted-foreground hover:text-foreground">Style Studio</Link>
          <Link to="/wishlist" className="block text-muted-foreground hover:text-foreground">Wishlist</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Bantuan</p>
          <Link to="/lacak" className="block text-muted-foreground hover:text-foreground">Lacak Pesanan</Link>
          <Link to="/checkout" className="block text-muted-foreground hover:text-foreground">Checkout</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Hubungi Kami</p>
          <a href="tel:+622134567890" className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />+62 21 3456 7890</a>
          <a href="mailto:support@ysp.id" className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />support@ysp.id</a>
          <div className="flex gap-3 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="container-ysp flex justify-between border-t py-5 text-xs text-muted-foreground">
        <span>© 2026 YSP. Hak cipta dilindungi.</span><span>Fashion for a better you.</span>
      </div>
    </footer>
  );
}
