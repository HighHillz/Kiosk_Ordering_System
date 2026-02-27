# Quick Setup - Database Login Fix

The login is failing because the database and tables haven't been created yet. Here's how to fix it:

## Option 1: Quick Automated Setup (Recommended)

Run these commands in a **new terminal**:

```bash
cd "/mnt/6658C60658C5D4C9/Annamalai/Coding/GitHub/Projects/Grade 12 - Restaurant Management DBS/Kiosk-Ordering-System/backend"

# Create the database
sudo mysql -e "CREATE DATABASE IF NOT EXISTS kiosk_db;"
sudo mysql -e "GRANT ALL PRIVILEGES ON kiosk_db.* TO 'root'@'localhost';"

# Create tables
python3 create_tables.py

# Create initial data (tenant, admin user, categories)
python3 setup_db.py
```

After this, you can login with:
- **Email**: `admin@test.com`
- **Password**: `admin123`

---

## Option 2: Manual MySQL Setup

If you know your MySQL root password is different:

```bash
# Replace 'YOUR_PASSWORD' with your actual MySQL root password
sudo mysql -u root -p

# Then in MySQL prompt:
CREATE DATABASE IF NOT EXISTS kiosk_db;
GRANT ALL PRIVILEGES ON kiosk_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Update backend/.env file with your MySQL password
nano backend/.env
# Change DATABASE_PASSWORD to your actual password

# Then create tables and data:
cd backend
python3 create_tables.py
python3 setup_db.py
```

---

## Verify Database Setup

```bash
sudo mysql -e "SHOW DATABASES;"
sudo mysql kiosk_db -e "SHOW TABLES;"
```

You should see these tables:
- tenants
- users
- categories
- menu_items
- orders
- order_items
- brand_config

---

## After Setup

1. Reload http://localhost:3001
2. Login with `admin@test.com` / `admin123`
3. Start adding products!
