import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Bike, Home, LocateFixed, Minus, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DELIVERY_ROUTE, routePoint } from "@/lib/delivery-route";

function mapIcon(kind: "store" | "home" | "courier") {
  const Icon = kind === "store" ? Store : kind === "home" ? Home : Bike;
  return L.divIcon({
    className: `delivery-marker delivery-marker-${kind}`,
    html: renderToStaticMarkup(<Icon size={18} strokeWidth={2} />),
    iconSize: [36, 36], iconAnchor: [18, 18], tooltipAnchor: [0, -24],
  });
}

export default function DeliveryMap({ progress, delivered }: { progress: number; delivered: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const courier = useRef<L.Marker | null>(null);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    const element = container.current;
    const start = DELIVERY_ROUTE[0];
    const destination = DELIVERY_ROUTE.at(-1);
    if (!element || !start || !destination) return;
    const instance = L.map(element, { zoomControl: false, scrollWheelZoom: false, attributionControl: true });
    map.current = instance;
    const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }).addTo(instance);
    tiles.on("tileerror", () => setTileError(true));
    tiles.on("load", () => setTileError(false));
    const tokens = getComputedStyle(element);
    L.polyline(DELIVERY_ROUTE, { color: tokens.getPropertyValue("--card").trim(), weight: 9, opacity: 1 }).addTo(instance);
    const line = L.polyline(DELIVERY_ROUTE, { color: tokens.getPropertyValue("--route").trim(), weight: 5, opacity: 1 }).addTo(instance);
    L.marker(start, { icon: mapIcon("store") }).addTo(instance).bindTooltip("YSP · Titik pengiriman demo");
    L.marker(destination, { icon: mapIcon("home") }).addTo(instance).bindTooltip("Tujuan demo · Menteng");
    courier.current = L.marker(start, { icon: mapIcon("courier"), zIndexOffset: 1000 }).addTo(instance).bindTooltip("Budi Santoso · Kurir simulasi");
    const fit = () => instance.fitBounds(line.getBounds(), { padding: [52, 60], maxZoom: 15 });
    fit();
    const observer = new ResizeObserver(() => { instance.invalidateSize(); fit(); });
    observer.observe(element);
    return () => { observer.disconnect(); instance.remove(); map.current = null; courier.current = null; };
  }, []);

  useEffect(() => {
    courier.current?.setLatLng(routePoint(progress));
    courier.current?.setTooltipContent(delivered ? "Paket telah diterima" : "Budi Santoso · Kurir simulasi");
  }, [progress, delivered]);

  return (
    <div className="delivery-map relative isolate overflow-hidden border bg-map">
      <div ref={container} className="h-full w-full" role="region" aria-label="Peta jalur pengiriman demo Jakarta" />
      <div className="delivery-map-badge absolute left-3 top-3 z-[500] max-w-[calc(100%-5rem)] border bg-card px-3 py-2 text-xs">
        <span className="font-medium">Jakarta · Rute simulasi</span>
        <p className="mt-1 text-muted-foreground">Bukan lokasi kurir atau alamat sebenarnya</p>
      </div>
      <div className="absolute right-3 top-3 z-[500] flex flex-col gap-1">
        <Button variant="outline" size="icon" className="bg-card" title="Perbesar peta" aria-label="Perbesar peta" onClick={() => map.current?.zoomIn()}><Plus /></Button>
        <Button variant="outline" size="icon" className="bg-card" title="Perkecil peta" aria-label="Perkecil peta" onClick={() => map.current?.zoomOut()}><Minus /></Button>
        <Button variant="outline" size="icon" className="bg-card" title="Lihat seluruh jalur" aria-label="Lihat seluruh jalur" onClick={() => map.current?.fitBounds(L.latLngBounds(DELIVERY_ROUTE), { padding: [52, 60], maxZoom: 15 })}><LocateFixed /></Button>
      </div>
      {tileError && <p className="absolute bottom-8 left-3 right-3 z-[500] border bg-card p-2 text-xs text-destructive">Peta jalan belum termuat. Periksa koneksi internet Anda.</p>}
    </div>
  );
}