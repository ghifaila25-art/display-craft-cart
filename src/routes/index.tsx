import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import hero from "@/assets/hero.jpg";
import coat from "@/assets/p-coat.jpg";
import denim from "@/assets/p-denim.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YSP — Fashion Premium untuk Setiap Momen" },
      { name: "description", content: "Belanja koleksi fashion premium YSP: outerwear, atasan, sepatu, dan tas dengan gratis ongkir." },
      { property: "og:title", content: "YSP — Your Shopping Place" },
      { property: "og:description", content: "Koleksi fashion premium untuk setiap momen berharga." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const slides = [
  { img: hero, title: ["Elevate", "Your Style"], sub: "Temukan koleksi fashion premium untuk setiap momen berharga.", tag: "New Collection 2026" },
  { img: coat, title: ["Quiet", "Luxury"], sub: "Siluet abadi dengan material terbaik, dirancang untuk bertahan lama.", tag: "Outerwear Edit" },
];

function Home() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000); return () => clearInterval(t); }, []);
  const s = slides[i]!;
  const newest = products.filter((p) => p.isNew).concat(products.filter((p) => !p.isNew)).slice(0, 8);

  return (
    <>
      <section className="relative h-[78vh] min-h-[520px] overflow-hidden bg-primary text-primary-foreground">
        <img key={s.img} src={s.img} alt="" width={1920} height={1024} className="animate-slowzoom absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent" />
        <div key={i} className="container-ysp relative flex h-full flex-col justify-center">
          <p className="animate-rise eyebrow !text-primary-foreground/70">{s.tag}</p>
          <h1 className="animate-rise mt-4 text-6xl leading-[0.95] md:text-8xl">{s.title[0]}<br /><em className="font-normal">{s.title[1]}</em></h1>
          <p className="animate-rise mt-6 max-w-sm text-primary-foreground/80" style={{ animationDelay: ".15s" }}>{s.sub}</p>
          <Link to="/shop" className="animate-rise mt-8 inline-flex w-fit items-center gap-3 bg-card px-7 py-3.5 text-sm text-foreground transition hover:gap-5" style={{ animationDelay: ".3s" }}>
            Belanja Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, k) => (
            <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-0.5 transition-all ${k === i ? "w-10 bg-primary-foreground" : "w-5 bg-primary-foreground/40"}`} />
          ))}
        </div>
        <button aria-label="Sebelumnya" onClick={() => setI((i - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/40 md:grid"><ChevronLeft className="h-4 w-4" /></button>
        <button aria-label="Berikutnya" onClick={() => setI((i + 1) % slides.length)} className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/40 md:grid"><ChevronRight className="h-4 w-4" /></button>
      </section>

      <section className="container-ysp py-16">
        <SectionTitle eyebrow="Jelajahi" title="Kategori Pilihan" />
        <div className="no-scrollbar mt-8 flex snap-x gap-6 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link key={c.name} to="/shop" search={{ category: c.name }} className="group shrink-0 snap-start text-center">
              <div className="h-28 w-28 overflow-hidden rounded-full bg-muted md:h-36 md:w-36">
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <Rail title="Produk Terbaru" eyebrow="Baru Tiba">
        {newest.map((p) => <ProductCard key={p.id} product={p} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-[260px]" />)}
      </Rail>

      <section className="container-ysp py-16">
        <div className="grid overflow-hidden bg-primary text-primary-foreground md:grid-cols-2">
          <div className="flex flex-col justify-center p-10 md:p-16">
            <p className="eyebrow !text-primary-foreground/60">Fitur Unggulan</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Virtual Style Studio</h2>
            <p className="mt-4 max-w-sm text-primary-foreground/75">Padukan atasan, bawahan, outerwear, dan aksesoris. Lihat total harga, lalu masukkan seluruh outfit ke keranjang sekaligus.</p>
            <Link to="/style-studio" className="mt-8 inline-flex w-fit items-center gap-3 bg-card px-7 py-3.5 text-sm text-foreground">Mulai Sekarang <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <img src={denim} alt="Style Studio" loading="lazy" className="h-80 w-full object-cover md:h-full" />
        </div>
      </section>

      <section className="container-ysp py-8">
        <div className="relative overflow-hidden">
          <img src={coat} alt="" loading="lazy" className="h-72 w-full object-cover object-[center_30%] md:h-96" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-10 text-primary-foreground md:p-16">
            <p className="eyebrow !text-primary-foreground/70">Special Offer</p>
            <h2 className="mt-3 text-4xl md:text-6xl">Diskon hingga 35%</h2>
            <p className="mt-2 text-primary-foreground/80">Untuk koleksi pilihan musim ini.</p>
            <Link to="/shop" search={{ sale: true }} className="mt-6 inline-flex w-fit items-center gap-3 bg-card px-7 py-3.5 text-sm text-foreground">Belanja Promo <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="container-ysp py-16">
        <SectionTitle eyebrow="Kata Mereka" title="Testimoni Pelanggan" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Rizky Pratama", "Sangat puas dengan kualitas produk dan pengirimannya cepat. Jaketnya jatuh sempurna."],
            ["Anisa Putri", "Desainnya keren, bahannya premium. Pasti belanja lagi di YSP!"],
            ["Dimas Alfarisi", "Packing rapi, produk sesuai gambar. Fitur lacak pesanannya sangat membantu."],
          ].map(([n, t]) => (
            <figure key={n} className="border bg-card p-8">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-star text-star" />)}</div>
              <blockquote className="mt-4 font-serif text-lg leading-relaxed">“{t}”</blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">— {n}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-3xl md:text-4xl">{title}</h2></div>
      {action}
    </div>
  );
}

function Rail({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="container-ysp py-16">
      <SectionTitle eyebrow={eyebrow} title={title} action={
        <div className="flex items-center gap-2">
          <Link to="/shop" className="mr-2 hidden text-sm underline underline-offset-4 sm:block">Lihat Semua</Link>
          <button aria-label="Geser kiri" onClick={() => scroll(-1)} className="grid h-9 w-9 place-items-center rounded-full border"><ChevronLeft className="h-4 w-4" /></button>
          <button aria-label="Geser kanan" onClick={() => scroll(1)} className="grid h-9 w-9 place-items-center rounded-full border"><ChevronRight className="h-4 w-4" /></button>
        </div>
      } />
      <div ref={ref} className="no-scrollbar mt-8 flex snap-x gap-5 overflow-x-auto">{children}</div>
    </section>
  );
}
