# Hallaqi Deployment Guide

## Prerequisites

- Supabase account (free tier works)
- Vercel account (free tier works)
- Git repository

## Step 1: Supabase

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy **Project URL** and **Anon Key** from Settings → API

### 1.2 Run Migrations
1. Go to SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/migrations/002_seed_data.sql`
4. Run `supabase/storage/policies.sql`

### 1.3 Create Storage Buckets
1. Go to Storage
2. Create buckets: `avatars`, `portfolio`, `id-cards`, `review-images`
3. Set `avatars`, `portfolio`, `review-images` as public

### 1.4 Auth Settings
1. Go to Authentication → Settings
2. Enable Email provider
3. (Optional) Enable Google OAuth
4. Set Site URL to your production domain

## Step 2: Vercel

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

### 2.2 Environment Variables
Add these in Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2.3 Deploy
Click Deploy. The app will build and deploy automatically.

## Step 3: Verify

After deployment, verify:
- [ ] App loads without errors
- [ ] Supabase setup screen shows if env vars missing
- [ ] Authentication works (sign up / sign in)
- [ ] Barbers load from database
- [ ] Forum posts display
- [ ] Profile page loads
- [ ] No console errors

## Local Development

```bash
# 1. Clone repo
git clone <repo-url>
cd hallaqi

# 2. Install dependencies
npm install

# 3. Create .env
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run dev server
npm run dev
# Opens at http://localhost:3000

# 5. Run checks
npm run typecheck
npm run lint
npm run build
```

## Troubleshooting

### White screen after deploy
- Check browser console for errors
- Verify `VITE_SUPABASE_URL` is set correctly
- Check that `dist/` folder contains all assets

### Auth not working
- Verify Supabase Anon Key is correct
- Check that `auth.users` table has users
- Check `users` profile table has matching rows

### Images not loading
- Verify Storage buckets exist and are public
- Check bucket policies are applied

## Updating

After code changes:
1. Push to Git
2. Vercel auto-deploys
3. If database changes: run new migration in Supabase SQL Editor
