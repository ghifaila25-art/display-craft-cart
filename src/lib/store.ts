import { useSyncExternalStore } from "react";
import { FREE_SHIPPING_MIN, SHIPPING_FEE, getProduct } from "./products";

export interface CartItem { productId: string; size: string; color: string; qty: number }
export interface Order {
  id: string;
  createdAt: number;
  items: (CartItem & { name: string; price: number; image: string })[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: { name: string; email: string; phone: string; address: string; city: string; postal: string };
  shippingMethod: string;
  payment: string;
}
interface State { cart: CartItem[]; wishlist: string[]; orders: Order[] }

const KEY = "ysp-store-v1";
const empty: State = { cart: [], wishlist: [], orders: [] };
let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(KEY); if (raw) state = { ...empty, ...JSON.parse(raw) }; } catch { /* ignore */ }
}
function set(next: Partial<State>) {
  state = { ...state, ...next };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export function useStore() {
  return useSyncExternalStore(
    (cb) => { load(); listeners.add(cb); cb(); return () => listeners.delete(cb); },
    () => { load(); return state; },
    () => empty,
  );
}

export const actions = {
  addToCart(item: CartItem) {
    const cart = [...state.cart];
    const i = cart.findIndex((c) => c.productId === item.productId && c.size === item.size && c.color === item.color);
    if (i >= 0) cart[i] = { ...cart[i]!, qty: cart[i]!.qty + item.qty }; else cart.push(item);
    set({ cart });
  },
  setQty(index: number, qty: number) {
    const cart = [...state.cart];
    if (qty <= 0) cart.splice(index, 1); else cart[index] = { ...cart[index]!, qty };
    set({ cart });
  },
  remove(index: number) { const cart = [...state.cart]; cart.splice(index, 1); set({ cart }); },
  toggleWish(id: string) {
    set({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter((w) => w !== id) : [...state.wishlist, id] });
  },
  placeOrder(o: Omit<Order, "id" | "createdAt" | "items" | "subtotal" | "total">) {
    const items = state.cart.map((c) => { const p = getProduct(c.productId)!; return { ...c, name: p.name, price: p.price, image: p.image }; });
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const id = `YSP-${Date.now().toString().slice(-7)}`;
    const order: Order = { ...o, id, createdAt: Date.now(), items, subtotal, total: subtotal + o.shipping };
    set({ orders: [order, ...state.orders], cart: [] });
    return order;
  },
};

export function cartTotals(cart: CartItem[]) {
  const subtotal = cart.reduce((s, c) => s + (getProduct(c.productId)?.price ?? 0) * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  return { subtotal, count, shipping, total: subtotal + shipping };
}

/** Simulated delivery: delivered 2 minutes after order. */
export const DELIVERY_MS = 2 * 60 * 1000;
export const STAGES = [
  { label: "Pesanan Dikonfirmasi", at: 0 },
  { label: "Paket Dikemas", at: 0.15 },
  { label: "Dalam Perjalanan", at: 0.35 },
  { label: "Kurir Mendekati Tujuan", at: 0.8 },
  { label: "Pesanan Diterima", at: 1 },
];
