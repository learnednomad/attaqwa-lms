# @attaqwa/web

The frontend web application for the Masjid At-Taqwa Digital Ecosystem, built with Next.js 15, React 19, and TypeScript.

## 🚀 Features

- **Next.js 15**: Latest React framework with App Router and Turbopack
- **Islamic Design System**: Custom UI components with Islamic aesthetics
- **Prayer Times**: Real-time prayer time display with location detection
- **Admin Dashboard**: Complete content management system
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript integration with shared types
- **Authentication**: JWT-based auth with role-based access control

## 🎨 Islamic Design System

### Color Palette
```css
:root {
  --islamic-green: 142 76% 36%;    /* Primary brand color */
  --islamic-gold: 45 100% 51%;     /* Accent and highlights */
  --islamic-navy: 210 40% 25%;     /* Text and formal elements */
}
```

### Typography
- **Body Text**: Inter font family for readability
- **Arabic Text**: Amiri font family with proper RTL support
- **Prayer Times**: Tabular numbers for consistent alignment

### Components
- Islamic-themed UI components
- Prayer time widgets
- Event cards with Islamic styling
- Admin dashboard with Arabic support

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage
│   ├── admin/                   # Admin dashboard
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Admin overview
│   │   ├── announcements/      # Announcement management
│   │   ├── events/             # Event management
│   │   └── users/              # User management
│   └── globals.css             # Global styles and CSS variables
├── components/
│   ├── ui/                     # Base UI components (Shadcn/UI)
│   ├── features/               # Feature-specific components
│   │   ├── announcements/      # Announcement components
│   │   ├── events/             # Event components
│   │   ├── prayer-times/       # Prayer time widgets
│   │   └── auth/               # Authentication components
│   └── layout/                 # Layout components
│       ├── header.tsx          # Main navigation
│       ├── footer.tsx          # Site footer
│       └── sidebar.tsx         # Admin sidebar
├── lib/
│   ├── api.ts                  # API client with type safety
│   ├── utils.ts                # Utility functions
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useAnnouncements.ts # Announcement data fetching
│   │   └── usePrayerTimes.ts   # Prayer time hook
│   └── validations/            # Form validation schemas
├── types/
│   └── index.ts                # Component-specific types
└── constants/
    └── index.ts                # Application constants
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- API server running (packages/api)
- Environment variables configured

### Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Configure your API endpoints and feature flags
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

### Development Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🏗️ Architecture

### App Router Structure

The application uses Next.js 15 App Router with the following structure:

```
app/
├── layout.tsx                   # Root layout with providers
├── page.tsx                     # Homepage (/)
├── admin/                       # Admin routes (/admin)
│   ├── layout.tsx              # Admin-specific layout
│   ├── page.tsx                # Dashboard overview
│   ├── announcements/
│   │   ├── page.tsx            # Announcements list
│   │   ├── new/page.tsx        # Create announcement
│   │   └── [id]/
│   │       ├── page.tsx        # View announcement
│   │       └── edit/page.tsx   # Edit announcement
│   ├── events/                 # Event management
│   └── users/                  # User management
├── auth/                       # Authentication routes
│   ├── login/page.tsx
│   └── register/page.tsx
└── api/                        # API routes (if needed)
```

### State Management

The application uses React Query (TanStack Query) for server state management:

```typescript
// Example: useAnnouncements hook
export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Authentication

JWT-based authentication with context provider:

```typescript
// Usage in components
function ProtectedComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <AdminDashboard />;
}
```

## 🧩 Components

### UI Components (Shadcn/UI)

Base components built on Radix UI primitives:
- `Button` - Interactive buttons with variants
- `Card` - Content containers
- `Form` - Form components with validation
- `Dialog` - Modal dialogs
- `Table` - Data tables with sorting

### Feature Components

#### Prayer Time Widget
```typescript
<PrayerTimes 
  location={{ lat: 40.7128, lng: -74.0060 }}
  showNextPrayer={true}
  variant="compact"
/>
```

#### Announcement Card
```typescript
<AnnouncementCard
  announcement={announcement}
  onEdit={handleEdit}
  onDelete={handleDelete}
  variant="admin"
/>
```

#### Event Display
```typescript
<EventCard
  event={event}
  showRSVP={true}
  onRSVP={handleRSVP}
/>
```

### Form Handling

Forms use React Hook Form with Zod validation:

```typescript
const form = useForm<AnnouncementData>({
  resolver: zodResolver(announcementSchema),
  defaultValues: {
    title: '',
    content: '',
    type: 'GENERAL',
    priority: 'NORMAL'
  }
});

const onSubmit = async (data: AnnouncementData) => {
  try {
    await createAnnouncement(data);
    toast.success('Announcement created successfully');
  } catch (error) {
    toast.error('Failed to create announcement');
  }
};
```

## 🌐 API Integration

### Type-Safe API Client

The application uses a custom API client with full TypeScript support:

```typescript
// lib/api.ts
export const announcementApi = {
  getAll: (): Promise<Announcement[]> => 
    makeRequest('/api/announcements'),
  
  create: (data: CreateAnnouncementRequest): Promise<Announcement> =>
    makeRequest('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  update: (id: string, data: UpdateAnnouncementRequest): Promise<Announcement> =>
    makeRequest(`/api/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};
```

### Error Handling

Centralized error handling with user-friendly messages:

```typescript
async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }
    
    return response.json();
  } catch (error) {
    handleAPIError(error);
    throw error;
  }
}
```

## 🎨 Styling

### Tailwind CSS Configuration

Custom Tailwind configuration with Islamic design tokens:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'islamic-green': {
          50: 'hsl(142, 76%, 96%)',
          500: 'hsl(142, 76%, 36%)',
          900: 'hsl(142, 76%, 16%)'
        },
        'islamic-gold': {
          500: 'hsl(45, 100%, 51%)'
        }
      },
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
        'inter': ['Inter', 'sans-serif']
      }
    }
  }
};
```

### CSS Custom Properties

Global CSS variables for consistent theming:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 142 76% 36%;
  --primary-foreground: 210 40% 98%;
  --islamic-gold: 45 100% 51%;
}

.arabic {
  font-family: 'Amiri', serif;
  direction: rtl;
  text-align: right;
}

.prayer-time {
  font-variant-numeric: tabular-nums;
}
```

## 🧪 Testing

### Test Setup

Testing configuration with Jest and Testing Library:

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Component Testing

```typescript
// components/features/announcements/AnnouncementCard.test.tsx
import { render, screen } from '@testing-library/react';
import { AnnouncementCard } from './AnnouncementCard';

describe('AnnouncementCard', () => {
  const mockAnnouncement = {
    id: '1',
    title: 'Test Announcement',
    content: 'Test content',
    type: 'GENERAL' as const,
    priority: 'NORMAL' as const,
    isPublished: true,
    createdAt: new Date().toISOString(),
    author: { name: 'Admin' }
  };

  it('renders announcement information correctly', () => {
    render(<AnnouncementCard announcement={mockAnnouncement} />);
    
    expect(screen.getByText('Test Announcement')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('displays prayer time correctly', () => {
    render(<PrayerTimeWidget times={mockPrayerTimes} />);
    
    expect(screen.getByText('Fajr')).toBeInTheDocument();
    expect(screen.getByText('5:30 AM')).toBeInTheDocument();
  });
});
```

### Integration Testing

```typescript
// Test complete user flows
describe('Admin Dashboard', () => {
  it('allows admin to create and publish announcement', async () => {
    // Setup authenticated admin user
    const user = userEvent.setup();
    render(<AdminDashboard />);
    
    // Navigate to announcements
    await user.click(screen.getByText('Announcements'));
    
    // Create new announcement
    await user.click(screen.getByText('New Announcement'));
    await user.type(screen.getByLabelText('Title'), 'New Test Announcement');
    await user.type(screen.getByLabelText('Content'), 'Announcement content');
    
    // Submit form
    await user.click(screen.getByText('Publish'));
    
    // Verify success
    expect(screen.getByText('Announcement published successfully')).toBeInTheDocument();
  });
});
```

## 🔒 Security

### Authentication Protection

Protected routes and components:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Verify admin role
    const payload = verifyToken(token);
    if (payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

export const config = {
  matcher: ['/admin/:path*']
};
```

### Content Security

- HTML sanitization for announcements
- XSS protection
- CSRF protection with tokens
- Input validation on all forms

## 🚀 Performance

### Optimization Strategies

1. **Image Optimization**
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/mosque-image.jpg"
     alt="Masjid At-Taqwa"
     width={800}
     height={600}
     priority
   />
   ```

2. **Code Splitting**
   ```typescript
   const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
     loading: () => <DashboardSkeleton />
   });
   ```

3. **Data Caching**
   ```typescript
   // Cache prayer times for 1 hour
   const { data: prayerTimes } = useQuery({
     queryKey: ['prayer-times', location],
     queryFn: () => getPrayerTimes(location),
     staleTime: 60 * 60 * 1000,
     cacheTime: 60 * 60 * 1000
   });
   ```

### Bundle Analysis

```bash
npm run build
npm run analyze  # Opens bundle analyzer
```

## 🌍 Internationalization

### Arabic Text Support

The application supports Arabic text with proper RTL layout:

```typescript
// components/ui/Text.tsx
interface TextProps {
  children: React.ReactNode;
  variant?: 'arabic' | 'english';
  direction?: 'ltr' | 'rtl';
}

export function Text({ children, variant = 'english', direction }: TextProps) {
  const className = cn(
    'text-base',
    variant === 'arabic' && 'font-arabic text-right',
    direction === 'rtl' && 'dir-rtl'
  );
  
  return <span className={className}>{children}</span>;
}
```

### Islamic Features

- Prayer time displays in local timezone
- Islamic calendar integration
- Qibla direction indicator
- Arabic text rendering with proper fonts

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

Production environment setup:

```bash
# .env.production
NEXT_PUBLIC_APP_URL="https://attaqwa-masjid.vercel.app"
NEXT_PUBLIC_API_URL="https://api.attaqwa-masjid.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## 📊 Analytics

### Google Analytics Integration

```typescript
// lib/analytics.ts
export const gtag = {
  pageview: (url: string) => {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  },
  
  event: (action: string, category: string, label?: string, value?: number) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

### Islamic Feature Tracking

Track usage of Islamic features:

```typescript
// Track prayer time views
gtag.event('prayer_times_viewed', 'islamic_features', location);

// Track Qibla direction usage
gtag.event('qibla_direction_viewed', 'islamic_features');

// Track Islamic calendar usage
gtag.event('islamic_calendar_viewed', 'islamic_features', month);
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on contributing to this project.

### Component Development

When creating new components:

1. Use TypeScript interfaces for all props
2. Implement proper accessibility
3. Follow Islamic design system
4. Add tests for critical functionality
5. Document usage examples

### Islamic Considerations

- Ensure prayer time accuracy
- Test Arabic text rendering
- Validate Islamic calendar calculations
- Consider different Islamic schools of thought

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.