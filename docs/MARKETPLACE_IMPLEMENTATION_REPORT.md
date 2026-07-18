# Hallaqi Monetization & Platform Expansion — Implementation Report

Updated: 2026-07-18 (continuation pass)

## Navigation (final)

RTL right → left:

1. **الحجز** (`booking`)
2. **المنتدى** (`forum`)
3. **المساعد** central AI (`ai-hub`) — tap → AI Advisor · long-press → radial (AI / QR / Camera / Gallery)
4. **السوق** (`marketplace`)
5. **البروفايل** (`profile`)

Discover also links into Marketplace. My Bookings remains from Profile / barber studio.

## Checklist vs Brief

| Area | Status |
|------|--------|
| Role separation Client / Barber / Store / Company / Doctor / Admin | ✅ |
| Separate seller dashboards (no barber studio mix) | ✅ |
| Seller product CRUD + listing cap ≤ 99 | ✅ |
| Placement requests (featured / POTD / banner / sponsored / premium) | ✅ |
| Admin review of sellers + placements + POTD | ✅ |
| Marketplace categories (expandable) | ✅ |
| Filters (category, price, brand, store, company, wilaya, delivery, rating, popularity, newest, featured, premium, POTD) | ✅ |
| Featured / Premium / Banner / Sponsored visibility | ✅ |
| Product of the Day (paid placement, not random discount) | ✅ |
| Barber service extras surfaced separately (not forced physical products) | ✅ |
| Store / Company / Doctor pages + Visit Store CTA | ✅ |
| Deep links `/store` `/company` `/doctor` `/product` | ✅ |
| External website only (no in-app checkout / no commissions) | ✅ |
| Subscriptions Free / Basic / Professional / Business | ✅ |
| Doctor free verification request | ✅ |
| Analytics dashboards | ✅ |
| AI listing tools + `/api/ai/listing-assist` | ✅ |
| Central AI button tap / long-press radial | ✅ |
| Sitemap includes marketplace URLs | ✅ |

## Key files (this pass)

- `src/lib/marketplace/sellerInventory.ts`
- `src/lib/marketplace/barberExtras.ts`
- `src/pages/store/SellerProductsPage.tsx`
- `src/pages/store/SellerPlacementsPage.tsx`
- `supabase/migrations/20260718130000_marketplace_placement_requests.sql`

## Blockers

- **Supabase MCP auth** still required to apply migrations remotely.
- **Gemini / AI Gateway key** optional — listing assist falls back locally.

## Intentionally NOT implemented (per brief)

- Commissions
- Affiliates
- In-app product checkout
- Unlimited premium
- Daily random discounts
