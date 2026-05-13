# System Architecture Overview

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 PUBLIC WEBSITE                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Homepage                                            │  │
│  │  ├─ Hero Slides (from hero_slides table)           │  │
│  │  ├─ Features (from features table)                 │  │
│  │  ├─ Products (from products table)                 │  │
│  │  └─ Promotions (from promotions table)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                   ┌────────┴────────┐
                   ↓                 ↓
          ┌─────────────────┐  ┌──────────────────┐
          │  Auth Page      │  │  Admin Panel     │
          │  (/auth)        │  │  (/admin)        │
          │                 │  │                  │
          │ Sign Up         │  │ ✅ ADMIN ONLY   │
          │ Sign In         │  │                  │
          │ Password Reset  │  │ Features:        │
          └─────────────────┘  │ • Products CRUD │
                               │ • Categories    │
                               │ • Hero Slides   │
                               │ • Features      │
                               │ • Promotions    │
                               │ • Locations     │
                               │ • Jobs          │
                               │ • Settings      │
                               │ • Admin Access  │
                               └──────────────────┘
```

---

## 🔐 Authentication Flow

```
User (Browser)
    │
    ├─ Creates Account (Email + Password)
    │
    └─→ Supabase Auth Service
        │
        ├─ Validates Email & Password
        ├─ Creates auth.users record
        ├─ Sends confirmation email
        │
        └─→ Database Trigger Fires
            │
            ├─ Creates profiles record
            ├─ Assigns 'user' role in user_roles
            │
            └─→ User Profile Ready
                │
                ├─ Can access public site
                ├─ Cannot access admin panel
                │
                └─ Admin Grants 'admin' Role
                    │
                    ├─ INSERT INTO user_roles
                    │
                    └─→ User Can Now Access Admin Panel
```

---

## 🗄️ Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Authentication & Authorization               │  │
│  │                                                       │  │
│  │  ┌─────────────┐    ┌──────────────┐              │  │
│  │  │ auth.users  │←──→│   profiles   │              │  │
│  │  └─────────────┘    └──────────────┘              │  │
│  │        ↑                   ↑                        │  │
│  │        │                   │                        │  │
│  │        └───→ user_roles ←──┘ (admin/user)         │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Content Management Tables                    │  │
│  │          (Public Read, Admin Write)                   │  │
│  │                                                       │  │
│  │  ┌─────────────┐                                    │  │
│  │  │  products   │──→ references ──→ ┌──────────────┐│  │
│  │  └─────────────┘                   │  categories  ││  │
│  │                                    └──────────────┘│  │
│  │  ┌─────────────┐   ┌──────────┐   ┌────────────┐ │  │
│  │  │hero_slides  │   │ features │   │ promotions │ │  │
│  │  └─────────────┘   └──────────┘   └────────────┘ │  │
│  │                                                   │  │
│  │  ┌──────────────┐   ┌──────────┐                │  │
│  │  │  locations   │   │   jobs   │                │  │
│  │  └──────────────┘   └──────────┘                │  │
│  │                                                   │  │
│  │  ┌──────────────────────────────────────┐       │  │
│  │  │     site_settings (Admin Only)       │       │  │
│  │  │ • brand name & tagline               │       │  │
│  │  │ • contact info & social media        │       │  │
│  │  └──────────────────────────────────────┘       │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow (Admin Panel)

```
Admin User Logs In
    │
    └─→ useAuth Hook Checks:
        ├─ Is user authenticated?
        ├─ Does user have 'admin' role in user_roles?
        │
        ├─ YES → Allow Access to Admin Panel
        └─ NO → Show "Access Required" Message

Admin Performs Action
    │
    ├─ Edit Product
    ├─ Create Promotion
    ├─ Delete Location
    ├─ Grant Admin Access
    │
    └─→ CrudTable Component:
        │
        ├─ Validates Input
        ├─ Shows Loading State
        │
        └─→ Supabase Client:
            │
            ├─ Checks RLS Policies
            ├─ Validates Admin Role
            ├─ Updates Database
            │
            └─→ React Query:
                │
                ├─ Invalidates Cache
                ├─ Refetches Data
                ├─ Updates UI
                │
                └─→ Toast Notification
                    (Success/Error Message)
```

---

## 🔐 Row Level Security (RLS) Architecture

```
Public User (Unauthenticated)
    │
    └─→ Can READ:
        ├─ products
        ├─ categories
        ├─ hero_slides
        ├─ features
        ├─ promotions
        ├─ locations
        └─ jobs
        
    └─→ Cannot WRITE anything
    └─→ Cannot READ: site_settings, user_roles, profiles

Regular User (Authenticated)
    │
    └─→ Can READ:
        ├─ products, categories, etc. (same as public)
        ├─ Own profile
        └─ Own user roles
    
    └─→ Cannot WRITE content (not admin)
    └─→ Cannot WRITE site_settings
    └─→ Cannot WRITE user_roles

Admin User (Has 'admin' role)
    │
    └─→ Can READ: Everything
    
    └─→ Can WRITE:
        ├─ All content tables (products, hero_slides, etc.)
        ├─ site_settings
        ├─ user_roles (manage other admins)
        └─ profiles (other users)
```

---

## 📊 Component Hierarchy

```
App.tsx
  │
  ├─ AuthProvider (Wraps entire app)
  │   │
  │   ├─ BrowserRouter
  │   │   │
  │   │   ├─ Route: "/" → Index (public site)
  │   │   │   │
  │   │   │   ├─ Navbar
  │   │   │   ├─ Hero (from hero_slides)
  │   │   │   ├─ Features (from features)
  │   │   │   ├─ Products (from products)
  │   │   │   ├─ Promotions (from promotions)
  │   │   │   ├─ Locations (from locations)
  │   │   │   ├─ Careers (from jobs)
  │   │   │   └─ Footer
  │   │   │
  │   │   ├─ Route: "/auth" → Auth.tsx
  │   │   │   ├─ Sign In Tab
  │   │   │   └─ Sign Up Tab
  │   │   │
  │   │   └─ Route: "/admin" → Admin.tsx ✅ Protected
  │   │       │
  │   │       ├─ Sidebar Navigation
  │   │       │
  │   │       ├─ Section: Products → CrudTable
  │   │       ├─ Section: Categories → CrudTable
  │   │       ├─ Section: Hero Slides → CrudTable
  │   │       ├─ Section: Features → CrudTable
  │   │       ├─ Section: Promotions → CrudTable
  │   │       ├─ Section: Locations → CrudTable
  │   │       ├─ Section: Jobs → CrudTable
  │   │       ├─ Section: Admins → AdminAccessManager ✅ NEW
  │   │       └─ Section: Settings → SiteSettingsEditor
  │   │
  │   └─ Toaster (Sonner - Notifications)
  │
  └─ QueryClientProvider (React Query)
```

---

## 🔌 Integration Points

### Supabase Integration
```typescript
┌────────────────────────────────────┐
│  supabase/client.ts                │
│  createClient<Database>(...)       │
└────────────────────────────────────┘
         ↓
    Export: supabase
         ↓
    ├─→ src/hooks/useAuth.tsx
    │   └─ supabase.auth.onAuthStateChange()
    │   └─ supabase.from("user_roles").select()
    │
    ├─→ src/components/admin/CrudTable.tsx
    │   └─ supabase.from(table).select()
    │   └─ supabase.from(table).insert()
    │   └─ supabase.from(table).update()
    │   └─ supabase.from(table).delete()
    │
    ├─→ src/lib/queries.ts
    │   └─ useQuery hooks for all tables
    │
    └─→ src/pages/Admin.tsx
        └─ AdminAccessManager()
        └─ SiteSettingsEditor()
```

### React Query Integration
```typescript
QueryClient
  │
  ├─→ useQuery()
  │   ├─ Fetch data from Supabase
  │   ├─ Cache data locally
  │   ├─ Auto-refetch on stale
  │   └─ Handle loading/error states
  │
  ├─→ useMutation()
  │   ├─ Create/Update/Delete operations
  │   ├─ Invalidate cache on success
  │   └─ Handle errors
  │
  └─→ useQueryClient()
      └─ Manual cache invalidation
```

---

## 🚀 Deployment Architecture

```
GitHub Repo
    │
    ├─ Branch: master (main branch)
    ├─ Branch: fix-npm-vulnerabilities (feature branch)
    │
    └─→ Vercel Deployment
        │
        ├─ Build Step:
        │   ├─ npm install
        │   ├─ npm run build
        │   └─ dist/ folder created
        │
        ├─ Deploy Step:
        │   ├─ Upload dist/ to Vercel CDN
        │   ├─ Set environment variables
        │   └─ Assign domain
        │
        └─ Live Site:
            ├─ Frontend: Served from Vercel
            ├─ Backend: Supabase (PostgreSQL)
            └─ Auth: Supabase Auth

Environment Variables:
    VITE_SUPABASE_URL → Your Supabase URL
    VITE_SUPABASE_PUBLISHABLE_KEY → Anon key
```

---

## 📱 Responsive Design

```
Desktop (≥768px)
  │
  ├─ Sidebar Navigation (Left)
  │   └─ Fixed width: 256px
  │
  └─ Main Content (Right)
      └─ Full width - sidebar

Tablet (≥640px, <768px)
  │
  ├─ Hamburger Menu (Slide out)
  │
  └─ Full Width Content

Mobile (<640px)
  │
  ├─ Top Header with Menu Button
  │
  ├─ Horizontal Tabs for Navigation
  │
  └─ Full Width Content
```

---

## 🔄 Real-Time Updates

```
User 1 Updates Product
    │
    ├─→ Supabase Database Updated
    │
    └─→ React Query Cache Invalidated
        │
        └─→ All Users See Updated Data
```

Currently implemented via:
- ✅ React Query polling
- ✅ Manual cache invalidation
- ✅ Refetch on mutation success

Future enhancement:
- Optional: Real-time subscriptions via Supabase Realtime

---

## 🔄 State Management

```
Global State
  │
  ├─ AuthContext (useAuth hook)
  │   ├─ user: User | null
  │   ├─ session: Session | null
  │   ├─ isAdmin: boolean
  │   └─ loading: boolean
  │
  └─ React Query
      ├─ products cache
      ├─ categories cache
      ├─ hero_slides cache
      ├─ features cache
      ├─ promotions cache
      ├─ locations cache
      ├─ jobs cache
      └─ site_settings cache

Local State (Component Level)
  │
  ├─ useState() for form inputs
  ├─ useState() for UI state (modal open, etc.)
  └─ useState() for loading states
```

---

## ✨ Key Features Architecture

```
Feature: Admin Access Management
    │
    ├─ Frontend: AdminAccessManager Component
    │   ├─ Display current admin users
    │   ├─ Form to grant new admins
    │   └─ Revoke admin buttons
    │
    ├─ Backend: Supabase user_roles Table
    │   ├─ Grant: INSERT INTO user_roles
    │   ├─ Revoke: DELETE FROM user_roles
    │   └─ Query: SELECT FROM user_roles
    │
    └─ Security: RLS Policies
        ├─ Only admins can INSERT
        ├─ Only admins can DELETE
        └─ Only own roles or admins can SELECT

Feature: Content Management
    │
    ├─ Frontend: CrudTable Component (Generic)
    │   ├─ Displays data in table format
    │   ├─ Modal form for create/edit
    │   └─ Confirm dialog for delete
    │
    ├─ Backend: Content Tables (products, etc.)
    │   ├─ Query: SELECT (public)
    │   ├─ Mutate: INSERT/UPDATE/DELETE (admin only)
    │   └─ Real-time sync via React Query
    │
    └─ Security: RLS Policies
        ├─ Public READ
        └─ Admin WRITE
```

---

## 📈 Performance Considerations

```
Code Splitting
  └─ Admin component loaded on demand

Caching Strategy
  └─ React Query handles caching
  └─ Stale time: 5 minutes
  └─ Cache invalidation on mutations

Database Indexes
  ├─ category_id (products)
  ├─ featured (products, promotions)
  ├─ sort_order (all sortable tables)
  ├─ user_id (user_roles)
  └─ active (jobs)

Lazy Loading
  └─ Product images load on scroll
  └─ Admin data loaded only when section accessed
```

---

## 🛡️ Security Layers

```
Layer 1: Transport
  └─ HTTPS/TLS for all communications

Layer 2: Authentication
  └─ Supabase Auth (JWT tokens)
  └─ Session persistence with localStorage

Layer 3: Authorization
  └─ useAuth hook checks user role
  └─ Route protection for /admin

Layer 4: Database
  └─ Row Level Security (RLS) policies
  └─ Admin-only write access
  └─ User-scoped read access

Layer 5: Validation
  └─ Client-side form validation
  └─ Server-side RLS validation
```

---

## 📞 API Summary

### REST Operations (via Supabase Client)

| Operation | Method | Table | Requires |
|-----------|--------|-------|----------|
| List items | SELECT | any | Public or auth |
| Get item | SELECT | any | Public or auth |
| Create | INSERT | any | Admin (via RLS) |
| Update | UPDATE | any | Admin (via RLS) |
| Delete | DELETE | any | Admin (via RLS) |

### Authentication Operations

| Operation | Method | Notes |
|-----------|--------|-------|
| Sign up | signUp() | Creates auth user |
| Sign in | signInWithPassword() | JWT session |
| Sign out | signOut() | Clear session |
| Get session | getSession() | Current session |
| On auth change | onAuthStateChange() | Listen to changes |

---

**Last Updated**: May 13, 2026
**Architecture Version**: 1.0
**Status**: Production Ready ✅
