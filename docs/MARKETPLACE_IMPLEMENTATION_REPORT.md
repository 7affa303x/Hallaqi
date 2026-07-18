# Hallaqi Monetization & Platform Expansion — Implementation Report

Updated: 2026-07-18 (production-wiring pass)

## Navigation (final)

RTL right → left:

1. **الحجز** (`booking`)
2. **المنتدى** (`forum`)
3. **المساعد** central AI (`ai-hub`) — tap → AI Advisor · long-press → radial
4. **السوق** (`marketplace`)
5. **البروفايل** (`profile`)

## Checklist

| Area | Status |
|------|--------|
| Role separation + seller dashboards | ✅ |
| Wire `appUser.id` to seller flows | ✅ |
| `ensureMarketplaceSellerProfile` | ✅ |
| Seller profile edit (logo/cover/about/website) | ✅ |
| Product CRUD with listing cap (Supabase + local fallback) | ✅ |
| Placement / subscription requests (Supabase + local) | ✅ |
| Admin RPCs wired with fallback | ✅ |
| Premium/subscription boost in discovery ranking | ✅ |
| Loyalty gated off (`FEATURE_FLAGS.loyaltyEnabled = false`) | ✅ |
| Analytics local + remote fire-and-forget | ✅ |
| Deep links store/company/doctor/product | ✅ |
| No commissions / no in-app product checkout | ✅ |

## Remaining blocker (credentials)

- **Supabase MCP auth / real project env** required to apply migrations remotely.
- Local migrations ready:
  - `20260718120000_marketplace_platform.sql`
  - `20260718130000_marketplace_placement_requests.sql`
- `.env` currently has placeholder Supabase URL/key — client correctly treats as unconfigured and uses seed/localStorage.

## After credentials are available

1. Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
2. `supabase db push` (or apply the two marketplace migrations)
3. Re-generate types if desired
4. Optional: enable Gemini for live listing assist

## Intentionally NOT implemented

- Commissions, affiliates, in-app product checkout, unlimited premium, random daily discounts
- Loyalty UI hidden at launch (code retained behind flag)
