# Vercel Environment Variables Setup

## Issue: "Failed to fetch" Error on Deployed App

When deploying to Vercel, the app shows a "Failed to fetch" error because Supabase credentials are not reaching the client-side code.

## Root Cause

Your React app uses Vite, which reads environment variables with the `VITE_` prefix to expose them to the browser. The Supabase integration sets variables with `NEXT_PUBLIC_` prefix (for Next.js), which Vite doesn't recognize.

## Solution: Set Environment Variables on Vercel

### Step 1: Get Your Supabase Credentials
1. Go to your Supabase Dashboard
2. Navigate to **Project Settings → API**
3. Copy:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon Key** (public key for client-side operations)

### Step 2: Add to Vercel Project
1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add these variables (they'll be automatically prefixed with `VITE_` by Vite):

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = your-anon-key-here
```

Alternatively, if using `NEXT_PUBLIC_` convention:

```
VITE_NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
```

### Step 3: Redeploy
1. After adding environment variables, redeploy your project:
   ```bash
   git push origin fix-npm-vulnerabilities
   ```
2. Vercel will automatically rebuild and deploy with the new environment variables

## Local Development

To test locally with environment variables:

1. Create a `.env.local` file in your project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

## How This Works

- **Vite Development**: Uses `VITE_` prefixed variables from `.env.local`
- **Vercel Production**: Uses `VITE_` or `NEXT_PUBLIC_` variables from project settings
- **Client Code**: Accesses via `import.meta.env.VITE_*`

The updated client code now supports both naming conventions:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

## Verification

After setting up environment variables:

1. Check Vercel deployment logs for any build errors
2. Visit your app and check the browser console (F12) for error messages
3. Try signing up on the `/auth` page
4. Verify the "Failed to fetch" error is gone

## Security Notes

✅ Safe to use: `VITE_*` and `NEXT_PUBLIC_*` variables (public, client-side)
✅ Anon Key only: Use the public "Anon" key, never the service role secret
❌ Never commit: Don't add credentials to `.env.local` in git (it's git-ignored)

## Troubleshooting

**Error: "Missing VITE_SUPABASE_URL"**
- Check that environment variables are set on Vercel
- Verify spelling matches exactly: `VITE_SUPABASE_URL`
- Redeploy after adding variables

**Error: "Failed to fetch" on auth page**
- Ensure Supabase URL is correct (includes `.supabase.co`)
- Verify the Anon Key is from the correct Supabase project
- Check browser console (F12) for CORS or network errors

**Works locally but not on Vercel**
- Confirm environment variables are set on Vercel (not just local)
- Go to Vercel Settings → Environment Variables and verify all 2 variables are listed
- Redeploy the project after adding variables
