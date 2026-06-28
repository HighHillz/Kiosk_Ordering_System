# A2N Cafe

A desktop-based Restaurant Kiosk & Management system built using **Python**, **CustomTkinter**, and **MySQL**.

![Version](https://img.shields.io/badge/Version-1.3.1-blue)

## 🌟 Features

### Customer Portal
*   **Account Management**: Create accounts, securely log in, and toggle password visibility.
*   **Profile Settings**: View and update profile details (password, email, phone number) or delete the account permanently.
*   **Kiosk Menu Browser**: Browse restaurant menu items dynamically sorted by category with prices.
*   **Cart & Order System**: Add items with custom quantities, review/edit the cart, and view the total bill before confirming simulated payments.
*   **Order History**: View complete personal transaction records with dates, quantities, and totals.

### Admin Portal
*   **Menu Management**: Add new dishes, search/filter existing ones, edit details (category, type, name, price), or remove them entirely.
*   **Customer Directory**: Access a customer registry showing user details and registration timestamps.
*   **Transaction Auditing**: View the entire restaurant's sales/order log database or filter records by specific customer usernames.

## 🚀 How to Run

Follow these steps to configure and run the application locally:


### Tech Stack & Requirements

*   **Python 3.x**
*   **CustomTkinter** (Modern Tkinter widgets and themes)
*   **MySQL Database** (Used for persistence of accounts, menu, and sales logs)
*   **python-dotenv** & **mysql-connector-python**

All Python packages are listed in `requirements.txt`.

### 1. Database Configuration
Ensure you have a running MySQL Server instance. 

Create a `.env` file in this directory by copying `.env.example`:
```bash
cp .env.example .env
```
Open `.env` and fill in your MySQL connection details:
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
```

### 2. Install Dependencies
It is recommended to run the app inside a virtual environment.

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 3. Run the Application
Start the application using:
```bash
python ui.py
```

*Note: On first run, the system will automatically create the `Restaurant` database, set up the required tables (`food`, `logtable`, `accounts`), and seed the initial menu from `Restaurant Menu - Food Items.csv`.*

## Credits

This project was built as a grade 12 Computer Science school project by me and two of my friends:
- Naresh Kumar AP
- Ananth S Mugundan