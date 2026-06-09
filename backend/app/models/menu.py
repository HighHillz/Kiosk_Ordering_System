"""Menu models for categories and items."""
from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database import Base


class Category(Base):
    """Menu category model."""
    
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(50), nullable=False)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)


class MenuItem(Base):
    """Menu item model."""
    
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    discount_percentage = Column(DECIMAL(5, 2), default=0)  # Discount 0-100%
    image_url = Column(String(255))
    is_available = Column(Boolean, default=True)
    dietary_tags = Column(JSON)  # ["veg", "gluten-free", etc.]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
