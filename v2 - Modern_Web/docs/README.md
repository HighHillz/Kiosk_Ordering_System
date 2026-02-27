# Technical Documentation

Welcome to the technical documentation for the Kiosk Ordering System (V2). This directory contains detailed specifications and guides for developers and contributors.

## 🗂️ Available Documentation

### [API Reference](./api-reference.md)
Detailed specification of all REST API endpoints, including request/response formats and authentication requirements.

### [Quick Start Guide](./quickstart.md)
Comprehensive guide for setting up the development environment, both with and without Docker.

### [Development Roadmap]
- [Phase 1 Summary](./phase1-complete.md)
- [Phase 2 Summary](./phase2-complete.md)

## 🏗️ System Architecture

### Database Schema
The system uses a MySQL 8.0 database. For detailed entity-relationship diagrams, refer to the [database models](file:///home/annamalai/Annamalai/Coding/GitHub/Grade%2012%20-%20Restaurant%20Management%20DBS/v2/backend/app/models/).

### API Gateway (Nginx)
Managed via the `nginx/` directory, providing routing for:
- `/api/v1/` -> Backend FastAPI service
- `/` -> Kiosk Frontend
- `/admin/` -> Admin Dashboard

---
*For high-level project information, see the [V2 Root README](../README.md).*
