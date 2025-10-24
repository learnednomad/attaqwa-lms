# Docker Setup Guide - Attaqwa LMS

Complete Docker setup for running the entire Attaqwa LMS monorepo with PostgreSQL database.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0 or higher

## Quick Start

### Development Mode (Recommended for Development)

Start all services with hot-reload enabled:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will start:
- PostgreSQL database at `localhost:5432`
- Backend API at `http://localhost:1337`
- Admin Portal at `http://localhost:3000`
- Website at `http://localhost:3001`

### Production Mode

Build and start production containers:

```bash
docker-compose up --build
```

## Service Details

### PostgreSQL Database
- **Port**: 5432
- **Database**: attaqwa_lms
- **Username**: postgres
- **Password**: postgres
- **Persistent Storage**: Docker volume `postgres_data` or `postgres_data_dev`

### Backend API (Strapi)
- **Port**: 1337
- **Admin Panel**: http://localhost:1337/admin
- **API Endpoint**: http://localhost:1337/api
- **Database**: PostgreSQL (configured in docker-compose)

### Admin Portal (Next.js)
- **Port**: 3000
- **URL**: http://localhost:3000
- **API Connection**: http://localhost:1337

### Website (Next.js)
- **Port**: 3001
- **URL**: http://localhost:3001
- **API Connection**: http://localhost:1337

## Common Commands

### Start Services
```bash
# Development mode (with hot-reload)
docker-compose -f docker-compose.dev.yml up

# Production mode
docker-compose up

# Build and start (rebuild images)
docker-compose up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d
```

### Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose -f docker-compose.dev.yml down -v
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f admin
docker-compose -f docker-compose.dev.yml logs -f website
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.dev.yml restart

# Restart specific service
docker-compose -f docker-compose.dev.yml restart api
```

### Access Container Shell
```bash
# Backend API container
docker exec -it attaqwa-api-dev sh

# Admin Portal container
docker exec -it attaqwa-admin-dev sh

# PostgreSQL container
docker exec -it attaqwa-postgres-dev psql -U postgres -d attaqwa_lms
```

## First Time Setup

### 1. Start Development Environment
```bash
docker-compose -f docker-compose.dev.yml up
```

### 2. Create Strapi Admin Account
- Navigate to http://localhost:1337/admin
- Create your admin account
- Set up content types as needed

### 3. Access Applications
- Backend Admin: http://localhost:1337/admin
- Admin Portal: http://localhost:3000
- Website: http://localhost:3001

## Environment Variables

The Docker setup uses environment variables defined in `docker-compose.yml` and `docker-compose.dev.yml`.

To customize:
1. Create `.env.docker` file in project root
2. Override variables as needed
3. Update docker-compose files to use `.env.docker`

## Troubleshooting

### Port Already in Use
If ports are already in use, modify the port mappings in docker-compose files:
```yaml
ports:
  - "5433:5432"  # Change 5433 to any available port
```

### Database Connection Issues
1. Check if PostgreSQL is healthy:
```bash
docker-compose -f docker-compose.dev.yml ps
```

2. View PostgreSQL logs:
```bash
docker-compose -f docker-compose.dev.yml logs postgres
```

3. Verify database exists:
```bash
docker exec -it attaqwa-postgres-dev psql -U postgres -l
```

### Cannot Connect to API
1. Ensure all services are running:
```bash
docker-compose -f docker-compose.dev.yml ps
```

2. Check API logs:
```bash
docker-compose -f docker-compose.dev.yml logs api
```

3. Verify API health:
```bash
curl http://localhost:1337/_health
```

### Hot-Reload Not Working
Development mode uses volume mounts for hot-reload. Ensure Docker has file sharing permissions for the project directory.

### Clean Restart
If issues persist, try a clean restart:
```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.dev.yml down -v

# Remove all containers and images
docker system prune -a

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build
```

## Production Deployment

### Build Production Images
```bash
docker-compose build
```

### Run Production Stack
```bash
docker-compose up -d
```

### View Production Logs
```bash
docker-compose logs -f
```

## Data Persistence

### Development
- PostgreSQL data: `postgres_data_dev` volume
- API uploads: `api_uploads_dev` volume

### Production
- PostgreSQL data: `postgres_data` volume
- API uploads: `api_uploads` volume

### Backup Database
```bash
# Export database
docker exec attaqwa-postgres-dev pg_dump -U postgres attaqwa_lms > backup.sql

# Import database
docker exec -i attaqwa-postgres-dev psql -U postgres attaqwa_lms < backup.sql
```

## Migration from Local Setup

If you were using SQLite locally and want to migrate to Docker with PostgreSQL:

1. Export your Strapi data (if needed)
2. Start Docker environment
3. Strapi will automatically migrate schema to PostgreSQL
4. Re-import content if necessary

## Mobile App Connection

The mobile app can connect to the Docker API:

```bash
# Update mobile app API URL
EXPO_PUBLIC_API_URL=http://localhost:1337
```

For iOS Simulator:
```bash
EXPO_PUBLIC_API_URL=http://localhost:1337
```

For Android Emulator:
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:1337
```

For Physical Device (same network):
```bash
EXPO_PUBLIC_API_URL=http://YOUR_MACHINE_IP:1337
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Strapi Docker Guide](https://docs.strapi.io/dev-docs/installation/docker)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
