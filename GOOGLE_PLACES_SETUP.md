# Google Places Autocomplete API Setup Guide

## 🎯 Overview

Your EV Route application now uses **Google Places Autocomplete API** instead of OpenStreetMap Nominatim for location suggestions. This provides:

- ✅ **Better accuracy** - Google's comprehensive place database
- ✅ **Global coverage** - Works worldwide, not just India
- ✅ **Real-time data** - Up-to-date place information
- ✅ **Structured results** - Better formatted addresses and coordinates
- ✅ **Professional quality** - Enterprise-grade geocoding service

## 🔧 Setup Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `EV Route Web`
4. Click **"Create"**

### Step 2: Enable Required APIs

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for and enable these APIs:
   - **Places API** (for autocomplete)
   - **Maps JavaScript API** (for the map display)
   - **Geocoding API** (for coordinate conversion)

### Step 3: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"API Key"**
3. Copy the generated API key
4. **Important**: Click **"Restrict Key"** to secure it

### Step 4: Configure API Key Restrictions

**Application restrictions:**
- Choose **"HTTP referrers (web sites)"**
- Add these referrers:
  - `http://localhost:3000/*` (for development)
  - `https://yourdomain.com/*` (for production)

**API restrictions:**
- Choose **"Restrict key"**
- Select only:
  - Places API
  - Maps JavaScript API
  - Geocoding API

### Step 5: Add API Key to Your Project

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```env
   # Google Maps API Key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   
   # Supabase Configuration (if you have it)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing the Integration

### Test 1: Check API Key
1. Go to http://localhost:3000/dashboard/route
2. Open browser console (F12)
3. Type in origin field: "San Francisco"
4. Look for console logs:
   ```
   Fetching suggestions for: San Francisco
   Google Places Response: {predictions: [...]}
   Processed results: 5
   ```

### Test 2: Verify Suggestions
- Type "San Francisco" → Should show San Francisco, CA, USA
- Type "Mumbai" → Should show Mumbai, Maharashtra, India
- Type "London" → Should show London, UK
- Type "Tokyo" → Should show Tokyo, Japan

### Test 3: Test Route Planning
1. Select origin from suggestions
2. Select destination from suggestions
3. Click "Plan Route"
4. Should work without validation errors

## 💰 Pricing Information

### Google Places API Pricing (2024)
- **Autocomplete (per session)**: $0.017
- **Place Details (per request)**: $0.017
- **Free tier**: $200/month credit (≈ 11,764 autocomplete sessions)

### Cost Estimation
- **Light usage** (100 routes/day): ~$5/month
- **Medium usage** (500 routes/day): ~$25/month
- **Heavy usage** (1000 routes/day): ~$50/month

### Cost Optimization Tips
1. **Set up billing alerts** in Google Cloud Console
2. **Use caching** for repeated searches
3. **Implement rate limiting** to prevent abuse
4. **Monitor usage** in Google Cloud Console

## 🔄 Fallback Behavior

If Google Places API is not configured or fails:

1. **No API Key**: Falls back to mock suggestions
2. **API Error**: Falls back to mock suggestions
3. **Network Error**: Falls back to mock suggestions
4. **Rate Limit**: Falls back to mock suggestions

Mock suggestions include:
- San Francisco, CA, USA
- Los Angeles, CA, USA
- New York, NY, USA
- London, UK
- Tokyo, Japan
- Mumbai, Maharashtra, India
- Delhi, India
- Bangalore, Karnataka, India

## 🐛 Troubleshooting

### Issue: "Google Maps API key not found"
**Solution**: Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.local`

### Issue: "Google Places API Error: REQUEST_DENIED"
**Solution**: 
1. Check API key is correct
2. Verify Places API is enabled
3. Check API key restrictions

### Issue: "Google Places API Error: OVER_QUERY_LIMIT"
**Solution**: 
1. Check billing is enabled
2. Verify API quotas
3. Check for excessive usage

### Issue: No suggestions appearing
**Solution**:
1. Check browser console for errors
2. Verify API key permissions
3. Test with simple queries like "New York"

### Issue: Suggestions not clickable
**Solution**: 
1. Check if coordinates are being fetched
2. Verify place details API is enabled
3. Check for JavaScript errors

## 📊 API Usage Monitoring

### Monitor in Google Cloud Console
1. Go to **"APIs & Services"** → **"Dashboard"**
2. View **"Quotas"** for each API
3. Check **"Metrics"** for usage patterns
4. Set up **"Alerts"** for high usage

### Console Logs to Watch
```
Fetching suggestions for: [query]
Google Places Response: {status: "OK", predictions: [...]}
Processed results: [number]
```

## 🚀 Production Deployment

### Environment Variables
```env
# Production .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_production_api_key
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
```

### Security Best Practices
1. **Restrict API key** to your domain only
2. **Use different keys** for development/production
3. **Monitor usage** regularly
4. **Set up billing alerts**
5. **Never commit** `.env.local` to version control

## ✅ Benefits of Google Places API

### Compared to Nominatim:
- ✅ **Better accuracy** - Google's superior place database
- ✅ **Global coverage** - Works worldwide, not just India
- ✅ **Real-time data** - Up-to-date place information
- ✅ **Structured results** - Better formatted addresses
- ✅ **Professional quality** - Enterprise-grade service
- ✅ **No CORS issues** - Works directly from browser
- ✅ **Rich metadata** - Place types, ratings, etc.

### User Experience Improvements:
- ✅ **Faster suggestions** - Optimized API responses
- ✅ **Better formatting** - Cleaner address display
- ✅ **More accurate** - Reduced "not found" errors
- ✅ **Global support** - Works for international users
- ✅ **Professional feel** - Enterprise-grade autocomplete

## 📚 Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com)
- [Places API Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [API Key Security Best Practices](https://developers.google.com/maps/api-security-best-practices)

---

**Your EV Route application now has professional-grade location autocomplete powered by Google Places API!** 🚀
