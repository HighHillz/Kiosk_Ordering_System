# Quick Start Guide

This guide will help you set up and run the Kiosk Ordering System locally.

## Prerequisites

- **Docker** (v20+) & **Docker Compose** (v2+)
- **Python** 3.11+ (for local development without Docker)
- **Node.js** 18+ (for frontend development)
- **MySQL** 8.0 (if running without Docker)
- **Redis** (if running without Docker)

---

## Option 1: Run with Docker (Recommended)

This is the easiest way to get started. Docker will handle all dependencies.

### Step 1: Clone the Repository

```bash
cd /path/to/kiosk-ordering-system
```

### Step 2: Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update values if needed
# (For local development, defaults should work fine)
```

### Step 3: Start All Services

```bash
# Build and start all containers
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

This will start:
- MySQL database (port 3306)
- Redis cache (port 6379)
- Backend API (port 8000)
- Kiosk Frontend (port 3000)
- Admin Dashboard (port 3001)

### Step 4: Run Database Migrations

```bash
# Access the backend container
docker-compose exec backend bash

# Run migrations
alembic upgrade head

# Exit container
exit
```

### Step 5: Create Initial Data

```bash
# Create a tenant (restaurant)
curl -X POST http://localhost:8000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "slug": "test-restaurant"
  }'

# Create an admin user (use tenant_id from above response)
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "tenant_id": 1
  }'
```

### Step 6: Access the Applications

- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/api/v1/docs
- **Kiosk Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001

---

## Option 2: Run Locally (Without Docker)

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp ../.env.example .env
# Edit .env with your local MySQL and Redis credentials

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

Backend will run on http://localhost:8000

### Kiosk Frontend Setup

```bash
cd kiosk-frontend

# Install dependencies
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:8000" > .env.local

# Start development server
npm start
```

Kiosk will run on http://localhost:3000

### Admin Dashboard Setup

```bash
cd admin-dashboard

# Install dependencies
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:8000" > .env.local
echo "PORT=3001" >> .env.local

# Start development server
npm start
```

Admin will run on http://localhost:3001

---

## Database Migrations

### Create a New Migration

```bash
# Auto-generate migration based on model changes
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head
```

### Rollback Migration

```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision_id>
```

---

## Troubleshooting

### Port Already in Use

If you get port conflicts, stop other services or change ports in `docker-compose.yml`.

### Database Connection Error

Ensure MySQL is running and credentials in `.env` are correct.

### Redis Connection Error

Ensure Redis is running. Check `REDIS_HOST` and `REDIS_PORT` in `.env`.

### Frontend Can't Connect to Backend

Check that `REACT_APP_API_URL` in frontend `.env` matches your backend URL.

---

## Next Steps

1. **Add Menu Items**: Use the admin dashboard to add categories and menu items
2. **Test Ordering**: Use the kiosk frontend to place test orders
3. **Monitor Orders**: Use the admin dashboard to view and manage orders
4. **Customize Branding**: Update brand settings for your restaurant

---

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (full reset)
docker-compose down -v

# Rebuild a specific service
docker-compose up --build backend

# Access MySQL
docker-compose exec db mysql -u root -p

# Access Redis CLI
docker-compose exec redis redis-cli
```
