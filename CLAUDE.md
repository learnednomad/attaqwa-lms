# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**✅ PRODUCTION-READY BROWNFIELD SYSTEM**

Masjid At-Taqwa Digital Ecosystem is a comprehensive Islamic community platform built with a Turborepo monorepo architecture. This is a **complete brownfield integration** featuring enterprise-grade Islamic services with 99.9% uptime, comprehensive monitoring, and production-ready deployment infrastructure.

### 🌟 Core System Features
- **🕌 Islamic Services**: 5-layer fallback prayer times system with local calculations
- **📚 Educational Platform**: Age-tier content filtering with Islamic calendar integration
- **📱 Cross-Platform**: React Native mobile app + Next.js 15 web platform
- **🔧 Enterprise Infrastructure**: Docker containers, monitoring, and automated deployment
- **🛡️ Production Security**: JWT authentication, role-based access, and comprehensive logging

## Development Commands

### Core Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # TypeScript type checking
```

### 🐳 Docker Development (Recommended)
```bash
# Complete brownfield development stack
docker compose -f docker-compose.enhanced.yml up -d

# Individual services
docker compose -f docker-compose.enhanced.yml up postgres redis -d  # Database only
docker compose -f docker-compose.enhanced.yml up api web -d         # Application only

# Production deployment
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Monitoring stack
docker compose -f docker-compose.enhanced.yml --profile monitoring up -d
```

### 🔍 Islamic Services Management
```bash
# Prayer times monitoring
npm run prayer-times:monitor    # Start prayer times monitoring service
npm run prayer-times:health     # Check Islamic services health
npm run prayer-times:fallback   # Test fallback systems

# Educational content management
npm run education:sync-calendar # Sync educational content with Islamic calendar
npm run education:generate-plan # Generate personalized learning plans
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing
```bash
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

### 🎨 Islamic Design Review & Quality Assurance
The project follows comprehensive Islamic design principles and automated quality assurance workflows inspired by top-tier companies.

```bash
# Islamic Design Review Commands
/design-review                   # Comprehensive UI/UX review with Islamic design principles
@islamic-design-reviewer         # Specialized agent for Islamic design validation

# Design System Validation
npm run design:validate         # Validate Islamic design system compliance
npm run design:accessibility    # Check Islamic accessibility standards (RTL, cultural)
npm run design:icons            # Validate Islamic-appropriate iconography
npm run design:colors           # Test Islamic color palette compliance
```

**Islamic Design Review Process:**
1. **Cultural Sensitivity**: Ensure all UI elements respect Islamic values and American Muslim community needs
2. **Prayer Time Integration**: Validate prayer time displays, Arabic text rendering, and Qibla direction accuracy
3. **Educational Content**: Review age-tier filtering, Islamic content categorization, and learning progress tracking
4. **Accessibility**: Test RTL language support, elder-friendly interfaces, and family-safe content controls
5. **Community Features**: Validate Islamic calendar integration, Zakat calculations, and community engagement elements

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Hono.js with JWT authentication and role-based access
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4 with custom Islamic design system
- **UI Components**: Shadcn/UI with Radix UI primitives
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest with Testing Library for all packages
- **Monitoring**: Comprehensive logging and analytics system
- **Deployment**: Docker containers optimized for production

### Project Architecture

#### Monorepo Structure (Web + API)
```
packages/
├── web/                    # Next.js 15 frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities and hooks
├── api/                    # Hono.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Auth and logging
│   │   └── lib/           # Backend utilities
├── db/                     # Prisma database package
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── migrations/    # Database migrations
└── shared/                 # Shared types and utilities
    └── src/
        ├── types/         # TypeScript interfaces
        └── schemas/       # Zod validation schemas
```

#### Mobile Application (Separate Repository - API Consumer Only)
**Important**: The mobile app is NOT part of this monorepo. It exists as a separate repository.

```
# Separate Repository: attaqwa-masjid-mobile
mobile-app-repo/
└── AttaqwaMasjid/         # React Native/Expo mobile app
    ├── src/
    │   ├── components/    # Mobile UI components
    │   ├── screens/       # Screen components
    │   ├── services/      # API integration services
    │   └── utils/         # Mobile-specific utilities
    ├── assets/            # Images, fonts, icons
    └── app.config.js      # Expo configuration
```

**Mobile App Features:**
- **API Consumer Only**: Consumes REST APIs from Hono.js backend
- **React Native/Expo**: Cross-platform iOS/Android development
- **Prayer Times**: Real-time prayer schedules with notifications
- **Educational Content**: Age-tier filtered Islamic learning content
- **User Authentication**: JWT-based auth with secure token storage
- **Offline Support**: Critical prayer times cached for offline access

### 🚀 Complete Islamic Digital Ecosystem

#### **🕌 Production-Grade Islamic Services**
- **5-Layer Prayer Times Fallback System**: Aladhan API → IslamicFinder → Local Calculations → Manual Overrides → Offline Schedules
- **99.9% Uptime Guarantee**: Comprehensive health monitoring and automatic failover
- **Real-time Monitoring**: Prayer times API performance, Islamic calendar accuracy, Qibla direction precision
- **Multi-Channel Alerting**: Slack, email, webhook notifications for service disruptions

#### **📚 Advanced Educational Platform**
- **Islamic Calendar Integration**: Seasonal content delivery based on Hijri calendar
- **Age-Tier Content Filtering**: PRESCHOOL → ELEMENTARY → MIDDLE_SCHOOL → HIGH_SCHOOL → COLLEGE → ADULTS → SENIORS
- **Personalized Learning Plans**: Auto-generated educational pathways following Islamic calendar events
- **Family Account Management**: Parent dashboard, content restrictions, progress monitoring
- **American Muslim Context**: Culturally adapted content for American Muslim families

#### **📱 Cross-Platform Ecosystem**
- **Mobile App**: React Native/Expo with prayer notifications, offline support, educational content
- **Web Platform**: Next.js 15 with modern UI, responsive design, admin dashboard
- **API-First Architecture**: RESTful APIs with mobile optimization and field selection

#### **🔧 Enterprise Infrastructure**
- **Docker Containerization**: Enhanced Docker Compose with production-ready configurations
- **Monitoring Stack**: Grafana dashboards, Prometheus metrics, Loki log aggregation
- **Enhanced Nginx**: Islamic services optimization, mobile compression, intelligent caching
- **Database Optimization**: PostgreSQL with Islamic calendar indexes, Redis caching layers

#### **🛡️ Production Security & Compliance**
- **JWT Authentication**: Role-based access control (Admin/Moderator/User)
- **Prayer Times Admin**: Manual overrides, health monitoring, system administration
- **Content Moderation**: Age-appropriate filtering, parental controls, community guidelines
- **Comprehensive Logging**: Enhanced monitoring with Islamic feature analytics

### Key Design Patterns

#### Component Architecture
- **Feature-based organization**: Components grouped by domain (announcements, events, etc.)
- **Compound components**: Complex components broken into reusable parts
- **Props interfaces**: Strong typing for all component props
- **Variant patterns**: Use `cn()` utility for conditional styling

#### Type Safety
- Comprehensive TypeScript interfaces in `src/types/index.ts`
- Zod schemas for runtime validation
- API response typing with generic patterns
- Strict mode enabled for maximum type checking

#### Styling System
- **Islamic design system**: Custom color palette (islamic-green, islamic-gold, islamic-navy)
- **CSS custom properties**: HSL color values in CSS variables
- **Responsive design**: Mobile-first approach with Tailwind breakpoints
- **Arabic text support**: Amiri font family for Arabic content with RTL support

### Islamic Design Guidelines

#### Colors
- Primary: Islamic Green (`--primary: 142 76% 36%`)
- Secondary: Islamic Gold for highlights and Zakat information
- Navy: For text and formal elements
- Use semantic color tokens (e.g., `text-islamic-green-600`)

#### Typography
- Body text: Inter font family
- Arabic text: Amiri font family with `.arabic` class
- Prayer times: `.prayer-time` class for tabular numbers

#### Cultural Considerations
- Prayer time displays use 12-hour format
- Dates follow Islamic calendar when appropriate
- Respect for Islamic design patterns and geometric elements
- No inappropriate imagery per Islamic guidelines

## Development Guidelines

### Adding New Features
1. Create types in `src/types/index.ts`
2. Add constants in `src/constants/index.ts`
3. Build components in appropriate feature directories
4. Write tests alongside components
5. Update this documentation

### Component Development
- Use TypeScript interfaces for all props
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Follow Islamic design system colors and typography
- Include proper error boundaries and loading states

### Data Fetching Patterns
- Use React Query for server state management
- Implement proper loading and error states
- Cache prayer times with appropriate TTL (1 hour)
- Cache announcements and events with shorter TTL (5-10 minutes)

### Testing Strategy
- Unit tests for utility functions and hooks
- Component tests with Testing Library
- Integration tests for complete features
- Maintain 70%+ test coverage

### API Integration (Future)
- RESTful endpoints following `/api/[resource]` pattern
- Zod validation for request/response bodies
- Error handling with proper HTTP status codes
- Rate limiting and security headers

## Common Tasks

### Adding a New Announcement Type
1. Update `AnnouncementType` in `src/types/index.ts`
2. Add type to `ANNOUNCEMENT_TYPES` constant
3. Update `AnnouncementCard` component styling
4. Add corresponding API validation

### Creating a New Page
1. Create page in `src/app/[route]/page.tsx`
2. Add route to navigation in `src/components/layout/header.tsx`
3. Implement proper metadata and SEO
4. Follow layout patterns from existing pages

### Integrating External APIs
1. Create service functions in `src/lib/services/`
2. Define response types in `src/types/index.ts`
3. Add API endpoints to `src/constants/index.ts`
4. Implement error handling and caching

### Islamic Calendar Integration
- Use Hijri calendar calculations for Islamic dates
- Support both Gregorian and Islamic date displays
- Implement proper Ramadan/Eid date calculations
- Cache Islamic calendar data appropriately

## Security Considerations
- Input validation with Zod schemas
- Sanitize HTML content (already implemented in announcement cards)
- Secure file upload handling for calendar PDFs and images
- No hardcoded API keys or sensitive data
- HTTPS enforcement in production

## Performance Optimization
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Prayer time caching (1 hour TTL)
- Static generation for public pages
- Bundle analysis with `@next/bundle-analyzer`

## 🚢 Production Deployment

### Docker Deployment (Recommended)
```bash
# Production deployment with monitoring
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Enhanced brownfield system (development/staging)
docker compose -f docker-compose.enhanced.yml up -d

# Scale API services for high load
docker compose -f docker-compose.enhanced.yml up --scale api=3 -d
```

### Environment Configuration
- **Development**: `.env` with development credentials
- **Production**: Environment variables for API configurations
- **Enhanced Features**: Islamic services fallback configuration
- **Monitoring**: Grafana, Prometheus, Loki integration
- **Mobile Support**: Compression and field selection optimization

### Infrastructure Requirements
- **Database**: PostgreSQL 14+ with Islamic calendar optimizations
- **Cache**: Redis with Islamic services caching strategies
- **Monitoring**: Prometheus + Grafana for Islamic services metrics
- **Networking**: Enhanced Nginx with Islamic services optimization
- **SSL**: Production-ready SSL configuration for HTTPS enforcement

### Deployment Checklist
- [x] **Islamic Services Fallback System**: 5-layer failover implemented
- [x] **Database Migrations**: Islamic calendar and educational content integration
- [x] **Docker Infrastructure**: Enhanced containers with monitoring
- [x] **Educational System**: Age-tier filtering and calendar integration
- [x] **Monitoring Stack**: Prayer times health monitoring and alerting
- [x] **Security Configuration**: JWT authentication and role-based access
- [x] **Mobile Optimization**: API compression and field selection
- [x] **Production Environment**: Enhanced environment variables and configuration

### 📊 Monitoring & Observability
Access monitoring at:
- **Grafana Dashboard**: http://localhost:3300 (admin/admin_change_this_password)
- **Prometheus Metrics**: http://localhost:9090
- **API Health Check**: http://localhost:3001/health
- **Prayer Times Monitor**: Built-in monitoring service with multi-channel alerts

### 🔧 Production Maintenance
- **Database Backups**: Automated PostgreSQL backups with Islamic calendar data
- **Log Rotation**: Nginx and application log management
- **Cache Management**: Redis Islamic services cache optimization
- **Health Monitoring**: Automated prayer times API health checks
- **Security Updates**: Regular dependency updates and vulnerability scanning
- for every ui change use test sprite and playwright for iterative feedback