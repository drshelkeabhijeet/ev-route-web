# Authentication Setup Guide

This guide will help you set up authentication with Supabase and Google OAuth for your EV Route application.

## 🔐 Features

- ✅ Email/Password authentication
- ✅ Google OAuth (Sign in with Google)
- ✅ Protected routes
- ✅ Automatic redirects to landing page for unauthenticated users
- ✅ Session management

## 📋 Prerequisites

1. A Supabase account ([Sign up here](https://app.supabase.com))
2. A Google Cloud Platform account for OAuth ([Console](https://console.cloud.google.com))

## 🚀 Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: ev-route (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

### Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 3: Set up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: EV Route
   - User support email: Your email
   - Developer contact: Your email
6. For the OAuth client:
   - Application type: **Web application**
   - Name: EV Route
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT_URL/auth/v1/callback`
     - Example: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
7. Click **Create** and copy:
   - **Client ID**
   - **Client Secret**

### Step 4: Enable Google Provider in Supabase

1. In your Supabase project, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to expand
3. Enable the Google provider
4. Paste your Google OAuth credentials:
   - **Client ID** (from Step 3)
   - **Client Secret** (from Step 3)
5. Copy the **Redirect URL** shown (you already added this in Step 3)
6. Click **Save**

### Step 5: Configure Environment Variables

1. In your project root, copy the example env file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` with your actual credentials:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Google Maps API Key (optional, for maps feature)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. **Important**: Never commit `.env.local` to version control!

### Step 6: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)

# Start it again
npm run dev
```

## ✅ Testing Authentication

### Test Email/Password Authentication

1. Go to `http://localhost:3000`
2. Click **"Sign Up"**
3. Fill in your details:
   - Name
   - Email
   - Password (min 6 characters)
4. Click **"Create Account"**
5. Check your email for verification (if email confirmation is enabled)
6. You should be redirected to the dashboard

### Test Google OAuth

1. Go to `http://localhost:3000/login`
2. Click **"Continue with Google"**
3. Select your Google account
4. Grant permissions
5. You should be redirected back to the dashboard

## 🔒 How It Works

### Protected Routes

All routes under `/dashboard/*` are protected by the `ProtectedRoute` component:
- If not authenticated → redirects to landing page (`/`)
- If authenticated → shows dashboard content

### Authentication Flow

1. **Landing Page** (`/`): Shown to unauthenticated users
2. **Login** (`/login`): Email/password or Google OAuth
3. **Signup** (`/signup`): Create new account
4. **Dashboard** (`/dashboard/*`): Protected, requires authentication
5. **OAuth Callback** (`/auth/callback`): Handles Google OAuth redirects

### Session Management

- Sessions are automatically managed by Supabase
- Sessions persist across page refreshes
- Auto-refresh tokens when expired
- Logout clears session and redirects to home

## 🎯 User Experience Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User visits site (/)                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
      ┌──────────────┴───────────────┐
      │                              │
   Not Authenticated            Authenticated
      │                              │
      ▼                              ▼
┌──────────────┐            ┌─────────────────┐
│ Landing Page │            │   Redirect to   │
│              │            │    Dashboard    │
│ [Sign In]    │            └─────────────────┘
│ [Sign Up]    │
└──────┬───────┘
       │
       │ Click Sign In/Up
       │
       ▼
┌──────────────────┐
│  Login/Signup    │
│  Page            │
│                  │
│ • Email/Password │
│ • Google OAuth   │
└────────┬─────────┘
         │
         │ Authenticate
         │
         ▼
┌─────────────────┐
│   Dashboard     │
│   (Protected)   │
└─────────────────┘
```

## 🐛 Troubleshooting

### "Supabase is not configured" error

- Make sure `.env.local` exists and has correct values
- Restart your development server after creating/editing `.env.local`
- Check that environment variables start with `NEXT_PUBLIC_`

### Google OAuth not working

- Verify redirect URIs match exactly in:
  - Google Cloud Console
  - Supabase Provider settings
- Make sure Google provider is **enabled** in Supabase
- Check browser console for errors

### Email confirmation required

By default, Supabase requires email confirmation. To disable:
1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, toggle off **"Enable email confirmations"**
3. Click **Save**

### Can't access dashboard

- Clear browser cache and cookies
- Check browser console for errors
- Verify you're logged in (check Supabase dashboard → Authentication → Users)

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🔐 Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Rotate keys** regularly in production
3. **Enable email confirmation** for production
4. **Use strong passwords** for your Supabase project
5. **Enable RLS** (Row Level Security) in Supabase for your tables
6. **Monitor auth logs** in Supabase dashboard

## 🎉 You're All Set!

Your authentication system is now fully configured with:
- ✅ Email/password authentication
- ✅ Google OAuth
- ✅ Protected routes
- ✅ Automatic redirects

Enjoy building your EV Route application!

