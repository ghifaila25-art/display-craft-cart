<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store state (cart, wishlist, orders) lives in src/lib/store.ts persisted to localStorage; no backend yet, so keep it as the single source.
- Product catalog and brand name live in src/lib/products.ts so branding and items are edited in one place.
- Tracking uses a lazy client-only Leaflet component and a bundled road-snapped demo route; this prevents SSR DOM errors and keeps the simulated route available without a live routing service.
