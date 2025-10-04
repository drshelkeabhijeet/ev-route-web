# EV Route Web

A modern web application for electric vehicle route planning with charging station optimization.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Leaflet / React-Leaflet
- **API**: Axios
- **Backend**: n8n webhooks (shared with mobile app)

## Features

- 🔐 User authentication (login/signup)
- 🗺️ Interactive route planning with map
- ⚡ EV charging station integration
- 🔋 Battery level management
- 📍 Real-time location services
- 🚗 Vehicle management
- 📱 Responsive design

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

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://abhijeetshelke.app.n8n.cloud
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

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