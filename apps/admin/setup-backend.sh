#!/bin/bash

# AttaqwaMasjid LMS - Strapi Backend Setup Script
# This script automates the Strapi v5 backend installation and configuration

set -e  # Exit on any error

echo "🚀 AttaqwaMasjid LMS - Backend Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 20.x or later."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js version 20 or higher is required. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi
print_success "npm version: $(npm -v)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL client (psql) is not installed."
    print_info "You can install it with: brew install postgresql@14"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "PostgreSQL client: $(psql --version)"
fi

echo ""
print_info "All prerequisites met!"
echo ""

# Confirm installation
print_warning "This script will:"
echo "  1. Create a 'backend' directory"
echo "  2. Install Strapi v5"
echo "  3. Set up PostgreSQL database"
echo "  4. Generate secure secrets"
echo "  5. Create .env file"
echo ""
read -p "Continue with setup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Setup cancelled."
    exit 0
fi

echo ""
echo "=================================="
echo "Step 1: Creating Strapi Project"
echo "=================================="
echo ""

# Create Strapi project
if [ -d "backend" ]; then
    print_warning "Backend directory already exists."
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf backend
        print_success "Removed existing backend directory"
    else
        print_info "Setup cancelled."
        exit 0
    fi
fi

print_info "Creating Strapi project (this may take a few minutes)..."
npx create-strapi-app@latest backend --quickstart --no-run

if [ $? -eq 0 ]; then
    print_success "Strapi project created"
else
    print_error "Failed to create Strapi project"
    exit 1
fi

cd backend

echo ""
echo "=================================="
echo "Step 2: Installing PostgreSQL Driver"
echo "=================================="
echo ""

print_info "Installing pg (PostgreSQL client)..."
npm install pg

if [ $? -eq 0 ]; then
    print_success "PostgreSQL driver installed"
else
    print_error "Failed to install PostgreSQL driver"
    exit 1
fi

echo ""
echo "=================================="
echo "Step 3: Generating Secure Secrets"
echo "=================================="
echo ""

print_info "Generating cryptographically secure secrets..."

# Generate secrets using Node.js crypto
ADMIN_JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
API_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
TRANSFER_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

APP_KEY_1=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
APP_KEY_2=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
APP_KEY_3=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
APP_KEY_4=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")

APP_KEYS="${APP_KEY_1},${APP_KEY_2},${APP_KEY_3},${APP_KEY_4}"

print_success "Secrets generated successfully"

echo ""
echo "=================================="
echo "Step 4: Database Configuration"
echo "=================================="
echo ""

print_info "Please provide database credentials:"
read -p "Database name (default: attaqwa_lms): " DB_NAME
DB_NAME=${DB_NAME:-attaqwa_lms}

read -p "Database username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Database password: " DB_PASSWORD
echo ""

read -p "Database host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Test database connection
print_info "Testing database connection..."
if command -v psql &> /dev/null; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "\q" 2>/dev/null
    if [ $? -eq 0 ]; then
        print_success "Database connection successful"

        # Check if database exists
        DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

        if [ "$DB_EXISTS" = "1" ]; then
            print_warning "Database '$DB_NAME' already exists"
        else
            print_info "Creating database '$DB_NAME'..."
            PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME"
            if [ $? -eq 0 ]; then
                print_success "Database created successfully"
            else
                print_error "Failed to create database"
                exit 1
            fi
        fi
    else
        print_warning "Could not connect to database. Please ensure PostgreSQL is running and credentials are correct."
        print_info "You can create the database manually later."
    fi
else
    print_warning "psql command not found. Skipping database creation."
    print_info "Please create the database manually: CREATE DATABASE $DB_NAME;"
fi

echo ""
echo "=================================="
echo "Step 5: Creating .env File"
echo "=================================="
echo ""

print_info "Generating .env file..."

cat > .env << EOF
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=$APP_KEYS

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=$DB_HOST
DATABASE_PORT=$DB_PORT
DATABASE_NAME=$DB_NAME
DATABASE_USERNAME=$DB_USER
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_SSL=false

# Secrets
ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET
API_TOKEN_SALT=$API_TOKEN_SALT
JWT_SECRET=$JWT_SECRET
TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
EOF

if [ $? -eq 0 ]; then
    print_success ".env file created"
else
    print_error "Failed to create .env file"
    exit 1
fi

echo ""
echo "=================================="
echo "Step 6: Configuring Database"
echo "=================================="
echo ""

print_info "Creating database configuration..."

cat > config/database.ts << 'EOF'
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'attaqwa_lms'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
      },
    },
    debug: false,
  },
});
EOF

if [ $? -eq 0 ]; then
    print_success "Database configuration created"
else
    print_error "Failed to create database configuration"
    exit 1
fi

echo ""
echo "=================================="
echo "Step 7: Configuring Middlewares (CORS)"
echo "=================================="
echo ""

print_info "Configuring CORS for Next.js and Expo..."

cat > config/middlewares.ts << 'EOF'
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',  // Next.js dev
        'http://localhost:8081',  // Expo dev
        ({ env }) => env('FRONTEND_URL', 'http://localhost:3000'),
      ],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
EOF

if [ $? -eq 0 ]; then
    print_success "CORS configuration created"
else
    print_error "Failed to create CORS configuration"
    exit 1
fi

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""

print_success "Strapi backend is ready!"
echo ""
print_info "Next steps:"
echo "  1. cd backend"
echo "  2. npm run develop"
echo "  3. Open http://localhost:1337/admin"
echo "  4. Create your admin account"
echo "  5. Follow BACKEND_SETUP_GUIDE.md for content types setup"
echo ""
print_warning "Important files created:"
echo "  - backend/.env (contains secrets - DO NOT commit to git)"
echo "  - backend/config/database.ts"
echo "  - backend/config/middlewares.ts"
echo ""
print_info "For detailed setup instructions, see BACKEND_SETUP_GUIDE.md"
echo ""

# Return to project root
cd ..

print_success "Setup script completed successfully!"
