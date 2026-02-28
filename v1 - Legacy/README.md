# Kiosk Ordering System - Version 1 (Legacy)

> [!NOTE]
> **Time Capsule Manual**: This folder preserved the original Grade 12 Computer Science project exactly as it was. It serves as the baseline for the modernization seen in V2.

## Overview
This is the original desktop-based version of the Kiosk Ordering System, built with Python and Tkinter. It was designed to run locally with a MySQL backend.

## Original Features
- **Desktop GUI**: Built with Tkinter and CustomTkinter for a native feel.
- **Role-based Access**: Admin dashboard for menu management and Customer interface for ordering.
- **Data Persistence**: Local MySQL database connectivity.

## Prerequisites
- **Python**: 3.x
- **Database**: MySQL Server
- **Dependencies**: See `requirements.txt`

## 🚀 Installation & Setup

1. **Clone the environment**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in this directory based on `.env.example`:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

3. **Initialize Database**:
   The application will attempt to create the `Restaurant` database on first run, but ensure your MySQL service is active.

## 🖥️ Running the Application

Launch the main graphical interface:
```bash
python ui.py
```
3. **Legacy Scripts**: `script.py` contains the original logic and helper functions used during development.

---
*Legacy code preserved from Grade 12 Computer Science (2025).*
