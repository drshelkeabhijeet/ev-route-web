# Quick Fix: Enable Google OAuth in Supabase

## Error Message
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This means Google OAuth is not enabled in your Supabase project.

## 🚀 Quick Setup (5 minutes)

### Step 1: Enable Google Provider in Supabase

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project (or create one if you don't have it)
3. Click **Authentication** in the left sidebar
4. Click **Providers** tab
5. Scroll down to find **Google**
6. Toggle the **Enable Google provider** switch to ON
7. For now, you can use these temporary settings:
   - **Skip for now** option (if available) OR
   - Use these development settings:
     - Client ID: `temp-client-id` (temporary)
     - Client Secret: `temp-secret` (temporary)
8. Click **Save**

### Step 2: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (the long string starting with `eyJ...`)

### Step 3: Add Credentials to Your Project

1. Create `.env.local` file in your project root:
   ```bash
   cd /Users/abhijeetshelke/ev-route-web
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-long-key-here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key_if_you_have_it
   ```

3. Restart your dev server:
   ```bash
   # Stop the server (Ctrl+C in the terminal)
   # Then start again
   npm run dev
   ```

### Step 4: Test It!

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. It should work now! 🎉

---

## 🔧 Proper Google OAuth Setup (Optional - For Production)

For a production-ready setup with real Google OAuth:

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: **External**
   - App name: **EV Route**
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth client:
   - Application type: **Web application**
   - Name: **EV Route**
   - Authorized redirect URIs: 
     - `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
     - Replace `YOUR-PROJECT` with your actual Supabase project URL
7. Copy the **Client ID** and **Client Secret**

### Step 2: Add Google Credentials to Supabase

1. Go back to Supabase → **Authentication** → **Providers** → **Google**
2. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
3. Copy the **Redirect URL** shown
4. Go back to Google Cloud Console
5. Add that redirect URL to **Authorized redirect URIs**
6. Save in both places

### Step 3: Test Again

1. Restart your dev server
2. Try signing in with Google
3. Should work perfectly! ✅

---

## 🐛 Troubleshooting

### "Supabase is not configured" error
- Make sure `.env.local` exists
- Check that values don't have quotes or spaces
- Restart dev server after creating/editing `.env.local`

### Google button does nothing
- Check browser console for errors (F12)
- Make sure Google provider is enabled in Supabase
- Verify Supabase URL and key are correct

### "Invalid redirect URI" error
- Make sure redirect URI in Google Cloud Console matches exactly
- Should be: `https://your-project.supabase.co/auth/v1/callback`
- Check for trailing slashes

---

## ✅ Quick Checklist

- [ ] Supabase project created
- [ ] Google provider enabled in Supabase
- [ ] `.env.local` file created
- [ ] Supabase URL added to `.env.local`
- [ ] Supabase anon key added to `.env.local`
- [ ] Dev server restarted
- [ ] Tested login at http://localhost:3000/login

Once all checked, Google OAuth should work! 🎉

---

## 📞 Need Help?

Check these files for more details:
- **AUTHENTICATION_SETUP.md** - Complete setup guide
- **env.example** - Environment variables template
- **AUTHENTICATION_SUMMARY.md** - Implementation overview

