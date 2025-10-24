# @attaqwa/api-client

Shared Strapi v5 API client for AttaqwaMasjid LMS web applications.

## Features

- **Authentication**: Login, register, JWT token management
- **CRUD Operations**: Generic get, post, put, delete methods
- **File Uploads**: Multi-part form data upload support
- **Query Builders**: Helper functions for Strapi queries (filters, populate, pagination, sort)
- **Error Handling**: Automatic 401 handling with redirect
- **TypeScript**: Fully typed with shared LMS types
- **Configurable**: Custom URLs, storage keys, unauthorized callbacks

## Usage

### Basic Usage (Default Instance)

```typescript
import { strapiClient } from '@attaqwa/api-client';

// Login
const { user, token } = await strapiClient.login('email@example.com', 'password');

// Fetch data
const { data: courses } = await strapiClient.get('/courses');

// Create data
const { data: newCourse } = await strapiClient.post('/courses', {
  data: { title: 'New Course', description: '...' }
});
```

### Custom Instance

```typescript
import { StrapiClient } from '@attaqwa/api-client';

const client = new StrapiClient({
  strapiUrl: 'https://api.attaqwa.com',
  apiUrl: 'https://api.attaqwa.com/api',
  storageKey: 'custom_token_key',
  onUnauthorized: () => {
    // Custom unauthorized handling
    router.push('/login');
  }
});
```

### Query Builders

```typescript
import { strapiClient, buildStrapiQuery } from '@attaqwa/api-client';

// Build complex queries
const query = buildStrapiQuery.combine(
  buildStrapiQuery.filters({ category: 'quran', isPublished: true }),
  buildStrapiQuery.populate(['instructor', 'lessons']),
  buildStrapiQuery.pagination({ page: 1, pageSize: 10 }),
  buildStrapiQuery.sort(['title:asc'])
);

const { data } = await strapiClient.get(`/courses?${query}`);
```

### File Upload

```typescript
const file = event.target.files[0];
const uploadedFile = await strapiClient.upload(
  file,
  '123', // refId
  'api::course.course', // ref
  'coverImage' // field
);
```

## API

### Authentication

- `login(identifier, password)` - Login user
- `register(username, email, password)` - Register new user
- `getMe()` - Get current authenticated user
- `setAuth(token)` - Manually set auth token
- `clearAuth()` - Clear auth token
- `isAuthenticated()` - Check if user is authenticated
- `getToken()` - Get current auth token

### CRUD Methods

- `get<T>(url, config?)` - GET request
- `post<T, D>(url, data?, config?)` - POST request
- `put<T, D>(url, data?, config?)` - PUT request
- `delete<T>(url, config?)` - DELETE request

### Utilities

- `upload(file, refId?, ref?, field?)` - Upload file
- `getMediaUrl(path)` - Get full media URL from relative path

## Environment Variables

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

## Dependencies

- `@attaqwa/shared-types` - Shared TypeScript types
- `axios` - HTTP client
