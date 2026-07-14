# Hallaqi Database

## Schema

All tables use UUID primary keys, `created_at` timestamps, and Row Level Security (RLS).

### Tables

#### `users` (profiles)
Linked to `auth.users` via `id` FK.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | = auth.users.id |
| email | TEXT | NOT NULL |
| display_name | TEXT | |
| photo_url | TEXT | Storage URL |
| phone | TEXT | |
| role | TEXT | user / barber / admin |
| is_verified | BOOLEAN | DEFAULT false |
| is_id_verified | BOOLEAN | DEFAULT false |
| bio, location, wilaya | TEXT | |
| theme | TEXT | DEFAULT 'hallaqi' |
| language | TEXT | ar / fr / en |
| followers, following | INT | DEFAULT 0 |
| stats | JSONB | Flexible stats |
| created_at, last_login_at | TIMESTAMPTZ | |

#### `barbers`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | auto-generate |
| user_id | UUID FK | → users |
| name, bio, email, phone | TEXT | |
| location, wilaya | TEXT | Algerian cities |
| is_active, is_verified, is_mobile | BOOLEAN | |
| uses_scissors, is_subscribed | BOOLEAN | |
| subscription_plan | TEXT | |
| years_of_experience | INT | |
| rating | DECIMAL(3,2) | 0-5 |
| review_count | INT | |
| followers, likes | INT | |
| tags | TEXT[] | Array of tags |
| services | JSONB[] | Service objects |
| working_hours | JSONB | Weekly schedule |
| portfolio | TEXT[] | Image URLs |
| created_at, updated_at | TIMESTAMPTZ | |

#### `bookings`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id, barber_id | UUID FK | |
| services | JSONB[] | Booked services |
| date, time | TEXT | Appointment |
| status | TEXT | pending/confirmed/completed/cancelled/no-show |
| total_price | INT | DZD |
| is_mobile_service | BOOLEAN | |
| payment_method | TEXT | |
| payment_status | TEXT | pending/paid/refunded/failed |
| reviewed, rating, review_text | | Review data |
| created_at, updated_at | TIMESTAMPTZ | |

#### `forum_posts`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| author_id | UUID FK | → users |
| author_name, author_avatar | TEXT | Denormalized |
| title, content | TEXT | |
| category | TEXT | general/tips/reviews/competitions |
| tags | TEXT[] | |
| likes, liked_by | INT / UUID[] | |
| views | INT | |
| is_pinned, is_announcement | BOOLEAN | |
| created_at, updated_at | TIMESTAMPTZ | |

#### `forum_comments`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| post_id | UUID FK | → forum_posts |
| author_id | UUID FK | → users |
| content | TEXT | |
| likes | INT | |
| parent_id | UUID | Self-referencing (replies) |
| created_at | TIMESTAMPTZ | |

#### `favorites`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id, barber_id | UUID FK | UNIQUE together |
| created_at | TIMESTAMPTZ | |

#### `notifications`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| title, message | TEXT | |
| type | TEXT | booking/message/forum/promo/system |
| read | BOOLEAN | |
| action_url, image | TEXT | |
| created_at | TIMESTAMPTZ | |

#### `reviews`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| booking_id, barber_id, user_id | UUID FK | |
| rating | INT | 1-5 |
| comment | TEXT | |
| images | TEXT[] | |
| created_at | TIMESTAMPTZ | |

#### `reports`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| reporter_id | UUID FK | |
| target_type | TEXT | barber/user/post/comment |
| target_id | UUID | |
| reason | TEXT | |
| status | TEXT | open/resolved/dismissed |
| created_at | TIMESTAMPTZ | |

## Indexes

- `users`: role, wilaya
- `barbers`: wilaya, rating DESC, tags (gin), is_active
- `bookings`: user_id, barber_id, status
- `forum_posts`: category, is_pinned DESC, author_id
- `forum_comments`: post_id, parent_id
- `favorites`: user_id (unique on user_id+barber_id)
- `notifications`: user_id, (user_id, read)
- `reviews`: barber_id

## RLS Policies

All tables have RLS enabled. Key policies:

- **Users**: Public read, own profile update
- **Barbers**: Public read, own update
- **Bookings**: Own only (read/write)
- **Forum**: Public read, own write
- **Favorites**: Own only
- **Notifications**: Own only

## Migrations

| File | Description |
|------|-------------|
| `001_initial_schema.sql` | Creates all tables, indexes, RLS policies |
| `002_seed_data.sql` | Seeds 4 sample barbers |

Run order: 001 first, then 002.

## Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| avatars | Yes | Profile photos |
| portfolio | Yes | Barber gallery |
| id-cards | No | ID verification |
| review-images | Yes | Review photos |
