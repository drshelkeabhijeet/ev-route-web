# Google Maps Integration Setup

This application now uses Google Maps instead of Leaflet for displaying routes and charging stations.

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (required for map display)
   - **Places API** (required for location autocomplete)
   - **Geocoding API** (required for coordinate conversion)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Configure Environment Variables

1. Open `.env.local` file in the project root
2. Replace `your_google_maps_api_key_here` with your actual API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. API Key Security (Recommended)

For production, restrict your API key:

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions":
   - Choose "HTTP referrers (web sites)"
   - Add your domain (e.g., `localhost:3002/*`, `yourdomain.com/*`)
4. Under "API restrictions":
   - Choose "Restrict key"
   - Select only the APIs you need

## Features

### ✅ **Google Maps Integration**
- High-quality map tiles and satellite imagery
- Smooth zooming and panning
- Professional map styling

### ✅ **Route Display**
- Polyline rendering with directional arrows
- Automatic map bounds fitting to show entire route
- Start (S) and End (E) markers

### ✅ **Charging Station Markers**
- Green markers for regular stations
- Orange markers for recommended/selected stations
- Clickable markers with detailed information
- Info windows with station details and navigation

### ✅ **Map Focusing**
- Automatically fits map bounds to show the entire route
- Adds padding around the route for better visibility
- Smooth transitions when route changes

### ✅ **Error Handling**
- Graceful fallback when API key is missing
- Loading states while map initializes
- Error messages for configuration issues

## Troubleshooting

### Map Not Loading
- Check if your API key is correctly set in `.env.local`
- Verify the API key has the required permissions
- Check browser console for error messages

### Location Autocomplete Not Working
- Ensure Places API is enabled in Google Cloud Console
- Verify API key restrictions allow your domain

### Route Not Displaying
- Check if the route data contains a valid polyline
- Verify the polyline decoding is working correctly

## Development vs Production

### Development
- Use `localhost:3002/*` in API key restrictions
- Enable all required APIs without restrictions

### Production
- Restrict API key to your production domain
- Enable only necessary APIs
- Monitor API usage in Google Cloud Console

## Cost Considerations

Google Maps API has usage-based pricing:
- Maps JavaScript API: Free tier includes 28,000 map loads per month
- Places API: Free tier includes 1,000 requests per month
- Geocoding API: Free tier includes 40,000 requests per month

Monitor your usage in the Google Cloud Console to avoid unexpected charges.
