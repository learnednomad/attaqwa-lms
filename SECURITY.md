# Security Guide - Masjid At-Taqwa LMS

This document describes the security measures implemented in this project and provides guidance for maintaining security.

## Table of Contents

1. [Security Improvements Summary](#security-improvements-summary)
2. [Authentication & Authorization](#authentication--authorization)
3. [Secrets Management](#secrets-management)
4. [API Security](#api-security)
5. [Client-Side Security](#client-side-security)
6. [Security Headers](#security-headers)
7. [Docker Security](#docker-security)
8. [Security Checklist](#security-checklist)
9. [Reporting Security Issues](#reporting-security-issues)

---

## Security Improvements Summary

| Category | Status | Description |
|----------|--------|-------------|
| Secrets in VCS | FIXED | Removed hardcoded secrets, updated .gitignore |
| JWT Token Storage | FIXED | Migrated from localStorage to httpOnly cookies |
| Hardcoded Credentials | FIXED | All secrets now use environment variables |
| Input Validation | FIXED | Added Zod schemas for API routes |
| XSS Protection | FIXED | Added sanitization utilities and CSP headers |
| Error Message Leakage | FIXED | Sanitized API error responses |
| Security Headers | FIXED | Configured CSP, HSTS, X-Frame-Options, etc. |
| Docker Secrets | FIXED | Removed hardcoded secrets from compose files |

---

## Authentication & Authorization

### JWT Token Security

Tokens are now stored in httpOnly cookies instead of localStorage:

```typescript
// apps/website/src/lib/auth-cookies.ts
export async function setAuthCookie(cookieName, token) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,        // Prevents JavaScript access
    secure: true,          // HTTPS only in production
    sameSite: 'strict',    // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
```

### JWT Validation

```typescript
// apps/website/src/middleware/auth.ts
const decoded = jwt.verify(token, JWT_SECRET, {
  algorithms: ['HS256'],  // Prevent algorithm confusion attacks
  maxAge: '7d',           // Automatic expiration check
});
```

### Best Practices

1. **Never store tokens in localStorage** - Use httpOnly cookies
2. **Always validate on server** - Don't trust client-side state
3. **Use role-based access** - Check user roles for protected routes
4. **Short expiration** - 7 days max, refresh as needed

---

## Secrets Management

### Environment Variables

All secrets MUST be provided via environment variables:

```bash
# Required for production
JWT_SECRET=<generate with: openssl rand -base64 32>
ADMIN_JWT_SECRET=<unique value>
APP_KEYS=<key1>,<key2>,<key3>,<key4>
API_TOKEN_SALT=<unique value>
ENCRYPTION_KEY=<unique value>
POSTGRES_PASSWORD=<strong password>
```

### Generate Secure Secrets

```bash
# Generate a secure random secret
openssl rand -base64 32

# Generate 4 APP_KEYS
for i in {1..4}; do openssl rand -base64 24; done | paste -sd,
```

### Files with Secrets (Never Commit)

- `.env`
- `.env.local`
- `apps/*/.env`
- `apps/*/.env.local`
- `codex.mcp.json` (Coolify token)

---

## API Security

### Input Validation

All API endpoints use Zod schemas:

```typescript
// apps/website/src/lib/schemas/announcement.ts
export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  content: z.string().min(1).max(10000).trim(),
  type: z.enum(['announcement', 'event', 'prayer', 'education']),
  priority: z.enum(['normal', 'medium', 'high']),
});
```

### Error Response Sanitization

API errors never expose internal details:

```typescript
// DO NOT: Expose stack traces
return { error: error.message, stack: error.stack };

// DO: Return generic messages
console.error('[API] Error:', error); // Log server-side
return { error: { status: 500, message: 'An error occurred. Please try again.' }};
```

### Rate Limiting

For production, implement Redis-based rate limiting:

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});
```

---

## Client-Side Security

### XSS Prevention

Use the sanitization utilities:

```typescript
import { sanitizeHtml, sanitizeText, sanitizeUrl } from '@/lib/sanitize';

// For rich text content
const safeHtml = sanitizeHtml(userContent);

// For plain text
const safeText = sanitizeText(userInput);

// For URLs
const safeUrl = sanitizeUrl(userUrl);
```

### No localStorage for Sensitive Data

```typescript
// NEVER DO THIS:
localStorage.setItem('token', jwt);
localStorage.setItem('userData', JSON.stringify(user));

// INSTEAD: Use cookies set by the server
fetch('/api/auth/login', { credentials: 'include' });
```

---

## Security Headers

Configured in `apps/website/next.config.ts`:

| Header | Purpose |
|--------|---------|
| Content-Security-Policy | Prevents XSS by controlling resource loading |
| Strict-Transport-Security | Forces HTTPS connections |
| X-Frame-Options | Prevents clickjacking |
| X-Content-Type-Options | Prevents MIME sniffing |
| Referrer-Policy | Controls information leakage |
| Permissions-Policy | Restricts browser features |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://api.aladhan.com;
frame-ancestors 'none';
```

---

## Docker Security

### No Hardcoded Secrets

Docker Compose files use environment variables:

```yaml
# docker-compose.yml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Required}
  JWT_SECRET: ${JWT_SECRET:?Required}
```

### Production Requirements

1. Use Docker secrets or external secret management
2. Enable database SSL: `DATABASE_SSL=true`
3. Run containers as non-root users
4. Limit network exposure

---

## Security Checklist

### Before Deployment

- [ ] All secrets rotated from defaults
- [ ] .env files not committed (check .gitignore)
- [ ] JWT_SECRET is unique and secure
- [ ] Database uses strong password
- [ ] SSL/TLS enabled for all connections
- [ ] Security headers verified (use securityheaders.com)

### Regular Maintenance

- [ ] Rotate secrets quarterly
- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Test authentication flows after changes
- [ ] Scan for vulnerabilities (npm audit)

### Code Review

- [ ] No hardcoded secrets
- [ ] All inputs validated with Zod
- [ ] Errors don't expose internal details
- [ ] User content is sanitized
- [ ] Authentication checked on protected routes

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Email security concerns directly to the maintainers
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work to address the issue promptly.

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-10/)
- [Next.js Security Guide](https://nextjs.org/docs/app/guides/authentication)
- [Strapi Security Best Practices](https://strapi.io/documentation/security)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

Last Updated: January 2026
