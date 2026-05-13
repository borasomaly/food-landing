# Admin Panel Setup Guide

## Overview

Your FoodStation application now has a complete admin authentication system with:

- **Supabase Authentication** for user signup/signin
- **Role-Based Access Control** with admin and user roles
- **Admin Panel** with full CRUD management for all content
- **Admin Access Manager** for granting/revoking admin privileges

## Database Structure

### Tables Created

1. **`user_roles`** - Stores user role assignments
   - Maps users to roles (admin/user)
   - Row Level Security (RLS) enabled
   - Only admins can manage roles

2. **`profiles`** - User profile information
   - Stores display name
   - Created automatically on signup

3. **Content Tables** (with admin-only write access):
   - `products` - Menu items
   - `categories` - Product categories
   - `hero_slides` - Homepage hero section
   - `features` - Feature showcase items
   - `promotions` - Special offers
   - `locations` - Restaurant locations
   - `jobs` - Job listings
   - `site_settings` - Global site configuration

## Creating Your First Admin Account

### Step 1: User Sign Up
1. Go to `/auth` page
2. Click "Sign up" tab
3. Enter email, password, and display name
4. Create account
5. Sign in with your credentials

### Step 2: View Your User ID
1. Navigate to `/admin`
2. You'll see an "Admin access required" message
3. Copy your **User ID** from the message (UUID format)

### Step 3: Grant Admin Access

**Option A: Using Supabase Dashboard** (Fastest)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open SQL Editor
3. Run this query:
```sql
INSERT INTO user_roles(user_id, role) 
VALUES ('[YOUR_USER_ID]', 'admin');
```
4. Replace `[YOUR_USER_ID]` with the UUID from Step 2
5. Execute and refresh the page

**Option B: Using Admin Panel** (After first admin exists)
1. Once you have one admin account, sign in
2. Go to `/admin` → **Admin Access** tab
3. Paste a new user's ID in the "Grant Admin Access" field
4. Click "Grant Admin"

## Accessing the Admin Panel

1. **Sign In**: Go to `/auth` and sign in with your admin account
2. **Navigate**: You'll be automatically redirected to `/admin`
3. **Manage Content**: Use the sidebar to access different sections

## Admin Panel Features

### Products
Manage your menu items with:
- Name, description, price
- Product images (via URL)
- Category assignment
- Ratings and featured badges

### Categories
Organize products into categories:
- Name and URL slug
- Custom sort order

### Hero Slides
Create engaging homepage sliders:
- Title and subtitle
- Background images
- Call-to-action text
- Sort order

### Features
Showcase business features:
- Feature title and description
- Lucide icon selection
- Custom colors (orange/green/blue/purple)
- Sort order

### Promotions
Manage special offers:
- Title, description, discount label
- Featured "deal of the day"
- Expiration dates
- Promo images

### Locations
Display restaurant locations:
- Name and address
- Phone and hours
- Embedded map URLs
- Location badges

### Jobs
Post job opportunities:
- Title, department, location
- Job description
- Job type and status

### Site Settings
Configure global settings:
- Brand name and tagline
- Contact information (address, phone, email)
- Social media links

### Admin Access ⭐ NEW
Manage admin users:
- Grant admin access to new users
- View current admin users
- Revoke admin privileges

## Authentication Flow

```
User Sign Up
    ↓
Create Profile (automatic)
    ↓
Sign In
    ↓
Check user_roles table
    ↓
├─ Has 'admin' role → Access Admin Panel
└─ No 'admin' role → Show "Access Required" message
```

## User Roles System

### Admin Role
- Access to all admin functions
- Can manage all content
- Can grant/revoke admin access to other users
- Can modify site settings

### User Role
- Basic user account
- Can't access admin panel
- Can use public site features

## Security Notes

✅ **Implemented Security**
- Row Level Security (RLS) on all tables
- Admin-only write policies on content tables
- Public read access for content
- User authentication via Supabase Auth
- Secure password hashing

⚠️ **Important**
- Keep your admin credentials secure
- Only grant admin access to trusted team members
- Regularly audit admin access in the Admin Access tab
- Use strong passwords (minimum 6 characters)

## Troubleshooting

### "Admin access required" Message
**Problem**: You created an account but don't have admin privileges

**Solution**: 
- Copy your User ID from the access denied message
- Use Supabase Dashboard SQL Editor to grant yourself admin role
- Or ask an existing admin to grant you access

### Can't Sign In
**Problem**: Wrong email or password

**Solution**:
- Make sure you signed up before attempting to sign in
- Check that Caps Lock is not on
- Use the "Sign up" tab if you haven't created an account yet

### User Not Found When Granting Admin Access
**Problem**: User ID doesn't exist or user hasn't logged in yet

**Solution**:
- Make sure the user has created an account
- User must log in at least once to create their profile
- Verify you're using the correct User ID (UUID format)

### Database Errors
**Problem**: "user_roles" table doesn't exist

**Solution**:
- Your Supabase project should have migrations applied automatically
- If not, manually run the migrations from `supabase/migrations/`
- Check that Supabase environment variables are set correctly

## API Integration

### Using the Admin API

All content management uses Supabase realtime:

```typescript
// Grant admin access
const { error } = await supabase
  .from('user_roles')
  .insert({ user_id: userId, role: 'admin' });

// Query products
const { data: products } = await supabase
  .from('products')
  .select('*');

// Update site settings
const { error } = await supabase
  .from('site_settings')
  .upsert({ key: 'brand', value: brandData });
```

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Create your first admin account
3. ✅ Add your restaurant menu (Products & Categories)
4. ✅ Set up homepage content (Hero, Features, Promotions)
5. ✅ Add locations and job listings
6. ✅ Configure site settings

## Support

For issues with:
- **Supabase**: Visit [Supabase Docs](https://supabase.com/docs)
- **Authentication**: Check [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- **This App**: Review the source code in `/src` directory

---

**Last Updated**: May 2026
