# EV Route Web

A modern web application for electric vehicle route planning with charging station optimization.

## Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Maps**: Google Maps JavaScript API
- **Authentication**: Supabase Auth
- **API**: n8n webhooks (route planning & charging stations)
- **Icons**: Lucide React

## Features

- 🔐 **Supabase Authentication** - Real user authentication with email/password
- 🗺️ **Google Maps Integration** - Interactive route planning with map
- ⚡ **EV Charging Stations** - Find and plan routes with charging stops
- 🔋 **Battery Management** - Track and optimize battery usage
- 📍 **Location Services** - Real-time GPS location with autocomplete
- 🚗 **Vehicle Management** - Manage multiple EV profiles
- 💾 **Session Caching** - Smart caching for charging station data
- 📱 **Responsive Design** - Modern, eco-conscious UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Setup Instructions:**

1. **Google Maps API**: See `GOOGLE_MAPS_SETUP.md` for detailed instructions
2. **Supabase Authentication**: See `SUPABASE_SETUP.md` for detailed instructions
3. **Restart your dev server** after adding environment variables

⚠️ **Note**: The application requires both Google Maps and Supabase credentials to function properly.

## Project Structure

```
ev-route-web/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   └── map/              # Map components
├── lib/                   # Utilities and helpers
│   ├── api/              # API client
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## API Endpoints

Using the same n8n backend as the mobile app:

- `/auth/login` - User authentication
- `/auth/signup` - User registration
- `/route/plan` - Route planning with charging stations
- `/stations/nearby` - Get nearby charging stations

## Development in Cursor

This project is optimized for development in Cursor IDE with:

- TypeScript for better autocomplete
- Tailwind CSS for inline style suggestions
- shadcn/ui components for rapid UI development
- Structured folders for easy navigation

## Related Projects

- [EVRouteSwiftUI](https://github.com/drshelkeabhijeet/EVRouteSwiftUI) - iOS mobile app

## License

MIT