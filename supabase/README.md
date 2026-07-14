# Hallaqi Supabase Backend

Complete Supabase backend configuration for Hallaqi v11.

## Setup Order

1. Run migrations in order (001 → 002)
2. Create Storage buckets
3. Apply Storage policies
4. Deploy functions (if needed)

## Files

| File | Purpose |
|------|---------|
| `migrations/001_initial_schema.sql` | Database schema (tables, indexes, RLS) |
| `migrations/002_seed_data.sql` | Initial barber data |
| `storage/policies.sql` | Storage bucket policies |
| `functions/` | Edge functions (if needed) |

## Environment Variables (Frontend)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Storage Buckets Required

- `avatars` — User profile photos
- `portfolio` — Barber gallery images
- `id-cards` — ID verification documents
- `review-images` — Review photos
