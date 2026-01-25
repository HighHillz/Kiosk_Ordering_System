# Changelog

All notable changes to this project will be noted here.

---

# [2.0.0] - 25 Jan 2026
Second version of this application (a web application)
## Added
- Full-stack web architecture using FastAPI (Backend) and React (Frontend).
- Multi-tenant support allowing multiple restaurants to use the same system.
- Modern Admin Dashboard with Material-UI for menu management and branding.
- Real-time branding configuration (colors, logos, fonts).
- JWT-based authentication for secure admin access.
- Docker & Docker Compose support for easy deployment and local development.
- Redis integration for caching and queuing.
- NGINX configuration for API Gateway and service routing.
- Comprehensive technical documentation (API reference, setup guides, testing guides).

## Modified
- Migrated from a monolithic Python GUI application to a modern web-based microservices architecture.
- Reorganized project structure into `backend`, `kiosk-frontend`, and `admin-dashboard` directories.
- Standardized API endpoints and responses using REST principles.

## Removed
- Legacy Tkinter/Python GUI as the primary interface (moved to maintenance).
- Global dummy account for management (replaced by per-tenant users).

## Bug Fixes
- Standardized error handling across the application.
- Improved database connection reliability and scalability.
- Resolved various UI/UX inconsistencies from previous versions.



# [1.3.0] - 19 Jun 2025
## Added
- Phone and Email (Entered during account creation)
- Profile section (View account details and settings)
- Edit account details (Password, Phone, Email)
- Delete account
- Customer Book (Admin can view customer details except for their passwords)

## Modified
- Better colour schemes (Colours are less irritating and more logical)
- Logout moves into the profile section

## Bug Fixes
- Username displayed on the dashboard does not react to case insensitivity.



# [1.2.0] - 13 Jun 2025
## Added
- Customer login and dashboard
- Customers can view their purchase history
- Ability to navigate back to home page from login page
- Ability to manage multiple accounts (compared to previous version's dummy account)

## Modified
- Buttons are neatly placed
- Manage Restaurant is now Menu Management
- Window titles change based on current page
- Purchase UI on the same window
- Order page is accessible even if order list is empty
- Deleting items will not refresh the menu page

## Removed
- Order ID

## Bug Fixes
- Empty fields and invalid prices handled correctly when saving menu items
- Menu is now updated on admin and customer side after menu modification



# [1.1.0] - 17 May 2025
## Added
- Order ID: Generates an ID for each order, enabling unique identification of orders.



# [1.0.0] - 30 Jan 2025
First version of this application (a Python GUI application)
## Added
- Home Page
- Login Page
- Customer Order Page
- Admin Dashboard
- Menu Management
- Past Orders History
- Database Connectivity (via MySQL)