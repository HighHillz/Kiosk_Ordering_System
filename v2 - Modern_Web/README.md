# Kiosk Ordering System - Version 2 (Modern Web)

A modern, full-stack web-based Kiosk & Admin Dashboard system designed for scalability and performance. This version is fully containerized for easy deployment and development.

## 🚀 Quick Start (Docker)

The fastest way to get the system running is using Docker Compose.

```bash
docker-compose up --build
```
*This command will start the Backend, Kiosk Frontend, Admin Dashboard, MySQL, Redis, and Nginx.*

## 🏗️ Architecture
- **Backend**: FastAPI (Python 3.12)
- **Kiosk Frontend**: React 19 + Material UI
- **Admin Dashboard**: React 19 + Material UI
- **Infrastructure**: Nginx (Gateway), Redis (Cache), MySQL (DB)

## 📁 Project Structure
- `backend/`: FastAPI application and database models.
- `kiosk-frontend/`: Customer-facing ordering interface.
- `admin-dashboard/`: Management portal for menus, orders, and branding.
- `nginx/`: Configuration for routing and serving.
- `docs/`: Detailed technical documentation.

## 📚 Documentation
For detailed guides and references, explore the `docs/` directory:
- [API Reference](./docs/api-reference.md)
- [Quick Start Guide](./docs/quickstart.md)
- [Complete Phase 1 Log](./docs/phase1-complete.md)
- [Complete Phase 2 Log](./docs/phase2-complete.md)

---
*Modernized version of the Grade 12 Restaurant Management System.*
