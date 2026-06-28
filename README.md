# Kiosk Ordering System

A modern, full-stack, containerized web-based Kiosk & Admin Dashboard system designed for scalability, performance, and customization.

![Version](https://img.shields.io/badge/Version-2.0.0-blue.svg)

## 🌟 Features

### Customer-Facing Kiosk
*   **Intuitive Ordering**: Interactive product grid with dynamic filtering by category.
*   **Discount & Pricing**: Real-time discount and coupon processing.
*   **Order Checkout**: Secure cart management and order submission.

### Admin Dashboard
*   **Product Management**: CRUD operations on menu items, discount percentages, status toggles, and image uploads.
*   **Branding & Customization**: Dynamic white-labeling system featuring custom logos, primary/secondary color configurations, custom fonts, and real-time live preview.
*   **Multi-Tenancy**: Supporting isolated databases/tenants for different restaurant locations.
*   **Order Auditing**: Monitoring active orders and processing workflows.

### Architecture & Backend
*   **FastAPI API**: High-performance backend in Python 3.12 with auto-generated Swagger documentation.
*   **Background Worker**: Decoupled task queue powered by Redis and a custom worker for order processing.
*   **Data Layer**: MySQL database with SQLAlchemy ORM and Redis-based caching.
*   **Nginx Gateway**: Acts as a reverse proxy for request routing and serving static assets.

## 🚀 How to Run

You can deploy the entire stack using Docker Compose or run components individually.

### Tech Stack & Requirements

*   **Docker** & **Docker Compose**
*   **Node.js 18+** & **npm** (for local frontend development)
*   **Python 3.12** (for local backend development)
*   **MySQL & Redis**

### Option 1: Docker Compose (Recommended)

To spin up the entire system (Backend, Admin Dashboard, MySQL, Redis, Nginx, Background Worker):

```bash
docker-compose up --build
```

### Option 2: Local Development

#### Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure credentials in `.env` (refer to `SETUP_FIX.md` / `backend/.env.example`).
3. Setup the database and tables:
   ```bash
   python3 create_tables.py
   python3 setup_db.py
   ```
4. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```
   *API will be available at http://localhost:8000 (Swagger Docs at http://localhost:8000/api/v1/docs)*

#### Admin Dashboard
1. Navigate to the dashboard directory:
   ```bash
   cd admin-dashboard
   ```
2. Install dependencies and start the React dev server:
   ```bash
   npm install
   npm run dev
   ```
   *Dashboard will be available at http://localhost:3001*

## 📁 Project Structure

*   `backend/` - FastAPI application, worker process, database models, and upload directories.
*   `admin-dashboard/` - React 19 + Vite + Material UI management portal.
*   `kiosk-frontend/` - Customer ordering interface.
*   `nginx/` - Reverse proxy configurations.
*   `docs/` - Technical guides and phase-by-phase logs.