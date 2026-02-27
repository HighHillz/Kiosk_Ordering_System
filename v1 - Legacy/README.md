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

## Installation
```bash
pip install -r requirements.txt
```

## Running the Original Application
1. **Database Setup**: Ensure your MySQL server is running and the `Restaurant` database is initialized.
2. **Main Application**: Run the UI script to start the desktop interface:
   ```bash
   python ui.py
   ```
3. **Legacy Scripts**: `script.py` contains the original logic and helper functions used during development.

---
*Legacy code preserved from Grade 12 Computer Science (2025).*
