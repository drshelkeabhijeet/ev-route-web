# EV Route Web - Cursor Development Guide

## Project Overview
A modern web application for electric vehicle route planning, companion to the EVRouteSwiftUI iOS app.

## Tech Stack for Cursor Development

### Core Technologies
- **Next.js 14** with App Router
- **TypeScript** - for better autocomplete
- **Tailwind CSS** - for inline styling
- **shadcn/ui** - pre-built components
- **React-Leaflet** - for maps

### Why This Stack Works Great in Cursor
1. **TypeScript** provides excellent IntelliSense
2. **Tailwind** classes autocomplete inline
3. **shadcn/ui** components are copy-paste ready
4. Popular stack = better AI suggestions

## Project Structure

```
ev-route-web/
├── app/                    # Pages (App Router)
│   ├── (auth)/            # Auth group
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/         # Protected routes
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn components
│   ├── auth/              # Auth components
│   ├── dashboard/         # Dashboard components
│   └── map/               # Map components
├── lib/
│   ├── api/               # API client
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
└── public/                # Static assets
```

## Cursor Tips

### 1. Component Creation
When creating new components, use:
```tsx
// Use 'use client' for client components
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ComponentName() {
  // Component logic
}
```

### 2. API Integration
Use the same n8n endpoints as the mobile app:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
```

### 3. Type Safety
Define types for all API responses:
```typescript
// lib/types/index.ts
export interface User {
  id: string
  email: string
  name: string
}
```

### 4. Styling with Tailwind
Use Tailwind classes with shadcn components:
```tsx
<Button className="w-full bg-green-600 hover:bg-green-700">
  Plan Route
</Button>
```

## Development Workflow

### Starting Development
```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run lint    # Run linter
```

### Adding New Features
1. Create component in appropriate folder
2. Add types to `lib/types`
3. Use existing shadcn components
4. Connect to n8n endpoints

### Component Examples

#### Auth Form
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

#### Map Component
```tsx
'use client'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('@/components/map/Map'), { ssr: false })
```

## API Endpoints (n8n)

Same as mobile app:
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /route/plan` - Plan route with stations
- `GET /stations/nearby` - Get nearby stations

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://abhijeetshelke.app.n8n.cloud
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

## Best Practices for Cursor

1. **Use TypeScript** - Better autocomplete
2. **Small Components** - Easier to understand
3. **Custom Hooks** - Reusable logic
4. **Server Components** - When possible
5. **Client Components** - Only when needed

## Common Patterns

### Protected Routes
```tsx
// app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function Layout({ children }) {
  const session = await getSession()
  if (!session) redirect('/login')
  return <>{children}</>
}
```

### API Calls
```typescript
// lib/api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Other Platforms
- Netlify
- Railway
- Self-hosted with Docker

## Related Resources

- [Mobile App Repo](https://github.com/drshelkeabhijeet/EVRouteSwiftUI)
- [n8n Backend](https://abhijeetshelke.app.n8n.cloud)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Next.js Docs](https://nextjs.org/docs)

## Notes for Development

- Start with authentication flow
- Implement map view with Leaflet
- Use same route planning logic as mobile
- Keep UI consistent with mobile app
- Test on multiple screen sizes

Last updated: October 2025