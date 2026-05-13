# Database Schema Reference

## 🗂️ Complete Database Structure

Your Supabase PostgreSQL database includes these tables and relationships:

---

## Authentication & Authorization

### `auth.users` (Supabase Built-in)
Core authentication table managed by Supabase Auth
```
- id (UUID, Primary Key)
- email (TEXT, UNIQUE)
- password_hash (TEXT)
- email_confirmed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- last_sign_in_at (TIMESTAMP)
```

### `public.profiles`
User profile information
```
- id (UUID, Primary Key) → References auth.users(id)
- display_name (TEXT)
- created_at (TIMESTAMP)

RLS Policy:
- SELECT: Own profile OR admin
- UPDATE: Own profile
- INSERT: Own profile
```

### `public.user_roles`
Role assignment table (admin/user)
```
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key) → References auth.users(id)
- role (ENUM: 'admin' | 'user')
- created_at (TIMESTAMP)

Constraints:
- UNIQUE(user_id, role) - Each user can have each role only once
- ON DELETE CASCADE - Delete role when user is deleted

RLS Policy:
- SELECT: Own roles OR admin
- ALL (Insert/Update/Delete): Admin only
```

---

## Content Management Tables

All content tables have:
- **Public READ access** (anyone can view)
- **Admin-only WRITE access** (only admins can create/edit/delete)

### `public.products` (Menu Items)
```
- id (UUID, Primary Key)
- name (TEXT, NOT NULL)
- description (TEXT)
- price (NUMERIC(10,2), DEFAULT 0)
- image_url (TEXT)
- category_id (UUID) → References categories(id)
- rating (NUMERIC(2,1), DEFAULT 4.5)
- badge (TEXT) - e.g., "Bestseller", "New"
- featured (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Indexes:
- category_id (for filtering by category)
- featured (for featured items)

Example:
{
  "id": "...",
  "name": "Margherita Pizza",
  "description": "Fresh basil, mozzarella, tomato sauce",
  "price": 12.99,
  "image_url": "https://...",
  "category_id": "...",
  "rating": 4.8,
  "badge": "Bestseller",
  "featured": true
}
```

### `public.categories` (Menu Sections)
```
- id (UUID, Primary Key)
- name (TEXT, NOT NULL)
- slug (TEXT, NOT NULL, UNIQUE) - URL-friendly name
- sort_order (INT, DEFAULT 0) - Display order
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Example:
{
  "id": "...",
  "name": "Pasta",
  "slug": "pasta",
  "sort_order": 2
}
```

### `public.hero_slides` (Homepage Banners)
```
- id (UUID, Primary Key)
- title (TEXT, NOT NULL)
- subtitle (TEXT)
- badge (TEXT)
- image_url (TEXT)
- location (TEXT) - e.g., "Downtown", "Mall"
- delivery_text (TEXT) - e.g., "Free delivery"
- sort_order (INT, DEFAULT 0) - Display order
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Example:
{
  "id": "...",
  "title": "Summer Special",
  "subtitle": "Enjoy our fresh summer menu",
  "badge": "Limited Time",
  "image_url": "https://...",
  "location": "Downtown",
  "delivery_text": "Free delivery",
  "sort_order": 1
}
```

### `public.features` (Feature Showcase)
```
- id (UUID, Primary Key)
- title (TEXT, NOT NULL)
- description (TEXT)
- icon (TEXT, NOT NULL) - Lucide icon name
- color (TEXT) - orange | green | blue | purple
- sort_order (INT, DEFAULT 0) - Display order
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Lucide Icon Examples:
- Truck (delivery)
- Shield (quality)
- Headphones (support)
- Clock (fast)
- Fire (hot)
- Heart (love)

Example:
{
  "id": "...",
  "title": "Fast Delivery",
  "description": "30 minutes or less",
  "icon": "Truck",
  "color": "orange",
  "sort_order": 1
}
```

### `public.promotions` (Special Offers)
```
- id (UUID, Primary Key)
- title (TEXT, NOT NULL)
- description (TEXT)
- discount (TEXT) - e.g., "-30%", "Buy 1 Get 1"
- image_url (TEXT)
- expires_at (TIMESTAMP)
- featured (BOOLEAN, DEFAULT false) - Deal of the day
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Example:
{
  "id": "...",
  "title": "Weekend Special",
  "description": "All pizza 30% off",
  "discount": "-30%",
  "image_url": "https://...",
  "expires_at": "2024-06-30T23:59:59Z",
  "featured": true
}
```

### `public.locations` (Store Locations)
```
- id (UUID, Primary Key)
- name (TEXT, NOT NULL)
- badge (TEXT) - e.g., "Main Store", "New Location"
- address (TEXT)
- phone (TEXT)
- hours (TEXT) - e.g., "Mon-Fri: 10am-10pm"
- map_url (TEXT) - Google Maps embed URL
- sort_order (INT, DEFAULT 0) - Display order
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Example:
{
  "id": "...",
  "name": "Downtown Location",
  "badge": "Main Store",
  "address": "123 Main St, New York, NY",
  "phone": "+1-555-0123",
  "hours": "Mon-Sun: 10am-10pm",
  "map_url": "https://maps.google.com/...",
  "sort_order": 1
}
```

### `public.jobs` (Job Listings)
```
- id (UUID, Primary Key)
- title (TEXT, NOT NULL)
- department (TEXT)
- location (TEXT)
- type (TEXT) - e.g., "Full-time", "Part-time"
- description (TEXT)
- active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Example:
{
  "id": "...",
  "title": "Pizza Chef",
  "department": "Kitchen",
  "location": "Downtown",
  "type": "Full-time",
  "description": "Experienced pizza chef needed...",
  "active": true
}
```

### `public.site_settings` (Global Configuration)
```
- key (TEXT, Primary Key)
- value (JSONB) - Flexible JSON storage
- created_at (TIMESTAMP, DEFAULT now())
- updated_at (TIMESTAMP, DEFAULT now())

Standard Keys:
- "brand" → { name, tagline }
- "contact" → { address, phone, email }
- "socials" → { facebook, instagram, twitter }

Example:
{
  "key": "brand",
  "value": {
    "name": "FoodStation",
    "tagline": "Your favorite food, delivered fast"
  }
}

{
  "key": "contact",
  "value": {
    "address": "123 Main St, New York, NY",
    "phone": "+1-555-0123",
    "email": "contact@foodstation.com"
  }
}

{
  "key": "socials",
  "value": {
    "facebook": "https://facebook.com/foodstation",
    "instagram": "https://instagram.com/foodstation",
    "twitter": "https://twitter.com/foodstation"
  }
}
```

---

## Relationships Diagram

```
auth.users
    ↓
    ├─→ profiles (1:1)
    │   - display_name
    │
    └─→ user_roles (1:N)
        - role: admin | user

user_roles (Admin users)
    ↓
    └─→ Can manage all content tables

Content Tables (Public Read, Admin Write)
    ├─ products
    │   └─→ categories (Foreign Key)
    │
    ├─ categories
    ├─ hero_slides
    ├─ features
    ├─ promotions
    ├─ locations
    ├─ jobs
    └─ site_settings
```

---

## Row Level Security (RLS) Policies

### Auth Tables
```sql
-- User can see own profile or admins can see all
ALTER TABLE profiles 
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_self_read" 
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR has_role(auth.uid(),'admin'));

-- User can only update own profile
CREATE POLICY "profiles_self_update"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- User can only create own profile
CREATE POLICY "profiles_self_insert"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
```

### Content Tables (General Pattern)
```sql
-- Anyone can read public content
CREATE POLICY "content_public_read"
  ON [table_name] FOR SELECT
  USING (true);

-- Only admins can write/edit/delete
CREATE POLICY "content_admin_write"
  ON [table_name] FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'))
  WITH CHECK (has_role(auth.uid(),'admin'));
```

### User Roles Table
```sql
-- Users can read own roles, admins can read all
CREATE POLICY "roles_select_own"
  ON user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(),'admin'));

-- Only admins can manage all roles
CREATE POLICY "roles_admin_all"
  ON user_roles FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'))
  WITH CHECK (has_role(auth.uid(),'admin'));
```

---

## Helper Functions

### `has_role(user_id, role)`
Checks if a user has a specific role
```sql
SELECT has_role(auth.uid(), 'admin') → returns boolean
```

### `touch_updated_at()`
Automatically updates the `updated_at` timestamp
Applied as a trigger on all content tables

---

## Database Constraints

### Unique Constraints
- `categories.slug` - Category URL slug must be unique
- `user_roles(user_id, role)` - User can have each role only once

### Foreign Keys
- `products.category_id` → `categories.id` (ON DELETE SET NULL)
- `user_roles.user_id` → `auth.users.id` (ON DELETE CASCADE)

### Check Constraints
- `products.price >= 0`
- `products.rating BETWEEN 0 AND 5`
- `site_settings.value` IS NOT NULL

---

## Data Types Reference

| Type | Description | Example |
|------|-------------|---------|
| UUID | Unique identifier | `550e8400-e29b-41d4-a716-446655440000` |
| TEXT | String text | `"Margherita Pizza"` |
| NUMERIC(10,2) | Decimal number | `12.99` |
| INTEGER | Whole number | `5`, `100` |
| BOOLEAN | True/false | `true`, `false` |
| TIMESTAMP | Date and time | `2024-06-30T14:30:00Z` |
| JSONB | JSON object | `{"name": "value"}` |
| ENUM | Predefined values | `'admin'`, `'user'` |

---

## Common Queries

### Get all admin users
```sql
SELECT u.email, ur.role
FROM user_roles ur
JOIN profiles p ON p.id = ur.user_id
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

### Get all products by category
```sql
SELECT p.* FROM products p
WHERE p.category_id = 'category-uuid'
ORDER BY p.sort_order ASC;
```

### Get featured content
```sql
SELECT * FROM products WHERE featured = true;
SELECT * FROM promotions WHERE featured = true;
```

### Get active job listings
```sql
SELECT * FROM jobs WHERE active = true
ORDER BY created_at DESC;
```

### Get site configuration
```sql
SELECT value FROM site_settings WHERE key = 'brand';
```

---

## Indexing Strategy

| Table | Indexed Columns | Reason |
|-------|-----------------|--------|
| products | category_id, featured | Quick filtering |
| user_roles | user_id, role | Fast role lookups |
| hero_slides | sort_order | Display order |
| features | sort_order | Display order |
| locations | sort_order | Display order |
| jobs | active, created_at | Filter active jobs |

---

## Maintenance Notes

- **Automatic Fields**: `created_at` and `updated_at` are set automatically
- **Cascading Deletes**: Deleting a user also deletes their roles
- **Unique Enforcement**: Category slugs and user-role pairs are unique
- **RLS Protection**: No one can bypass RLS policies via raw SQL

---

**Last Updated**: May 2026
**Database Version**: Supabase PostgreSQL 15+
