# Quick Google Places API Setup

## 🚀 Get Your API Key in 5 Minutes

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Name: `EV Route Web`
4. Click **"Create"**

### Step 2: Enable Places API
1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Places API"**
3. Click **"Enable"**

### Step 3: Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"API Key"**
3. Copy the generated key

### Step 4: Add to Your Project
1. Create `.env.local` file:
   ```bash
   cp env.example .env.local
   ```

2. Add your API key:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

## ✅ Test It Works
1. Go to http://localhost:3000/dashboard/route
2. Type "San Francisco" in origin field
3. Should see real Google Places suggestions
4. No more mock data!

## 💰 Cost
- **Free**: $200/month credit (≈ 11,764 autocomplete sessions)
- **Light usage**: ~$5/month
- **Set up billing alerts** in Google Cloud Console

## 🔒 Security (Optional)
1. Click **"Restrict Key"** on your API key
2. **Application restrictions**: HTTP referrers
   - Add: `http://localhost:3000/*`
   - Add: `https://yourdomain.com/*`
3. **API restrictions**: Select only "Places API"

---

**That's it! Your autocomplete will now use real Google Places data instead of mock suggestions.** 🎉
