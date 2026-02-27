from sqlalchemy import create_engine, text
from app.config import settings

# Setup DB connection
engine = create_engine(settings.DATABASE_URL)

with engine.connect() as connection:
    print("Deleting all order items...")
    connection.execute(text("DELETE FROM order_items"))
    print("Deleting all orders...")
    connection.execute(text("DELETE FROM orders"))
    connection.commit()
    print("Kitchen orders cleared successfully!")
