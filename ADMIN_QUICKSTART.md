# Admin Panel - Quick Start (5 Minutes)

## 🚀 Getting Admin Access in 3 Steps

### Step 1️⃣ Create Your Account (1 min)
```
1. Open your app in browser
2. Click "Sign up" on the Auth page
3. Enter your email, password, and name
4. Done! You're registered
```

### Step 2️⃣ Get Your User ID (1 min)
```
1. Sign in with your credentials
2. Go to /admin in the browser
3. You'll see "Admin access required"
4. Copy the "User ID" shown (looks like: 550e8400-e29b-41d4-a716-446655440000)
```

### Step 3️⃣ Make Yourself an Admin (1 min)
Choose ONE option:

**Option A: Using Supabase Dashboard (Recommended)**
```
1. Go to https://app.supabase.com
2. Find your project
3. Click "SQL Editor" on the left
4. Paste this query:

INSERT INTO user_roles(user_id, role) 
VALUES ('YOUR_USER_ID_HERE', 'admin');

5. Replace YOUR_USER_ID_HERE with your ID from Step 2
6. Click "Run"
7. Go back to your app and refresh
8. You're now an ADMIN! 🎉
```

**Option B: Using Admin Panel** (after first admin)
```
1. Sign in as an existing admin
2. Go to Admin Panel → "Admin Access" tab
3. Paste another user's ID
4. Click "Grant Admin"
```

---

## 📊 What You Can Do Now

### ✅ Manage Menu
**Products Section**
- Add/edit menu items
- Set prices and descriptions
- Add product images
- Mark items as featured

**Categories Section**
- Organize products
- Create menu sections
- Control sort order

### ✅ Manage Homepage
**Hero Slides**
- Create eye-catching banners
- Upload background images
- Add promotional text

**Features**
- Highlight key benefits
- Show your unique selling points
- Customize colors

**Promotions**
- Create special offers
- Mark deals of the day
- Set expiration dates

### ✅ Manage Info
**Locations**
- Add restaurant locations
- Include address & phone
- Embed maps
- Display hours

**Jobs**
- Post job openings
- Manage applications pipeline
- Feature career opportunities

**Settings**
- Brand name and tagline
- Contact information
- Social media links

---

## 🔐 Default Admin Access

| Feature | Admin | User |
|---------|-------|------|
| View Site | ✅ | ✅ |
| View Admin Panel | ✅ | ❌ |
| Manage Products | ✅ | ❌ |
| Manage Categories | ✅ | ❌ |
| Manage Homepage | ✅ | ❌ |
| Grant Admin Access | ✅ | ❌ |
| Manage Site Settings | ✅ | ❌ |

---

## 🆘 Quick Troubleshooting

### ❌ "Admin access required" message appears
**Fix**: You forgot to grant yourself admin. Go back to Step 3 above.

### ❌ Can't find my User ID
**Fix**: Make sure you signed in. The ID appears on the access denied page.

### ❌ SQL query didn't work
**Fix**: 
- Make sure you copied the entire ID (all 36 characters)
- Try refreshing the page
- Check that Supabase is connected

### ❌ Still can't access admin panel
**Fix**: 
1. Sign out completely
2. Close your browser
3. Open again and sign in fresh
4. Try accessing /admin

---

## 📝 Database Tables Reference

Your Supabase database has these tables:

| Table | Purpose | Admin Edit |
|-------|---------|-----------|
| `products` | Menu items | ✅ |
| `categories` | Menu sections | ✅ |
| `hero_slides` | Homepage banners | ✅ |
| `features` | Features list | ✅ |
| `promotions` | Special offers | ✅ |
| `locations` | Store locations | ✅ |
| `jobs` | Job listings | ✅ |
| `site_settings` | Global config | ✅ |
| `user_roles` | Admin/User roles | ✅ |
| `profiles` | User info | 👤 |

---

## 🎯 What's Next?

After you get admin access:

1. **Add Your Menu**
   - Go to Admin → Products
   - Click "Add" to create items
   - Add at least 5-10 items

2. **Create Categories**
   - Go to Admin → Categories
   - Create: "Appetizers", "Mains", "Desserts"
   - Assign products to categories

3. **Setup Homepage**
   - Add hero slides (banners)
   - Add features (why choose us?)
   - Create promotions (special deals)

4. **Add Store Info**
   - Add your location(s)
   - Add contact details in Settings
   - Link to social media

5. **Deploy**
   - Your app is ready!
   - Share the public site URL
   - Keep admin URL private

---

## 💡 Pro Tips

1. **Use Lucide Icons** in Features section
   - "Truck" = fast delivery
   - "Shield" = quality assured
   - "Headphones" = customer support
   - See full list in Features section

2. **Featured Products** appear first
   - Check "Featured" for bestsellers
   - Update featured items weekly

3. **Sort Order** controls display
   - Lower numbers appear first
   - Works for categories, slides, features, locations

4. **Product Images** must be URLs
   - Use any image hosting (Imgur, Cloudinary, etc.)
   - Format: `https://example.com/image.jpg`

5. **Keep Site Settings Updated**
   - Update address when you move
   - Add new social media links
   - Keep phone number current

---

## 🔗 Important URLs

- **Public Site**: `/` (home page)
- **Auth Page**: `/auth` (sign in/up)
- **Admin Panel**: `/admin` (admin only)
- **Admin Access**: `/admin?section=admins` (manage admins)

---

## ✨ You're All Set!

Your admin panel is ready. Sign in and start managing your restaurant! 🍽️

For detailed documentation, see `ADMIN_SETUP.md`
