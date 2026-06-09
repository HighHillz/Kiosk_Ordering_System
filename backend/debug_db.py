from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import User, Order, OrderStatus
from app.config import settings

# Setup DB connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("--- USERS ---")
users = db.query(User).all()
for u in users:
    print(f"ID: {u.id}, Email: {u.email}, Tenant ID: {u.tenant_id}")

print("\n--- ORDERS ---")
orders = db.query(Order).all()
for o in orders:
    print(f"ID: {o.id}, Number: {o.order_number}, Status: {o.status}, Tenant ID: {o.tenant_id}")

db.close()
