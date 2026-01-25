# Kiosk Ordering System

## What is it?
A Full-stack web based Kiosk & Admin Dashboard. It handles customer ordering, menu management, and order tracking using industry-standard technologies.

## Stats

![Version](https://img.shields.io/badge/Version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/Status-Active_Development-orange.svg)

## File Structure
```bash
📂Kiosk Ordering System
├── backend/              # FastAPI backend
├── kiosk-frontend/       # Customer-facing React app
├── admin-dashboard/      # Admin portal React app
├── nginx/                # API Gateway config
└── docs/                 # Documentation
```

## Architecture

- **Backend**: FastAPI (Python 3.11+)
- **Kiosk Frontend**: React 18 + Material-UI
- **Admin Dashboard**: React 18 + Material-UI
- **Database**: MySQL 8.0
- **Cache & Queue**: Redis
- **API Gateway**: NGINX

## How to Run

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- MySQL 8.0
- Redis

### Local Development

```bash
# Start all services with Docker Compose
docker-compose up

# Or run individually:

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Kiosk Frontend
cd kiosk-frontend
npm install
npm start

# Admin Dashboard
cd admin-dashboard
npm install
npm start
```

## Project Structure

```
kiosk-ordering-system/
├── backend/              # FastAPI backend
├── kiosk-frontend/       # Customer-facing React app
├── admin-dashboard/      # Admin portal React app
├── nginx/                # API Gateway config
└── docs/                 # Documentation
```

## Documentation

See `/docs` folder for detailed documentation on:
- API Reference
- Deployment Guide
- Multi-tenancy Setup

## Inspiration
This initially started as my class 12 Computer Science project, where I and two of my other friends had a build something related to SQL and Python. It turned out well with good graphics, handling processed neatly and more. However, based on my visits to restaurants, I had found certain things which I thought adding it to this application might help a lot.
<br>
After submitting the project at school (v1.0.0), I soon started adding more features to this application that boosts its accuracy, performance and gives more value to users.